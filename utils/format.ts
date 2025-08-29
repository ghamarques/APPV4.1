export const currencyBR = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatBRL = (n: number) => currencyBR.format(Number.isFinite(n) ? n : 0);
/** Parse strings like "1.234,56" or "123456" (digits-only) into number 1234.56 */
export const parseBRL = (s: string): number => {
  if (!s) return 0;
  // Keep only digits
  const digits = s.replace(/\D/g, '');
  if (!digits) return 0;
  const intVal = parseInt(digits, 10);
  return intVal / 100;
};
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8).toUpperCase();
export const validadeAte = (dias: number) => {
  const d = new Date(); d.setDate(d.getDate() + (Number(dias) || 0)); 
  return d.toLocaleDateString('pt-BR');
};
export const genProposalNumber = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = d.getFullYear().toString().slice(2);
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PR-${y}${m}${day}-${rnd}`;
};
