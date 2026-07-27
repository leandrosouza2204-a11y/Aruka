import { ChevronLeft, Dumbbell, Layers3, MoreVertical, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import TreinoSalvarModeloModal from "./TreinoSalvarModeloModal";

const etapas = ["Genero", "Divisao", "Modelo", "Destino", "Confirmacao"];
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
  carregandoModelos = false,
  erroModelos = "",
  modelosPessoais = [],
  onClose,
  onDeleteCustom,
  onEditCustom,
  onGenerate,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [etapa, setEtapa] = useState(0);
  const [genero, setGenero] = useState("Masculino");
  const [divisao, setDivisao] = useState("ABC");
  const [modeloId, setModeloId] = useState("");
  const [alunoId, setAlunoId] = useState("");
  const [rotina, setRotina] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [modeloEditando, setModeloEditando] = useState(null);
  const [menuAbertoId, setMenuAbertoId] = useState("");
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

  useEffect(() => {
    if (discoveryState.page === paginacao.currentPage) return;
    setSearchParams(
      updateTemplateDiscoveryStateInUrl(searchParams, { page: paginacao.currentPage }),
      { replace: true }
    );
  }, [discoveryState.page, paginacao.currentPage, searchParams, setSearchParams]);

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
                              Editar modelo
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

function formatarContagem(total) {
  if (total === 0) return "Nenhum modelo encontrado";
  if (total === 1) return "1 modelo encontrado";
  return `${total} modelos encontrados`;
}

export default TreinoTemplatesModal;
