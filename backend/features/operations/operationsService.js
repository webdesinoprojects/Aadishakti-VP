import crypto from "crypto";
import { badRequest, notFound } from "../../shared/errors.js";
import { getSupabaseAdminClient, throwOnSupabaseError } from "../../infrastructure/supabase/supabaseClients.js";
import { uploadMediaBuffer } from "../media/mediaService.js";
import { findPortalAccountById } from "../portal/portalAccountRepository.js";
import { findOperationRow, insertOperationRow, insertOperationRows, listOperationRows, updateOperationRow } from "./operationsRepository.js";

const text = (value) => String(value ?? "").trim();
const titleStatus = (value) => String(value || "").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const requireText = (value, label) => {
  const result = text(value);
  if (!result) throw badRequest(`${label} is required.`);
  return result;
};

const registrationColumns = "*,msme:media_assets!partner_registrations_msme_media_id_fkey(url),bank:media_assets!partner_registrations_bank_media_id_fkey(url),quality:media_assets!partner_registrations_quality_media_id_fkey(url)";
const registrationFromDb = (row) => ({
  id: row.id,
  applicationReference: row.application_reference,
  type: row.partner_type,
  companyName: row.company_name,
  contactPerson: row.contact_person,
  email: row.email,
  phone: row.phone,
  pan: row.pan_number,
  gst: row.gst_number,
  category: row.category,
  documents: { msme: row.msme?.url || null, bank: row.bank?.url || null, quality: row.quality?.url || null },
  status: titleStatus(row.status),
  assignedId: row.assigned_partner_id,
  portalAccountId: row.portal_account_id,
  reviewNote: row.review_note,
  reviewedAt: row.reviewed_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const submitPartnerRegistration = async (input, files = {}) => {
  const companyName = requireText(input.companyName, "Company name");
  const pan = requireText(input.panNumber || input.pan, "PAN number");
  const gst = requireText(input.gstNumber || input.gst, "GST number");
  const category = requireText(input.category, "Vendor category");
  const upload = async (field, tag) => {
    const file = files[field]?.[0];
    if (!file) return null;
    return uploadMediaBuffer({ buffer: file.buffer, originalName: file.originalname, mimeType: file.mimetype, folder: "/aadishakti/registrations", tags: ["registration", tag] });
  };
  const [msme, bank, quality] = await Promise.all([
    upload("msmeDoc", "msme"), upload("bankDoc", "bank"), upload("qualityDoc", "quality"),
  ]);
  const row = await insertOperationRow("partner_registrations", {
    partner_type: "vendor",
    company_name: companyName,
    contact_person: text(input.contactPerson),
    email: text(input.email).toLowerCase(),
    phone: text(input.phone),
    pan_number: pan.toUpperCase(),
    gst_number: gst.toUpperCase(),
    category,
    msme_media_id: msme?.id || null,
    bank_media_id: bank?.id || null,
    quality_media_id: quality?.id || null,
  }, registrationColumns);
  return registrationFromDb(row);
};

export const listRegistrations = async (query = {}) =>
  (await listOperationRows("partner_registrations", { columns: registrationColumns, status: query.status })).map(registrationFromDb);

export const reviewRegistration = async (id, input, adminId) => {
  const action = text(input.action || input.status).toLowerCase();
  if (!new Set(["approved", "approve", "rejected", "reject"]).has(action)) throw badRequest("Registration action must approve or reject.");
  const status = action.startsWith("approve") ? "approved" : "rejected";
  const assignedId = text(input.assignedId);
  if (status === "approved" && !assignedId) throw badRequest("Assigned partner ID is required for approval.");
  const row = await updateOperationRow("partner_registrations", id, {
    status,
    assigned_partner_id: status === "approved" ? assignedId : null,
    portal_account_id: status === "approved" ? (text(input.portalAccountId) || null) : null,
    review_note: text(input.reviewNote),
    reviewed_by: adminId,
    reviewed_at: new Date().toISOString(),
  }, registrationColumns);
  if (!row) throw notFound("Partner registration");
  return registrationFromDb(row);
};

const profileUpdateFromDb = (row) => ({
  id: row.id,
  requestReference: row.request_reference,
  portalAccountId: row.portal_account_id,
  vendorId: row.partner_id,
  partnerId: row.partner_id,
  role: titleStatus(row.partner_role),
  oldData: row.old_data,
  newData: row.new_data,
  status: titleStatus(row.status),
  reviewNote: row.review_note,
  createdAt: row.created_at,
  reviewedAt: row.reviewed_at,
});

export const submitProfileUpdate = async (input, account) => {
  const oldData = input.oldData;
  const newData = input.newData;
  if (!oldData || typeof oldData !== "object" || Array.isArray(oldData) || !newData || typeof newData !== "object" || Array.isArray(newData)) {
    throw badRequest("Current and requested profile data must be objects.");
  }
  const row = await insertOperationRow("profile_update_requests", {
    portal_account_id: account.id,
    partner_id: account.cardCode || account.sapCardCode || account.id,
    partner_role: account.role,
    old_data: oldData,
    new_data: newData,
  });
  return profileUpdateFromDb(row);
};

export const listPartnerProfileUpdates = async (account) => {
  const partnerIds = [
    account.id,
    account.cardCode,
    account.sapCardCode,
    ...(account.mappings || []).map((mapping) => mapping.cardCode),
  ].filter(Boolean);
  const client = getSupabaseAdminClient();
  const requests = [
    client.from("profile_update_requests").select("*").eq("portal_account_id", account.id).order("created_at", { ascending: false }),
  ];
  if (partnerIds.length) {
    requests.push(client.from("profile_update_requests").select("*").eq("partner_role", account.role).in("partner_id", partnerIds).order("created_at", { ascending: false }));
  }
  const results = await Promise.all(requests);
  results.forEach(({ error }) => throwOnSupabaseError(error, "list partner profile updates"));
  const unique = new Map(results.flatMap(({ data }) => data || []).map((row) => [row.id, row]));
  return [...unique.values()]
    .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)))
    .map(profileUpdateFromDb);
};

