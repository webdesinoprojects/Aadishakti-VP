# Admin backend setup

The approved React UI remains unchanged. Express is the only browser-facing data boundary, Supabase owns Admin identities and application data, and ImageKit owns uploaded files.

## Required environment values

Copy `backend/.env.example` to `backend/.env` and provide:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (backend only)
- `IMAGEKIT_URL_ENDPOINT`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY` (backend only)
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD` (remove after bootstrap)
- `INITIAL_ADMIN_DISPLAY_NAME`
- `INITIAL_ADMIN_ROLE`

Keep `SUPABASE_ENABLED=false` and `IMAGEKIT_ENABLED=false` until migration `001` is applied. This preserves the existing JSON-backed Admin and the CIS customer/vendor portals during setup.

## Activation order

1. Apply migrations in the order documented in `supabase/README.md`.
2. Enable Supabase and ImageKit in `backend/.env`.
3. Bootstrap the first Admin with `npm run db:bootstrap-admin --prefix backend`.
4. Import existing CMS data with `npm run db:import-json --prefix backend`.
5. Restart the backend process with its updated environment.

## Security boundaries

- Supabase secret and ImageKit private keys never go to the frontend.
- Browser roles have no direct table grants; Express authorizes every operation.
- Admin roles are `super_admin`, `content_admin`, `operations_admin`, and `viewer`.
- Admin writes are recorded in `audit_logs`.
- Customer/vendor commercial data remains CIS-owned and read-only.
- The existing fake vendor assignment directory is suppressed when Supabase mode is enabled; it returns an empty list until a genuine CIS or approved directory source exists.

## New backend resources

- Admin auth and role-based permissions
- CMS pages and reusable singleton content
- Products, news, jobs, team, gallery, and navigation
- ImageKit media metadata and upload authentication
- Public enquiry and career submissions
- Admin CRM inbox and applications
- Admin dashboard summary, user management, and audit history

