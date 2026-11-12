# LP Brísida e Palião — Direito Bancário

Site estático (HTML + CSS + JS, sem build). Sobe direto na Vercel.

## Páginas
- `/` — `index.html`: landing page (Meta Ads / Google Ads)
- `/redirect` — página intermediária (3 s) que abre o WhatsApp do escritório com mensagem pronta
- `/dashboard` — painel de leads com login (Supabase Auth)

## Arquivos
- `config.js` — **único arquivo a editar**: WhatsApp, Pixel, Google Ads, OAB, endereço, modalidade de atendimento
- `app.js` — validação, máscara, UTMs, registro de visita e lead, pixels
- `img/`, `fonts/` — imagens WebP/JPG e fontes self-hosted
- `vercel.json` — URLs limpas e cache

## Supabase
Projeto **ADS BR CLIENTES** (`qxhnjzyhtllmtdrcyygi`), tabelas multi-tenant `lp_visits` e `lp_leads`, `site = "brisida-paliao"`.
- A LP grava 1 visita por carregamento e 1 lead por envio (nome, whatsapp, origem, servico).
- A chave pública só insere. Ler exige login; o acesso é liberado por `lp_acessos` (user ↔ site).
- Login do dashboard: usuário `Admin` → `admin@brisida-paliao.adsbr.internal` (senha passada à parte, não fica no repositório).

## Pendências antes de ativar o tráfego
1. `config.js` → `whatsapp` (55 + DDD + número)
2. `metaPixelId` / Google Ads
3. `oab` e `endereco` (dados confirmados pelo escritório)
4. Trocar `SEU-DOMINIO.com.br` no `<head>` do `index.html`
5. Teste final: abrir a LP → enviar formulário → conferir no `/dashboard`
