export const currencyBR = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatBRL = (n) => currencyBR.format(Number.isFinite(n) ? n : 0);
export const parseBRL = (s) => {
  if (!s) return 0;
  const digits = s.replace(/\D/g, '');
  if (!digits) return 0;
  const intVal = parseInt(digits, 10);
  return intVal / 100;
};
export const validadeAte = (dias) => {
  const d = new Date(); d.setDate(d.getDate() + (Number(dias) || 0)); 
  return d.toLocaleDateString('pt-BR');
};
