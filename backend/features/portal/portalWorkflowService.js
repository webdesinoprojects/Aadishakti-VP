import { getSupabaseAdminClient, throwOnSupabaseError } from "../../infrastructure/supabase/supabaseClients.js";
import { badRequest, notFound } from "../../shared/errors.js";
import { uploadMediaBuffer } from "../media/mediaService.js";

const clean = (value) => String(value ?? "").trim();
const requireText = (value, label) => {
  const result = clean(value);
  if (!result) throw badRequest(`${label} is required.`);
  return result;
};
const numeric = (value, label, { required = false } = {}) => {
  if (value === undefined || value === null || value === "") {
    if (required) throw badRequest(`${label} is required.`);
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) throw badRequest(`${label} must be a valid non-negative number.`);
  return parsed;
};

const listOwned = async (table, accountId, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient().from(table).select(columns).eq("portal_account_id", accountId).order("created_at", { ascending: false });
  throwOnSupabaseError(error, `list ${table}`);
  return data || [];
};

const upload = async (file, folder, tags) => {
  if (!file) throw badRequest("A document is required.");
  return uploadMediaBuffer({ buffer: file.buffer, originalName: file.originalname, mimeType: file.mimetype, folder, tags });
};

export const listPartnerDocuments = (account) => listOwned(
  "partner_documents",
  account.id,
  "*,media:media_assets!partner_documents_media_id_fkey(url,name,mime_type)",
);

export const submitPartnerDocument = async (account, input, file) => {
  const media = await upload(file, `/aadishakti/portal/${account.role}/documents`, [account.role, "partner-document"]);
  const { data, error } = await getSupabaseAdminClient().from("partner_documents").insert({
    portal_account_id: account.id,
    document_type: requireText(input.documentType, "Document type"),
    title: requireText(input.title || file.originalname, "Document title"),
    document_number: clean(input.documentNumber),
    issued_on: input.issuedOn || null,
    expires_on: input.expiresOn || null,
    media_id: media.id,
  }).select("*").single();
  throwOnSupabaseError(error, "submit partner document");
  return data;
};

export const listReceipts = (account) => listOwned(
  "portal_receipts",
  account.id,
  "*,media:media_assets!portal_receipts_media_id_fkey(url,name,mime_type)",
);

export const submitReceipt = async (account, input, file) => {
  const media = await upload(file, `/aadishakti/portal/${account.role}/receipts`, [account.role, "receipt"]);
  const { data, error } = await getSupabaseAdminClient().from("portal_receipts").insert({
    portal_account_id: account.id,
    payment_reference: requireText(input.paymentReference, "Payment reference"),
    payment_type: clean(input.paymentType) || "payment",
    media_id: media.id,
    amount: numeric(input.amount, "Amount"),
    paid_on: input.paidOn || null,
    notes: clean(input.notes),
  }).select("*").single();
  throwOnSupabaseError(error, "submit payment receipt");
  return data;
};

export const listCustomerRequests = async (account, type) => {
  let query = getSupabaseAdminClient().from("customer_requests")
    .select("*,attachment:media_assets!customer_requests_media_id_fkey(url,name),result:media_assets!customer_requests_fulfilled_media_id_fkey(url,name)")
    .eq("portal_account_id", account.id).order("created_at", { ascending: false });
  if (type) query = query.eq("request_type", type);
  const { data, error } = await query;
  throwOnSupabaseError(error, "list customer requests");
  return data || [];
};

export const submitCustomerRequest = async (account, input, file) => {
  const type = clean(input.requestType);
  if (!new Set(["return", "quality_claim", "sustainability_report", "coa", "document"]).has(type)) throw badRequest("Invalid customer request type.");
  const media = file ? await upload(file, "/aadishakti/portal/customer/requests", ["customer", type]) : null;
  const { data, error } = await getSupabaseAdminClient().from("customer_requests").insert({
    portal_account_id: account.id,
    request_type: type,
    related_reference: clean(input.relatedReference),
    subject: requireText(input.subject, "Subject"),
    description: clean(input.description),
    media_id: media?.id || null,
  }).select("*").single();
  throwOnSupabaseError(error, "submit customer request");
  return data;
};

export const listSupportTickets = async (account) => {
  const { data, error } = await getSupabaseAdminClient().from("portal_support_tickets")
    .select("*,messages:portal_support_messages(*,media:media_assets(url,name))")
    .eq("portal_account_id", account.id).order("updated_at", { ascending: false });
  throwOnSupabaseError(error, "list support tickets");
  return data || [];
};

