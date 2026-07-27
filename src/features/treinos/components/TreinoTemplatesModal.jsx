import { ChevronLeft, Dumbbell, Layers3, MoreVertical, Sparkles } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DIVISOES_MODELO_TREINO,
  GENEROS_MODELO_TREINO,
  avisoModeloEditavel,
  obterModelosTreino,
} from "../../../data/treinosModelos";
import {
  TEMPLATE_DISCOVERY_PAGE_SIZE,
  buildTemplateDiscoveryOptions,
  filterWorkoutTemplates,
  normalizeTemplateForDiscovery,
  paginateWorkoutTemplates,
  sortWorkoutTemplates,
} from "../utils/workoutTemplateDiscovery";
import {
  clearTemplateDiscoveryStateFromUrl,
  countActiveTemplateDiscoveryFilters,
  hasActiveTemplateDiscoveryFilters,
  readTemplateDiscoveryStateFromUrl,
  updateTemplateDiscoveryStateInUrl,
} from "../utils/workoutTemplateDiscoveryQueryState";
import {
  buildWorkoutTemplateApplicationPreview,
  mapWorkoutTemplateApplicationError,
  submitWorkoutTemplateApplicationOnce,
} from "../utils/workoutTemplateApplication";
import TreinoSalvarModeloModal from "./TreinoSalvarModeloModal";

const etapas = ["Genero", "Divisao", "Modelo", "Aluno", "Previa", "Resultado"];
const FLOW_BY_STEP = ["selectingTemplate", "selectingTemplate", "selectingTemplate", "selectingStudent", "previewing", "success"];
const ORIGENS = [
  { value: "all", label: "Todos" },
  { value: "official", label: "Modelos oficiais" },
  { value: "personal", label: "Meus modelos" },
];
const SORT_OPTIONS = [
  { value: "recommended", label: "Recomendados" },
  { value: "nameAsc", label: "Nome A-Z" },
  { value: "nameDesc", label: "Nome Z-A" },
  { value: "updatedDesc", label: "Atualizados" },
];

