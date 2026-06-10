import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../services/supabase";

const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

function AlterarSenhaForm() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const requisitos = useMemo(
    () => [
      {
        texto: "Minimo de 12 caracteres",
        ok: novaSenha.length >= 12,
      },
      {
        texto: "Pelo menos 1 letra maiuscula",
        ok: /[A-Z]/.test(novaSenha),
      },
      {
        texto: "Pelo menos 1 letra minuscula",
        ok: /[a-z]/.test(novaSenha),
      },
      {
        texto: "Pelo menos 1 numero",
        ok: /\d/.test(novaSenha),
      },
      {
        texto: "Pelo menos 1 caractere especial",
        ok: /[\W_]/.test(novaSenha),
      },
    ],
    [novaSenha]
  );

  const senhaValida = senhaForteRegex.test(novaSenha);
  const confirmacaoValida = novaSenha && novaSenha === confirmacao;
  const senhasDiferentes = Boolean(confirmacao) && novaSenha !== confirmacao;
  const mostrarAvisoSenhaFraca = Boolean(novaSenha) && !senhaValida;

  async function alterarSenha(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!senhaAtual.trim()) {
      setErro("Informe sua senha atual.");
      return;
    }

    if (!senhaValida) {
      setErro("A nova senha ainda não atende aos requisitos de segurança.");
      return;
    }

    if (!confirmacaoValida) {
      setErro("A confirmação da nova senha não confere.");
      return;
    }

    setCarregando(true);

    try {
      const {
        data: { user },
        error: erroUsuario,
      } = await supabase.auth.getUser();

      if (erroUsuario) throw erroUsuario;
      if (!user?.email) throw new Error("Não foi possível identificar seu e-mail.");

      const { error: erroLogin } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: senhaAtual,
      });

      if (erroLogin) {
        throw new Error("Senha atual incorreta. Confira e tente novamente.");
      }

      const { error: erroAtualizacao } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (erroAtualizacao) throw erroAtualizacao;

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmacao("");
      setSucesso("Senha alterada com sucesso.");
    } catch (error) {
      setErro(error.message || "Não foi possível alterar a senha.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={alterarSenha} style={form}>
      <CampoSenha
        label="Senha atual"
        value={senhaAtual}
        onChange={setSenhaAtual}
        mostrar={mostrarSenhaAtual}
        onToggle={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
      />

      <CampoSenha
        label="Nova senha"
        value={novaSenha}
        onChange={setNovaSenha}
        mostrar={mostrarNovaSenha}
        onToggle={() => setMostrarNovaSenha(!mostrarNovaSenha)}
      />

      <div style={requisitosBox}>
        {requisitos.map((item) => (
          <div key={item.texto} style={requisitoItem}>
            <span
              style={{
                ...requisitoMarcador,
                background: item.ok ? "#16a34a" : "#d1d5db",
              }}
            />
            <span style={{ color: item.ok ? "#166534" : "#6b7280" }}>
              {item.texto}
            </span>
          </div>
        ))}
      </div>

      <CampoSenha
        label="Confirmar nova senha"
        value={confirmacao}
        onChange={setConfirmacao}
        mostrar={mostrarConfirmacao}
        onToggle={() => setMostrarConfirmacao(!mostrarConfirmacao)}
        erro={senhasDiferentes}
      />

      {senhasDiferentes && (
        <div style={alertaValidacao}>A confirmação da nova senha não confere.</div>
      )}

      {mostrarAvisoSenhaFraca && (
        <div style={alertaValidacao}>
          A nova senha ainda não atende todos os requisitos de segurança.
        </div>
      )}

      {erro && <div style={erroBox}>{erro}</div>}
      {sucesso && <div style={sucessoBox}>{sucesso}</div>}

      <button type="submit" disabled={carregando} style={botaoPrimario}>
        {carregando ? "Alterando..." : "Alterar senha"}
      </button>
    </form>
  );
}

function CampoSenha({ label, value, onChange, mostrar, onToggle, erro = false }) {
  return (
    <label style={campoGrupo}>
      <span style={labelCampo}>{label}</span>
      <div style={senhaLinha}>
        <input
          type={mostrar ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...campo,
            borderColor: erro ? "#dc2626" : campo.border,
            background: erro ? "#fef2f2" : campo.background,
          }}
          autoComplete="new-password"
        />
        <button type="button" onClick={onToggle} style={botaoIcone}>
          {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

const form = {
  display: "grid",
  gap: "16px",
};

const campoGrupo = {
  display: "grid",
  gap: "6px",
};

const labelCampo = {
  color: "#374151",
  fontSize: "13px",
  fontWeight: "700",
};

const senhaLinha = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "8px",
};

const campo = {
  width: "100%",
  minHeight: "44px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "9px 11px",
  background: "white",
  color: "#111827",
  outline: "none",
};

const botaoIcone = {
  width: "44px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};

const requisitosBox = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  display: "grid",
  gap: "8px",
  padding: "12px",
};

const requisitoItem = {
  alignItems: "center",
  display: "flex",
  gap: "8px",
  fontSize: "13px",
};

const requisitoMarcador = {
  borderRadius: "999px",
  display: "inline-block",
  height: "9px",
  width: "9px",
};

const erroBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "700",
  padding: "12px",
};

const sucessoBox = {
  background: "#ecfdf5",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  color: "#166534",
  fontSize: "14px",
  fontWeight: "700",
  padding: "12px",
};

const alertaValidacao = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "8px",
  color: "#9a3412",
  fontSize: "14px",
  fontWeight: "700",
  padding: "10px 12px",
};

const botaoPrimario = {
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "800",
  minHeight: "44px",
  padding: "10px 14px",
};

export default AlterarSenhaForm;
