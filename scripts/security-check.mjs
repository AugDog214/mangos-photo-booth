// Dependency-free checks of the published static files. No third-party requests.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages=['index.html',...readdirSync(root,{withFileTypes:true}).filter(d=>d.isDirectory()&&!d.name.startsWith('.')&&d.name!=='upload-api'&&existsSync(join(root,d.name,'index.html'))).map(d=>`${d.name}/index.html`)];
let bookingLinks=0;
for(const file of pages){
  const html=readFileSync(join(root,file),'utf8');
  assert.ok(html.includes('http-equiv="Content-Security-Policy"'),`${file}: missing CSP`);
  assert.ok(html.includes("base-uri 'self'; object-src 'none';"),`${file}: CSP baseline missing`);
  assert.ok(html.includes('name="referrer" content="strict-origin-when-cross-origin"'),`${file}: missing referrer policy`);
  for(const a of html.matchAll(/<a\b[^>]*>/gi)){
    const tag=a[0];if(/target="_blank"/.test(tag))assert.match(tag,/rel="[^"]*noopener/,`${file}: unsafe new tab link`);
    if(tag.includes('checkcherry.com/reservation')){assert.match(tag,/href="https:\/\//);bookingLinks++;}
    assert.doesNotMatch(tag,/href\s*=\s*["']\s*(?:javascript|data):/i);
  }
  assert.doesNotMatch(html,/<input[^>]*type=["']file/i,`${file}: uploads must stay disabled`);
  for(const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi))JSON.parse(match[1]);
}
assert.ok(bookingLinks>0);
const js=readFileSync(join(root,'js/main.js'),'utf8');
assert.doesNotMatch(js,/\b(?:eval|Function)\s*\(|\.innerHTML\s*=|document\.write\s*\(/);
console.log(`Verified ${pages.length} static pages, ${bookingLinks} HTTPS booking links, CSP/referrer metadata, JSON-LD, new-tab links and disabled uploads.`);
