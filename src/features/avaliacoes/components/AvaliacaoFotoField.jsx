import { useRef, useState } from "react";

const ACCEPT = "image/jpeg,image/png,image/webp";
const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const TAMANHO_MAXIMO = 8 * 1024 * 1024;
const MENSAGEM_ERRO = "Selecione uma imagem JPG, PNG ou WEBP de ate 8 MB.";

function AvaliacaoFotoField({
  label,
  value,
  previewUrl,
  onFileChange,
  onRemove,
  disabled = false,
  accept = ACCEPT,
  id,
}) {
  const inputRef = useRef(null);
  const [erro, setErro] = useState("");
  const temPreview = Boolean(previewUrl);
  const nomeArquivo = value?.name || "";

  function abrirSeletor() {
    if (!disabled) inputRef.current?.click();
  }

  function handleChange(event) {
    const arquivo = event.target.files?.[0];
    event.target.value = "";

    if (!arquivo) return;

    if (!TIPOS_PERMITIDOS.has(arquivo.type) || arquivo.size > TAMANHO_MAXIMO) {
      setErro(MENSAGEM_ERRO);
      return;
    }

    setErro("");
    onFileChange?.(arquivo);
  }

  function removerFoto() {
    setErro("");
    onRemove?.();
  }

  return (
    <div style={container}>
      <span style={labelStyle}>{label}</span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleChange}
        style={inputOculto}
      />

      {temPreview ? (
        <div style={previewBox}>
          <img src={previewUrl} alt={`Preview de ${label}`} style={imagem} />
          <div style={acoes}>
            <button type="button" onClick={abrirSeletor} disabled={disabled} style={botaoSecundario}>
              Trocar imagem
            </button>
            <button type="button" onClick={removerFoto} disabled={disabled} style={botaoRemover}>
              Remover imagem
            </button>
          </div>
          {nomeArquivo ? <span style={arquivoNome}>{nomeArquivo}</span> : null}
        </div>
      ) : (
        <button type="button" onClick={abrirSeletor} disabled={disabled} style={seletor}>
          <span style={textoPrincipal}>Selecionar imagem</span>
          <span style={textoSecundario}>JPG, PNG ou WEBP</span>
        </button>
      )}

      {erro ? <span style={erroStyle}>{erro}</span> : null}
    </div>
  );
}

const container = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  minWidth: 0,
};

const labelStyle = { color: "#374151", fontSize: "13px", fontWeight: "700" };

const inputOculto = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const seletor = {
  minHeight: "148px",
  border: "1px dashed #cbd5e1",
  borderRadius: "8px",
  padding: "18px",
  background: "#f8fafc",
  color: "#111827",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  textAlign: "center",
};

const textoPrincipal = { fontSize: "14px", fontWeight: "800" };
const textoSecundario = { color: "#64748b", fontSize: "12px" };

const previewBox = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "8px",
  background: "#f8fafc",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const imagem = {
  width: "100%",
  aspectRatio: "4 / 3",
  objectFit: "cover",
  borderRadius: "6px",
  background: "#e5e7eb",
};

const acoes = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "8px",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  padding: "9px 10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

const botaoRemover = {
  ...botaoSecundario,
  background: "#fee2e2",
  color: "#991b1b",
};

const arquivoNome = {
  color: "#64748b",
  fontSize: "12px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const erroStyle = { color: "#b91c1c", fontSize: "12px", lineHeight: 1.35 };

export default AvaliacaoFotoField;
