import { lazy, Suspense } from "react";
import LoadingFallback from "../../../components/LoadingFallback";

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
        <Suspense fallback={<LoadingFallback texto="Carregando pagamento..." variant="modal" />}>
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
        <Suspense fallback={<LoadingFallback texto="Carregando renovação..." variant="modal" />}>
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
        <Suspense fallback={<LoadingFallback texto="Carregando encerramento..." variant="modal" />}>
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
        <Suspense fallback={<LoadingFallback texto="Carregando histórico..." variant="modal" />}>
          <HistoricoFinanceiroModal
            onClose={page.fecharHistorico}
            onRelatorio={() => page.abrirRelatorioAluno(page.modalHistorico)}
            registro={page.modalHistorico}
            styles={styles}
          />
        </Suspense>
      )}

      {page.modalRelatorioAluno && (
        <Suspense fallback={<LoadingFallback texto="Carregando relatório..." variant="modal" />}>
          <RelatorioAlunoModal
            onClose={page.fecharRelatorioAluno}
            registro={page.modalRelatorioAluno}
            styles={styles}
          />
        </Suspense>
      )}

      {page.modalRelatorioGeral && (
        <Suspense fallback={<LoadingFallback texto="Carregando relatório..." variant="modal" />}>
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
