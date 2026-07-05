import { useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import FooterLegal from "../components/FooterLegal";

function TermosUso() {
  const navigate = useNavigate();

  function sairDaPagina() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  }

  return (
    <div style={pagina}>
      <main style={documento}>
        <div style={barraAcoes}>
          <button type="button" onClick={sairDaPagina} style={botaoSair}>
            Sair
          </button>
        </div>

        <div style={marca}>
          <BrandLogo variant="full" size="md" />
        </div>

        <span style={badge}>Versão 1.0 • Última atualização: 08/06/2026</span>
        <h1 style={titulo}>Termos de Uso</h1>

        <Aviso />

        <Secao titulo="1. Finalidade da Aruka">
          A Aruka é um SaaS criado para auxiliar personal trainers na
          gestão de alunos, planos, financeiro, avaliações, treinos e
          comunicação manual de acompanhamento.
        </Secao>

        <Secao titulo="2. Responsabilidades do usuário">
          O usuário deve utilizar a plataforma de forma lícita, manter seus
          dados de acesso protegidos e garantir que as informações cadastradas
          sejam corretas, atualizadas e autorizadas.
        </Secao>

        <Secao titulo="3. Dados dos alunos">
          O personal trainer é responsável pelos dados de alunos cadastrados no
          sistema, incluindo obtenção de autorizações, prestação de informações
          e atendimento a solicitações dos titulares quando aplicável.
        </Secao>

        <Secao titulo="4. Uso adequado da plataforma">
          É proibido usar a Aruka para fins ilícitos, abusivos,
          discriminatórios, envio de spam, violação de direitos de terceiros ou
          tentativa de acesso não autorizado a dados e funcionalidades.
        </Secao>

        <Secao titulo="5. Limites do serviço">
          A Aruka é uma ferramenta de organização e gestão. Ela não
          substitui julgamento profissional, avaliação médica, orientação
          nutricional ou responsabilidade técnica do usuário.
        </Secao>

        <Secao titulo="6. Planos, assinaturas e bloqueio de acesso">
          O acesso ao sistema pode depender de assinatura ativa, período de
          teste, liberação beta ou aprovação administrativa. Acesso pendente,
          vencido, cancelado ou bloqueado poderá restringir o uso da
          plataforma.
        </Secao>

        <Secao titulo="7. Propriedade intelectual">
          A marca Aruka, layout, código, fluxos, textos e demais elementos
          da plataforma pertencem aos seus responsáveis ou licenciadores. O uso
          do sistema não transfere propriedade intelectual ao usuário.
        </Secao>

        <Secao titulo="8. Disponibilidade">
          O serviço poderá passar por manutenções, indisponibilidades
          temporárias ou alterações técnicas. A Aruka buscará manter a
          plataforma estável, mas não garante disponibilidade ininterrupta.
        </Secao>

        <Secao titulo="9. Alterações dos termos">
          Estes Termos de Uso poderão ser atualizados. Quando houver alteração
          relevante, o sistema poderá solicitar novo aceite.
        </Secao>

        <FooterLegal />
      </main>
    </div>
  );
}

function Aviso() {
  return (
    <div style={aviso}>
      Este documento é um modelo inicial e deve ser revisado juridicamente
      antes de uso comercial amplo.
    </div>
  );
}

function Secao({ titulo, children }) {
  return (
    <section style={secao}>
      <h2 style={secaoTitulo}>{titulo}</h2>
      <p style={paragrafo}>{children}</p>
    </section>
  );
}

const pagina = {
  minHeight: "100vh",
  background: "#f3f4f6",
  padding: "32px 18px",
};

const documento = {
  width: "min(900px, 100%)",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.1)",
  margin: "0 auto",
  padding: "30px",
};

const barraAcoes = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "8px",
};

const botaoSair = {
  background: "#e5e7eb",
  border: "none",
  borderRadius: "8px",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "800",
  minHeight: "36px",
  padding: "8px 13px",
};

const marca = {
  display: "grid",
  justifyItems: "center",
  marginBottom: "24px",
};

const badge = {
  color: "#2563eb",
  fontSize: "13px",
  fontWeight: "800",
};

const titulo = {
  color: "#111827",
  fontSize: "34px",
  margin: "8px 0 18px",
};

const aviso = {
  background: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: "8px",
  color: "#92400e",
  fontWeight: "700",
  lineHeight: 1.5,
  marginBottom: "22px",
  padding: "12px",
};

const secao = {
  borderTop: "1px solid #e5e7eb",
  paddingTop: "18px",
  marginTop: "18px",
};

const secaoTitulo = {
  color: "#111827",
  fontSize: "20px",
  margin: "0 0 8px",
};

const paragrafo = {
  color: "#4b5563",
  lineHeight: 1.7,
};

export default TermosUso;
