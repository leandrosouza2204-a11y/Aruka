import { lazy, Suspense } from "react";

const HistoricoFinanceiroModal = lazy(() => import("./modals/HistoricoFinanceiroModal"));
const EncerrarAcompanhamentoModal = lazy(() => import("./modals/EncerrarAcompanhamentoModal"));
const PagamentoModal = lazy(() => import("./modals/PagamentoModal"));
const RelatorioAlunoModal = lazy(() => import("./modals/RelatorioAlunoModal"));
const RelatorioGeralModal = lazy(() => import("./modals/RelatorioGeralModal"));
const RenovacaoPlanoModal = lazy(() => import("./modals/RenovacaoPlanoModal"));

function FinanceiroModals({ page, styles }) {
  return (
    <>
      {page.modalPagamento && (
        <Suspense fallback={null}>
          <PagamentoModal
            atualizando={page.atualizandoId === page.modalPagamento.aluno.id}
            erroDataPagamento={page.erroDataPagamento}
            form={page.formPagamento}
            onChange={page.setFormPagamento}
            onClose={page.fecharModalPagamento}
            onSave={page.registrarPagamento}
            registro={page.modalPagamento}
            styles={styles}
          />
        </Suspense>
      )}

      {page.modalRenovacao && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}

      {page.modalEncerramento && (
        <Suspense fallback={null}>
          <EncerrarAcompanhamentoModal
            atualizando={page.atualizandoId === page.modalEncerramento.aluno.id}
            form={page.formEncerramento}
            onChange={page.setFormEncerramento}
            onClose={page.fecharEncerramentoAcompanhamento}
            onSave={page.confirmarEncerramentoAcompanhamento}
            registro={page.modalEncerramento}
            styles={styles}
          />
        </Suspense>
      )}

      {page.modalHistorico && (
        <Suspense fallback={null}>
          <HistoricoFinanceiroModal
            onClose={page.fecharHistorico}
            onRelatorio={() => page.abrirRelatorioAluno(page.modalHistorico)}
            registro={page.modalHistorico}
            styles={styles}
          />
        </Suspense>
      )}

      {page.modalRelatorioAluno && (
        <Suspense fallback={null}>
          <RelatorioAlunoModal
            onClose={page.fecharRelatorioAluno}
            registro={page.modalRelatorioAluno}
            styles={styles}
          />
        </Suspense>
      )}

      {page.modalRelatorioGeral && (
        <Suspense fallback={null}>
          <RelatorioGeralModal
            onClose={page.fecharRelatorioGeral}
            ranking={page.rankingFinanceiro}
            styles={styles}
          />
        </Suspense>
      )}
    </>
  );
}

export default FinanceiroModals;
