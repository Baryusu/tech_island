(()=>{
const $=id=>document.getElementById(id),svg=$('e-scene');let scene='panic',panic=false,entered=false,fall=false,timer=null,remote='';
const info={panic:['Bedside Panic Button','Press the bedside panic button to sound a local alarm and show a LifeSmart App notification and caregiver help request.','BEDSIDE PANIC BUTTON'],bath:['Bathroom Safety','Click the bathroom door to enter. The human-presence sensor detects occupancy and starts an eight-minute timer. Test Fall fast-forwards eight minutes in one second.','BATHROOM SAFETY'],remote:['8-Button Room Remote','Control service requests, lighting, curtains, air conditioning and TV. Compatible voice assistants can support these functions.','ELDERLY CONVENIENCE']};
const rows=()=>scene==='panic'?[['Panic Button',panic?'PRESSED':'RELEASED','●',panic],['Local Alarm',panic?'ON':'OFF','♟',panic],['LifeSmart App',panic?'NOTIFICATION RECEIVED':'—','▣',panic],['Caregiver',panic?'HELP REQUESTED':'—','♧',panic]]:scene==='bath'?[['Bathroom Human Presence',entered?'DETECTED':'NOT DETECTED','◉',entered],['8-Minute Timer',fall?'8 MINUTES':entered?'STARTED':'NOT STARTED','◷',fall],['Local Alarm',fall?'ON':'OFF','♟',fall],['LifeSmart App',fall?'NOTIFICATION RECEIVED':'—','▣',fall],['Caregiver',fall?'NOTIFIED':'—','♧',fall]]:[['Room Remote',remote||'READY','▦',false],['Room Response',remote?'UPDATED':'STANDBY','⌂',false],['Voice Command','AVAILABLE*','◉',false],['LifeSmart Control','READY','◇',false]];
function setVisible(id,on){const el=$(id);if(el)el.setAttribute('opacity',on?'1':'0')}
function clearTimer(){if(timer!==null){clearTimeout(timer);timer=null}}
function paint(){const i=info[scene];$('try-me-label').setAttribute('opacity',scene==='panic'?'1':'0');$('care-heading').textContent=i[0];$('care-description').textContent=i[1];$('care-statuses').innerHTML=rows().map(([name,value,icon,on])=>`<div class="care-status"><span>${icon}</span><span class="name">${name}</span><span class="value ${on?'alert':''}">${value}</span><span class="dot ${on?'on':''}"></span></div>`).join('');$('panic-toggle').hidden=scene!=='panic';$('panic-toggle').textContent=panic?'Release Panic Button':'Press Panic Button';$('panic-toggle').setAttribute('aria-pressed',String(panic));$('door-hint').hidden=scene!=='bath'||entered;$('test-fall').hidden=scene!=='bath'||!entered||fall;$('exit-bath').hidden=scene!=='bath'||!entered;$('care-remote').hidden=scene!=='remote';setVisible('door-ring',scene==='bath'&&!entered);setVisible('alarm-box',scene==='panic'&&panic);setVisible('bath-box',scene==='bath'&&fall);setVisible('remote-box',scene==='remote');/* TV is permanently wall-mounted; screen state is handled by the remote controller. */$('panic-pulse').classList.toggle('active',scene==='panic'&&panic);$('presence').setAttribute('fill',scene==='bath'&&entered?'#dc9b49':'#73a88c');svg.classList.toggle('sleep',scene==='remote'&&remote==='Sleep');svg.classList.toggle('open-curtains',scene==='remote'&&remote==='Curtain Open');$('care-info').textContent=scene==='bath'?'Demonstration: a bathroom occupancy timer cannot detect an actual fall. Notifications and alarms require compatible equipment and configuration.':'This is a simulation. Actual LifeSmart App notifications depend on a configured system and connectivity.';}
function select(which){clearTimer();scene=which;panic=false;entered=false;fall=false;remote='';document.querySelectorAll('.care-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.scene===which));document.querySelectorAll('.care-remote-buttons button').forEach(b=>b.classList.remove('active'));paint()}
function togglePanic(){if(scene!=='panic')select('panic');panic=!panic;paint()}
function enter(){if(scene!=='bath')select('bath');entered=true;fall=false;paint()}
function testFall(){if(scene!=='bath'||!entered||fall)return;$('test-fall').disabled=true;timer=setTimeout(()=>{timer=null;fall=true;$('test-fall').disabled=false;paint()},1000)}
function exitBath(){clearTimer();entered=false;fall=false;paint()}
document.querySelectorAll('.care-tabs button').forEach(b=>b.addEventListener('click',()=>select(b.dataset.scene)));
document.querySelectorAll('.care-feature-row button').forEach(b=>b.addEventListener('click',()=>{select(b.dataset.jump);document.querySelector('.care-layout').scrollIntoView({behavior:'smooth',block:'nearest'})}));
$('panic-toggle').addEventListener('click',togglePanic);$('panic-svg-button').addEventListener('click',togglePanic);$('panic-svg-button').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();togglePanic()}});
$('bath-hit').addEventListener('click',enter);$('bath-hit').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enter()}});$('door-hint').addEventListener('click',enter);$('test-fall').addEventListener('click',testFall);$('exit-bath').addEventListener('click',exitBath);
['Call','Sleep','Day','Night','Curtain Open','Curtain Close','Aircon On/Off','TV On/Off'].forEach(name=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.addEventListener('click',()=>{remote=name;document.querySelectorAll('.care-remote-buttons button').forEach(x=>x.classList.toggle('active',x===b));paint()});$('care-remote-buttons').appendChild(b)});
select('panic');
})();

