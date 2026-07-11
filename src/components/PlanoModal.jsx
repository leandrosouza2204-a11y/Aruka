import { useState } from "react";
import { useToast } from "../hooks/useToast";
import {
  limparNomePlano,
  MENSAGEM_PLANO_DUPLICADO,
  planoTemNomeDuplicado,
} from "../features/planos/utils/normalizarNomePlano";

const planoVazio = {
  nome: "",
  descricao: "",
  duracaoMeses: 1,
  valor: "",
  ativo: true,
  permiteParcelamento: false,
  quantidadeParcelas: 1,
  valorParcela: "",
  intervaloParcelasMeses: 1,
  valorParcelaManual: false,
};

function PlanoModal({ plano, planosExistentes = [], onClose, onSave, salvando }) {
  const [form, setForm] = useState(() => normalizarForm({ ...planoVazio, ...plano }));
  const [erros, setErros] = useState({});
  const toast = useToast();

  function atualizar(campo, valor) {
    const proximoForm = { ...form, [campo]: valor };

    if (campo === "nome" && erros.nome) {
      setErros({ ...erros, nome: "" });
    }

    if (
      form.permiteParcelamento &&
      !form.valorParcelaManual &&
      ["valor", "quantidadeParcelas"].includes(campo)
    ) {
      proximoForm.valorParcela = calcularValorParcela(
        proximoForm.valor,
        proximoForm.quantidadeParcelas
      );
    }

    setForm(proximoForm);
  }

  function alternarParcelamento(ativo) {
    const quantidadeParcelas = ativo
      ? Math.max(Number(form.quantidadeParcelas || form.duracaoMeses || 2), 2)
      : 1;

    setForm({
      ...form,
      permiteParcelamento: ativo,
      quantidadeParcelas,
      intervaloParcelasMeses: ativo ? Number(form.intervaloParcelasMeses || 1) : 1,
      valorParcela: ativo ? calcularValorParcela(form.valor, quantidadeParcelas) : "",
      valorParcelaManual: false,
    });
  }

  function atualizarValorParcela(valor) {
    setForm({ ...form, valorParcela: valor, valorParcelaManual: true });
  }

  function salvar() {
    const nomeLimpo = limparNomePlano(form.nome);

    if (!nomeLimpo) {
      setErros({ ...erros, nome: "Informe o nome do plano." });
      toast.aviso("Nome obrigatorio", "Informe o nome do plano.");
      return;
    }

    if (planoTemNomeDuplicado(planosExistentes, nomeLimpo, plano?.id)) {
      setErros({ ...erros, nome: MENSAGEM_PLANO_DUPLICADO });
      toast.aviso("Nome de plano duplicado", "Já existe um plano com esse nome.");
      return;
    }
    if (!form.nome.trim()) {
      toast.aviso("Nome obrigatório", "Informe o nome do plano.");
      return;
    }

    if (Number(form.duracaoMeses || 0) <= 0) {
      toast.aviso("Duração inválida", "Informe uma duração válida.");
      return;
    }

    if (form.permiteParcelamento && Number(form.quantidadeParcelas || 0) <= 1) {
      toast.aviso("Parcelamento inválido", "Informe pelo menos 2 parcelas.");
      return;
    }

    onSave({
      ...form,
      nome: nomeLimpo,
      descricao: form.descricao.trim(),
      duracaoMeses: Number(form.duracaoMeses || 1),
      valor: Number(form.valor || 0),
      ativo: Boolean(form.ativo),
      permiteParcelamento: Boolean(form.permiteParcelamento),
      quantidadeParcelas: form.permiteParcelamento
        ? Number(form.quantidadeParcelas || 1)
        : 1,
      valorParcela: form.permiteParcelamento
        ? Number(form.valorParcela || 0)
        : 0,
      intervaloParcelasMeses: form.permiteParcelamento
        ? Number(form.intervaloParcelasMeses || 1)
        : 1,
    });
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={modalTopo}>
          <div>
            <h2 style={titulo}>{plano?.id ? "Editar Plano" : "Novo Plano"}</h2>
            <p style={subtitulo}>Defina preço, duração, parcelamento e disponibilidade.</p>
          </div>

          <button onClick={onClose} style={botaoSecundario}>
            Fechar
          </button>
        </div>

        <div style={formGrid}>
          <Campo label="Nome do plano">
            <input
              value={form.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
              onBlur={() => atualizar("nome", limparNomePlano(form.nome))}
              placeholder="Ex: Mensal"
              style={erros.nome ? { ...campo, ...campoErro } : campo}
            />
            {erros.nome && <span style={mensagemErro}>{erros.nome}</span>}
          </Campo>

          <Campo label="Duração em meses">
            <input
              type="number"
              min="1"
              value={form.duracaoMeses}
              onChange={(e) => atualizar("duracaoMeses", e.target.value)}
              style={campo}
            />
          </Campo>

          <Campo label="Valor total do plano">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.valor}
              onChange={(e) => atualizar("valor", e.target.value)}
              style={campo}
            />
          </Campo>

          <Campo label="Status">
            <select
              value={form.ativo ? "ativo" : "inativo"}
              onChange={(e) => atualizar("ativo", e.target.value === "ativo")}
              style={campo}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </Campo>

          <label className="plan-installment-toggle" style={switchCard}>
            <input
              type="checkbox"
              checked={form.permiteParcelamento}
              onChange={(e) => alternarParcelamento(e.target.checked)}
            />
            <span className="plan-installment-content">
              <strong>Permitir parcelamento</strong>
              <small>Quando ativo, o Financeiro acompanha parcelas separadas do vencimento final do plano.</small>
            </span>
          </label>

          {form.permiteParcelamento && (
            <>
              <Campo label="Quantidade de parcelas">
                <input
                  type="number"
                  min="2"
                  value={form.quantidadeParcelas}
                  onChange={(e) => atualizar("quantidadeParcelas", e.target.value)}
                  style={campo}
                />
              </Campo>

              <Campo label="Valor por parcela">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.valorParcela}
                  onChange={(e) => atualizarValorParcela(e.target.value)}
                  style={campo}
                />
              </Campo>

              <Campo label="Intervalo entre parcelas">
                <select
                  value={form.intervaloParcelasMeses}
                  onChange={(e) => atualizar("intervaloParcelasMeses", e.target.value)}
                  style={campo}
                >
                  <option value="1">Mensal</option>
                  <option value="2">A cada 2 meses</option>
                  <option value="3">A cada 3 meses</option>
                </select>
              </Campo>
            </>
          )}

          <Campo label="Descrição">
            <textarea
              rows="3"
              value={form.descricao}
              onChange={(e) => atualizar("descricao", e.target.value)}
              placeholder="Detalhes, condições ou observações do plano"
              style={{ ...campo, minHeight: "84px", resize: "vertical" }}
            />
          </Campo>
        </div>

        <div style={rodape}>
          <button onClick={onClose} style={botaoSecundario}>
            Cancelar
          </button>
          <button onClick={salvar} style={botaoPrimario} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar Plano"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label style={campoGrupo}>
      <span style={labelCampo}>{label}</span>
      {children}
    </label>
  );
}

