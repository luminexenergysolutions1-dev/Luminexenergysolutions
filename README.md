# Luminex Energy Solutions — Backend Setup (Supabase)

The website reads all business content from Supabase (PostgreSQL + Auth + Storage).
Until Supabase is connected, the public website renders the built-in default content
and the Admin Portal shows a configuration notice (no fake login exists).

## 1. Create a Supabase project
https://supabase.com → New project.

## 2. Run the schema
Open **SQL Editor** and run the full contents of `supabase/schema.sql`.
This creates all tables, Row Level Security policies, the `media` storage bucket and seed settings.

## 3. Configure environment variables
Create a `.env` file in the project root (never commit it):

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...   # the public "anon" key only
```

Never put the `service_role` key in the frontend. The anon key is safe to expose because
every table is protected by Row Level Security — only users listed in `admin_users` can write.

## 4. Create the administrator (no credentials in code)
1. Supabase → **Authentication → Users → Add user** (email + strong password, "Auto confirm").
2. Copy the user's UUID, then in the SQL Editor:

```sql
insert into public.admin_users (user_id, email)
values ('PASTE-USER-UUID-HERE', 'admin@example.com');
```

Only users present in `admin_users` can access `/#/admin`. Anyone else is signed out automatically.

## 5. First-time content
Log in at `/#/admin`:
- **Services** → "Import defaults into database" (then edit freely)
- **FAQs** → "Import defaults into database"
- **Homepage / Website Content / Contact / Social / SEO** → review and Save

Every save is immediately reflected across the whole website (header, footer, WhatsApp button, pages).

## Security summary
- Authentication: Supabase Auth (email + password). Enable MFA/leaked-password protection in the dashboard if desired.
- Authorization: `admin_users` table + `is_admin()` checked by RLS on every write.
- Public visitors: read-only on content, insert-only on `quote_requests` (server-side validation via CHECK constraints and a rate-limit trigger).
- Storage: public read on `media`; admins manage; anonymous users may only upload into `media/quotes/*` (5MB, images/PDF).
