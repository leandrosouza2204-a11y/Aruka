import { formatarEscala } from "../hooks/useAvaliacoesPage";

function AnamneseResumoCard({ anamnese, styles, Info }) {
  return (
    <div style={styles.painel}>
      <h3 style={styles.painelTitulo}>Última anamnese</h3>
      {anamnese ? (
        <>
          <Info label="Objetivo principal" valor={anamnese.objetivoPrincipal} />
          <Info label="Dores ou lesões" valor={anamnese.doresLesoes} />
          <Info label="Sono" valor={formatarEscala(anamnese.escalaSono)} />
          <Info
            label="Estresse"
            valor={formatarEscala(anamnese.escalaEstresse)}
          />
          <Info
            label="Adesão rotina"
            valor={formatarEscala(anamnese.escalaAdesaoRotina)}
          />
        </>
      ) : (
        <p style={styles.resumoLista}>Nenhuma anamnese cadastrada.</p>
      )}
    </div>
  );
}

export default AnamneseResumoCard;
