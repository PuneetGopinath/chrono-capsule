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
    - Validate that the user is verified before allowing capsule creation. [#14]
- User can view created capsules in dashboard [#18]
    - Introduced `GET /api/capsules/view` - returns capsules created by the currently logged in user.
    - Added Loading component that renders when the page loads.
- User input data is sanitized using server-side validation and escaping to prevent XSS attacks before being stored in the database across.
    - Also added small validation checks in the frontend
- Automatic logout after 7 days (already set up in backend, but added to frontend) [#38]

### Bugs Fixed

- Configure express to trust specific proxy headers from process.env.TRUSTED_PROXIES [#14]
- UX enhancement: Disable submit buttons during form submission [#18]
- Fix a timezone offset issue on setting unlock date [#32]

### Refactorings

- Upgrade EJS templates for emails that are sent and modify text in email confirmation template [#16]
- Update theme handling to set dark class to html tag instead of body & more... [#18]

### Chores

- bump react from 19.1.0 to 19.1.1 [#34]
- bump mongoose from 8.16.1 to 8.16.5 [#31]
- bump form-data from 4.0.3 to 4.0.4 [#27]
- bump vite from 7.0.0 to 7.0.2 [#12], 7.0.2 to 7.0.5 [#26]
- bump on-headers from 1.0.2 to 1.1.0 & morgan from 1.10.0 to 1.10.1 [#24]
- bump nodemailer from 7.0.4 to 7.0.5 [#23]
- bump dotenv from 17.0.0 to 17.0.1 [#13]
- bump eslint from 9.30.0 to 9.30.1 [#10]


## [v1.0.1]

> **Released:** `06-07-2025`

### Bugs fixed

- Introduced new environment variable SMTP_SENDER to define the visible `from` address in an email [#9]
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


[#38]: https://github.com/PuneetGopinath/chrono-capsule/pull/38
[#34]: https://github.com/PuneetGopinath/chrono-capsule/pull/34
[#32]: https://github.com/PuneetGopinath/chrono-capsule/pull/32
[#31]: https://github.com/PuneetGopinath/chrono-capsule/pull/31
[#27]: https://github.com/PuneetGopinath/chrono-capsule/pull/27
[#26]: https://github.com/PuneetGopinath/chrono-capsule/pull/26
[#24]: https://github.com/PuneetGopinath/chrono-capsule/pull/24
[#23]: https://github.com/PuneetGopinath/chrono-capsule/pull/23
[#18]: https://github.com/PuneetGopinath/chrono-capsule/pull/18
[#16]: https://github.com/PuneetGopinath/chrono-capsule/pull/16
[#14]: https://github.com/PuneetGopinath/chrono-capsule/pull/14
[#13]: https://github.com/PuneetGopinath/chrono-capsule/pull/13
[#12]: https://github.com/PuneetGopinath/chrono-capsule/pull/12
[#10]: https://github.com/PuneetGopinath/chrono-capsule/pull/10
[#9]: https://github.com/PuneetGopinath/chrono-capsule/pull/9
[#7]: https://github.com/PuneetGopinath/chrono-capsule/pull/7

[v1.0.0]: https://github.com/PuneetGopinath/chrono-capsule/releases/tag/v1.0.0
[v1.0.0-beta]: https://github.com/PuneetGopinath/chrono-capsule/releases/tag/v1.0.0-beta
[v1.0.0-alpha]: https://github.com/PuneetGopinath/chrono-capsule/releases/tag/v1.0.0-alpha