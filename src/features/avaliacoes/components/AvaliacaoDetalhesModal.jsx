import CardEvolucaoFisica from "../../../components/CardEvolucaoFisica";
import TabelaComposicaoCorporal from "../../../components/TabelaComposicaoCorporal";
import { calcularComposicaoCorporal } from "../../../data/calculosCorporais";
import {
  comparar,
  formatarCm,
  formatarData,
  formatarDataCurta,
  formatarKg,
  formatarPercentual,
  formatarStatus,
  gerarRecomendacoes,
} from "../hooks/useAvaliacoesPage";
import AnamneseResumoCard from "./AnamneseResumoCard";

function AvaliacaoDetalhesModal({
  alertas,
  alunoCadastro,
  alunoSelecionado,
  anamneseAluno,
  avaliacaoAnterior,
  historicoAluno,
  primeiraAvaliacao,
  relatorioAberto,
  ultimaAvaliacao,
  onAlternarRelatorio,
  onCopiarResumo,
  onFechar,
  styles,
}) {
  if (!ultimaAvaliacao) return null;

  return (
    <section className="avaliacoes-details-card" style={styles.detalhesCard}>
      <div style={styles.detalhesTopo}>
        <div>
          <h2 style={styles.detalhesTitulo}>Perfil do Aluno</h2>
          <p style={styles.resumoLista}>
            {alunoSelecionado} · {historicoAluno.length} avaliação(ões)
          </p>
        </div>
        <div style={styles.acoes}>
          <button onClick={onCopiarResumo} style={styles.botaoPrimario}>
            Copiar resumo para WhatsApp
          </button>
          <button onClick={onAlternarRelatorio} style={styles.botaoSecundario}>
            Gerar relatório da avaliação
          </button>
          <button onClick={onFechar} style={styles.botaoSecundario}>
            Fechar
          </button>
        </div>
      </div>

      {alertas.length > 0 && (
        <div style={styles.alertasGrid}>
          {alertas.map((alerta) => (
            <div key={alerta} style={styles.alertaCard}>
              {alerta}
            </div>
          ))}
        </div>
      )}

      <div style={styles.perfilGrid}>
        <div style={styles.painel}>
          <h3 style={styles.painelTitulo}>Dados cadastrais</h3>
          <Info
            label="Nome"
            valor={alunoCadastro?.nome || alunoSelecionado}
            styles={styles}
          />
          <Info label="WhatsApp" valor={alunoCadastro?.whatsapp} styles={styles} />
          <Info label="Plano" valor={alunoCadastro?.plano} styles={styles} />
          <Info label="Status" valor={alunoCadastro?.status} styles={styles} />
        </div>

        <AnamneseResumoCard
          anamnese={anamneseAluno}
          styles={styles}
          Info={(props) => <Info {...props} styles={styles} />}
        />
      </div>

      <CardEvolucaoFisica primeira={primeiraAvaliacao} ultima={ultimaAvaliacao} />

      <div style={styles.detalhesGrid}>
        <TabelaComposicaoCorporal avaliacao={ultimaAvaliacao} />
        <div style={styles.painel}>
          <h3 style={styles.painelTitulo}>Última avaliação física</h3>
          <Info label="Data" valor={formatarData(ultimaAvaliacao.data)} styles={styles} />
          <Info
            label="Status"
            valor={formatarStatus(ultimaAvaliacao.status)}
            styles={styles}
          />
          <Info
            label="Objetivo atual"
            valor={ultimaAvaliacao.objetivoAtual}
            styles={styles}
          />
          <Info
            label="Aderência treino"
            valor={ultimaAvaliacao.aderenciaTreino}
            styles={styles}
          />
          <Info
            label="Aderência dieta"
            valor={ultimaAvaliacao.aderenciaDieta}
            styles={styles}
          />
        </div>
      </div>

      <h3 style={styles.subtituloSecao}>Gráficos de evolução</h3>
      <div style={styles.graficosGrid}>
        <GraficoEvolucao
          titulo="Peso"
          historico={historicoAluno}
          obterValor={(avaliacao) => avaliacao.peso}
          unidade="kg"
          styles={styles}
        />
        <GraficoEvolucao
          titulo="Cintura"
          historico={historicoAluno}
          obterValor={(avaliacao) => avaliacao.medidas?.cintura}
          unidade="cm"
          styles={styles}
        />
        <GraficoEvolucao
          titulo="% gordura"
          historico={historicoAluno}
          obterValor={(avaliacao) =>
            calcularComposicaoCorporal(avaliacao).percentualGordura
          }
          unidade="%"
          styles={styles}
        />
        <GraficoEvolucao
          titulo="Massa magra"
          historico={historicoAluno}
          obterValor={(avaliacao) =>
            calcularComposicaoCorporal(avaliacao).massaMagra
          }
          unidade="kg"
          styles={styles}
        />
      </div>

      {relatorioAberto && (
        <RelatorioAvaliacao
          aluno={alunoCadastro}
          avaliacao={ultimaAvaliacao}
          anterior={avaliacaoAnterior}
          anamnese={anamneseAluno}
          styles={styles}
        />
      )}

      <h3 style={styles.subtituloSecao}>Histórico de evolução</h3>
      <div className="responsive-table">
        <table style={styles.tabela}>
          <thead>
            <tr style={styles.linhaCabecalho}>
              <th style={styles.tabelaHeader}>Data</th>
              <th style={styles.tabelaHeader}>Peso</th>
              <th style={styles.tabelaHeader}>Cintura</th>
              <th style={styles.tabelaHeader}>Quadril</th>
              <th style={styles.tabelaHeader}>% gordura</th>
              <th style={styles.tabelaHeader}>Massa magra</th>
              <th style={styles.tabelaHeader}>IMC</th>
            </tr>
          </thead>
          <tbody>
            {historicoAluno.map((avaliacao) => {
              const composicao = calcularComposicaoCorporal(avaliacao);

              return (
                <tr key={avaliacao.id}>
                  <td style={styles.tabelaCelula}>
                    {formatarData(avaliacao.data)}
                  </td>
                  <td style={styles.tabelaCelula}>{formatarKg(avaliacao.peso)}</td>
                  <td style={styles.tabelaCelula}>
                    {formatarCm(avaliacao.medidas?.cintura)}
                  </td>
                  <td style={styles.tabelaCelula}>
                    {formatarCm(avaliacao.medidas?.quadril)}
                  </td>
                  <td style={styles.tabelaCelula}>
                    {formatarPercentual(composicao.percentualGordura)}
                  </td>
                  <td style={styles.tabelaCelula}>
                    {formatarKg(composicao.massaMagra)}
                  </td>
                  <td style={styles.tabelaCelula}>{composicao.imc || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RelatorioAvaliacao({ aluno, avaliacao, anterior, anamnese, styles }) {
  const composicao = calcularComposicaoCorporal(avaliacao);

  return (
    <section style={styles.relatorio}>
      <h3 style={styles.subtituloSecao}>Relatório da avaliação</h3>
      <div style={styles.relatorioGrid}>
        <BlocoRelatorio
          titulo="Dados do aluno"
          itens={[
            ["Nome", aluno?.nome || avaliacao.aluno],
            ["WhatsApp", aluno?.whatsapp || "-"],
            ["Data", formatarData(avaliacao.data)],
            ["Status", formatarStatus(avaliacao.status)],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Medidas corporais"
          itens={[
            ["Peso", formatarKg(avaliacao.peso)],
            ["Cintura", formatarCm(avaliacao.medidas?.cintura)],
            ["Abdômen", formatarCm(avaliacao.medidas?.abdomen)],
            ["Quadril", formatarCm(avaliacao.medidas?.quadril)],
            ["Tórax", formatarCm(avaliacao.medidas?.torax)],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Composição estimada"
          itens={[
            ["% gordura", formatarPercentual(composicao.percentualGordura)],
            ["Massa magra", formatarKg(composicao.massaMagra)],
            ["Massa gorda", formatarKg(composicao.massaGorda)],
            ["IMC", composicao.imc || "-"],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Evolução comparativa"
          itens={[
            ["Peso", comparar(avaliacao?.peso, anterior?.peso, "kg")],
            [
              "Cintura",
              comparar(
                avaliacao?.medidas?.cintura,
                anterior?.medidas?.cintura,
                "cm"
              ),
            ],
            [
              "Quadril",
              comparar(
                avaliacao?.medidas?.quadril,
                anterior?.medidas?.quadril,
                "cm"
              ),
            ],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Observações e recomendações"
          itens={[
            ["Observações", avaliacao.observacoes || "-"],
            ["Aderência treino", avaliacao.aderenciaTreino || "-"],
            ["Aderência dieta", avaliacao.aderenciaDieta || "-"],
            ["Recomendações", gerarRecomendacoes(avaliacao, anamnese)],
          ]}
          styles={styles}
        />
      </div>
    </section>
  );
}

function BlocoRelatorio({ titulo, itens, styles }) {
  return (
    <div style={styles.painel}>
      <h4 style={styles.painelTitulo}>{titulo}</h4>
      {itens.map(([label, valor]) => (
        <Info key={label} label={label} valor={valor} styles={styles} />
      ))}
    </div>
  );
}

function GraficoEvolucao({ titulo, historico, obterValor, unidade, styles }) {
  const pontos = historico
    .map((item) => ({ data: item.data, valor: Number(obterValor(item) || 0) }))
    .filter((item) => item.valor > 0);
  const maior = Math.max(...pontos.map((item) => item.valor), 0);

  return (
    <div style={styles.graficoCard}>
      <h4 style={styles.painelTitulo}>{titulo}</h4>
      <div style={styles.grafico}>
        {pontos.map((item) => {
          const altura = maior ? Math.max((item.valor / maior) * 100, 8) : 0;
          return (
            <div key={`${titulo}-${item.data}`} style={styles.barraItem}>
              <span style={styles.barraValor}>
                {item.valor.toFixed(1)} {unidade}
              </span>
              <div style={styles.barraTrilho}>
                <div style={{ ...styles.barra, height: `${altura}%` }} />
              </div>
              <span style={styles.barraLabel}>{formatarDataCurta(item.data)}</span>
            </div>
          );
        })}
        {pontos.length === 0 && (
          <p style={styles.resumoLista}>Sem dados suficientes.</p>
        )}
      </div>
    </div>
  );
}

function Info({ label, valor, styles }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValor}>{valor || "-"}</strong>
    </div>
  );
}

export default AvaliacaoDetalhesModal;