export const listProfileUpdates = async (query = {}) =>
  (await listOperationRows("profile_update_requests", { status: query.status })).map(profileUpdateFromDb);

export const reviewProfileUpdate = async (id, input, adminId) => {
  const action = text(input.action || input.status).toLowerCase();
  if (!new Set(["approved", "approve", "rejected", "reject"]).has(action)) throw badRequest("Profile update action must approve or reject.");
  const status = action.startsWith("approve") ? "approved" : "rejected";
  const reviewNote = text(input.reviewNote);
  if (status === "rejected" && !reviewNote) throw badRequest("A rejection reason is required.");
  if (reviewNote.length > 2000) throw badRequest("The review note must be 2,000 characters or fewer.");
  const current = await findOperationRow("profile_update_requests", id);
  if (!current) throw notFound("Profile update request");
  if (current.status !== "pending") throw badRequest("This profile update request has already been reviewed.");
  const row = await updateOperationRow("profile_update_requests", id, {
    status, review_note: reviewNote, reviewed_by: adminId, reviewed_at: new Date().toISOString(),
  });
  if (!row) throw notFound("Profile update request");
  return profileUpdateFromDb(row);
};

const reconciliationColumns = "*,media_assets!reconciliations_document_media_id_fkey(url)";
const reconciliationFromDb = (row) => ({
  id: row.id,
  userId: row.partner_id,
  role: titleStatus(row.partner_role),
  quarter: row.quarter,
  documentUrl: row.media_assets?.url || null,
  originalName: row.original_name,
  status: titleStatus(row.status),
  reviewNote: row.review_note,
  isLocked: row.is_locked,
  createdAt: row.created_at,
  verifiedAt: row.verified_at,
});

