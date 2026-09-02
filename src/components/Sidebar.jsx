import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Tags,
  ShieldCheck,
  Dumbbell,
  ClipboardCheck,
  LogOut,
  KeyRound,
  Menu,
  Moon,
  FileText,
  ListChecks,
  Sun,
  Smartphone,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { usePwaInstall } from "../features/pwa/PwaInstallContext";
import { markSessionLoggedOut } from "../hooks/useAutoLogout";
import { supabase } from "../services/supabase";
import { buscarPerfilUsuario } from "../services/perfisService";
import { useTheme } from "../theme/useTheme";

// Sidebar visual aprovada no rebranding Aruka. Evitar alterações visuais sem nova validação.
function Sidebar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { requestInstall, showInstallOption } = usePwaInstall();

  const isActive = (path) => location.pathname === path;
  const nomeUsuario =
    usuario?.user_metadata?.nome || usuario?.user_metadata?.name || "";
  const emailUsuario = usuario?.email || "";
  const usuarioAdmin = perfil?.role === "admin" || perfil?.tipoAcesso === "admin";

  useEffect(() => {
    let ativo = true;

    async function buscarUsuario() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const perfilAtual = user ? await buscarPerfilUsuario() : null;

        if (ativo) {
          setUsuario(user);
          setPerfil(perfilAtual);
        }
      } catch {
        if (ativo) setPerfil(null);
      }
    }

    buscarUsuario();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMenuAberto(false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname]);

  useEffect(() => {
    function fecharAoClicarFora(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuAberto(false);
      }
    }

    if (menuAberto) {
      document.addEventListener("mousedown", fecharAoClicarFora);
    }

    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
    };
  }, [menuAberto]);

  async function sair() {
    markSessionLoggedOut();
    await supabase.auth.signOut();
    setMenuAberto(false);
    navigate("/login", { replace: true });
  }

  function irParaAlterarSenha() {
    setMenuAberto(false);
    navigate("/alterar-senha");
  }

  function alternarTema() {
    toggleTheme();
    setMenuAberto(false);
  }

  async function instalarAplicativo() {
    setMenuAberto(false);
    await requestInstall();
  }

  return (
    <div className="app-sidebar" style={styles.sidebar}>
      <div className="app-sidebar-header" style={styles.header}>
        <div ref={menuRef} style={styles.menuArea}>
          <button
            type="button"
            className="app-sidebar-toggle"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            style={styles.toggle}
            aria-label="Abrir menu da conta"
            aria-expanded={menuAberto}
          >
            <Menu size={18} />
          </button>

          {menuAberto && (
            <div
              className="app-sidebar-account-menu"
              style={styles.accountMenu}
              role="menu"
            >
              <div style={styles.userBox}>
                <span style={styles.userLabel}>Usuário logado</span>
                {nomeUsuario && <strong style={styles.userName}>{nomeUsuario}</strong>}
                <span style={styles.userEmail}>{emailUsuario || "E-mail indisponível"}</span>
              </div>

              <button
                type="button"
                className="app-sidebar-menu-item"
                onClick={alternarTema}
                style={styles.menuItem}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? "Modo claro" : "Modo escuro"}
              </button>

              {showInstallOption && (
                <button
                  type="button"
                  className="app-sidebar-menu-item"
                  onClick={instalarAplicativo}
                  style={styles.menuItem}
                >
                  <Smartphone size={16} />
                  Instalar aplicativo
                </button>
              )}

              <button
                type="button"
                className="app-sidebar-menu-item"
                onClick={irParaAlterarSenha}
                style={styles.menuItem}
              >
                <KeyRound size={16} />
                Alterar senha
              </button>

              <Link
                to="/politica-privacidade"
                className="app-sidebar-menu-item app-sidebar-legal-mobile"
                style={styles.menuLink}
              >
                <FileText size={16} />
                Política de Privacidade
              </Link>

              <Link
                to="/termos-de-uso"
                className="app-sidebar-menu-item app-sidebar-legal-mobile"
                style={styles.menuLink}
              >
                <FileText size={16} />
                Termos de Uso
              </Link>

              <button
                type="button"
                className="app-sidebar-menu-item"
                onClick={sair}
                style={styles.menuItem}
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>

        <div className="app-sidebar-brand" style={styles.brand}>
          <div style={styles.brandCopy}>
            <BrandLogo variant="full" size="sidebar" tone="white" />
          </div>
        </div>
      </div>

      <nav className="app-sidebar-nav app-sidebar-primary-nav" style={styles.nav}>
        <MenuLink
          to="/dashboard"
          active={isActive("/dashboard")}
          icon={<LayoutDashboard size={21} />}
          label="Dashboard"
        />
        <MenuLink
          to="/alunos"
          active={isActive("/alunos")}
          icon={<Users size={21} />}
          label="Alunos"
        />
        <MenuLink
          to="/financeiro"
          active={isActive("/financeiro")}
          icon={<DollarSign size={21} />}
          label="Financeiro"
        />
        <MenuLink
          to="/planos"
          active={isActive("/planos")}
          icon={<Tags size={21} />}
          label="Planos"
        />
        <MenuLink
          to="/avaliacoes"
          active={isActive("/avaliacoes")}
          icon={<ClipboardCheck size={21} />}
          label="Avaliações"
        />
        <MenuLink
          to="/treinos"
          active={isActive("/treinos")}
          icon={<Dumbbell size={21} />}
          label="Treinos"
        />
        {usuarioAdmin && (
          <>
            <div className="nav-section-label" style={styles.navSection}>
              Administração
            </div>
            <MenuLink
              to="/admin/usuarios"
              active={isActive("/admin/usuarios")}
              icon={<ShieldCheck size={21} />}
              label="Usuários"
            />
            <MenuLink
              to="/admin/logs"
              active={isActive("/admin/logs")}
              icon={<ListChecks size={21} />}
              label="Logs"
            />
          </>
        )}
      </nav>

      <div className="app-sidebar-footer" style={styles.footer}>
        <div style={styles.footerLinks}>
          <Link to="/politica-privacidade" style={styles.footerLink}>
            Privacidade
          </Link>
          <span style={styles.footerSeparator}>•</span>
          <Link to="/termos-de-uso" style={styles.footerLink}>
            Termos
          </Link>
        </div>
        <span style={styles.footerVersion}>Versão 1.7</span>
      </div>
    </div>
  );
}

