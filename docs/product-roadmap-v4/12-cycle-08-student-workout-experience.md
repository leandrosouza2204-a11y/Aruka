# Cycle 08 - Student Workout Experience

Cycle 08 improves the student workout execution flow without database, migration or RPC changes.

## Video provider

The MVP supports YouTube watch URLs, `youtu.be`, mobile YouTube and Shorts. The app parses the provider and video id with an allowlist, then builds an internal `https://www.youtube-nocookie.com/embed/{VIDEO_ID}` URL. Arbitrary iframe URLs, fake YouTube domains and unsafe schemes are blocked.

The professional editor keeps video optional. Empty URLs are valid; unsupported URLs show a friendly validation error before save.

## Timer model

The rest timer uses the prescribed rest text already present in `treino_exercicios.descanso` and `workout_execution_exercises.prescribed_rest_snapshot`. Accepted MVP formats are seconds (`30`, `60`, `90s`, `120s`), minutes (`1 min`, `1min`) and `mm:ss`.

The source of truth is an absolute deadline, not incremental decrement. UI repaint may use an interval, but remaining time is always recalculated from `restEndsAt - Date.now()`.

The execution UI presents rest as a central sports stopwatch overlay with circular progress. The student can minimize it to a compact floating timer, reopen it, skip rest or restart rest without changing the deadline model or adding notifications.

The timer starts only when the student explicitly marks a set as done and the set has real execution data. Entering reps or load records performance data but does not complete the set by itself. This fixes the visibility regression where auto-completed data made the checkbox send `false` on click, so no overlay or compact timer appeared.

The last-set guard uses the same prescribed series count used by the rendered execution rows. For a 4-series exercise, rest starts after sets 1, 2 and 3, and not after set 4.

## Prescribed set rows

Execution rows are derived from the execution snapshot `prescribedSeries`, not from the reps text and not from a fixed 5-row fallback. If the snapshot says 1, 2, 3, 4, 5 or more series, the UI renders that count.

When prescribed series is invalid or missing, the UI renders one row as the safe fallback. If an active session already has persisted sets above the prescribed count, those rows remain visible so current-session data is not silently hidden or truncated.

## Prescribed versus actual load

The professional prescription keeps `treino_exercicios.carga` as the reference source and copies it into `workout_execution_exercises.prescribed_load_snapshot` when the student starts an execution session.

The student records actual execution load per set in `workout_execution_sets.load_value`, with the existing `load_unit` and `bodyweight` semantics preserved. The execution UI labels the exercise context as prescribed load and the per-set input as actual load, so `24 kg` prescribed is not mistaken for what the student actually used.

The student can record less, equal or more load than prescribed without MVP warnings. The save payload does not include `prescribedLoad`, and a prescribed load is never auto-recorded as executed load when the student marks a set done.

Execution history, best set selection and progression comparisons use actual set load from `loadValue`, not prescribed load.

## Actual execution history retrieval

Cycle 08 now proves the full previous-execution path with a local runtime fixture. Session A records Supino reto with 12 reps at 22 kg, 10 reps at 24 kg and 10 reps at 26 kg, including RIR/RPE values 4/6, 2/8 and 0/10. Those values persist in `workout_execution_sets` and are returned by the same application payload path used by the student and professional views.

The student state RPC is `get_my_workout_execution_state`, and the professional history RPC is `get_student_workout_execution_history`. Both reuse `workout_execution_session_payload`, which already returns nested exercises and sets. No new SQL, migration or RPC is required, and the UI does not add per-exercise fetches.

When the student opens a new Session B for the same exercise, current inputs remain empty. The previous execution block reads `reference.previousExercise.sets` from completed history and starts compact by default, showing the previous date, best set and natural series count before the current inputs. Details expand inline on demand to reveal each performed set with actual load and RIR/RPE.

The previous execution reference uses progressive disclosure during the workout. It does not repeat the prescription already shown above the block, and it does not show internal reference copy in the compact state.

The student execution history cards and the professional execution history cards are compact by default and expand on demand. Expanded history shows prescribed context separately from actual performed sets, preserving `treino_exercicios.carga` as prescription and `workout_execution_sets.load_value` as the performed load source.

## Background and reload

The active timer stores only non-sensitive local context: session id, exercise id, set number, duration and deadline. On `visibilitychange`, `focus` and `pageshow`, the UI recalculates remaining time from the deadline. Reload restores the active timer when the session still matches and the deadline has not expired.

## Active workout edit

Professionals can use "Editar treino" on active workouts from the existing workout list actions. The edit path reuses the current editor and preserves the active workout identity: student, legacy status and lifecycle status are forced from the original active workout on save. Completed and archived workouts remain outside the edit action.

If an active workout is edited before a student starts a new execution, the next execution receives the updated prescription snapshot. If a session is already in progress, the session continues using its existing execution snapshot.

## Limitations

Instagram embeds, PWA, Capacitor, browser notifications, offline-first execution, rest analytics, AI recommendations and exercise identity migrations remain out of scope.
