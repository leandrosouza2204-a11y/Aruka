import {
  MOTIVO_OUTRO,
  MOTIVOS_ENCERRAMENTO,
} from "../../constants/motivosEncerramento";
import ModalBase from "./ModalBase";

function EncerrarAcompanhamentoModal({
  atualizando,
  form,
  onChange,
  onClose,
  onSave,
  registro,
  styles,
}) {
  const exigeDetalhe = form.motivo === MOTIVO_OUTRO;
  const detalheInvalido = exigeDetalhe && !form.detalhe.trim();
  const podeConfirmar = Boolean(form.motivo) && !detalheInvalido && !atualizando;

  function atualizar(campo, valor) {
    onChange({ ...form, [campo]: valor });
  }

  function confirmar() {
    if (!podeConfirmar) return;
    onSave();
  }

  return (
    <ModalBase onClose={onClose} styles={styles} largura="min(620px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Encerrar acompanhamento</h2>
          <p style={styles.secaoLegenda}>
            O aluno será movido para Encerrados. Pagamentos, avaliações, treinos
            e demais históricos serão preservados.
          </p>
        </div>
        <button onClick={onClose} style={styles.botaoNeutro} disabled={atualizando}>
          Fechar
        </button>
      </div>

      <div style={styles.modalGrid}>
        <label style={{ ...styles.campoGrupo, gridColumn: "1 / -1" }}>
          <span style={styles.labelCampo}>Aluno</span>
          <input value={registro.aluno.nome} style={styles.campo} disabled />
        </label>

        <label style={{ ...styles.campoGrupo, gridColumn: "1 / -1" }}>
          <span style={styles.labelCampo}>Motivo do encerramento</span>
          <select
            value={form.motivo}
            onChange={(event) => atualizar("motivo", event.target.value)}
            style={styles.campo}
          >
            <option value="">Selecione um motivo</option>
            {MOTIVOS_ENCERRAMENTO.map((motivo) => (
              <option key={motivo.value} value={motivo.value}>
                {motivo.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ ...styles.campoGrupo, gridColumn: "1 / -1" }}>
          <span style={styles.labelCampo}>
            {exigeDetalhe ? "Detalhe do motivo" : "Observação"}
          </span>
          <textarea
            rows="3"
            value={form.detalhe}
            onChange={(event) => atualizar("detalhe", event.target.value)}
            style={{ ...styles.campo, minHeight: "84px", resize: "vertical" }}
            placeholder={
              exigeDetalhe
                ? "Descreva brevemente o outro motivo."
                : "Opcional: registre um contexto breve sobre o encerramento."
            }
          />
          {detalheInvalido && (
            <span className="app-muted" style={styles.campoAjuda}>
              Informe um detalhe para usar Outro motivo.
            </span>
          )}
        </label>
      </div>

      <div className="financeiro-modal-footer" style={styles.rodapeModal}>
        <button onClick={onClose} style={styles.botaoNeutro} disabled={atualizando}>
          Cancelar
        </button>
        <button
          onClick={confirmar}
          style={styles.botaoReceber}
          disabled={!podeConfirmar}
        >
          {atualizando ? "Encerrando..." : "Confirmar encerramento"}
        </button>
      </div>
    </ModalBase>
  );
}

export default EncerrarAcompanhamentoModal;
