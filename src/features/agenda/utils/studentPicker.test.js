import test from "node:test";
import assert from "node:assert/strict";
import {
  filterStudents,
  getInitialStudentIds,
  nextStudentIndex,
  normalizeStudentSearch,
  toggleStudentId,
  uniqueStudentsById,
} from "./studentPicker.js";

const students = [
  { id: "1", nome: "João Ávila" },
  { id: "2", nome: "João Silva" },
  { id: "3", nome: "Maria Souza" },
];

test("normaliza acentos, caixa e espaços da pesquisa", () => {
  assert.equal(normalizeStudentSearch("  JOÃO Ávila "), "joao avila");
});

test("pesquisa nome completo ou parcial sem acentos", () => {
  assert.deepEqual(filterStudents(students, "avila").map(({ id }) => id), ["1"]);
  assert.deepEqual(filterStudents(students, "JOAO").map(({ id }) => id), ["1", "2"]);
  assert.deepEqual(filterStudents(students, "sou").map(({ id }) => id), ["3"]);
});

test("distingue nomes semelhantes pelo id e não duplica alunos", () => {
  const duplicated = [...students, { id: "2", nome: "Nome repetido" }];
  assert.deepEqual(uniqueStudentsById(duplicated).map(({ id }) => id), ["1", "2", "3"]);
});

test("seleção múltipla é preservada ao alternar e remover participantes", () => {
  assert.deepEqual(toggleStudentId(["1"], "2"), ["1", "2"]);
  assert.deepEqual(toggleStudentId(["1", "2"], "1"), ["2"]);
  assert.deepEqual(toggleStudentId(["1", "1"], "3"), ["1", "3"]);
});

test("preserva participantes por id ao editar compromisso existente", () => {
  const editing = { alunos: [{ id: "2", nome: "João Silva" }, { id: "2", nome: "João Silva" }, { id: "3", nome: "Maria Souza" }] };
  assert.deepEqual(getInitialStudentIds(editing), ["2", "3"]);
});

test("retorna estado vazio para pesquisa sem resultado", () => {
  assert.deepEqual(filterStudents(students, "inexistente"), []);
});

test("filtra localmente listas extensas", () => {
  const largeList = Array.from({ length: 2500 }, (_, index) => ({ id: String(index), nome: `Aluno ${index}` }));
  assert.deepEqual(filterStudents(largeList, "Aluno 2499"), [{ id: "2499", nome: "Aluno 2499" }]);
});

test("navegação por teclado circula e respeita início e fim", () => {
  assert.equal(nextStudentIndex(-1, "ArrowDown", 3), 0);
  assert.equal(nextStudentIndex(2, "ArrowDown", 3), 0);
  assert.equal(nextStudentIndex(0, "ArrowUp", 3), 2);
  assert.equal(nextStudentIndex(1, "Home", 3), 0);
  assert.equal(nextStudentIndex(1, "End", 3), 2);
  assert.equal(nextStudentIndex(0, "ArrowDown", 0), -1);
});
