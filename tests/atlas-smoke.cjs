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
assert(Array.isArray(data)?data.length>=25:(Array.isArray(data.papers)&&data.papers.length>=25),'25 research papers');
for(const path of ['assets/visual-labs.js','assets/visual-labs-extended.js','assets/visual-labs-2026-11-14.js','assets/visual-labs-2026-11-15.js','assets/visual-labs-2026-11-16.js','assets/visual-labs-2026-11-17.js','assets/visual-labs-2026-11-18.js','assets/visual-labs-2026-11-19.js','assets/visual-labs-2026-11-20.js']){assert(fs.existsSync(path),path);new vm.Script(fs.readFileSync(path,'utf8'),{filename:path})}
const latest=fs.readFileSync('assets/visual-labs-2026-11-20.js','utf8');
for(const id of ['progresssub','zsight','pipette'])assert(latest.includes('"'+id+'"'),'missing dynamic lab '+id);
for(const id of ['arxiv-2611-24844','arxiv-2611-24940','arxiv-2611-24362'])assert(latest.includes(id),'missing registry/quiz paper '+id);
assert(html.includes('assets/visual-labs-2026-11-20.js'),'latest visual module not loaded');
const quizIds=[...html.matchAll(/paperId":"([^"]+)"/g)].map(m=>m[1]);
for(const path of ['assets/visual-labs-2026-11-18.js','assets/visual-labs-2026-11-19.js','assets/visual-labs-2026-11-20.js']){
  const source=fs.readFileSync(path,'utf8');
  quizIds.push(...[...source.matchAll(/paperId:"([^"]+)"/g)].map(m=>m[1]));
}
assert.equal(quizIds.length,25,'25 quiz questions');assert.equal(new Set(quizIds).size,25,'one quiz question per paper');
assert(html.includes('qi=(qi+1)%qs.length'),'quiz navigation covers dynamic questions');
console.log('Static checks passed: inline syntax, 16 original + 9 dynamic labs, 25 papers/questions, registry/quiz markers, nine scripts, atlas, accessibility markers');
