# Product Roadmap v4 - Cycle 09

## Fonte canonica

- Primary planning source: `docs/product-roadmap-v4/16-cycle-09-exercise-library-media.md`
- Source branch observed: `origin/feat/product-roadmap-v4-cycle-09-exercise-library-media`
- Overview alignment: `docs/product-roadmap-v4/01-roadmap-overview.md`

## Estado

COMPLETE

Stages 09.1, 09.2, 09.3, 09.4, 09.5, 09.6, 09.7, 09.8 and 09.9 are complete. Cycle 09 is complete.

## Objetivo

Create the Aruka exercise library and media foundation for workout assembly, with system exercises, professional custom exercises, favorites, YouTube support, uploaded professional videos and authorized student viewing inside delivered workouts.

## Contexto

Workout assembly is currently functional, but exercise selection is manual and embedded in the workout editor. The next product step is a structured library that helps professionals prescribe faster and helps students understand each prescribed exercise through safe demonstration media.

Coach Automation remains valuable, but is postponed because the current priority is strengthening the core workout creation and delivery experience.

## Dependencias concluidas

- Cycle 08.3 closed as COMPLETE.
- Authenticated runtime and local CI harness remain available.
- Existing workout lifecycle, execution snapshots and student identity contracts are in place.
- Existing YouTube playback support through `ExerciseVideoPlayer` exists for prescribed exercise URLs.

## Escopo

- Exercise library model.
- System exercises.
- Professional custom exercises.
- Search and filters by muscle group, category, source and favorites.
- Per-professional favorites.
- YouTube validation and preview.
- Uploaded professional exercise videos.
- Workout editor integration.
- Student-visible authorized exercise media.
- Authorization for professional, student and anonymous scenarios.
- Mobile/PWA QA for upload, preview and student viewing.

## Fora de escopo

- Coach workflow automation.
- AI recommendations.
- Public landing/About changes.
- Auth redesign.
- Pricing or billing changes.
- Production mutation without supervised migration/deployment authorization.
- Copying unlicensed third-party media.
- Large architectural rewrite unrelated to the exercise library.

## Riscos

- Favorite state accidentally becoming global.
- Professional-uploaded video becoming public for convenience.
- Execution history being broken by replacing snapshots with live-only references.
- Global taxonomy pollution through free-text groups/categories.
- Loading many videos in list views.
- Copying third-party media or reference UI without license.

## Criterios de aceite

- Library model implemented without breaking legacy workout rows.
- RLS/storage policies proven for professional, student and anonymous scenarios.
- Workout editor can add library exercises quickly.
- Student can view authorized demonstration media.
- Lint/build and focused QA pass.
- No remote production mutation occurs without explicit supervised migration/deployment authorization.

## QAs esperados

- Professional A reads system + own custom, not Professional B custom.
- Professional B same isolation.
- Student reads only prescribed exercises/media in own delivered workouts.
- Anonymous reads no private resources.
- Favorite is per professional.
- YouTube validator accepts supported formats and rejects unsafe/arbitrary input.
- Upload rejects invalid MIME/oversize files and enforces storage path isolation.
- Existing workouts, execution sessions and history still render after nullable library integration.
- Mobile/PWA upload and preview tested on Android and iOS standalone/browser behavior.

## Guardrails

- Any database change follows local migration, local full CI, dry-run, review, authorization and production db push.
- No Supabase production action without explicit authorization.
- Preserve existing `treino_exercicios` IDs and execution history.
- Legacy rows must remain readable with nullable `exercise_id`.
- Do not trust browser-sent user IDs for storage paths or authorization.

## Branch recomendada

`feat/product-roadmap-v4-cycle-09-exercise-library-media`

## Closeout

Cycle 09 is complete after 09.9 - Mobile/PWA QA and stabilization.

The completed implementation delivered schema shape, RLS/storage boundaries, legacy compatibility, the first read-only professional library experience, owner-scoped personal exercise creation/editing, YouTube validation/preview, private uploaded-video storage, workout editor integration, authorized student media viewing, the initial deterministic official catalog and mobile/PWA stabilization evidence.

## Proximo ciclo recomendado

Continue with the canonical future cycle: Coach Workflow Automation.

## Guardrail arquitetural

A arquitetura e a auditoria devem ser proporcionais ao risco e nao devem consumir uma parcela excessiva do ciclo sem entrega perceptivel de produto.

Priorizar auditoria minima, diagnostico rapido e implementacao de valor visivel cedo. Evitar reescrita ampla, refatoracao oportunista, documentacao excessiva e framework interno desnecessario.