function TreinoTemplatesModal({
  alunos,
  alunoContextual = null,
  carregandoModelos = false,
  erroModelos = "",
  modelosPessoais = [],
  onClose,
  onApply,
  onDeleteCustom,
  onEditCustom,
  onSaveCustom,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [etapa, setEtapa] = useState(0);
  const [genero, setGenero] = useState("Masculino");
  const [divisao, setDivisao] = useState("ABC");
  const [modeloId, setModeloId] = useState("");
  const [alunoId, setAlunoId] = useState(alunoContextual?.id || "");
  const [rotina, setRotina] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [flowState, setFlowState] = useState("selectingTemplate");
  const [applicationError, setApplicationError] = useState("");
  const [createdWorkout, setCreatedWorkout] = useState(null);
  const [modeloEditando, setModeloEditando] = useState(null);
  const [modeloGerenciando, setModeloGerenciando] = useState(null);
  const [menuAbertoId, setMenuAbertoId] = useState("");
  const submissionRef = useRef({ active: false, result: null });
  const modalTitleId = useId();
  const discoveryState = useMemo(
    () => readTemplateDiscoveryStateFromUrl(searchParams),
    [searchParams]
  );

  const modelosOficiais = useMemo(
    () => obterModelosTreino({ genero, divisao: "" }).map((modelo) => ({ ...modelo, origem: "official" })),
    [genero]
  );

  const meusModelos = useMemo(
    () =>
      modelosPessoais.filter((modelo) => {
        const combinaGenero =
          genero === "Todos" || modelo.genero === genero || modelo.genero === "Unissex";
        return combinaGenero;
      }),
    [genero, modelosPessoais]
  );

  const modelosCombinados = useMemo(
    () => [...modelosOficiais, ...meusModelos],
    [meusModelos, modelosOficiais]
  );
  const discoveryItems = useMemo(
    () => modelosCombinados.map(normalizeTemplateForDiscovery),
    [modelosCombinados]
  );
  const discoveryOptions = useMemo(
    () => buildTemplateDiscoveryOptions(discoveryItems),
    [discoveryItems]
  );
  const modelosDescobertos = useMemo(
    () =>
      sortWorkoutTemplates(
        filterWorkoutTemplates(discoveryItems, discoveryState),
        discoveryState.sort
      ),
    [discoveryItems, discoveryState]
  );
  const paginacao = useMemo(
    () =>
      paginateWorkoutTemplates(
        modelosDescobertos,
        discoveryState.page,
        TEMPLATE_DISCOVERY_PAGE_SIZE
      ),
    [discoveryState.page, modelosDescobertos]
  );
  const modelos = useMemo(
    () => paginacao.items.map((item) => item.original),
    [paginacao.items]
  );
  const filtrosAtivos = hasActiveTemplateDiscoveryFilters(discoveryState);
  const totalFiltrosAtivos = countActiveTemplateDiscoveryFilters(discoveryState);

  const modeloSelecionado =
    modelos.find((modelo) => modelo.id === modeloId) || modelos[0] || null;
  const alunoSelecionado = alunos.find((aluno) => aluno.id === alunoId);
  const applicationPreview = useMemo(
    () =>
      buildWorkoutTemplateApplicationPreview({
        template: modeloSelecionado,
        student: alunoSelecionado,
        options: { rotina, dataInicio },
      }),
    [alunoSelecionado, dataInicio, modeloSelecionado, rotina]
  );
  const isSubmitting = flowState === "submitting";

  useEffect(() => {
    if (discoveryState.page === paginacao.currentPage) return;
    setSearchParams(
      updateTemplateDiscoveryStateInUrl(searchParams, { page: paginacao.currentPage }),
      { replace: true }
    );
  }, [discoveryState.page, paginacao.currentPage, searchParams, setSearchParams]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== "Escape") return;

      if (menuAbertoId) {
        setMenuAbertoId("");
        return;
      }

      if (modeloEditando || modeloGerenciando || isSubmitting) return;

      onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, menuAbertoId, modeloEditando, modeloGerenciando, onClose]);

  function avancar() {
    if (isSubmitting) return;

    if (etapa === 2 && modeloSelecionado && !modeloId) {
      setModeloId(modeloSelecionado.id);
      setRotina(modeloSelecionado.nome);
    }

    if (etapa === 3 && modeloSelecionado && !rotina.trim()) {
      setRotina(modeloSelecionado.nome);
    }

    setApplicationError("");
    setEtapa((valor) => {
      const next = Math.min(valor + 1, etapas.length - 2);
      setFlowState(FLOW_BY_STEP[next]);
      return next;
    });
  }

  function voltar() {
    if (isSubmitting) return;

    if (etapa === 0) {
      onClose();
      return;
    }

    setApplicationError("");
    setEtapa((valor) => {
      const next = Math.max(valor - 1, 0);
      setFlowState(FLOW_BY_STEP[next]);
      return next;
    });
  }

  function selecionarModelo(modelo) {
    setModeloId(modelo.id);
    setRotina(modelo.nome || "");
    setApplicationError("");
  }

  function atualizarDescoberta(changes, options = {}) {
    const replace = options.replace ?? false;
    setModeloId("");
    setMenuAbertoId("");
    setSearchParams(updateTemplateDiscoveryStateInUrl(searchParams, changes), { replace });
  }

  function limparDescoberta() {
    setModeloId("");
    setMenuAbertoId("");
    setSearchParams(clearTemplateDiscoveryStateFromUrl(searchParams), { replace: false });
  }

  async function aplicarModelo() {
    if (isSubmitting || !modeloSelecionado || !alunoSelecionado || !onApply) return;
    setFlowState("submitting");
    setApplicationError("");

    try {
      const result = await submitWorkoutTemplateApplicationOnce(submissionRef.current, () =>
        onApply({
          template: modeloSelecionado,
          student: alunoSelecionado,
          options: {
            rotina: rotina.trim() || modeloSelecionado.nome,
            dataInicio,
          },
        })
      );
      setCreatedWorkout(result);
      setFlowState("success");
      setEtapa(etapas.length - 1);
    } catch (error) {
      setApplicationError(mapWorkoutTemplateApplicationError(error));
      submissionRef.current.result = null;
      setFlowState("error");
    }
  }

  async function salvarGerenciamento(payload, treinoPayload) {
    if (payload.mode === "edit") {
      await onEditCustom(modeloEditando.id, payload.metadata, treinoPayload);
    } else {
      await onSaveCustom(payload, treinoPayload);
    }
    setModeloEditando(null);
    setModeloGerenciando(null);
  }

  const podeContinuar =
    (etapa === 0 && genero) ||
    (etapa === 1 && divisao) ||
    (etapa === 2 && modeloSelecionado) ||
    (etapa === 3 && alunoId && (rotina.trim() || modeloSelecionado)) ||
    (etapa === 4 && applicationPreview.validation.ok);

  return (
    <div className="treino-template-overlay">
      <section
        className="treino-template-modal"
        data-testid="treino-template-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        aria-busy={isSubmitting}
      >
        <header className="treino-template-header">
          <div>
            <span className="treino-template-step">
              Etapa {etapa + 1} de {etapas.length}: {etapas[etapa]}
            </span>
            <h2 id={modalTitleId}>Aplicar modelo ao aluno</h2>
            <p>{avisoModeloEditavel}</p>
          </div>
          <button type="button" onClick={onClose} className="treino-template-close">
            Fechar
          </button>
        </header>

        <div className="treino-template-progress" aria-hidden="true">
          {etapas.map((item, index) => (
            <span
              key={item}
              className={index <= etapa ? "is-active" : ""}
              title={item}
            />
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
                    setMenuAbertoId("");
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
                    atualizarDescoberta({ split: item });
                  }}
                  title={item}
                  subtitle={descricaoDivisao(item)}
                />
              ))}
            </TemplateChoice>
          )}

          {etapa === 2 && (
            <>
              <div className="treino-template-discovery" data-testid="template-discovery-controls">
                <div className="treino-template-search-row">
                  <label className="treino-template-search">
                    <span>Buscar modelos</span>
                    <input
                      className="app-input"
                      aria-label="Buscar modelos por nome ou descricao"
                      data-testid="template-search"
                      placeholder="Nome ou descricao"
                      value={discoveryState.query}
                      onChange={(event) =>
                        atualizarDescoberta({ query: event.target.value }, { replace: true })
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="app-button app-button-neutral"
                    data-testid="template-clear-filters"
                    onClick={limparDescoberta}
                    disabled={!filtrosAtivos}
                  >
                    Limpar filtros
                  </button>
                </div>

                <div className="treino-template-filter-grid">
                  <label>
                    <span>Origem</span>
                    <select
                      className="app-select"
                      aria-label="Filtrar modelos por origem"
                      data-testid="template-filter-origin"
                      value={discoveryState.origin}
                      onChange={(event) => atualizarDescoberta({ origin: event.target.value })}
                    >
                      {ORIGENS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Divisao</span>
                    <select
                      className="app-select"
                      aria-label="Filtrar modelos por divisao"
                      data-testid="template-filter-split"
                      value={discoveryState.split}
                      onChange={(event) => {
                        setDivisao(event.target.value || "ABC");
                        atualizarDescoberta({ split: event.target.value });
                      }}
                    >
                      <option value="">Todas</option>
                      {discoveryOptions.splits.map((split) => (
                        <option key={split} value={split}>
                          {split}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Objetivo</span>
                    <select
                      className="app-select"
                      aria-label="Filtrar modelos por objetivo"
                      data-testid="template-filter-objective"
                      value={discoveryState.objective}
                      onChange={(event) => atualizarDescoberta({ objective: event.target.value })}
                    >
                      <option value="">Todos</option>
                      {discoveryOptions.objectives.map((objective) => (
                        <option key={objective} value={objective}>
                          {objective}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Nivel</span>
                    <select
                      className="app-select"
                      aria-label="Filtrar modelos por nivel"
                      data-testid="template-filter-level"
                      value={discoveryState.level}
                      onChange={(event) => atualizarDescoberta({ level: event.target.value })}
                    >
                      <option value="">Todos</option>
                      {discoveryOptions.levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Grupo</span>
                    <select
                      className="app-select"
                      aria-label="Filtrar modelos por grupo muscular"
                      data-testid="template-filter-muscle-group"
                      value={discoveryState.muscleGroup}
                      onChange={(event) => atualizarDescoberta({ muscleGroup: event.target.value })}
                    >
                      <option value="">Todos</option>
                      {discoveryOptions.muscleGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Ordenar</span>
                    <select
                      className="app-select"
                      aria-label="Ordenar modelos"
                      data-testid="template-sort"
                      value={discoveryState.sort}
                      onChange={(event) => atualizarDescoberta({ sort: event.target.value })}
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="treino-template-results-bar" aria-live="polite">
                  <strong data-testid="template-results-count">
                    {formatarContagem(paginacao.totalItems)}
                  </strong>
                  {totalFiltrosAtivos > 0 && (
                    <span>{totalFiltrosAtivos} filtros ativos</span>
                  )}
                </div>
              </div>

              {erroModelos && <div className="app-error">{erroModelos}</div>}
              {carregandoModelos && <p className="app-muted">Carregando seus modelos...</p>}
              <button
                type="button"
                className="app-button app-button-secondary"
                data-testid="personal-template-create"
                onClick={() => setModeloGerenciando({ modo: "create", modelo: null })}
              >
                Criar modelo
              </button>

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
                    <span className="treino-template-actions">
                      <button
                        type="button"
                        aria-label={`Abrir acoes de ${modelo.nome}`}
                        aria-expanded={menuAbertoId === modelo.id}
                        aria-controls={`template-actions-${modelo.id}`}
                        data-testid={modelo.isSystem ? "official-template-actions-trigger" : "custom-template-actions-trigger"}
                        onClick={(event) => {
                          event.stopPropagation();
                          setMenuAbertoId(menuAbertoId === modelo.id ? "" : modelo.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuAbertoId === modelo.id && (
                        <span
                          className="treino-template-actions-menu"
                          id={`template-actions-${modelo.id}`}
                          data-testid={modelo.isSystem ? "official-template-actions-menu" : "custom-template-actions-menu"}
                        >
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              selecionarModelo(modelo);
                              setMenuAbertoId("");
                            }}
                          >
                            Visualizar
                          </button>
                          {modelo.isSystem ? (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setModeloGerenciando({ modo: "duplicateOfficial", modelo });
                                setMenuAbertoId("");
                              }}
                            >
                              Duplicar como modelo pessoal
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setModeloEditando(modelo);
                                  setMenuAbertoId("");
                                }}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setModeloGerenciando({ modo: "duplicatePersonal", modelo });
                                  setMenuAbertoId("");
                                }}
                              >
                                Duplicar
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setMenuAbertoId("");
                                  onDeleteCustom(modelo);
                                }}
                              >
                                Excluir
                              </button>
                            </>
                          )}
                        </span>
                      )}
                    </span>
                    <strong>{modelo.nome}</strong>
                    <small>{modelo.dias.length} dias - {modelo.nivel || "Sem nivel"}</small>
                    <p>{modelo.descricao || "Modelo pessoal salvo a partir do editor."}</p>
                    <span>{resumoGrupos(modelo)}</span>
                  </button>
                ))}
              </div>

              {paginacao.totalItems === 0 && (
                <div className="treino-template-empty" data-testid="custom-template-empty-state">
                  <strong>
                    {modelosCombinados.length === 0
                      ? "Nenhum modelo disponivel."
                      : "Nenhum modelo encontrado."}
                  </strong>
                  <span>
                    {modelosCombinados.length === 0
                      ? "A biblioteca ainda nao possui modelos para exibir."
                      : "Ajuste a busca ou limpe os filtros para ver mais opcoes."}
                  </span>
                  {modelosCombinados.length > 0 && (
                    <button
                      type="button"
                      className="app-button app-button-neutral"
                      onClick={limparDescoberta}
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}

              {paginacao.totalPages > 1 && (
                <div className="treino-template-pagination" data-testid="template-pagination">
                  <button
                    type="button"
                    className="app-button app-button-secondary"
                    aria-label="Pagina anterior de modelos"
                    disabled={!paginacao.hasPrevious}
                    onClick={() => atualizarDescoberta({ page: paginacao.currentPage - 1 })}
                  >
                    Anterior
                  </button>
                  <span>
                    Pagina {paginacao.currentPage} de {paginacao.totalPages}
                  </span>
                  <button
                    type="button"
                    className="app-button app-button-secondary"
                    aria-label="Proxima pagina de modelos"
                    disabled={!paginacao.hasNext}
                    onClick={() => atualizarDescoberta({ page: paginacao.currentPage + 1 })}
                  >
                    Proxima
                  </button>
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
              <ApplicationSummary preview={applicationPreview} />
              <Preview modelo={modeloSelecionado} preview={applicationPreview} />
              <p className="treino-template-privacy">
                Um novo treino sera criado para o aluno selecionado usando a RPC atomica salvar_treino_composto(jsonb).
              </p>
            </div>
          )}

          {etapa === 5 && (
            <div className="treino-template-result" data-testid="treino-template-application-success">
              <strong>Treino criado com sucesso.</strong>
              <span>
                {createdWorkout?.rotina || applicationPreview.workoutName} foi criado para {applicationPreview.studentName}.
              </span>
            </div>
          )}

          {applicationError && (
            <div className="app-error" role="alert" aria-live="assertive" data-testid="treino-template-application-error">
              {applicationError}
            </div>
          )}

          <div aria-live="polite" data-testid={isSubmitting ? "treino-template-submitting" : undefined}>
            {isSubmitting ? "Aplicando modelo ao aluno..." : ""}
          </div>

          {etapa < 4 && modeloSelecionado && <Preview modelo={modeloSelecionado} preview={applicationPreview} compacto={etapa < 2} />}
        </div>

        <footer className="treino-template-footer">
          <button type="button" onClick={voltar} className="app-button app-button-secondary" disabled={isSubmitting || flowState === "success"}>
            <ChevronLeft size={16} />
            {etapa === 0 ? "Cancelar" : "Voltar"}
          </button>
          {flowState === "success" ? (
            <button type="button" onClick={onClose} className="app-button app-button-primary">
              Fechar
            </button>
          ) : etapa < 4 ? (
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
              onClick={aplicarModelo}
              disabled={!applicationPreview.validation.ok || isSubmitting}
              className="app-button app-button-primary"
              data-testid="treino-template-generate"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Aplicando..." : "Aplicar treino ao aluno"}
            </button>
          )}
        </footer>
      </section>

      {modeloEditando && (
        <TreinoSalvarModeloModal
          modelo={modeloEditando}
          modo="edit"
          onClose={() => setModeloEditando(null)}
          onSubmit={salvarGerenciamento}
        />
      )}
      {modeloGerenciando && (
        <TreinoSalvarModeloModal
          modelo={modeloGerenciando.modelo}
          modo={modeloGerenciando.modo}
          onClose={() => setModeloGerenciando(null)}
          onSubmit={salvarGerenciamento}
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

function ApplicationSummary({ preview }) {
  return (
    <div className="treino-template-summary" data-testid="workout-template-application-summary">
      <strong>{preview.workoutName}</strong>
      <span>Modelo: {preview.templateName} ({preview.templateOriginLabel})</span>
      <span>Aluno: {preview.studentLabel}</span>
      <span>Objetivo: {preview.objective}</span>
      <span>Nivel: {preview.level}</span>
      <span>Divisao: {preview.split}</span>
      <span>{preview.dayCount} dias - {preview.exerciseCount} exercicios</span>
      <span>{preview.sanitizedDetails}</span>
      {preview.mainExercises.length > 0 && (
        <span>Principais: {preview.mainExercises.join(", ")}</span>
      )}
      {preview.warnings.length > 0 && (
        <ul className="treino-template-warnings" data-testid="workout-template-application-warnings">
          {preview.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Preview({ modelo, preview, compacto = false }) {
  const dias = preview?.days || modelo.dias || [];
  return (
    <div className={`treino-template-preview${compacto ? " is-compact" : ""}`} data-testid="treino-template-preview">
      <h3>Preview do modelo</h3>
      {dias.map((dia) => (
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

function formatarContagem(total) {
  if (total === 0) return "Nenhum modelo encontrado";
  if (total === 1) return "1 modelo encontrado";
  return `${total} modelos encontrados`;
}

export default TreinoTemplatesModal;