function normalizarForm(plano) {
  const permiteParcelamento = Boolean(plano.permiteParcelamento);
  const quantidadeParcelas = permiteParcelamento
    ? Math.max(Number(plano.quantidadeParcelas || plano.duracaoMeses || 2), 2)
    : 1;

  return {
    ...plano,
    permiteParcelamento,
    quantidadeParcelas,
    valorParcela: permiteParcelamento
      ? plano.valorParcela || calcularValorParcela(plano.valor, quantidadeParcelas)
      : "",
    intervaloParcelasMeses: Number(plano.intervaloParcelasMeses || 1),
    valorParcelaManual: Boolean(plano.valorParcela),
  };
}

function calcularValorParcela(valor, quantidadeParcelas) {
  const parcelas = Math.max(Number(quantidadeParcelas || 1), 1);
  const total = Number(valor || 0);

  return parcelas > 0 ? (total / parcelas).toFixed(2) : "";
}

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "rgba(17, 24, 39, 0.55)",
};

const modal = {
  width: "min(720px, 100%)",
  maxHeight: "calc(100vh - 48px)",
  overflowY: "auto",
  background: "white",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
};

const modalTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
};

const titulo = { margin: 0, fontSize: "22px" };
const subtitulo = { color: "#6b7280", fontSize: "14px", marginTop: "5px" };

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "22px",
};

const campoGrupo = { display: "flex", flexDirection: "column", gap: "6px" };
const labelCampo = { color: "#374151", fontSize: "13px", fontWeight: "700" };

const campo = {
  width: "100%",
  minHeight: "42px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "9px 11px",
  background: "white",
  color: "#111827",
  outline: "none",
};

const campoErro = {
  borderColor: "#dc2626",
  boxShadow: "0 0 0 1px rgba(220, 38, 38, 0.18)",
};

const mensagemErro = {
  color: "#b91c1c",
  fontSize: "12px",
  fontWeight: "700",
};

const switchCard = {
  gridColumn: "1 / -1",
};

const rodape = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "24px",
};

const botaoPrimario = {
  background: "#111827",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  padding: "9px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default PlanoModal;
