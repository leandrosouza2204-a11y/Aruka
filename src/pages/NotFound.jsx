import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page" data-testid="not-found-page">
      <section className="not-found-panel" aria-labelledby="not-found-title">
        <span className="not-found-code">404</span>
        <h1 id="not-found-title">Página não encontrada</h1>
        <p>Não encontramos o endereço que você tentou acessar.</p>
        <Link className="app-button app-button-primary" to="/dashboard">
          Voltar ao início
        </Link>
      </section>
    </main>
  );
}

export default NotFound;
