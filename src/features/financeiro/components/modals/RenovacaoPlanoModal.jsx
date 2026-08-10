import { formatarData, formatarMoeda } from "../../../../data/alunosUtils";
import ModalBase from "./ModalBase";
import ResumoItem from "./ResumoItem";

function RenovacaoPlanoModal({
  registro,
  planos,
  form,
  dadosCalculados,
  atualizando,
  onChange,
  onClose,
  onSave,
  styles,
}) {
  function atualizar(campo, valor) {
    onChange({ ...form, [campo]: valor });
  }

  const planoAtual = registro.plano;
  const novoPlano = planos.find((plano) => plano.id === form.novoPlanoId);

  return (
    <ModalBase
      onClose={onClose}
      styles={styles}
      largura="min(760px, 100%)"
      contentClassName="renovacao-plano-modal"
    >
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Renovar plano</h2>
          <p style={styles.secaoLegenda}>
            Atualize o contrato do aluno sem misturar com recebimento de parcela.
          </p>
        </div>
        <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
      </div>

      <div className="renovacao-modal-scroll">
        <div className="renovacao-modal-grid" style={styles.modalGrid}>
          <ResumoItem label="Aluno" valor={registro.aluno.nome} styles={styles} />
          <ResumoItem label="Plano atual" valor={planoAtual?.nome || registro.nomePlano} styles={styles} />
          <ResumoItem label="Vencimento atual" valor={formatarData(registro.aluno.vencimento)} styles={styles} />

          <label style={styles.campoGrupo}>
            <span style={styles.labelCampo}>Novo plano</span>
            <select
              value={form.novoPlanoId}
              onChange={(e) => atualizar("novoPlanoId", e.target.value)}
              style={styles.campo}
            >
              {planos.map((plano) => (
                <option key={plano.id} value={plano.id}>
                  {plano.nome}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.campoGrupo}>
            <span style={styles.labelCampo}>Data de inicio da renovacao</span>
            <input
              type="date"
              value={form.dataInicio}
              onChange={(e) => atualizar("dataInicio", e.target.value)}
              style={styles.campo}
            />
          </label>

          <ResumoItem
            label="Novo vencimento calculado"
            valor={formatarData(dadosCalculados.novoVencimento)}
            styles={styles}
          />

          <ResumoItem
            label="Valor do novo plano"
            valor={formatarMoeda(dadosCalculados.valor || novoPlano?.valor || 0)}
            styles={styles}
          />

          <label style={{ ...styles.campoGrupo, justifyContent: "center" }}>
            <span style={styles.labelCampo}>Registrar pagamento agora?</span>
            <select
              value={form.registrarPagamentoAgora ? "sim" : "nao"}
              onChange={(e) => atualizar("registrarPagamentoAgora", e.target.value === "sim")}
              style={styles.campo}
            >
              <option value="sim">Sim</option>
              <option value="nao">Nao</option>
            </select>
          </label>

          <label style={styles.campoGrupo}>
            <span style={styles.labelCampo}>Forma de pagamento</span>
            <select
              value={form.formaPagamento}
              onChange={(e) => atualizar("formaPagamento", e.target.value)}
              style={styles.campo}
              disabled={!form.registrarPagamentoAgora}
            >
              <option value="Pix">Pix</option>
              <option value="Cartao">Cartao</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Boleto">Boleto</option>
              <option value="Outro">Outro</option>
            </select>
          </label>

          <label style={{ ...styles.campoGrupo, gridColumn: "1 / -1" }}>
            <span style={styles.labelCampo}>Observacoes</span>
            <textarea
              rows="3"
              value={form.observacao}
              onChange={(e) => atualizar("observacao", e.target.value)}
              style={{ ...styles.campo, minHeight: "80px", resize: "vertical" }}
            />
          </label>
        </div>
      </div>

      <div className="financeiro-modal-footer renovacao-modal-footer" style={styles.rodapeModal}>
        <button onClick={onClose} style={styles.botaoNeutro}>Cancelar</button>
        <button onClick={onSave} style={styles.botaoReceber} disabled={atualizando}>
          {atualizando ? "Renovando..." : "Confirmar renovacao"}
        </button>
      </div>
    </ModalBase>
  );
}

export default RenovacaoPlanoModal;
