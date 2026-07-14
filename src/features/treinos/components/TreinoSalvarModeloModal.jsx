import {
  DIVISOES_MODELO_PESSOAL,
  GENEROS_REFERENCIA_MODELO,
  inferSplitFromWorkout,
} from "../utils/workoutTemplateSanitization";

function TreinoSalvarModeloModal({
  treino,
  modelo,
  modo = "create",
  onClose,
  onSubmit,
}) {
  const valoresIniciais = {
    name: modelo?.nome || treino?.rotina || "",
    referenceGender: modelo?.genero || "Unissex",
    splitType: modelo?.divisao || inferSplitFromWorkout(treino),
    objective: modelo?.objetivo || treino?.objetivo || "",
    level: modelo?.nivel || treino?.nivel || "",
    description: modelo?.descricao || "",
  };

  function enviar(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      referenceGender: String(formData.get("referenceGender") || "Unissex"),
      splitType: String(formData.get("splitType") || "Outro"),
      objective: String(formData.get("objective") || "").trim(),
      level: String(formData.get("level") || "").trim(),
      description: String(formData.get("description") || "").trim(),
    };

    if (!payload.name) return;
    onSubmit(payload);
  }

  const titulo = modo === "edit" ? "Editar modelo pessoal" : "Salvar como modelo";

  return (
    <div className="treino-template-overlay">
      <section
        className="treino-save-template-modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        data-testid="save-template-modal"
      >
        <header className="treino-template-header">
          <div>
            <span className="treino-template-step">Modelo pessoal</span>
            <h2>{titulo}</h2>
            <p>
              O modelo salva apenas estrutura, exercicios e orientacoes gerais.
              Dados do aluno, datas, status e cargas individuais nao entram no modelo.
            </p>
          </div>
          <button type="button" onClick={onClose} className="treino-template-close">
            Fechar
          </button>
        </header>

        <form className="treino-save-template-form" onSubmit={enviar}>
          <label>
            <span>Nome do modelo</span>
            <input
              name="name"
              defaultValue={valoresIniciais.name}
              maxLength={90}
              required
              data-testid="custom-template-name"
            />
          </label>

          <label>
            <span>Genero de referencia</span>
            <select
              name="referenceGender"
              defaultValue={valoresIniciais.referenceGender}
              data-testid="custom-template-gender"
            >
              {GENEROS_REFERENCIA_MODELO.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Divisao</span>
            <select
              name="splitType"
              defaultValue={valoresIniciais.splitType}
              data-testid="custom-template-split"
            >
              {DIVISOES_MODELO_PESSOAL.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Objetivo</span>
            <input
              name="objective"
              defaultValue={valoresIniciais.objective}
              maxLength={90}
              data-testid="custom-template-objective"
            />
          </label>

          <label>
            <span>Nivel</span>
            <select name="level" defaultValue={valoresIniciais.level} data-testid="custom-template-level">
              <option value="">Selecione</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediario">Intermediario</option>
              <option value="Avancado">Avancado</option>
            </select>
          </label>

          <label className="treino-save-template-wide">
            <span>Descricao</span>
            <textarea
              name="description"
              defaultValue={valoresIniciais.description}
              rows="3"
              maxLength={220}
              data-testid="custom-template-description"
            />
          </label>

          <p className="treino-template-privacy" data-testid="custom-template-privacy">
            Aviso de privacidade: este modelo fica disponivel apenas para o seu usuario.
            Modelos oficiais seguem protegidos no codigo e nao podem ser alterados aqui.
          </p>

          <footer className="treino-template-footer">
            <button type="button" onClick={onClose} className="app-button app-button-secondary">
              Cancelar
            </button>
            <button type="submit" className="app-button app-button-primary" data-testid="custom-template-save">
              {modo === "edit" ? "Salvar alteracoes" : "Salvar modelo"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default TreinoSalvarModeloModal;
