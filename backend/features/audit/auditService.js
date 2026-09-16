import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { JsonRepository } from "../../infrastructure/persistence/jsonRepository.js";
import {
  getSupabaseAdminClient,
  isSupabaseEnabled,
  throwOnSupabaseError,
} from "../../infrastructure/supabase/supabaseClients.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repository = new JsonRepository(
  path.join(__dirname, "../../data/audit-logs.json"),
  [],
);

export const recordAudit = async ({ req, action, resourceType, resourceId, metadata }) => {
  const entry = {
    id: crypto.randomUUID(),
    action,
    resourceType,
    resourceId: resourceId || null,
    actor: req.admin?.username || "anonymous",
    actorRole: req.admin?.role || null,
    requestId: req.requestId || null,
    ip: req.ip || req.socket.remoteAddress || null,
    metadata: metadata || {},
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseEnabled()) {
    const { error } = await getSupabaseAdminClient().from("audit_logs").insert({
      id: entry.id,
      actor_id: req.admin?.id || req.admin?.sub || null,
      actor_email: entry.actor,
      actor_role: entry.actorRole,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      request_id: entry.requestId,
      ip_address: entry.ip,
      metadata: entry.metadata,
      created_at: entry.createdAt,
    });
    throwOnSupabaseError(error, "record the audit event");
  } else {
    await repository.update((entries) => [entry, ...entries].slice(0, 5000));
  }
  return entry;
};

export const listAuditLogs = async ({ limit = 100, action, resourceType }) => {
  if (isSupabaseEnabled()) {
    let query = getSupabaseAdminClient()
      .from("audit_logs")
      .select("id,actor_id,actor_email,actor_role,action,resource_type,resource_id,request_id,ip_address,metadata,created_at")
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 250));
    if (action) query = query.eq("action", action);
    if (resourceType) query = query.eq("resource_type", resourceType);
    const { data, error } = await query;
    throwOnSupabaseError(error, "list audit events");
    return data || [];
  }

  const entries = await repository.read();
  return entries
    .filter((entry) => !action || entry.action === action)
    .filter((entry) => !resourceType || entry.resourceType === resourceType)
    .slice(0, Math.min(Math.max(limit, 1), 250));
};
