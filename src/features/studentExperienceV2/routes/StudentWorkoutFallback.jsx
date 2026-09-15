import { Navigate, useParams } from "react-router-dom";

function StudentWorkoutFallback() {
  const { sessionId } = useParams();
  return <Navigate replace state={{ resumeSessionId: sessionId, studentV2PlayerPending: true }} to="/minha-area" />;
}

export default StudentWorkoutFallback;