(()=>{
const $=id=>document.getElementById(id);
const names=['Call','Sleep','Day','Night','Curtain Open','Curtain Close','Aircon On/Off','TV On/Off'];
const labels=['CALL','SLEEP','DAY','NIGHT','OPEN','CLOSE','AC','TV'];
const overlay=$('room-remote-overlay'), keys=$('room-remote-keys'), status=$('care-statuses'), svg=$('e-scene');
let current={call:false,mode:'—',lights:'OFF',curtains:'CLOSED',ac:false,tv:false};
function reset(){current={call:false,mode:'—',lights:'OFF',curtains:'CLOSED',ac:false,tv:false};render();}
function render(){
 const rows=[
 ['Service Call',current.call?'HELP REQUESTED':'OFF'],
 ['Lighting Mode',current.mode],
 ['Room Lights',current.lights],
 ['Curtains',current.curtains],
 ['Air Conditioner',current.ac?'ON':'OFF'],
 ['Television',current.tv?'ON':'OFF'],
 ['Voice Commands','AVAILABLE*']
 ];
 status.innerHTML=rows.map(([n,v])=>`<div class="care-status"><span class="name">${n}</span><span class="value">${v}</span><span class="dot ${v==='ON'||v==='OPEN'||v==='HELP REQUESTED'?'on':''}"></span></div>`).join('');
 svg.classList.toggle('sleep',current.mode==='SLEEP');
 svg.classList.toggle('day-mode',current.mode==='DAY');
 svg.classList.toggle('night-mode',current.mode==='NIGHT');
 svg.classList.toggle('open-curtains',current.curtains==='OPEN');
 $('tv-screen').setAttribute('opacity',current.tv?'1':'0'); $('tv-power-led').setAttribute('fill',current.tv?'#74df96':'#788e80');
 $('bedroom-ac').classList.toggle('is-on',current.ac);
 $('ac-power-indicator').setAttribute('fill',current.ac?'#4bba80':'#a7b6a9');
 const acAirflow=$('ac-airflow'); if(acAirflow) acAirflow.setAttribute('opacity',current.ac?'1':'0');
 const picLabel=$('e-picture-label'); if(picLabel) picLabel.textContent='ROOM REMOTE · '+(current.mode==='—'?'Choose a button':current.mode);
 const headSub=overlay?overlay.querySelector('.room-remote-head span'):null; if(headSub) headSub.textContent=current.mode==='—'?'SELECT A BUTTON':current.mode;
}
function action(i){
 if(i===0)current.call=!current.call;
 if(i===1){current.mode='SLEEP';current.lights='OFF';current.curtains='CLOSED';}
 if(i===2){current.mode='DAY';current.lights='ESSENTIAL ON';}
 if(i===3){current.mode='NIGHT';current.lights='ALL LIGHTS ON';}
 if(i===4)current.curtains='OPEN';
 if(i===5)current.curtains='CLOSED';
 if(i===6)current.ac=!current.ac;
 if(i===7)current.tv=!current.tv;
 keys.querySelectorAll('button').forEach((b,j)=>b.classList.toggle('selected',j===i));
 document.querySelectorAll('#care-remote-buttons button').forEach((b,j)=>b.classList.toggle('active',j===i));
 render();
}
names.forEach((name,i)=>{
 const b=document.createElement('button');b.type='button';b.className='room-remote-key';b.innerHTML=`<span class="remote-symbol">${['♟','☾','☀','✦','◀','▶','❄','▣'][i]}</span><span>${labels[i]}</span>`;
 b.setAttribute('aria-label',name);b.addEventListener('click',()=>action(i));keys.appendChild(b);
});
// Override only remote-mode button actions by capturing clicks before legacy listener, preserving panic and bathroom.
$('care-remote-buttons').addEventListener('click',e=>{
 const button=e.target.closest('button');if(!button)return;
 const i=[...$('care-remote-buttons').children].indexOf(button);
 if(i<0)return;
 e.stopPropagation();e.stopImmediatePropagation();action(i);
},true);
function sync(){const remote=document.querySelector('.care-tabs button.active')?.dataset.scene==='remote';overlay.hidden=!remote;if(remote)render();}
document.querySelectorAll('.care-tabs button,.care-feature-row button').forEach(b=>b.addEventListener('click',()=>{reset();sync()}));
const observer=new MutationObserver(()=>sync());
observer.observe($('care-remote'),{attributes:true,attributeFilter:['hidden']});
reset();sync();
})();

