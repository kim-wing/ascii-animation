export const TAU=Math.PI*2;
export function flightAt(phase){const beat=Math.sin(phase),fold=Math.max(0,Math.cos(phase));return {span:208+38*beat,tipY:20+65*beat,wristY:-38+22*beat,fold,bob:-8*Math.sin(phase-.6),bank:.045*Math.sin(phase*.23)};}
