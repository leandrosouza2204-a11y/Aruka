import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import InlineDetails from "../../../components/InlineDetails";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
import { classeStatusAluno } from "../../../data/statusHelpers";
import { trapModalFocus } from "../../../utils/modalAccessibility";
import { formatarAtencaoCobranca } from "../../financeiro/utils/billingAttention";
import { montarResumoOperacionalAluno } from "../utils/alunosResumoOperacional";
import { useAlunosPage } from "../hooks/useAlunosPage";
import {
  getStudentAccessActions,
  normalizeStudentAccessState,
} from "../../studentAccess/utils/studentAccessLifecycle";
import { buildExecutionHistorySummary } from "../../workoutExecution/utils/workoutExecutionSession";
import AlunoCardMobile from "./AlunoCardMobile";
import AlunosFilters from "./AlunosFilters";
import AlunosHeader from "./AlunosHeader";
import AlunosTable from "./AlunosTable";
import StudentProgressionSnapshot from "./StudentProgressionSnapshot";

function AlunosList() {
  const page = useAlunosPage();
  const alternarDetalhesAluno = (id) => {
    page.setAlunoSelecionadoId(page.alunoSelecionadoId === id ? "" : id);
  };

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <div
        className="alunos-page app-main page-container"
        data-page="alunos"
        data-testid="alunos-page"
        style={styles.conteudo}
      >
        <AlunosHeader
          alunosFiltradosTotal={page.alunosFiltrados.length}
          alunosTotal={page.alunos.length}
          onNovoAluno={page.abrirCadastro}
          styles={styles}
        />

        {!page.carregando && !page.erro && page.planos.length === 0 && (
          <section className="app-card app-alert" style={styles.planoAviso}>
            <div style={styles.planoAvisoTexto}>
              <h2 style={styles.planoAvisoTitulo}>
                Crie um plano antes de cadastrar alunos
              </h2>
              <p className="app-muted" style={styles.planoAvisoDescricao}>
                Os planos ajudam a organizar vencimentos, valores e o
                acompanhamento financeiro dos alunos. Cadastre o primeiro plano
                para deixar a base pronta.
              </p>
            </div>

            <Link className="app-button app-button-primary" to="/planos">
              Criar primeiro plano
            </Link>
          </section>
        )}

        <section className="app-card alunos-filter-card" style={styles.listaCard}>
          <AlunosFilters
            busca={page.busca}
            filtroPlano={page.filtroPlano}
            filtroStatus={page.filtroStatus}
            onBuscaChange={page.setBusca}
            onFiltroPlanoChange={page.setFiltroPlano}
            onFiltroStatusChange={page.setFiltroStatus}
            onLimpar={page.limparFiltros}
            planos={page.planos}
            styles={styles}
          />
        </section>

        {page.erro && <div className="app-error">{page.erro}</div>}

        {page.modalCadastroAberto && (
          <AlunoModal page={page} styles={styles} />
        )}

        <AlunosTable
          alunos={page.alunosFiltrados}
          carregando={page.carregando}
          nomePlano={page.nomePlano}
          onCheckin={page.enviarCheckinSemanal}
          onDetalhes={alternarDetalhesAluno}
          onEditar={page.abrirEdicao}
          onExcluir={page.excluirAluno}
          onNovoAluno={page.abrirCadastro}
          totalAlunos={page.alunos.length}
          hasActiveFilters={Boolean(page.busca || page.filtroPlano || page.filtroStatus !== "Todos")}
          styles={styles}
        />

        <div className="mobile-card-list alunos-mobile-cards">
          {page.carregando ? (
            <div className="app-loading mobile-list-card">
              Carregando alunos...
            </div>
          ) : page.alunosFiltrados.length === 0 ? (
            <div className="app-empty-state mobile-list-card">
              <strong>
                {page.alunos.length > 0
                  ? "Nenhum aluno encontrado para os filtros atuais."
                  : "Nenhum aluno cadastrado ainda."}
              </strong>
              <p className="app-muted">
                {page.alunos.length > 0
                  ? "Ajuste a busca, o status ou o plano para ver outros alunos."
                  : "Cadastre o primeiro aluno para acompanhar pagamentos, treinos e avaliacoes."}
              </p>
              {page.alunos.length === 0 && (
                <button type="button" className="app-button app-button-primary" onClick={page.abrirCadastro}>
                  Novo aluno
                </button>
              )}
            </div>
          ) : (
            page.alunosFiltrados.map((aluno) => (
              <AlunoCardMobile
                key={aluno.id}
                aluno={aluno}
                isExpanded={page.alunoSelecionadoId === aluno.id}
                nomePlano={page.nomePlano}
                onCheckin={page.enviarCheckinSemanal}
                onDetalhes={alternarDetalhesAluno}
                onEditar={page.abrirEdicao}
                onExcluir={page.excluirAluno}
              >
                <InlineDetails
                  className="mobile-inline-details"
                  itemId={aluno.id}
                  selectedItemId={page.alunoSelecionadoId}
                >
                  <AlunoDetalhesResponsivo
                    aluno={aluno}
                    contextUrls={page.alunoContextUrls}
                    nomePlano={page.nomePlano}
                    onEditar={page.abrirEdicao}
                    onFechar={() => page.setAlunoSelecionadoId("")}
                    onLiberarAcesso={page.liberarAcessoAluno}
                    onReativarAcesso={page.reativarAcessoAluno}
                    onRevogarAcesso={page.revogarAcessoAluno}
                    onSuspenderAcesso={page.suspenderAcessoAluno}
                    onRecarregarResumo={page.recarregarResumoOperacional}
                    resumoOperacional={page.resumoOperacional}
                    styles={styles}
                  />
                </InlineDetails>
              </AlunoCardMobile>
            ))
          )}
        </div>

        {page.alunoSelecionado && (
          <AlunoDetalhesResponsivo
            aluno={page.alunoSelecionado}
            className="desktop-detail-panel"
            contextUrls={page.alunoContextUrls}
            nomePlano={page.nomePlano}
            onEditar={page.abrirEdicao}
            onFechar={() => page.setAlunoSelecionadoId("")}
            onLiberarAcesso={page.liberarAcessoAluno}
            onReativarAcesso={page.reativarAcessoAluno}
            onRevogarAcesso={page.revogarAcessoAluno}
            onSuspenderAcesso={page.suspenderAcessoAluno}
            onRecarregarResumo={page.recarregarResumoOperacional}
            resumoOperacional={page.resumoOperacional}
            styles={styles}
          />
        )}
      </div>
    </div>
  );
}

