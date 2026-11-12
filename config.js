/*
 * Configuração da LP — Brísida e Palião Firma de Advogados
 * Preencha os campos abaixo antes de colocar a página no ar.
 * Nada aqui é segredo: a anon key do Supabase é pública por natureza
 * (a segurança fica nas políticas RLS: a chave pública só consegue INSERIR; ler exige login no dashboard).
 */
window.LP_CONFIG = {
  // WhatsApp oficial do escritório, só números, com DDI 55 + DDD.
  // Ex.: "5535999999999". Enquanto estiver vazio, a página /redirect avisa que o número não foi configurado.
  whatsapp: "",

  // Mensagem inicial do WhatsApp. {nome} é trocado pelo primeiro nome do lead.
  mensagemWhatsApp:
    "Olá! Meu nome é {nome}. Vim pelo site do escritório e gostaria de entender alguns descontos no meu benefício.",

  // Armazenamento dos leads (Supabase / Lovable Cloud). 
  // Projeto Supabase "ADS BR CLIENTES" (tabelas multi-tenant lp_visits / lp_leads).
  supabaseUrl: "https://qxhnjzyhtllmtdrcyygi.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aG5qenlodGxsbXRkcmN5eWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzczNjgsImV4cCI6MjA5NzgxMzM2OH0.DWf4I_x9F--H7ZZHUt_n4V3B__Nlsf1jNZdUV0vNBLU",
  site: "brisida-paliao",   // identificador desta LP na coluna "site"
  nomeCliente: "Brísida e Palião",

  // Rastreamento (opcional). O pixel só é carregado se o ID estiver preenchido.
  metaPixelId: "",
  googleAdsId: "",           // ex.: "AW-123456789"
  googleAdsLeadLabel: "",    // rótulo da conversão de lead

  // Dados institucionais — só preencher com informação confirmada pelo escritório.
  oab: "",          // ex.: "OAB/MG 000.000" (registro da sociedade ou dos advogados)
  endereco: "",     // ex.: "Rua ..., Centro — Três Pontas/MG"

  // Resposta da pergunta "Preciso ir presencialmente ao escritório?"
  // "a_confirmar" | "presencial_e_online" | "online" | "presencial"
  modalidadeAtendimento: "a_confirmar"
};
