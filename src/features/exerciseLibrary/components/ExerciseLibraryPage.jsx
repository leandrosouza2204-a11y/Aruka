import { useEffect } from "react";
import {
  Archive,
  BookOpenCheck,
  Dumbbell,
  Film,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import LoadingState from "../../../components/LoadingState";
import EmptyState from "../../../components/EmptyState";
import { useExerciseLibraryPage } from "../hooks/useExerciseLibraryPage";

function ExerciseLibraryPage() {
  const page = useExerciseLibraryPage();

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <main
        className="app-main page-container exercise-library-page"
        data-testid="exercise-library-page"
        style={styles.conteudo}
      >
        <header className="exercise-library-hero" style={styles.hero}>
          <div style={styles.heroIcon} aria-hidden="true">
            <BookOpenCheck size={26} />
          </div>
          <div style={styles.heroCopy}>
            <span style={styles.eyebrow}>Biblioteca</span>
            <h1 style={styles.titulo}>Biblioteca de Exercícios</h1>
            <p style={styles.subtitulo}>
              Encontre exercícios oficiais e pessoais para apoiar prescrições mais consistentes.
            </p>
          </div>
          <div style={styles.heroStats} aria-label="Resumo da biblioteca">
            <ResumoItem label="Disponíveis" valor={page.exercicios.length} />
            <ResumoItem label="Visíveis" valor={page.exerciciosFiltrados.length} />
          </div>
        </header>

        <section
          className="exercise-library-section"
          aria-labelledby="exercise-library-heading"
          aria-busy={page.carregando || page.retryEmAndamento}
          style={styles.section}
        >
          <div style={styles.sectionHeader}>
            <div>
              <h2 id="exercise-library-heading" style={styles.sectionTitle}>
                Exercícios
              </h2>
              <p style={styles.sectionDescription}>
                Veja grupos, categorias e mídia disponível antes de montar a ficha.
              </p>
            </div>
            <div style={styles.headerActions}>
              <span style={styles.securityBadge}>
                <Sparkles size={14} />
                Uso profissional
              </span>
              <button
                type="button"
                className="app-button app-button-primary"
                data-testid="exercise-library-create"
                onClick={page.abrirCriacao}
                style={styles.primaryButton}
              >
                <Plus size={16} />
                Novo exercício
              </button>
            </div>
          </div>

          {page.mensagem && (
            <div
              className={`exercise-library-message ${page.mensagem.type === "error" ? "is-error" : "is-success"}`}
              role="status"
              aria-live="polite"
              style={{
                ...styles.message,
                ...(page.mensagem.type === "error" ? styles.messageError : styles.messageSuccess),
              }}
            >
              {page.mensagem.text}
            </div>
          )}

          <ExerciseLibraryFilters page={page} />

          {page.erro && (
            <div
              className="app-error exercise-library-error"
              data-testid="exercise-library-error"
              role="alert"
              aria-live="assertive"
              style={styles.errorBox}
            >
              <div style={styles.errorText}>
                <strong>{page.erro.title}</strong>
                <span>{page.erro.description}</span>
              </div>
              {page.erro.retryable && (
                <button
                  type="button"
                  className="app-button app-button-secondary"
                  onClick={page.tentarNovamente}
                  disabled={page.retryEmAndamento}
                  aria-busy={page.retryEmAndamento}
                  style={styles.secondaryButton}
                >
                  {page.retryEmAndamento ? "Tentando..." : "Tentar novamente"}
                </button>
              )}
            </div>
          )}

          {!page.erro && page.carregando && (
            <div style={styles.loadingBox}>
              <LoadingState texto="Carregando biblioteca de exercícios..." />
            </div>
          )}

          {!page.erro && !page.carregando && page.exerciciosFiltrados.length === 0 && (
            <EmptyState
              titulo="Nenhum exercício encontrado."
              descricao="Ajuste a busca ou os filtros para visualizar outros exercícios disponíveis."
            />
          )}

          {!page.erro && !page.carregando && page.exerciciosFiltrados.length > 0 && (
            <div className="exercise-library-grid" data-testid="exercise-library-grid" style={styles.grid}>
              {page.exerciciosFiltrados.map((exercicio) => (
                <ExerciseLibraryCard key={exercicio.id} exercicio={exercicio} page={page} />
              ))}
            </div>
          )}
        </section>

        {page.modalAberto && <ExerciseLibraryFormModal page={page} />}
      </main>
    </div>
  );
}

