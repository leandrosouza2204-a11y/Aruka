function ResumoItem({ label, valor, styles }) {
  return (
    <div style={styles.resumoItem}>
      <span style={styles.labelCampo}>{label}</span>
      <strong>{valor || "-"}</strong>
    </div>
  );
}

export default ResumoItem;
