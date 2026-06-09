import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import AvaliacaoModal from "../components/AvaliacaoModal";
import AnamneseModal from "../components/AnamneseModal";
import TabelaComposicaoCorporal from "../components/TabelaComposicaoCorporal";
import CardEvolucaoFisica from "../components/CardEvolucaoFisica";
import { buscarAlunosSupabase } from "../services/alunosService";
import { calcularComposicaoCorporal } from "../data/calculosCorporais";
import {
  adicionarAvaliacaoSupabase,
  atualizarAvaliacaoSupabase,
  buscarAvaliacoesSupabase,
  excluirAvaliacaoSupabase,
} from "../services/avaliacoesService";
import {
  adicionarAnamneseSupabase,
  atualizarAnamneseSupabase,
  buscarAnamnesesSupabase,
} from "../services/anamnesesService";

function Avaliacoes() {
  const [alunos, setAlunos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [anamneses, setAnamneses] = useState([]);
  const [modalAvaliacao, setModalAvaliacao] = useState(false);
  const [modalAnamnese, setModalAnamnese] = useState(false);
  const [avaliacaoEditando, setAvaliacaoEditando] = useState(null);
  const [anamneseEditando, setAnamneseEditando] = useState(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [relatorioAberto, setRelatorioAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroAluno, setFiltroAluno] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [alunosSupabase, avaliacoesSupabase, anamnesesSupabase] =
        await Promise.all([
          buscarAlunosSupabase(),
          buscarAvaliacoesSupabase(),
          buscarAnamnesesSupabase(),
        ]);

      setAlunos(alunosSupabase);
      setAvaliacoes(vincularAlunos(avaliacoesSupabase, alunosSupabase));
      setAnamneses(vincularAlunos(anamnesesSupabase, alunosSupabase));
    } catch (error) {
      setErro(`Erro ao carregar avaliacoes: ${error.message}`);
      setAlunos([]);
      setAvaliacoes([]);
      setAnamneses([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    async function carregarDadosInicial() {
      setCarregando(true);
      setErro("");

      try {
        const [alunosSupabase, avaliacoesSupabase, anamnesesSupabase] =
          await Promise.all([
            buscarAlunosSupabase(),
            buscarAvaliacoesSupabase(),
            buscarAnamnesesSupabase(),
          ]);

        setAlunos(alunosSupabase);
        setAvaliacoes(vincularAlunos(avaliacoesSupabase, alunosSupabase));
        setAnamneses(vincularAlunos(anamnesesSupabase, alunosSupabase));
      } catch (error) {
        setErro(`Erro ao carregar avaliacoes: ${error.message}`);
        setAlunos([]);
        setAvaliacoes([]);
        setAnamneses([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosInicial();
  }, []);

  const ultimasAvaliacoes = useMemo(() => {
    const porAluno = new Map();

    avaliacoes.forEach((avaliacao) => {
      const atual = porAluno.get(avaliacao.aluno);
      if (!atual || String(avaliacao.data).localeCompare(String(atual.data)) > 0) {
        porAluno.set(avaliacao.aluno, avaliacao);
      }
    });

    return [...porAluno.values()].sort((a, b) =>
      String(b.data).localeCompare(String(a.data))
    );
  }, [avaliacoes]);

  const avaliacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return ultimasAvaliacoes.filter((avaliacao) => {
      const combinaBusca = avaliacao.aluno.toLowerCase().includes(termo);
      const combinaAluno =
        filtroAluno === "todos" || avaliacao.aluno === filtroAluno;

      return combinaBusca && combinaAluno;
    });
  }, [busca, filtroAluno, ultimasAvaliacoes]);

  const historicoAluno = useMemo(
    () =>
      avaliacoes
        .filter((avaliacao) => avaliacao.aluno === alunoSelecionado)
        .sort((a, b) => String(a.data).localeCompare(String(b.data))),
    [alunoSelecionado, avaliacoes]
  );

  const ultimaAvaliacao = historicoAluno[historicoAluno.length - 1] || null;
  const avaliacaoAnterior =
    historicoAluno.length > 1 ? historicoAluno[historicoAluno.length - 2] : null;
  const primeiraAvaliacao = historicoAluno[0] || null;
  const alunoCadastro = alunos.find((aluno) => aluno.nome === alunoSelecionado);
  const anamneseAluno =
    anamneses.find((anamnese) => anamnese.aluno === alunoSelecionado) || null;
  const alertas = useMemo(
    () => gerarAlertas(avaliacaoAnterior, ultimaAvaliacao, anamneseAluno),
    [avaliacaoAnterior, ultimaAvaliacao, anamneseAluno]
  );

  async function salvarAvaliacao(avaliacao) {
    const aluno = alunos.find((item) => item.nome === avaliacao.aluno);

    if (!aluno) {
      alert("Selecione um aluno cadastrado.");
      return;
    }

    try {
      const payload = { ...avaliacao, alunoId: aluno.id };

      if (avaliacaoEditando) {
        await atualizarAvaliacaoSupabase(avaliacaoEditando.id, payload);
      } else {
        await adicionarAvaliacaoSupabase(payload);
      }

      await carregarDados();
      setAlunoSelecionado(avaliacao.aluno);
      setModalAvaliacao(false);
      setAvaliacaoEditando(null);
    } catch (error) {
      setErro(`Erro ao salvar avaliacao: ${error.message}`);
      alert(`Erro ao salvar avaliacao: ${error.message}`);
    }
  }

  async function salvarAnamnese(anamnese) {
    const aluno = alunos.find((item) => item.nome === anamnese.aluno);

    if (!aluno) {
      alert("Selecione um aluno cadastrado.");
      return;
    }

    try {
      const payload = { ...anamnese, alunoId: aluno.id };

      if (anamneseEditando) {
        await atualizarAnamneseSupabase(anamneseEditando.id, payload);
      } else {
        await adicionarAnamneseSupabase(payload);
      }

      await carregarDados();
      setAlunoSelecionado(anamnese.aluno);
      setModalAnamnese(false);
      setAnamneseEditando(null);
    } catch (error) {
      setErro(`Erro ao salvar anamnese: ${error.message}`);
      alert(`Erro ao salvar anamnese: ${error.message}`);
    }
  }

  function editarAnamneseAluno(aluno) {
    setAnamneseEditando(
      anamneses.find((anamnese) => anamnese.aluno === aluno) || null
    );
    setModalAnamnese(true);
  }

  async function removerAvaliacao(id) {
    if (!window.confirm("Deseja excluir esta avaliacao?")) return;

    try {
      await excluirAvaliacaoSupabase(id);
      await carregarDados();
    } catch (error) {
      setErro(`Erro ao excluir avaliacao: ${error.message}`);
      alert(`Erro ao excluir avaliacao: ${error.message}`);
    }
  }

  async function copiarResumoWhatsApp() {
    if (!ultimaAvaliacao) return;

    const texto = gerarResumoWhatsApp(
      ultimaAvaliacao,
      avaliacaoAnterior,
      anamneseAluno
    );

    try {
      await navigator.clipboard.writeText(texto);
      alert("Resumo copiado para enviar no WhatsApp.");
    } catch {
      window.prompt("Copie o resumo abaixo:", texto);
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={conteudo}>
        <section style={listaCard}>
          <div style={listaTopo}>
            <div>
              <h1 style={tituloPagina}>Avaliações</h1>
              <p style={resumoLista}>
                {avaliacoesFiltradas.length} alunos com avaliacao exibidos
              </p>
            </div>

            <div style={acoes}>
              <button onClick={() => setModalAvaliacao(true)} style={botaoPrimario}>
                + Nova Avaliação
              </button>
              <button onClick={() => setModalAnamnese(true)} style={botaoSecundario}>
                + Nova Anamnese
              </button>
            </div>
          </div>

          <div style={filtros}>
            <input
              placeholder="Buscar por nome do aluno"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={campo}
            />
            <select
              value={filtroAluno}
              onChange={(e) => setFiltroAluno(e.target.value)}
              style={campo}
            >
              <option value="todos">Todos os alunos</option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.nome}>
                  {aluno.nome}
                </option>
              ))}
            </select>
          </div>
        </section>

        {erro && <div style={erroBox}>{erro}</div>}

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={tabela}>
            <thead>
              <tr style={linhaCabecalho}>
                <th style={tabelaHeader}>Aluno</th>
                <th style={tabelaHeader}>Ultima avaliacao</th>
                <th style={tabelaHeader}>Status</th>
                <th style={tabelaHeader}>Peso</th>
                <th style={tabelaHeader}>Cintura</th>
                <th style={tabelaHeader}>% gordura</th>
                <th style={tabelaHeader}>IMC</th>
                <th style={tabelaHeader}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {!carregando && avaliacoesFiltradas.map((avaliacao) => {
                const composicao = calcularComposicaoCorporal(avaliacao);

                return (
                  <tr key={avaliacao.id}>
                    <td style={tabelaCelula}>{avaliacao.aluno}</td>
                    <td style={tabelaCelula}>{formatarData(avaliacao.data)}</td>
                    <td style={tabelaCelula}>{formatarStatus(avaliacao.status)}</td>
                    <td style={tabelaCelula}>{formatarKg(avaliacao.peso)}</td>
                    <td style={tabelaCelula}>
                      {formatarCm(avaliacao.medidas?.cintura)}
                    </td>
                    <td style={tabelaCelula}>
                      {formatarPercentual(composicao.percentualGordura)}
                    </td>
                    <td style={tabelaCelula}>{composicao.imc || "-"}</td>
                    <td style={tabelaCelula}>
                      <div style={acoes}>
                        <button
                          onClick={() => {
                            setAlunoSelecionado(avaliacao.aluno);
                            setRelatorioAberto(false);
                          }}
                          style={botaoSecundario}
                        >
                          Perfil
                        </button>
                        <button
                          onClick={() => {
                            setAvaliacaoEditando(avaliacao);
                            setModalAvaliacao(true);
                          }}
                          style={botaoSecundario}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => editarAnamneseAluno(avaliacao.aluno)}
                          style={botaoSecundario}
                        >
                          Anamnese
                        </button>
                        <button
                          onClick={() => removerAvaliacao(avaliacao.id)}
                          style={botaoExcluir}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {carregando && (
                <tr>
                  <td style={estadoVazio} colSpan="8">
                    Carregando avaliacoes...
                  </td>
                </tr>
              )}

              {!carregando && avaliacoesFiltradas.length === 0 && (
                <tr>
                  <td style={estadoVazio} colSpan="8">
                    Nenhuma avaliacao cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {ultimaAvaliacao && (
          <section style={detalhesCard}>
            <div style={detalhesTopo}>
              <div>
                <h2 style={detalhesTitulo}>Perfil do Aluno</h2>
                <p style={resumoLista}>
                  {alunoSelecionado} · {historicoAluno.length} avaliacao(oes)
                </p>
              </div>
              <div style={acoes}>
                <button onClick={copiarResumoWhatsApp} style={botaoPrimario}>
                  Copiar resumo para WhatsApp
                </button>
                <button
                  onClick={() => setRelatorioAberto(!relatorioAberto)}
                  style={botaoSecundario}
                >
                  Gerar relatorio da avaliacao
                </button>
                <button onClick={() => setAlunoSelecionado("")} style={botaoSecundario}>
                  Fechar
                </button>
              </div>
            </div>

            {alertas.length > 0 && (
              <div style={alertasGrid}>
                {alertas.map((alerta) => (
                  <div key={alerta} style={alertaCard}>
                    {alerta}
                  </div>
                ))}
              </div>
            )}

            <div style={perfilGrid}>
              <div style={painel}>
                <h3 style={painelTitulo}>Dados cadastrais</h3>
                <Info label="Nome" valor={alunoCadastro?.nome || alunoSelecionado} />
                <Info label="WhatsApp" valor={alunoCadastro?.whatsapp} />
                <Info label="Plano" valor={alunoCadastro?.plano} />
                <Info label="Status" valor={alunoCadastro?.status} />
              </div>

              <div style={painel}>
                <h3 style={painelTitulo}>Ultima anamnese</h3>
                {anamneseAluno ? (
                  <>
                    <Info label="Objetivo principal" valor={anamneseAluno.objetivoPrincipal} />
                    <Info label="Dores ou lesoes" valor={anamneseAluno.doresLesoes} />
                    <Info label="Sono" valor={formatarEscala(anamneseAluno.escalaSono)} />
                    <Info label="Estresse" valor={formatarEscala(anamneseAluno.escalaEstresse)} />
                    <Info label="Adesao rotina" valor={formatarEscala(anamneseAluno.escalaAdesaoRotina)} />
                  </>
                ) : (
                  <p style={resumoLista}>Nenhuma anamnese cadastrada.</p>
                )}
              </div>
            </div>

            <CardEvolucaoFisica primeira={primeiraAvaliacao} ultima={ultimaAvaliacao} />

            <div style={detalhesGrid}>
              <TabelaComposicaoCorporal avaliacao={ultimaAvaliacao} />
              <div style={painel}>
                <h3 style={painelTitulo}>Ultima avaliacao fisica</h3>
                <Info label="Data" valor={formatarData(ultimaAvaliacao.data)} />
                <Info label="Status" valor={formatarStatus(ultimaAvaliacao.status)} />
                <Info label="Objetivo atual" valor={ultimaAvaliacao.objetivoAtual} />
                <Info label="Aderencia treino" valor={ultimaAvaliacao.aderenciaTreino} />
                <Info label="Aderencia dieta" valor={ultimaAvaliacao.aderenciaDieta} />
              </div>
            </div>

            <h3 style={subtituloSecao}>Graficos de evolucao</h3>
            <div style={graficosGrid}>
              <GraficoEvolucao titulo="Peso" historico={historicoAluno} obterValor={(a) => a.peso} unidade="kg" />
              <GraficoEvolucao titulo="Cintura" historico={historicoAluno} obterValor={(a) => a.medidas?.cintura} unidade="cm" />
              <GraficoEvolucao titulo="% gordura" historico={historicoAluno} obterValor={(a) => calcularComposicaoCorporal(a).percentualGordura} unidade="%" />
              <GraficoEvolucao titulo="Massa magra" historico={historicoAluno} obterValor={(a) => calcularComposicaoCorporal(a).massaMagra} unidade="kg" />
            </div>

            {relatorioAberto && (
              <RelatorioAvaliacao
                aluno={alunoCadastro}
                avaliacao={ultimaAvaliacao}
                anterior={avaliacaoAnterior}
                anamnese={anamneseAluno}
              />
            )}

            <h3 style={subtituloSecao}>Histórico de evolução</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={tabela}>
                <thead>
                  <tr style={linhaCabecalho}>
                    <th style={tabelaHeader}>Data</th>
                    <th style={tabelaHeader}>Peso</th>
                    <th style={tabelaHeader}>Cintura</th>
                    <th style={tabelaHeader}>Quadril</th>
                    <th style={tabelaHeader}>% gordura</th>
                    <th style={tabelaHeader}>Massa magra</th>
                    <th style={tabelaHeader}>IMC</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoAluno.map((avaliacao) => {
                    const composicao = calcularComposicaoCorporal(avaliacao);

                    return (
                      <tr key={avaliacao.id}>
                        <td style={tabelaCelula}>{formatarData(avaliacao.data)}</td>
                        <td style={tabelaCelula}>{formatarKg(avaliacao.peso)}</td>
                        <td style={tabelaCelula}>{formatarCm(avaliacao.medidas?.cintura)}</td>
                        <td style={tabelaCelula}>{formatarCm(avaliacao.medidas?.quadril)}</td>
                        <td style={tabelaCelula}>{formatarPercentual(composicao.percentualGordura)}</td>
                        <td style={tabelaCelula}>{formatarKg(composicao.massaMagra)}</td>
                        <td style={tabelaCelula}>{composicao.imc || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {modalAvaliacao && (
          <AvaliacaoModal
            alunos={alunos}
            avaliacao={avaliacaoEditando}
            onClose={() => {
              setModalAvaliacao(false);
              setAvaliacaoEditando(null);
            }}
            onSave={salvarAvaliacao}
          />
        )}

        {modalAnamnese && (
          <AnamneseModal
            alunos={alunos}
            anamnese={anamneseEditando}
            onClose={() => {
              setModalAnamnese(false);
              setAnamneseEditando(null);
            }}
            onSave={salvarAnamnese}
          />
        )}
      </div>
    </div>
  );
}

function RelatorioAvaliacao({ aluno, avaliacao, anterior, anamnese }) {
  const composicao = calcularComposicaoCorporal(avaliacao);

  return (
    <section style={relatorio}>
      <h3 style={subtituloSecao}>Relatorio da avaliacao</h3>
      <div style={relatorioGrid}>
        <BlocoRelatorio
          titulo="Dados do aluno"
          itens={[
            ["Nome", aluno?.nome || avaliacao.aluno],
            ["WhatsApp", aluno?.whatsapp || "-"],
            ["Data", formatarData(avaliacao.data)],
            ["Status", formatarStatus(avaliacao.status)],
          ]}
        />
        <BlocoRelatorio
          titulo="Medidas corporais"
          itens={[
            ["Peso", formatarKg(avaliacao.peso)],
            ["Cintura", formatarCm(avaliacao.medidas?.cintura)],
            ["Abdomen", formatarCm(avaliacao.medidas?.abdomen)],
            ["Quadril", formatarCm(avaliacao.medidas?.quadril)],
            ["Torax", formatarCm(avaliacao.medidas?.torax)],
          ]}
        />
        <BlocoRelatorio
          titulo="Composicao estimada"
          itens={[
            ["% gordura", formatarPercentual(composicao.percentualGordura)],
            ["Massa magra", formatarKg(composicao.massaMagra)],
            ["Massa gorda", formatarKg(composicao.massaGorda)],
            ["IMC", composicao.imc || "-"],
          ]}
        />
        <BlocoRelatorio
          titulo="Evolucao comparativa"
          itens={[
            ["Peso", comparar(avaliacao?.peso, anterior?.peso, "kg")],
            ["Cintura", comparar(avaliacao?.medidas?.cintura, anterior?.medidas?.cintura, "cm")],
            ["Quadril", comparar(avaliacao?.medidas?.quadril, anterior?.medidas?.quadril, "cm")],
          ]}
        />
        <BlocoRelatorio
          titulo="Observações e recomendações"
          itens={[
            ["Observações", avaliacao.observacoes || "-"],
            ["Aderencia treino", avaliacao.aderenciaTreino || "-"],
            ["Aderencia dieta", avaliacao.aderenciaDieta || "-"],
            ["Recomendacoes", gerarRecomendacoes(avaliacao, anamnese)],
          ]}
        />
      </div>
    </section>
  );
}

function BlocoRelatorio({ titulo, itens }) {
  return (
    <div style={painel}>
      <h4 style={painelTitulo}>{titulo}</h4>
      {itens.map(([label, valor]) => (
        <Info key={label} label={label} valor={valor} />
      ))}
    </div>
  );
}

function GraficoEvolucao({ titulo, historico, obterValor, unidade }) {
  const pontos = historico
    .map((item) => ({ data: item.data, valor: Number(obterValor(item) || 0) }))
    .filter((item) => item.valor > 0);
  const maior = Math.max(...pontos.map((item) => item.valor), 0);

  return (
    <div style={graficoCard}>
      <h4 style={painelTitulo}>{titulo}</h4>
      <div style={grafico}>
        {pontos.map((item) => {
          const altura = maior ? Math.max((item.valor / maior) * 100, 8) : 0;
          return (
            <div key={`${titulo}-${item.data}`} style={barraItem}>
              <span style={barraValor}>{item.valor.toFixed(1)} {unidade}</span>
              <div style={barraTrilho}>
                <div style={{ ...barra, height: `${altura}%` }} />
              </div>
              <span style={barraLabel}>{formatarDataCurta(item.data)}</span>
            </div>
          );
        })}
        {pontos.length === 0 && <p style={resumoLista}>Sem dados suficientes.</p>}
      </div>
    </div>
  );
}

function Info({ label, valor }) {
  return (
    <div style={infoItem}>
      <span style={infoLabel}>{label}</span>
      <strong style={infoValor}>{valor || "-"}</strong>
    </div>
  );
}

function vincularAlunos(registros, alunos) {
  const nomesPorId = new Map(alunos.map((aluno) => [aluno.id, aluno.nome]));

  return registros.map((registro) => ({
    ...registro,
    aluno: nomesPorId.get(registro.alunoId) || registro.aluno || "",
  }));
}

function gerarResumoWhatsApp(avaliacao, anterior, anamnese) {
  const composicao = calcularComposicaoCorporal(avaliacao);
  return [
    `Resumo da avaliacao - ${avaliacao.aluno}`,
    `Data: ${formatarData(avaliacao.data)}`,
    `Peso atual: ${formatarKg(avaliacao.peso)}`,
    `% gordura estimado: ${formatarPercentual(composicao.percentualGordura)}`,
    `Massa magra: ${formatarKg(composicao.massaMagra)}`,
    `IMC: ${composicao.imc || "-"}`,
    `Evolucao desde a avaliacao anterior: ${gerarLinhaEvolucao(avaliacao, anterior)}`,
    `Mensagem: ${mensagemMotivacional(anamnese)}`,
  ].join("\n");
}

function gerarLinhaEvolucao(atual, anterior) {
  if (!anterior) return "primeira avaliacao registrada.";
  const composicaoAtual = calcularComposicaoCorporal(atual);
  const composicaoAnterior = calcularComposicaoCorporal(anterior);
  return `peso ${comparar(atual.peso, anterior.peso, "kg")}, cintura ${comparar(
    atual.medidas?.cintura,
    anterior.medidas?.cintura,
    "cm"
  )}, massa magra ${comparar(composicaoAtual.massaMagra, composicaoAnterior.massaMagra, "kg")}.`;
}

function mensagemMotivacional(anamnese) {
  if (Number(anamnese?.escalaAdesaoRotina || 0) <= 2) {
    return "Vamos focar em consistencia nesta fase. Pequenas entregas bem feitas toda semana geram progresso real.";
  }
  return "Voce esta construindo resultado com consistencia. Mantenha o plano, ajuste o necessario e siga evoluindo.";
}

function gerarAlertas(anterior, atual, anamnese) {
  if (!atual) return [];
  const alertas = [];
  const cinturaAtual = Number(atual.medidas?.cintura || 0);
  const cinturaAnterior = Number(anterior?.medidas?.cintura || 0);
  const pesoAtual = Number(atual.peso || 0);
  const pesoAnterior = Number(anterior?.peso || 0);
  const adesaoBaixa =
    Number(anamnese?.escalaAdesaoRotina || 0) > 0 &&
    Number(anamnese?.escalaAdesaoRotina || 0) <= 2;
  const dorLesao = String(anamnese?.doresLesoes || "").toLowerCase() === "sim";

  if (cinturaAnterior && cinturaAtual > cinturaAnterior) {
    alertas.push("Alerta: cintura aumentou desde a avaliacao anterior.");
  }
  if (pesoAnterior && cinturaAnterior && pesoAtual > pesoAnterior && cinturaAtual > cinturaAnterior) {
    alertas.push("Alerta: peso e cintura subiram juntos.");
  }
  if (adesaoBaixa) {
    alertas.push("Alerta: adesao a rotina esta baixa.");
  }
  if (dorLesao) {
    alertas.push("Alerta: aluno relatou dor ou lesao na anamnese.");
  }

  return alertas;
}

function gerarRecomendacoes(avaliacao, anamnese) {
  const itens = [];
  if (Number(anamnese?.escalaSono || 0) <= 2) itens.push("priorizar ajuste de sono");
  if (Number(anamnese?.escalaEstresse || 0) >= 4) itens.push("monitorar estresse e recuperacao");
  if (String(anamnese?.doresLesoes || "").toLowerCase() === "sim") {
    itens.push("adaptar exercicios conforme dor ou lesao relatada");
  }
  if (String(avaliacao?.aderenciaTreino || "").toLowerCase().includes("baixa")) {
    itens.push("simplificar rotina para aumentar aderencia");
  }
  return itens.length ? itens.join("; ") : "manter acompanhamento regular e revisar medidas no proximo ciclo.";
}

function comparar(atual, anterior, unidade) {
  const valorAtual = Number(atual || 0);
  const valorAnterior = Number(anterior || 0);
  if (!valorAtual || !valorAnterior) return "-";
  const diferenca = valorAtual - valorAnterior;
  const sinal = diferenca > 0 ? "+" : "";
  return `${sinal}${diferenca.toFixed(1)} ${unidade}`;
}

function formatarData(data) {
  if (!data) return "-";
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatarDataCurta(data) {
  if (!data) return "-";
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function formatarKg(valor) {
  return valor ? `${Number(valor).toFixed(1)} kg` : "-";
}

function formatarCm(valor) {
  return valor ? `${Number(valor).toFixed(1)} cm` : "-";
}

function formatarPercentual(valor) {
  return valor !== "" ? `${Number(valor).toFixed(1)}%` : "-";
}

function formatarStatus(status) {
  const mapa = {
    inicial: "Inicial",
    acompanhamento: "Acompanhamento",
    retorno: "Retorno",
    final: "Final",
  };
  return mapa[status] || "Inicial";
}

function formatarEscala(valor) {
  return valor ? `${valor}/5` : "-";
}

const conteudo = {
  padding: "30px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
};

const listaCard = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "22px",
};

const listaTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const tituloPagina = { fontSize: "30px", letterSpacing: 0 };
const resumoLista = { color: "#6b7280", fontSize: "14px", marginTop: "6px" };

const filtros = {
  display: "grid",
  gridTemplateColumns: "minmax(220px, 1fr) minmax(180px, 240px)",
  gap: "10px",
};

const campo = {
  width: "100%",
  minHeight: "42px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "9px 11px",
  background: "white",
  color: "#111827",
  outline: "none",
};

const tabela = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  borderRadius: "8px",
  overflow: "hidden",
};

const linhaCabecalho = { background: "#111827", color: "white" };
const tabelaHeader = { padding: "12px", textAlign: "left", fontSize: "13px" };
const tabelaCelula = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
};
const estadoVazio = { ...tabelaCelula, color: "#6b7280", textAlign: "center" };
const acoes = { display: "flex", gap: "8px", flexWrap: "wrap" };

const botaoPrimario = {
  background: "#111827",
  color: "white",
  border: "none",
  padding: "11px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const botaoExcluir = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const erroBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "700",
  marginTop: "16px",
  padding: "12px",
};

const detalhesCard = {
  marginTop: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
};

const detalhesTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "18px",
};

const detalhesTitulo = { margin: 0, fontSize: "22px" };

const perfilGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
  marginBottom: "18px",
};

const detalhesGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(280px, 1fr) minmax(260px, 0.8fr)",
  gap: "16px",
  marginTop: "18px",
};

const painel = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "18px",
};

const painelTitulo = { margin: "0 0 14px", fontSize: "18px" };
const subtituloSecao = { margin: "22px 0 14px", fontSize: "18px" };

const alertasGrid = {
  display: "grid",
  gap: "10px",
  marginBottom: "18px",
};

const alertaCard = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "700",
  padding: "12px",
};

const graficosGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const graficoCard = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
};

const grafico = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(48px, 1fr))",
  gap: "10px",
  minHeight: "170px",
  alignItems: "end",
};

const barraItem = {
  display: "grid",
  gridTemplateRows: "auto 100px auto",
  gap: "7px",
  textAlign: "center",
};

const barraValor = { color: "#374151", fontSize: "11px", fontWeight: "700" };
const barraTrilho = {
  display: "flex",
  alignItems: "end",
  background: "#eef2f7",
  borderRadius: "8px",
  overflow: "hidden",
};
const barra = { width: "100%", background: "#2563eb", borderRadius: "8px 8px 0 0" };
const barraLabel = { color: "#6b7280", fontSize: "11px" };

const relatorio = {
  marginTop: "22px",
  borderTop: "1px solid #e5e7eb",
  paddingTop: "18px",
};

const relatorioGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const infoItem = {
  border: "1px solid #eef2f7",
  borderRadius: "8px",
  padding: "12px",
  background: "#f9fafb",
  marginBottom: "10px",
};

const infoLabel = {
  display: "block",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "700",
  marginBottom: "4px",
  textTransform: "uppercase",
};

const infoValor = { color: "#111827", fontSize: "14px" };

export default Avaliacoes;
