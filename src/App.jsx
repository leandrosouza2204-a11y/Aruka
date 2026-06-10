import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Financeiro from "./pages/Financeiro";
import Treinos from "./pages/Treinos";
import Avaliacoes from "./pages/Avaliacoes";
import Planos from "./pages/Planos";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminLogs from "./pages/AdminLogs";
import AlterarSenha from "./pages/AlterarSenha";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import SubscriptionRoute from "./auth/SubscriptionRoute";
import AdminRoute from "./auth/AdminRoute";
import LegalRoute from "./auth/LegalRoute";
import AssinaturaPendente from "./pages/AssinaturaPendente";
import CriarSenha from "./pages/CriarSenha";
import AceiteLegal from "./pages/AceiteLegal";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
