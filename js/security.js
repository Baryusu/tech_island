const details=["Armed", "Perimeter warning", "Access alarm", "Offline local alarm"];const names=["Armed", "Perimeter", "Breach", "Local"];const b=[...document.querySelectorAll(".tabs button")],st=[...document.querySelectorAll(".device span")];b.forEach((x,i)=>x.onclick=()=>{b.forEach((q,j)=>q.classList.toggle("active",i===j));document.querySelector(".visual").dataset.state=String(i);document.querySelector(".visual").dataset.state=String(i);document.getElementById("sceneTitle").textContent=names[i];document.getElementById("panelTitle").textContent=names[i];document.getElementById("sceneText").textContent=details[i];document.getElementById("panelText").textContent=details[i];st.forEach((q,j)=>q.textContent=j<=i+1?"ACTIVE":"STANDBY")});





(()=>{
const $=id=>document.getElementById(id);
const house=$('alarm-house');if(!house)return;
let armed=false,door=false,windowOpen=false,alarm=false,lastEvent='';
const stamp=()=>new Date().toLocaleString('en-PH',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
function render(){
 house.classList.toggle('door-open',door);
 house.classList.toggle('window-open',windowOpen);
 house.classList.toggle('alert',alarm);
 $('s61-arm').textContent=armed?'ARMED':'DISARMED';
 $('s61-ds').textContent=door?'OPEN':'CLOSED';
 $('s61-ws').textContent=windowOpen?'OPEN':'CLOSED';
 $('s61-siren').textContent=alarm?'ON · ALARM':'OFF';
 $('s61-app').textContent=alarm?'NOTIFICATION RECEIVED':'NO ALERT';
 $('s61-camera').textContent=alarm?'SNAPSHOT CAPTURED':'STANDBY';
 $('s61-title').textContent=alarm?'INTRUSION ALERT':armed?'Alarm armed · monitoring':'Disarmed · normal access';
 $('s61-caption').textContent=alarm?lastEvent+' — local alarm and exterior warning light ON':armed?'Open the door or window to test the armed alarm.':'Door and window may open without an alarm.';
 for(const id of ['s61-midnight','s61-manual']) $(id).classList.toggle('active',armed);
}
function disarm(){armed=false;alarm=false;$('s61-message').textContent='Alarm disarmed. No intrusion event.';$('s61-time').textContent='';render()}
function arm(source){armed=true;alarm=false;$('s61-message').textContent=source+' — monitoring doors and windows.';$('s61-time').textContent='';
 if(door||windowOpen)trigger(door?'Door':'Window');else render();}
function trigger(kind){if(!armed)return;alarm=true;lastEvent=kind+' opened';$('s61-message').textContent=kind.toUpperCase()+' OPENED WHILE ARMED — snapshot captured; simulated LifeSmart notification sent.';$('s61-time').textContent='Event timestamp: '+stamp();render()}
function toggleEntry(kind){if(kind==='Door'){door=!door;if(door)trigger('Door')}else{windowOpen=!windowOpen;if(windowOpen)trigger('Window')}render();}
$('s61-midnight').addEventListener('click',()=>arm('12:00 AM automatic arming'));
$('s61-manual').addEventListener('click',()=>armed?disarm():arm('LifeSmart App / Voice / Keyfob'));
$('s61-door').addEventListener('click',()=>toggleEntry('Door'));
$('s61-window').addEventListener('click',()=>toggleEntry('Window'));
for(const [id,kind] of [['door-leaf','Door'],['window-leaf','Window']]){const el=$(id);if(el){el.style.cursor='pointer';el.addEventListener('click',()=>toggleEntry(kind));}}
render();
})();

(()=>{
const modal=document.getElementById('ti-lead-modal'),form=document.getElementById('ti-lead-form'),open=document.querySelector('[data-ti-want]');if(!modal||!form||!open)return;
const solution=document.body.dataset.tiSolution||document.title.split('|')[0].trim();document.getElementById('ti-lead-solution').textContent=solution;
const close=()=>{modal.hidden=true;open.focus()};open.addEventListener('click',()=>{modal.hidden=false;modal.querySelector('input').focus()});modal.querySelector('.ti-close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){const nodes=[...modal.querySelectorAll('button,input,textarea,select')].filter(n=>!n.hidden);if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus()}}});
let inquiry='';form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const clean=k=>String(d.get(k)||'').trim();inquiry=['TECHISLAND SPECIAL SOLUTION INQUIRY','Solution: '+solution,'Name: '+clean('fullName'),'Mobile: '+clean('phone'),'Email: '+clean('email'),'Location: '+clean('location'),'Project type: '+clean('projectType'),'Notes: '+clean('message')].join('\n');const subject='Techisland inquiry — '+solution;const uri='mailto:info@lifesmartph.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(inquiry);document.getElementById('ti-lead-copy').hidden=false;document.getElementById('ti-lead-feedback').textContent='Your email app should open a draft. Review it and press Send to contact Techisland.';window.location.href=uri;});
document.getElementById('ti-lead-copy').addEventListener('click',async()=>{if(!inquiry)return;try{await navigator.clipboard.writeText(inquiry);document.getElementById('ti-lead-feedback').textContent='Inquiry copied. Paste into an email to info@lifesmartph.com.'}catch{document.getElementById('ti-lead-feedback').textContent='Copy unavailable. Please use the prepared email draft.'}});
})();
