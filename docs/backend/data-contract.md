# Aadishakti backend data contract

This document is the traceability source for the first Supabase schema. Fields are included only when they are present in the current application, existing JSON persistence, provider responses, or an approved Admin requirement.

## Identity and authorization

| Model | Source |
| --- | --- |
| `auth.users` | Supabase Auth owns credentials and sessions. |
| `admin_profiles` | Existing Admin login/user context plus approved RBAC requirement. Roles: `super_admin`, `content_admin`, `operations_admin`, `viewer`. |

## Public CMS

| Model | Existing source fields |
| --- | --- |
| `cms_pages` | Approved page/route/SEO management requirement; public React routes and page titles; page content remains `sections` JSON because page layouts differ. |
| `cms_navigation_items` | Existing Navbar links and approved menu management requirement. |
| `cms_singletons` | `hero.json`, `investors.json`, and global/nav/settings objects in `cms.json`. |
| `products` | `products.json`: id, name, code, purity, description, specifications, image, datasheet, lastEdited; Admin currently also sends features. |
| `news_posts` | `news.json`: id, title, category, status, publishDate, content, featuredImage, displayOnHome, displayOnNews, createdAt, updatedAt. |
| `job_postings` | `careers.json` and Careers Admin: title, category, department/dept, location, type, experience/exp, salaryRange, description/desc, requirements, whyWorkHere, image/img, status. |
| `team_members` | `team.json` and Team Admin: name, role, bio, photo/image, category, displayOrder, linkedinUrl. |

## Media and galleries

| Model | Source |
| --- | --- |
| `media_assets` | ImageKit upload response identifiers/URLs plus Admin-editable alt text, caption, tags and folder. |
| `gallery_albums` | Existing Gallery categories and approved album management requirement. |
| `gallery_items` | Existing gallery image/category/title records, normalized so one asset may be reused. |

The ImageKit private key is backend-only. The browser receives short-lived upload authentication parameters and then registers the successful ImageKit response with the backend.

## CRM and careers

| Model | Existing source fields |
| --- | --- |
| `enquiries` | `enquiries.json`, Contact forms, Custom Alloy form: contact/company fields, inquiry type, products, materials, quantity, packaging, details, specification attachment, status, assignment and notes. |
| `job_applications` | `applications.json` and Careers forms: applicant contact details, role/category, experience, description, resume metadata, status and notes. |

## Operations and audit

| Model | Source |
| --- | --- |
| `audit_logs` | Approved audit requirement; actor, action, resource, request ID, IP and non-secret metadata. |
| `partner_registrations` | Vendor Registration and Admin New Registrations UI: company, tax identifiers, category, compliance documents, review status and assigned partner ID. |
| `profile_update_requests` | Admin Profile Updates UI: partner reference, current/requested field snapshots and review status. Approval records the decision but does not write to read-only CIS. |
| `reconciliations` | Customer/Vendor reconciliation routes and Admin Quarterly Reconciliations UI: partner, role, quarter, statement document and verification lock. |
| `logistics_orders` | Existing `orders.json` and Logistics Admin UI: parties, product, amount, tracking milestones/proofs, chat, POD and payment proof. |

Customer/vendor commercial records remain CIS-owned and read-only. They are not copied into these CMS tables.

## Security boundary

- All application tables have Row Level Security enabled.
- Browser roles receive no direct table grants in the first phase.
- Public and Admin clients call the Express API; only the backend holds the Supabase secret key.
- Every Admin write records an audit event.
- Schema changes are versioned SQL migrations under `supabase/migrations`.