export const createSupportTicket = async (account, input) => {
  const client = getSupabaseAdminClient();
  const { data: ticket, error } = await client.from("portal_support_tickets").insert({
    portal_account_id: account.id,
    subject: requireText(input.subject, "Subject"),
    category: clean(input.category) || "general",
    priority: clean(input.priority) || "normal",
  }).select("*").single();
  throwOnSupabaseError(error, "create support ticket");
  const message = requireText(input.message, "Message");
  const { error: messageError } = await client.from("portal_support_messages").insert({
    ticket_id: ticket.id,
    sender_type: "partner",
    sender_id: account.id,
    message,
  });
  throwOnSupabaseError(messageError, "add support message");
  return ticket;
};

export const replyToSupportTicket = async (account, ticketId, input) => {
  const client = getSupabaseAdminClient();
  const { data: ticket, error: ticketError } = await client.from("portal_support_tickets").select("id,status")
    .eq("id", ticketId).eq("portal_account_id", account.id).maybeSingle();
  throwOnSupabaseError(ticketError, "load support ticket");
  if (!ticket) throw notFound("Support ticket");
  if (ticket.status === "closed") throw badRequest("This support ticket is closed.");
  const { data, error } = await client.from("portal_support_messages").insert({
    ticket_id: ticket.id,
    sender_type: "partner",
    sender_id: account.id,
    message: requireText(input.message, "Message"),
  }).select("*").single();
  throwOnSupabaseError(error, "reply to support ticket");
  await client.from("portal_support_tickets").update({ status: "open" }).eq("id", ticket.id);
  return data;
};

export const listVendorRfqs = async (account) => {
  const { data, error } = await getSupabaseAdminClient().from("rfq_assignments")
    .select("*,rfq:rfqs(*),quotation:vendor_quotations(*)")
    .eq("vendor_account_id", account.id).order("created_at", { ascending: false });
  throwOnSupabaseError(error, "list vendor RFQs");
  return data || [];
};

export const listVendorQuotations = async (account) => {
  const { data, error } = await getSupabaseAdminClient().from("vendor_quotations")
    .select("*,assignment:rfq_assignments!inner(vendor_account_id,rfq:rfqs(*)),media:media_assets(url,name)")
    .eq("assignment.vendor_account_id", account.id).order("created_at", { ascending: false });
  throwOnSupabaseError(error, "list vendor quotations");
  return data || [];
};

export const submitVendorQuotation = async (account, assignmentId, input, file) => {
  const client = getSupabaseAdminClient();
  const { data: assignment, error: assignmentError } = await client.from("rfq_assignments").select("id,status")
    .eq("id", assignmentId).eq("vendor_account_id", account.id).maybeSingle();
  throwOnSupabaseError(assignmentError, "load RFQ assignment");
  if (!assignment) throw notFound("RFQ assignment");
  const media = file ? await upload(file, "/aadishakti/portal/vendor/quotations", ["vendor", "quotation"]) : null;
  const payload = {
    rfq_assignment_id: assignment.id,
    unit_price: numeric(input.unitPrice, "Unit price", { required: true }),
    tax_rate: numeric(input.taxRate, "Tax rate"),
    lead_time_days: input.leadTimeDays === "" || input.leadTimeDays == null ? null : Math.max(0, Number.parseInt(input.leadTimeDays, 10)),
    validity_date: input.validityDate || null,
    remarks: clean(input.remarks),
    media_id: media?.id || null,
    status: "submitted",
    submitted_at: new Date().toISOString(),
  };
  const { data, error } = await client.from("vendor_quotations").upsert(payload, { onConflict: "rfq_assignment_id" }).select("*").single();
  throwOnSupabaseError(error, "submit vendor quotation");
  await client.from("rfq_assignments").update({ status: "responded" }).eq("id", assignment.id);
  return data;
};

export const getVendorPerformance = async (account) => {
  const { data, error } = await getSupabaseAdminClient().from("vendor_performance_snapshots")
    .select("*").eq("vendor_account_id", account.id).order("created_at", { ascending: false });
  throwOnSupabaseError(error, "load vendor performance");
  return data || [];
};

