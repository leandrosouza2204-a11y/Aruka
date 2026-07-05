import { useMemo, useState } from "react";
import AccessibleModal from "../../../components/AccessibleModal";
import Sidebar from "../../../components/Sidebar";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
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
        <FinanceiroHeader onRelatorios={page.abrirRelatorioGeral} />

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
          carregando={page.carregando}
          onDesfazer={page.desfazerPagamento}
          onHistorico={page.abrirHistorico}
          onReceber={page.abrirRegistroPagamento}
          onRelatorioAluno={page.abrirRelatorioAluno}
          onRenovarPlano={page.abrirRenovacaoPlano}
          onWhatsApp={page.enviarAvisoWhatsApp}
          registros={page.registrosFiltrados}
        />

        <FinanceiroTable
          atualizandoId={page.atualizandoId}
          carregando={page.carregando}
          onDesfazer={page.desfazerPagamento}
          onHistorico={page.abrirHistorico}
          onReceber={page.abrirRegistroPagamento}
          onRelatorioAluno={page.abrirRelatorioAluno}
          onRenovarPlano={page.abrirRenovacaoPlano}
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

        {page.modalRenovacao && (
          <RenovacaoPlanoModal
            atualizando={page.atualizandoId === page.modalRenovacao.aluno.id}
            dadosCalculados={page.dadosRenovacaoCalculados}
            form={page.formRenovacao}
            onChange={page.setFormRenovacao}
            onClose={page.fecharRenovacaoPlano}
            onSave={page.confirmarRenovacaoPlano}
            planos={page.planosAtivos}
            registro={page.modalRenovacao}
            styles={styles}
          />
        )}

        {page.modalHistorico && (
          <HistoricoFinanceiroModal
            onClose={page.fecharHistorico}
            onRelatorio={() => page.abrirRelatorioAluno(page.modalHistorico)}
            registro={page.modalHistorico}
            styles={styles}
          />
        )}

        {page.modalRelatorioAluno && (
          <RelatorioAlunoModal
            onClose={page.fecharRelatorioAluno}
            registro={page.modalRelatorioAluno}
            styles={styles}
          />
        )}

        {page.modalRelatorioGeral && (
          <RelatorioGeralModal
            onClose={page.fecharRelatorioGeral}
            ranking={page.rankingFinanceiro}
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
    <ModalBase onClose={onClose} styles={styles} largura="min(760px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Renovar plano</h2>
          <p style={styles.secaoLegenda}>
            Atualize o contrato do aluno sem misturar com recebimento de parcela.
          </p>
        </div>
        <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
      </div>

      <div style={styles.modalGrid}>
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

      <div className="financeiro-modal-footer" style={styles.rodapeModal}>
        <button onClick={onClose} style={styles.botaoNeutro}>Cancelar</button>
        <button onClick={onSave} style={styles.botaoReceber} disabled={atualizando}>
          {atualizando ? "Renovando..." : "Confirmar renovacao"}
        </button>
      </div>
    </ModalBase>
  );
}

