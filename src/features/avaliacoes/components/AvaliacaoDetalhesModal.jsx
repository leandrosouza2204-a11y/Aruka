import { useEffect, useRef, useState } from "react";
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
  formatarEscala,
  formatarStatus,
  gerarRecomendacoes,
} from "../hooks/useAvaliacoesPage";
import AnamneseResumoCard from "./AnamneseResumoCard";

const dobrasRelatorio = [
  ["Peitoral", "peitoral"],
  ["Abdominal", "abdominal"],
  ["Coxa", "coxa"],
  ["Tríceps", "triceps"],
  ["Subescapular", "subescapular"],
  ["Supra-ilíaca", "supraIliaca"],
  ["Axilar média", "axilarMedia"],
];

function AvaliacaoDetalhesModal({
  alertas,
  alunoCadastro,
  alunoSelecionado,
  anamneseAluno,
  avaliacaoAnterior,
  historicoAluno,
  primeiraAvaliacao,
  relatorioAtivo,
  ultimaAvaliacao,
  onAlternarRelatorioAnamnese,
  onAlternarRelatorio,
  onCopiarResumo,
  onFechar,
  onFecharRelatorio,
  styles,
}) {
  const relatorioRef = useRef(null);

  useEffect(() => {
    if (!relatorioAtivo) return undefined;
    const frame = requestAnimationFrame(() => {
      relatorioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [relatorioAtivo]);

  if (!ultimaAvaliacao && !anamneseAluno) return null;

  return (
    <section className="avaliacoes-details-card" style={styles.detalhesCard}>
      <div className="avaliacoes-profile-header" style={styles.detalhesTopo}>
        <div className="avaliacoes-profile-summary">
          <h2 style={styles.detalhesTitulo}>Perfil do Aluno</h2>
          <p style={styles.resumoLista}>
            {alunoSelecionado} · {historicoAluno.length} avaliação(ões)
          </p>
          <span className="status-badge status-badge-info">
            {anamneseAluno ? "Anamnese registrada" : "Sem anamnese"}
          </span>
        </div>
        <div className="avaliacoes-profile-actions" style={styles.acoes}>
          <button
            className="avaliacoes-action-primary"
            onClick={onCopiarResumo}
            style={styles.botaoPrimario}
            disabled={!ultimaAvaliacao}
          >
            Copiar resumo para WhatsApp
          </button>
          <button
            className="avaliacoes-action-secondary"
            onClick={onAlternarRelatorio}
            style={styles.botaoSecundario}
            disabled={!ultimaAvaliacao}
          >
            Gerar relatório da avaliação
          </button>
          <button
            className="avaliacoes-action-secondary"
            onClick={onAlternarRelatorioAnamnese}
            disabled={!anamneseAluno}
            style={styles.botaoSecundario}
            title={
              anamneseAluno
                ? "Gerar relatorio da anamnese"
                : "Nenhuma anamnese registrada para este aluno."
            }
          >
            Gerar relatório da anamnese
          </button>
          <button
            className="avaliacoes-action-secondary"
            onClick={onFechar}
            style={styles.botaoSecundario}
          >
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

      {ultimaAvaliacao ? (
        <>
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
        </>
      ) : (
        <div style={styles.painel}>
          <h3 style={styles.painelTitulo}>Avaliação física</h3>
          <p style={styles.resumoLista}>
            Nenhuma avaliação física registrada para este aluno.
          </p>
        </div>
      )}

      {relatorioAtivo && (
        <section ref={relatorioRef} className="app-card" style={styles.relatorioContainer}>
          <div className="app-card-header" style={styles.relatorioTopo}>
            <div>
              <h3 style={styles.relatorioTitulo}>
                {relatorioAtivo === "avaliacao"
                  ? "Relatório da Avaliação Física"
                  : "Relatório da Anamnese"}
              </h3>
              <p className="app-muted" style={styles.relatorioResumo}>
                {alunoSelecionado}
              </p>
            </div>
            <button
              className="app-button app-button-secondary"
              onClick={onFecharRelatorio}
              style={styles.botaoSecundario}
            >
              Fechar relatório
            </button>
          </div>

          {relatorioAtivo === "avaliacao" ? (
            <RelatorioAvaliacao
              aluno={alunoCadastro}
              avaliacao={ultimaAvaliacao}
              anterior={avaliacaoAnterior}
              anamnese={anamneseAluno}
              styles={styles}
            />
          ) : (
            <RelatorioAnamnese
              aluno={alunoCadastro}
              alunoSelecionado={alunoSelecionado}
              anamnese={anamneseAluno}
              styles={styles}
            />
          )}
        </section>
      )}

      <h3 style={styles.subtituloSecao}>Histórico de evolução</h3>
      <div className="responsive-table avaliacoes-history-table">
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
          titulo="Dobras cutâneas"
          itens={dobrasRelatorio.map(([label, chave]) => [
            label,
            formatarMm(avaliacao.dobras?.[chave]),
          ])}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Composição estimada"
          itens={[
            ["Percentual de gordura", formatarPercentual(composicao.percentualGordura)],
            ["Método", composicao.metodoPercentualGordura],
            ["Massa magra", formatarKg(composicao.massaMagra)],
            ["Massa gorda", formatarKg(composicao.massaGorda)],
            ["IMC", composicao.imc || "-"],
          ]}
          styles={styles}
        />
        <RegistroFotografico avaliacao={avaliacao} aluno={aluno} styles={styles} />
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

function RegistroFotografico({ avaliacao, aluno, styles }) {
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [indisponiveis, setIndisponiveis] = useState({});
  const nomeAluno = aluno?.nome || avaliacao.aluno || "aluno";
  const fotos = [
    {
      chave: "frente",
      legenda: "Frente",
      src: avaliacao.fotosPreview?.frente,
      alt: `Foto frontal da avaliação de ${nomeAluno}`,
    },
    {
      chave: "lateral",
      legenda: "Lateral",
      src: avaliacao.fotosPreview?.lateral,
      alt: `Foto lateral da avaliação de ${nomeAluno}`,
    },
    {
      chave: "costas",
      legenda: "Costas",
      src: avaliacao.fotosPreview?.costas,
      alt: `Foto de costas da avaliação de ${nomeAluno}`,
    },
  ].filter((foto) => foto.src && !indisponiveis[foto.chave]);

  if (!fotos.length) return null;

  return (
    <section style={styles.fotosRelatorioSecao}>
      <h4 style={styles.painelTitulo}>Registro fotográfico</h4>
      <div style={styles.fotosRelatorioGrid}>
        {fotos.map((foto) => (
          <button
            key={foto.chave}
            type="button"
            onClick={() => setFotoAmpliada(foto)}
            style={styles.fotoRelatorioCard}
          >
            <img
              src={foto.src}
              alt={foto.alt}
              style={styles.fotoRelatorioImagem}
              onError={() => setIndisponiveis((atuais) => ({ ...atuais, [foto.chave]: true }))}
            />
            <span style={styles.fotoRelatorioLegenda}>{foto.legenda}</span>
          </button>
        ))}
      </div>

      {fotoAmpliada && !indisponiveis[fotoAmpliada.chave] && (
        <div style={styles.fotoRelatorioAmpliada}>
          <div style={styles.fotoRelatorioAmpliadaTopo}>
            <strong>{fotoAmpliada.legenda}</strong>
            <button
              type="button"
              onClick={() => setFotoAmpliada(null)}
              style={styles.botaoSecundario}
            >
              Fechar imagem
            </button>
          </div>
          <img
            src={fotoAmpliada.src}
            alt={fotoAmpliada.alt}
            style={styles.fotoRelatorioImagemGrande}
            onError={() => {
              setIndisponiveis((atuais) => ({ ...atuais, [fotoAmpliada.chave]: true }));
              setFotoAmpliada(null);
            }}
          />
        </div>
      )}
    </section>
  );
}

function RelatorioAnamnese({ aluno, alunoSelecionado, anamnese, styles }) {
  if (!anamnese) {
    return (
      <section style={styles.relatorio}>
        <h3 style={styles.subtituloSecao}>Relatório da anamnese</h3>
        <p style={styles.resumoLista}>
          Nenhuma anamnese cadastrada para este aluno.
        </p>
      </section>
    );
  }

  return (
    <section style={styles.relatorio}>
      <h3 style={styles.subtituloSecao}>Relatório da anamnese</h3>
      <div style={styles.relatorioGrid}>
        <BlocoRelatorio
          titulo="Aluno"
          itens={[
            ["Nome", aluno?.nome || alunoSelecionado || anamnese.aluno],
            ["Data", formatarData(anamnese.createdAt)],
            ["WhatsApp", aluno?.whatsapp || "-"],
            ["Status", aluno?.status || "-"],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Escalas de acompanhamento"
          itens={[
            ["Sono", formatarEscala(anamnese.escalaSono)],
            ["Estresse", formatarEscala(anamnese.escalaEstresse)],
            ["Energia", formatarEscala(anamnese.escalaEnergia)],
            ["Fome", formatarEscala(anamnese.escalaFome)],
            ["Motivação", formatarEscala(anamnese.escalaMotivacao)],
            ["Adesão à rotina", formatarEscala(anamnese.escalaAdesaoRotina)],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Dados pessoais"
          itens={[
            ["Profissão", anamnese.profissao],
            ["Rotina de trabalho", anamnese.rotinaTrabalho],
            ["Objetivo principal", anamnese.objetivoPrincipal],
            ["Objetivo secundário", anamnese.objetivoSecundario],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Saúde geral"
          itens={[
            ["Doença diagnosticada", anamnese.doencaDiagnosticada],
            ["Usa medicamento", anamnese.medicamento],
            ["Dores ou lesões", anamnese.doresLesoes],
            ["Cirurgia", anamnese.cirurgia],
            ["Restrição médica", anamnese.restricaoMedica],
            ["Liberado para exercícios", anamnese.liberadoExercicios],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Histórico de treino"
          itens={[
            ["Já treinou", anamnese.jaTreinou],
            ["Tempo de experiência", anamnese.tempoExperiencia],
            ["Frequência semanal", anamnese.frequenciaSemanal],
            ["Dias disponíveis", anamnese.diasDisponiveis],
            ["Tempo por treino", anamnese.tempoPorTreino],
            ["Local de treino", anamnese.localTreino],
            ["Equipamentos", anamnese.equipamentos],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Hábitos"
          itens={[
            ["Qualidade do sono", anamnese.qualidadeSono],
            ["Horas de sono", anamnese.horasSono],
            ["Nível de estresse", anamnese.nivelEstresse],
            ["Ingestão de água", anamnese.ingestaoAgua],
            ["Consumo de álcool", anamnese.consumoAlcool],
            ["Tabagismo", anamnese.tabagismo],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Alimentação"
          itens={[
            ["Segue dieta", anamnese.segueDieta],
            ["Nutricionista", anamnese.nutricionista],
            ["Refeições por dia", anamnese.refeicoesDia],
            ["Dificuldade alimentar", anamnese.dificuldadeAlimentacao],
            ["Fome à noite", anamnese.fomeNoite],
            ["Compulsão alimentar", anamnese.compulsaoAlimentar],
          ]}
          styles={styles}
        />
        <BlocoRelatorio
          titulo="Preferências"
          itens={[
            ["Exercícios que gosta", anamnese.exerciciosGosta],
            ["Exercícios que não gosta", anamnese.exerciciosNaoGosta],
            ["Grupos prioritários", anamnese.gruposPrioritarios],
            ["Limitações de horário", anamnese.limitacoesHorario],
            ["Observações importantes", anamnese.observacoesImportantes],
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

function formatarMm(valor) {
  if (valor === "" || valor === null || valor === undefined) return "-";
  const numero = Number(String(valor).replace(",", "."));
  return Number.isFinite(numero) ? `${numero.toFixed(1)} mm` : "-";
}

export default AvaliacaoDetalhesModal;
