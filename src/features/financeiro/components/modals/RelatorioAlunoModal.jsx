import { formatarData, formatarMoeda } from "../../../../data/alunosUtils";
import ModalBase from "./ModalBase";
import ResumoItem from "./ResumoItem";

function RelatorioAlunoModal({ registro, onClose, styles }) {
  const resumo = registro.resumoAluno;

  return (
    <ModalBase onClose={onClose} styles={styles} largura="min(720px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>RelatÃ³rio financeiro do aluno</h2>
          <p style={styles.secaoLegenda}>{resumo.nomeAluno}</p>
        </div>
        <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
      </div>

      <div style={styles.resumoGrid}>
        <ResumoItem label="Data de inÃ­cio" valor={formatarData(resumo.dataInicio)} styles={styles} />
        <ResumoItem label="Tempo na consultoria" valor={`${resumo.tempoConsultoriaMeses} meses`} styles={styles} />
        <ResumoItem label="Total pago" valor={formatarMoeda(resumo.totalPago)} styles={styles} />
        <ResumoItem label="Pagamentos" valor={resumo.quantidadePagamentos} styles={styles} />
        <ResumoItem label="Ticket mÃ©dio" valor={formatarMoeda(resumo.ticketMedio)} styles={styles} />
        <ResumoItem label="Plano atual" valor={resumo.planoAtual} styles={styles} />
        <ResumoItem label="Ãšltimo pagamento" valor={formatarData(resumo.ultimoPagamento?.dataPagamento)} styles={styles} />
        <ResumoItem label="PrÃ³ximo vencimento" valor={formatarData(resumo.proximoVencimento)} styles={styles} />
      </div>

      <section style={styles.relatorioBox}>
        <h3 style={styles.subtituloModal}>Resumo para promoÃ§Ãµes</h3>
        <p style={styles.secaoLegenda}>
          {resumo.recorrenteEmDia
            ? "Aluno com pagamentos recorrentes em dia, bom candidato para bÃ´nus, renovaÃ§Ã£o antecipada ou campanha de fidelidade."
            : "Use o histÃ³rico para avaliar campanhas de reativaÃ§Ã£o, renovaÃ§Ã£o ou acompanhamento individual."}
        </p>
      </section>
    </ModalBase>
  );
}

export default RelatorioAlunoModal;