function HistoricoFinanceiroModal({ registro, onClose, onRelatorio, styles }) {
  const [ordem, setOrdem] = useState("desc");
  const pagamentos = useMemo(() => {
    return [...registro.pagamentos].sort((a, b) => {
      const resultado = String(a.dataPagamento).localeCompare(String(b.dataPagamento));
      return ordem === "asc" ? resultado : -resultado;
    });
  }, [ordem, registro.pagamentos]);
  const totalPago = pagamentos.reduce((total, pagamento) => total + Number(pagamento.valor || 0), 0);

  return (
    <ModalBase onClose={onClose} styles={styles} largura="min(980px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Histórico financeiro do aluno</h2>
          <p style={styles.secaoLegenda}>
            {registro.aluno.nome} - total pago {formatarMoeda(totalPago)}
          </p>
        </div>
        <div className="financeiro-modal-actions" style={styles.modalAcoes}>
          <button onClick={onRelatorio} className="table-button table-button-primary">Relatório</button>
          <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
        </div>
      </div>

      <div className="financeiro-history-filter" style={styles.filtrosHistorico}>
        <label style={styles.campoGrupo}>
          <span style={styles.labelCampo}>Ordenar por data</span>
          <select value={ordem} onChange={(e) => setOrdem(e.target.value)} style={styles.campo}>
            <option value="desc">Mais recentes primeiro</option>
            <option value="asc">Mais antigos primeiro</option>
          </select>
        </label>
      </div>

      <div className="app-table-scroll financeiro-history-table" style={styles.tabelaModal}>
        <table className="app-table financeiro-history-data-table" style={styles.tabela}>
          <thead>
            <tr style={styles.linhaCabecalho}>
              <th className="financeiro-history-date" style={styles.header}>Data</th>
              <th className="financeiro-history-money" style={styles.header}>Valor</th>
              <th className="financeiro-history-text" style={styles.header}>Plano</th>
              <th className="financeiro-history-type" style={styles.header}>Tipo</th>
              <th className="financeiro-history-short" style={styles.header}>Parcela</th>
              <th className="financeiro-history-date" style={styles.header}>Vencimento da parcela</th>
              <th className="financeiro-history-short" style={styles.header}>Forma</th>
              <th className="financeiro-history-date" style={styles.header}>Vencimento do plano antes</th>
              <th className="financeiro-history-date" style={styles.header}>Vencimento do plano depois</th>
              <th className="financeiro-history-observation" style={styles.header}>Observação</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.length === 0 ? (
              <tr>
                <td colSpan="10" style={styles.estadoVazio}>Nenhum pagamento registrado.</td>
              </tr>
            ) : (
              pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td className="financeiro-history-date" style={styles.celula}>{formatarData(pagamento.dataPagamento)}</td>
                  <td className="financeiro-history-money" style={styles.celula}>{formatarMoeda(pagamento.valor)}</td>
                  <td className="financeiro-history-text" style={styles.celula}>{pagamento.plano || registro.nomePlano}</td>
                  <td className="financeiro-history-type" style={styles.celula}>{formatarTipoMovimento(pagamento.tipoMovimento)}</td>
                  <td className="financeiro-history-short" style={styles.celula}>{pagamento.parcela}</td>
                  <td className="financeiro-history-date" style={styles.celula}>{formatarData(pagamento.vencimentoParcela)}</td>
                  <td className="financeiro-history-short" style={styles.celula}>{pagamento.formaPagamento || "-"}</td>
                  <td className="financeiro-history-date" style={styles.celula}>{formatarData(pagamento.vencimentoAnterior)}</td>
                  <td className="financeiro-history-date" style={styles.celula}>{formatarData(pagamento.vencimentoNovo)}</td>
                  <td className="financeiro-history-observation" style={styles.celula}>{pagamento.observacao || pagamento.observacoes || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-card-list financeiro-history-mobile" style={styles.mobileModalList}>
        {pagamentos.map((pagamento) => (
          <article key={pagamento.id} className="mobile-list-card financeiro-list-card">
            <Info label="Data" valor={formatarData(pagamento.dataPagamento)} />
            <Info label="Valor" valor={formatarMoeda(pagamento.valor)} />
            <Info label="Plano" valor={pagamento.plano || registro.nomePlano} />
            <Info label="Tipo" valor={formatarTipoMovimento(pagamento.tipoMovimento)} />
            <Info label="Parcela" valor={pagamento.parcela} />
            <Info label="Vencimento da parcela" valor={formatarData(pagamento.vencimentoParcela)} />
            <Info label="Forma" valor={pagamento.formaPagamento || "-"} />
            <Info label="Vencimento do plano antes" valor={formatarData(pagamento.vencimentoAnterior)} />
            <Info label="Vencimento do plano depois" valor={formatarData(pagamento.vencimentoNovo)} />
            <Info label="Observação" valor={pagamento.observacao || pagamento.observacoes || "-"} />
          </article>
        ))}
      </div>
    </ModalBase>
  );
}

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
    </ModalBase>
  );
}

