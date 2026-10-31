import {db,configured} from "./supabase-client.js";
const $=s=>document.querySelector(s);
const form=$("#cadastro"),msg=$("#mensagem"),btn=$("#enviar"),review=$("#revisao"),success=$("#confirmacao");
let pending=null;
async function atualizarContador(){
 if(!configured)return;
 const {data,error}=await db.rpc("total_cadastros");
 if(error){console.error("Contador indisponível",error);return}
 const n=Number(data);
 $("#contador").textContent=Number.isFinite(n)&&n>0?`${n} solicitações recebidas`:"Inscrições abertas";
}
atualizarContador();
function esconder(el){el.classList.add("hidden");if(review.classList.contains("hidden")&&success.classList.contains("hidden"))document.body.classList.remove("modal-open")}
function mostrar(el){el.classList.remove("hidden");document.body.classList.add("modal-open")}
function corrigir(){pending=null;esconder(review);btn.focus()}
$("#corrigir").addEventListener("click",corrigir);
$("#fechar-confirmacao").addEventListener("click",()=>{esconder(success);btn.focus()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!review.classList.contains("hidden"))corrigir();else if(e.key==="Escape"&&!success.classList.contains("hidden")){esconder(success);btn.focus()}});
form.addEventListener("submit",e=>{
 e.preventDefault();msg.textContent="";
 if(!configured){msg.textContent="O site ainda está em configuração.";return}
 const data=Object.fromEntries(new FormData(form));
 for(const k of ["primeiro_nome","segundo_nome","sobrenome"]){
  data[k]=String(data[k]||"").trim().replace(/\s+/g," ");
  if(data[k].length<2||data[k].length>80){msg.textContent="Preencha corretamente os três nomes.";return}
 }
 pending=data;
 $("#nome-revisao").textContent=[data.primeiro_nome,data.segundo_nome,data.sobrenome].join(" ");
 mostrar(review);$("#confirmar").focus();
});
$("#confirmar").addEventListener("click",async()=>{
 if(!pending)return;
 const data=pending;
 const confirmar=$("#confirmar");
 confirmar.disabled=true;$("#corrigir").disabled=true;confirmar.textContent="A enviar...";
 try{
  const {error}=await db.from("nome_submissoes").insert(data);
  if(error)throw error;
  pending=null;form.reset();esconder(review);mostrar(success);$("#fechar-confirmacao").focus();
  atualizarContador();
 }catch(err){console.error(err);esconder(review);msg.textContent="Não foi possível enviar. Tente novamente."}
 finally{confirmar.disabled=false;$("#corrigir").disabled=false;confirmar.textContent="Confirmar"}
});
