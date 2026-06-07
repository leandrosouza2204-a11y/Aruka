import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Financeiro from "./pages/Financeiro";
import Treinos from "./pages/Treinos";
import Avaliacoes from "./pages/Avaliacoes";
import Planos from "./pages/Planos";
import AlterarSenha from "./pages/AlterarSenha";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import SubscriptionRoute from "./auth/SubscriptionRoute";
import AssinaturaPendente from "./pages/AssinaturaPendente";
import CriarSenha from "./pages/CriarSenha";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
              <AlterarSenha />
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
                <Dashboard />
              </SubscriptionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alunos"
          element={
            <ProtectedRoute>
              <SubscriptionRoute>
                <Alunos />
              </SubscriptionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/financeiro"
          element={
            <ProtectedRoute>
              <SubscriptionRoute>
                <Financeiro />
              </SubscriptionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/planos"
          element={
            <ProtectedRoute>
              <SubscriptionRoute>
                <Planos />
              </SubscriptionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/avaliacoes"
          element={
            <ProtectedRoute>
              <SubscriptionRoute>
                <Avaliacoes />
              </SubscriptionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/treinos"
          element={
            <ProtectedRoute>
              <SubscriptionRoute>
                <Treinos />
              </SubscriptionRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