export const submitReconciliation = async (input, file, account) => {
  if (!file) throw badRequest("A statement document is required.");
  const quarter = requireText(input.quarter, "Quarter");
  const media = await uploadMediaBuffer({ buffer: file.buffer, originalName: file.originalname, mimeType: file.mimetype, folder: "/aadishakti/reconciliations", tags: ["reconciliation", account.role] });
  const row = await insertOperationRow("reconciliations", {
    partner_id: account.cardCode || account.sapCardCode || account.id,
    partner_role: account.role,
    quarter,
    document_media_id: media.id,
    original_name: file.originalname,
  }, reconciliationColumns);
  return reconciliationFromDb(row);
};

export const submitReconciliations = async (input, files, account) => {
  if (!Array.isArray(files) || files.length === 0) throw badRequest("At least one statement document is required.");
  const quarter = requireText(input.quarter, "Quarter");
  const mediaItems = await Promise.all(files.map((file) => uploadMediaBuffer({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
    folder: "/aadishakti/reconciliations",
    tags: ["reconciliation", account.role],
  })));
  const rows = await insertOperationRows("reconciliations", files.map((file, index) => ({
    partner_id: account.cardCode || account.sapCardCode || account.id,
    partner_role: account.role,
    quarter,
    document_media_id: mediaItems[index].id,
    original_name: file.originalname,
  })), reconciliationColumns);
  return rows.map(reconciliationFromDb);
};

export const listReconciliations = async (query = {}) =>
  (await listOperationRows("reconciliations", { columns: reconciliationColumns, status: query.status })).map(reconciliationFromDb);

export const listPartnerReconciliations = async (account) => {
  const partnerIds = [account.id, account.cardCode, ...(account.mappings || []).map((mapping) => mapping.cardCode)].filter(Boolean);
  const { data, error } = await getSupabaseAdminClient().from("reconciliations").select(reconciliationColumns)
    .eq("partner_role", account.role).in("partner_id", partnerIds).order("created_at", { ascending: false });
  throwOnSupabaseError(error, "list partner reconciliations");
  return (data || []).map(reconciliationFromDb);
};

export const reviewReconciliation = async (id, input, adminId) => {
  const action = text(input.action || "verify").toLowerCase();
  if (!new Set(["verify", "verified", "reject", "rejected"]).has(action)) throw badRequest("Reconciliation action must verify or reject.");
  const verified = action.startsWith("verif");
  const reviewNote = text(input.reviewNote);
  if (!verified && !reviewNote) throw badRequest("A rejection reason is required.");
  const current = await findOperationRow("reconciliations", id);
  if (!current) throw notFound("Reconciliation");
  if (current.is_locked) throw badRequest("This reconciliation is verified and permanently locked.");
  const row = await updateOperationRow("reconciliations", id, {
    status: verified ? "verified" : "rejected",
    review_note: reviewNote,
    verified_by: adminId,
    verified_at: new Date().toISOString(),
    is_locked: verified,
  }, reconciliationColumns);
  if (!row) throw notFound("Reconciliation");
  return reconciliationFromDb(row);
};

const logisticsFromDb = (row) => ({
  id: row.id, enquiryId: row.enquiry_reference, vendorId: row.vendor_id, vendorName: row.vendor_name,
  vendorAccountId: row.vendor_account_id, customerAccountId: row.customer_account_id,
  sourceQuotationId: row.source_quotation_id,
  customerName: row.customer_name, product: row.product, amount: row.amount, status: row.status,
  tracking: row.tracking, chatHistory: row.chat_history, podStatus: row.pod_status,
  podImage: row.pod_image_url, paymentProof: row.payment_proof_url, createdAt: row.created_at, updatedAt: row.updated_at,
});

