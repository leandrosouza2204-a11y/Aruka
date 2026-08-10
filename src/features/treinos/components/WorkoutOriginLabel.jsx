import { getWorkoutOriginPresentation } from "../utils/workoutLifecyclePresentation";

function WorkoutOriginLabel({ treino }) {
  const origin = getWorkoutOriginPresentation(treino);

  return (
    <span className="workout-origin-label" data-testid="workout-origin-label">
      {origin.value}
    </span>
  );
}

export default WorkoutOriginLabel;
