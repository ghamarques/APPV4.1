import { formatBRL, parseBRL, validadeAte } from '../utils/format.test.mjs';

let fails = 0;
const assert = (cond, msg) => { if(!cond){ console.error('FAIL:', msg); fails++; } else { console.log('OK:', msg); } };

// Currency
assert(formatBRL(0).startsWith('R$'), 'formatBRL(0) starts with R$');
assert(formatBRL(NaN).includes('0'), 'formatBRL(NaN) -> 0');
assert(parseBRL('1.234,56') === 1234.56, 'parseBRL handles 1.234,56');
assert(parseBRL('123456') === 1234.56, 'parseBRL handles digits-only');
assert(parseBRL('') === 0, 'parseBRL empty -> 0');

// Validade
const today = new Date().toLocaleDateString('pt-BR');
const tomorrow = validadeAte(1);
assert(tomorrow !== today, 'validadeAte(1) != today');

// Newline join regression
const lines = ['a','b','c'];
const joined = lines.join('\n');
assert(joined.split('\n').length === 3, 'join("\\n") ok');

if(fails){ process.exit(1); } else { console.log('All tests passed'); }