export const listPartnerLogistics = async (account) => {
  const cardCodes = [account.id, ...(account.mappings || []).map((mapping) => mapping.cardCode)].filter(Boolean);
  const { data, error } = await getSupabaseAdminClient().from("logistics_orders").select("*").order("created_at", { ascending: false });
  throwOnSupabaseError(error, "list partner logistics");
  return (data || []).filter((order) => account.role === "vendor"
    ? order.vendor_account_id === account.id || cardCodes.includes(order.vendor_id)
    : order.customer_account_id === account.id || order.customer_name === account.displayName);
};

const getOwnedLogisticsOrder = async (account, id) => {
  const orders = await listPartnerLogistics(account);
  const order = orders.find((item) => item.id === id);
  if (!order) throw notFound("Logistics order");
  return order;
};

export const addPartnerLogisticsMessage = async (account, id, input) => {
  const order = await getOwnedLogisticsOrder(account, id);
  const message = requireText(input.message, "Message");
  const history = [...(order.chat_history || []), { sender: account.role === "vendor" ? "Vendor" : "Customer", senderId: account.id, message, timestamp: new Date().toISOString() }];
  const { data, error } = await getSupabaseAdminClient().from("logistics_orders").update({ chat_history: history }).eq("id", id).select("*").single();
  throwOnSupabaseError(error, "add logistics message");
  return data;
};

export const updateVendorLogisticsStage = async (account, id, input, files = []) => {
  if (account.role !== "vendor") throw badRequest("Only vendors can update logistics stages.");
  const order = await getOwnedLogisticsOrder(account, id);
  const stage = requireText(input.stage, "Stage");
  const stageIndex = (order.tracking || []).findIndex((item) => item.stage === stage);
  if (stageIndex < 0) throw badRequest("Unknown logistics stage.");
  const uploaded = await Promise.all(files.map((file) => upload(file, "/aadishakti/portal/vendor/logistics", ["vendor", "logistics-proof"])));
  const tracking = (order.tracking || []).map((item, index) => index === stageIndex ? { ...item, completed: true, timestamp: new Date().toISOString(), proofImages: uploaded.map((asset) => asset.url) } : item);
  const { data, error } = await getSupabaseAdminClient().from("logistics_orders").update({ tracking, status: stage }).eq("id", id).select("*").single();
  throwOnSupabaseError(error, "update logistics stage");
  return data;
};

export const submitVendorPod = async (account, id, file) => {
  if (account.role !== "vendor") throw badRequest("Only vendors can submit proof of delivery.");
  const order = await getOwnedLogisticsOrder(account, id);
  const media = await upload(file, "/aadishakti/portal/vendor/pod", ["vendor", "pod"]);
  const tracking = (order.tracking || []).map((item) => item.stage === "Reached Customer" ? { ...item, completed: true, timestamp: item.timestamp || new Date().toISOString() } : item);
  const { data, error } = await getSupabaseAdminClient().from("logistics_orders").update({ pod_image_url: media.url, pod_status: "Under Review", status: "Reached Customer", tracking }).eq("id", id).select("*").single();
  throwOnSupabaseError(error, "submit proof of delivery");
  return data;
};

export const reviewCustomerPod = async (account, id, input) => {
  if (account.role !== "customer") throw badRequest("Only customers can review proof of delivery.");
  const action = clean(input.action).toLowerCase();
  if (!new Set(["accept", "reject"]).has(action)) throw badRequest("POD action must accept or reject.");

  const order = await getOwnedLogisticsOrder(account, id);
  if (!order.pod_image_url || order.pod_status !== "Under Review") {
    throw badRequest("This proof of delivery is not awaiting customer review.");
  }

  const note = clean(input.note);
  if (action === "reject" && !note) throw badRequest("A rejection reason is required.");

  const history = [...(order.chat_history || []), {
    sender: "Customer",
    senderId: account.id,
    message: action === "accept" ? "Proof of delivery accepted." : `Proof of delivery rejected: ${note}`,
    timestamp: new Date().toISOString(),
  }];
  const payload = {
    pod_status: action === "accept" ? "Accepted" : "Rejected",
    status: action === "accept" ? "Delivered" : "Reached Customer",
    chat_history: history,
  };
  if (action === "reject") payload.pod_image_url = null;

  const { data, error } = await getSupabaseAdminClient().from("logistics_orders")
    .update(payload).eq("id", id).select("*").single();
  throwOnSupabaseError(error, "review proof of delivery");
  return data;
};
