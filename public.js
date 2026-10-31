import {db,configured} from "./supabase-client.js";
const form=document.querySelector("#cadastro");
const msg=document.querySelector("#mensagem");
const btn=document.querySelector("#enviar");
const modal=document.querySelector("#confirmacao");
const fechar=document.querySelector("#fechar-confirmacao");
async function atualizarContador(){if(!configured)return;const {data,error}=await db.rpc("total_cadastros");if(error)return;const total=Number(data);document.querySelector("#contador").textContent=total>0?`${total} solicitações recebidas`:"Inscrições abertas"}
atualizarContador();
function closeModal(){modal.classList.add("hidden");document.body.classList.remove("modal-open");btn.focus()}
fechar.addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.classList.contains("hidden"))closeModal()});
form.addEventListener("submit",async e=>{
 e.preventDefault();
 if(!configured){msg.textContent="O site ainda está em configuração. Volte mais tarde.";return}
 const data=Object.fromEntries(new FormData(form));
 for(const k of ["primeiro_nome","segundo_nome","sobrenome"]){
  data[k]=String(data[k]||"").trim().replace(/\s+/g," ");
  if(data[k].length<2||data[k].length>80){msg.textContent="Preencha corretamente os três nomes.";return}
 }
 btn.disabled=true;msg.textContent="";
 try{
  const {error}=await db.from("nome_submissoes").insert(data);
  if(error)throw error;
  form.reset();\n  atualizarContador();
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  fechar.focus();
 }catch(err){console.error(err);msg.textContent="Não foi possível enviar. Tente novamente."}
 finally{btn.disabled=false}
});
