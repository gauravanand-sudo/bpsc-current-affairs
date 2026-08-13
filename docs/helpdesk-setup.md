# OneShot GS Talk to Us / Helpdesk setup

OneShot GS now has two separate assistants:

- `/ask` — **Talk to Tutor**. Academic-only UPSC/BPSC tutoring. It does not collect lead/contact information and does not send conversations to the helpdesk mailbox.
- `/talk-to-us` — **Talk to Us**. Private admissions/helpdesk flow for admissions, course/fee queries, payment help, technical support, callbacks and other administrative queries.

Aliases `/helpdesk`, `/query`, and `/support` redirect to `/talk-to-us`.

## 1. Supabase conversation storage

Run `supabase/helpdesk.sql` once in the Supabase SQL editor for the project used by OneShot GS.

The helpdesk table is append-only for public visitors:
- visitors can insert helpdesk events;
- visitors cannot select, update, or delete helpdesk conversations;
- each Talk to Us conversation is grouped by a UUID generated in the browser.

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

The `/api/helpdesk` endpoint can send the full Talk to Us transcript-so-far after each completed assistant response through the Resend HTTP API.

Configure these Vercel environment variables:

```text
RESEND_API_KEY=
HELPDESK_EMAIL=exact-mailbox@bpscconnectionpoint.com
HELPDESK_FROM_EMAIL=OneShot GS <verified-sender@your-verified-domain.com>
```

`HELPDESK_EMAIL` must be a complete email address, not only a domain name.

Talk to Tutor (`/api/ask`) does not use the helpdesk storage or email handoff.

## 3. AI

Both assistants use:

```text
GROQ_API_KEY=
```

Talk to Us classifies each conversation as admission, course, payment, technical, or general and collects only information relevant to follow-up. It is instructed never to request passwords, OTPs, UPI PINs, CVV, full card details, banking credentials, Aadhaar, or PAN for ordinary helpdesk/admissions conversations.

Talk to Tutor is academic-only and redirects administrative, admissions, payment or technical issues to `/talk-to-us`.
