import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import SubscriptionRoute from "./auth/SubscriptionRoute";
import AdminRoute from "./auth/AdminRoute";
import LegalRoute from "./auth/LegalRoute";
import LoadingFallback from "./components/LoadingFallback";
import MobileBottomNavigation from "./components/MobileBottomNavigation";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Alunos = lazy(() => import("./pages/Alunos"));
const Financeiro = lazy(() => import("./pages/Financeiro"));
const Treinos = lazy(() => import("./pages/Treinos"));
const Avaliacoes = lazy(() => import("./pages/Avaliacoes"));
const Planos = lazy(() => import("./pages/Planos"));
const AdminUsuarios = lazy(() => import("./pages/AdminUsuarios"));
const AdminLogs = lazy(() => import("./pages/AdminLogs"));
const AlterarSenha = lazy(() => import("./pages/AlterarSenha"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./auth/Login"));
const AssinaturaPendente = lazy(() => import("./pages/AssinaturaPendente"));
const CriarSenha = lazy(() => import("./pages/CriarSenha"));
const AceiteLegal = lazy(() => import("./pages/AceiteLegal"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const TermosUso = lazy(() => import("./pages/TermosUso"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MinhaArea = lazy(() => import("./pages/MinhaArea"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback texto="Carregando página..." variant="route" />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosUso />} />
          <Route
            path="/aceite-legal"
            element={
              <ProtectedRoute>
                <AceiteLegal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assinatura"
            element={
              <ProtectedRoute>
                <AssinaturaPendente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assinatura-pendente"
            element={
              <ProtectedRoute>
                <AssinaturaPendente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alterar-senha"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <AppMobileNav>
                      <AlterarSenha />
                    </AppMobileNav>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/criar-senha"
            element={
              <ProtectedRoute>
                <CriarSenha />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/minha-area"
            element={
              <ProtectedRoute>
                <MinhaArea />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <AppMobileNav>
                      <Dashboard />
                    </AppMobileNav>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alunos"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <AppMobileNav>
                      <Alunos />
                    </AppMobileNav>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financeiro"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <AppMobileNav>
                      <Financeiro />
                    </AppMobileNav>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/planos"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <AppMobileNav>
                      <Planos />
                    </AppMobileNav>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/avaliacoes"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <AppMobileNav>
                      <Avaliacoes />
                    </AppMobileNav>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/treinos"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <AppMobileNav>
                      <Treinos />
                    </AppMobileNav>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <AdminRoute>
                      <AppMobileNav>
                        <AdminUsuarios />
                      </AppMobileNav>
                    </AdminRoute>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <AdminRoute>
                      <AppMobileNav>
                        <AdminLogs />
                      </AppMobileNav>
                    </AdminRoute>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function AppMobileNav({ children }) {
  return (
    <>
      {children}
      <MobileBottomNavigation />
    </>
  );
}

export default App;
