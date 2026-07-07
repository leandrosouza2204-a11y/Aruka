import { CheckCircle2, Circle } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardOnboardingChecklist({ status }) {
  const itens = [
    {
      id: "plano",
      concluido: status.temPlano,
      titulo: "Criar primeiro plano",
      descricao: "Defina valores, duração e regras de parcelamento antes de cadastrar alunos.",
      cta: "Criar plano",
      to: "/planos",
    },
    {
      id: "aluno",
      concluido: status.temAluno,
      titulo: "Cadastrar primeiro aluno",
      descricao: "Adicione os dados do aluno e vincule um plano ativo para iniciar o acompanhamento.",
      cta: "Cadastrar aluno",
      to: "/alunos",
    },
    {
      id: "pagamento",
      concluido: status.temPagamento,
      titulo: "Registrar primeiro pagamento ou acessar financeiro",
      descricao: "Acesse o financeiro para acompanhar recebimentos, pendências e confirmar pagamentos.",
      cta: "Ir para financeiro",
      to: "/financeiro",
    },
  ];
  const totalConcluido = itens.filter((item) => item.concluido).length;

  if (totalConcluido === itens.length) {
    return (
      <section className="app-card app-section" style={styles.cardCompleto}>
        <div className="app-card-header">
          <div>
            <h2 style={styles.titulo}>Primeiros passos concluídos</h2>
            <p className="app-muted" style={styles.subtitulo}>
              Sua consultoria já tem a configuração inicial para acompanhar alunos.
            </p>
          </div>
          <span style={styles.progresso}>{totalConcluido}/{itens.length}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="app-card app-section" style={styles.card}>
      <div className="app-card-header" style={styles.header}>
        <div>
          <h2 style={styles.titulo}>Primeiros passos na Aruka</h2>
          <p className="app-muted" style={styles.subtitulo}>
            Complete estas etapas para configurar sua consultoria e começar a acompanhar seus alunos.
          </p>
        </div>
        <span style={styles.progresso}>{totalConcluido}/{itens.length}</span>
      </div>

      <div style={styles.lista}>
        {itens.map((item) => (
          <article key={item.id} style={styles.item}>
            <div style={styles.icone} aria-hidden="true">
              {item.concluido ? (
                <CheckCircle2 size={22} color="#16a34a" />
              ) : (
                <Circle size={22} color="#94a3b8" />
              )}
            </div>

            <div style={styles.copy}>
              <strong style={styles.itemTitulo}>{item.titulo}</strong>
              <span className="app-muted" style={styles.itemDescricao}>
                {item.descricao}
              </span>
            </div>

            {item.concluido ? (
              <span style={styles.concluido}>Concluído</span>
            ) : (
              <Link className="app-button app-button-secondary" to={item.to} style={styles.cta}>
                {item.cta}
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

const styles = {
  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    marginTop: "24px",
    padding: "20px",
  },
  cardCompleto: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    marginTop: "24px",
    padding: "18px",
  },
  header: {
    alignItems: "center",
  },
  titulo: {
    color: "#111827",
    fontSize: "20px",
    margin: 0,
  },
  subtitulo: {
    fontSize: "14px",
    marginTop: "6px",
  },
  progresso: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    color: "#1d4ed8",
    flex: "0 0 auto",
    fontSize: "13px",
    fontWeight: "900",
    padding: "8px 12px",
  },
  lista: {
    display: "grid",
    gap: "10px",
    marginTop: "18px",
  },
  item: {
    alignItems: "center",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    padding: "14px",
  },
  icone: {
    display: "inline-flex",
    flex: "0 0 auto",
  },
  copy: {
    display: "grid",
    flex: "1 1 220px",
    gap: "4px",
    minWidth: 0,
  },
  itemTitulo: {
    color: "#111827",
    fontSize: "15px",
  },
  itemDescricao: {
    fontSize: "13px",
    lineHeight: 1.45,
  },
  concluido: {
    color: "#166534",
    fontSize: "13px",
    fontWeight: "900",
  },
  cta: {
    minHeight: "36px",
    padding: "8px 12px",
    whiteSpace: "nowrap",
  },
};

export default DashboardOnboardingChecklist;
