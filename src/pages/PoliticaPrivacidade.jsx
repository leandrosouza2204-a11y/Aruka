import BrandLogo from "../components/BrandLogo";
import FooterLegal from "../components/FooterLegal";

function PoliticaPrivacidade() {
  return (
    <div style={pagina}>
      <main style={documento}>
        <div style={marca}>
          <BrandLogo variant="full" size="md" />
        </div>

        <span style={badge}>Versão 1.0 • Última atualização: 08/06/2026</span>
        <h1 style={titulo}>Política de Privacidade</h1>

        <Aviso />

        <Secao titulo="1. Sobre esta política">
          Esta Política de Privacidade explica como o CoachFlow trata dados
          pessoais no contexto de um SaaS para personal trainers gerenciarem
          alunos, planos, financeiro, avaliações, treinos e comunicação manual
          via WhatsApp.
        </Secao>

        <Secao titulo="2. Dados coletados">
          Podemos tratar dados de cadastro do usuário, como nome, e-mail,
          dados de autenticação e perfil de acesso. O personal trainer também
          pode cadastrar dados de seus alunos, incluindo nome, WhatsApp, datas,
          planos, informações financeiras, avaliações físicas, anamnese,
          medidas corporais, histórico de evolução e treinos.
        </Secao>

        <Secao titulo="3. Finalidade do tratamento">
          Os dados são utilizados para autenticação, controle de acesso,
          gestão da consultoria, organização financeira, acompanhamento dos
          alunos, criação de treinos, avaliações físicas, check-ins e envio
          manual de mensagens pelo WhatsApp.
        </Secao>

        <Secao titulo="4. Armazenamento e segurança">
          O CoachFlow utiliza infraestrutura Supabase para autenticação e banco
          de dados. O acesso aos registros é protegido por autenticação e
          políticas de segurança por usuário sempre que aplicável.
        </Secao>

        <Secao titulo="5. WhatsApp">
          O CoachFlow não envia mensagens automaticamente pelo WhatsApp. A
          plataforma apenas monta mensagens e abre o WhatsApp para envio manual
          pelo usuário responsável.
        </Secao>

        <Secao titulo="6. Responsabilidade sobre dados dos alunos">
          O personal trainer é responsável por informar seus alunos sobre o uso
          dos dados cadastrados e por obter as autorizações necessárias quando
          exigido pela legislação aplicável.
        </Secao>

        <Secao titulo="7. Direitos do titular conforme LGPD">
          Titulares de dados podem solicitar confirmação de tratamento, acesso,
          correção, exclusão, portabilidade, informação sobre compartilhamento
          e revogação de consentimento, quando aplicável.
        </Secao>

        <Secao titulo="8. Contato">
          Solicitações relacionadas à privacidade podem ser encaminhadas ao
          responsável pelo CoachFlow pelo canal de contato informado ao usuário
          contratante.
        </Secao>

        <Secao titulo="9. Alterações desta política">
          Esta política poderá ser atualizada. Quando houver nova versão
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

export default PoliticaPrivacidade;
