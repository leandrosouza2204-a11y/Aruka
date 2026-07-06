import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import SubscriptionRoute from "./auth/SubscriptionRoute";
import AdminRoute from "./auth/AdminRoute";
import LegalRoute from "./auth/LegalRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Alunos = lazy(() => import("./pages/Alunos"));
const Financeiro = lazy(() => import("./pages/Financeiro"));
const Treinos = lazy(() => import("./pages/Treinos"));
const Avaliacoes = lazy(() => import("./pages/Avaliacoes"));
const Planos = lazy(() => import("./pages/Planos"));
const AdminUsuarios = lazy(() => import("./pages/AdminUsuarios"));
const AdminLogs = lazy(() => import("./pages/AdminLogs"));
const AlterarSenha = lazy(() => import("./pages/AlterarSenha"));
const Login = lazy(() => import("./auth/Login"));
const AssinaturaPendente = lazy(() => import("./pages/AssinaturaPendente"));
const CriarSenha = lazy(() => import("./pages/CriarSenha"));
const AceiteLegal = lazy(() => import("./pages/AceiteLegal"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const TermosUso = lazy(() => import("./pages/TermosUso"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
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
                    <AlterarSenha />
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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SubscriptionRoute>
                  <LegalRoute>
                    <Dashboard />
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
                    <Alunos />
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
                    <Financeiro />
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
                    <Planos />
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
                    <Avaliacoes />
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
                    <Treinos />
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
                      <AdminUsuarios />
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
                      <AdminLogs />
                    </AdminRoute>
                  </LegalRoute>
                </SubscriptionRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
