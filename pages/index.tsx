import React, { useMemo, useState } from 'react';
import { Card, Field, Input, Select, Textarea } from '@/components/UI';
import CurrencyInput from '@/components/CurrencyInput';
import { formatBRL, uid, validadeAte, genProposalNumber } from '@/utils/format';

type Categoria = 'Carga' | 'Agrícola';
type AplicacaoCarga = 'Direcional' | 'Tração' | 'Mista' | 'Implemento';
type AplicacaoAgri = 'Dianteira' | 'Traseira' | 'Implemento';

type Item = {
  id: string;
  categoria: Categoria;
  medida: string;
  aplicacao: AplicacaoCarga | AplicacaoAgri | '';
  marca?: string;
  desenho?: string;
  ncm?: string;
  qtd: number;
  precoUnit: number;
  imagem?: string;
};

type Cliente = { nome: string; cnpj?: string; cidade?: string; uf?: string; contato?: string; };
type Condicoes = { pagamento: string; validadeDias: number; observacoes?: string; };
type Emissor = { empresa: string; cnpj: string; ie?: string; endereco?: string; logoUrl?: string; primary?: string; };

const SUGESTOES: Array<Partial<Item> & { title: string; img: string; }> = [
  { title: '295/80R22.5 • Tração', img: '/assets/truck.svg', categoria: 'Carga', medida: '295/80R22.5', aplicacao: 'Tração', marca: 'MarcaX', desenho: 'DX900' },
  { title: '275/80R22.5 • Direcional', img: '/assets/truck.svg', categoria: 'Carga', medida: '275/80R22.5', aplicacao: 'Direcional', marca: 'MarcaY', desenho: 'DY710' },
  { title: '18.4-38 • Traseira', img: '/assets/tractor.svg', categoria: 'Agrícola', medida: '18.4-38', aplicacao: 'Traseira', marca: 'MarcaA', desenho: 'AG200' },
  { title: '12.4-24 • Dianteira', img: '/assets/tractor.svg', categoria: 'Agrícola', medida: '12.4-24', aplicacao: 'Dianteira', marca: 'MarcaB', desenho: 'AG120' },
];

