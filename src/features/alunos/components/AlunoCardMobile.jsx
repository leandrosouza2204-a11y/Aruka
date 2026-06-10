import { normalizarTelefoneWhatsApp } from "../../../services/whatsappService";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";

function AlunoCardMobile({
  aluno,
  nomePlano,
  onDetalhes,
  onEditar,
  onExcluir,
  onCheckin,
}) {
  return (
    <article className="mobile-card">
      <strong>{aluno.nome}</strong>
      <span>{aluno.whatsapp || "-"}</span>
      <span>{nomePlano(aluno.plano)}</span>
      <span>{formatarMoeda(aluno.valor)}</span>
      <span>{formatarData(aluno.vencimento)}</span>
      <div className="table-actions-inline">
        <button onClick={() => onDetalhes(aluno.id)} className="table-button table-button-secondary">
          Detalhes
        </button>
        <button
          onClick={() => onCheckin(aluno)}
          className="table-button table-button-success"
          disabled={!normalizarTelefoneWhatsApp(aluno.whatsapp)}
        >
          Check-in
        </button>
        <button onClick={() => onEditar(aluno)} className="table-button table-button-primary">
          Editar
        </button>
        <button onClick={() => onExcluir(aluno.id)} className="table-button table-button-danger">
          Excluir
        </button>
      </div>
    </article>
  );
}

export default AlunoCardMobile;
