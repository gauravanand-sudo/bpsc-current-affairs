# OneShot GS Talk to Us / Helpdesk setup

The codebase now contains a private helpdesk chatbot at `/ask` with aliases at `/helpdesk`, `/talk-to-us`, `/query`, and `/support`.

## 1. Supabase conversation storage

Run `supabase/helpdesk.sql` once in the Supabase SQL editor for the project used by OneShot GS.

The table is append-only for public visitors:
- visitors can insert helpdesk events;
- visitors cannot select, update, or delete helpdesk conversations;
- each conversation is grouped by a UUID generated in the browser.

Existing environment variables used by the app:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Optional but recommended for trusted server writes:

```text
SUPABASE_SERVICE_ROLE_KEY=
```

## 2. Helpdesk email delivery

The API sends the full transcript-so-far after each completed assistant response through the Resend HTTP API.

Configure these Vercel environment variables:

```text
RESEND_API_KEY=
HELPDESK_EMAIL=exact-mailbox@bpscconnectionpoint.com
HELPDESK_FROM_EMAIL=OneShot GS <verified-sender@your-verified-domain.com>
```

`HELPDESK_EMAIL` must be a complete email address, not only a domain name.

## 3. AI

The existing helpdesk/tutor API uses:

```text
GROQ_API_KEY=
```

The assistant classifies each conversation as admission, course, payment, academic, technical, or general and collects only relevant information. It is instructed never to request passwords, OTPs, UPI PINs, CVV, full card details, banking credentials, Aadhaar, or PAN for ordinary helpdesk/admissions conversations.
