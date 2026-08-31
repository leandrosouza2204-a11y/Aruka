import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

function PasswordRecoveryRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function bootstrapRecoverySession() {
      const session = await loadCurrentSession();
      if (!active) return;
      setStatus(session ? "authenticated" : "invalid");
    }

    bootstrapRecoverySession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setStatus(session?.user ? "authenticated" : "invalid");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return <div style={stateScreen}>Carregando recuperação...</div>;
  }

  if (status === "invalid") {
    return (
      <main style={stateScreen}>
        <section style={messageBox}>
          <strong>Link invalido ou expirado</strong>
          <p style={messageText}>
            Solicite uma nova recuperação pela tela de login para redefinir sua senha.
          </p>
        </section>
      </main>
    );
  }

  return children;
}

async function loadCurrentSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) return session;

  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return null;

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return null;
  return data.session || null;
}

const stateScreen = {
  alignItems: "center",
  background: "#f3f4f6",
  color: "#111827",
  display: "flex",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "24px",
};

const messageBox = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
  display: "grid",
  gap: "10px",
  maxWidth: "460px",
  padding: "24px",
  textAlign: "center",
};

const messageText = {
  color: "#4b5563",
  lineHeight: 1.5,
  margin: 0,
};

export default PasswordRecoveryRoute;
