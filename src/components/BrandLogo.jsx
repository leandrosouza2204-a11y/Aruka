const tamanhos = {
  sm: {
    full: "190px",
    icon: "42px",
  },
  md: {
    full: "280px",
    icon: "58px",
  },
  lg: {
    full: "360px",
    icon: "78px",
  },
};

function BrandLogo({ variant = "full", showSlogan = false, size = "md" }) {
  const imagem =
    variant === "icon"
      ? "/brand/aruka-symbol-gradient.png"
      : "/brand/aruka-logo-primary.png";
  const largura = tamanhos[size]?.[variant] || tamanhos.md[variant];

  return (
    <div style={container}>
      <img
        src={imagem}
        alt="Aruka"
        style={{
          ...logo,
          width: largura,
          maxWidth: "100%",
        }}
      />
      {variant === "icon" && showSlogan && (
        <span style={slogan}>Organize. Guie. Transforme.</span>
      )}
    </div>
  );
}

const container = {
  display: "grid",
  gap: "6px",
  justifyItems: "center",
  lineHeight: 1.2,
};

const logo = {
  display: "block",
  height: "auto",
  objectFit: "contain",
};

const slogan = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  textAlign: "center",
  textTransform: "uppercase",
};

export default BrandLogo;
