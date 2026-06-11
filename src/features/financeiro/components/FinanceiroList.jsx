import Sidebar from "../../../components/Sidebar";
import { useFinanceiroPage } from "../hooks/useFinanceiroPage";
import FinanceiroCards from "./FinanceiroCards";
import FinanceiroFilters from "./FinanceiroFilters";
import FinanceiroHeader from "./FinanceiroHeader";
import FinanceiroMobileCards from "./FinanceiroMobileCards";
import FinanceiroTable from "./FinanceiroTable";

function FinanceiroList() {
  const page = useFinanceiroPage();

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <div className="app-main page-container" style={styles.conteudo}>
        <FinanceiroHeader />

        <FinanceiroCards resumo={page.resumo} styles={styles} />

        <FinanceiroFilters
          busca={page.busca}
          filtroPagamento={page.filtroPagamento}
          filtroStatus={page.filtroStatus}
          onBuscaChange={page.setBusca}
          onFiltroPagamentoChange={page.setFiltroPagamento}
          onFiltroStatusChange={page.setFiltroStatus}
          onLimpar={page.limparFiltros}
          styles={styles}
        />

        {page.erro && <div style={styles.erroBox}>{page.erro}</div>}

        <FinanceiroMobileCards
          atualizandoId={page.atualizandoId}
          onDesfazer={page.desfazerPagamento}
          onReceber={page.abrirRegistroPagamento}
          onWhatsApp={page.enviarAvisoWhatsApp}
          registros={page.registrosFiltrados}
        />

        <FinanceiroTable
          atualizandoId={page.atualizandoId}
          carregando={page.carregando}
          onDesfazer={page.desfazerPagamento}
          onReceber={page.abrirRegistroPagamento}
          onWhatsApp={page.enviarAvisoWhatsApp}
          registros={page.registrosFiltrados}
          styles={styles}
        />

        {page.modalPagamento && (
          <PagamentoModal
            atualizando={page.atualizandoId === page.modalPagamento.aluno.id}
            form={page.formPagamento}
            onChange={page.setFormPagamento}
            onClose={page.fecharModalPagamento}
            onSave={page.registrarPagamento}
            registro={page.modalPagamento}
            styles={styles}
          />
        )}
      </div>
    </div>
  );
}

function PagamentoModal({ registro, form, atualizando, onChange, onClose, onSave, styles }) {
  function atualizar(campo, valor) {
    onChange({ ...form, [campo]: valor });
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalTopo}>
          <div>
            <h2 style={styles.modalTitulo}>Registrar pagamento</h2>
            <p style={styles.secaoLegenda}>
              {registro.aluno.nome} - parcela {form.parcela}/{form.totalParcelas}
            </p>
          </div>
          <button onClick={onClose} style={styles.botaoNeutro}>
            Fechar
          </button>
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
              <option value="Cartao">Cartao</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Boleto">Boleto</option>
              <option value="Outro">Outro</option>
            </select>
          </label>

          <label style={styles.campoGrupo}>
            <span style={styles.labelCampo}>Parcela</span>
            <input
              type="number"
              min="1"
              max={form.totalParcelas}
              value={form.parcela}
              onChange={(e) => atualizar("parcela", e.target.value)}
              style={styles.campo}
            />
          </label>

          <label style={{ ...styles.campoGrupo, gridColumn: "1 / -1" }}>
            <span style={styles.labelCampo}>Observações</span>
            <textarea
              rows="3"
              value={form.observacoes}
              onChange={(e) => atualizar("observacoes", e.target.value)}
              style={{ ...styles.campo, minHeight: "80px", resize: "vertical" }}
            />
          </label>
        </div>

        <div style={styles.rodapeModal}>
          <button onClick={onClose} style={styles.botaoNeutro}>
            Cancelar
          </button>
          <button onClick={onSave} style={styles.botaoReceber} disabled={atualizando}>
            {atualizando ? "Salvando..." : "Salvar pagamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const styles = {
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "20px",
    marginTop: "25px",
  },
  conteudo: {
    padding: "24px",
    marginLeft: "260px",
    width: "calc(100% - 260px)",
  },
  card,
  numeroCard: {
    fontSize: "24px",
    fontWeight: "700",
    marginTop: "10px",
  },
  filtrosCard: {
    ...card,
    marginTop: "30px",
  },
  secaoTitulo: {
    margin: 0,
    fontSize: "22px",
  },
  secaoLegenda: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "6px",
  },
  filtros: {
    display: "grid",
    gridTemplateColumns:
      "minmax(220px, 1fr) minmax(170px, 220px) minmax(180px, 220px) auto",
    gap: "10px",
    marginTop: "18px",
  },
  campoGrupo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  labelCampo: {
    color: "#374151",
    fontSize: "13px",
    fontWeight: "700",
  },
  campo: {
    width: "100%",
    minHeight: "42px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "9px 11px",
    background: "white",
    color: "#111827",
    outline: "none",
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  linhaCabecalho: {
    background: "#111827",
    color: "#fff",
  },
  header: {
    padding: "12px",
    textAlign: "left",
  },
  celula: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
  estadoVazio: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
    textAlign: "center",
  },
  botaoReceber: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  botaoNeutro: {
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  erroBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#991b1b",
    fontSize: "14px",
    fontWeight: "700",
    marginTop: "16px",
    padding: "12px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "rgba(17, 24, 39, 0.55)",
  },
  modal: {
    width: "min(620px, 100%)",
    background: "white",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
  },
  modalTopo: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
  },
  modalTitulo: {
    margin: 0,
    fontSize: "22px",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },
  rodapeModal: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "22px",
  },
};

export default FinanceiroList;
