import { getSupabaseAdminClient, throwOnSupabaseError } from "../../infrastructure/supabase/supabaseClients.js";
import { badRequest, notFound } from "../../shared/errors.js";
import { notifyVendorWorkflowChanged } from "./vendorWorkflowEvents.js";

const clean = (value) => String(value ?? "").trim();
const requireText = (value, label) => {
  const result = clean(value);
  if (!result) throw badRequest(`${label} is required.`);
  return result;
};
const list = async (table, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient().from(table).select(columns).order("created_at", { ascending: false });
  throwOnSupabaseError(error, `list ${table}`);
  return data || [];
};

const update = async (table, id, payload) => {
  const { data, error } = await getSupabaseAdminClient().from(table).update(payload).eq("id", id).select("*").maybeSingle();
  throwOnSupabaseError(error, `update ${table}`);
  if (!data) throw notFound(table.replaceAll("_", " "));
  return data;
};

export const listAdminPartnerDocuments = () => list("partner_documents", "*,account:portal_accounts(id,role,display_name,email),media:media_assets(url,name,mime_type)");
export const reviewPartnerDocument = (id, input, adminId) => {
  const status = clean(input.status).toLowerCase();
  if (!new Set(["approved", "rejected", "expired"]).has(status)) throw badRequest("Invalid document review status.");
  const reviewNote = clean(input.reviewNote);
  if (status === "rejected" && !reviewNote) throw badRequest("A rejection reason is required.");
  return update("partner_documents", id, { status, review_note: reviewNote, reviewed_by: adminId, reviewed_at: new Date().toISOString() });
};

export const listAdminReceipts = () => list("portal_receipts", "*,account:portal_accounts(id,role,display_name,email),media:media_assets(url,name,mime_type)");
export const reviewReceipt = (id, input, adminId) => {
  const status = clean(input.status).toLowerCase();
  if (!new Set(["verified", "rejected"]).has(status)) throw badRequest("Invalid receipt review status.");
  return update("portal_receipts", id, { status, reviewed_by: adminId, reviewed_at: new Date().toISOString() });
};

export const listAdminCustomerRequests = () => list("customer_requests", "*,account:portal_accounts(id,display_name,email),attachment:media_assets!customer_requests_media_id_fkey(url,name),result:media_assets!customer_requests_fulfilled_media_id_fkey(url,name)");
export const reviewCustomerRequest = (id, input, adminId) => {
  const status = clean(input.status).toLowerCase();
  if (!new Set(["in_review", "approved", "rejected", "fulfilled", "closed"]).has(status)) throw badRequest("Invalid customer request status.");
  const reviewNote = clean(input.reviewNote);
  if (status === "rejected" && !reviewNote) throw badRequest("A rejection reason is required.");
  const payload = {
    status,
    review_note: reviewNote,
    reviewed_by: adminId,
    reviewed_at: new Date().toISOString(),
  };
  if (input.fulfilledMediaId !== undefined) payload.fulfilled_media_id = input.fulfilledMediaId || null;
  return update("customer_requests", id, payload);
};

export const listAdminSupportTickets = () => list("portal_support_tickets", "*,account:portal_accounts(id,role,display_name,email),messages:portal_support_messages(*,media:media_assets(url,name))");
export const replyAsAdmin = async (ticketId, input, adminId) => {
  const client = getSupabaseAdminClient();
  const { data: ticket, error: ticketError } = await client.from("portal_support_tickets").select("id").eq("id", ticketId).maybeSingle();
  throwOnSupabaseError(ticketError, "load support ticket");
  if (!ticket) throw notFound("Support ticket");
  const { data, error } = await client.from("portal_support_messages").insert({
    ticket_id: ticketId,
    sender_type: "admin",
    sender_id: adminId,
    message: requireText(input.message, "Message"),
  }).select("*").single();
  throwOnSupabaseError(error, "reply to support ticket");
  await client.from("portal_support_tickets").update({ status: clean(input.status) || "in_progress" }).eq("id", ticketId);
  return data;
};

const normalizeVendorIds = (input) => Array.isArray(input.vendorAccountIds)
  ? [...new Set(input.vendorAccountIds.map(clean).filter(Boolean))]
  : [];

const validateRfqVendors = async (vendorIds, companyCode) => {
  if (!vendorIds.length) throw badRequest("Select at least one vendor before publishing or assigning an RFQ.");
  const { data, error } = await getSupabaseAdminClient().from("portal_accounts")
    .select("id,role,status,mappings:portal_account_companies(company_code)")
    .in("id", vendorIds);
  throwOnSupabaseError(error, "validate RFQ vendors");
  const eligible = (data || []).filter((account) => account.role === "vendor"
    && account.status === "active"
    && (!companyCode || account.mappings?.some((mapping) => mapping.company_code === companyCode)));
  if (eligible.length !== vendorIds.length) throw badRequest("Select only active vendors mapped to the RFQ company.");
};

