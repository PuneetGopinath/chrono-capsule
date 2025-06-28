# Changelog v0

Note that the displayed date is in the format `dd-mm-yyyy`

## [v0.1.0]

> **Released:** `28-06-2025`

### Added features
- Capsule creation with support for encryption of message and media (using AES-256-CBC) \[BACKEND ONLY\]
- Support up to 5000 characters in messages and a maximum of 10 media files per capsule
- User registration and login \[BACKEND ONLY\]
- AES-256-CBC decryption prior to delivery of email
- Email delivery via SMTP using HTML + text
- Cron based unlock scheduler
- Health route check (`/health`)

### Chores
- Added `README.md` 😁, `dependabot.yml`, `CHANGELOG.md` and `ISSUE_TEMPLATE`

[v0.1.0]: https://github.com/PuneetGopinath/chrono-capsule/releases/tag/v0.1.0