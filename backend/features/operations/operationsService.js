import crypto from "crypto";
import { badRequest, notFound } from "../../shared/errors.js";
import { getSupabaseAdminClient, throwOnSupabaseError } from "../../infrastructure/supabase/supabaseClients.js";
import { uploadMediaBuffer } from "../media/mediaService.js";
import { findOperationRow, insertOperationRow, listOperationRows, updateOperationRow } from "./operationsRepository.js";

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
    partner_id: account.cardCode || account.sapCardCode || account.id,
    partner_role: account.role,
    old_data: oldData,
    new_data: newData,
  });
  return profileUpdateFromDb(row);
};

export const listProfileUpdates = async (query = {}) =>
  (await listOperationRows("profile_update_requests", { status: query.status })).map(profileUpdateFromDb);

export const reviewProfileUpdate = async (id, input, adminId) => {
  const action = text(input.action || input.status).toLowerCase();
  if (!new Set(["approved", "approve", "rejected", "reject"]).has(action)) throw badRequest("Profile update action must approve or reject.");
  const status = action.startsWith("approve") ? "approved" : "rejected";
  const row = await updateOperationRow("profile_update_requests", id, {
    status, review_note: text(input.reviewNote), reviewed_by: adminId, reviewed_at: new Date().toISOString(),
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
  const row = await updateOperationRow("reconciliations", id, {
    status: verified ? "verified" : "rejected",
    review_note: text(input.reviewNote),
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
  const now = new Date().toISOString();
  const id = `ORD-${crypto.randomInt(10000, 100000)}`;
  const row = await insertOperationRow("logistics_orders", {
    id,
    enquiry_reference: text(input.enquiryId) || null,
    vendor_id: text(input.vendorId) || null,
    vendor_account_id: text(input.vendorAccountId) || null,
    customer_account_id: text(input.customerAccountId) || null,
    vendor_name: text(input.vendorName),
    customer_name: text(input.customerName),
    product: text(input.product),
    amount: text(input.amount || "0"),
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
