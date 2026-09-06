import assert from "node:assert/strict";
import test from "node:test";
import {
  criarPayloadExercicioPessoal,
  podeGerenciarExercicioBiblioteca,
  validarFormularioExercicioBiblioteca,
} from "./exerciseLibraryForm.js";
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
    youtube_url: "https://youtu.be/dQw4w9WgXcQ",
    media_type: "youtube",
    media_path: "hidden/path.mp4",
    status: "active",
  });

  assert.equal(exercicio.nome, "Supino reto");
  assert.equal(exercicio.origem, "official");
  assert.equal(exercicio.origemLabel, "Oficial");
  assert.equal(exercicio.possuiMidia, true);
  assert.equal(exercicio.midia.label, "YouTube");
  assert.equal(exercicio.midia.videoId, "dQw4w9WgXcQ");
  assert.equal(exercicio.midia.embedUrl, "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  assert.equal(exercicio.midia.thumbnailUrl, "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
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

  assert.equal(erro.message, "Não foi possível carregar a biblioteca de exercícios.");
  assert.equal(erro.message.includes("permission denied"), false);
});

test("valida campos obrigatorios do exercicio pessoal", () => {
  const resultado = validarFormularioExercicioBiblioteca({
    nome: " ",
    grupoMuscular: "",
    categoria: "",
  });

  assert.equal(resultado.valido, false);
  assert.equal(resultado.erros.nome, "Informe o nome do exercício.");
  assert.equal(resultado.erros.grupoMuscular, "Informe o grupo muscular.");
  assert.equal(resultado.erros.categoria, "Informe a categoria.");
});

test("cria payload pessoal sem permitir midia ou origem oficial", () => {
  const resultado = criarPayloadExercicioPessoal(
    {
      nome: "  Remada   baixa ",
      descricao: "Costas",
      grupoMuscular: " Costas ",
      categoria: " Musculação ",
      instrucoes: "Controle a volta",
    },
    "user-1"
  );

  assert.equal(resultado.valido, true);
  assert.equal(resultado.payload.owner_id, "user-1");
  assert.equal(resultado.payload.origin, "personal");
  assert.equal(resultado.payload.status, "active");
  assert.equal(resultado.payload.name, "Remada baixa");
  assert.equal(resultado.payload.media_type, null);
  assert.equal(resultado.payload.media_path, null);
});

test("cria payload pessoal com YouTube canonico sem persistir embed ou thumbnail remoto", () => {
  const resultado = criarPayloadExercicioPessoal(
    {
      nome: "Supino reto",
      grupoMuscular: "Peitoral",
      categoria: "Musculacao",
      youtubeInput: "https://youtu.be/dQw4w9WgXcQ?si=abc",
    },
    "user-1"
  );

  assert.equal(resultado.valido, true);
  assert.equal(resultado.payload.youtube_url, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  assert.equal(resultado.payload.media_type, "youtube");
  assert.equal(resultado.payload.media_path, null);
  assert.equal(resultado.payload.thumbnail_path, null);
  assert.equal("embedUrl" in resultado.payload, false);
  assert.equal("thumbnailUrl" in resultado.payload, false);
});

test("bloqueia YouTube inseguro no formulario pessoal", () => {
  const resultado = validarFormularioExercicioBiblioteca({
    nome: "Supino reto",
    grupoMuscular: "Peitoral",
    categoria: "Musculacao",
    youtubeInput: "https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ",
  });

  assert.equal(resultado.valido, false);
  assert.equal(resultado.erros.youtubeInput, "Use um link do YouTube ou youtu.be.");
});

test("permite gerenciar somente exercicios pessoais", () => {
  assert.equal(podeGerenciarExercicioBiblioteca({ origem: "personal" }), true);
  assert.equal(podeGerenciarExercicioBiblioteca({ origem: "official" }), false);
});
