export function parseFreeze(markdown) {
  const frozen = /congelad|freeze|homologad/i.test(markdown);
  return { frozen, status: frozen ? "Homologada e congelada" : "Nao congelada" };
}
