import {clamp,bellShape,createTentacle,updateTentacle} from './model.js';
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),$=id=>document.getElementById(id);let W=1,H=1,dpr=1,t=0,last=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,boost=0,bodies=[];const pointer={x:0,y:0,active:false};const colors={ice:[137,211,238],rose:[227,157,211],mint:[148,227,190]};
function makeBodies(){const r=Math.min(W*.24,H*.19,175);bodies=[{x:W*.66,y:H*.34,r,phase:0,seed:1,alpha:1},{x:W*.84,y:H*.19,r:r*.42,phase:2.2,seed:5,alpha:.43},{x:W*.37,y:H*.62,r:r*.32,phase:4.4,seed:9,alpha:.32}];for(const b of bodies)b.tentacles=Array.from({length:8},(_,i)=>{const u=(i/7-.5)*1.65;return createTentacle(b.x+u*b.r,b.y+b.r*.2,b.r*(1.7+Math.sin(i*2.1+b.seed)*.35),28)})}
function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);makeBodies();draw(0)}
let grid,cols,rows,cw=5,ch=8;
function put(x,y,glyph,light,hue=0,solid=false,shade=.5){const col=Math.round(x/cw),row=Math.round(y/ch);if(col<0||col>=cols||row<0||row>=rows)return;const i=row*cols+col;if(!grid[i]||grid[i].light<light)grid[i]={glyph,light,hue,solid,shade}}
function line(a,b,glyph,light,hue=0){const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/3));for(let i=0;i<=n;i++){const k=i/n;put(a.x+(b.x-a.x)*k,a.y+(b.y-a.y)*k,glyph,light,hue)}}
function draw(dt){if(dt){t+=dt;boost=Math.max(0,boost-dt*.6)}cw=clamp(Math.round(W/124),8,13);ch=Math.round(cw*1.45);cols=Math.ceil(W/cw);rows=Math.ceil(H/ch);grid=new Array(cols*rows);const flow=+$('flow').value;
 for(const b of bodies){const phase=t*1.7+b.phase+boost*.45,shape=bellShape(phase,b.r);const pulse=Math.sin(phase),cx=b.x+Math.sin(t*.3+b.seed)*b.r*.34*flow,cy=b.y+Math.sin(t*.65+b.phase)*b.r*.16-Math.pow(Math.max(0,pulse),2)*b.r*.14-boost*b.r*.12;
 // Bell is an analytic dome, rasterized into the character grid each frame.
 const top=cy-shape.height;for(let y=Math.floor(top/ch)*ch;y<=cy+shape.height*.28;y+=ch)for(let x=Math.floor((cx-shape.width)/cw)*cw;x<=cx+shape.width;x+=cw){const u=(x-cx)/shape.width;if(Math.abs(u)>1)continue;const dome=cy-shape.height*Math.sqrt(Math.max(0,1-u*u)),rim=cy+shape.height*.09*Math.cos(u*Math.PI*5+t*2);if(y<dome||y>rim)continue;const depth=(y-dome)/Math.max(1,rim-dome),edge=(y-dome<ch*1.2||rim-y<ch),rib=Math.cos(Math.asin(u)*9+phase*.05);
 const z=Math.sqrt(Math.max(0,1-u*u));
 const key=Math.abs(Math.sin(Math.round(x/cw)*127.1+Math.round(y/ch)*311.7+b.seed)*43758.5453)%1;
 const shade=clamp(.22+.38*z+.20*(1-depth)-u*.18+Math.max(0,rib)*.14+(key-.5)*.06,0,1);
 const ramp=':;t%SX8#@',glyph=edge?(rim-y<ch?'%':';'):ramp[clamp(Math.floor((1-shade)*9)+Math.floor(key*3)-1,0,8)];
 put(x,y,glyph,(edge?.94:.76)*b.alpha,key<.08?1:0,true,shade);}

 // Radial canals and four internal horseshoe-shaped gonads.
 for(let i=0;i<9;i++){const u=-.92+i*.23;let prev;for(let k=0;k<=24;k++){const v=k/24,x=cx+u*shape.width*Math.sin(v*Math.PI/2),y=top+shape.height*v;const point={x,y};if(prev)line(prev,point,k%3?'·':':',b.alpha*.36);prev=point}}
 for(let i=0;i<4;i++){const a=i*Math.PI/2+.5;for(let j=0;j<15;j++){const q=j/14*Math.PI*1.65;put(cx+Math.cos(a)*b.r*.22+Math.cos(q)*b.r*.12,cy-shape.height*.35+Math.sin(a)*b.r*.10+Math.sin(q)*b.r*.08,'o',b.alpha*.63,1)}}
 for(let i=0;i<8;i++){const u=(i/7-.5)*1.65,root={x:cx+u*shape.width,y:cy+shape.height*.07*Math.cos(u*Math.PI*5+t*2)},length=b.r*(1.7+Math.sin(i*2.1+b.seed)*.35);if(dt)updateTentacle(b.tentacles[i],root,length,dt,t,flow,b.seed+i,pointer);const nodes=b.tentacles[i];for(let j=1;j<nodes.length;j++){const fade=(1-j/nodes.length*.74)*b.alpha;line(nodes[j-1],nodes[j],j%4===0?':':i%2?'·':'|',fade*.65,i%3===0?1:0)}}
 // Oral arms are broad ruffled ribbons driven by the bell's contraction.
 for(let i=0;i<4;i++){let prev;for(let j=0;j<42;j++){const v=j/41,spread=(i-1.5)*b.r*.13;const x=cx+spread+Math.sin(v*8-t*2+i)*b.r*(.02+.10*v)*flow,y=cy+v*b.r*1.35;const point={x,y};if(prev)line(prev,point,j%3?'s':':',b.alpha*(.65-v*.36),1);
 const ribbon=b.r*(.075*(1-v)+.018);for(let offset=-ribbon;offset<=ribbon;offset+=cw){const fold=.5+.5*Math.sin(j*.7+i+offset*.3);put(x+offset,y,fold>.6?'S':'%',b.alpha*(.78-v*.4),1,true,.25+fold*.38)}
 if(j%2===0)put(x+Math.sin(j*1.7+i)*b.r*.055,y,';',b.alpha*(.45-v*.27),1);prev=point}}
 }
 ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#ffffff06';ctx.lineWidth=.5;ctx.beginPath();for(let x=0;x<W;x+=cw){ctx.moveTo(x,0);ctx.lineTo(x,H)}for(let y=0;y<H;y+=ch){ctx.moveTo(0,y);ctx.lineTo(W,y)}ctx.stroke();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${Math.round(ch*.74)}px Menlo,Consolas,monospace`;const rgb=colors[$('palette').value];for(let i=0;i<75;i++){const x=(i*173.7+Math.sin(t*.2+i)*9)%W,y=(i*97.3-t*(1+i%3)*2+H*10)%H;ctx.fillStyle='rgba(92,150,173,.12)';ctx.fillText('·',x,y)}for(let i=0;i<grid.length;i++){const cell=grid[i];if(!cell)continue;const color=cell.hue?[Math.min(255,rgb[0]+45),Math.min(255,rgb[1]+15),rgb[2]]:rgb;
 const x=(i%cols)*cw,y=Math.floor(i/cols)*ch;
 if(cell.solid){
  const dim=clamp(cell.light/.76,.15,1),level=(46+cell.shade*160)*dim;
  const tint=$('palette').value==='ice'?[.92,.97,1.05]:$('palette').value==='rose'?[1.05,.88,1.02]:[.87,1.02,.94];
  ctx.fillStyle=`rgb(${Math.round(level*tint[0])},${Math.round(level*tint[1])},${Math.round(level*tint[2]+4)})`;
  ctx.fillRect(x-cw*.5+1,y-ch*.5+1,cw-1,ch-1);
  const key=Math.abs(Math.sin(i*17.13)*43758)%1;
  const accents=['#e0892c','#e03a32','#b44ae0','#33c8cc','#3cb54a','#3150e8','#d9c14a'];
  ctx.fillStyle=key<.09?accents[i%accents.length]:key<.13?'#ffffff':cell.shade>.55?'#0e0f13':'#1b1d24';
 }else ctx.fillStyle=`rgba(${color.join(',')},${clamp(cell.light,0,1)})`;
 ctx.fillText(cell.glyph,x,y+1)} }
function frame(now){const dt=last?Math.min(.025,(now-last)/1000):0;last=now;if(!document.hidden)draw(paused?0:dt);requestAnimationFrame(frame)}
$('pulse').onclick=()=>{boost=1.6;if(paused)draw(0)};$('pause').textContent=paused?'Resume':'Pause';$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Resume':'Pause'};$('palette').onchange=()=>draw(0);$('flow').oninput=()=>draw(0);$('save').onclick=()=>canvas.toBlob(blob=>{if(!blob)return;const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='medusa-ascii.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),10000)});
canvas.onpointermove=e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true};canvas.onpointerleave=()=>pointer.active=false;canvas.onpointerdown=()=>boost=1.2;new ResizeObserver(resize).observe(canvas);resize();requestAnimationFrame(frame);
