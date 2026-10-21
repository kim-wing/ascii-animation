import {TAU,flightAt} from './model.js';
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),$=id=>document.getElementById(id),off=document.createElement('canvas'),g=off.getContext('2d',{willReadFrequently:true});off.width=680;off.height=460;
let W=1,H=1,dpr=1,t=0,last=0,slow=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const accents=['#e0892c','#e03a32','#b44ae0','#33c8cc','#3cb54a','#3150e8','#d9c14a'];
function shape(points,color){g.fillStyle=color;g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.fill();}
function oval(x,y,rx,ry,color,angle=0){g.fillStyle=color;g.beginPath();g.ellipse(x,y,rx,ry,angle,0,TAU);g.fill();}
// Oblique projection: the bird's forward axis points right, the near wing toward us.
function project(x,y,z=0){return [.78*x+.96*y,-.30*x+.28*y-.9*z];}
function feather(a,b,width,color){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d;shape([[a[0]+nx*width,a[1]+ny*width],[a[0]-nx*width,a[1]-ny*width],[b[0]-nx*4,b[1]-ny*4],[b[0]+dx/d*6,b[1]+dy/d*6],[b[0]+nx*5,b[1]+ny*5]],color);g.strokeStyle='#414d5b';g.lineWidth=1.1;g.beginPath();g.moveTo(...a);g.lineTo(...b);g.stroke();}
function paintEagle(phase){g.clearRect(0,0,680,460);const f=flightAt(phase),lift=.18+.48*Math.sin(phase+.65);g.save();g.translate(340,220+f.bob);g.rotate(-.045+f.bank*.5);
function wing(side){const far=side<0,P=(x,y,z=0)=>project(x,side*y*(far?.78:1.12),z),root=P(22,17,9),elbow=P(22,91,35*lift),wrist=P(13,166,88*lift),tip=P(-6,246,150*lift);const grad=g.createLinearGradient(...root,...tip);grad.addColorStop(0,far?'#7b8998':'#c4cbd3');grad.addColorStop(.6,far?'#626f7f':'#9ba8b7');grad.addColorStop(1,far?'#424e5d':'#6c7a8d');shape([root,elbow,wrist,tip,P(-147,223,135*lift),P(-120,156,77*lift),P(-89,72,22*lift),P(-33,15,5)],grad);
// Overlapping secondaries form a broad trailing edge, primaries separate into fingers.
for(let i=0;i<12;i++){const q=i/11;feather(P(20-q*12,36+q*131,(10+q*78)*lift),P(-78-q*48,40+q*144,(8+q*83)*lift),10,far?(i%2?'#728090':'#657384'):(i%2?'#aab5c2':'#8e9dad'));}
const tips=[[-12,253],[-34,272],[-63,280],[-94,274],[-121,257],[-143,236],[-154,212]];
for(let i=0;i<7;i++){const q=i/6;feather(P(11-q*44,149+q*28,(79+q*18)*lift),P(tips[i][0],tips[i][1],(153-q*20)*lift),13-q*2,far?(i%2?'#788695':'#5c6b7c'):(i%2?'#b6bec9':'#8f9dad'));}
for(let row=0;row<3;row++)for(let i=0;i<9;i++){const q=i/8,c=P(18-q*51-row*11,27+q*131,(7+q*75)*lift);oval(...c,12,6,far?'#778695':row%2?'#a8b5c1':'#bbc5cf',side*.35);}}
wing(-1);
// Tail feathers fan backward from the rump instead of hanging below the body.
for(let i=-3;i<=3;i++)feather(project(-51,i*4,0),project(-133+Math.abs(i)*5,i*13,-4+Math.sin(phase-.5)*5),11,i%2?'#a2afbd':'#7a899a');
const body=g.createLinearGradient(-50,-25,5,40);body.addColorStop(0,'#bcc6d0');body.addColorStop(.6,'#8695a7');body.addColorStop(1,'#4e6073');oval(5,9,74,34,body,-.15);
for(let i=0;i<7;i++){const c=project(-44+i*11,5,-1);oval(...c,13,10,i%2?'#8596a8':'#9aabba',-.3);}
// Tucked legs are small and sit behind the breast silhouette.
shape([project(-14,10,-15),project(-36,20,-35),project(-48,22,-31),project(-30,18,-18)],'#7a8591');
wing(1);
// The exposed pale neck and side-profile head retain a strong brow and hooked beak.
// Raptor profile: low angular crown, heavy brow, short neck and deep hooked beak.
shape([[38,-13],[62,-33],[86,-39],[103,-35],[113,-25],[108,-3],[89,14],[67,29],[47,31],[54,20],[39,22],[48,10],[33,12]],'#cbd2d8');
shape([[80,-38],[98,-44],[121,-40],[136,-32],[140,-18],[131,-7],[110,-5],[95,4],[77,5],[83,-12]],'#dce0e3');
shape([[131,-31],[151,-29],[165,-21],[169,-10],[164,2],[154,8],[158,-6],[150,-13],[135,-12]],'#b8a47c');
// Dark cere and the sharply angled brow keep the face stern at coarse cell resolution.
shape([[125,-27],[142,-25],[145,-19],[132,-18]],'#7c7b70');oval(126,-27,6.5,4.5,'#0d1520');oval(127,-28,1.4,1.3,'#e7c85b');
shape([[111,-36],[135,-32],[139,-27],[117,-30]],'#697582');
g.strokeStyle='#626c77';g.lineWidth=2.5;g.beginPath();g.moveTo(139,-11);g.lineTo(157,-10);g.stroke();
g.restore();return f;}
function draw(){const phase=t*3.8,gait=paintEagle(phase),cw=Math.max(8,Math.min(13,Math.round(W/124))),ch=Math.round(cw*1.45);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#ffffff06';ctx.lineWidth=.5;ctx.beginPath();for(let x=0;x<W;x+=cw){ctx.moveTo(x,0);ctx.lineTo(x,H)}for(let y=0;y<H;y+=ch){ctx.moveTo(0,y);ctx.lineTo(W,y)}ctx.stroke();
 const scale=Math.min(W*(W<850?.86:.88)/520,H*(W<850?.45:.67)/400,1.65),originX=W*.57-340*scale,ground=H*.70,originY=H*(W<850?.61:.55)-220*scale;const pixels=g.getImageData(0,0,680,460).data;ctx.font=`600 ${Math.round(ch*.74)}px Menlo,Consolas,monospace`;ctx.textAlign='center';ctx.textBaseline='middle';const ramp=':;t%SX8#@',tint=$('palette').value==='chestnut'?[1.13,.93,.74]:$('palette').value==='ivory'?[1.06,1.04,.95]:[.92,.97,1.05];
 for(let y=Math.max(0,Math.floor(originY/ch)*ch);y<Math.min(H,originY+460*scale);y+=ch)for(let x=Math.max(0,Math.floor(originX/cw)*cw);x<Math.min(W,originX+680*scale);x+=cw){const sx=Math.floor((x-originX)/scale),sy=Math.floor((y-originY)/scale);if(sx<0||sy<0||sx>=680||sy>=460)continue;const i=(sy*680+sx)*4,a=pixels[i+3]/255;if(a<.25)continue;const shade=pixels[i]/255,key=Math.abs(Math.sin(Math.round(x/cw)*127.1+Math.round(y/ch)*311.7)*43758.5453)%1,level=(30+shade*210)*(.6+.4*a);ctx.fillStyle=`rgb(${Math.round(level*tint[0])},${Math.round(level*tint[1])},${Math.round(level*tint[2]+4)})`;ctx.fillRect(x-cw/2+1,y-ch/2+1,cw-1,ch-1);ctx.fillStyle=key<.09?accents[Math.floor(key*1000)%7]:key<.13?'#fff':shade>.55?'#0e0f13':'#1b1d24';const glyph=shade<.15?'o':ramp[Math.max(0,Math.min(8,Math.floor((1-shade)*9)+Math.floor(key*3)-1))];ctx.fillText(glyph,x,y+1)}
}
function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function loop(now){const dt=last?Math.min(.04,(now-last)/1000):0;last=now;if(!paused&&!document.hidden)t+=dt*+$('pace').value*(slow?.3:1);draw();requestAnimationFrame(loop)}$('pause').textContent=paused?'Resume':'Pause';$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Resume':'Pause'};$('slow').onclick=()=>{slow=!slow;$('slow').textContent=slow?'Normal speed':'Slow motion'};$('palette').onchange=draw;$('save').onclick=()=>canvas.toBlob(b=>{if(!b)return;const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='aquila-ascii.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),10000)});new ResizeObserver(resize).observe(canvas);resize();requestAnimationFrame(loop);
