# Product Roadmap v4 - Cycle 08.3: Landing Page Refresh

## OBJECTIVE

Redesign the public Aruka landing page before presentation to new users, raising the first impression of the product while preserving authentication, pricing rules, billing, Supabase and PWA contracts.

The landing positions Aruka as a mature SaaS for online fitness consulting: organized, professional, simple, commercial and product-led.

## BASELINE

The previous landing already had the correct public route and basic sections, but visual QA identified:

- weak first-fold hierarchy;
- oversized mobile hero/mockup;
- compressed mobile navigation;
- repeated card structure;
- little section differentiation;
- generic SaaS/template feeling;
- limited use of the real product as the visual protagonist.

Landing route: `/`

Main files:

- `src/pages/LandingPage.jsx`
- `src/pages/LandingPage.css`
- `index.html`

## VISUAL_DIRECTION

Direction:

- mobile-first;
- clean SaaS;
- white/light gray backgrounds;
- navy contrast;
- blue/cyan Aruka signature;
- restrained gradients;
- real product-inspired frames using fictitious data;
- no social proof or metrics without evidence.

External benchmark `coachflow.com.br` was used only for hierarchy, rhythm, product clarity and commercial density. No text, brand, asset, code or pixel layout was copied.

## IMPLEMENTED_SECTIONS

- Header with desktop navigation and accessible mobile menu.
- Hero with the headline `Sua consultoria fitness, organizada para crescer.`
- Value strip.
- Problem/solution transition.
- Product showcase with real Aruka modules.
- Student experience section with mobile/PWA framing.
- Benefits with four focused cards.
- How it works with four compact steps.
- Pricing presentation preserving existing plan labels/features.
- Small FAQ with supported product questions.
- Final CTA.
- Footer with legal links.

## RESPONSIVE_STRATEGY

The CSS was rebuilt mobile-first:

- compact header at small widths;
- hamburger menu instead of compressed nav;
- product frames scale down before they stack;
- hero copy appears before product visual on mobile;
- grid sections progressively move from one column to two/four columns;
- 320px receives a specific fallback that hides the mock sidebar to avoid overflow.

Target validation widths:

- 320px;
- 360px;
- 390px;
- 412px;
- 768px;
- 1280px;
- 1440px.

## ACCESSIBILITY

The landing keeps semantic sections, ordered headings, focus-visible styles, accessible menu button state, adequate touch targets and native `details/summary` FAQ behavior.

Motion is limited to lightweight hover transitions and respects `prefers-reduced-motion`.

## PERFORMANCE

No new runtime dependency, video, remote image or heavy media was added. The product showcase is CSS/HTML-based with existing brand assets only.

PWA metadata in `index.html` was preserved:

- favicon;
- apple touch icon;
- theme color;
- manifest integration through Vite PWA;
- mobile web app metadata.

## PWA_REGRESSION

Required regression validators:

- `qa:pwa-installability`;
- `qa:pwa-install-state`;
- `qa:pwa-role-install-experience`;
- `qa:pwa-ios-experience`;
- `qa:pwa-cache-security`;
- `qa:pwa-update-safety`.

## QA_PLAN

Automated:

- `npm.cmd run lint`;
- `npm.cmd run build`;
- `npm.cmd run qa:visible-ui-copy`;
- PWA validators listed above.

Responsive:

- validate landing at 320, 360, 390, 412, 768, 1280 and 1440 widths;
- confirm no horizontal overflow;
- confirm header, hero, CTA, product mockup, pricing and footer do not clip.

Runtime/preview:

- open Preview URL;
- confirm HTTP 200;
- user performs visual QA on desktop and mobile.

## MANUAL_QA_PENDING

Manual visual QA is pending by design.

The PR must remain open until the user reviews the Preview and either approves or requests refinements.

## MANUAL VISUAL QA - V1

User visual QA on desktop and Android identified required refinements:

- accentuation issues in Portuguese visible copy and metadata;
- problem/solution card redesign required;
- functionality visuals inaccurate because generic charts suggested unsupported product behavior;
- student/PWA terminology inaccurate for the buyer-facing message;
- pricing tiers inaccurate because Starter/Profissional/Premium implied feature gating;
- FAQ needed a commercial rewrite without internal development commentary;
- desktop header and footer needed stronger integration.

## V2_REFINEMENT

V2 implemented a fidelity-focused revision:

- visible landing copy and SEO metadata use accented Portuguese;
- internal/development copy was removed from the public landing;
- the problem/solution block now uses compact benefits instead of the previous before/after panel;
- generic charts were removed from the hero and functionality cards;
- product previews use anonymized, fictitious data shaped after existing Aruka surfaces: cards, lists, status badges, alerts and payment/access rows;
- student experience copy focuses on the existing area do aluno flow: active workout, execution session, history and mobile access;
- PWA terminology was removed from buyer-facing student copy;
- pricing now reflects the current full-access model with periods from `src/data/commercialPlans.js`.

## PRODUCT_FIDELITY_REVIEW

Feature fidelity checklist:

| Feature | Exists in product | Visual match | Copy accurate |
| --- | --- | --- | --- |
| Gestão de alunos | YES | PASS | PASS |
| Treinos | YES | PASS | PASS |
| Avaliações | YES | PASS | PASS |
| Financeiro | YES | PASS | PASS |
| Acompanhamento | YES | PASS | PASS |
| Área do aluno | YES | PASS | PASS |

Marketing accuracy:

- MARKETING_ACCURACY=REQUIRED
- MARKETING_PRODUCT_FIDELITY=PASS
- Fake charts removed: YES
- Future automation promises: NO
- Customer data used: NO

## PLANS_REVIEW

Current commercial model observed in the codebase:

- CURRENT_PLANS=Mensal, Trimestral, Semestral, Anual
- CURRENT_PRICES=NOT_PUBLIC_IN_CODE
- BILLING_PERIODS=30 days, 3 months, 6 months, 12 months
- STUDENT_LIMITS=NOT_EVIDENCED
- FEATURE_GATING=NO
- FULL_ACCESS=YES_WHEN_ACCESS_IS_RELEASED

Landing representation:

- fake Starter/Profissional/Premium feature tiers removed;
- no feature gating added;
- all current resources are represented as included after access release;
- future tier segmentation remains a separate product decision.

PRODUCT_FOLLOW_UP=YES

## PWA_TRUTH

- PWA_TECHNICAL_SUPPORT=YES
- MANUAL_STUDENT_ROLE_PWA_QA=NOT_EVIDENCED_IN_THIS_CYCLE
- Landing copy uses conservative wording: browser mobile access and installable app on compatible devices.

## V2_STATUS

V2_IMPLEMENTED=YES
V2_MANUAL_QA=PENDING

## FLAGS

Implementation started: YES
Migration: NO
Remote mutation: NO
Schema change: NO
RPC change: NO
Edge changed: NO
Auth changed: NO
Pricing changed: NO
Manual visual QA: PENDING
V2 implemented: YES
V2 manual QA: PENDING
