import assert from "node:assert/strict";
import test from "node:test";
import {
  criarErroBibliotecaExercicios,
  criarOpcoesBibliotecaExercicios,
  filtrarExerciciosBiblioteca,
  mapExerciseLibraryRows,
  rowParaExercicioBiblioteca,
} from "./exerciseLibraryMapper.js";

test("normaliza exercicio oficial com midia do YouTube sem expor owner ou storage interno", () => {
  const exercicio = rowParaExercicioBiblioteca({
    id: "exercise-1",
    owner_id: "hidden",
    origin: "official",
    name: " Supino reto ",
    description: "Peitoral principal",
    muscle_group: "Peitoral",
    category: "Musculacao",
    instructions: "Controle a descida",
    youtube_url: "https://youtu.be/demo",
    media_type: "youtube",
    media_path: "hidden/path.mp4",
    status: "active",
  });

  assert.equal(exercicio.nome, "Supino reto");
  assert.equal(exercicio.origem, "official");
  assert.equal(exercicio.origemLabel, "Oficial");
  assert.equal(exercicio.possuiMidia, true);
  assert.equal(exercicio.midia.label, "YouTube");
  assert.equal("owner_id" in exercicio, false);
  assert.equal("media_path" in exercicio, false);
});

test("normaliza exercicio pessoal sem midia com fallback legivel", () => {
  const exercicio = rowParaExercicioBiblioteca({
    id: "exercise-2",
    origin: "personal",
    name: "Remada baixa",
    muscle_group: "Costas",
    category: "Musculacao",
  });

  assert.equal(exercicio.origemLabel, "Pessoal");
  assert.equal(exercicio.possuiMidia, false);
  assert.equal(exercicio.midia.label, "Sem midia");
});

test("filtra por busca sem acento, origem, grupo e midia", () => {
  const exercicios = mapExerciseLibraryRows([
    { id: "1", origin: "official", name: "Elevacao lateral", muscle_group: "Ombros", category: "Musculacao" },
    { id: "2", origin: "personal", name: "Agachamento", muscle_group: "Quadriceps", category: "Musculacao", media_type: "uploaded_video" },
  ]);

  assert.deepEqual(
    filtrarExerciciosBiblioteca(exercicios, { busca: "elevacao", origem: "official" }).map((item) => item.id),
    ["1"]
  );
  assert.deepEqual(
    filtrarExerciciosBiblioteca(exercicios, { grupoMuscular: "Quadriceps", midia: "com_midia" }).map((item) => item.id),
    ["2"]
  );
});

test("cria opcoes unicas de grupo muscular ordenadas", () => {
  const opcoes = criarOpcoesBibliotecaExercicios([
    { grupoMuscular: "Costas" },
    { grupoMuscular: "Peitoral" },
    { grupoMuscular: "Costas" },
    { grupoMuscular: "" },
  ]);

  assert.deepEqual(opcoes.gruposMusculares, ["Costas", "Peitoral"]);
});

test("mapeia erro para mensagem profissional sem expor detalhe tecnico", () => {
  const erro = criarErroBibliotecaExercicios({ message: "permission denied for table exercise_library" });

  assert.equal(erro.message, "Nao foi possivel carregar a biblioteca de exercicios.");
  assert.equal(erro.message.includes("permission denied"), false);
});
