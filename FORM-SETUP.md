# Contact form — setup and deployment

Ported from the Hostel Samobor site. Same pipeline, same mailbox.

## Files

| File | Purpose |
|---|---|
| `send.php` | Form handler. Validates, rate-limits, sends via the Resend API. Answers `{"ok":true\|false}` when the request asks for JSON, otherwise redirects back with `?sent=1\|0`. |
| `php/PHPMailer/` | Vendored PHPMailer (Exception, PHPMailer, SMTP). Fallback path only. |
| `php/mail-config.php` | **Real Resend API key. Gitignored — never commit.** |
| `php/mail-config.example.php` | Template to copy on a fresh checkout. |
| `php/.htaccess` | Blocks HTTP access to the two above. `send.php` still includes them from disk. |
| `js/form-status.js` | Submits the form with `fetch` (no page reload) and shows the banner, which fades out on success. Also handles the no-JS `?sent=1\|0` redirect. |

## Requirements

The site is no longer purely static — **the host must run PHP** (7.4+; PHPMailer needs
`mbstring` and `openssl`). Any Croatian cPanel shared host qualifies. A static-only
host (GitHub Pages, plain S3, Netlify without functions) will serve `send.php` as a
download instead of running it, and the form will silently break.

## Deploy checklist

1. Upload everything **except** `.git/`, `css.zip`, and `*.md`.
2. `php/mail-config.php` is gitignored, so it will not arrive via a git-based deploy —
   upload it manually, or copy `mail-config.example.php` and fill it in on the server.
3. Confirm `php/` is not browsable: `https://<domain>/php/mail-config.php` must return
   403, not the file. If it returns the file, the host ignores `.htaccess` — move the
   `php/` directory above the web root and update the `require` paths in `send.php`.
4. Submit the HR form and the EN form once each; both should land in
   `hostel.samobor@gmail.com` with a `Reply-To` of the sender.
5. Set the canonical-host redirect in the root `.htaccess` once the domain is decided
   (currently only HTTPS is forced — see the TODO in that file).

## Mail transport

Mail goes out over **Resend's HTTPS API**, not SMTP. The cPanel host firewalls outbound
SMTP: ports 25 and 587 are transparently redirected to its own Exim, and 465 is refused
(verified 2026-07-31 from a PHPMailer debug log — a connection to `smtp.gmail.com:587`
was answered by `server.wmd-cloudlinux.com`). No external mail server is reachable from
that box, so Gmail SMTP cannot work there regardless of credentials.

`send.php` therefore POSTs to `https://api.resend.com/emails` on port 443. If `api_key`
is empty it falls back to PHPMailer, which hands the message to the local Exim via
`mail()`. The `smtp_*` settings only matter on a host that permits outbound SMTP.

Sending from a domain requires that domain be verified in Resend (DNS records on a
`send.` subdomain). `from_email` is `info@kombi-samobor.com` for that reason — a
`gmail.com` From sent by anything but Google fails SPF and is filed as spam.

## Mail credentials

`php/mail-config.php` uses the same Resend account as the Hostel Samobor site, so
one inbox receives both. `from_name` is `KombiRent`, and the subject is prefixed
`Upit za najam kombija —` / `Van rental inquiry —`, which is what distinguishes the two
sites in the inbox. If the App Password is ever revoked, both sites need the new one.

## Anti-spam

Three layers, all inherited from the Hostel site: a `website` honeypot field (filled →
fake success, no mail), a 30-second per-session send limit, and CR/LF stripping on all
single-line fields to block header injection. No captcha. If spam does get through,
adding one is the next step.
