var T=Object.defineProperty;var O=(e,t,o)=>t in e?T(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var y=(e,t,o)=>(O(e,typeof t!="symbol"?t+"":t,o),o);const j=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerpolicy&&(i.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?i.credentials="include":n.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}};j();class A{constructor(t,o={x:0,y:0}){this.ctx=t,this.position=o}project({x:t,y:o}){return{x:this.position.x-t,y:this.position.y-o}}unproject({x:t,y:o}){return{x:this.position.x-t,y:this.position.y-o}}}class x{constructor(t,o,s={x:0,y:0},n=20,i="white"){y(this,"selected",!1);y(this,"name","PhysicCircle");this.position=t,this.mass=o,this.speed=s,this.radius=n,this.color=i}draw(t){D(t,this.position,this.radius,this.selected?"red":this.color,"black",1)}update(t){this.position.x+=this.speed.x*t,this.position.y+=this.speed.y*t}attractTo(t,o){const s=this.position.x-t.position.x,n=this.position.y-t.position.y,i=s**2+n**2;if(Math.sqrt(i)<this.radius+t.radius)return;const d=Math.atan2(n,s),p=60*o*((t.mass+this.mass)/i),L=Math.cos(d)*p,P=Math.sin(d)*p;this.speed.x-=L,this.speed.y-=P}}const u=document.getElementById("simulationCanvas"),$=document.getElementById("canvasContainer"),m=document.getElementById("infoMenu"),g=document.getElementById("speedSlider"),M=document.getElementById("speedChkBox"),I=document.getElementById("speedDisplay"),S=u.getContext("2d"),w=10;let k=1,f,v,b;const B=e=>{requestAnimationFrame(B);const{width:t,height:o}=$.getBoundingClientRect();if((t!==b||o!==v)&&([u.height,u.width]=[v,b]=[o,t],[l.position.x,l.position.y]=[t/2,o/2]),!f){q(),f=e;return}const s=e-f;f=e;for(let n=0;n<w;n++)F(s/1e3/w*k);X()};requestAnimationFrame(B);const C=50,E=100,l=new A(S,{x:300,y:300});let a,h,r;function q(){h=new x({x:0,y:0},Math.PI*C**2,void 0,C,"orange"),h.name="The Center Object",window.objects=a=[...Array(E)].map((t,o)=>{const s=o/E*Math.PI*2,n=30,i=300;return new x({x:Math.cos(s)*i,y:Math.sin(s)*i},Math.PI*n**2,{x:Math.cos(s+Math.PI/2)*50,y:Math.sin(s+Math.PI/2)*30})}),u.addEventListener("click",t=>{const o=l.unproject({x:t.offsetX,y:t.offsetY});if(t.shiftKey){a.push(new x(o,1,void 0,25,"#ffc"));return}r&&(m.style.display="none",r.selected=!1,r=void 0);const s=[h,...a].reverse().find(n=>Math.sqrt((o.x-n.position.x)**2+(o.y-n.position.y)**2)<n.radius);if(s){r=s,r.selected=!0,m.style.display="block";return}}),g.addEventListener("input",e),M.addEventListener("input",e),I.addEventListener("click",()=>{g.valueAsNumber=50,e()});function e(){const t=parseInt(g.value),o=100**(t/100*2);N(M.checked?-o:o)}}function N(e){k=e/100,I.textContent=(e<20?Math.floor(e*10)/10:Math.floor(e))+"%"}function F(e){a.forEach(t=>t.attractTo(h,e)),a.forEach(t=>t.update(e))}function X(){S.clearRect(0,0,u.width,u.height),h.draw(l),a.forEach((e,t)=>_(l,a.at(t-1).position,e.position,"blue")),a.forEach(e=>e.draw(l)),Y()}function Y(){if(r){const{position:e,speed:t}=r;m.textContent=`[${r.name}]
position: X${Math.round(e.x)} Y${Math.round(e.y)}
speed: X${Math.round(t.x)} Y${Math.round(t.y)}
mass: ${Math.round(r.mass)}
radius: ${Math.round(r.radius)}`}}function _(e,t,o,s,n=1){const{x:i,y:c}=e.project(t),{x:d,y:p}=e.project(o);e.ctx.beginPath(),e.ctx.moveTo(i,c),e.ctx.lineTo(d,p),e.ctx.strokeStyle=s,e.ctx.lineWidth=n,e.ctx.stroke()}function D(e,t,o,s,n,i){const{x:c,y:d}=e.project(t);e.ctx.beginPath(),e.ctx.arc(c,d,o,0,2*Math.PI,!1),e.ctx.fillStyle=s,e.ctx.fill(),i&&(e.ctx.strokeStyle=n,e.ctx.lineWidth=i,e.ctx.stroke())}
