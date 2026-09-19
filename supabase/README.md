# Supabase migration order

Run SQL files from `supabase/migrations` in ascending numeric order. Never rename or edit a migration after it has been applied to a shared environment; add the next numbered file instead.

Current order:

1. `001_admin_cms_foundation.sql` — Admin profiles, CMS, media metadata, galleries, CRM submissions, audit logs, indexes, triggers, grants, and RLS boundaries.
2. `002_admin_operations.sql` — Partner registration reviews, profile-update approvals, reconciliation documents, and logistics records.
3. `003_allow_array_cms_singletons.sql` — Allows approved CMS singleton sections to retain object or array JSON shapes during migration.

4. `004_portal_accounts_and_workflows.sql` - Individual partner logins, multi-company CIS mappings, documents, RFQs, quotations, support, receipts, and requests.

5. `005_logistics_portal_ownership.sql` - Explicit vendor/customer ownership for account-scoped tracking and proof workflows.

Naming convention for every future migration:

```text
003_short_descriptive_name.sql
004_next_descriptive_name.sql
```

After migration `001`:

1. Add the Supabase and ImageKit values to `backend/.env`.
2. Set `SUPABASE_ENABLED=true` and `IMAGEKIT_ENABLED=true`.
3. Run `npm run db:bootstrap-admin --prefix backend` once.
4. Run `npm run db:bootstrap-portals --prefix backend` once to migrate configured customer/vendor demo logins into database accounts.
5. Run `npm run db:import-json --prefix backend` to migrate existing CMS JSON.
6. If legacy CRM records are also required, run `npm run db:import-json --prefix backend -- --include-crm`.

The import commands are repeat-safe for records with stable source keys. Legacy local attachments are not uploaded automatically; new attachments use ImageKit.