export default function Home() {
  const [numero, setNumero] = useState<string>(genProposalNumber());
  const [emissor, setEmissor] = useState<Emissor>({ empresa: '', cnpj: '', primary: '#0A2A66' });
  const [cliente, setCliente] = useState<Cliente>({ nome: '' });
  const [cond, setCond] = useState<Condicoes>({ pagamento: '', validadeDias: 7, observacoes: 'Frete CIF incluso nos preços informados.' });
  const [itens, setItens] = useState<Item[]>([
    { id: uid(), categoria: 'Carga', medida: '295/80R22.5', aplicacao: 'Tração', marca: '', desenho: '', ncm: '', qtd: 4, precoUnit: 0, imagem: '/assets/truck.svg' }
  ]);

  const addItem = (base?: Partial<Item>) => {
    setItens(prev => [...prev, { id: uid(), categoria: (base?.categoria as Categoria) || 'Carga', medida: base?.medida || '', aplicacao: (base?.aplicacao as any) || '', marca: base?.marca || '', desenho: base?.desenho || '', ncm: base?.ncm || '', qtd: 1, precoUnit: 0, imagem: base?.imagem || (base?.categoria === 'Agrícola' ? '/assets/tractor.svg' : '/assets/truck.svg') } ]);
  };
  const removeItem = (id: string) => setItens(prev => prev.filter(i => i.id !== id));
  const updateItem = (id: string, patch: Partial<Item>) => setItens(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));

  const totals = useMemo(() => {
    const produtos = itens.reduce((acc, i) => acc + (Number(i.qtd)||0) * (Number(i.precoUnit)||0), 0);
    return { produtos, servicos: 0, frete: 0, total: produtos };
  }, [itens]);

  const validadeData = useMemo(() => validadeAte(cond.validadeDias), [cond.validadeDias]);

  const gerarResumoIA = () => {
    const categorias = Array.from(new Set(itens.map(i => i.categoria))).join(' e ');
    const detalhe = itens.map(i => `${i.qtd}x ${i.medida}${i.aplicacao ? ` • ${i.aplicacao}` : ''}${i.marca ? ` • ${i.marca}` : ''}`).join('; ');
    return `Proposta técnica para pneus ${categorias || 'carga e agrícola'}, com preços CIF informados por item. Condições de pagamento: ${cond.pagamento || 'a definir'}. Validade: ${cond.validadeDias} dias (até ${validadeData}). ${detalhe ? 'Itens: ' + detalhe + '. ' : ''}Total: ${formatBRL(totals.total)}.`;
  };

  const gerarMensagemEnvio = () => {
    const assunto = `Proposta comercial – ${cliente.nome || 'Cliente'} – Total ${formatBRL(totals.total)} – Nº ${numero}`;
    const itensTxt = itens.map((i, idx) =>
      `${idx + 1}) ${i.qtd}x ${i.categoria} ${i.medida}${i.aplicacao ? ` • ${i.aplicacao}` : ''}${i.marca ? ` • ${i.marca}` : ''}${i.desenho ? ` • ${i.desenho}` : ''} — Unit: ${formatBRL(i.precoUnit)} | Sub: ${formatBRL((i.qtd||0) * (i.precoUnit||0))}${i.ncm ? ` | NCM ${i.ncm}` : ''}`
    ).join('\n');
    const corpo = `Ref.: Proposta Nº ${numero}\n\nOlá ${cliente.contato || ''},\n\nSegue nossa proposta comercial (preços CIF).\n\n${itensTxt}\n\nTotal: ${formatBRL(totals.total)}\nPagamento: ${cond.pagamento || 'a definir'}\nValidade: ${cond.validadeDias} dias (até ${validadeData})\n\n${cond.observacoes || ''}\n\n${emissor.empresa || ''}\nCNPJ: ${emissor.cnpj || ''}${emissor.ie ? ' | IE: ' + emissor.ie : ''}${emissor.endereco ? '\n' + emissor.endereco : ''}`.trim();
    return { assunto, corpo };
  };
  const { assunto, corpo } = gerarMensagemEnvio();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          {emissor.logoUrl ? (<img src={emissor.logoUrl} alt="Logo" className="h-9 w-auto rounded" />) : (<div className="h-9 w-9 rounded-xl grid place-items-center text-white font-bold" style={{ backgroundColor: emissor.primary || '#0A2A66' }}>PR</div>)}
          <div className="flex-1">
            <h1 className="text-slate-900 font-semibold leading-tight">App de Propostas – Carga & Agrícola</h1>
            <p className="text-xs text-slate-500">Layout técnico • Preços editáveis (máscara BRL) • Frete CIF incluso</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Nº {numero}</span>
            <button onClick={() => window.print()} className="px-3 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition" style={{ backgroundColor: emissor.primary || '#0A2A66' }}>Imprimir / PDF</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Identificação" subtitle="Numeração e dados de emissão">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Nº da Proposta">
                <Input value={numero} onChange={(e)=>setNumero(e.target.value)} />
              </Field>
              <Field label="Data de Emissão">
                <Input value={new Date().toLocaleDateString('pt-BR')} readOnly />
              </Field>
              <Field label="Válida até">
                <Input value={validadeData} readOnly />
              </Field>
            </div>
          </Card>

          <Card title="Emissor" subtitle="Dados da sua empresa para o cabeçalho e rodapé da proposta">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Empresa"><Input value={emissor.empresa} onChange={(e)=>setEmissor({ ...emissor, empresa: e.target.value })} placeholder="Sua Empresa de Pneus LTDA" /></Field>
              <Field label="CNPJ"><Input value={emissor.cnpj} onChange={(e)=>setEmissor({ ...emissor, cnpj: e.target.value })} placeholder="00.000.000/0001-00" /></Field>
              <Field label="Inscrição Estadual (opcional)"><Input value={emissor.ie || ''} onChange={(e)=>setEmissor({ ...emissor, ie: e.target.value })} placeholder="IE" /></Field>
              <Field label="Endereço (opcional)"><Input value={emissor.endereco || ''} onChange={(e)=>setEmissor({ ...emissor, endereco: e.target.value })} placeholder="Rua, nº, bairro, cidade/UF" /></Field>
              <Field label="Logo URL (opcional)"><Input value={emissor.logoUrl || ''} onChange={(e)=>setEmissor({ ...emissor, logoUrl: e.target.value })} placeholder="Cole o link da imagem do seu logo" /></Field>
              <Field label="Cor primária (hex)"><Input value={emissor.primary || '#0A2A66'} onChange={(e)=>setEmissor({ ...emissor, primary: e.target.value })} placeholder="#0A2A66" /></Field>
            </div>
          </Card>

          <Card title="Cliente" subtitle="Dados essenciais para a proposta">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Razão Social / Nome do Cliente"><Input value={cliente.nome} onChange={(e)=>setCliente({ ...cliente, nome: e.target.value })} placeholder="Transportadora Exemplo LTDA" /></Field>
              <Field label="CNPJ (opcional)"><Input value={cliente.cnpj || ''} onChange={(e)=>setCliente({ ...cliente, cnpj: e.target.value })} placeholder="00.000.000/0001-00" /></Field>
              <Field label="Cidade (opcional)"><Input value={cliente.cidade || ''} onChange={(e)=>setCliente({ ...cliente, cidade: e.target.value })} placeholder="Goiânia" /></Field>
              <Field label="UF (opcional)"><Input value={cliente.uf || ''} onChange={(e)=>setCliente({ ...cliente, uf: e.target.value })} placeholder="GO" /></Field>
              <Field label="Contato (opcional)"><Input value={cliente.contato || ''} onChange={(e)=>setCliente({ ...cliente, contato: e.target.value })} placeholder="Nome / Tel / E-mail" /></Field>
            </div>
          </Card>

          <Card title="Itens da Proposta" subtitle="Preços são inseridos manualmente por item (CIF incluso)">
            <div className="flex gap-2 mb-3 overflow-x-auto">
              {SUGESTOES.map((s, idx) => (
                <button key={idx} onClick={()=>addItem({ ...s, imagem: s.img })} className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left px-3 py-2 min-w-[220px] shadow-sm">
                  <img src={s.img} alt={s.title} className="w-full h-24 object-cover rounded-lg mb-2" />
                  <div className="text-sm font-medium text-slate-900">{s.title}</div>
                  <div className="text-xs text-slate-500">Adicionar item sugerido</div>
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600 border-b border-slate-200">
                    <th className="py-2 pr-3">Imagem</th>
                    <th className="py-2 pr-3">Categoria</th>
                    <th className="py-2 pr-3">Medida</th>
                    <th className="py-2 pr-3">Aplicação</th>
                    <th className="py-2 pr-3">Marca</th>
                    <th className="py-2 pr-3">Desenho</th>
                    <th className="py-2 pr-3">NCM</th>
                    <th className="py-2 pr-3 text-right">Qtd</th>
                    <th className="py-2 pr-3 text-right">Preço Unit.</th>
                    <th className="py-2 pr-3 text-right">Subtotal</th>
                    <th className="py-2 pr-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((it) => (
                    <tr key={it.id} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-3 w-[120px]"><img src={it.imagem || (it.categoria === 'Agrícola' ? '/assets/tractor.svg' : '/assets/truck.svg')} alt="img" className="w-[110px] h-16 object-cover rounded-lg" /></td>
                      <td className="py-2 pr-3 min-w-[120px]">
                        <Select value={it.categoria} onChange={(e)=>updateItem(it.id, { categoria: e.target.value as Categoria, aplicacao: '' })}>
                          <option value="Carga">Carga</option><option value="Agrícola">Agrícola</option>
                        </Select>
                      </td>
                      <td className="py-2 pr-3 min-w-[160px]"><Input value={it.medida} onChange={(e)=>updateItem(it.id, { medida: e.target.value })} placeholder="Ex.: 295/80R22.5" /></td>
                      <td className="py-2 pr-3 min-w-[160px]">
                        {it.categoria === 'Carga' ? (
                          <Select value={it.aplicacao} onChange={(e)=>updateItem(it.id, { aplicacao: e.target.value as AplicacaoCarga })}>
                            <option value="">Selecione</option><option value="Direcional">Direcional</option><option value="Tração">Tração</option><option value="Mista">Mista</option><option value="Implemento">Implemento</option>
                          </Select>
                        ) : (
                          <Select value={it.aplicacao} onChange={(e)=>updateItem(it.id, { aplicacao: e.target.value as AplicacaoAgri })}>
                            <option value="">Selecione</option><option value="Dianteira">Dianteira</option><option value="Traseira">Traseira</option><option value="Implemento">Implemento</option>
                          </Select>
                        )}
                      </td>
                      <td className="py-2 pr-3 min-w-[140px]"><Input value={it.marca || ''} onChange={(e)=>updateItem(it.id, { marca: e.target.value })} placeholder="(opcional)" /></td>
                      <td className="py-2 pr-3 min-w-[140px]"><Input value={it.desenho || ''} onChange={(e)=>updateItem(it.id, { desenho: e.target.value })} placeholder="(opcional)" /></td>
                      <td className="py-2 pr-3 min-w-[120px]"><Input value={it.ncm || ''} onChange={(e)=>updateItem(it.id, { ncm: e.target.value })} placeholder="(opcional)" /></td>
                      <td className="py-2 pr-3 min-w-[90px] text-right"><Input type="number" min={1} value={it.qtd} onChange={(e)=>updateItem(it.id, { qtd: Number(e.target.value) || 0 })} className="text-right" /></td>
                      <td className="py-2 pr-3 min-w-[160px] text-right">
                        <CurrencyInput value={it.precoUnit} onValueChange={(v)=>updateItem(it.id, { precoUnit: v })} />
                      </td>
                      <td className="py-2 pr-3 min-w-[140px] text-right text-slate-900 font-medium">{formatBRL((it.qtd||0) * (it.precoUnit||0))}</td>
                      <td className="py-2 pr-3 text-right"><button onClick={()=>removeItem(it.id)} className="text-slate-500 hover:text-red-600 text-sm">Remover</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3"><button onClick={()=>addItem()} className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">+ Adicionar item</button></div>
          </Card>

          <Card title="Condições Comerciais" subtitle="Defina pagamento, validade e observações">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Pagamento (texto)"><Input value={cond.pagamento} onChange={(e)=>setCond({ ...cond, pagamento: e.target.value })} placeholder="Ex.: 28DD / 14-28DD / 21-35-49DD" /></Field>
              <Field label="Validade (dias)"><Input type="number" min={1} value={cond.validadeDias} onChange={(e)=>setCond({ ...cond, validadeDias: Number(e.target.value) || 0 })} /></Field>
              <Field label="Validade até"><Input value={validadeData} readOnly /></Field>
            </div>
            <div className="mt-4"><Field label="Observações"><Textarea rows={3} value={cond.observacoes || ''} onChange={(e)=>setCond({ ...cond, observacoes: e.target.value })} /></Field></div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Resumo" subtitle="Totais e status">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-slate-600">Produtos</span><span className="font-medium text-slate-900">{formatBRL(totals.produtos)}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-slate-600">Serviços</span><span className="font-medium text-slate-900">{formatBRL(totals.servicos)}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-slate-600">Frete (CIF incluso)</span><span className="font-medium text-slate-900">{formatBRL(totals.frete)}</span></div>
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between"><span className="text-slate-900 font-semibold">Total</span><span className="font-bold text-lg" style={{ color: emissor.primary || '#0A2A66' }}>{formatBRL(totals.total)}</span></div>
            </div>
          </Card>

          <Card title="Resumo Executivo (IA – stub)"><p className="text-sm text-slate-700 leading-relaxed">{gerarResumoIA()}</p></Card>

          <Card title="Mensagem pronta (e-mail / WhatsApp)">
            <div className="space-y-2">
              <Field label="Assunto"><Input value={assunto} readOnly /></Field>
              <Field label="Mensagem"><Textarea rows={8} value={corpo} readOnly /></Field>
              <div className="flex gap-2">
                <button onClick={()=>navigator.clipboard.writeText(corpo)} className="px-3 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition" style={{ backgroundColor: emissor.primary || '#0A2A66' }}>Copiar mensagem</button>
                <button onClick={()=>navigator.clipboard.writeText(JSON.stringify({ numero, emissor, cliente, itens, cond, totals }, null, 2))} className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">Copiar JSON da Proposta</button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card title="Preview da Proposta (Imprimível)" subtitle="Formato simplificado; use Imprimir/PDF">
            <div className="bg-white ring-1 ring-slate-200 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-3">
                  {emissor.logoUrl ? (<img src={emissor.logoUrl} alt="Logo" className="h-10 w-auto" />) : (<div className="h-10 w-10 rounded-xl grid place-items-center text-white font-bold" style={{ backgroundColor: emissor.primary || '#0A2A66' }}>PR</div>)}
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{emissor.empresa || 'Sua Empresa'}</h2>
                    <p className="text-xs text-slate-600">CNPJ: {emissor.cnpj || '—'}{emissor.ie ? ` • IE: ${emissor.ie}` : ''}</p>
                    {emissor.endereco && <p className="text-xs text-slate-600">{emissor.endereco}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-semibold" style={{ backgroundColor: emissor.primary || '#0A2A66' }}>Proposta Comercial</div>
                  <p className="text-xs text-slate-600 mt-2">Nº {numero}</p>
                  <p className="text-sm text-slate-600">Emitida em {new Date().toLocaleDateString('pt-BR')} • Válida até {validadeData}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><div className="text-xs text-slate-500 uppercase">Cliente</div><div className="font-medium text-slate-900">{cliente.nome || '—'}</div></div>
                <div><div className="text-xs text-slate-500 uppercase">CNPJ</div><div className="text-slate-900">{cliente.cnpj || '—'}</div></div>
                <div><div className="text-xs text-slate-500 uppercase">Cidade/UF</div><div className="text-slate-900">{cliente.cidade || '—'}{cliente.uf ? ` / ${cliente.uf}` : ''}</div></div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600">
                      <th className="py-2 text-left">Categoria</th>
                      <th className="py-2 text-left">Medida</th>
                      <th className="py-2 text-left">Aplicação</th>
                      <th className="py-2 text-left">Marca</th>
                      <th className="py-2 text-left">Desenho</th>
                      <th className="py-2 text-left">NCM</th>
                      <th className="py-2 text-right">Qtd</th>
                      <th className="py-2 text-right">Preço Unit. (CIF)</th>
                      <th className="py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((i) => (
                      <tr key={i.id} className="border-b border-slate-100">
                        <td className="py-2">{i.categoria}</td>
                        <td className="py-2">{i.medida || '—'}</td>
                        <td className="py-2">{i.aplicacao || '—'}</td>
                        <td className="py-2">{i.marca || '—'}</td>
                        <td className="py-2">{i.desenho || '—'}</td>
                        <td className="py-2">{i.ncm || '—'}</td>
                        <td className="py-2 text-right">{i.qtd}</td>
                        <td className="py-2 text-right">{formatBRL(i.precoUnit)}</td>
                        <td className="py-2 text-right font-medium">{formatBRL((i.qtd||0) * (i.precoUnit||0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div><div className="text-xs text-slate-500 uppercase">Condições de Pagamento</div><div className="text-slate-900">{cond.pagamento || '—'}</div></div>
                  <div><div className="text-xs text-slate-500 uppercase">Observações</div><div className="text-slate-900 whitespace-pre-line">{cond.observacoes || '—'}</div></div>
                </div>
                <div className="md:justify-self-end md:text-right space-y-1">
                  <div className="text-slate-600">Produtos</div><div className="text-lg font-semibold text-slate-900">{formatBRL(totals.produtos)}</div>
                  <div className="text-slate-600">Serviços</div><div className="text-lg font-semibold text-slate-900">{formatBRL(totals.servicos)}</div>
                  <div className="text-slate-600">Frete (CIF incluso)</div><div className="text-lg font-semibold text-slate-900">{formatBRL(totals.frete)}</div>
                  <div className="border-t border-slate-200 pt-2 text-xl font-bold" style={{ color: emissor.primary || '#0A2A66' }}>{formatBRL(totals.total)}</div>
                </div>
              </div>

              <div className="mt-8 text-xs text-slate-500 leading-relaxed">
                <p>1) Preços informados pelo consultor por item, com frete CIF incluso. 2) Validade conforme destacado acima. 3) Entregas sujeitas a agendamento e disponibilidade. 4) Garantia de acordo com fabricante e condições de uso.</p>
                <p className="mt-1">Emissor: {emissor.empresa || '—'} • CNPJ: {emissor.cnpj || '—'}{emissor.ie ? ` • IE: ${emissor.ie}` : ''}{emissor.endereco ? ` • ${emissor.endereco}` : ''}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <footer className="py-10 text-center text-xs text-slate-500">Protótipo para validação interna. © {new Date().getFullYear()}</footer>
    </div>
  );
}
