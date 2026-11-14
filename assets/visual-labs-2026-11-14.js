/* Motion-graphics laboratories for the 14 Nov 2026 editorial update.
   Conceptual simulations only: no model inference and no experimental reproduction. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const css=make("style");css.textContent=`
.hf-lab{display:grid;grid-template-columns:minmax(250px,.8fr) minmax(360px,1.2fr);gap:16px;width:100%;grid-column:1/-1}
.hf-panel{border:1px solid #293c57;background:#111f34;border-radius:18px;padding:20px;min-width:0}
.hf-panel h3{margin:0 0 10px}.hf-controls{display:grid;gap:13px}.hf-controls label{display:grid;gap:7px;color:#bdd0e7;font-size:13px}
.hf-controls select{width:100%;padding:10px;border-radius:10px;background:#0b172a;color:#fff;border:1px solid #425571}
.hf-buttons{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}.hf-buttons button{border:1px solid #4c718c;background:#18445e;color:#eef8ff;border-radius:10px;padding:9px 12px}
.hf-stage{position:relative;min-height:280px;border:1px solid #35516e;border-radius:16px;background:radial-gradient(circle at 50% 40%,#163653,#091629 68%);overflow:hidden;padding:18px}
.hf-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;align-items:center;min-height:150px}
.hf-node{position:relative;border:1px solid #486681;background:#142a42;border-radius:14px;padding:14px 8px;text-align:center;color:#c7d9ec;transition:.35s transform,.35s border-color,.35s box-shadow,.35s background}
.hf-node::after{content:"→";position:absolute;right:-16px;top:39%;color:#5bd9c5;font-size:20px}.hf-node:last-child::after{content:""}
.hf-node.active{transform:translateY(-8px) scale(1.03);border-color:#75eed8;background:#1a4b59;box-shadow:0 0 24px #49d9c555}
.hf-node.done{border-color:#6fa4c2}.hf-cases{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:14px 0}
.hf-case{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;border:1px solid #5c728a;background:#23364c;transition:.3s}
.hf-case.ok{background:#1f685e;border-color:#6be1c8}.hf-case.bad{background:#703f4d;border-color:#ee9ca9}
.hf-timeline{display:flex;gap:6px;margin:14px 0}.hf-step{height:5px;flex:1;border-radius:9px;background:#31465e}.hf-step.on{background:#5bd9c5}
.hf-result{border-left:4px solid #5bd9c5;background:#0b3040;padding:12px 14px;border-radius:10px;line-height:1.55;min-height:66px}
.hf-warning{font-size:12px;color:#a9bdd2;line-height:1.5;margin:12px 0 0}.hf-pulse{animation:hfPulse 1s ease-in-out infinite alternate}
@keyframes hfPulse{to{filter:brightness(1.35);transform:scale(1.05)}}@media(max-width:800px){.hf-lab{grid-template-columns:1fr}.hf-flow{grid-template-columns:1fr 1fr}.hf-node::after{content:""}.hf-stage{min-height:330px}}
`;document.head.append(css);
function button(text,fn){const b=make("button","",text);b.type="button";b.addEventListener("click",fn);return b}
function build(id,title,intro){const host=$(id);if(!host)return null;host.replaceChildren();const root=make("div","hf-lab"),left=make("section","hf-panel"),right=make("section","hf-panel");left.append(make("h3","",title),make("p","muted",intro));right.append(make("h3","","Escena explicativa"));root.append(left,right);host.append(root);return{left,right}}
function player(steps,draw){let at=0,timer=null;const render=()=>draw(at);return{play(){this.pause();render();timer=setInterval(()=>{if(at>=steps-1){this.pause();return}at++;render()},850)},pause(){if(timer)clearInterval(timer);timer=null},next(){this.pause();at=Math.min(steps-1,at+1);render()},reset(){this.pause();at=0;render()},render,get index(){return at}}}
function stage(panel,labels){const box=make("div","hf-stage"),flow=make("div","hf-flow"),nodes=labels.map(x=>make("div","hf-node",x));nodes.forEach(n=>flow.append(n));const cases=make("div","hf-cases"),timeline=make("div","hf-timeline"),bars=labels.map(()=>make("span","hf-step"));bars.forEach(x=>timeline.append(x));const result=make("div","hf-result","Formula una predicción y reproduce la secuencia.");result.setAttribute("aria-live","polite");box.append(flow,cases,timeline,result);panel.append(box);return{box,nodes,cases,bars,result}}
function activate(scene,step){scene.nodes.forEach((n,i)=>{n.classList.toggle("active",i===step);n.classList.toggle("done",i<step)});scene.bars.forEach((b,i)=>b.classList.toggle("on",i<=step))}

const ce=build("codeexplain","🧩 Código como explicación","Predice si una regla ejecutable seguirá representando al LLM cuando cambien las entradas.");
if(ce){const controls=make("div","hf-controls"),task=make("select"),prediction=make("select");
 [["simple","Patrón estructurado"],["complex","Lenguaje ambiguo"]].forEach(([v,t])=>{const o=make("option","",t);o.value=v;task.append(o)});
 [["pass","La explicación generalizará"],["fail","La explicación fallará en varios casos"]].forEach(([v,t])=>{const o=make("option","",t);o.value=v;prediction.append(o)});
 const l1=make("label","","Escenario conceptual");l1.append(task);const l2=make("label","","Tu predicción");l2.append(prediction);const actions=make("div","hf-buttons");controls.append(l1,l2,actions);ce.left.append(controls);
 const sc=stage(ce.right,["1 · Observar al LLM","2 · Proponer programa","3 · Ejecutar casos nuevos","4 · Comparar salidas"]);
 ce.right.append(make("p","hf-warning","Simulación conceptual: los seis casos y sus coincidencias son sintéticos. No se ejecuta un LLM ni se reproducen las tasas del artículo."));
 const steps=4;let p;
 function draw(i){activate(sc,i);sc.cases.replaceChildren();if(i<2){sc.result.textContent=i===0?"Se recopilan pares de entrada y salida del modelo sobre una tarea.":"Una explicación candidata se expresa como programa: ya puede ejecutarse, no solo leerse.";return}
 const pattern=task.value==="simple"?[1,1,1,1,1,0]:[1,0,1,0,0,1];pattern.forEach((ok,j)=>{const c=make("span","hf-case "+(i===3?(ok?"ok":"bad"):""),i===3?(ok?"✓":"×"):String(j+1));sc.cases.append(c)});
 if(i===2){sc.result.textContent="El programa procesa seis entradas nuevas. Antes de revelar el resultado, compara con tu predicción.";return}
 const matches=pattern.reduce((a,b)=>a+b,0),expected=prediction.value==="pass",actual=matches>=5;sc.result.textContent="Coincide en "+matches+" de 6 casos sintéticos. "+(expected===actual?"Tu predicción encaja con este escenario. ":"Tu predicción no encaja con este escenario. ")+(task.value==="simple"?"Una regla compacta puede generalizar en un patrón estable.":"La ambigüedad expone reglas rígidas: consistencia observable no equivale a explicación causal.");}
 p=player(steps,draw);actions.append(button("▶ Reproducir",()=>p.play()),button("⏸ Pausar",()=>p.pause()),button("⏭ Avanzar",()=>p.next()),button("↺ Reiniciar",()=>p.reset()));task.addEventListener("change",()=>p.reset());prediction.addEventListener("change",()=>p.reset());p.render();
}

const gs=build("guardscope","🛡️ Cobertura real del control","Elige una topología y una ruta de acción; predice si el control la comprueba, la deja pasar o la impide.");
if(gs){const controls=make("div","hf-controls"),topology=make("select"),path=make("select"),prediction=make("select");
 [["gateway","Gateway HTTP"],["kernel","Control con hooks de kernel"]].forEach(([v,t])=>{const o=make("option","",t);o.value=v;topology.append(o)});
 [["http","Llamada HTTP de herramienta"],["process","Creación de subproceso"],["udp","Envío UDP directo"]].forEach(([v,t])=>{const o=make("option","",t);o.value=v;path.append(o)});
 [["checked","Comprobada"],["bypassed","Eludida"],["prevented","Impedida"]].forEach(([v,t])=>{const o=make("option","",t);o.value=v;prediction.append(o)});
 for(const [text,sel] of [["Topología",topology],["Ruta de acción",path],["Tu predicción",prediction]]){const l=make("label","",text);l.append(sel);controls.append(l)}
 const actions=make("div","hf-buttons");controls.append(actions);gs.left.append(controls);
 const sc=stage(gs.right,["1 · Agente actúa","2 · Punto de control","3 · Kernel observa","4 · Reconciliar evidencia"]);
 gs.right.append(make("p","hf-warning","Simulación conceptual basada en rutas destacadas por el artículo. No ejecuta guardscope, eBPF ni productos reales; no representa una matriz completa de cobertura."));
 const outcome=()=>{if(topology.value==="gateway")return path.value==="http"?"checked":"bypassed";if(path.value==="process")return"prevented";return"bypassed"};
 let p;function draw(i){activate(sc,i);sc.cases.replaceChildren();const token=make("span","hf-case hf-pulse",path.value==="http"?"↗":path.value==="process"?"⚙":"◉");sc.cases.append(token);
 const label={checked:"comprobada",bypassed:"eludida",prevented:"impedida"};if(i===0)sc.result.textContent="El agente intenta ejecutar la ruta seleccionada.";else if(i===1)sc.result.textContent="El punto de control solo puede evaluar lo que atraviesa sus hooks o su posición.";else if(i===2)sc.result.textContent="La observación del kernel registra el efecto real, aunque el control no lo haya visto.";else{const out=outcome();sc.result.textContent="Resultado conceptual: acción "+label[out]+". "+(prediction.value===out?"Tu predicción coincide. ":"Tu predicción no coincide. ")+(out==="bypassed"?"La acción produce efecto fuera del punto de control.":out==="prevented"?"Un hook del escenario detiene la acción al ejecutarse.":"La acción cruza el control y queda registrada.")}}
 p=player(4,draw);actions.append(button("▶ Reproducir",()=>p.play()),button("⏸ Pausar",()=>p.pause()),button("⏭ Avanzar",()=>p.next()),button("↺ Reiniciar",()=>p.reset()));[topology,path,prediction].forEach(x=>x.addEventListener("change",()=>p.reset()));p.render();
}
})();
