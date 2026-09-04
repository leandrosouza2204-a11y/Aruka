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

## MANUAL VISUAL QA - V2

User visual QA on desktop and Android approved the V2 direction with refinements:

- desktop heading widths were too restrictive and caused premature wrapping;
- some section intros used less horizontal space than the composition allowed;
- mobile editorial paragraphs needed more controlled alignment;
- one functionality paragraph still used internal implementation language;
- the landing needed a short institutional brand story;
- full institutional brand content needed a dedicated public page instead of making the commercial landing too long.

V2_MANUAL_VISUAL_QA=PASS_WITH_REFINEMENTS

## V3_BRAND_AND_TYPOGRAPHY

V3 implemented:

- wider desktop section heading containers without forcing `white-space: nowrap`;
- controlled mobile text justification for editorial paragraphs only;
- commercial replacement copy in the funcionalidades section;
- short landing brand story after benefícios and before como funciona;
- public `/sobre` route with institutional story, origin, manifesto, mission, vision, values and signature;
- clear statement that Aruka is an original brand name and does not correspond to an existing tupi-guarani word;
- footer tagline updated to `Tecnologia para quem transforma vidas.`;
- public navigation includes `Sobre` without changing authenticated routes.

Institutional safeguards:

- no generic indigenous images, symbols or decorative cultural graphics were introduced;
- no translation or false etymology was invented for Aruka;
- no product feature, pricing or feature gating model was changed.

V3_IMPLEMENTED=YES
BRAND_STORY_SECTION=YES
ABOUT_PAGE=YES
V3_MANUAL_QA=PENDING

## MANUAL VISUAL QA - V3

User visual QA found refinements still required:

- incomplete mobile paragraph justification;
- brand story logo composition too small for the reserved visual area;
- `/sobre` did not show the complete institutional content in the manual preview;
- pricing copy still sounded too internal;
- desktop width and composition still felt narrow in large viewports.

V3_MANUAL_VISUAL_QA=FAIL_REFINEMENTS_REQUIRED

## V4_FINAL_POLISH

V4 implemented:

- mobile editorial paragraph justification expanded to hero support copy, section intros, brand story, final CTA and `/sobre` prose;
- card descriptions, labels, badges, navigation and headings remain left-aligned;
- desktop containers expanded to better use large viewports while preserving the approved V2/V3 structure;
- brand story visual composition replaced the empty logo card with a larger integrated Aruka symbol;
- `/sobre` kept the complete institutional content: story, origin, manifesto, mission, vision, values and signature;
- plans copy was rewritten with a more commercial tone and simple period descriptions;
- internal wording such as administrative release language was removed from public plan copy.

V4_IMPLEMENTED=YES
V4_MANUAL_QA=PENDING

## MANUAL VISUAL QA - V4

User visual QA found blocking issues still required before closing Cycle 08.3:

1. desktop section introductions still did not follow the requested centered composition;
2. `/sobre` continued rendering only the institutional tagline in the user's real Preview validation.

V4_MANUAL_DESKTOP_QA=FAIL

## V5_DESKTOP_AND_ABOUT_FIX

V5 implemented:

- desktop section introductions for operation, functionalities, benefits, how it works, plans and FAQ now use a centered editorial composition;
- headings and introductory paragraphs are centered inside a wide section heading container without manual line breaks;
- card grids and approved factual content were preserved;
- FAQ received an introductory paragraph so it follows the same required composition contract;
- `/sobre` was validated in the production build with direct navigation, reload and landing CTA navigation;
- no mobile-specific work, database work, auth work, pricing change or PWA strategy change was performed.

V5_IMPLEMENTED=YES
V5_AUTOMATED_QA=PASS
V5_DESKTOP_MANUAL_QA=PENDING

## ABOUT SPA NAVIGATION AND DESKTOP ALIGNMENT FIX

Manual validation after V5:

- V5_MANUAL_DESKTOP_COMPOSITION=PASS
- ABOUT_DIRECT_LOAD=PASS
- ABOUT_BRAND_STORY_CTA=FAIL
- ABOUT_DESKTOP_ALIGNMENT=NEEDS_REFINEMENT

Implemented fix:

- route changes now reset window scroll position through the router, so the brand story CTA opens `/sobre` at the top without a hard reload;
- header and footer About links keep using the same router navigation contract;
- `/sobre` desktop hero, origin, manifesto and values section introductions now use centered editorial composition;
- mission and vision remain as two cards on desktop, with card content left aligned for readability;
- footer desktop composition was preserved.

ABOUT_BRAND_STORY_CTA_FIXED=YES
ABOUT_DESKTOP_CENTERING_IMPLEMENTED=YES
FINAL_MANUAL_QA=PENDING

## MOBILE CENTERING AND REAL DASHBOARD SCREENSHOT

Continuation after blocked asset:

- PREVIOUS_BLOCKER=DASHBOARD_ASSET_NOT_ACCESSIBLE
- DASHBOARD_ASSET_NOW_AVAILABLE=YES
- DASHBOARD_ASSET_PATH=public/aruka-dashboard.png
- DESKTOP_CENTERED_COMPOSITION_MANUAL_QA=PASS
- ABOUT_PAGE_MANUAL_QA=PASS
- MOBILE_CENTERED_COMPOSITION_REQUESTED=YES
- REAL_DASHBOARD_SCREENSHOT_REQUESTED=YES

Implemented fix:

