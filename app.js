const KEY='ourLittleWorld_v2';
const $=id=>document.getElementById(id);
let data=load(), love=100, lastQuote=-1, heartTaps=0, authenticated=false;
const quotes=['Su tavimi net paprasta diena tampa gražiu prisiminimu. ❤️','Mano mėgstamiausia vieta yra ten, kur esi tu. 🫶','Dar viena diena kartu. Ir aš vis dar tavęs nepaleisčiau. 💗','Mes neprivalome turėti tobulo gyvenimo. Užtenka turėti vienas kitą. ✨','Kiekviena mūsų diena yra dar viena priežastis šypsotis. 🌷','Tu esi mano mėgstamiausias žmogus šiame pasaulyje. ❤️'];
const surprises=['Šiandien apkabink ją taip, lyg nebūtum matęs visą savaitę. 🫂','Pasakyk jai vieną dalyką, kurį joje labai mėgsti. ❤️','Nusiųsk jai seną jūsų nuotrauką ir parašyk: „Pameni šitą dieną?“ 📸','Šiandien padarykite vieną visiškai spontanišką dalyką. ✨','Parašyk jai dabar: „Aš labai džiaugiuosi, kad turiu tave.“ 🥹'];
const achievements=[
 {id:'first',icon:'💗',title:'First Tap',desc:'Pirmą kartą palietėte širdelę',test:s=>s.heartTaps>=1},
 {id:'10',icon:'🫶',title:'10 Hearts',desc:'10 bendrų širdelės paspaudimų',test:s=>s.heartTaps>=10},
 {id:'50',icon:'💞',title:'Heart Storm',desc:'50 bendrų širdelės paspaudimų',test:s=>s.heartTaps>=50},
 {id:'100days',icon:'🌷',title:'100 Days',desc:'Jūs kartu jau 100 dienų',test:s=>s.days>=100},
 {id:'year',icon:'🎂',title:'One Year',desc:'Jūsų pirmieji metai kartu',test:s=>s.days>=365},
 {id:'love100',icon:'❤️',title:'100% Love',desc:'Love Meter pasiekė 100%',test:s=>s.love>=100},
 {id:'song',icon:'🎵',title:'Our Song',desc:'Nustatyta jūsų daina',test:s=>!!s.songName},
 {id:'protected',icon:'🔐',title:'Private World',desc:'Įjungta poros PIN apsauga',test:s=>!!s.pin}
];
function load(){try{return JSON.parse(localStorage.getItem(KEY))||null}catch{return null}}
function persist(){localStorage.setItem(KEY,JSON.stringify(data))}
function save(){
 data={yourName:$('yourName').value.trim(),partnerName:$('partnerName').value.trim(),startDate:$('startDate').value,songName:$('songName').value.trim(),songUrl:$('songUrl').value.trim(),pin:$('pinInput').value.trim(),heartTaps:heartTaps};
 persist(); render(); burst();
}
function showSetup(){ $('setup').classList.remove('hidden'); $('home').classList.add('hidden'); $('nav').classList.add('hidden'); $('lock').classList.add('hidden'); }
function render(){
 if(!data){showSetup();return}
 heartTaps=Number(data.heartTaps||0);
 if(data.pin&&!authenticated){$('setup').classList.add('hidden');$('home').classList.add('hidden');$('nav').classList.add('hidden');$('lock').classList.remove('hidden');return}
 $('lock').classList.add('hidden');$('setup').classList.add('hidden');$('home').classList.remove('hidden');$('nav').classList.remove('hidden');
 $('greeting').textContent=`Labas, ${data.partnerName||'meile'} ❤️`;$('yi').textContent=(data.yourName||'?')[0].toUpperCase();$('pi').textContent=(data.partnerName||'?')[0].toUpperCase();
 $('songPreview').textContent=data.songName||'Dar nenustatyta';$('modalName').textContent=data.songName||'Our Song ❤️';
 const ok=/^https?:\/\//i.test(data.songUrl||'');$('songLink').classList.toggle('hidden',!ok);if(ok)$('songLink').href=data.songUrl;
 tick(); updateLove(); updateAchievements();
}
function tick(){if(!data?.startDate)return;const start=new Date(`${data.startDate}T00:00:00`),now=new Date();let diff=Math.max(0,now-start);const total=Math.floor(diff/1000),days=Math.floor(total/86400),hours=Math.floor(total%86400/3600),mins=Math.floor(total%3600/60),secs=total%60;$('days').textContent=days.toLocaleString('lt-LT');$('hours').textContent=String(hours).padStart(2,'0');$('mins').textContent=String(mins).padStart(2,'0');$('secs').textContent=String(secs).padStart(2,'0');const idx=days%quotes.length;if(idx!==lastQuote){lastQuote=idx;$('quote').textContent=quotes[idx]} updateAchievements(days);}
function updateLove(){ $('percent').textContent=love;$('fill').style.width=love+'%';$('tapCount').textContent=heartTaps;$('loveText').textContent=love<50?'Reikia daugiau apkabinimų. 🫂':love<75?'Meilė auga... 💗':love<100?'Jūs labai cute. 🥹':'Per daug meilės vienam ekranui 🥹'; }
function burst(){for(let i=0;i<16;i++){const p=document.createElement('div');p.className='particle';p.textContent=['❤️','💗','💕','✨'][Math.floor(Math.random()*4)];p.style.left=(35+Math.random()*30)+'%';p.style.top=(40+Math.random()*20)+'%';p.style.animationDelay=(Math.random()*.18)+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),1600)}}
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2300)}
function updateAchievements(days=null){
 const d=days??daysTogether();
 const state={heartTaps,love,songName:data?.songName, pin:data?.pin, days:d};
 const unlocked=achievements.filter(a=>a.test(state));
 $('achievementCount').textContent=`${unlocked.length}/${achievements.length}`;
 $('achievementGrid').innerHTML=achievements.map(a=>{const yes=a.test(state);return `<article class="achievement ${yes?'unlocked':''}"><div class="achIcon">${yes?a.icon:'🔒'}</div><div><b>${a.title}</b><p>${a.desc}</p></div></article>`}).join('');
}
function daysTogether(){if(!data?.startDate)return 0;return Math.max(0,Math.floor((Date.now()-new Date(`${data.startDate}T00:00:00`).getTime())/86400000))}
function openSong(){if(!data?.songName&&!data?.songUrl){toast('Pirmiausia nustatykite jūsų dainą 🎵');return} $('modal').classList.remove('hidden')}
function unlock(){
 const entered=$('pin').value.trim();
 if(!data?.pin)return;
 if(entered===data.pin){authenticated=true;$('pin').value='';render();burst();toast('Sveiki sugrįžę į jūsų pasaulį ❤️')}
 else { $('pin').value='';$('pin').classList.add('shake');setTimeout(()=>$('pin').classList.remove('shake'),400);toast('Neteisingas PIN 🔐') }
}
$('save').onclick=()=>{if(!$('yourName').value.trim()||!$('partnerName').value.trim()||!$('startDate').value)return toast('Užpildyk vardus ir datą ❤️');const p=$('pinInput').value.trim();if(p&&(!/^\\d{4,6}$/.test(p)))return toast('PIN turi būti 4–6 skaitmenų 🔐');save()};
$('settings').onclick=()=>{if(!data)return; $('yourName').value=data.yourName||'';$('partnerName').value=data.partnerName||'';$('startDate').value=data.startDate||'';$('songName').value=data.songName||'';$('songUrl').value=data.songUrl||'';$('pinInput').value=data.pin||'';showSetup()};
$('loveBtn').onclick=()=>{love=Math.min(100,love+1);heartTaps++;data.heartTaps=heartTaps;persist();updateLove();updateAchievements();burst();toast(love===100?'100% — jūs per cute 🥹':'LOVE +1 💗')};
$('heartQuick').onclick=()=>{love=Math.min(100,love+1);heartTaps++;data.heartTaps=heartTaps;persist();updateLove();updateAchievements();burst()};
$('openSong').onclick=openSong;$('songNav').onclick=openSong;$('close').onclick=()=>$('modal').classList.add('hidden');$('modal').querySelector('.backdrop').onclick=()=>$('modal').classList.add('hidden');
$('surprise').onclick=()=>{toast(surprises[Math.floor(Math.random()*surprises.length)]);burst()};$('loveNav').onclick=()=>document.querySelector('.love').scrollIntoView({behavior:'smooth',block:'center'});$('achNav').onclick=()=>document.querySelector('.achievements').scrollIntoView({behavior:'smooth',block:'center'});
$('unlock').onclick=unlock;$('pin').addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});
setInterval(()=>{if(authenticated)tick()},1000);if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));render();
