(()=>{
const scene=document.getElementById("pool43-scene");if(!scene)return;
const $=id=>document.getElementById(id);
const modes={relax:["Royal Blue · Slow breathing",0],party:["Violet · Fast pulse",110],romance:["Amber · Candle flicker",190],tropical:["Aqua · Moving waves",30],pride:["Red / Blue / Yellow",250],kids:["Rainbow cycle",300],off:["Off",0]};
const moodPalette={relax:["#4169e1","#4169e1","#4169e1"],party:["#df4aff","#55d6ff","#f36cc2"],romance:["#ffb44d","#ff8d38","#ffd072"],tropical:["#25e2d3","#48ec9a","#18bde9"],pride:["#ef3d48","#266bff","#ffd13c"],kids:["#ed4d72","#56e79b","#4b93ff"],off:["#4169e1","#4169e1","#4169e1"]};
let mode="relax",feature=false,lights=true,automation=false,finished=false,timer=null,elapsed=0;
const total=6000; // three scheduled hours demonstrated in six seconds
function stopTimer(){if(timer!==null){clearInterval(timer);timer=null;}}
function drawCycle(){
 const progress=Math.min(elapsed/total,1);
 $("p44-progress").style.width=(progress*100).toFixed(1)+"%";
 const minute=360+Math.round(progress*180);
 const hour=Math.floor(minute/60),mins=minute%60;
 $("p44-clock").textContent=(hour%12||12)+":"+String(mins).padStart(2,"0")+" AM";
 const running=automation&&!finished;
 scene.classList.toggle("filter-running",running);
 $("p44-pump").textContent=running?"ON":"OFF";
 $("p44-circulation").textContent=running?"CIRCULATING":"STOPPED";
 $("p44-phase").textContent=finished?"9:00 AM — Cycle complete. Filter pump stopped automatically.":running?"Water is drawn from the pool, filtered and returned.":"Press Filter Automation ON to watch the scheduled 3-hour cycle.";
}
function render(){
 scene.style.setProperty("--rgb",lights&&mode!=="off"?1:0);
 scene.style.setProperty("--falls",feature?1:0);
 scene.style.setProperty("--hue",modes[mode][1]+"deg");
 scene.dataset.mood=mode;
 scene.dataset.lights=(lights&&mode!=="off")?"on":"off";
 const palette=moodPalette[mode];
 const moodLights=scene.querySelector("#pool-mood-lights");
 if(moodLights){moodLights.style.setProperty("--light",palette[0]);moodLights.style.setProperty("--light2",palette[1]);moodLights.style.setProperty("--light3",palette[2]);}
 $("p43-waterfall").textContent=feature?"ON":"OFF";
 $("p43-color").textContent=lights?(mode==="relax"?"Royal Blue":modes[mode][0]):"Off";
 $("p43-schedule").textContent=automation?"Active · 6–9 AM":"6:00–9:00 AM";
 $("p43-title").textContent=mode[0].toUpperCase()+mode.slice(1);
 $("p43-detail").textContent=(feature?"Waterfall ON. ":"Waterfall OFF. ")+(lights&&mode!=="off"?modes[mode][0]+" underwater lights.":"Pool lighting OFF.");
 for(const [id,on] of [["p43-filter",automation],["p43-feature",feature],["p43-light",lights]]){
  const b=$(id);const active=id==="p43-light"?on&&mode!=="off":on;b.textContent=active?"ON":"OFF";b.setAttribute("aria-pressed",String(active));
 }
 document.querySelectorAll("#p43-modes button").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
 drawCycle();
}
$("p43-filter").addEventListener("click",()=>{
 stopTimer();
 automation=!automation;finished=false;elapsed=0;
 if(automation){
  const start=performance.now();
  timer=setInterval(()=>{
   elapsed=Math.min(performance.now()-start,total);
   if(elapsed>=total){stopTimer();finished=true;}
   drawCycle();
  },60);
 }
 render();
});
$("p43-feature").onclick=()=>{feature=!feature;render()};
$("p43-light").onclick=()=>{lights=!lights;if(lights)mode="relax";render()};
document.querySelectorAll("#p43-modes button").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;lights=mode!=="off";render()});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&timer!==null){stopTimer();automation=false;finished=false;elapsed=0;render();}});
render();
})();

(()=>{
const modal=document.getElementById('ti-lead-modal'),form=document.getElementById('ti-lead-form'),open=document.querySelector('[data-ti-want]');if(!modal||!form||!open)return;
const solution=document.body.dataset.tiSolution||document.title.split('|')[0].trim();document.getElementById('ti-lead-solution').textContent=solution;
const close=()=>{modal.hidden=true;open.focus()};open.addEventListener('click',()=>{modal.hidden=false;modal.querySelector('input').focus()});modal.querySelector('.ti-close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){const nodes=[...modal.querySelectorAll('button,input,textarea,select')].filter(n=>!n.hidden);if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus()}}});
let inquiry='';form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const clean=k=>String(d.get(k)||'').trim();inquiry=['TECHISLAND SPECIAL SOLUTION INQUIRY','Solution: '+solution,'Name: '+clean('fullName'),'Mobile: '+clean('phone'),'Email: '+clean('email'),'Location: '+clean('location'),'Project type: '+clean('projectType'),'Notes: '+clean('message')].join('\n');const subject='Techisland inquiry — '+solution;const uri='mailto:info@lifesmartph.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(inquiry);document.getElementById('ti-lead-copy').hidden=false;document.getElementById('ti-lead-feedback').textContent='Your email app should open a draft. Review it and press Send to contact Techisland.';window.location.href=uri;});
document.getElementById('ti-lead-copy').addEventListener('click',async()=>{if(!inquiry)return;try{await navigator.clipboard.writeText(inquiry);document.getElementById('ti-lead-feedback').textContent='Inquiry copied. Paste into an email to info@lifesmartph.com.'}catch{document.getElementById('ti-lead-feedback').textContent='Copy unavailable. Please use the prepared email draft.'}});
})();