function ExerciseLibraryFilters({ page }) {
  return (
    <div className="exercise-library-filters" data-testid="exercise-library-filters" style={styles.filters}>
      <label style={styles.searchLabel}>
        <Search size={16} aria-hidden="true" />
        <span className="sr-only">Buscar exercícios</span>
        <input
          className="app-input"
          aria-label="Buscar exercícios"
          data-testid="exercise-library-search"
          placeholder="Buscar por nome, grupo ou categoria"
          value={page.filtros.busca}
          onChange={(event) => page.atualizarFiltro("busca", event.target.value)}
          style={styles.field}
        />
      </label>

      <select
        className="app-select"
        aria-label="Filtrar por origem"
        data-testid="exercise-library-origin-filter"
        value={page.filtros.origem}
        onChange={(event) => page.atualizarFiltro("origem", event.target.value)}
        style={styles.field}
      >
        <option value="todos">Todas as origens</option>
        <option value="official">Oficiais</option>
        <option value="personal">Pessoais</option>
      </select>

      <select
        className="app-select"
        aria-label="Filtrar por grupo muscular"
        data-testid="exercise-library-muscle-filter"
        value={page.filtros.grupoMuscular}
        onChange={(event) => page.atualizarFiltro("grupoMuscular", event.target.value)}
        style={styles.field}
      >
        <option value="todos">Todos os grupos</option>
        {page.opcoesFiltro.gruposMusculares.map((grupo) => (
          <option key={grupo} value={grupo}>
            {grupo}
          </option>
        ))}
      </select>

      <select
        className="app-select"
        aria-label="Filtrar por mídia"
        data-testid="exercise-library-media-filter"
        value={page.filtros.midia}
        onChange={(event) => page.atualizarFiltro("midia", event.target.value)}
        style={styles.field}
      >
        <option value="todos">Todas as mídias</option>
        <option value="com_midia">Com mídia</option>
        <option value="sem_midia">Sem mídia</option>
      </select>

      <button
        type="button"
        className="app-button app-button-neutral"
        data-testid="exercise-library-clear-filters"
        onClick={page.limparFiltros}
        style={styles.clearButton}
      >
        <SlidersHorizontal size={15} />
        Limpar
      </button>
    </div>
  );
}

