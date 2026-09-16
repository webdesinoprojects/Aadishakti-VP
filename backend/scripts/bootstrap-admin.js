import "../config/env.js";
import { env } from "../config/env.js";
import { getSupabaseAdminClient } from "../infrastructure/supabase/supabaseClients.js";

const email = String(process.env.INITIAL_ADMIN_EMAIL || "").trim().toLowerCase();
const password = String(process.env.INITIAL_ADMIN_PASSWORD || "");
const displayName = String(process.env.INITIAL_ADMIN_DISPLAY_NAME || "Administrator").trim();
const role = String(process.env.INITIAL_ADMIN_ROLE || "super_admin").trim().toLowerCase();
const allowedRoles = new Set(["super_admin", "content_admin", "operations_admin", "viewer"]);

if (!env.supabase.enabled) throw new Error("Set SUPABASE_ENABLED=true before bootstrapping an Admin.");
if (!email || !email.includes("@")) throw new Error("INITIAL_ADMIN_EMAIL must be a valid email.");
if (password.length < 12) throw new Error("INITIAL_ADMIN_PASSWORD must contain at least 12 characters.");
if (!allowedRoles.has(role)) throw new Error("INITIAL_ADMIN_ROLE is invalid.");

const client = getSupabaseAdminClient();
const { data: existingProfile, error: profileLookupError } = await client
  .from("admin_profiles")
  .select("id,email,role")
  .eq("email", email)
  .maybeSingle();
if (profileLookupError) throw profileLookupError;
if (existingProfile) {
  console.log(`Admin profile already exists for ${existingProfile.email} (${existingProfile.role}).`);
  process.exit(0);
}

const { data: usersData, error: usersError } = await client.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (usersError) throw usersError;
let user = usersData.users.find((item) => item.email?.toLowerCase() === email);
if (!user) {
  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });
  if (error) throw error;
  user = data.user;
}

const { error: insertError } = await client.from("admin_profiles").insert({
  id: user.id,
  email,
  display_name: displayName,
  role,
  permissions: [],
  is_active: true,
});
if (insertError) throw insertError;
console.log(`Created ${role} profile for ${email}.`);

