import ModalBase from "./ModalBase";

function PagamentoModal({ registro, form, atualizando, onChange, onClose, onSave, styles }) {
  function atualizar(campo, valor) {
    onChange({ ...form, [campo]: valor });
  }

  return (
    <ModalBase onClose={onClose} styles={styles} largura="min(620px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Registrar pagamento</h2>
          <p style={styles.secaoLegenda}>
            {registro.aluno.nome} - parcela {form.parcela}/{form.totalParcelas}
          </p>
        </div>
        <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
      </div>

      <div style={styles.modalGrid}>
        <label style={styles.campoGrupo}>
          <span style={styles.labelCampo}>Data do pagamento</span>
          <input
            type="date"
            value={form.dataPagamento}
            onChange={(e) => atualizar("dataPagamento", e.target.value)}
            style={styles.campo}
          />
        </label>

        <label style={styles.campoGrupo}>
          <span style={styles.labelCampo}>Valor recebido</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.valor}
            onChange={(e) => atualizar("valor", e.target.value)}
            style={styles.campo}
          />
        </label>

        <label style={styles.campoGrupo}>
          <span style={styles.labelCampo}>Forma de pagamento</span>
          <select
            value={form.formaPagamento}
            onChange={(e) => atualizar("formaPagamento", e.target.value)}
            style={styles.campo}
          >
            <option value="Pix">Pix</option>
            <option value="Cartao">Cartão</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Transferencia">Transferência</option>
            <option value="Boleto">Boleto</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label style={styles.campoGrupo}>
          <span style={styles.labelCampo}>Tipo do movimento</span>
          <select
            value={form.tipoMovimento}
            onChange={(e) => atualizar("tipoMovimento", e.target.value)}
            style={styles.campo}
          >
            <option value="pagamento_parcela">Pagamento de parcela</option>
            <option value="pagamento_avulso">Pagamento avulso</option>
          </select>
        </label>

        <label style={styles.campoGrupo}>
          <span style={styles.labelCampo}>Parcela</span>
          <input
            type="text"
            value={form.parcela}
            onChange={(e) => atualizar("parcela", e.target.value)}
            style={styles.campo}
          />
        </label>

        <label style={styles.campoGrupo}>
          <span style={styles.labelCampo}>Vencimento da parcela</span>
          <input
            type="date"
            value={form.vencimentoParcela || ""}
            onChange={(e) => atualizar("vencimentoParcela", e.target.value)}
            style={styles.campo}
            disabled={form.tipoMovimento !== "pagamento_parcela"}
          />
        </label>

        <label style={{ ...styles.campoGrupo, gridColumn: "1 / -1" }}>
          <span style={styles.labelCampo}>Observação</span>
          <textarea
            rows="3"
            value={form.observacao ?? form.observacoes ?? ""}
            onChange={(e) => atualizar("observacao", e.target.value)}
            style={{ ...styles.campo, minHeight: "80px", resize: "vertical" }}
          />
        </label>
      </div>

      <div className="financeiro-modal-footer" style={styles.rodapeModal}>
        <button onClick={onClose} style={styles.botaoNeutro}>Cancelar</button>
        <button onClick={onSave} style={styles.botaoReceber} disabled={atualizando}>
          {atualizando ? "Salvando..." : "Salvar pagamento"}
        </button>
      </div>
    </ModalBase>
  );
}

export default PagamentoModal;