function MenuLink({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={`app-sidebar-link${active ? " app-sidebar-link-active" : ""}`}
      style={{
        ...styles.link,
        ...(active ? styles.active : {}),
      }}
    >
      {icon}
      <span className="app-sidebar-label">{label}</span>
    </Link>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "260px",
    background: "linear-gradient(180deg, #08111f 0%, #0f172a 52%, #111827 100%)",
    color: "white",
    padding: "16px 16px 22px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    transition: "all 0.25s ease",
    overflow: "visible",
  },

  header: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "block",
    marginBottom: "8px",
    minHeight: "40px",
    padding: "0 0 8px",
    position: "relative",
  },

  menuArea: {
    left: 0,
    position: "absolute",
    top: 0,
    zIndex: 2,
  },

  toggle: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    padding: "7px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "38px",
    transition: "all 0.2s ease",
    width: "38px",
  },

  accountMenu: {
    position: "absolute",
    top: "46px",
    left: 0,
    zIndex: 100,
    width: "238px",
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    boxShadow: "0 18px 42px rgba(0,0,0,0.32)",
    display: "grid",
    gap: "8px",
    padding: "10px",
  },

  userBox: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "grid",
    gap: "4px",
    padding: "4px 4px 10px",
  },

  userLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  userName: {
    color: "white",
    fontSize: "14px",
  },

  userEmail: {
    color: "rgba(255,255,255,0.72)",
    fontSize: "12px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  menuItem: {
    alignItems: "center",
    background: "rgba(255,255,255,0.07)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    display: "flex",
    gap: "9px",
    justifyContent: "flex-start",
    minHeight: "40px",
    padding: "10px 12px",
    textAlign: "left",
    width: "100%",
  },

  menuLink: {
    alignItems: "center",
    background: "rgba(255,255,255,0.07)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    display: "flex",
    gap: "9px",
    justifyContent: "flex-start",
    minHeight: "40px",
    padding: "10px 12px",
    textAlign: "left",
    textDecoration: "none",
    width: "100%",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1.15",
    minWidth: 0,
    padding: "0 0 0 42px",
  },

  brandCopy: {
    display: "grid",
    justifyItems: "center",
    minWidth: 0,
  },

  title: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "900",
    letterSpacing: "0",
  },

  subtitle: {
    color: "rgba(255,255,255,0.58)",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    paddingTop: "2px",
  },

  navSection: {
    color: "rgba(255,255,255,0.42)",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.06em",
    margin: "10px 4px 2px",
    textTransform: "uppercase",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minHeight: "42px",
    padding: "10px 12px",
    border: "1px solid transparent",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  active: {
    background: "rgba(37,99,235,0.16)",
    borderColor: "rgba(147,197,253,0.18)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 26px rgba(37,99,235,0.12)",
    color: "#ffffff",
    fontWeight: "800",
    transform: "translateX(2px)",
  },

  footer: {
    marginTop: "auto",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "grid",
    alignItems: "center",
    gap: "8px",
    textAlign: "center",
  },

  footerLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
  },

  footerLink: {
    color: "rgba(255,255,255,0.46)",
    fontSize: "11px",
    fontWeight: "700",
    textDecoration: "none",
  },

  footerSeparator: {
    color: "rgba(255,255,255,0.22)",
    fontSize: "11px",
    lineHeight: 1,
  },

  footerVersion: {
    color: "rgba(255,255,255,0.26)",
    fontSize: "10px",
    fontWeight: "700",
  },
};

export default Sidebar;

