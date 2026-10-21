export const TAU=Math.PI*2;
export function joint(a,b,l1,l2,bend=1){const dx=b.x-a.x,dy=b.y-a.y,raw=Math.hypot(dx,dy)||1,d=Math.max(Math.abs(l1-l2)+.001,Math.min(l1+l2-.001,raw)),ex=dx/raw,ey=dy/raw,along=(l1*l1-l2*l2+d*d)/(2*d),height=Math.sqrt(Math.max(0,l1*l1-along*along));return {x:a.x+ex*along-ey*height*bend,y:a.y+ey*along+ex*height*bend};}
// A shared gallop cycle: reach, foreleg support, gather, hindleg drive, suspension.
const frontTrack=[[0,142,106],[.12,76,153],[.34,-61,153],[.49,-83,87],[.64,-25,61],[.81,131,81],[1,142,106]];
const hindTrack=[[0,-119,100],[.20,-16,64],[.39,86,104],[.48,70,153],[.69,-80,153],[.84,-127,94],[1,-119,100]];
function sample(track,q){let i=0;while(i<track.length-2&&q>track[i+1][0])i++;const a=track[i],b=track[i+1],u=(q-a[0])/(b[0]-a[0]),v=u*u*(3-2*u);return {x:a[1]+(b[1]-a[1])*v,y:a[2]+(b[2]-a[2])*v};}
export function hoofAt(phase,hip,ground,front){const q=((phase/TAU)%1+1)%1,p=sample(front?frontTrack:hindTrack,q);return{x:hip+p.x,y:p.y+ground-153};}
export function gaitAt(phase){const q=((phase/TAU)%1+1)%1,bob=-12-11*Math.cos(TAU*(q-.9)),angle=-.045*Math.sin(TAU*(q-.16)),legs=[];
for(const [front,far,offset] of [[false,true,-.065],[true,true,-.065],[false,false,0],[true,false,0]]){const cycle=(q+offset+1)%1,x=front?105:-106,y=front?4:-3,hip={x:x*Math.cos(angle)-(y)*Math.sin(angle),y:x*Math.sin(angle)+y*Math.cos(angle)+bob},hoof=hoofAt(cycle*TAU,hip.x,153,front);
let knee,stifle;if(front){
// Reach with an almost straight 187-unit chain; flex only for the recovery fold.
const smooth=(a,b,v)=>{const u=Math.max(0,Math.min(1,(v-a)/(b-a)));return u*u*(3-2*u)},extension=cycle>=.68?smooth(.68,.81,cycle):1-smooth(.045,.12,cycle);
if(extension>0){const dx=hoof.x-hip.x,dy=hoof.y-hip.y,d=Math.hypot(dx,dy)||1,length=d+(186.8-d)*extension;hoof.x=hip.x+dx/d*length;hoof.y=hip.y+dy/d*length;if(hoof.y>153){hoof.y=153;hoof.x=hip.x+Math.sqrt(Math.max(0,length*length-(153-hip.y)**2));}}
knee=joint(hip,hoof,82,105,-1);
}else{stifle={x:hip.x+25+15*Math.sin(TAU*(cycle-.12)),y:hip.y+40};knee=joint(stifle,hoof,76,96,1);}
legs.push({front,far,hip,knee,stifle,hoof,contact:front?cycle>=.12&&cycle<=.34:cycle>=.48&&cycle<=.69});}
return {bob,angle,legs,headBob:Math.sin(phase-.4)*3};}
