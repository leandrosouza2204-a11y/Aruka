function sessionChangedError() {
  const error = new Error("A sessão mudou durante o carregamento do perfil.");
  error.code = "STUDENT_PROFILE_SESSION_CHANGED";
  return error;
}

export async function loadProfileForSession({ expectedUserId, getUser, fetchProfile }) {
  const initialUser = await getUser();
  if (!initialUser?.id || (expectedUserId && initialUser.id !== expectedUserId)) {
    throw sessionChangedError();
  }

  const payload = await fetchProfile();
  const currentUser = await getUser();
  if (!currentUser?.id || currentUser.id !== initialUser.id) {
    throw sessionChangedError();
  }

  return { payload, user: currentUser };
}
