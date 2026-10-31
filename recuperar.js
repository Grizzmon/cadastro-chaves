import {db,configured} from "./supabase-client.js";
const $=s=>document.querySelector(s);const msg=$("#mensagem");let recovery=false;
function showRecovery(){recovery=true;$("#solicitar").classList.add("hidden");$("#alterar").classList.remove("hidden");$("#intro").textContent="Escolha uma nova palavra-passe com pelo menos 12 caracteres."}
if(!configured){msg.textContent="Serviço de autenticação indisponível."}else{
 db.auth.onAuthStateChange((event)=>{if(event==="PASSWORD_RECOVERY")showRecovery()});
 const hash=new URLSearchParams(location.hash.slice(1));const params=new URLSearchParams(location.search);
 if(hash.get("type")==="recovery"&&hash.get("access_token")){db.auth.setSession({access_token:hash.get("access_token"),refresh_token:hash.get("refresh_token")||""}).then(({error})=>{if(error)msg.textContent="Link inválido ou expirado. Solicite outro.";else showRecovery()})}
 if(params.get("token_hash")&&params.get("type")==="recovery"){db.auth.verifyOtp({token_hash:params.get("token_hash"),type:"recovery"}).then(({error})=>{if(error)msg.textContent="Link inválido ou expirado.";else showRecovery()})}
}
$("#solicitar").addEventListener("submit",async e=>{e.preventDefault();if(!configured)return;const email=$("#email").value.trim();const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:new URL("./recuperar.html",location.href).href});msg.textContent=error?"Não foi possível enviar. Tente novamente.":"Se a conta existir, receberá um email de recuperação. Verifique também o spam."});
$("#alterar").addEventListener("submit",async e=>{e.preventDefault();const password=$("#senha").value;if(password!==$("#confirmar").value){msg.textContent="As palavras-passe não coincidem.";return}if(password.length<12){msg.textContent="Use pelo menos 12 caracteres.";return}const {error}=await db.auth.updateUser({password});if(error){msg.textContent="Não foi possível atualizar. Solicite outro link.";return}await db.auth.signOut();msg.textContent="Palavra-passe alterada. Pode voltar ao login.";$("#alterar").classList.add("hidden")});
