import { Link } from "react-router-dom";

function FooterLegal({ compact = false, dark = false }) {
  return (
    <footer
      className="legal-footer"
      style={{
        ...footer,
        ...(compact ? footerCompacto : {}),
        ...(dark ? footerEscuro : {}),
      }}
    >
      <span>Aruka</span>
      <span style={separador}>•</span>
      <Link style={{ ...link, ...(dark ? linkEscuro : {}) }} to="/politica-privacidade">
        Política de Privacidade
      </Link>
      <Link style={{ ...link, ...(dark ? linkEscuro : {}) }} to="/termos-de-uso">
        Termos de Uso
      </Link>
    </footer>
  );
}

const footer = {
  alignItems: "center",
  color: "#64748b",
  display: "flex",
  flexWrap: "wrap",
  fontSize: "12px",
  gap: "8px",
  justifyContent: "center",
  marginTop: "18px",
  textAlign: "center",
};

const footerCompacto = {
  marginTop: "8px",
};

const footerEscuro = {
  color: "rgba(255,255,255,0.58)",
};

const separador = {
  opacity: 0.5,
};

const link = {
  color: "#2563eb",
  fontWeight: "700",
  textDecoration: "none",
};

const linkEscuro = {
  color: "#93c5fd",
};

export default FooterLegal;
