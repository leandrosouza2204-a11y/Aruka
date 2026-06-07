import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Tags,
  Dumbbell,
  ClipboardCheck,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { useTheme } from "../theme/useTheme";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  async function sair() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div
      className="app-sidebar"
      style={{
        ...styles.sidebar,
        width: collapsed ? "80px" : "260px",
      }}
    >
      <div className="app-sidebar-header" style={styles.header}>
        <button
          className="app-sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          style={styles.toggle}
        >
          <Menu size={18} />
        </button>

        {!collapsed && (
          <div className="app-sidebar-brand" style={styles.brand}>
            <h2 style={styles.title}>Consultoria</h2>
            <span style={styles.subtitle}>online</span>
          </div>
        )}
      </div>

      <nav className="app-sidebar-nav" style={styles.nav}>
        <MenuLink
          to="/"
          active={isActive("/")}
          collapsed={collapsed}
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
        <MenuLink
          to="/alunos"
          active={isActive("/alunos")}
          collapsed={collapsed}
          icon={<Users size={18} />}
          label="Alunos"
        />
        <MenuLink
          to="/financeiro"
          active={isActive("/financeiro")}
          collapsed={collapsed}
          icon={<DollarSign size={18} />}
          label="Financeiro"
        />
        <MenuLink
          to="/planos"
          active={isActive("/planos")}
          collapsed={collapsed}
          icon={<Tags size={18} />}
          label="Planos"
        />
        <MenuLink
          to="/avaliacoes"
          active={isActive("/avaliacoes")}
          collapsed={collapsed}
          icon={<ClipboardCheck size={18} />}
          label="Avaliacoes"
        />
        <MenuLink
          to="/treinos"
          active={isActive("/treinos")}
          collapsed={collapsed}
          icon={<Dumbbell size={18} />}
          label="Treinos"
        />
      </nav>

      {!collapsed && (
        <div className="app-sidebar-footer" style={styles.footer}>
          <strong className="app-sidebar-footer-name" style={styles.footerName}>
            Leandro Souza
          </strong>
          <span className="app-sidebar-footer-role" style={styles.footerRole}>
            Personal Online
          </span>
          <button
            className="app-sidebar-action"
            onClick={toggleTheme}
            style={styles.themeButton}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="app-sidebar-action-label">
              {isDark ? "Modo claro" : "Modo escuro"}
            </span>
          </button>
          <button className="app-sidebar-action" onClick={sair} style={styles.logout}>
            <LogOut size={16} />
            <span className="app-sidebar-action-label">Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ to, active, collapsed, icon, label }) {
  return (
    <Link
      to={to}
      style={{
        ...styles.link,
        ...(active ? styles.active : {}),
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      {icon}
      {!collapsed && <span className="app-sidebar-label">{label}</span>}
    </Link>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    background: "linear-gradient(180deg, #0b1220, #111827)",
    color: "white",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    transition: "all 0.25s ease",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "30px",
  },

  toggle: {
    background: "rgba(255,255,255,0.06)",
    border: "none",
    color: "white",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  brand: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    lineHeight: "1.2",
  },

  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
  },

  subtitle: {
    fontSize: "11px",
    opacity: 0.5,
    letterSpacing: "2px",
    textAlign: "center",
    textTransform: "uppercase",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "10px",
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },

  active: {
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    fontWeight: "600",
    transform: "translateX(2px)",
  },

  footer: {
    marginTop: "auto",
    paddingTop: "18px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  footerName: {
    fontSize: "13px",
    fontWeight: "700",
  },

  footerRole: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "12px",
  },

  logout: {
    marginTop: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    fontSize: "13px",
  },

  themeButton: {
    marginTop: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    fontSize: "13px",
  },
};

export default Sidebar;
