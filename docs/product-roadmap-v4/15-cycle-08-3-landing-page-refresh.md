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
