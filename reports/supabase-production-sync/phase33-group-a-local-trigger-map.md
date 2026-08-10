# Phase 3.3 Group A Local Trigger Map

Target function: `public.set_workout_templates_updated_at()`.

Local trigger count: `1`.

| Schema | Table | Trigger | Timing | Event | Orientation | Function |
| --- | --- | --- | --- | --- | --- | --- |
| public | workout_templates | set_workout_templates_updated_at | before | update | row | public.set_workout_templates_updated_at() |

No direct application RPC caller was found. The local dependency path is the `public.workout_templates` trigger.