function ExerciseLibraryCard({ exercicio, page }) {
  const isPersonal = exercicio.origem === "personal";
  const isArchiving = page.arquivandoId === exercicio.id;
  const thumbnailUrl = exercicio.midia.type === "youtube" ? exercicio.midia.thumbnailUrl : "";

  return (
    <article className="exercise-library-card" data-testid="exercise-library-card" style={styles.card}>
      <div style={thumbnailUrl ? styles.thumbWithImage : styles.thumb} aria-hidden="true">
        {thumbnailUrl && <img src={thumbnailUrl} alt="" loading="lazy" style={styles.thumbImage} />}
        <span style={thumbnailUrl ? styles.thumbIconOverlay : undefined}>
          {exercicio.possuiMidia ? <Film size={24} /> : <Dumbbell size={24} />}
        </span>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <span
            className={`status-badge ${exercicio.origem === "personal" ? "status-badge-info" : "status-badge-success"}`}
          >
            {exercicio.origemLabel}
          </span>
          <span style={styles.mediaPill}>{exercicio.midia.label}</span>
        </div>

        <h3 style={styles.cardTitle}>{exercicio.nome || "Exercício sem nome"}</h3>
        <p style={styles.cardDescription}>
          {exercicio.descricao || exercicio.instrucoes || "Sem descrição cadastrada."}
        </p>

        <div style={styles.metaGrid}>
          <Meta label="Grupo" valor={exercicio.grupoMuscular || "Não informado"} />
          <Meta label="Categoria" valor={exercicio.categoria || "Não informada"} />
        </div>

        {isPersonal && (
          <div className="exercise-library-card-actions" style={styles.cardActions}>
            <button
              type="button"
              className="app-button app-button-secondary"
              data-testid="exercise-library-edit"
              onClick={() => page.abrirEdicao(exercicio)}
              style={styles.cardButton}
            >
              <Pencil size={15} />
              Editar
            </button>
            <button
              type="button"
              className="app-button app-button-danger"
              data-testid="exercise-library-archive"
              onClick={() => page.arquivarExercicio(exercicio)}
              disabled={isArchiving}
              aria-busy={isArchiving}
              style={styles.cardButton}
            >
              <Archive size={15} />
              {isArchiving ? "Arquivando..." : "Arquivar"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function ExerciseLibraryFormModal({ page }) {
  const titleId = "exercise-library-form-title";
  const descriptionId = "exercise-library-form-description";
  const editing = Boolean(page.exercicioEditando);
  const youtubeInput = String(page.formulario.youtubeInput || "").trim();
  const youtubeError =
    page.errosFormulario.youtubeInput ||
    (youtubeInput && !page.youtubePreview.ok ? page.youtubePreview.message : "");
  const youtubeMedia = page.youtubePreview.ok ? page.youtubePreview.media : null;

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") page.fecharModal();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [page]);

  return (
    <div className="exercise-library-modal-overlay" style={styles.modalOverlay}>
      <section
        className="exercise-library-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        style={styles.modal}
      >
        <header style={styles.modalHeader}>
          <div>
            <h2 id={titleId} style={styles.modalTitle}>
              {editing ? "Editar exercício pessoal" : "Novo exercício pessoal"}
            </h2>
            <p id={descriptionId} style={styles.modalDescription}>
              Preencha os dados que ajudam você a reconhecer e reutilizar o exercício.
            </p>
          </div>
          <button
            type="button"
            className="app-button app-button-neutral"
            aria-label="Fechar"
            onClick={page.fecharModal}
            disabled={page.salvando}
            style={styles.iconButton}
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={page.salvarExercicio} style={styles.form} noValidate>
          <CampoTexto
            id="exercise-name"
            label="Nome"
            required
            value={page.formulario.nome}
            error={page.errosFormulario.nome}
            onChange={(valor) => page.atualizarFormulario("nome", valor)}
          />
          <div className="exercise-library-form-grid" style={styles.formGrid}>
            <CampoTexto
              id="exercise-muscle"
              label="Grupo muscular"
              required
              value={page.formulario.grupoMuscular}
              error={page.errosFormulario.grupoMuscular}
              onChange={(valor) => page.atualizarFormulario("grupoMuscular", valor)}
            />
            <CampoTexto
              id="exercise-category"
              label="Categoria"
              required
              value={page.formulario.categoria}
              error={page.errosFormulario.categoria}
              onChange={(valor) => page.atualizarFormulario("categoria", valor)}
            />
          </div>
          <CampoTexto
            id="exercise-description"
            label="Descrição"
            value={page.formulario.descricao}
            error={page.errosFormulario.descricao}
            onChange={(valor) => page.atualizarFormulario("descricao", valor)}
          />
          <CampoTexto
            id="exercise-instructions"
            label="Instruções"
            multiline
            value={page.formulario.instrucoes}
            error={page.errosFormulario.instrucoes}
            onChange={(valor) => page.atualizarFormulario("instrucoes", valor)}
          />
          <CampoTexto
            id="exercise-youtube"
            label="Vídeo do YouTube"
            value={page.formulario.youtubeInput}
            error={youtubeError}
            helper="Cole o link do vídeo ou informe o ID do YouTube."
            onChange={(valor) => page.atualizarFormulario("youtubeInput", valor)}
          />

          {youtubeMedia && (
            <div className="exercise-library-youtube-preview" style={styles.youtubePreview}>
              <iframe
                title={`Prévia do vídeo: ${page.formulario.nome || "Exercício"}`}
                src={youtubeMedia.embedUrl}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={styles.youtubeFrame}
              />
            </div>
          )}

          <footer style={styles.modalFooter}>
            <button
              type="button"
              className="app-button app-button-secondary"
              onClick={page.fecharModal}
              disabled={page.salvando}
              style={styles.footerButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="app-button app-button-primary"
              disabled={page.salvando}
              aria-busy={page.salvando}
              style={styles.footerButton}
            >
              <Save size={16} />
              {page.salvando ? "Salvando..." : "Salvar exercício"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function CampoTexto({ error, helper, id, label, multiline = false, onChange, required = false, value }) {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy = [helper ? helperId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;
  const fieldProps = {
    id,
    className: "app-input",
    value,
    required,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    onChange: (event) => onChange(event.target.value),
    style: multiline ? styles.textarea : styles.field,
  };

  return (
    <label style={styles.formField} htmlFor={id}>
      <span style={styles.formLabel}>
        {label}
        {required && <strong aria-hidden="true"> *</strong>}
      </span>
      {multiline ? <textarea {...fieldProps} rows={5} /> : <input {...fieldProps} />}
      {helper && (
        <span id={helperId} style={styles.fieldHelper}>
          {helper}
        </span>
      )}
      {error && (
        <span id={errorId} role="alert" style={styles.fieldError}>
          {error}
        </span>
      )}
    </label>
  );
}

function Meta({ label, valor }) {
  return (
    <div style={styles.metaItem}>
      <span style={styles.metaLabel}>{label}</span>
      <strong style={styles.metaValue}>{valor}</strong>
    </div>
  );
}

function ResumoItem({ label, valor }) {
  return (
    <div style={styles.statItem}>
      <span>{label}</span>
      <strong>{valor}</strong>
    </div>
  );
}

const styles = {
  conteudo: {
    background:
      "radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 320px), linear-gradient(180deg, rgba(239, 246, 255, 0.84), rgba(245, 247, 251, 1) 300px)",
    marginLeft: "260px",
    minHeight: "100vh",
    padding: "24px",
    width: "calc(100% - 260px)",
  },
  hero: {
    alignItems: "center",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(29, 78, 216, 0.94))",
    borderRadius: "8px",
    color: "white",
    display: "grid",
    gap: "18px",
    gridTemplateColumns: "52px minmax(0, 1fr) auto",
    padding: "24px",
  },
  heroIcon: {
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.12)",
    border: "1px solid rgba(255, 255, 255, 0.16)",
    borderRadius: "8px",
    display: "inline-flex",
    height: "52px",
    justifyContent: "center",
    width: "52px",
  },
  heroCopy: {
    minWidth: 0,
  },
  eyebrow: {
    color: "#bfdbfe",
    display: "block",
    fontSize: "12px",
    fontWeight: "850",
    marginBottom: "6px",
    textTransform: "uppercase",
  },
  titulo: {
    fontSize: "30px",
    lineHeight: 1.12,
    margin: 0,
  },
  subtitulo: {
    color: "rgba(255, 255, 255, 0.76)",
    fontSize: "15px",
    lineHeight: 1.45,
    marginTop: "8px",
  },
  heroStats: {
    display: "grid",
    gap: "8px",
    gridTemplateColumns: "repeat(2, minmax(92px, 1fr))",
  },
  statItem: {
    background: "rgba(255, 255, 255, 0.11)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    borderRadius: "8px",
    display: "grid",
    gap: "4px",
    minWidth: 0,
    padding: "10px",
  },
  section: {
    background: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.76)",
    borderRadius: "8px",
    boxShadow: "0 24px 58px rgba(15, 23, 42, 0.09)",
    marginTop: "18px",
    padding: "20px",
  },
  sectionHeader: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  headerActions: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "flex-end",
  },
  sectionTitle: {
    color: "#111827",
    fontSize: "24px",
    lineHeight: 1.15,
    margin: 0,
  },
  sectionDescription: {
    color: "#64748b",
    fontSize: "14px",
    marginTop: "6px",
  },
  securityBadge: {
    alignItems: "center",
    background: "#dcfce7",
    borderRadius: "999px",
    color: "#166534",
    display: "inline-flex",
    fontSize: "12px",
    fontWeight: "850",
    gap: "6px",
    minHeight: "34px",
    padding: "8px 11px",
  },
  filters: {
    alignItems: "center",
    background: "linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 0.94))",
    border: "1px solid rgba(226, 232, 240, 0.7)",
    borderRadius: "8px",
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "minmax(240px, 1fr) repeat(3, minmax(150px, 190px)) auto",
    marginBottom: "18px",
    padding: "14px",
  },
  searchLabel: {
    alignItems: "center",
    display: "flex",
    gap: "8px",
    minWidth: 0,
  },
  field: {
    background: "white",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    color: "#111827",
    minHeight: "42px",
    minWidth: 0,
    outline: "none",
    padding: "9px 11px",
    width: "100%",
  },
  clearButton: {
    alignItems: "center",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    color: "#111827",
    cursor: "pointer",
    display: "inline-flex",
    gap: "7px",
    justifyContent: "center",
    minHeight: "42px",
    padding: "9px 12px",
  },
  primaryButton: {
    alignItems: "center",
    display: "inline-flex",
    gap: "8px",
    justifyContent: "center",
    minHeight: "40px",
  },
  message: {
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "750",
    marginBottom: "14px",
    padding: "10px 12px",
  },
  messageSuccess: {
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    color: "#166534",
  },
  messageError: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
  },
  errorBox: {
    alignItems: "center",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#991b1b",
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
    marginBottom: "18px",
    padding: "12px",
  },
  errorText: {
    display: "grid",
    gap: "4px",
  },
  secondaryButton: {
    background: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    color: "#111827",
    cursor: "pointer",
    minHeight: "38px",
    padding: "9px 12px",
  },
  loadingBox: {
    background: "rgba(248, 250, 252, 0.9)",
    border: "1px solid rgba(226, 232, 240, 0.7)",
    borderRadius: "8px",
    padding: "28px",
  },
  grid: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  },
  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
    border: "1px solid rgba(226, 232, 240, 0.7)",
    borderRadius: "8px",
    boxShadow: "0 18px 42px rgba(15, 23, 42, 0.075)",
    display: "grid",
    gap: "14px",
    gridTemplateColumns: "72px minmax(0, 1fr)",
    minWidth: 0,
    padding: "14px",
  },
  thumb: {
    alignItems: "center",
    alignSelf: "start",
    aspectRatio: "1",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    color: "#2563eb",
    display: "inline-flex",
    justifyContent: "center",
    width: "72px",
  },
  thumbWithImage: {
    alignSelf: "start",
    aspectRatio: "1",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    color: "#2563eb",
    overflow: "hidden",
    position: "relative",
    width: "72px",
  },
  thumbImage: {
    display: "block",
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
  thumbIconOverlay: {
    alignItems: "center",
    background: "rgba(15, 23, 42, 0.58)",
    borderRadius: "999px",
    color: "white",
    display: "inline-flex",
    height: "34px",
    justifyContent: "center",
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "34px",
  },
  cardBody: {
    display: "grid",
    gap: "10px",
    minWidth: 0,
  },
  cardTop: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "space-between",
  },
  mediaPill: {
    background: "#f3f4f6",
    borderRadius: "999px",
    color: "#4b5563",
    fontSize: "12px",
    fontWeight: "800",
    padding: "6px 9px",
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: "18px",
    lineHeight: 1.25,
    margin: 0,
    overflowWrap: "anywhere",
  },
  cardDescription: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.45,
    margin: 0,
  },
  cardActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  cardButton: {
    alignItems: "center",
    display: "inline-flex",
    flex: "1 1 128px",
    gap: "7px",
    justifyContent: "center",
    minHeight: "40px",
  },
  metaGrid: {
    display: "grid",
    gap: "8px",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  metaItem: {
    background: "rgba(239, 246, 255, 0.62)",
    border: "1px solid rgba(191, 219, 254, 0.42)",
    borderRadius: "8px",
    minWidth: 0,
    padding: "9px",
  },
  metaLabel: {
    color: "#64748b",
    display: "block",
    fontSize: "11px",
    fontWeight: "850",
    marginBottom: "3px",
    textTransform: "uppercase",
  },
  metaValue: {
    color: "#111827",
    display: "block",
    fontSize: "13px",
    lineHeight: 1.25,
    overflowWrap: "anywhere",
  },
  modalOverlay: {
    alignItems: "center",
    background: "rgba(15, 23, 42, 0.58)",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    padding: "24px",
    position: "fixed",
    zIndex: 1000,
  },
  modal: {
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 28px 72px rgba(15, 23, 42, 0.28)",
    maxHeight: "calc(100vh - 48px)",
    overflow: "auto",
    padding: "20px",
    width: "min(680px, 100%)",
  },
  modalHeader: {
    alignItems: "flex-start",
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  modalTitle: {
    color: "#111827",
    fontSize: "22px",
    lineHeight: 1.2,
    margin: 0,
  },
  modalDescription: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.45,
    marginTop: "6px",
  },
  iconButton: {
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center",
    minHeight: "40px",
    minWidth: "40px",
    padding: "9px",
  },
  form: {
    display: "grid",
    gap: "14px",
  },
  formGrid: {
    display: "grid",
    gap: "12px",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  formField: {
    display: "grid",
    gap: "7px",
    minWidth: 0,
  },
  formLabel: {
    color: "#111827",
    fontSize: "13px",
    fontWeight: "850",
  },
  textarea: {
    background: "white",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    color: "#111827",
    minHeight: "116px",
    minWidth: 0,
    outline: "none",
    padding: "9px 11px",
    resize: "vertical",
    width: "100%",
  },
  fieldError: {
    color: "#b91c1c",
    fontSize: "12px",
    fontWeight: "750",
  },
  fieldHelper: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.35,
  },
  youtubePreview: {
    aspectRatio: "16 / 9",
    background: "#0f172a",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    overflow: "hidden",
    width: "100%",
  },
  youtubeFrame: {
    border: 0,
    display: "block",
    height: "100%",
    width: "100%",
  },
  modalFooter: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "4px",
  },
  footerButton: {
    alignItems: "center",
    display: "inline-flex",
    gap: "8px",
    justifyContent: "center",
    minHeight: "42px",
  },
};

export default ExerciseLibraryPage;
