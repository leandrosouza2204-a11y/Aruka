import { formatarData, formatarMoeda } from "../../../../data/alunosUtils";
import ModalBase from "./ModalBase";
import ResumoItem from "./ResumoItem";

function RelatorioAlunoModal({ registro, onClose, styles }) {
  const resumo = registro.resumoAluno;

  return (
    <ModalBase onClose={onClose} styles={styles} largura="min(720px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Relatório financeiro do aluno</h2>
          <p style={styles.secaoLegenda}>{resumo.nomeAluno}</p>
        </div>
        <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
      </div>

      <div style={styles.resumoGrid}>
        <ResumoItem label="Data de início" valor={formatarData(resumo.dataInicio)} styles={styles} />
        <ResumoItem label="Tempo na consultoria" valor={`${resumo.tempoConsultoriaMeses} meses`} styles={styles} />
        <ResumoItem label="Total pago" valor={formatarMoeda(resumo.totalPago)} styles={styles} />
        <ResumoItem label="Pagamentos" valor={resumo.quantidadePagamentos} styles={styles} />
        <ResumoItem label="Ticket médio" valor={formatarMoeda(resumo.ticketMedio)} styles={styles} />
        <ResumoItem label="Plano atual" valor={resumo.planoAtual} styles={styles} />
        <ResumoItem label="Último pagamento" valor={formatarData(resumo.ultimoPagamento?.dataPagamento)} styles={styles} />
        <ResumoItem label="Próximo vencimento" valor={formatarData(resumo.proximoVencimento)} styles={styles} />
      </div>

      <section style={styles.relatorioBox}>
        <h3 style={styles.subtituloModal}>Resumo para promoções</h3>
        <p style={styles.secaoLegenda}>
          {resumo.recorrenteEmDia
            ? "Aluno com pagamentos recorrentes em dia, bom candidato para bônus, renovação antecipada ou campanha de fidelidade."
            : "Use o histórico para avaliar campanhas de reativação, renovação ou acompanhamento individual."}
        </p>
      </section>

      {registro.grupoAcompanhamento === "encerrados" && (
        <section style={styles.relatorioBox}>
          <h3 style={styles.subtituloModal}>Encerramento do acompanhamento</h3>
          <div style={styles.resumoGrid}>
            <ResumoItem label="Status" valor={registro.statusAcompanhamento} styles={styles} />
            <ResumoItem label="Motivo" valor={registro.motivoEncerramento.label} styles={styles} />
            <ResumoItem
              label="Data de encerramento"
              valor={formatarData(registro.acompanhamento.encerradoEm)}
              styles={styles}
            />
            {registro.motivoEncerramento.detalhe && (
              <ResumoItem
                label="Observação"
                valor={registro.motivoEncerramento.detalhe}
                styles={styles}
              />
            )}
          </div>
        </section>
      )}
    </ModalBase>
  );
}

export default RelatorioAlunoModal;
