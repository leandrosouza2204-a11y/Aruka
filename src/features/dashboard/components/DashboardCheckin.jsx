import { ClipboardCheck } from "lucide-react";
import AccessibleModal from "../../../components/AccessibleModal";
import {
  abrirWhatsApp,
  gerarMensagemCheckinSemanal,
  normalizarTelefoneWhatsApp,
} from "../../../services/whatsappService";

function DashboardCheckin({
  alunos,
  carregando,
  modalAberto,
  onAbrirModal,
  onFecharModal,
  styles,
}) {
  return (
    <>
      <div
        className="dashboard-metric-card dashboard-stat-card checkin-card"
        style={{ ...styles.card, ...styles.checkinCard }}
      >
        <div style={styles.metricHeader}>
          <span style={styles.metricIcon} aria-hidden="true">
            <ClipboardCheck size={18} />
          </span>
          <span style={styles.metricLabel}>Check-in semanal</span>
        </div>
        <p className="dashboard-stat-value" style={styles.numero}>
          {carregando ? "..." : alunos.length}
        </p>
        <span style={styles.metricHint}>Alunos aptos para contato semanal</span>
        <span style={styles.metricContext}>
          Inclui alunos sem contrato vencido. Vencidos ficam fora ate a regularizacao.
        </span>
        <button
          type="button"
          onClick={onAbrirModal}
          style={styles.botaoPrimario}
          disabled={carregando || alunos.length === 0}
        >
          Enviar check-ins
        </button>
      </div>

      {modalAberto && (
        <CheckinModal alunos={alunos} onClose={onFecharModal} styles={styles} />
      )}
    </>
  );
}

function CheckinModal({ alunos, onClose, styles }) {
  function enviar(aluno) {
    abrirWhatsApp(aluno.whatsapp, gerarMensagemCheckinSemanal(aluno));
  }

  return (
    <AccessibleModal
      isOpen
      onClose={onClose}
      title="Check-in semanal"
      description="Abra o WhatsApp aluno por aluno para manter o envio manual. A lista inclui apenas alunos sem contrato vencido."
      size="lg"
    >
      <div style={styles.listaCheckin}>
          {alunos.map((aluno) => {
            const possuiWhatsapp = Boolean(
              normalizarTelefoneWhatsApp(aluno.whatsapp)
            );

            return (
              <div key={aluno.id} style={styles.itemCheckin}>
                <div>
                  <strong style={styles.nomeCheckin}>{aluno.nome}</strong>
                  <span style={styles.whatsappCheckin}>
                    {aluno.whatsapp || "WhatsApp não cadastrado"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => enviar(aluno)}
                  style={
                    possuiWhatsapp
                      ? styles.botaoWhatsApp
                      : styles.botaoDesabilitado
                  }
                  disabled={!possuiWhatsapp}
                  title={
                    possuiWhatsapp
                      ? "Enviar check-in semanal"
                      : "WhatsApp não cadastrado"
                  }
                >
                  Enviar
                </button>
              </div>
            );
          })}
      </div>
    </AccessibleModal>
  );
}

export default DashboardCheckin;
