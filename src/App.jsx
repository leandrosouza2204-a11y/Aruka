import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Financeiro from "./pages/Financeiro";
import Treinos from "./pages/Treinos";
import Avaliacoes from "./pages/Avaliacoes";
import Planos from "./pages/Planos";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alunos"
          element={
            <ProtectedRoute>
              <Alunos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/financeiro"
          element={
            <ProtectedRoute>
              <Financeiro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planos"
          element={
            <ProtectedRoute>
              <Planos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/avaliacoes"
          element={
            <ProtectedRoute>
              <Avaliacoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/treinos"
          element={
            <ProtectedRoute>
              <Treinos />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