export const listLogisticsOrders = async () => (await listOperationRows("logistics_orders")).map(logisticsFromDb);
export const getLogisticsOrder = async (id) => {
  const row = await findOperationRow("logistics_orders", id);
  if (!row) throw notFound("Logistics order");
  return logisticsFromDb(row);
};
export const createLogisticsOrder = async (input, adminId) => {
  const client = getSupabaseAdminClient();
  const customer = await findPortalAccountById(requireText(input.customerAccountId, "Customer account"));
  if (customer?.role !== "customer" || customer.status !== "active") throw badRequest("Select an active customer account.");

  let quotation = null;
  if (text(input.sourceQuotationId)) {
    const { data, error } = await client.from("vendor_quotations")
      .select("id,status,assignment:rfq_assignments(vendor_account_id,rfq:rfqs(rfq_reference,product,company_code))")
      .eq("id", input.sourceQuotationId).maybeSingle();
    throwOnSupabaseError(error, "load source quotation");
    if (!data || data.status !== "accepted") throw badRequest("Select an accepted quotation.");
    quotation = data;
    if (text(input.vendorAccountId) && input.vendorAccountId !== quotation.assignment?.vendor_account_id) {
      throw badRequest("The selected vendor does not match the accepted quotation.");
    }
    const companyCode = quotation.assignment?.rfq?.company_code;
    if (companyCode && !customer.mappings?.some((mapping) => mapping.company_code === companyCode)) {
      throw badRequest(`The customer is not mapped to ${companyCode}.`);
    }
  }

  const vendorAccountId = quotation?.assignment?.vendor_account_id || requireText(input.vendorAccountId, "Vendor account");
  const vendor = await findPortalAccountById(vendorAccountId);
  if (vendor?.role !== "vendor" || vendor.status !== "active") throw badRequest("Select an active vendor account.");
  const primaryVendorMapping = vendor.mappings?.find((mapping) => mapping.is_primary) || vendor.mappings?.[0];
  const amount = text(input.amount);
  if (amount && (!Number.isFinite(Number(amount)) || Number(amount) < 0)) throw badRequest("Order amount must be a non-negative number.");
  const now = new Date().toISOString();
  const id = `ORD-${crypto.randomInt(10000000, 100000000)}`;
  const row = await insertOperationRow("logistics_orders", {
    id,
    enquiry_reference: quotation?.assignment?.rfq?.rfq_reference || text(input.enquiryId) || null,
    ...(quotation ? { source_quotation_id: quotation.id } : {}),
    vendor_id: primaryVendorMapping?.sap_card_code || null,
    vendor_account_id: vendor.id,
    customer_account_id: customer.id,
    vendor_name: vendor.display_name,
    customer_name: customer.display_name,
    product: requireText(input.product || quotation?.assignment?.rfq?.product, "Product"),
    amount,
    tracking: [
      { stage: "Order Confirmed", timestamp: now, proofImages: [], completed: true },
      { stage: "Packed", timestamp: null, proofImages: [], completed: false },
      { stage: "Shipment Started", timestamp: null, proofImages: [], completed: false },
      { stage: "Reached Customer", timestamp: null, proofImages: [], completed: false },
    ],
    created_by: adminId,
    updated_by: adminId,
  });
  return logisticsFromDb(row);
};

export const updateLogisticsOrder = async (id, operation, input, adminId) => {
  const current = await getLogisticsOrder(id);
  const payload = { updated_by: adminId };
  if (operation === "chat") {
    const message = requireText(input.message, "Message");
    payload.chat_history = [...(current.chatHistory || []), { sender: text(input.sender) || "Admin", message, timestamp: new Date().toISOString() }];
  } else if (operation === "review-pod") {
    if (!new Set(["accept", "reject"]).has(input.action)) throw badRequest("POD action must accept or reject.");
    payload.pod_status = input.action === "accept" ? "Accepted" : "Rejected";
    payload.status = input.action === "accept" ? "Delivered" : current.status;
    if (input.action === "reject") payload.pod_image_url = null;
  } else {
    throw badRequest("Unsupported logistics operation.");
  }
  const row = await updateOperationRow("logistics_orders", id, payload);
  if (!row) throw notFound("Logistics order");
  return logisticsFromDb(row);
};

export const getPublicTracking = async (id) => {
  const order = await getLogisticsOrder(id);
  return {
    id: order.id,
    status: order.status,
    tracking: (order.tracking || []).map(({ stage, timestamp, completed }) => ({ stage, timestamp, completed })),
    podStatus: order.podStatus,
  };
};
