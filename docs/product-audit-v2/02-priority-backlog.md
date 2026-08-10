# Priority Backlog

## Recommended First Cycle

Cycle A: fix user-facing text encoding, add visible lazy-loading feedback, add route fallback, and verify 320-414 px core navigation/pages. This is the highest-impact cycle because it affects trust and basic comprehension across many routes without requiring database work.

## Cycle A - Functional Readiness

1. P1: Correct mojibake in user-facing strings across mobile nav, Alunos, Avaliacoes, Financeiro, Treinos, templates, and summaries.
2. P1: Replace global `Suspense fallback={null}` with a visible loading state for route transitions and lazy modals.
3. P2: Add a not-found/catch-all route with a recovery path to dashboard or login.
4. P2: Standardize destructive and lifecycle confirmations for Workout Delivery, finance, plans, students, and assessments.
5. P2: Review toast/error copy so errors explain the next action and do not expose raw technical messages where avoidable.

## Cycle B - Mobile Core

1. P1: Validate and patch 320, 360, 375, 390, and 414 px for dashboard, alunos, treinos, avaliacoes, financeiro, and mobile bottom navigation.
2. P2: Normalize page containers so fixed desktop sidebar offsets never leak into mobile layouts.
3. P2: Audit modal height, footer reachability, overlay close, and focus handling on mobile.
4. P2: Ensure filters collapse ergonomically without horizontal overflow.

## Cycle C - Flow Feedback And Empty States

1. P2: Give every long-running save/deliver/archive/renew/receive action a disabled state and contextual loading label.
2. P2: Upgrade empty states that only say "none found" with a contextual CTA or filter reset.
3. P3: Harmonize contextual banners between treinos, avaliacoes, and financeiro.
4. P3: Add perceived performance safeguards for large lists and repeated module reloads.

## Cycle D - Accessibility

1. P2: Add keyboard/focus QA around custom mobile "Mais" panel and non-AccessibleModal editors.
2. P2: Ensure all icon-only or destructive buttons have accessible names and state.
3. P3: Associate validation summaries with all invalid fields consistently.
4. P3: Review contrast hints for muted text and disabled states in light/dark contexts.

## Quick Wins

- Correct mojibake strings visible in navigation and core modules.
- Add a non-null route-level loading component.
- Add a `*` not-found route.
- Add `aria-label` to the Treino editor close button and destructive day buttons where only visual text is insufficient in compact/mobile contexts.
- Normalize "avaliacao/avaliação", "acao/ação", "nao/não", "voce/você" in visible text.
