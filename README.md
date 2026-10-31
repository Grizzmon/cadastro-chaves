# Cadastro de Chave — Fase 1

Site estático com formulário público e painel administrativo usando Supabase.

## Configurar
1. No Supabase do projeto gizustnqsxexhrcjthor, abra **Project Settings → API Keys** e copie apenas a chave **publishable** (ou anon legada).
2. Edite `config.js` e substitua `COLOCAR_CHAVE_PUBLICAVEL_AQUI`. Nunca use uma secret key/service_role.
3. No Supabase Auth, crie o utilizador administrador com email e palavra-passe. Copie o UUID desse utilizador.
4. No SQL Editor, execute `insert into public.admin_users(user_id) values ('UUID_DO_ADMIN');` substituindo pelo UUID correto. Não publique o UUID nem as credenciais.
5. Publique no Vercel como projeto estático, sem comando de build, usando a raiz do repositório.

## Segurança
- RLS ativado. O público apenas pode inserir nomes; apenas contas listadas em admin_users podem ler/editar/apagar.
- Não há leitura pública de admin_users. A tabela está deliberadamente sem políticas de acesso.
- A inserção pública permite spam; antes de divulgação ampla, adicionar rate limiting e CAPTCHA/Turnstile com validação no servidor.
- A lista administrativa apresenta no máximo 1000 linhas por enquanto.
- Fase 2 (votação) não está ativada.
