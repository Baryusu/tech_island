(()=>{const $=id=>document.getElementById(id);if(!$('audio-arrive'))return;
const tracks=[['Morning Light','Ambient Collection'],['Golden Hour','Lounge Sessions'],['City Lights','Modern Jazz'],['Evening Calm','Chill Collection']];
let track=0,state='stopped';
function render(){
 const playing=state==='playing';
 $('audio-track').textContent=tracks[track][0];
 $('audio-artist').textContent=tracks[track][1]+' · '+(track+1)+' / 4';
 $('audio-count').textContent=(track+1)+' / 4';
 $('audio-indicator').textContent=state.toUpperCase();
 $('audio-status').textContent=state.toUpperCase();
 $('sonos-caption').textContent=playing?'ALL THREE ZONES · PLAYING':state==='paused'?'ALL THREE ZONES · PAUSED':'ALL ZONES · STANDBY';
 const art=document.querySelector('.audio-art');
 art.classList.toggle('playing',playing);art.classList.toggle('paused',state==='paused');
 for(const zone of ['living','dining','kitchen']){
  const el=$('audio-'+zone);el.textContent=state==='stopped'?'OFF':state.toUpperCase();el.classList.toggle('on',playing);
 }
 for(const id of ['play','pause','stop'])$('audio-'+id).classList.toggle('active',state===({play:'playing',pause:'paused',stop:'stopped'}[id]));
}
function play(){state='playing';render()}
$('audio-arrive').addEventListener('click',()=>{track=0;play()});
$('audio-play').addEventListener('click',play);
$('audio-pause').addEventListener('click',()=>{if(state!=='stopped'){state='paused';render()}});
$('audio-stop').addEventListener('click',()=>{state='stopped';render()});
$('audio-next').addEventListener('click',()=>{track=(track+1)%tracks.length;play()});
$('audio-prev').addEventListener('click',()=>{track=(track+tracks.length-1)%tracks.length;play()});
render();
})();

(()=>{
const modal=document.getElementById('ti-lead-modal'),form=document.getElementById('ti-lead-form'),open=document.querySelector('[data-ti-want]');if(!modal||!form||!open)return;
const solution=document.body.dataset.tiSolution||document.title.split('|')[0].trim();document.getElementById('ti-lead-solution').textContent=solution;
const close=()=>{modal.hidden=true;open.focus()};open.addEventListener('click',()=>{modal.hidden=false;modal.querySelector('input').focus()});modal.querySelector('.ti-close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){const nodes=[...modal.querySelectorAll('button,input,textarea,select')].filter(n=>!n.hidden);if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus()}}});
let inquiry='';form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const clean=k=>String(d.get(k)||'').trim();inquiry=['TECHISLAND SPECIAL SOLUTION INQUIRY','Solution: '+solution,'Name: '+clean('fullName'),'Mobile: '+clean('phone'),'Email: '+clean('email'),'Location: '+clean('location'),'Project type: '+clean('projectType'),'Notes: '+clean('message')].join('\n');const subject='Techisland inquiry — '+solution;const uri='mailto:info@lifesmartph.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(inquiry);document.getElementById('ti-lead-copy').hidden=false;document.getElementById('ti-lead-feedback').textContent='Your email app should open a draft. Review it and press Send to contact Techisland.';window.location.href=uri;});
document.getElementById('ti-lead-copy').addEventListener('click',async()=>{if(!inquiry)return;try{await navigator.clipboard.writeText(inquiry);document.getElementById('ti-lead-feedback').textContent='Inquiry copied. Paste into an email to info@lifesmartph.com.'}catch{document.getElementById('ti-lead-feedback').textContent='Copy unavailable. Please use the prepared email draft.'}});
})();