- mobile landing section introductions now follow the same centered editorial composition approved on desktop;
- mobile hero eyebrow, headline, supporting copy and CTA flow are centered;
- mobile supporting copy for landing introductions no longer uses justified alignment;
- the hero dashboard mock was replaced by the real dashboard screenshot provided by the user;
- the real dashboard image uses intrinsic dimensions, high-priority loading, descriptive alt text and a discreet image container;
- no database, Auth, Supabase, pricing, About content or Cycle 09 work was performed.

MOBILE_CENTERED_COMPOSITION_IMPLEMENTED=YES
REAL_DASHBOARD_SCREENSHOT_IMPLEMENTED=YES
FINAL_MANUAL_QA=PENDING

## ABOUT PAGE PREMIUM REDESIGN

Continuation after approved functional About QA:

- ABOUT_PAGE_FUNCTIONAL_QA=PASS
- ABOUT_PAGE_VISUAL_REDESIGN_REQUESTED=YES
- ABOUT_PAGE_VISUAL_DIRECTION=premium / editorial / sophisticated brand experience
- ABOUT_PAGE_REDESIGN_IMPLEMENTED=YES
- ABOUT_PAGE_FINAL_VISUAL_QA=PENDING

Implemented refinement:

- `/sobre` now uses a premium editorial composition with fewer card-like blocks;
- the Aruka brand symbol is integrated as a large abstract visual element instead of a generic illustration;
- hero, origin, manifesto, mission, vision, values, closing signature and footer preserve the approved institutional content;
- desktop widths 1280, 1366, 1440 and 1920 were validated against horizontal overflow and section structure;
- mobile widths 360, 390 and 412 were validated for stacked reading flow and horizontal overflow;
- landing-to-About navigation, brand story CTA, footer About link and About-to-home navigation were validated.

ABOUT_PAGE_PREMIUM_REDESIGN_IMPLEMENTED=YES
ABOUT_PAGE_RESPONSIVE_QA=PASS
ABOUT_PAGE_NAVIGATION_REGRESSION=PASS
ABOUT_PAGE_FINAL_VISUAL_QA=PENDING

## LANDING PREMIUM VISUAL ALIGNMENT

Continuation after approved About page visual QA:

- USER_REQUEST=LANDING_PREMIUM_VISUAL_ALIGNMENT
- ABOUT_PAGE_USED_AS_APPROVED_VISUAL_REFERENCE=YES
- LANDING_VISUAL_DIRECTION=premium / editorial / product-led SaaS
- LANDING_COMMERCIAL_CONTENT_PRESERVED=YES
- LANDING_PREMIUM_ALIGNMENT_IMPLEMENTED=YES
- FINAL_LANDING_MANUAL_VISUAL_QA=PENDING

Applied principles:

- the landing keeps the current commercial copy, CTAs, navigation, product modules, student area, plans and FAQ;
- the real dashboard screenshot remains the hero product visual;
- the hero now uses a subtler brand-led composition with low-opacity abstract Aruka symbol treatment;
- operation, benefits, how it works, plans and FAQ were softened with editorial numbering, line separators and reduced card weight;
- functionality previews remain visible and product-led, but their composition is less grid-card dependent;
- the student area and final CTA use the same dark navy/cyan language as the approved About manifesto;
- the brand story section was aligned with the About origin/identity treatment while preserving the `/sobre` route;
- no Auth, database, Supabase, PWA implementation, pricing model or Cycle 09 work was performed.

Files modified:

- `src/pages/LandingPage.jsx`
- `src/pages/LandingPage.css`
- `docs/product-roadmap-v4/15-cycle-08-3-landing-page-refresh.md`

QA evidence:

- DESKTOP_1280=PASS
- DESKTOP_1366=PASS
- DESKTOP_1440=PASS
- DESKTOP_1920=PASS
- MOBILE_360=PASS
- MOBILE_390=PASS
- MOBILE_412=PASS
- LANDING_HORIZONTAL_OVERFLOW=NO
- ABOUT_DIRECT_LOAD=PASS
- ABOUT_SPA_NAVIGATION=PASS
- BRAND_CTA_TO_ABOUT=PASS
- ABOUT_BACK_HOME=PASS
- PWA_REGRESSION=PASS

LANDING_PREMIUM_ALIGNMENT_IMPLEMENTED=YES
LANDING_RESPONSIVE_QA=PASS
LANDING_ABOUT_REGRESSION_QA=PASS
LANDING_PWA_REGRESSION_QA=PASS
FINAL_LANDING_MANUAL_VISUAL_QA=PENDING

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
V3 implemented: YES
Brand story section: YES
About page: YES
V3 manual QA: PENDING
V4 implemented: YES
V4 manual QA: PENDING
V4 manual desktop QA: FAIL
V5 implemented: YES
V5 automated QA: PASS
V5 desktop manual QA: PENDING
V5 manual desktop composition: PASS
About direct load: PASS
About brand story CTA: FIXED
About desktop centering implemented: YES
Final manual QA: PENDING
Previous blocker: DASHBOARD_ASSET_NOT_ACCESSIBLE
Dashboard asset now available: YES
Mobile centered composition requested: YES
Real dashboard screenshot requested: YES
Mobile centered composition implemented: YES
Real dashboard screenshot implemented: YES
About page functional QA: PASS
About page visual redesign requested: YES
About page redesign implemented: YES
About page final visual QA: PENDING
Landing premium visual alignment requested: YES
About visual language inherited by landing: YES
Landing premium alignment implemented: YES
Landing final manual visual QA: PENDING
