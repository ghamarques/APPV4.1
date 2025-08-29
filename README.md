# App de Propostas – Carga & Agrícola (Vercel Ready v4)

Adições:
- ✅ **Máscara de moeda BRL** no preço unitário (campo editável): digite `123456` → vira `R$ 1.234,56` automaticamente, mantendo valor numérico correto.
- ✅ **Nº da Proposta** gerado automaticamente (ex.: `PR-250828-ABCD`), com possibilidade de edição. Mostrado no topo e no Preview. Também incluído na mensagem pronta.

Como rodar local:
```bash
npm install
npm run dev
# http://localhost:3000
```

Deploy (Vercel):
1) Suba esta pasta no GitHub.
2) Em https://vercel.com → **Add New… > Project** → importe o repo.
3) Mantenha configurações padrão (Next.js) → **Deploy**.

Testes rápidos:
```bash
npm run test
```
Cobre: formatação e parsing de BRL, validade e regressão do `join("\n")`.

Observações:
- CIF incluso (frete = 0).
- Sugestões com imagens em `/public/assets`.
- Campos completos: Emissor, Identificação (Nº da proposta), Cliente, Itens (com NCM), Condições, Resumo, Preview e Mensagem pronta.
