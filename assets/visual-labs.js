/* Visual labs v1 — conceptual demonstrations, not experimental replications. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const css=document.createElement("style");
css.textContent=`.viz-board{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin:16px 0;max-width:550px}.viz-cell{aspect-ratio:1;display:grid;place-items:center;background:#1b3049;border:1px solid #38516c;border-radius:9px;font-size:clamp(15px,2.6vw,25px);position:relative}.viz-cell.wall{background:#394354}.viz-cell.hazard{background:#593a42}.viz-cell.trail{background:#205c5e;border-color:#50ddc3}.viz-cell.agent{outline:2px solid #fff0a8}.viz-cell.goal{background:#294e40}.viz-controls{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.viz-controls button{background:#1b4965;border:1px solid #6b94a9;color:white;border-radius:9px;padding:9px 12px}.viz-note{border-left:3px solid #5bd9c5;padding:10px 13px;background:#152a40;line-height:1.55}.viz-legend{font-size:13px;color:#abc3da;line-height:1.5}.viz-timeline{display:flex;gap:5px;flex-wrap:wrap;margin:12px 0}.viz-chip{border:1px solid #425a74;border-radius:8px;padding:6px 9px;font-size:12px}.viz-chip.on{background:#235d5b;border-color:#67d8c6}.viz-chip.stop{background:#693f4a;border-color:#e9949b}`;
document.head.append(css);
function button(label,fn){const b=document.createElement("button");b.textContent=label;b.type="button";b.addEventListener("click",fn);return b}
function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
function setup(id,heading){const host=$(id);if(!host)return null;const panel=host.querySelectorAll(".panel")[1];const wrap=node("div");wrap.className="viz-extension";wrap.append(node("h3","",heading));panel.append(wrap);return wrap}
function grid(wrap){const g=node("div","viz-board");g.setAttribute("role","img");wrap.append(g);return g}
function controls(wrap){const c=node("div","viz-controls");wrap.append(c);return c}
function note(wrap){const n=node("div","viz-note","Pulsa ejecutar para observar el experimento.");n.setAttribute("aria-live","polite");wrap.append(n);return n}
function timeline(wrap){const t=node("div","viz-timeline");wrap.append(t);return t}
function draw(g,rows,agent,visited,known){g.replaceChildren();for(let y=0;y<rows.length;y++)for(let x=0;x<rows[y].length;x++){const ch=rows[y][x],k=x+","+y;const c=node("div","viz-cell");if(ch==="#")c.classList.add("wall");if(ch==="!")c.classList.add("hazard");if(ch==="G")c.classList.add("goal");if(visited.has(k))c.classList.add("trail");if(known?.has(k))c.style.boxShadow="inset 0 0 0 2px #e0c574";if(agent&&agent[0]===x&&agent[1]===y){c.classList.add("agent");c.textContent="🤖"}else c.textContent=ch==="#"?"▩":ch==="!"?"⚡":ch==="G"?"🏁":"";c.title="Columna "+(x+1)+", fila "+(y+1)+(ch==="!"?", peligro":"");g.append(c)}}
function animator(){let handle=null;return{stop(){if(handle!==null)clearInterval(handle);handle=null},run(steps,callback,done){this.stop();let i=0;callback(steps[0],0);handle=setInterval(()=>{i++;if(i>=steps.length){clearInterval(handle);handle=null;done?.();return}callback(steps[i],i)},600)}}}
const safety=setup("safety","🎬 Escenario: llevar un vaso hasta la mesa");
if(safety){
 const rows=[".......","...!...",".#.!...","...!...",".......",".......","......G"];const g=grid(safety),c=controls(safety),t=timeline(safety),n=note(safety),anim=animator();
 const straight=[[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[4,3],[5,3],[6,3],[6,4],[6,5],[6,6]];
 const detour=[[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[6,5],[6,6]];
 let visited=new Set(),pos=[0,0];
 function redraw(){draw(g,rows,pos,visited)}
 function chips(active,blocked){t.replaceChildren();["1 · Intención","2 · Trayectoria","3 · Soltar"].forEach((x,i)=>{const b=node("span","viz-chip"+(i<=active?" on":"")+(blocked===i?" stop":""),x);t.append(b)})}
 function run(){anim.stop();visited=new Set();const bad=$("intent").value==="bad",unsafe=$("path").value==="danger",releaseBad=$("release").value==="danger";chips(0,bad?0:null);
 if(bad){pos=[0,0];redraw();n.textContent="⛔ Barrera 1: la intención dañina se rechaza antes de mover el robot. Observa que no recorre ninguna casilla.";return}
 const route=unsafe?detour:straight.filter(([x,y])=>rows[y][x]!=="!");chips(1,unsafe?1:null);
 n.textContent=unsafe?"⚠️ Barrera 2: la ruta directa atraviesa peligro eléctrico. Se bloquea y se usa un rodeo seguro predefinido.":"▶️ La ruta seleccionada no atraviesa los peligros representados.";
 anim.run(route,(p,i)=>{pos=p;visited.add(p.join(","));redraw();if(i===route.length-1){chips(2,releaseBad?2:null);n.textContent=releaseBad?"🛑 Barrera 3: se alcanza la meta, pero se bloquea la liberación insegura del vaso.":"✅ Se alcanza la meta y se autoriza soltar el vaso. La ruta visible es un ejemplo diseñado, no un planificador robótico real."}},()=>{});
 }
 c.append(button("▶ Ejecutar misión",run),button("↺ Reiniciar",()=>{anim.stop();visited=new Set();pos=[0,0];redraw();chips(-1,null);n.textContent="Selecciona intención, trayectoria y liberación. Predice qué barrera actuará antes de ejecutar."}));
 safety.append(node("p","viz-legend","🤖 Robot · ⚡ Peligro eléctrico · 🏁 Meta · Verde: trayectoria recorrida. Las rutas están predefinidas; no se ejecuta LEASH ni un modelo visual real."));
 $("runSafety").onclick=run;redraw();chips(-1,null);
}
const graph=setup("structrl","🧭 Exploración y memoria de rutas");
if(graph){
 const rows=[".......",".###.#.","...#...","##.#.#.",".......",".#####.","......G"],g=grid(graph),c=controls(graph),t=timeline(graph),n=note(graph),anim=animator();
 const route=[[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[5,2],[6,2],[6,3],[6,4],[6,5],[6,6]];
 const known=[route.slice(0,3),route.slice(0,7),route.slice(0,13),route.slice(0,13).concat([[5,4]])];
 let pos=[0,0],visited=new Set(),shown=new Set();
 function refresh(){draw(g,rows,pos,visited,shown)}
 function select(){anim.stop();visited=new Set();pos=[0,0];const nEdges=Number($("knownEdges").value);shown=new Set(known[nEdges-1].map(p=>p.join(",")));refresh();t.replaceChildren();t.append(node("span","viz-chip on",shown.size+" estados ilustrativos conocidos"));n.textContent=nEdges<3?"El agente ha explorado parte del camino, pero todavía no existe una ruta conocida completa hasta la meta. No debe inventarla.":"La memoria contiene una ruta observada completa hasta la meta. Puede aprovecharla para orientar una ejecución posterior."}
 function run(){select();const full=Number($("knownEdges").value)>=3,steps=full?route:known[Number($("knownEdges").value)-1];n.textContent=full?"▶️ Recorriendo la ruta almacenada en el grafo.":"🔎 Exploración parcial: el agente solo puede avanzar por estados ya registrados.";
 anim.run(steps,(p,i)=>{pos=p;visited.add(p.join(","));refresh();if(i===steps.length-1)n.textContent=full?"🏁 Meta alcanzada siguiendo una ruta conocida. No se está entrenando DQN ni SAC.":"⏸️ Se agotó la ruta observada: hace falta explorar más antes de propagar valor desde la meta."});
 }
 c.append(button("▶ Recorrer grafo",run),button("↺ Reiniciar",select));
 graph.append(node("p","viz-legend","Borde dorado: estado registrado · Verde: recorrido actual · ▩ Obstáculo · 🏁 Meta. Grafo simplificado diseñado para explicar cobertura y reutilización de experiencia, sin métricas experimentales."));
 $("knownEdges").addEventListener("change",select);$("runStructrl").onclick=run;select();
}
})();
