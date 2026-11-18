(() => {
  "use strict";
  const LABS = [
    ["latentfeedback", "Latent Feedback", "arxiv-2611-20404"],
    ["swecowork", "SWE-CoWork", "arxiv-2611-20218"],
    ["vira", "ViRA", "arxiv-2611-21605"]
  ];
  const labSection = document.getElementById("lab");
  const tabs = labSection?.querySelector(".tabs");
  if (!labSection || !tabs) return;

  const style = document.createElement("style");
  style.textContent = `.vl18{grid-column:1/-1}.vl18 .scene{min-height:340px;border:1px solid #31516e;border-radius:22px;background:radial-gradient(circle at 50% 30%,#173b52,#081525 72%);padding:18px;overflow:hidden}.vl18 svg{width:100%;height:235px}.vl18 text{fill:#eaf7ff;font:13px system-ui}.vl18 .controls{display:flex;gap:8px;flex-wrap:wrap;margin:13px 0}.vl18 button{border:1px solid #42647f;border-radius:10px;background:#142d49;color:#eef8ff;padding:9px 12px}.vl18 button:hover,.vl18 button:focus-visible{border-color:#65e5d0}.vl18 .timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:12px 0}.vl18 .tick{height:7px;border-radius:8px;background:#29425d}.vl18 .tick.on{background:#62e4ce;box-shadow:0 0 12px #62e4ce99}.vl18 .out{min-height:78px;border-left:4px solid #62e4ce;border-radius:9px;background:#0a2639;padding:14px;line-height:1.55}.vl18 .concept{font-size:12px;color:#f1ca7d;margin-top:10px}.vl18 .badge{display:inline-block;border-radius:99px;background:#17434a;color:#82f4df;padding:4px 9px;font-size:12px;font-weight:800}.vl18 .hot{filter:drop-shadow(0 0 8px #62e4ce)}.vl18 .dim{opacity:.22}.vl18 .move{transition:transform .45s ease,opacity .35s ease}.vl18 .form{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.vl18 label{color:#bfd0e3}.vl18 select{margin-top:6px}@media(max-width:680px){.vl18 .form{grid-template-columns:1fr}.vl18 svg{height:270px}.vl18 .scene{padding:12px}}@media(prefers-reduced-motion:reduce){.vl18 .move{transition:none}}`;
  document.head.append(style);

  for (const [id, label, paperId] of LABS) {
    if (!tabs.querySelector(`[data-lab="${id}"]`)) {
      const button = document.createElement("button");
      button.dataset.lab = id; button.textContent = label;
      button.onclick = () => {
        document.querySelectorAll("[data-lab]").forEach(x => x.classList.toggle("active", x === button));
        document.querySelectorAll(".labview").forEach(x => x.hidden = x.id !== id);
      };
      tabs.append(button);
    }
    if (!document.getElementById(id)) {
      const view = document.createElement("div");
      view.id = id; view.className = "lab labview"; view.hidden = true;
      labSection.append(view);
    }
    if (typeof researchRegistry === "object") researchRegistry[paperId] = {labId:id};
  }
  if (typeof updateLabCount === "function") updateLabCount();

  function shell(title, intro, scenarios, predictions, svg, texts) {
    return `<div class="panel vl18"><span class="badge">SIMULACIÓN CONCEPTUAL · NO REPRODUCE MÉTRICAS</span><h3>${title}</h3><p>${intro}</p><div class="form"><label>Escenario<select class="scenario">${scenarios.map((x,i)=>`<option value="${i}">${x}</option>`).join("")}</select></label><label>Tu predicción<select class="prediction">${predictions.map((x,i)=>`<option value="${i}">${x}</option>`).join("")}</select></label></div><div class="timeline">${texts.map(()=>'<i class="tick"></i>').join("")}</div><div class="scene">${svg}</div><div class="controls"><button data-act="prev">← Anterior</button><button data-act="play">▶ Reproducir</button><button data-act="pause">⏸ Pausar</button><button data-act="next">Siguiente →</button><button data-act="reset">↺ Reiniciar</button></div><div class="out" aria-live="polite"></div><div class="concept">Los cambios visuales explican la lógica del método; no son una ejecución del modelo ni una reconstrucción de los resultados del artículo.</div></div>`;
  }
  function drive(root, texts, render, verdict) {
    let step=0, timer=null;
    const scenario=root.querySelector(".scenario"), prediction=root.querySelector(".prediction"), out=root.querySelector(".out"), ticks=[...root.querySelectorAll(".tick")];
    const stop=()=>{if(timer){clearInterval(timer);timer=null}};
    const paint=()=>{ticks.forEach((x,i)=>x.classList.toggle("on",i<=step));render(step,+scenario.value);out.textContent=texts[step]+(step===texts.length-1?" "+verdict(+scenario.value,+prediction.value):"")};
    root.querySelector('[data-act="prev"]').onclick=()=>{stop();step=(step-1+texts.length)%texts.length;paint()};
    root.querySelector('[data-act="next"]').onclick=()=>{stop();step=(step+1)%texts.length;paint()};
    root.querySelector('[data-act="play"]').onclick=()=>{stop();timer=setInterval(()=>{step=(step+1)%texts.length;paint()},1150)};
    root.querySelector('[data-act="pause"]').onclick=stop;
    root.querySelector('[data-act="reset"]').onclick=()=>{stop();step=0;scenario.value="0";prediction.value="0";paint()};
    scenario.onchange=()=>{stop();step=0;paint()}; prediction.onchange=paint; paint();
  }

  const lf=document.getElementById("latentfeedback");
  const lfTexts=["Entrada: una secuencia se procesa token a token.","Transformer convencional: el token siguiente recibe su embedding y el contexto de atención.","Realimentación: el estado profundo anterior vuelve como una señal adicional.","Comparación conceptual: al repetir datos, la señal reutilizada puede aprovechar mejor el mismo presupuesto; no siempre gana."];
  lf.innerHTML=shell("Latent Feedback · reutilizar el estado profundo","Compara repetir un corpus con y sin trasladar el estado de la última capa al token siguiente.",["Corpus amplio · 2 épocas","Corpus pequeño · muchas repeticiones"],["La realimentación aprovechará mejor el cómputo","Repetir el Transformer será equivalente"],`<svg viewBox="0 0 780 235" role="img" aria-label="Tokens conectados por una ruta de realimentación latente"><defs><marker id="lfA" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0L0 6L7 3Z" fill="#62e4ce"/></marker></defs><g id="lfTokens">${[0,1,2,3,4].map(i=>`<rect x="${55+i*135}" y="145" width="94" height="55" rx="13" fill="#173451" stroke="#6b91b8"/><text x="${102+i*135}" y="178" text-anchor="middle">Token ${i+1}</text>`).join("")}</g><g id="lfStates" class="move">${[0,1,2,3].map(i=>`<circle cx="${102+i*135}" cy="70" r="24" fill="#154d52" stroke="#62e4ce"/><text x="${102+i*135}" y="75" text-anchor="middle">h${i+1}</text><path d="M${126+i*135} 70 C${170+i*135} 70 ${170+i*135} 145 ${190+i*135} 145" fill="none" stroke="#62e4ce" stroke-width="4" marker-end="url(#lfA)"/>`).join("")}</g><text id="lfLabel" x="390" y="25" text-anchor="middle"></text></svg>`,lfTexts);
  drive(lf,lfTexts,(s,mode)=>{lf.querySelector("#lfStates").classList.toggle("dim",s<2);lf.querySelector("#lfStates").classList.toggle("hot",s>=2);lf.querySelector("#lfLabel").textContent=s===3?(mode?"Régimen desfavorable: pocos datos únicos por parámetro":"Régimen favorable: más datos únicos y repetición"):""},(mode,pred)=>{const favorable=mode===0;return (pred===(favorable?0:1)?"Tu predicción coincide con la condición ilustrada.":"Tu predicción no coincide con la condición ilustrada.")+" El paper mide pérdida, no este dibujo."});

  const sw=document.getElementById("swecowork");
  const swTexts=["Encargo: el agente recibe una petición breve.","Descubrimiento: los requisitos están repartidos entre personas, documentos y tablero.","Implementación: algunas piezas se programan, pero quedan condiciones sin rastrear.","Entrega: las pruebas privadas distinguen un parche parcial de una tarea completa."];
  sw.innerHTML=shell("SWE-CoWork · del encargo a la entrega","Observa dónde puede romperse el trabajo cuando los requisitos no llegan en una especificación perfecta.",["Requisitos distribuidos","Especificación completa al inicio"],["La tarea quedará completa","Solo se completará parcialmente"],`<svg viewBox="0 0 780 235" role="img" aria-label="Flujo desde compañeros con requisitos hasta pruebas y entrega"><g id="swPeople">${[[85,55,"PM"],[85,125,"QA"],[85,195,"UX"]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="28" fill="#263c64" stroke="#9f91e8"/><text x="${p[0]}" y="${p[1]+5}" text-anchor="middle">${p[2]}</text>`).join("")}</g><path id="swGather" d="M115 55 C185 55 170 110 225 110M115 125L225 110M115 195C185 195 170 120 225 110" fill="none" stroke="#62e4ce" stroke-width="4"/><g class="move"><rect x="225" y="73" width="125" height="75" rx="16" fill="#173451" stroke="#6b91b8"/><text x="287" y="106" text-anchor="middle">Requisitos</text><text id="swReq" x="287" y="128" text-anchor="middle">3/6</text><rect x="410" y="73" width="125" height="75" rx="16" fill="#173451" stroke="#6b91b8"/><text x="472" y="106" text-anchor="middle">Código</text><text id="swCode" x="472" y="128" text-anchor="middle">parcial</text><rect x="595" y="73" width="125" height="75" rx="16" fill="#173451" stroke="#6b91b8"/><text x="657" y="106" text-anchor="middle">Tests</text><text id="swTests" x="657" y="128" text-anchor="middle">pendientes</text></g><path d="M350 110H410M535 110H595" stroke="#62e4ce" stroke-width="4"/></svg>`,swTexts);
  drive(sw,swTexts,(s,mode)=>{sw.querySelector("#swPeople").classList.toggle("dim",mode===1);sw.querySelector("#swGather").classList.toggle("dim",s<1||mode===1);sw.querySelector("#swReq").textContent=s<2?(mode?"6/6":"3/6"):(mode?"6/6":"5/6");sw.querySelector("#swCode").textContent=s<2?"—":(s===2?"parcial":"revisado");sw.querySelector("#swTests").textContent=s<3?"pendientes":(mode?"F2P mejora":"fallos ocultos")},(mode,pred)=>{const complete=false;return (pred===(complete?0:1)?"Tu predicción coincide con el resultado conceptual.":"El benchmark muestra que incluso con requisitos completos el éxito integral no aumentó.")+" Aprobar parte de los tests no equivale a entregar."});

  const vi=document.getElementById("vira");
  const viTexts=["Imagen amplia: el detalle decisivo ocupa una región diminuta.","Atajo: el contexto general permite una respuesta plausible sin mirar el detalle.","Contraste: la misma escena cambia solo en el objeto relevante y exige respuestas distintas.","Ejecución conceptual: el agente debe acercar la lupa y leer la evidencia para acertar todo el conjunto."];
  vi.innerHTML=shell("ViRA · obligar al agente a mirar","Cambia entre una sola imagen y un conjunto contrastivo; observa por qué el segundo reduce la recompensa de adivinar.",["Una imagen aislada","Conjunto contrastivo"],["El contexto bastará","Habrá que ampliar el detalle"],`<svg viewBox="0 0 780 235" role="img" aria-label="Fotografía amplia con detalle pequeño y lupa"><rect x="35" y="28" width="470" height="178" rx="18" fill="#15364a" stroke="#5d819f"/><path d="M35 160L145 90L245 155L330 75L505 170V206H35Z" fill="#24556a"/><rect id="viDetail" x="390" y="103" width="18" height="18" fill="#f2c66f" stroke="#fff"/><text id="viGlyph" x="399" y="117" text-anchor="middle" style="font-size:11px">A</text><circle id="viLens" class="move" cx="650" cy="105" r="68" fill="#0c2438" stroke="#62e4ce" stroke-width="5"/><line x1="698" y1="153" x2="745" y2="200" stroke="#62e4ce" stroke-width="13" stroke-linecap="round"/><text id="viRead" x="650" y="100" text-anchor="middle" style="font-size:30px">?</text><text x="650" y="128" text-anchor="middle">detalle ampliado</text><path id="viPath" d="M408 112 C505 80 555 85 582 98" fill="none" stroke="#62e4ce" stroke-width="3" stroke-dasharray="7 6"/></svg>`,viTexts);
  drive(vi,viTexts,(s,mode)=>{vi.querySelector("#viLens").classList.toggle("dim",s<3);vi.querySelector("#viPath").classList.toggle("dim",s<3);vi.querySelector("#viRead").textContent=s<3?"?":(mode?"B":"A");vi.querySelector("#viGlyph").textContent=mode?"B":"A";vi.querySelector("#viDetail").classList.toggle("hot",s>=2)},(mode,pred)=>{const needZoom=mode===1;return (pred===(needZoom?1:0)?"Tu predicción coincide con el escenario.":"Tu predicción no distingue el atajo contextual del conjunto contrastivo.")+" La visualización no reproduce el 63,3 % del paper."});

  if (typeof qs !== "undefined" && Array.isArray(qs)) {
    const add=[
      {paperId:"arxiv-2611-20404",labId:"latentfeedback",q:"¿Cuándo encontró el trabajo que la realimentación latente era menos ventajosa?",options:["Cuando había muy pocos datos únicos por parámetro","Siempre que se repetían datos","Solo al superar 100.000 millones de parámetros"],answer:0,explain:"La ventaja desaparece en el régimen de pocos datos únicos respecto al tamaño del modelo; no es una reducción universal de cómputo."},
      {paperId:"arxiv-2611-20218",labId:"swecowork",q:"¿Qué revela la diferencia entre aprobar cerca del 63 % de tests F2P y completar menos del 8 % de tareas?",options:["Que un parche parcial no equivale a cerrar todos los requisitos y la entrega","Que los tests privados son siempre incorrectos","Que descubrir requisitos deja de ser necesario"],answer:0,explain:"Los agentes pueden resolver partes del código y aun fallar en seguimiento de requisitos, verificación y cierre integral."},
      {paperId:"arxiv-2611-21605",labId:"vira",q:"¿Por qué CrossRPO recompensa resolver todas las versiones de un conjunto contrastivo?",options:["Para que adivinar por el contexto general deje de ser suficiente","Para reducir la resolución de las imágenes","Para enseñar una única respuesta fija"],answer:0,explain:"Las versiones comparten la escena pero cambian el detalle decisivo y la respuesta, por lo que el agente debe localizar evidencia."}
    ];
    for(const item of add) if(!qs.some(q=>q.paperId===item.paperId)) qs.push(item);
    if(typeof showQ==="function") showQ();
  }
})();
