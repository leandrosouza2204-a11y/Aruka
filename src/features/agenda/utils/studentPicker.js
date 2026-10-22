export function normalizeStudentSearch(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function uniqueStudentsById(students = []) {
  const seen = new Set();
  return students.filter((student) => {
    if (!student?.id || seen.has(student.id)) return false;
    seen.add(student.id);
    return true;
  });
}

export function filterStudents(students = [], query = "") {
  const normalizedQuery = normalizeStudentSearch(query);
  const uniqueStudents = uniqueStudentsById(students);
  if (!normalizedQuery) return uniqueStudents;
  return uniqueStudents.filter((student) => normalizeStudentSearch(student.nome).includes(normalizedQuery));
}

export function toggleStudentId(selectedIds = [], id) {
  const uniqueIds = [...new Set(selectedIds)];
  return uniqueIds.includes(id) ? uniqueIds.filter((value) => value !== id) : [...uniqueIds, id];
}

export function nextStudentIndex(currentIndex, key, itemCount) {
  if (!itemCount) return -1;
  if (key === "ArrowDown") return currentIndex < itemCount - 1 ? currentIndex + 1 : 0;
  if (key === "ArrowUp") return currentIndex > 0 ? currentIndex - 1 : itemCount - 1;
  if (key === "Home") return 0;
  if (key === "End") return itemCount - 1;
  return currentIndex;
}

export function getInitialStudentIds(editing) {
  return [...new Set((editing?.alunos || []).map((student) => student?.id).filter(Boolean))];
}
