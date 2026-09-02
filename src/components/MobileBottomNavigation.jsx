import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  DollarSign,
  Dumbbell,
  FileText,
  Home,
  KeyRound,
  ListChecks,
  LogOut,
  MoreHorizontal,
  Smartphone,
  ShieldCheck,
  Tags,
  Users,
  X,
} from "lucide-react";
import { usePwaInstall } from "../features/pwa/PwaInstallContext";
import { markSessionLoggedOut } from "../hooks/useAutoLogout";
import { buscarPerfilUsuario } from "../services/perfisService";
import { supabase } from "../services/supabase";

function MobileBottomNavigation() {
  const [maisAberto, setMaisAberto] = useState(false);
  const [usuarioAdmin, setUsuarioAdmin] = useState(false);
  const { requestInstall, showInstallOption } = usePwaInstall();
  const painelRef = useRef(null);
  const maisButtonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const activeSection = getActiveSection(location.pathname);

  useEffect(() => {
    document.body.classList.add("mobile-bottom-nav-mounted");

    return () => {
      document.body.classList.remove("mobile-bottom-nav-mounted");
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function verificarPermissao() {
      try {
        const perfil = await buscarPerfilUsuario();

        if (ativo) {
          setUsuarioAdmin(perfil?.role === "admin" || perfil?.tipoAcesso === "admin");
        }
      } catch {
        if (ativo) setUsuarioAdmin(false);
      }
    }

    verificarPermissao();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!maisAberto) return undefined;

    const overflowAnterior = document.body.style.overflow;
    const maisButton = maisButtonRef.current;
    document.body.style.overflow = "hidden";

    function fecharComEscape(event) {
      if (event.key === "Escape") {
        setMaisAberto(false);
        restaurarFocoMais(maisButtonRef.current);
      }
    }

    document.addEventListener("keydown", fecharComEscape);
    window.setTimeout(() => {
      painelRef.current?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", fecharComEscape);
      restaurarFocoMais(maisButton);
    };
  }, [maisAberto]);

  async function sair() {
    markSessionLoggedOut();
    await supabase.auth.signOut();
    setMaisAberto(false);
    navigate("/login", { replace: true });
  }

  function fecharMais() {
    setMaisAberto(false);
  }

  async function instalarAplicativo() {
    setMaisAberto(false);
    await requestInstall();
  }

  return (
    <>
      {maisAberto && (
        <div
          className="mobile-more-overlay"
          onMouseDown={fecharMais}
          role="presentation"
        >
          <section
            aria-label="Mais opcoes"
            aria-modal="true"
            className="mobile-more-panel"
            onMouseDown={(event) => event.stopPropagation()}
            ref={painelRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="mobile-more-header">
              <div>
                <span>Mais</span>
                <strong>Acessos adicionais</strong>
              </div>
              <button
                aria-label="Fechar menu Mais"
                className="mobile-more-close"
                onClick={fecharMais}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-more-list">
              <MoreLink
                to="/avaliacoes"
                icon={<ClipboardCheck size={18} />}
                label="Avaliações"
                onNavigate={fecharMais}
              />
              <MoreLink to="/planos" icon={<Tags size={18} />} label="Planos" onNavigate={fecharMais} />
              {usuarioAdmin && (
                <>
                  <MoreLink
                    to="/admin/usuarios"
                    icon={<ShieldCheck size={18} />}
                    label="Administração"
                    onNavigate={fecharMais}
                  />
                  <MoreLink
                    to="/admin/logs"
                    icon={<ListChecks size={18} />}
                    label="Logs"
                    onNavigate={fecharMais}
                  />
                </>
              )}
              <MoreLink
                to="/alterar-senha"
                icon={<KeyRound size={18} />}
                label="Alterar senha"
                onNavigate={fecharMais}
              />
              {showInstallOption && (
                <button className="mobile-more-item" onClick={instalarAplicativo} type="button">
                  <Smartphone size={18} />
                  <span>Instalar aplicativo</span>
                </button>
              )}
              <MoreLink
                to="/termos-de-uso"
                icon={<FileText size={18} />}
                label="Termos de Uso"
                onNavigate={fecharMais}
              />
              <MoreLink
                to="/politica-privacidade"
                icon={<FileText size={18} />}
                label="Política de Privacidade"
                onNavigate={fecharMais}
              />
              <button className="mobile-more-item mobile-more-danger" onClick={sair} type="button">
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </section>
        </div>
      )}

      <nav aria-label="Navegação principal" className="mobile-bottom-nav">
        <BottomLink
          active={activeSection === "inicio"}
          icon={<Home size={20} />}
          label="Início"
          to="/dashboard"
        />
        <BottomLink
          active={activeSection === "alunos"}
          icon={<Users size={20} />}
          label="Alunos"
          to="/alunos"
        />
        <BottomLink
          active={activeSection === "treinos"}
          icon={<Dumbbell size={20} />}
          label="Treinos"
          to="/treinos"
        />
        <BottomLink
          active={activeSection === "financeiro"}
          icon={<DollarSign size={20} />}
          label="Financeiro"
          to="/financeiro"
        />
        <button
          aria-current={activeSection === "mais" ? "page" : undefined}
          aria-expanded={maisAberto}
          className={`mobile-bottom-nav-item${activeSection === "mais" ? " is-active" : ""}`}
          onClick={() => setMaisAberto((aberto) => !aberto)}
          ref={maisButtonRef}
          type="button"
        >
          <MoreHorizontal size={20} />
          <span>Mais</span>
        </button>
      </nav>
    </>
  );
}

function BottomLink({ active, icon, label, to }) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`mobile-bottom-nav-item${active ? " is-active" : ""}`}
      to={to}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MoreLink({ icon, label, onNavigate, to }) {
  return (
    <Link className="mobile-more-item" onClick={onNavigate} to={to}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function getActiveSection(pathname) {
  if (pathname === "/dashboard" || pathname === "/") return "inicio";
  if (pathname.startsWith("/alunos")) return "alunos";
  if (pathname.startsWith("/treinos")) return "treinos";
  if (pathname.startsWith("/financeiro")) return "financeiro";
  return "mais";
}

function restaurarFocoMais(element) {
  element?.focus({ preventScroll: true });
}

export default MobileBottomNavigation;