export const createRfq = async (input, adminId) => {
  const companyCode = clean(input.companyCode).toUpperCase() || null;
  if (companyCode && !new Set(["AGRPL", "AM", "AMRPL"]).has(companyCode)) throw badRequest("Invalid CIS company.");
  const vendorIds = normalizeVendorIds(input);
  await validateRfqVendors(vendorIds, companyCode);
  const { data, error } = await getSupabaseAdminClient().from("rfqs").insert({
    title: requireText(input.title, "RFQ title"),
    description: clean(input.description),
    product: clean(input.product),
    quantity: input.quantity === "" || input.quantity == null ? null : Number(input.quantity),
    unit: clean(input.unit),
    company_code: companyCode,
    response_due_at: input.responseDueAt || null,
    status: "published",
    created_by: adminId,
  }).select("*").single();
  throwOnSupabaseError(error, "create RFQ");
  try {
    await assignRfq(data.id, { vendorAccountIds: vendorIds });
  } catch (assignmentError) {
    const { error: cleanupError } = await getSupabaseAdminClient().from("rfqs").delete().eq("id", data.id);
    if (cleanupError) throw new Error(`RFQ ${data.rfq_reference} was created but vendor assignment failed. Review it in the RFQ register.`);
    throw assignmentError;
  }
  return data;
};

export const listAdminRfqs = () => list("rfqs", "*,assignments:rfq_assignments(*,vendor:portal_accounts(id,display_name,email),quotation:vendor_quotations(*))");
export const assignRfq = async (rfqId, input) => {
  const vendorIds = normalizeVendorIds(input);
  const { data: rfq, error: rfqError } = await getSupabaseAdminClient().from("rfqs")
    .select("id,company_code,status").eq("id", rfqId).maybeSingle();
  throwOnSupabaseError(rfqError, "load RFQ");
  if (!rfq) throw notFound("RFQ");
  if (rfq.status !== "published") throw badRequest("Only published RFQs can be assigned to vendors.");
  await validateRfqVendors(vendorIds, rfq.company_code);
  const rows = vendorIds.map((vendorId) => ({ rfq_id: rfqId, vendor_account_id: vendorId }));
  const { data, error } = await getSupabaseAdminClient().from("rfq_assignments").upsert(rows, { onConflict: "rfq_id,vendor_account_id" }).select("*");
  throwOnSupabaseError(error, "assign RFQ");
  for (const assignment of data || []) notifyVendorWorkflowChanged(assignment.vendor_account_id);
  return data || [];
};

export const listAdminQuotations = () => list("vendor_quotations", "*,assignment:rfq_assignments(rfq:rfqs(*),vendor:portal_accounts(id,display_name,email)),media:media_assets(url,name)");
export const reviewQuotation = async (id, input) => {
  const status = clean(input.status).toLowerCase();
  if (!new Set(["under_review", "accepted", "rejected"]).has(status)) throw badRequest("Invalid quotation status.");
  const quotation = await update("vendor_quotations", id, { status });
  const { data: assignment, error } = await getSupabaseAdminClient().from("rfq_assignments")
    .update({ status: status === "accepted" ? "awarded" : status === "rejected" ? "not_awarded" : "responded" })
    .eq("id", quotation.rfq_assignment_id).select("vendor_account_id").single();
  throwOnSupabaseError(error, "update RFQ assignment status");
  notifyVendorWorkflowChanged(assignment.vendor_account_id);
  return quotation;
};

export const upsertVendorPerformance = async (input, adminId) => {
  const vendorAccountId = requireText(input.vendorAccountId, "Vendor account");
  const score = (value) => value === "" || value == null ? null : Number(value);
  const { data, error } = await getSupabaseAdminClient().from("vendor_performance_snapshots").upsert({
    vendor_account_id: vendorAccountId,
    period_label: requireText(input.periodLabel, "Period"),
    quality_score: score(input.qualityScore),
    on_time_delivery_score: score(input.onTimeDeliveryScore),
    response_score: score(input.responseScore),
    overall_score: score(input.overallScore),
    notes: clean(input.notes),
    created_by: adminId,
  }, { onConflict: "vendor_account_id,period_label" }).select("*").single();
  throwOnSupabaseError(error, "save vendor performance");
  return data;
};