function RelatorioGeralModal({ ranking, onClose, styles }) {
  return (
    <ModalBase onClose={onClose} styles={styles} largura="min(980px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Relatórios financeiros</h2>
          <p style={styles.secaoLegenda}>Rankings para identificar alunos antigos, recorrentes e com maior valor acumulado.</p>
        </div>
        <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
      </div>

      <div style={styles.rankingGrid}>
        <RankingLista titulo="Maior valor acumulado" itens={ranking.porTotalPago} metrica={(item) => formatarMoeda(item.totalPago)} styles={styles} />
        <RankingLista titulo="Mais tempo na consultoria" itens={ranking.porTempoConsultoria} metrica={(item) => `${item.tempoConsultoriaMeses} meses`} styles={styles} />
        <RankingLista titulo="Mais pagamentos" itens={ranking.porQuantidadePagamentos} metrica={(item) => `${item.quantidadePagamentos} pagamentos`} styles={styles} />
      </div>

      <section style={styles.relatorioBox}>
        <h3 style={styles.subtituloModal}>Pagamentos recorrentes em dia</h3>
        <div style={styles.listaCompacta}>
          {ranking.recorrentesEmDia.length === 0 ? (
            <span style={styles.secaoLegenda}>Nenhum aluno recorrente em dia encontrado ainda.</span>
          ) : (
            ranking.recorrentesEmDia.map((item) => (
              <span key={item.aluno.id} style={styles.rankingLinha}>
                <strong>{item.nomeAluno}</strong>
                <span>{formatarMoeda(item.totalPago)}</span>
              </span>
            ))
          )}
        </div>
      </section>
    </ModalBase>
  );
}

function RankingLista({ titulo, itens, metrica, styles }) {
  return (
    <section style={styles.rankingCard}>
      <h3 style={styles.subtituloModal}>{titulo}</h3>
      <div style={styles.listaCompacta}>
        {itens.slice(0, 8).map((item, index) => (
          <span key={item.aluno.id} style={styles.rankingLinha}>
            <strong>{index + 1}. {item.nomeAluno}</strong>
            <span>{metrica(item)}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function ResumoItem({ label, valor, styles }) {
  return (
    <div style={styles.resumoItem}>
      <span style={styles.labelCampo}>{label}</span>
      <strong>{valor || "-"}</strong>
    </div>
  );
}

function Info({ label, valor }) {
  return (
    <div className="card-row">
      <span className="card-label">{label}</span>
      <strong className="card-value">{valor}</strong>
    </div>
  );
}

function formatarTipoMovimento(tipo) {
  const mapa = {
    pagamento_parcela: "Pagamento de parcela",
    renovacao_plano: "Renovação de plano",
    pagamento_avulso: "Pagamento avulso",
  };

  return mapa[tipo] || "Pagamento";
}

function ModalBase({ children, onClose, largura }) {
  return (
    <AccessibleModal
      isOpen
      onClose={onClose}
      ariaLabel="Modal financeiro"
      size="full"
      showCloseButton={false}
      contentClassName="financeiro-modal"
      className="financeiro-modal-overlay"
    >
      <div style={{ width: largura }}>
        {children}
      </div>
    </AccessibleModal>
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
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
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
  modalAcoes: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "flex-end",
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
  filtrosHistorico: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 240px)",
    marginTop: "18px",
  },
  tabelaModal: {
    marginTop: "18px",
  },
  mobileModalList: {
    marginTop: "18px",
  },
  resumoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },
  resumoItem: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    display: "grid",
    gap: "6px",
    padding: "14px",
  },
  relatorioBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    marginTop: "18px",
    padding: "16px",
  },
  subtituloModal: {
    margin: 0,
    fontSize: "16px",
  },
  rankingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },
  rankingCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "14px",
  },
  listaCompacta: {
    display: "grid",
    gap: "8px",
    marginTop: "12px",
  },
  rankingLinha: {
    alignItems: "center",
    display: "flex",
    gap: "10px",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "8px",
  },
};

export default FinanceiroList;
