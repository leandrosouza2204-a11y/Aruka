import { Component } from "react";
import { recordStudentExperienceEvent } from "../../../services/studentExperienceTelemetryService.js";

export default class StudentExperienceErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    void recordStudentExperienceEvent("v2_error_boundary", {
      experience: "v2",
      route: window.location.pathname,
      errorCategory: error?.name || "RENDER_ERROR",
    });
  }

  render() {
    if (this.state.failed) {
      return (
        <main role="alert" style={{ margin: "48px auto", maxWidth: 560, padding: 24 }}>
          <h1>Não foi possível abrir esta área.</h1>
          <p>Seu treino salvo continua seguro. Volte para a área do aluno e tente novamente.</p>
          <a href="/minha-area">Voltar para a área do aluno</a>
        </main>
      );
    }
    return this.props.children;
  }
}
