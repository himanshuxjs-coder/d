const modal=document.getElementById('envelopeModal');
const music=document.getElementById('bgMusic');
let musicStarted=false;
async function startMusic(){
 if(musicStarted)return;
 music.volume=.24;
 try{await music.play();musicStarted=true;}catch(error){/* Browsers require a user gesture before audible autoplay. */}
}
// Try immediately; if the browser blocks autoplay, begin on the visitor's first interaction.
startMusic();
const unlockMusic=()=>{startMusic();};
document.addEventListener('pointerdown',unlockMusic,{once:true});
document.addEventListener('keydown',unlockMusic,{once:true});

function openLetter(){modal.classList.add('open');modal.setAttribute('aria-hidden','false');burstPetals(28);}
document.getElementById('beginBtn').addEventListener('click',()=>{startMusic();openLetter();});
document.getElementById('closeModal').addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');});
document.getElementById('goLetter').addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.getElementById('letter').scrollIntoView({behavior:'smooth'});});
function burstPetals(count=24){
 const holder=document.getElementById('petals');
 for(let i=0;i<count;i++){const p=document.createElement('i');p.className='petal';p.style.left=Math.random()*100+'%';p.style.animationDuration=(5+Math.random()*6)+'s';p.style.animationDelay=(Math.random()*.8)+'s';p.style.transform=`rotate(${Math.random()*360}deg)`;holder.appendChild(p);setTimeout(()=>p.remove(),12000);}
}
const notes=[
 'You deserve days that feel soft, safe and full of possibility. ♡',
 'May you always find a reason to laugh, even on an ordinary day.',
 'Never forget how much there is to celebrate about being you. ✨',
 'May every new chapter bring you closer to the things you dream of.',
 'A little reminder: you are allowed to rest, grow and begin again.',
 'May kindness find you in the most unexpected places. 🌷'
];
let noteIndex=0;
document.getElementById('jarBtn').addEventListener('click',()=>{
 const msg=document.getElementById('jarMessage');
 msg.textContent=notes[noteIndex%notes.length];noteIndex++;burstPetals(12);
});
document.getElementById('giftBtn').addEventListener('click',e=>{
 const box=e.currentTarget;box.classList.toggle('opened');
 document.getElementById('giftMessage').textContent=box.classList.contains('opened')
 ?'Your gift: a wish that your heart stays hopeful, your smile stays yours, and beautiful things keep finding you. ♡'
 :'A little something wrapped in good wishes.';
 burstPetals(22);
});
document.getElementById('wishBtn').addEventListener('click',()=>{
 document.getElementById('wishResult').textContent='A thousand little lights, and a thousand lovely wishes for you, Queen. ♡';
 burstPetals(65);fireworks();
});
function fireworks(){
 const colors=['#f3d49a','#f0b9c9','#fff0c7','#d7b8ee'];
 for(let k=0;k<5;k++){setTimeout(()=>{
  const x=15+Math.random()*70,y=20+Math.random()*45;
  for(let i=0;i<18;i++){const s=document.createElement('i');s.className='sparkle';s.textContent='✦';s.style.left=`${x+Math.random()*12-6}%`;s.style.top=`${y+Math.random()*8-4}%`;s.style.color=colors[k%colors.length];s.style.fontSize=(10+Math.random()*15)+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),1000);}
 },k*180);}
}
const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightboxImg');
const lightboxClose=document.getElementById('lightboxClose');
let lastPhotoTrigger=null;
let lightboxTimer=null;
function openLightbox(trigger){
 const source=trigger.dataset.photo || trigger.querySelector('img')?.getAttribute('src');
 if(!source)return;
 lastPhotoTrigger=trigger;
 clearTimeout(lightboxTimer);
 lightboxImg.src=source;
 lightbox.classList.add('open');
 lightbox.setAttribute('aria-hidden','false');
 lightbox.removeAttribute('inert');
 document.body.classList.add('lightbox-open');
 requestAnimationFrame(()=>lightboxClose.focus());
}
// Make the complete photo tile clickable: image, empty image area, and caption area.
// Capture phase ensures decorative overlays or nested elements cannot swallow the click.
const photoGrid=document.querySelector('.photo-grid');
photoGrid?.addEventListener('click',event=>{
 const tile=event.target.closest('.photo');
 if(!tile || !photoGrid.contains(tile)) return;
 const trigger=tile.querySelector('.photo-open');
 const image=trigger?.querySelector('img') || tile.querySelector('img');
 const source=trigger?.dataset.photo || image?.currentSrc || image?.getAttribute('src');
 if(source){
  event.preventDefault();
  openLightbox({dataset:{photo:source},querySelector:()=>image});
 }
},true);
// Also support direct taps/clicks on the image itself in browsers with unusual hit-testing.
photoGrid?.querySelectorAll('.photo img').forEach(image=>{
 image.addEventListener('click',event=>{
  event.preventDefault();
  event.stopPropagation();
  const tile=image.closest('.photo');
  const trigger=tile?.querySelector('.photo-open');
  const source=trigger?.dataset.photo || image.currentSrc || image.getAttribute('src');
  if(source) openLightbox({dataset:{photo:source},querySelector:()=>image});
 });
});
function closeLightbox(){
 if(!lightbox.classList.contains('open'))return;
 lightbox.classList.remove('open');
 lightbox.setAttribute('aria-hidden','true');
 lightbox.setAttribute('inert','');
 document.body.classList.remove('lightbox-open');
 clearTimeout(lightboxTimer);
 lightboxTimer=window.setTimeout(()=>{if(!lightbox.classList.contains('open'))lightboxImg.removeAttribute('src');},450);
 if(lastPhotoTrigger)lastPhotoTrigger.focus();
}
lightboxClose.addEventListener('click',closeLightbox);
lightbox.addEventListener('click',event=>{if(event.target===lightbox)closeLightbox();});
lightboxImg.addEventListener('click',event=>event.stopPropagation());
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){
  closeLightbox();
  modal.classList.remove('open');modal.setAttribute('aria-hidden','true');
 }
});

const revealTargets=document.querySelectorAll('.intro-layout,.letter-card,.chapter,.photo,.nickname-cloud span,.wish-grid article,.jar-button,.gift-box,.finale .moon,.finale h2');
revealTargets.forEach(el=>el.classList.add('reveal'));
if('IntersectionObserver'in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
 revealTargets.forEach(el=>observer.observe(el));
}else revealTargets.forEach(el=>el.classList.add('visible'));
document.addEventListener('click',e=>{
 if(e.target.closest('button,a'))return;
 const s=document.createElement('span');s.className='sparkle';s.textContent='✦';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),900);
});
