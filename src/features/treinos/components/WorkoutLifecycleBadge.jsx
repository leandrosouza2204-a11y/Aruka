import { getWorkoutLifecyclePresentation } from "../utils/workoutLifecyclePresentation";

function WorkoutLifecycleBadge({ treino, status }) {
  const presentation = getWorkoutLifecyclePresentation(status || treino || {});

  return (
    <span
      className={`workout-lifecycle-badge ${presentation.badgeClassName}`}
      data-testid={`workout-lifecycle-badge-${presentation.status}`}
      title={presentation.description}
      aria-label={`Estado do treino: ${presentation.label}. ${presentation.description}`}
    >
      {presentation.label}
    </span>
  );
}

export default WorkoutLifecycleBadge;
