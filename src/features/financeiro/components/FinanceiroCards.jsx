import { formatarMoeda } from "../../../data/alunosUtils";

function FinanceiroCards({ resumo, styles }) {
  return (
    <div style={styles.cardsGrid}>
      <Card titulo="Receita Prevista" valor={formatarMoeda(resumo.receitaPrevista)} styles={styles} />
      <Card titulo="Receita Recebida" valor={formatarMoeda(resumo.receitaRecebida)} styles={styles} />
      <Card titulo="Receita Pendente" valor={formatarMoeda(resumo.receitaPendente)} styles={styles} />
      <Card titulo="Alunos Ativos" valor={resumo.alunosAtivos} styles={styles} />
      <Card titulo="Alunos Vencidos" valor={resumo.alunosVencidos} destaque="#dc2626" styles={styles} />
    </div>
  );
}

function Card({ titulo, valor, destaque, styles }) {
  return (
    <div style={styles.card}>
      <h3>{titulo}</h3>
      <p style={{ ...styles.numeroCard, color: destaque || "#111827" }}>{valor}</p>
    </div>
  );
}

export default FinanceiroCards;
