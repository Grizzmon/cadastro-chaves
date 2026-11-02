const names=["Fernanda Gomes da Silva","Mariana Oliveira Santos","Priscila Graciano Silva","Luciane Santana Oliveira"];
const colors=["#22c55e","#60a5fa","#f59e0b","#c084fc"];
const root=document.querySelector("#vote-chart"),legend=document.querySelector("#vote-legend"),select=document.querySelector("#chart-type"),tbody=document.querySelector("#votos-linhas");
const ns="http://www.w3.org/2000/svg";
const svgEl=(tag,attrs={})=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e};
const addText=(svg,x,y,value,attrs={})=>{const t=svgEl("text",{x,y,fill:"#e9eef9","font-size":13,...attrs});t.textContent=value;svg.append(t)};
function render(){
 const counts=new Map([...tbody.querySelectorAll("tr")].map(tr=>{const c=tr.querySelectorAll("td");return [c[0]?.textContent,Number(tr.dataset.count)||0]}));
 const values=names.map(n=>counts.get(n)||0),total=values.reduce((a,b)=>a+b,0);
 root.replaceChildren();legend.replaceChildren();
 if(!total){root.textContent="Ainda não há votos para apresentar.";return}
 const type=select.value,svg=svgEl("svg",{viewBox:type==="bar"?"0 0 700 290":"0 0 520 330",role:"img","aria-label":names.map((n,i)=>n+": "+(100*values[i]/total).toFixed(1)+"%").join(", ")});
 if(type==="bar"){
  const max=Math.max(...values,1);
  values.forEach((v,i)=>{const y=18+i*68,w=v/max*460;svg.append(svgEl("rect",{x:180,y,width:w,height:35,rx:7,fill:colors[i]}));addText(svg,168,y+23,names[i].split(" ")[0],{"text-anchor":"end"});addText(svg,190+w,y+23,(100*v/total).toFixed(1)+"%")});
 }else{
  const cx=260,cy=157,r=115,inner=type==="donut"?64:0;let start=-Math.PI/2;
  values.forEach((v,i)=>{if(!v)return;const end=start+2*Math.PI*v/total;const polar=(radius,angle)=>[cx+radius*Math.cos(angle),cy+radius*Math.sin(angle)];let path;
   if(v===total){svg.append(svgEl("circle",{cx,cy,r,fill:colors[i]}));if(inner)svg.append(svgEl("circle",{cx,cy,r:inner,fill:"#151d32"}));}
   else{const [x1,y1]=polar(r,start),[x2,y2]=polar(r,end),large=end-start>Math.PI?1:0;
    path=`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    if(inner){const [x3,y3]=polar(inner,end),[x4,y4]=polar(inner,start);path+=` L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`}
    else path+=` L ${cx} ${cy} Z`;
    svg.append(svgEl("path",{d:path,fill:colors[i],stroke:"#151d32","stroke-width":2}));
   }start=end;
  });
  if(type==="donut"){addText(svg,cx,cy-3,"100%",{"font-size":32,"font-weight":800,"text-anchor":"middle"});addText(svg,cx,cy+22,"total",{"text-anchor":"middle",fill:"#b6c1d5"})}
 }
 root.append(svg);
 names.forEach((name,i)=>{const item=document.createElement("div");item.className="vote-legend-item";const dot=document.createElement("span");dot.className="vote-dot";dot.style.background=colors[i];const label=document.createElement("span");label.textContent=name+" · "+(100*values[i]/total).toFixed(1)+"%";item.append(dot,label);legend.append(item)});
}
select.value=["bar","pie","donut"].includes(localStorage.getItem("cadastro-chart-type"))?localStorage.getItem("cadastro-chart-type"):"bar";
select.addEventListener("change",()=>{localStorage.setItem("cadastro-chart-type",select.value);render()});
new MutationObserver(render).observe(tbody,{childList:true,subtree:true,characterData:true});
render();