function AlunoModal({ page, styles }) {
  const form = page.form;
  const errors = page.formErrors || {};
  const tituloId = "aluno-form-title";
  const descricaoId = "aluno-form-description";
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const fecharModal = page.fecharModal;

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        fecharModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflowAnterior;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [fecharModal]);

  useEffect(() => {
    if (!page.validationAttempt) return;
    const primeiroInvalido = document.querySelector(
      '[data-testid="aluno-form-modal"] [aria-invalid="true"]'
    );
    primeiroInvalido?.focus();
    primeiroInvalido?.scrollIntoView({ block: "center", inline: "nearest" });
  }, [page.validationAttempt]);

  function handleSubmit(event) {
    event.preventDefault();
    page.salvarAluno();
  }

  return createPortal(
    <div className="aluno-form-overlay" style={styles.modalOverlay}>
      <div
        ref={dialogRef}
        aria-describedby={descricaoId}
        aria-labelledby={tituloId}
        aria-modal="true"
        className="aluno-form-modal"
        data-testid="aluno-form-modal"
        role="dialog"
        style={styles.modal}
        tabIndex={-1}
        onKeyDown={(event) => trapModalFocus(event, dialogRef.current)}
      >
        <div className="aluno-form-header" style={styles.modalTopo}>
          <div className="aluno-form-heading">
            <h2 id={tituloId} style={styles.detalhesTitulo}>
              {page.alunoEditandoId ? "Editar Aluno" : "Cadastro Aluno"}
            </h2>
            <p id={descricaoId} style={styles.resumoLista}>Preencha os dados do aluno</p>
          </div>

          <button
            ref={closeButtonRef}
            className="aluno-form-close"
            data-testid="aluno-form-close"
            onClick={page.fecharModal}
            style={styles.botaoSecundario}
            type="button"
          >
            Fechar
          </button>
        </div>

        <form className="aluno-form-shell" onSubmit={handleSubmit}>
          <div
            className="aluno-form-scroll"
            data-testid="aluno-form-scroll"
            style={styles.formScroll}
          >
            <div className="aluno-form-grid" style={styles.formGrid}>
          <Campo error={errors.nome} errorId="aluno-name-error" label="Nome do aluno" styles={styles}>
            <input
              aria-describedby={errors.nome ? "aluno-name-error" : undefined}
              aria-invalid={errors.nome ? "true" : undefined}
              autoComplete="name"
              data-testid="aluno-name"
              enterKeyHint="next"
              placeholder="Ex: Maria Silva"
              value={form.nome}
              onChange={(e) => page.atualizarForm("nome", e.target.value)}
              style={errors.nome ? { ...styles.campo, ...styles.campoErro } : styles.campo}
            />
          </Campo>

          <Campo error={errors.whatsapp} errorId="aluno-phone-error" label="WhatsApp" styles={styles}>
            <input
              aria-describedby={errors.whatsapp ? "aluno-phone-error" : undefined}
              aria-invalid={errors.whatsapp ? "true" : undefined}
              autoComplete="tel"
              data-testid="aluno-phone"
              enterKeyHint="next"
              inputMode="tel"
              placeholder="Ex: (11) 99999-9999"
              type="tel"
              value={form.whatsapp}
              onChange={page.handleWhatsApp}
              style={errors.whatsapp ? { ...styles.campo, ...styles.campoErro } : styles.campo}
            />
          </Campo>

          <Campo label="Data de nascimento" styles={styles}>
            <input
              data-testid="aluno-birth-date"
              enterKeyHint="next"
              type="date"
              value={form.nascimento}
              onChange={(e) => page.atualizarForm("nascimento", e.target.value)}
              style={styles.campo}
            />
          </Campo>

          <Campo error={errors.inicio} errorId="aluno-plan-start-error" label="Início do plano" styles={styles}>
            <input
              aria-describedby={errors.inicio ? "aluno-plan-start-error" : undefined}
              aria-invalid={errors.inicio ? "true" : undefined}
              data-testid="aluno-plan-start"
              enterKeyHint="next"
              type="date"
              value={form.inicio}
              onChange={page.handleInicio}
              style={errors.inicio ? { ...styles.campo, ...styles.campoErro } : styles.campo}
            />
          </Campo>

          <Campo error={errors.plano} errorId="aluno-plan-error" label="Plano contratado" styles={styles}>
            <select
              aria-describedby={errors.plano ? "aluno-plan-error" : undefined}
              aria-invalid={errors.plano ? "true" : undefined}
              data-testid="aluno-plan"
              value={form.plano}
              onChange={page.handlePlano}
              style={errors.plano ? { ...styles.campo, ...styles.campoErro } : styles.campo}
            >
              <option value="">Selecione o plano</option>
              {page.planosAtivos.map((plano) => (
                <option key={plano.id} value={plano.id}>
                  {plano.nome}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Vencimento" styles={styles}>
            <input
              data-testid="aluno-due-date"
              readOnly
              placeholder="Calculado pelo plano"
              value={formatarData(form.vencimento)}
              style={{ ...styles.campo, background: "#f9fafb" }}
            />
          </Campo>

          <Campo label="Valor" styles={styles}>
            <input
              data-testid="aluno-value"
              inputMode="decimal"
              type="number"
              min="0"
              step="0.01"
              placeholder="Calculado pelo plano"
              value={form.valor}
              onChange={(e) => page.atualizarForm("valor", e.target.value)}
              style={styles.campo}
            />
          </Campo>

            </div>
          </div>

          <div
            className="aluno-form-footer"
            data-testid="aluno-form-footer"
            style={styles.formFooter}
          >
            <button
              className="aluno-form-cancel"
              data-testid="aluno-form-cancel"
              onClick={page.fecharModal}
              style={styles.botaoSecundario}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="aluno-form-submit"
              data-testid="aluno-form-submit"
              style={styles.botaoPrimario}
              disabled={page.salvando}
              type="submit"
            >
              {page.salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// eslint-disable-next-line no-unused-vars
function AlunoDetalhes({ aluno, className = "", nomePlano, onFechar, styles }) {
  return (
    <section className={className} style={styles.detalhesAluno}>
      <div style={styles.detalhesTopo}>
        <div>
          <h2 style={styles.detalhesTitulo}>{aluno.nome}</h2>
          <p style={styles.resumoLista}>Informações completas do cadastro</p>
        </div>

        <button onClick={onFechar} style={styles.botaoSecundario}>
          Fechar
        </button>
      </div>

      <div style={styles.detalhesGrid}>
        <Info label="WhatsApp" valor={aluno.whatsapp} styles={styles} />
        <Info label="Nascimento" valor={formatarData(aluno.nascimento)} styles={styles} />
        <Info label="Início do contrato" valor={formatarData(aluno.inicio)} styles={styles} />
        <Info label="Plano" valor={nomePlano(aluno.plano)} styles={styles} />
        <Info label="Valor" valor={formatarMoeda(aluno.valor)} styles={styles} />
        <Info label="Vencimento" valor={formatarData(aluno.vencimento)} styles={styles} />
        <Info label="Aviso 7 dias" valor={formatarData(aluno.aviso7)} styles={styles} />
        <Info label="Aviso 1 dia" valor={formatarData(aluno.aviso1)} styles={styles} />
        <Info label="Status" valor={aluno.status} styles={styles} />
        <Info label="Pagamento recebido" valor={aluno.pagamentoRecebido ? "Sim" : "Não"} styles={styles} />
        <Info label="Data do pagamento" valor={formatarData(aluno.dataPagamento)} styles={styles} />
        <Info label="Observações" valor={aluno.observacoes || "-"} styles={styles} />
      </div>
    </section>
  );
}

function AlunoDetalhesResponsivo({
  aluno,
  className = "",
  contextUrls = {},
  nomePlano,
  onEditar,
  onFechar,
  onLiberarAcesso,
  onReativarAcesso,
  onRevogarAcesso,
  onSuspenderAcesso,
  onRecarregarResumo,
  resumoOperacional,
  styles,
}) {
  const indicadores = montarResumoOperacionalAluno(aluno, resumoOperacional);

  return (
    <section
      className={`aluno-details ${className}`.trim()}
      data-testid="aluno-details"
      style={styles.detalhesAluno}
    >
      <div
        className="aluno-details-header"
        data-testid="aluno-details-header"
        style={styles.detalhesTopo}
      >
        <div className="aluno-details-heading">
          <span className={classeStatusAluno(aluno.status)}>{aluno.status}</span>
          <h2 style={styles.detalhesTitulo}>{aluno.nome}</h2>
          <p style={styles.resumoLista}>Informações completas do cadastro</p>
        </div>

        <button
          data-testid="aluno-details-close"
          onClick={onFechar}
          style={styles.botaoSecundario}
          type="button"
        >
          Fechar
        </button>
      </div>

      <div className="aluno-details-content" data-testid="aluno-details-content">
        <section
          className="aluno-details-section"
          data-testid="student-summary"
          style={styles.resumoOperacional}
        >
          <div style={styles.resumoOperacionalTopo}>
            <div>
              <h3>Resumo operacional</h3>
              <p style={styles.resumoLista}>Sinais rápidos para orientar a próxima ação.</p>
            </div>
            <button
              className="table-button table-button-secondary"
              data-testid="student-summary-retry"
              onClick={onRecarregarResumo}
              type="button"
            >
              Tentar novamente
            </button>
          </div>

          <div data-testid="student-summary-grid" style={styles.resumoIndicadoresGrid}>
            <ResumoIndicador indicador={indicadores.plano} testId="student-summary-plan" styles={styles} />
            <ResumoIndicador indicador={indicadores.tempo} testId="student-summary-time" styles={styles} />
            <ResumoIndicador indicador={indicadores.treino} testId="student-summary-training" styles={styles} />
            <ResumoIndicador indicador={indicadores.avaliacao} testId="student-summary-assessment" styles={styles} />
            <ResumoIndicador indicador={indicadores.financeiro} testId="student-summary-financial" styles={styles} />
          </div>
        </section>

        <StudentProgressionSnapshot
          styles={styles}
          treinosState={resumoOperacional?.treinos}
        />

        <StudentExecutionHistoryPanel
          execucoesState={resumoOperacional?.execucoes}
          styles={styles}
        />

        <StudentAccessPanel
          aluno={aluno}
          onLiberarAcesso={onLiberarAcesso}
          onReativarAcesso={onReativarAcesso}
          onRevogarAcesso={onRevogarAcesso}
          onSuspenderAcesso={onSuspenderAcesso}
          styles={styles}
        />

        <section
          className="aluno-details-section"
          data-testid="student-context-actions"
          style={styles.acoesContextuais}
        >
          <h3>Acoes contextuais</h3>
          <div style={styles.acoesContextuaisGrid}>
            <Link
              className="table-button table-button-primary"
              data-testid="student-action-training"
              to={contextUrls.treinos}
              style={styles.acaoContextualLink}
            >
              Ver treinos
            </Link>
            <Link
              className="table-button table-button-primary"
              data-testid="student-action-assessment"
              to={contextUrls.avaliacoes}
              style={styles.acaoContextualLink}
            >
              Ver avaliacoes
            </Link>
            <Link
              className="table-button table-button-primary"
              data-testid="student-action-financial"
              to={contextUrls.financeiro}
              style={styles.acaoContextualLink}
            >
              Ver financeiro
            </Link>
          </div>
        </section>

        <section className="aluno-details-section" data-testid="aluno-details-plan">
          <h3>Plano e vencimento</h3>
          <div style={styles.detalhesGrid}>
            <InfoResponsivo label="Plano" valor={nomePlano(aluno.plano)} styles={styles} />
            <InfoResponsivo label="Valor" valor={formatarMoeda(aluno.valor)} styles={styles} />
            <InfoResponsivo label="Início do contrato" valor={formatarData(aluno.inicio)} styles={styles} />
            <InfoResponsivo label="Vencimento" valor={formatarData(aluno.vencimento)} styles={styles} />
            <InfoResponsivo label="Cobrança" valor={formatarAtencaoCobranca(aluno.atencaoCobranca)} styles={styles} />
          </div>
        </section>

        <section className="aluno-details-section" data-testid="aluno-details-contact">
          <h3>Contato</h3>
          <div style={styles.detalhesGrid}>
            <InfoResponsivo label="WhatsApp" valor={aluno.whatsapp || "Não cadastrado"} styles={styles} />
          </div>
        </section>

        <section className="aluno-details-section">
          <h3>Dados pessoais e status</h3>
          <div style={styles.detalhesGrid}>
            <InfoResponsivo label="Nascimento" valor={formatarData(aluno.nascimento)} styles={styles} />
            <InfoResponsivo label="Status" valor={aluno.status} styles={styles} />
            <InfoResponsivo label="Pagamento recebido" valor={aluno.pagamentoRecebido ? "Sim" : "Não"} styles={styles} />
            <InfoResponsivo label="Data do pagamento" valor={formatarData(aluno.dataPagamento)} styles={styles} />
          </div>
        </section>

        <section className="aluno-details-section">
          <h3>Avisos</h3>
          <div style={styles.detalhesGrid}>
            <InfoResponsivo label="Aviso 7 dias" valor={formatarData(aluno.aviso7)} styles={styles} />
            <InfoResponsivo label="Aviso 1 dia" valor={formatarData(aluno.aviso1)} styles={styles} />
          </div>
        </section>

        <section
          className="aluno-details-section aluno-details-observacoes"
          data-testid="aluno-details-observacoes"
        >
          <h3>Observações</h3>
          <p>{aluno.observacoes || "Sem observações cadastradas"}</p>
        </section>

        <div className="aluno-details-actions" data-testid="aluno-details-actions">
          <button
            className="table-button table-button-primary"
            data-testid="aluno-details-edit"
            onClick={() => onEditar?.(aluno)}
            type="button"
          >
            Editar aluno
          </button>
          <button
            className="table-button table-button-secondary"
            onClick={onFechar}
            type="button"
          >
            Recolher detalhes
          </button>
        </div>
      </div>
    </section>
  );
}

function StudentAccessPanel({
  aluno,
  onLiberarAcesso,
  onReativarAcesso,
  onRevogarAcesso,
  onSuspenderAcesso,
  styles,
}) {
  const acesso = normalizeStudentAccessState({
    status: aluno.studentAccessStatus,
    email: aluno.studentAccessEmail,
    invitedAt: aluno.studentAccessInvitedAt,
    activatedAt: aluno.studentAccessActivatedAt,
    suspendedAt: aluno.studentAccessSuspendedAt,
    revokedAt: aluno.studentAccessRevokedAt,
    reason: aluno.studentAccessReason,
  });
  const emailRef = useRef(null);
  const actions = getStudentAccessActions(acesso);

  return (
    <section
      className="aluno-details-section"
      data-testid="student-access-panel"
      style={styles.studentAccessPanel}
    >
      <div style={styles.studentAccessHeader}>
        <div>
          <h3>Acesso ao Aruka</h3>
          <p style={styles.resumoLista}>Controle manual da area do aluno.</p>
        </div>
        <span style={{ ...styles.studentAccessBadge, ...studentAccessTone(acesso.tone) }}>
          {acesso.label}
        </span>
      </div>

      <label style={styles.studentAccessField}>
        <span>E-mail de acesso</span>
        <input
          aria-label="E-mail de acesso ao Aruka"
          defaultValue={acesso.email}
          disabled={!actions.includes("invite") && !actions.includes("activate")}
          key={`${aluno.id}-${acesso.email}-${acesso.status}`}
          placeholder="aluno@email.com"
          ref={emailRef}
          style={styles.studentAccessInput}
          type="email"
        />
      </label>

      {acesso.reason && <p style={styles.studentAccessReason}>{acesso.reason}</p>}

      <div style={styles.studentAccessActions}>
        {actions.includes("invite") && (
          <button
            className="table-button table-button-primary"
            data-testid="student-access-invite"
            onClick={() => onLiberarAcesso?.(aluno, emailRef.current?.value || "")}
            type="button"
          >
            Liberar acesso
          </button>
        )}
        {actions.includes("activate") && (
          <button
            className="table-button table-button-primary"
            data-testid="student-access-activate"
            onClick={() => onLiberarAcesso?.(aluno, emailRef.current?.value || "")}
            type="button"
          >
            Ativar acesso
          </button>
        )}
        {actions.includes("suspend") && (
          <button
            className="table-button table-button-secondary"
            data-testid="student-access-suspend"
            onClick={() => onSuspenderAcesso?.(aluno)}
            type="button"
          >
            Suspender acesso
          </button>
        )}
        {actions.includes("reactivate") && (
          <button
            className="table-button table-button-primary"
            data-testid="student-access-reactivate"
            onClick={() => onReativarAcesso?.(aluno)}
            type="button"
          >
            Reativar acesso
          </button>
        )}
        {actions.includes("revoke") && (
          <button
            className="table-button table-button-secondary"
            data-testid="student-access-revoke"
            onClick={() => onRevogarAcesso?.(aluno)}
            type="button"
          >
            Revogar acesso
          </button>
        )}
      </div>
    </section>
  );
}

function StudentExecutionHistoryPanel({ execucoesState, styles }) {
  if (!execucoesState || execucoesState.status === "idle" || execucoesState.status === "loading") {
    return (
      <section className="aluno-details-section" data-testid="student-execution-history" style={styles.resumoOperacional}>
        <ExecutionHistoryHeader />
        <div className="app-loading" data-testid="student-execution-history-loading" style={executionHistoryStyles.stateBox}>
          Carregando execucoes...
        </div>
      </section>
    );
  }

  if (execucoesState.status === "error") {
    return (
      <section className="aluno-details-section" data-testid="student-execution-history" style={styles.resumoOperacional}>
        <ExecutionHistoryHeader />
        <div className="app-empty-state" data-testid="student-execution-history-error" style={executionHistoryStyles.stateBox}>
          Não foi possível carregar o histórico de execução agora.
        </div>
      </section>
    );
  }

  const history = buildExecutionHistorySummary(execucoesState.data || []);

  return (
    <section className="aluno-details-section" data-testid="student-execution-history" style={styles.resumoOperacional}>
      <ExecutionHistoryHeader />
      {history.length ? (
        <div style={executionHistoryStyles.grid}>
          {history.map((item) => (
            <article key={item.id} style={styles.resumoIndicador} data-testid="student-execution-history-item">
              <span style={styles.infoLabel}>{item.statusLabel}</span>
              <strong style={styles.infoValor}>{item.workoutTitle}</strong>
              <p style={styles.resumoIndicadorTexto}>
                {item.dayName} - {item.dateLabel}
              </p>
              <p style={styles.resumoIndicadorTexto}>
                {item.exerciseCount} exercicio(s), {item.completedSetCount} serie(s) concluidas
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="app-empty-state" data-testid="student-execution-history-empty" style={executionHistoryStyles.stateBox}>
          Nenhum treino executado registrado ainda.
        </div>
      )}
    </section>
  );
}

function ExecutionHistoryHeader() {
  return (
    <div style={executionHistoryStyles.header}>
      <div>
        <h3 style={executionHistoryStyles.title}>Historico de execucao</h3>
        <p style={executionHistoryStyles.description}>Leitura recente dos treinos registrados pelo aluno.</p>
      </div>
      <History size={20} aria-hidden="true" />
    </div>
  );
}

function studentAccessTone(tone) {
  if (tone === "success") return { background: "#dcfce7", color: "#166534" };
  if (tone === "warning") return { background: "#fef3c7", color: "#92400e" };
  if (tone === "danger") return { background: "#fee2e2", color: "#991b1b" };
  if (tone === "info") return { background: "#dbeafe", color: "#1d4ed8" };
  return { background: "#f3f4f6", color: "#374151" };
}

function ResumoIndicador({ indicador, testId, styles }) {
  return (
    <article data-state={indicador.tom} data-testid={testId} style={styles.resumoIndicador}>
      <span style={styles.infoLabel}>{indicador.titulo}</span>
      <strong style={styles.infoValor}>{indicador.estado}</strong>
      <p style={styles.resumoIndicadorTexto}>{indicador.detalhe}</p>
    </article>
  );
}

function InfoResponsivo({ label, valor, styles }) {
  return (
    <div className="aluno-details-info" style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValor}>{valor || "Não informado"}</strong>
    </div>
  );
}

function Campo({ error = "", errorId = "", label, children, styles }) {
  return (
    <label style={styles.campoGrupo}>
      <span style={styles.labelCampo}>{label}</span>
      {children}
      {error && (
        <span data-testid={errorId} id={errorId} style={styles.mensagemErroCampo}>
          {error}
        </span>
      )}
    </label>
  );
}

function Info({ label, valor, styles }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValor}>{valor || "-"}</strong>
    </div>
  );
}

const executionHistoryStyles = {
  header: {
    alignItems: "flex-start",
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "16px",
    margin: 0,
  },
  description: {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.45,
    margin: "5px 0 0",
  },
  grid: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  },
  stateBox: {
    borderRadius: "8px",
    padding: "12px",
  },
};

const styles = {
  formGrid: {
    display: "grid",
    gap: "14px",
    maxWidth: "620px",
    width: "100%",
  },
  formScroll: {
    minHeight: 0,
    overflowX: "clip",
    overflowY: "auto",
    padding: "20px 24px",
  },
  formFooter: {
    alignItems: "center",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    flex: "0 0 auto",
    gap: "10px",
    justifyContent: "flex-end",
    padding: "14px 24px",
  },
  conteudo: {
    padding: "24px",
    marginLeft: "260px",
    width: "calc(100% - 260px)",
  },
  listaCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "22px",
  },
  planoAviso: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    justifyContent: "space-between",
    padding: "16px",
  },
  planoAvisoTexto: {
    display: "grid",
    gap: "5px",
    minWidth: 0,
  },
  planoAvisoTitulo: {
    color: "#111827",
    fontSize: "16px",
    margin: 0,
  },
  planoAvisoDescricao: {
    fontSize: "14px",
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "720px",
  },
  listaTopo: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "end",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  resumoLista: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "6px",
  },
  filtros: {
    display: "grid",
    gridTemplateColumns:
      "minmax(220px, 1fr) minmax(170px, 220px) minmax(170px, 220px) auto",
    gap: "10px",
    alignItems: "center",
    width: "100%",
    maxWidth: "820px",
  },
  campoFiltro: {
    minWidth: 0,
  },
  campoGrupo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: 0,
  },
  labelCampo: {
    color: "#374151",
    fontSize: "13px",
    fontWeight: "700",
  },
  campo: {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    minHeight: "42px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxSizing: "border-box",
    padding: "9px 11px",
    background: "white",
    color: "#111827",
    outline: "none",
  },
  campoErro: {
    border: "1px solid #dc2626",
    boxShadow: "0 0 0 1px rgba(220, 38, 38, 0.18)",
  },
  mensagemErroCampo: {
    color: "#b91c1c",
    fontSize: "12px",
    fontWeight: "700",
    lineHeight: 1.35,
    overflowWrap: "anywhere",
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "8px",
    overflow: "hidden",
  },
  linhaCabecalho: {
    background: "#111827",
    color: "white",
  },
  tabelaHeader: {
    padding: "12px",
    textAlign: "left",
    fontSize: "13px",
  },
  tabelaCelula: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  },
  estadoVazio: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#6b7280",
    textAlign: "center",
  },
  botaoPrimario: {
    background: "#111827",
    color: "white",
    border: "none",
    padding: "11px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },
  botaoSecundario: {
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
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "rgba(17, 24, 39, 0.55)",
  },
  modal: {
    width: "min(680px, 100%)",
    height: "min(760px, calc(100dvh - 48px))",
    maxHeight: "calc(100dvh - 48px)",
    overflow: "hidden",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  modalTopo: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    flex: "0 0 auto",
    padding: "24px 24px 0",
  },
  detalhesAluno: {
    marginTop: "24px",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
  },
  detalhesTopo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "18px",
  },
  detalhesTitulo: {
    margin: 0,
    fontSize: "20px",
  },
  detalhesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  resumoOperacional: {
    display: "grid",
    gap: "14px",
  },
  resumoOperacionalTopo: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "space-between",
  },
  resumoIndicadoresGrid: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  },
  resumoIndicador: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    minWidth: 0,
    padding: "12px",
  },
  resumoIndicadorTexto: {
    color: "#4b5563",
    fontSize: "13px",
    lineHeight: 1.4,
    margin: "6px 0 0",
    overflowWrap: "anywhere",
  },
  acoesContextuais: {
    display: "grid",
    gap: "12px",
  },
  acoesContextuaisGrid: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  },
  acaoContextualLink: {
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center",
    minHeight: "42px",
    textAlign: "center",
    textDecoration: "none",
    whiteSpace: "normal",
  },
  studentAccessPanel: {
    display: "grid",
    gap: "14px",
  },
  studentAccessHeader: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "space-between",
  },
  studentAccessBadge: {
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
    padding: "6px 10px",
  },
  studentAccessField: {
    display: "grid",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "700",
  },
  studentAccessInput: {
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxSizing: "border-box",
    minHeight: "44px",
    padding: "10px 12px",
    width: "100%",
  },
  studentAccessReason: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    color: "#4b5563",
    margin: 0,
    padding: "10px 12px",
  },
  studentAccessActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  infoItem: {
    border: "1px solid #eef2f7",
    borderRadius: "8px",
    padding: "12px",
    background: "#f9fafb",
  },
  infoLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "4px",
    textTransform: "uppercase",
  },
  infoValor: {
    color: "#111827",
    fontSize: "14px",
  },
};

export default AlunosList;
