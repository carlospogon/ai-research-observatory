const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const scripts=html.split('<script>').slice(1).map(x=>x.split('</script>')[0]).filter(Boolean);
assert(scripts.length>=2,'original application and atlas scripts');
for(const script of scripts)new vm.Script(script,{filename:'inline.js'});
const labs=[...html.matchAll(/<button[^>]+data-lab="([^"]+)"/g)].map(m=>m[1]);
assert.equal(labs.length,23,'23 lab buttons');assert.equal(new Set(labs).size,23,'unique lab ids');
for(const id of labs)assert(html.includes('id="'+id+'"'),'missing lab view '+id);
assert(html.includes('id="atlasCanvas"'),'atlas canvas');
assert(html.includes('id="atlasButtons"'),'atlas HTML nodes');
assert(html.includes('observatory:topic'),'topic event');
assert(html.includes('prefers-reduced-motion'),'reduced motion');
const registry=[...html.matchAll(/"labId":"([^"]+)"/g)].map(m=>m[1]);assert(registry.length>=16,'16 base registry mappings');
const data=JSON.parse(fs.readFileSync('data/papers.json','utf8'));
assert(Array.isArray(data)?data.length>=32:(Array.isArray(data.papers)&&data.papers.length>=32),'32 research papers');
for(const path of ['assets/visual-labs.js','assets/visual-labs-extended.js','assets/visual-labs-2026-11-14.js','assets/visual-labs-2026-11-15.js','assets/visual-labs-2026-11-16.js','assets/visual-labs-2026-11-17.js','assets/visual-labs-2026-11-18.js','assets/visual-labs-2026-11-19.js','assets/visual-labs-2026-11-20.js','assets/visual-labs-2026-11-21.js','assets/visual-labs-2026-11-22.js']){assert(fs.existsSync(path),path);new vm.Script(fs.readFileSync(path,'utf8'),{filename:path})}
const latest=fs.readFileSync('assets/visual-labs-2026-11-22.js','utf8');
for(const id of ['expertdrift','erwsc','oracleafa'])assert(latest.includes(id),'missing dynamic lab '+id);
for(const id of ['arxiv-2611-26440','arxiv-2611-26413','arxiv-2611-26598'])assert(latest.includes(id),'missing registry/quiz paper '+id);
assert(html.includes('assets/visual-labs-2026-11-22.js'),'latest visual module not loaded');
const quizIds=[...html.matchAll(/paperId":"([^"]+)"/g)].map(m=>m[1]);
for(const path of ['assets/visual-labs-2026-11-18.js','assets/visual-labs-2026-11-19.js','assets/visual-labs-2026-11-20.js','assets/visual-labs-2026-11-21.js','assets/visual-labs-2026-11-22.js']){
  const source=fs.readFileSync(path,'utf8');
  quizIds.push(...[...source.matchAll(/paperId:"([^"]+)"/g)].map(m=>m[1]));
}
assert.equal(quizIds.length,32,'32 quiz questions');assert.equal(new Set(quizIds).size,32,'one quiz question per paper');
assert(html.includes('qi=(qi+1)%qs.length'),'quiz navigation covers dynamic questions');
console.log('Static checks passed: inline syntax, 23 original + 16 dynamic labs, 32 papers/questions, registry/quiz markers, eleven scripts, atlas, accessibility markers');


