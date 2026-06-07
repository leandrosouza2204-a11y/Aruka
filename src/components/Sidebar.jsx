import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
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
      style={{
        ...styles.sidebar,
        width: collapsed ? "80px" : "260px",
      }}
    >
      <div style={styles.header}>
        <button onClick={() => setCollapsed(!collapsed)} style={styles.toggle}>
          <Menu size={18} />
        </button>

        {!collapsed && (
          <div style={styles.brand}>
            <h2 style={styles.title}>Consultoria</h2>
            <span style={styles.subtitle}>online</span>
          </div>
        )}
      </div>

      <nav style={styles.nav}>
        <Link
          to="/"
          style={{
            ...styles.link,
            ...(isActive("/") ? styles.active : {}),
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <LayoutDashboard size={18} />
          {!collapsed && "Dashboard"}
        </Link>

        <Link
          to="/alunos"
          style={{
            ...styles.link,
            ...(isActive("/alunos") ? styles.active : {}),
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <Users size={18} />
          {!collapsed && "Alunos"}
        </Link>

        <Link
          to="/financeiro"
          style={{
            ...styles.link,
            ...(isActive("/financeiro") ? styles.active : {}),
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <DollarSign size={18} />
          {!collapsed && "Financeiro"}
        </Link>

        <Link
          to="/avaliacoes"
          style={{
            ...styles.link,
            ...(isActive("/avaliacoes") ? styles.active : {}),
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <ClipboardCheck size={18} />
          {!collapsed && "Avaliações"}
        </Link>

        <Link
          to="/treinos"
          style={{
            ...styles.link,
            ...(isActive("/treinos") ? styles.active : {}),
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <Dumbbell size={18} />
          {!collapsed && "Treinos"}
        </Link>
      </nav>

      {!collapsed && (
        <div style={styles.footer}>
          <strong style={styles.footerName}>Leandro Souza</strong>
          <span style={styles.footerRole}>Personal Online</span>
          <button onClick={toggleTheme} style={styles.themeButton}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Modo claro" : "Modo escuro"}
          </button>
          <button onClick={sair} style={styles.logout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}
    </div>
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
