import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCommercialAccountState,
  buildCommercialSummary,
  usuarioMatchesCommercialFilter,
  validateCommercialSubscriptionInput,
} from "./commercialAccountState.js";

const today = "2026-08-20";

describe("commercialAccountState", () => {
  it("keeps role, profile access and subscription status separated for pending users", () => {
    const state = buildCommercialAccountState(
      { role: "user", tipoAcesso: "pendente", status: "ativo" },
      { today }
    );

    assert.equal(state.role, "user");
    assert.equal(state.profileAccess, "pendente");
    assert.equal(state.subscriptionStatus, "sem_assinatura");
    assert.equal(state.commercialStatus, "aguardando");
    assert.equal(state.attentionRequired, true);
    assert.ok(state.availableActions.includes("liberar_beta"));
    assert.ok(state.availableActions.includes("liberar_assinante"));
  });

  it("derives beta and test states without treating them as paid subscribers", () => {
    const beta = buildCommercialAccountState(
      { tipoAcesso: "beta", assinaturaStatus: "" },
      { today }
    );
    const test = buildCommercialAccountState(
      { tipoAcesso: "assinante", assinaturaStatus: "teste" },
      { today }
    );

    assert.equal(beta.commercialStatus, "beta_teste");
    assert.equal(beta.hasActiveSubscription, false);
    assert.equal(test.commercialStatus, "beta_teste");
    assert.equal(test.subscriptionStatus, "teste");
  });

  it("derives active subscriber state from profile access plus active subscription", () => {
    const state = buildCommercialAccountState(
      {
        tipoAcesso: "assinante",
        assinaturaStatus: "ativo",
        assinaturaPlano: "Mensal",
        dataVencimento: "2026-09-20",
      },
      { today }
    );

    assert.equal(state.commercialStatus, "ativo");
    assert.equal(state.accessLabel, "Acesso assinante");
    assert.equal(state.subscriptionLabel, "Ativa - Mensal");
    assert.equal(state.attentionRequired, false);
    assert.ok(state.availableActions.includes("cancelar_assinatura"));
  });

  it("marks active subscriptions with past renewal date as expired", () => {
    const state = buildCommercialAccountState(
      {
        tipoAcesso: "assinante",
        assinaturaStatus: "ativo",
        dataVencimento: "2026-08-01",
      },
      { today }
    );

    assert.equal(state.commercialStatus, "vencido");
    assert.equal(state.attentionLabel, "Assinatura ativa com vencimento passado");
    assert.ok(state.availableActions.includes("reativar_assinatura"));
  });

  it("marks cancelled subscriptions without implying data deletion", () => {
    const state = buildCommercialAccountState(
      {
        tipoAcesso: "assinante",
        assinaturaStatus: "cancelado",
        assinaturaPlano: "Semestral",
      },
      { today }
    );

    assert.equal(state.commercialStatus, "cancelado");
    assert.equal(state.attentionLabel, "Assinatura cancelada; dados preservados");
    assert.ok(state.availableActions.includes("reativar_assinatura"));
  });

  it("keeps professionals in grace without mutating student access semantics", () => {
    const state = buildCommercialAccountState(
      {
        tipoAcesso: "assinante",
        assinaturaStatus: "vencido",
        dataVencimento: "2026-08-19",
        graceUntil: "2026-08-27",
        studentAccessStatus: "active",
      },
      { today }
    );

    assert.equal(state.commercialStatus, "grace");
    assert.equal(state.hasGraceAccess, true);
    assert.equal(state.attentionLabel, "Periodo de tolerancia ativo");
    assert.ok(state.availableActions.includes("suspender_assinatura"));
    assert.equal(state.studentAccessStatus, undefined);
  });

  it("separates suspended subscriptions from administrative profile blocks", () => {
    const suspended = buildCommercialAccountState(
      {
        tipoAcesso: "assinante",
        status: "ativo",
        assinaturaStatus: "vencido",
        suspendedAt: "2026-08-20",
      },
      { today }
    );
    const adminBlocked = buildCommercialAccountState(
      {
        tipoAcesso: "bloqueado",
        status: "inativo",
        assinaturaStatus: "ativo",
        dataVencimento: "2026-09-20",
        reactivatedAt: "2026-08-20",
      },
      { today }
    );

    assert.equal(suspended.commercialStatus, "suspenso");
    assert.equal(suspended.isSuspended, true);
    assert.equal(adminBlocked.commercialStatus, "bloqueado");
    assert.equal(adminBlocked.hasActiveSubscription, true);
    assert.ok(adminBlocked.availableActions.includes("reativar"));
  });

  it("derives cancel-at-period-end while keeping access until renewal date", () => {
    const state = buildCommercialAccountState(
      {
        tipoAcesso: "assinante",
        assinaturaStatus: "ativo",
        dataVencimento: "2026-09-20",
        cancelAtPeriodEnd: true,
      },
      { today }
    );

    assert.equal(state.commercialStatus, "cancelamento_agendado");
    assert.equal(state.hasActiveSubscription, true);
    assert.equal(state.attentionLabel, "Cancelamento ao fim do periodo");
  });

  it("marks blocked profile independently from subscription cancellation", () => {
    const state = buildCommercialAccountState(
      {
        tipoAcesso: "bloqueado",
        status: "inativo",
        assinaturaStatus: "ativo",
        dataVencimento: "2026-09-20",
      },
      { today }
    );

    assert.equal(state.commercialStatus, "bloqueado");
    assert.equal(state.subscriptionStatus, "ativo");
    assert.ok(state.availableActions.includes("reativar"));
    assert.ok(!state.availableActions.includes("bloquear"));
  });

  it("flags partial subscription data for review", () => {
    const state = buildCommercialAccountState(
      { tipoAcesso: "assinante", assinaturaStatus: "" },
      { today }
    );

    assert.equal(state.commercialStatus, "atencao");
    assert.equal(state.attentionLabel, "Perfil assinante sem assinatura ativa");
  });

  it("builds operational counters and filters from reliable data", () => {
    const usuarios = [
      { tipoAcesso: "pendente" },
      { tipoAcesso: "beta" },
      { tipoAcesso: "assinante", assinaturaStatus: "ativo", dataVencimento: "2026-08-24" },
      { tipoAcesso: "assinante", assinaturaStatus: "vencido", graceUntil: "2026-08-24" },
      { tipoAcesso: "assinante", assinaturaStatus: "vencido", suspendedAt: "2026-08-20" },
      { tipoAcesso: "assinante", assinaturaStatus: "ativo", dataVencimento: "2026-09-20", cancelAtPeriodEnd: true },
      { tipoAcesso: "assinante", assinaturaStatus: "vencido" },
      { tipoAcesso: "assinante", assinaturaStatus: "cancelado" },
      { tipoAcesso: "bloqueado", status: "inativo" },
    ];

    const summary = buildCommercialSummary(usuarios, { today });
    assert.equal(summary.aguardando, 1);
    assert.equal(summary.betaTeste, 1);
    assert.equal(summary.proximosVencimento, 1);
    assert.equal(summary.grace, 1);
    assert.equal(summary.suspensos, 1);
    assert.equal(summary.cancelamentoAgendado, 1);
    assert.equal(summary.vencidos, 1);
    assert.equal(summary.cancelados, 1);
    assert.equal(summary.bloqueados, 1);
    assert.equal(usuarioMatchesCommercialFilter(usuarios[2], "proximos_vencimento", { today }), true);
    assert.equal(usuarioMatchesCommercialFilter(usuarios[3], "grace", { today }), true);
  });

  it("validates subscription edits without card or payment data", () => {
    assert.equal(
      validateCommercialSubscriptionInput({
        plano: "Mensal",
        status: "ativo",
        dataInicio: "2026-08-20",
        dataVencimento: "2026-09-20",
      }).valid,
      true
    );

    const invalid = validateCommercialSubscriptionInput({
      plano: "",
      status: "ativo",
      dataInicio: "2026-09-20",
      dataVencimento: "2026-08-20",
    });
    assert.equal(invalid.valid, false);
    assert.ok(invalid.errors.includes("Informe o plano comercial."));
    assert.ok(invalid.errors.includes("A data de vencimento precisa ser igual ou posterior ao inicio."));
  });
});
