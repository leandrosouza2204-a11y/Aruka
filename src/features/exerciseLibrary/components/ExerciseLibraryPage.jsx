import { BookOpenCheck, Dumbbell, Film, Search, Sparkles, SlidersHorizontal } from "lucide-react";
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
            <h1 style={styles.titulo}>Biblioteca de Exercicios</h1>
            <p style={styles.subtitulo}>
              Encontre exercicios oficiais e pessoais para apoiar prescricoes mais consistentes.
            </p>
          </div>
          <div style={styles.heroStats} aria-label="Resumo da biblioteca">
            <ResumoItem label="Disponiveis" valor={page.exercicios.length} />
            <ResumoItem label="Visiveis" valor={page.exerciciosFiltrados.length} />
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
                Exercicios
              </h2>
              <p style={styles.sectionDescription}>
                Veja grupos, categorias e midia disponivel antes de montar a ficha.
              </p>
            </div>
            <span style={styles.securityBadge}>
              <Sparkles size={14} />
              Uso profissional
            </span>
          </div>

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
              <LoadingState texto="Carregando biblioteca de exercicios..." />
            </div>
          )}

          {!page.erro && !page.carregando && page.exerciciosFiltrados.length === 0 && (
            <EmptyState
              titulo="Nenhum exercicio encontrado."
              descricao="Ajuste a busca ou os filtros para visualizar outros exercicios disponiveis."
            />
          )}

          {!page.erro && !page.carregando && page.exerciciosFiltrados.length > 0 && (
            <div className="exercise-library-grid" data-testid="exercise-library-grid" style={styles.grid}>
              {page.exerciciosFiltrados.map((exercicio) => (
                <ExerciseLibraryCard key={exercicio.id} exercicio={exercicio} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ExerciseLibraryFilters({ page }) {
  return (
    <div className="exercise-library-filters" data-testid="exercise-library-filters" style={styles.filters}>
      <label style={styles.searchLabel}>
        <Search size={16} aria-hidden="true" />
        <span className="sr-only">Buscar exercicios</span>
        <input
          className="app-input"
          aria-label="Buscar exercicios"
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
        aria-label="Filtrar por midia"
        data-testid="exercise-library-media-filter"
        value={page.filtros.midia}
        onChange={(event) => page.atualizarFiltro("midia", event.target.value)}
        style={styles.field}
      >
        <option value="todos">Todas as midias</option>
        <option value="com_midia">Com midia</option>
        <option value="sem_midia">Sem midia</option>
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

function ExerciseLibraryCard({ exercicio }) {
  return (
    <article className="exercise-library-card" data-testid="exercise-library-card" style={styles.card}>
      <div style={styles.thumb} aria-hidden="true">
        {exercicio.possuiMidia ? <Film size={24} /> : <Dumbbell size={24} />}
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

        <h3 style={styles.cardTitle}>{exercicio.nome || "Exercicio sem nome"}</h3>
        <p style={styles.cardDescription}>
          {exercicio.descricao || exercicio.instrucoes || "Sem descricao cadastrada."}
        </p>

        <div style={styles.metaGrid}>
          <Meta label="Grupo" valor={exercicio.grupoMuscular || "Nao informado"} />
          <Meta label="Categoria" valor={exercicio.categoria || "Nao informada"} />
        </div>
      </div>
    </article>
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
};

export default ExerciseLibraryPage;
