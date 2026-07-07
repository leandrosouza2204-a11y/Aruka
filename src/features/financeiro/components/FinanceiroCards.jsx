import { formatarMoeda } from "../../../data/alunosUtils";

function FinanceiroCards({ resumo, styles }) {
  return (
    <div style={styles.cardsGrid}>
      <Card
        descricao="Considera alunos ativos e seus planos no ciclo atual."
        titulo="Receita Prevista"
        valor={formatarMoeda(resumo.receitaPrevista)}
        styles={styles}
      />
      <Card
        descricao="Considera pagamentos confirmados no ciclo atual."
        titulo="Receita Recebida"
        valor={formatarMoeda(resumo.receitaRecebida)}
        styles={styles}
      />
      <Card
        descricao="Valores do ciclo atual ainda não registrados como recebidos."
        titulo="Receita Pendente"
        valor={formatarMoeda(resumo.receitaPendente)}
        styles={styles}
      />
      <Card
        descricao="Alunos com acompanhamento ativo no período."
        titulo="Alunos Ativos"
        valor={resumo.alunosAtivos}
        styles={styles}
      />
      <Card
        descricao="Alunos com pagamento em atraso no ciclo atual."
        titulo="Alunos Vencidos"
        valor={resumo.alunosVencidos}
        destaque="#dc2626"
        styles={styles}
      />
    </div>
  );
}

function Card({ titulo, valor, descricao, destaque, styles }) {
  return (
    <div style={styles.card}>
      <h3>{titulo}</h3>
      <p style={{ ...styles.numeroCard, color: destaque || "#111827" }}>{valor}</p>
      <p className="app-muted" style={styles.cardDescricao}>{descricao}</p>
    </div>
  );
}

export default FinanceiroCards;
