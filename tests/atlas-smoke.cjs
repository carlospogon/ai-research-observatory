const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const scripts=html.split('<script>').slice(1).map(x=>x.split('</script>')[0]).filter(Boolean);
assert(scripts.length>=2,'original application and atlas scripts');
for(const script of scripts)new vm.Script(script,{filename:'inline.js'});
const labs=[...html.matchAll(/<button[^>]+data-lab="([^"]+)"/g)].map(m=>m[1]);
assert.equal(labs.length,16,'16 original lab buttons');assert.equal(new Set(labs).size,16);
for(const id of labs)assert(html.includes('id="'+id+'"'),'missing lab view '+id);
assert(html.includes('id="atlasCanvas"'),'atlas canvas');
assert(html.includes('id="atlasButtons"'),'atlas HTML nodes');
assert(html.includes('observatory:topic'),'topic event');
assert(html.includes('prefers-reduced-motion'),'reduced motion');
const registry=[...html.matchAll(/"labId":"([^"]+)"/g)].map(m=>m[1]);assert(registry.length>=16,'16 registry mappings');
const data=JSON.parse(fs.readFileSync('data/papers.json','utf8'));
assert(Array.isArray(data)?data.length>=16:(Array.isArray(data.papers)&&data.papers.length>=16),'16 research papers');
for(const path of ['assets/visual-labs.js','assets/visual-labs-extended.js','assets/visual-labs-2026-11-14.js','assets/visual-labs-2026-11-15.js','assets/visual-labs-2026-11-16.js','assets/visual-labs-2026-11-17.js']){assert(fs.existsSync(path),path);new vm.Script(fs.readFileSync(path,'utf8'),{filename:path})}
console.log('Static checks passed: inline syntax, 16 lab IDs, registry, data, six original scripts, atlas, accessibility markers');
