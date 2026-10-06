'use strict';
const canvas = document.getElementById('heart');
const ctx = canvas.getContext('2d');
const music = document.getElementById('music');
const sound = document.getElementById('sound');
const statusText = document.getElementById('status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const colors = ['#4682b4', '#1e90ff', '#00bfff', '#6495ed', '#4169e1'];
let width = 0, height = 0, started = false, epoch = 0;
const particles = [];
function point(t) {
  return [16*Math.sin(t)**3, -(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))];
}
function particle(x,y,delay,size){
  particles.push({x,y,delay,size,word:['love you','Love You','LOVE YOU'][Math.floor(Math.random()*3)],color:colors[Math.floor(Math.random()*colors.length)],phase:Math.random()*Math.PI*2});
}
let placed=[];
for(let i=0;i<160;i++){
  const [x,y]=point(i/160*Math.PI*2);
  if(placed.some(p=>Math.hypot(x-p[0],y-p[1])<2.3))continue;
  placed.push([x,y]);particle(x,y,i*1.6/60,0.9);
}
placed=[];
for(let i=0;i<10000&&placed.length<100;i++){
  let [x,y]=point(Math.random()*Math.PI*2);const r=Math.random()*.85;x*=r;y*=r;
  if(placed.some(p=>Math.hypot(x-p[0],y-p[1])<2.8))continue;
  placed.push([x,y]);particle(x,y,4.7+Math.random()*5.3,.8);
}
function resize(){
  width=window.innerWidth;height=window.innerHeight;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize',resize);resize();
function draw(now){
  ctx.clearRect(0,0,width,height);
  if(started){
    const t=reducedMotion?20:(now-epoch)/1000;
    const scale=Math.min((width-32)/37,(height-160)/36,24);
    const cx=width/2,cy=height/2-20;
    const pulse=reducedMotion?1:1+.012*Math.sin(t*2.2);
    ctx.textAlign='center';ctx.textBaseline='middle';
    for(const p of particles){
      const fade=Math.max(0,Math.min(1,(t-p.delay)*3.7));
      if(!fade)continue;
      ctx.globalAlpha=fade*(reducedMotion?1:.78+.22*Math.sin(t*2.4+p.phase));
      ctx.font=`bold ${Math.max(7,p.size*scale)}px Arial`;
      ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=scale*.65;
      ctx.fillText(p.word,cx+p.x*scale*pulse,cy+p.y*scale*pulse);
    }
    if(t>8){
      ctx.globalAlpha=Math.min(1,t-8);ctx.font=`bold ${Math.max(28,scale*2.7)}px Georgia`;
      ctx.shadowColor='#62b8ff';ctx.shadowBlur=20;ctx.fillStyle='#fffaf5';
      ctx.lineWidth=5;ctx.strokeStyle='#000';ctx.strokeText('Love You',cx,cy);ctx.fillText('Love You',cx,cy);
    }
    ctx.globalAlpha=1;ctx.shadowBlur=0;
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
function soundLabel(){sound.textContent=music.paused?'Activar música':'Silenciar';sound.setAttribute('aria-pressed',String(music.paused));}
async function playMusic(){
  try{await music.play();statusText.textContent='';}catch{statusText.textContent='Toca «Activar música» para escuchar la canción.';}
  soundLabel();
}
document.getElementById('start').addEventListener('click',()=>{
  epoch=performance.now();started=true;
  document.getElementById('intro').hidden=true;document.getElementById('controls').hidden=false;
  playMusic();
});
sound.addEventListener('click',()=>{if(music.paused)playMusic();else{music.pause();soundLabel();}});
document.getElementById('replay').addEventListener('click',()=>{epoch=performance.now();music.currentTime=0;playMusic();});