(()=>{
const modal=document.getElementById('ti-lead-modal'),form=document.getElementById('ti-lead-form'),open=document.querySelector('[data-ti-want]');if(!modal||!form||!open)return;
const solution=document.body.dataset.tiSolution||document.title.split('|')[0].trim();document.getElementById('ti-lead-solution').textContent=solution;
const close=()=>{modal.hidden=true;open.focus()};open.addEventListener('click',()=>{modal.hidden=false;modal.querySelector('input').focus()});modal.querySelector('.ti-close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){const nodes=[...modal.querySelectorAll('button,input,textarea,select')].filter(n=>!n.hidden);if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus()}}});
let inquiry='';form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const clean=k=>String(d.get(k)||'').trim();inquiry=['TECHISLAND SPECIAL SOLUTION INQUIRY','Solution: '+solution,'Name: '+clean('fullName'),'Mobile: '+clean('phone'),'Email: '+clean('email'),'Location: '+clean('location'),'Project type: '+clean('projectType'),'Notes: '+clean('message')].join('\n');const subject='Techisland inquiry — '+solution;const uri='mailto:info@lifesmartph.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(inquiry);document.getElementById('ti-lead-copy').hidden=false;document.getElementById('ti-lead-feedback').textContent='Your email app should open a draft. Review it and press Send to contact Techisland.';window.location.href=uri;});
document.getElementById('ti-lead-copy').addEventListener('click',async()=>{if(!inquiry)return;try{await navigator.clipboard.writeText(inquiry);document.getElementById('ti-lead-feedback').textContent='Inquiry copied. Paste into an email to info@lifesmartph.com.'}catch{document.getElementById('ti-lead-feedback').textContent='Copy unavailable. Please use the prepared email draft.'}});
})();
