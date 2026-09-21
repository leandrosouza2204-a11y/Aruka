import { AlertCircle, LogOut, Mail, MessageCircle, RefreshCcw, UserRound } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { encerrarSessao } from "../../../services/logoutService.js";
import { buscarMeuPerfilAlunoV2 } from "../../../services/studentProfileV2Service.js";
import { supabase } from "../../../services/supabase.js";
import { hasStudentSupportChannels } from "../domain/studentProfileV2.js";
import { createLatestRequestGuard } from "./latestRequestGuard.js";

function StudentProfileV2() {
  const navigate = useNavigate();
  const [state, setState] = useState({ status: "loading", data: null });
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const mountedRef = useRef(false);
  const requestGuardRef = useRef(createLatestRequestGuard());

  const load = useCallback(async (expectedUserId) => {
    const requestVersion = requestGuardRef.current.start();
    setState({ status: "loading", data: null });
    try {
      const data = await buscarMeuPerfilAlunoV2({ expectedUserId });
      if (mountedRef.current && requestGuardRef.current.isCurrent(requestVersion)) {
        setState({ status: "success", data });
      }
    } catch {
      if (mountedRef.current && requestGuardRef.current.isCurrent(requestVersion)) {
        setState({ status: "error", data: null });
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    let currentUserId;
    const requestGuard = requestGuardRef.current;
    mountedRef.current = true;

    function handleSession(userId) {
      if (!active || userId === currentUserId) return;
      currentUserId = userId;
      requestGuard.invalidate();
      if (!userId) {
        setState({ status: "loading", data: null });
        return;
      }
      window.setTimeout(() => { if (active) load(userId); }, 0);
    }

    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session?.user?.id || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session?.user?.id || null);
    });

    return () => {
      active = false;
      mountedRef.current = false;
      requestGuard.invalidate();
      listener.subscription.unsubscribe();
    };
  }, [load]);

  const retry = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id;
    if (userId) load(userId);
  }, [load]);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    try {
      await encerrarSessao();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("Não foi possível sair. Sua sessão continua ativa.");
      setLoggingOut(false);
    }
  }

  if (state.status === "loading") {
    return <section aria-label="Carregando perfil" className="student-v2-state" role="status"><div className="student-v2-skeleton-line is-short" /><div className="student-v2-skeleton-line is-title" /><div className="student-v2-skeleton-card" /></section>;
  }
  if (state.status === "error") {
    return <section className="student-v2-state student-v2-error" role="alert"><AlertCircle aria-hidden="true" size={28} /><h1>Não foi possível carregar seu perfil</h1><p>Tente novamente. Seus dados não foram exibidos.</p><button className="student-v2-button student-v2-button-secondary" onClick={retry} type="button"><RefreshCcw aria-hidden="true" size={17} /> Tentar novamente</button></section>;
  }

  const profile = state.data;
  const hasChannels = hasStudentSupportChannels(profile);
  return (
    <div className="student-profile-v2" data-testid="student-profile-v2">
      <header className="student-home-intro"><span className="student-v2-eyebrow">Sua conta</span><h1>Perfil</h1><p>Consulte seus dados e os canais disponibilizados pelo seu profissional.</p></header>

      <section aria-labelledby="student-my-profile" className="student-v2-card student-profile-card">
        <div className="student-v2-section-heading"><div><span className="student-v2-eyebrow">Identificação</span><h2 id="student-my-profile">Meu perfil</h2></div><UserRound aria-hidden="true" size={22} /></div>
        <dl className="student-profile-details"><div><dt>Nome</dt><dd>{profile.student.name}</dd></div><div><dt>E-mail da conta</dt><dd>{profile.student.email || "E-mail indisponível"}</dd></div></dl>
      </section>

      <section aria-labelledby="student-my-professional" className="student-v2-card student-profile-card">
        <div className="student-v2-section-heading"><div><span className="student-v2-eyebrow">Atendimento</span><h2 id="student-my-professional">Meu profissional</h2></div><MessageCircle aria-hidden="true" size={22} /></div>
        <strong className="student-profile-professional-name">{profile.professional.name}</strong>
        {hasChannels ? <div className="student-profile-actions">
          {profile.professional.whatsappUrl && <a className="student-v2-button student-v2-button-primary" href={profile.professional.whatsappUrl} rel="noreferrer" target="_blank"><MessageCircle aria-hidden="true" size={18} /> Conversar pelo WhatsApp <span className="sr-only">(abre em nova aba)</span></a>}
          {profile.professional.emailUrl && <a className="student-v2-button student-v2-button-secondary" href={profile.professional.emailUrl}><Mail aria-hidden="true" size={18} /> Enviar e-mail</a>}
        </div> : <p className="student-profile-empty">Seu profissional ainda não disponibilizou canais de atendimento por aqui.</p>}
      </section>

      <section aria-labelledby="student-my-account" className="student-v2-card student-profile-card">
        <div className="student-v2-section-heading"><div><span className="student-v2-eyebrow">Sessão</span><h2 id="student-my-account">Minha conta</h2></div><LogOut aria-hidden="true" size={22} /></div>
        <p>Encerre sua sessão neste dispositivo com segurança.</p>
        <button className="student-v2-button student-profile-logout" disabled={loggingOut} onClick={logout} type="button"><LogOut aria-hidden="true" size={18} /> {loggingOut ? "Saindo..." : "Sair da conta"}</button>
        {logoutError && <p className="student-profile-logout-error" role="alert">{logoutError}</p>}
      </section>
    </div>
  );
}

export default StudentProfileV2;
