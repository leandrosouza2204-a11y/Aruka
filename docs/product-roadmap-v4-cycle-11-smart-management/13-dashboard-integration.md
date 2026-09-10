# Stage 11.8 - Dashboard Integration

## Objective

Expose Gestão Inteligente from the professional dashboard with factual configuration status and a direct internal CTA.

## Discovery and Data Source

The existing dashboard loads students, payments, plans, workouts and assessments. It does not load Smart Management data. Stage 11.8 adds an isolated, minimal summary query through `getSmartManagementDashboardSummary()`.

The summary counts active rows only from `smart_management_locations` and `smart_management_services`. Both queries use the authenticated professional id, preserve the existing browser Supabase/RLS boundary, and request only `id` with exact count metadata.

`DASHBOARD_DATA_SOURCE=smart_management_locations + smart_management_services (active counts)`

`SUPABASE_CHANGE=NO`

## Dashboard Card

The dedicated Gestão Inteligente card appears after onboarding. Its sole destination is `/gestao-inteligente`, through the clear CTA `Configurar agora` for an empty setup or `Acessar Gestão Inteligente` otherwise.

It presents only active location and service counts, plus one derived factual state:

- Empty: configure locations and services.
- Locations only: add services.
- Services only: add locations for comparisons.
- Ready: ready for simulations and comparisons.

Loading uses a compact skeleton. An error stays isolated inside the card and its retry reruns the real summary query.

## Guardrails

`DASHBOARD SURFACES FACTS.`

`DASHBOARD DOES NOT INVENT METRICS.`

`DASHBOARD DOES NOT RECOMMEND LOCATIONS.`

The dashboard does not calculate profitability, identify a best location, rank locations, expose transfer rules or margins, generate commercial presentation text, or use Financeiro data. Archived records, identifiers and data from another professional are not exposed.

## UX, Accessibility and Mobile

The card has a labelled section and heading, status and alert announcements, visible native focus treatment, a normal internal link, and no conflicting clickable-card behavior. The summary grid collapses to one column and controls retain 44px minimum targets on small screens. It stays inside the existing professional shell, including PWA route handling and safe-area rules.

## Validation

Stage-specific scripts validate integration, data summary, responsive behavior, accessibility, navigation, UTF-8 and mojibake guards. Authenticated visual runtime is recorded separately when available.
