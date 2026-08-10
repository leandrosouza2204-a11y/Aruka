# Local QA Auth Provisioning And Runtime

## Flow

1. Start local Supabase with the canonical local scripts.
2. Run `npm run supabase:bootstrap`.
3. Run `npm run supabase:seed:local`.
4. Run `npm run setup:local-qa-auth`.
5. If either QA user reports `HAS_PASSWORD=NO`, set the password with the local secure runner `C:\Backups\Aruka\reset-local-qa-user-password.ps1`.
6. Open Chrome QA and authenticate with the local QA user.
7. Run `npm run qa:authenticated-runtime-precheck`.
8. Run `npm run qa:authenticated-runtime`.

## Contract

Structural provisioning is versioned:

- stable local-only user IDs;
- synthetic emails;
- confirmed email state;
- GoTrue string fields normalized to empty string;
- profile role, access type and status;
- domain links.

Local secret provisioning is not versioned:

- no plaintext password;
- no bcrypt hash;
- no tokens;
- no session data.

## Markers

`Failed to fetch`: local infrastructure or API is unavailable.

`Database error querying schema`: local auth record is structurally incompatible; inspect GoTrue logs and run `npm run setup:local-qa-auth`.

`Invalid login credentials` plus `HAS_PASSWORD=NO`: local password has not been provisioned.

`AUTH_SESSION_REQUIRED`: Chrome QA is not logged in yet.

## Users

- `personal.cycle8@example.invalid`
- `admin.cycle8@example.invalid`

Both are synthetic local QA fixtures.
