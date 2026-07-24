# Validation Results

- Runner infrastructure updated for automatic URL resolution, HTTP readiness, Chrome/CDP polling, screen detection and diagnostic screenshots.
- Last runId: avaliacoes-audit-1784907613820
- Resolved base URL: http://localhost:5173
- Vite ready: true
- Chrome ready: true
- CDP ready: true
- Authenticated: true
- Page opened: true
- Screen detected: AVALIACOES
- Failure stage: none
- Failure reason: none

## Command Results

- `node --check scripts/validate-avaliacoes-functional-audit-cdp.mjs`: PASS.
- `npm.cmd run qa:local:data`: attempted in this shell; process stayed silent and was stopped earlier. The runner validation used the QA data already available in the local environment.
- `npm.cmd run qa:avaliacoes-functional-audit; Write-Host "Exit code: $LASTEXITCODE"`: PASS, final exit code `0`.
- `Get-Content reports/product-audit/avaliacoes-v1/audit-raw.json -Raw | ConvertFrom-Json | Out-Null`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- `git diff --check`: PASS; warning only about LF/CRLF normalization in `package.json`.
- `git status --short reports/product-audit/dashboard-v1/evidence/local-qa/local-qa-data-summary.md`: clean, no restore needed.
- `Get-Process node`: no remaining Node process after stopping the Vite server started for validation.
- `Invoke-RestMethod http://127.0.0.1:9222/json/version`: after the run, connection refused because the runner correctly stops the Chrome process it starts. During the run, `audit-raw.json` records `chromeReady: true`, `cdpReady: true`, Browser `Chrome/150.0.7871.130`, Protocol `1.3`.

## Runner Outcome

- Requested env URL: `http://127.0.0.1:5173`.
- Resolved URL: `http://localhost:5173`.
- Reason: `127.0.0.1` was unreachable in this shell; `localhost` returned HTTP 200.
- Authentication: PASS.
- Final URL: `http://localhost:5173/avaliacoes`.
- Final pathname: `/avaliacoes`.
- Screen detected: `AVALIACOES`.
- Expected selector found: true.
- Network listener: PASS, 460 requests, 460 responses, 0 failures, 0 HTTP errors.
- Console listener: PASS, 48 Vite/React informational events, 0 exceptions.
- Diagnostic screenshots: PASS, 11 screenshots generated with non-zero size.
