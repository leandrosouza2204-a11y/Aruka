import { ChevronLeft, Dumbbell, Layers3, MoreVertical, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DIVISOES_MODELO_TREINO,
  GENEROS_MODELO_TREINO,
  avisoModeloEditavel,
  obterModeloTreinoPorId,
  obterModelosTreino,
} from "../../../data/treinosModelos";
import TreinoSalvarModeloModal from "./TreinoSalvarModeloModal";

const etapas = ["Genero", "Divisao", "Modelo", "Destino", "Confirmacao"];
const ORIGENS = ["Todos", "Modelos oficiais", "Meus modelos"];

function TreinoTemplatesModal({
  alunos,
  carregandoModelos = false,
  erroModelos = "",
  modelosPessoais = [],
  onClose,
  onDeleteCustom,
  onEditCustom,
  onGenerate,
}) {
  const [etapa, setEtapa] = useState(0);
  const [genero, setGenero] = useState("Masculino");
  const [divisao, setDivisao] = useState("ABC");
  const [origem, setOrigem] = useState("Todos");
  const [modeloId, setModeloId] = useState("");
  const [alunoId, setAlunoId] = useState("");
  const [rotina, setRotina] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [modeloEditando, setModeloEditando] = useState(null);
  const [menuAbertoId, setMenuAbertoId] = useState("");

  const modelosOficiais = useMemo(
    () => obterModelosTreino({ genero, divisao }).map((modelo) => ({ ...modelo, origem: "official" })),
    [divisao, genero]
  );

  const meusModelos = useMemo(
    () =>
      modelosPessoais.filter((modelo) => {
        const combinaGenero =
          genero === "Todos" || modelo.genero === genero || modelo.genero === "Unissex";
        const combinaDivisao = !divisao || modelo.divisao === divisao;
        return combinaGenero && combinaDivisao;
      }),
    [divisao, genero, modelosPessoais]
  );

  const modelos = useMemo(() => {
    if (origem === "Modelos oficiais") return modelosOficiais;
    if (origem === "Meus modelos") return meusModelos;
    return [...modelosOficiais, ...meusModelos];
  }, [meusModelos, modelosOficiais, origem]);

  const modeloSelecionado =
    modelos.find((modelo) => modelo.id === modeloId) || obterModeloTreinoPorId(modeloId) || modelos[0] || null;
  const alunoSelecionado = alunos.find((aluno) => aluno.id === alunoId);

  function avancar() {
    if (etapa === 2 && modeloSelecionado && !modeloId) {
      setModeloId(modeloSelecionado.id);
      setRotina(modeloSelecionado.nome);
    }

    if (etapa === 3 && modeloSelecionado && !rotina.trim()) {
      setRotina(modeloSelecionado.nome);
    }

    setEtapa((valor) => Math.min(valor + 1, etapas.length - 1));
  }

  function voltar() {
    if (etapa === 0) {
      onClose();
      return;
    }

    setEtapa((valor) => Math.max(valor - 1, 0));
  }

  function selecionarModelo(modelo) {
    setModeloId(modelo.id);
    setRotina(modelo.nome || "");
  }

  function gerar() {
    if (!modeloSelecionado) return;

    onGenerate(modeloSelecionado.isSystem ? modeloSelecionado.id : modeloSelecionado, {
      alunoId,
      rotina: rotina.trim() || modeloSelecionado.nome,
      dataInicio,
    });
  }

  async function salvarEdicao(metadata) {
    await onEditCustom(modeloEditando.id, metadata);
    setModeloEditando(null);
  }

  const podeContinuar =
    (etapa === 0 && genero) ||
    (etapa === 1 && divisao) ||
    (etapa === 2 && modeloSelecionado) ||
    (etapa === 3 && alunoId && (rotina.trim() || modeloSelecionado)) ||
    etapa === 4;

  return (
    <div className="treino-template-overlay">
      <section
        className="treino-template-modal"
        data-testid="treino-template-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Gerar treino por modelo"
      >
        <header className="treino-template-header">
          <div>
            <span className="treino-template-step">
              Etapa {etapa + 1} de {etapas.length}
            </span>
            <h2>Gerar por modelo</h2>
            <p>{avisoModeloEditavel}</p>
          </div>
          <button type="button" onClick={onClose} className="treino-template-close">
            Fechar
          </button>
        </header>

        <div className="treino-template-progress" aria-hidden="true">
          {etapas.map((item, index) => (
            <span key={item} className={index <= etapa ? "is-active" : ""} title={item} />
          ))}
        </div>

        <div className="treino-template-scroll" data-testid="treino-template-scroll">
          {etapa === 0 && (
            <TemplateChoice title="Genero de referencia">
              {[...GENEROS_MODELO_TREINO, "Unissex", "Todos"].map((item) => (
                <ChoiceButton
                  key={item}
                  active={genero === item}
                  onClick={() => {
                    setGenero(item);
                    setModeloId("");
                  }}
                  title={item}
                  subtitle="Perfil de organizacao. Nao limita o aluno selecionado."
                />
              ))}
            </TemplateChoice>
          )}

          {etapa === 1 && (
            <TemplateChoice title="Divisao de treino">
              {[...DIVISOES_MODELO_TREINO, "Outro"].map((item) => (
                <ChoiceButton
                  key={item}
                  active={divisao === item}
                  onClick={() => {
                    setDivisao(item);
                    setModeloId("");
                  }}
                  title={item}
                  subtitle={descricaoDivisao(item)}
                />
              ))}
            </TemplateChoice>
          )}

          {etapa === 2 && (
            <>
              <div className="treino-template-origin-filter" data-testid="template-origin-filter">
                {ORIGENS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={origem === item ? "is-selected" : ""}
                    onClick={() => {
                      setOrigem(item);
                      setModeloId("");
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {erroModelos && <div className="app-error">{erroModelos}</div>}
              {carregandoModelos && <p className="app-muted">Carregando seus modelos...</p>}

              <div className="treino-template-models">
                {modelos.map((modelo) => (
                  <button
                    type="button"
                    key={modelo.id}
                    className={`treino-template-card${modeloSelecionado?.id === modelo.id ? " is-selected" : ""}`}
                    data-testid={modelo.isSystem ? "treino-template-card" : "custom-template-card"}
                    data-template-origin={modelo.isSystem ? "official" : "custom"}
                    onClick={() => selecionarModelo(modelo)}
                  >
                    <span className="treino-template-card-topline">
                      <span className="treino-template-card-icon">{iconeModelo(modelo.divisao)}</span>
                      <span className={`treino-template-badge ${modelo.isSystem ? "is-official" : "is-custom"}`}>
                        {modelo.isSystem ? "Oficial" : "Meu modelo"}
                      </span>
                    </span>
                    {!modelo.isSystem && (
                      <span className="treino-template-actions">
                        <span
                          role="button"
                          tabIndex={0}
                          data-testid="custom-template-actions-trigger"
                          onClick={(event) => {
                            event.stopPropagation();
                            setMenuAbertoId(menuAbertoId === modelo.id ? "" : modelo.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.stopPropagation();
                              setMenuAbertoId(menuAbertoId === modelo.id ? "" : modelo.id);
                            }
                          }}
                        >
                          <MoreVertical size={16} />
                        </span>
                        {menuAbertoId === modelo.id && (
                          <span className="treino-template-actions-menu" data-testid="custom-template-actions-menu">
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(event) => {
                                event.stopPropagation();
                                setModeloEditando(modelo);
                                setMenuAbertoId("");
                              }}
                            >
                              Editar metadados
                            </span>
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(event) => {
                                event.stopPropagation();
                                setMenuAbertoId("");
                                onDeleteCustom(modelo);
                              }}
                            >
                              Excluir
                            </span>
                          </span>
                        )}
                      </span>
                    )}
                    <strong>{modelo.nome}</strong>
                    <small>{modelo.dias.length} dias - {modelo.nivel || "Sem nivel"}</small>
                    <p>{modelo.descricao || "Modelo pessoal salvo a partir do editor."}</p>
                    <span>{resumoGrupos(modelo)}</span>
                  </button>
                ))}
              </div>

              {modelos.length === 0 && (
                <div className="treino-template-empty" data-testid="custom-template-empty-state">
                  {origem === "Meus modelos"
                    ? "Nenhum modelo pessoal encontrado para estes filtros."
                    : "Nenhum modelo encontrado para estes filtros."}
                </div>
              )}
            </>
          )}

          {etapa === 3 && (
            <div className="treino-template-destination">
              <label>
                <span>Aluno</span>
                <select
                  value={alunoId}
                  onChange={(event) => setAlunoId(event.target.value)}
                  data-testid="treino-template-aluno"
                >
                  <option value="">Selecione</option>
                  {alunos.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Nome do novo treino</span>
                <input
                  value={rotina}
                  onChange={(event) => setRotina(event.target.value)}
                  placeholder={modeloSelecionado?.nome || "Nome do treino"}
                  data-testid="treino-template-rotina"
                />
              </label>

              <label>
                <span>Data de inicio</span>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(event) => setDataInicio(event.target.value)}
                />
              </label>
            </div>
          )}

          {etapa === 4 && modeloSelecionado && (
            <div className="treino-template-confirm">
              <div className="treino-template-summary">
                <strong>{rotina || modeloSelecionado.nome}</strong>
                <span>{alunoSelecionado?.nome || "Aluno nao selecionado"}</span>
                <span>{modeloSelecionado.nome} - {modeloSelecionado.dias.length} dias</span>
              </div>
              <Preview modelo={modeloSelecionado} />
            </div>
          )}

          {etapa < 4 && modeloSelecionado && <Preview modelo={modeloSelecionado} compacto={etapa < 2} />}
        </div>

        <footer className="treino-template-footer">
          <button type="button" onClick={voltar} className="app-button app-button-secondary">
            <ChevronLeft size={16} />
            {etapa === 0 ? "Cancelar" : "Voltar"}
          </button>
          {etapa < 4 ? (
            <button
              type="button"
              onClick={avancar}
              disabled={!podeContinuar}
              className="app-button app-button-primary"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={gerar}
              disabled={!alunoId}
              className="app-button app-button-primary"
              data-testid="treino-template-generate"
            >
              Gerar treino editavel
            </button>
          )}
        </footer>
      </section>

      {modeloEditando && (
        <TreinoSalvarModeloModal
          modelo={modeloEditando}
          modo="edit"
          onClose={() => setModeloEditando(null)}
          onSubmit={salvarEdicao}
        />
      )}
    </div>
  );
}

function TemplateChoice({ title, children }) {
  return (
    <div>
      <h3 className="treino-template-section-title">{title}</h3>
      <div className="treino-template-choice-grid">{children}</div>
    </div>
  );
}

function ChoiceButton({ active, onClick, title, subtitle }) {
  return (
    <button
      type="button"
      className={`treino-template-choice${active ? " is-selected" : ""}`}
      onClick={onClick}
      data-testid="treino-template-choice"
    >
      <strong>{title}</strong>
      <span>{subtitle}</span>
    </button>
  );
}

function Preview({ modelo, compacto = false }) {
  return (
    <div className={`treino-template-preview${compacto ? " is-compact" : ""}`} data-testid="treino-template-preview">
      <h3>Preview do modelo</h3>
      {modelo.dias.map((dia) => (
        <details key={`${modelo.id}-${dia.nome}`} open={!compacto}>
          <summary>
            <strong>{dia.nome}</strong>
            <span>{dia.exercicios.length} exercicios</span>
          </summary>
          <div>
            <p>{dia.descricao}</p>
            {dia.exercicios.map((exercicio) => (
              <article key={`${dia.nome}-${exercicio.nome}`}>
                <strong>{exercicio.nome}</strong>
                <span>
                  {exercicio.series} series - {exercicio.repeticoes} reps - {exercicio.descanso}
                </span>
                {exercicio.observacoes && <small>{exercicio.observacoes}</small>}
              </article>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function iconeModelo(divisao) {
  if (divisao === "Full Body") return <Dumbbell size={17} />;
  if (divisao === "Upper/Lower") return <Layers3 size={17} />;
  return <Sparkles size={17} />;
}

function descricaoDivisao(divisao) {
  if (divisao === "Full Body") return "Tres sessoes de corpo inteiro.";
  if (divisao === "Upper/Lower") return "Quatro sessoes alternando superiores e inferiores.";
  if (divisao === "Outro") return "Estrutura livre criada a partir do editor.";
  return `${divisao.length} sessoes por grupos musculares.`;
}

function resumoGrupos(modelo) {
  return modelo.dias.map((dia) => dia.descricao).filter(Boolean).join(" | ");
}

export default TreinoTemplatesModal;
