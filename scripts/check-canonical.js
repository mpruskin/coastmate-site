// Fails if any public page lacks exactly one canonical tag, or the tag does not match the page's own URL.
// Run: node scripts/check-canonical.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const host = fs.readFileSync(path.join(root, 'CNAME'), 'utf8').trim();
let bad = 0;
for (const f of fs.readdirSync(root).filter(n => n.endsWith('.html')).sort()) {
  const html = fs.readFileSync(path.join(root, f), 'utf8');
  const tags = [...html.matchAll(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi)].map(m => m[0]);
  const want = `https://${host}/` + (f === 'index.html' ? '' : f);
  let msg = null;
  if (tags.length !== 1) msg = `has ${tags.length} canonical tags, expected 1`;
  else {
    const h = (tags[0].match(/\bhref=["']([^"']*)["']/i) || [])[1];
    if (h !== want) msg = `canonical is ${h}, expected ${want}`;
  }
  if (msg) { bad++; console.error(`FAIL ${f}: ${msg}`); } else console.log(`ok   ${f} -> ${want}`);
}
process.exit(bad ? 1 : 0);
