# Changelog v1

Note that the displayed date is in the format `dd-mm-yyyy`

## [v1.1.0]

> **Released:** `soon`

### New Features

- Verify the email entered by the user while creating an account [#7]
    - Send verification email on registration
    - User verifies using the link sent
    - User can resend verification if link expires (expires in 1 day)
    - Added rate limit to 5 users per IP for the resend confirmation route
    - Validate if the user is verified before allowing them to create capsules [#14]

### Bugs Fixed

- Configure express to trust specific proxy headers from process.env.TRUSTED_PROXIES [#14]

## [v1.0.1]

> **Released:** `06-07-2025`

### Bugs fixed
- Introduced new environment variable SMTP_SENDER to define the visible `from` address in an email
- SMTP Sender mismatch: Resolved email delivery failure due to a different SMTP Sender rather than the SMTP User

## [v1.0.0]

> **Released:** `05-07-2025`

### What’s Included
All enhancements and fixes from the beta release:
- Capsule unlock scheduler runs every 10 minutes for improved responsiveness
- Production build bugs patched, including CSS import, route matching, and login redirect
- Minor bug fixes

### 📦 Notes
No changes to code were made after the beta release — this version simply marks the shift from "pre-release" to "stable". Ready for public use!

## [v1.0.0-beta]

> **Released:** `04-07-2025`

### Bugs fixed
- Import home.css in Home react component, otherwise it doesn't show up in production build
- Fix bug in RegExp of route handling for production built files
- Added a missing `await` keyword before ejs.renderFile to return string instead of a Promise
- Change navigation method to window.location.href after login, this helps update the links in the header of the site.
- Improve debug logging
- UX enhancement: changed capsule unlock scheduler from **every hour** to **every 10 minutes**
- Fix raw text EJS template: replace `\n`(ejs renders it as text) with actual new lines


## [v1.0.0-alpha]

> **Released:** `02-07-2025`

### Added features
- Login & Register pages
- Home & About pages
- Also created placeholder for Privacy Policy, Terms & Conditions
- Implemented both dark and light themes
- SMTP email setup using nodemailer and EJS templates
- Use localStorage for saving theme preference and user login token
- Capsules can be created using text and media links
- Added limits for various fields in user schema and capsule schema
- Validate username, email & password lengths in auth controller
- Validate if unlock date is at least an hour later (frontend), 50 mins later (backend)

### Bugs fixed
- If request body is empty, return status 400 in response

### Chores
- Bump nodemailer from 7.0.3 to 7.0.4 [#6](https://github.com/PuneetGopinath/chrono-capsule/pull/6)

[#14]: https://github.com/PuneetGopinath/chrono-capsule/pull/14
[#7]: https://github.com/PuneetGopinath/chrono-capsule/pull/7

[v1.0.0]: https://github.com/PuneetGopinath/chrono-capsule/releases/tag/v1.0.0
[v1.0.0-beta]: https://github.com/PuneetGopinath/chrono-capsule/releases/tag/v1.0.0-beta
[v1.0.0-alpha]: https://github.com/PuneetGopinath/chrono-capsule/releases/tag/v1.0.0-alpha