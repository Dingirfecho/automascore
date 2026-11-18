// URL del Worker desplegado (ver worker/worker.js)
const ENDPOINT = "https://api.automascore.com";
const CALENDLY = "https://calendly.com/dingirfecho/ai-strategy-discovery-call";
const MAXC = 2000;
const CFG = window.AS_CFG || {};
const BRAND = CFG.brand || "aiq";
const SAPMODE = !!CFG.sap;                       // versión BCI: panel de entorno SAP
const NUM = SAPMODE ? "03" : "02";               // numeración de los paneles de resultado
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

// ---------- Textos de la interfaz (ES / EN / PT) ----------
const I18N = {
  es: {
    title: "AutomaScore · ¿Qué tan automatizable es tu problema?",
    desc: "Contanos qué proceso te hace perder tiempo y te decimos qué tan automatizable es, con ejemplos de soluciones que AI-Q ya tiene funcionando.",
    nav_sol: "Soluciones", nav_cta: "Agendá una llamada",
    free: "100% gratis", nodata: "No guardamos tus datos en AutomaScore",
    sap_title: "Tu entorno SAP", sap_opt: "opcional",
    sap_hint: "Marcá lo que tengan, o dictalo: lo que digas tilda las opciones. Revisalas antes de evaluar.",
    sap_ver: "Versión de SAP", sap_mod: "Módulos que ya compraron / usan",
    sap_free_ph: "Ej: Tenemos S/4HANA on-premise con FI, CO, MM y SD. HCM lo llevamos en SuccessFactors.",
    sap_parsed: "Detectamos y tildamos:", sap_none: "No detectamos versión ni módulos: tildalos arriba.",
    kicker: "Medidor de automatizabilidad",
    h1: "¿Qué tan automatizable es tu problema?",
    hero: "Contanos con tus palabras qué proceso te hace perder tiempo. Te decimos qué tan automatizable es y qué soluciones parecidas ya tenemos funcionando.",
    p1: "Describí el proceso",
    ph: "Ej: Todos los meses mi equipo recibe 200 certificados de retención en PDF y los carga a mano en SAP. Nos lleva dos días.",
    dict_lang: "Idioma del dictado", dictar: "Dictar", detener: "Detener",
    escuchando: "Escuchando… hablá con naturalidad y después revisá el texto.",
    mic_denied: "No tenemos permiso para usar el micrófono. Habilitalo en el navegador.",
    mic_nospeech: "No escuchamos nada. Probá de nuevo.",
    mic_nodev: "No encontramos un micrófono.",
    mic_net: "El dictado necesita conexión a internet.",
    mic_err: "No pudimos usar el dictado. Podés escribir el texto.",
    go: "Evaluar →", try: "Probá con",
    ex1: "resúmenes bancarios", ex2: "WhatsApp inmobiliaria", ex3: "decisión por criterio",
    ex1t: "Cada mes bajo los resúmenes del banco en PDF y los paso a Excel a mano para conciliar. Son 6 cuentas en distintos bancos.",
    ex2t: "Tengo una inmobiliaria y los clientes escriben por WhatsApp a cualquier hora preguntando por propiedades. No llego a contestar todo.",
    ex3t: "Mi jefe decide a ojo qué proveedores renegociar según cómo le cae cada uno.",
    note1: "Es una estimación orientativa basada en lo que escribas, no un diagnóstico. No incluyas datos sensibles ni confidenciales de tu empresa; no guardamos tus datos en AutomaScore: el texto se envía a la API de Anthropic solo para generar la estimación. Solo contamos cuántas evaluaciones se hacen, sin texto ni identificadores.",
    note2: 'AutomaScore es una herramienta de <a href="https://ai-q.fit">AI-Q</a>, soluciones de automatización con IA. <a href="{SOL}">Ver todas las soluciones →</a>',
    steps: ["Leyendo tu descripción","Cruzando con las 11 soluciones del catálogo","Puntuando 6 criterios","Armando tu informe"],
    thinking: "Analizando", secs: "unos segundos",
    short: "Contanos un poco más para poder evaluarlo.", fail: "No pudimos evaluar el caso. Probá de nuevo.",
    need: "Necesitamos un dato más", yourdesc: "Tu descripción:", defq: "¿Podés describir el proceso con más detalle?",
    ans_ph: "Tu respuesta…", ans_aria: "Tu respuesta", kept: "Tu descripción anterior se conserva", answer: "Responder →",
    est: "Automatizabilidad estimada", niv_alta: "alta", niv_media: "media", niv_baja: "baja",
    detail: "Detalle por criterio",
    crit: {repetitividad:"Repetitividad",reglas_claras:"Reglas claras",datos:"Datos digitales",integracion:"Integrabilidad",impacto:"Impacto",riesgo_bajo:"Riesgo bajo"},
    have: "Lo que ya tenemos funcionando", nomatch: "No encontramos una solución del catálogo que lo cubra tal cual, pero podemos evaluarlo a medida.",
    directo: "directo", adaptable: "adaptable",
    how: "Cómo se automatizaría", validate: "A validar en una llamada",
    cta1: "Agendá una llamada →", cta2: "Pedí una cotización", mailsub: "Consulta desde AutomaScore"
  },
  en: {
    title: "AutomaScore · How automatable is your problem?",
    desc: "Tell us which process wastes your time and we'll tell you how automatable it is, with examples of solutions AI-Q already has running.",
    nav_sol: "Solutions", nav_cta: "Book a call",
    free: "100% free", nodata: "We don't store your data in AutomaScore",
    sap_title: "Your SAP landscape", sap_opt: "optional",
    sap_hint: "Tick what you have, or dictate it: what you say ticks the options. Review them before scoring.",
    sap_ver: "SAP version", sap_mod: "Modules you already bought / use",
    sap_free_ph: "E.g.: We run S/4HANA on-premise with FI, CO, MM and SD. HR runs on SuccessFactors.",
    sap_parsed: "Detected and ticked:", sap_none: "No version or modules detected: tick them above.",
    kicker: "Automation scorecard",
    h1: "How automatable is your problem?",
    hero: "Tell us in your own words which process wastes your time. We'll tell you how automatable it is and which similar solutions we already have running.",
    p1: "Describe the process",
    ph: "E.g.: Every month my team receives 200 withholding-tax certificates as PDFs and enters them into SAP by hand. It takes us two days.",
    dict_lang: "Dictation language", dictar: "Dictate", detener: "Stop",
    escuchando: "Listening… speak naturally, then review the text.",
    mic_denied: "We don't have permission to use the microphone. Enable it in your browser.",
    mic_nospeech: "We didn't hear anything. Try again.",
    mic_nodev: "We couldn't find a microphone.",
    mic_net: "Dictation needs an internet connection.",
    mic_err: "We couldn't use dictation. You can type the text instead.",
    go: "Score it →", try: "Try",
    ex1: "bank statements", ex2: "real estate WhatsApp", ex3: "judgment call",
    ex1t: "Every month I download the bank statements as PDFs and copy them into Excel by hand to reconcile. We have 6 accounts at different banks.",
    ex2t: "I run a real estate agency and clients message me on WhatsApp at all hours asking about properties. I can't keep up with all of them.",
    ex3t: "My boss decides by gut feel which suppliers to renegotiate, depending on how much he likes each one.",
    note1: "This is an indicative estimate based on what you write, not a diagnosis. Don't include sensitive or confidential company data; we don't store your data in AutomaScore: the text is sent to Anthropic's API only to generate the estimate. We only count how many evaluations are made, with no text or identifiers.",
    note2: 'AutomaScore is a tool by <a href="https://ai-q.fit">AI-Q</a>, AI automation solutions. <a href="{SOL}">See all solutions →</a>',
    steps: ["Reading your description","Matching against our 11 catalog solutions","Scoring 6 criteria","Putting your report together"],
    thinking: "Analyzing", secs: "a few seconds",
    short: "Tell us a bit more so we can score it.", fail: "We couldn't score this case. Please try again.",
    need: "We need one more detail", yourdesc: "Your description:", defq: "Could you describe the process in more detail?",
    ans_ph: "Your answer…", ans_aria: "Your answer", kept: "Your earlier description is kept", answer: "Answer →",
    est: "Estimated automatability", niv_alta: "high", niv_media: "medium", niv_baja: "low",
    detail: "Breakdown by criterion",
    crit: {repetitividad:"Repetitiveness",reglas_claras:"Clear rules",datos:"Digital data",integracion:"Integrability",impacto:"Impact",riesgo_bajo:"Low risk"},
    have: "What we already have running", nomatch: "We didn't find a catalog solution that covers it as is, but we can assess it as a custom build.",
    directo: "direct", adaptable: "adaptable",
    how: "How it would be automated", validate: "To confirm on a call",
    cta1: "Book a call →", cta2: "Request a quote", mailsub: "Inquiry from AutomaScore"
  },
  pt: {
    title: "AutomaScore · Quão automatizável é o seu problema?",
    desc: "Conte qual processo faz você perder tempo e dizemos o quão automatizável ele é, com exemplos de soluções que a AI-Q já tem funcionando.",
    nav_sol: "Soluções", nav_cta: "Agende uma conversa",
    free: "100% gratuito", nodata: "Não guardamos seus dados no AutomaScore",
    sap_title: "Seu ambiente SAP", sap_opt: "opcional",
    sap_hint: "Marque o que vocês têm, ou dite: o que você disser marca as opções. Revise antes de avaliar.",
    sap_ver: "Versão do SAP", sap_mod: "Módulos que já compraram / usam",
    sap_free_ph: "Ex.: Temos S/4HANA on-premise com FI, CO, MM e SD. RH roda no SuccessFactors.",
    sap_parsed: "Detectamos e marcamos:", sap_none: "Não detectamos versão nem módulos: marque acima.",
    kicker: "Medidor de automatizabilidade",
    h1: "Quão automatizável é o seu problema?",
    hero: "Conte com as suas palavras qual processo faz você perder tempo. Dizemos o quão automatizável ele é e quais soluções parecidas já temos funcionando.",
    p1: "Descreva o processo",
    ph: "Ex.: Todo mês minha equipe recebe 200 certificados de retenção em PDF e lança manualmente no SAP. Leva dois dias.",
    dict_lang: "Idioma do ditado", dictar: "Ditar", detener: "Parar",
    escuchando: "Ouvindo… fale naturalmente e depois revise o texto.",
    mic_denied: "Não temos permissão para usar o microfone. Habilite-o no navegador.",
    mic_nospeech: "Não ouvimos nada. Tente novamente.",
    mic_nodev: "Não encontramos um microfone.",
    mic_net: "O ditado precisa de conexão com a internet.",
    mic_err: "Não foi possível usar o ditado. Você pode digitar o texto.",
    go: "Avaliar →", try: "Experimente",
    ex1: "extratos bancários", ex2: "WhatsApp imobiliária", ex3: "decisão por critério",
    ex1t: "Todo mês baixo os extratos do banco em PDF e passo para o Excel manualmente para conciliar. São 6 contas em bancos diferentes.",
    ex2t: "Tenho uma imobiliária e os clientes escrevem pelo WhatsApp a qualquer hora perguntando sobre imóveis. Não consigo responder a todos.",
    ex3t: "Meu chefe decide no olhômetro quais fornecedores renegociar, conforme a simpatia por cada um.",
    note1: "É uma estimativa orientativa baseada no que você escrever, não um diagnóstico. Não inclua dados sensíveis ou confidenciais da sua empresa; não guardamos seus dados no AutomaScore: o texto é enviado à API da Anthropic apenas para gerar a estimativa. Apenas contamos quantas avaliações são feitas, sem texto nem identificadores.",
    note2: 'AutomaScore é uma ferramenta da <a href="https://ai-q.fit">AI-Q</a>, soluções de automação com IA. <a href="{SOL}">Ver todas as soluções →</a>',
    steps: ["Lendo a sua descrição","Cruzando com as 11 soluções do catálogo","Pontuando 6 critérios","Montando o seu relatório"],
    thinking: "Analisando", secs: "alguns segundos",
    short: "Conte um pouco mais para podermos avaliar.", fail: "Não conseguimos avaliar o caso. Tente novamente.",
    need: "Precisamos de mais um dado", yourdesc: "Sua descrição:", defq: "Você pode descrever o processo com mais detalhes?",
    ans_ph: "Sua resposta…", ans_aria: "Sua resposta", kept: "Sua descrição anterior é mantida", answer: "Responder →",
    est: "Automatizabilidade estimada", niv_alta: "alta", niv_media: "média", niv_baja: "baixa",
    detail: "Detalhe por critério",
    crit: {repetitividad:"Repetitividade",reglas_claras:"Regras claras",datos:"Dados digitais",integracion:"Integrabilidade",impacto:"Impacto",riesgo_bajo:"Baixo risco"},
    have: "O que já temos funcionando", nomatch: "Não encontramos uma solução do catálogo que cubra isso como está, mas podemos avaliar sob medida.",
    directo: "direto", adaptable: "adaptável",
    how: "Como seria automatizado", validate: "A validar em uma conversa",
    cta1: "Agende uma conversa →", cta2: "Peça um orçamento", mailsub: "Consulta pelo AutomaScore"
  }
};
// Nombres y áreas de las soluciones en EN/PT (en ES vienen del Worker). consorcios no tiene página en EN/PT.
const NM = {
  contratos:    {en:["Contract Operations Control","Operations & collections"], pt:["Controle Operacional de Contratos","Operações e cobrança"], pag:"estado-contratos"},
  retenciones:  {en:["Withholding Tax Reconciliation","Accounting & treasury"], pt:["Conciliação de Retenções","Contabilidade e tesouraria"], pag:"retenciones"},
  order2cash:   {en:["Export Order-to-Cash","Foreign trade & finance"], pt:["Order-to-Cash de Exportações","Comércio exterior e finanças"], pag:"order2cash"},
  bancos:       {en:["Bank Statements","Finance"], pt:["Extratos Bancários","Finanças"], pag:"bancos"},
  "notas-debito":{en:["Bank Debit Notes","Accounting & treasury"], pt:["Notas de Débito Bancárias","Contabilidade e tesouraria"], pag:"notas-debito"},
  "activos-fijos":{en:["Fixed Assets · AxI","Fixed assets & accounting"], pt:["Ativos Fixos · AxI","Ativos fixos e contabilidade"], pag:"amortizaciones"},
  gimnasios:    {en:["Gyms & Academies","Operations (membership businesses)"], pt:["Academias e Estúdios","Operações (negócios de assinatura)"], pag:"gimnasios"},
  rrhh:         {en:["HR Automation","Human Resources"], pt:["Automação de RH","Recursos Humanos"], pag:"rrhh"},
  redes:        {en:["Daily Social Media Posting","Marketing & social media"], pt:["Postagem Diária em Redes","Marketing e redes sociais"], pag:"posteo-redes"},
  inmobiliaria: {en:["Real Estate · AI Assistant","Real estate (Argentina)"], pt:["Imobiliárias · Assistente IA","Imobiliárias (Argentina)"], pag:"inmobiliaria"},
  consorcios:   {en:["Withholding Invoices (Condo Management)","Condo / HOA management"], pt:["Faturas com Retenção (Condomínios)","Administração de condomínios"], pag:null}
};
const DICT = {es:"es-AR", en:"en-US", pt:"pt-BR"};


// ---------- Versión BCI: marca y entorno SAP ----------
const BRAND_TXT = {
  bci: {
    es: { title: "AutomaScore · bci consulting", hero: "Contanos con tus palabras qué proceso te hace perder tiempo y qué SAP tienen. Te decimos qué tan automatizable es y qué soluciones parecidas ya están funcionando.", kicker: "bci consulting · Medidor de automatizabilidad",
          note2: "AutomaScore es una herramienta de bci consulting. Los ejemplos se toman del catálogo de soluciones de AI-Q." },
    en: { title: "AutomaScore · bci consulting", hero: "Tell us in your own words which process wastes your time and which SAP you run. We'll tell you how automatable it is and which similar solutions are already running.", kicker: "bci consulting · Automation scorecard",
          note2: "AutomaScore is a bci consulting tool. Examples are drawn from the AI-Q solutions catalog." },
    pt: { title: "AutomaScore · bci consulting", hero: "Conte com as suas palavras qual processo faz você perder tempo e qual SAP vocês usam. Dizemos o quão automatizável ele é e quais soluções parecidas já estão funcionando.", kicker: "bci consulting · Medidor de automatizabilidade",
          note2: "AutomaScore é uma ferramenta da bci consulting. Os exemplos vêm do catálogo de soluções da AI-Q." }
  }
};
if (BRAND_TXT[BRAND]) for (const l in BRAND_TXT[BRAND]) Object.assign(I18N[l], BRAND_TXT[BRAND][l]);

const SAP_VER = [
  {k:"s4pub",  es:"S/4HANA Cloud Public Edition", en:"S/4HANA Cloud Public Edition", pt:"S/4HANA Cloud Public Edition", re:/public\s*edition|cloud\s*public|s\s*\/?\s*4\s*hana.{0,25}public|grow\s*with\s*sap/i},
  {k:"s4priv", es:"S/4HANA Cloud Private Edition", en:"S/4HANA Cloud Private Edition", pt:"S/4HANA Cloud Private Edition", re:/private\s*edition|cloud\s*private|s\s*\/?\s*4\s*hana.{0,25}private|rise\s*with\s*sap/i},
  {k:"s4op",   es:"S/4HANA On-Premise", en:"S/4HANA On-Premise", pt:"S/4HANA On-Premise", re:/on[\s-]*prem(ise)?s?\b|onpremise|en\s+premisa/i, needs4:true},
  {k:"s4",     es:"S/4HANA (edición a confirmar)", en:"S/4HANA (edition to be confirmed)", pt:"S/4HANA (edição a confirmar)", re:/s\s*\/?\s*4\s*hana|s4hana|s\s*cuatro|sap\s*hana/i, generic:true},
  {k:"ecc",    es:"SAP ECC 6.0", en:"SAP ECC 6.0", pt:"SAP ECC 6.0", re:/\becc\b|\berp\s*6|\br\s*\/\s*3\b/i},
  {k:"b1",     es:"SAP Business One", en:"SAP Business One", pt:"SAP Business One", re:/business\s*one|\bb1\b/i},
  {k:"bbd",    es:"SAP Business ByDesign", en:"SAP Business ByDesign", pt:"SAP Business ByDesign", re:/by\s*design|bydesign/i},
  {k:"unk",    es:"No lo sé", en:"I don't know", pt:"Não sei", excl:true},
  {k:"none",   es:"Todavía no usamos SAP", en:"We don't use SAP yet", pt:"Ainda não usamos SAP", excl:true,
            re:/(no|todav[ií]a\s+no|a[uú]n\s+no)\s+(tenemos|usamos|tengo|uso)\s+sap|sin\s+sap|(don'?t|do\s+not)\s+(use|have)\s+sap|n[aã]o\s+(temos|usamos)\s+sap/i}
];
const SAP_MOD = [
  {k:"FI",  es:"Finanzas (FI)", en:"Financial Accounting (FI)", pt:"Contabilidade Financeira (FI)", re:/\bfi\b|finanzas|contabilidad|financial|financeir|cont[aá]bil/i},
  {k:"CO",  es:"Controlling (CO)", en:"Controlling (CO)", pt:"Controladoria (CO)", re:/\bco\b|controlling|controladoria/i},
  {k:"MM",  es:"Compras y materiales (MM)", en:"Procurement & materials (MM)", pt:"Compras e materiais (MM)", re:/\bmm\b|compras|materiales|materials|procurement|suprimentos|materiais/i},
  {k:"SD",  es:"Ventas y distribución (SD)", en:"Sales & distribution (SD)", pt:"Vendas e distribuição (SD)", re:/\bsd\b|ventas|distribuci[oó]n|sales\s*(and|&)?\s*distribution|vendas|distribui[cç][aã]o/i},
  {k:"PP",  es:"Producción (PP)", en:"Production planning (PP)", pt:"Produção (PP)", re:/\bpp\b|producci[oó]n|production|produ[cç][aã]o|manufactura/i},
  {k:"QM",  es:"Calidad (QM)", en:"Quality management (QM)", pt:"Qualidade (QM)", re:/\bqm\b|calidad|quality|qualidade/i},
  {k:"PM",  es:"Mantenimiento (PM/EAM)", en:"Maintenance (PM/EAM)", pt:"Manutenção (PM/EAM)", re:/\bpm\b|\beam\b|mantenimiento|maintenance|manuten[cç][aã]o/i},
  {k:"WM",  es:"Almacenes (WM/EWM)", en:"Warehouse (WM/EWM)", pt:"Armazéns (WM/EWM)", re:/\bwm\b|\bewm\b|almac[eé]n|almacenes|warehouse|armaz[eé]m|armaz[eé]ns/i},
  {k:"PS",  es:"Proyectos (PS)", en:"Project system (PS)", pt:"Projetos (PS)", re:/\bps\b|proyectos|project\s*system|projetos/i},
  {k:"TM",  es:"Transporte (TM)", en:"Transportation (TM)", pt:"Transporte (TM)", re:/\btm\b|transporte|transportation/i},
  {k:"HCM", es:"RR.HH. (HCM)", en:"HR (HCM)", pt:"RH (HCM)", re:/\bhcm\b|rrhh|recursos\s+humanos|human\s+resources|payroll|n[oó]mina|folha|recursos\s+humanos/i},
  {k:"SF",  es:"SuccessFactors", en:"SuccessFactors", pt:"SuccessFactors", re:/success\s*factors/i},
  {k:"ARIBA", es:"Ariba", en:"Ariba", pt:"Ariba", re:/ariba/i},
  {k:"CONCUR", es:"Concur", en:"Concur", pt:"Concur", re:/concur/i},
  {k:"FG",  es:"Fieldglass", en:"Fieldglass", pt:"Fieldglass", re:/field\s*glass/i},
  {k:"BTP", es:"Business Technology Platform (BTP)", en:"Business Technology Platform (BTP)", pt:"Business Technology Platform (BTP)", re:/\bbtp\b|business\s+technology\s+platform/i},
  {k:"FIORI", es:"Fiori", en:"Fiori", pt:"Fiori", re:/fiori/i},
  {k:"JOULE", es:"Joule Studio", en:"Joule Studio", pt:"Joule Studio", re:/joule/i},
  {k:"SAC", es:"Analytics Cloud (SAC)", en:"Analytics Cloud (SAC)", pt:"Analytics Cloud (SAC)", re:/analytics\s+cloud|\bsac\b/i},
  {k:"BW",  es:"BW / Datasphere", en:"BW / Datasphere", pt:"BW / Datasphere", re:/\bbw\b|datasphere|bw\s*\/\s*4/i},
  {k:"GRC", es:"GRC", en:"GRC", pt:"GRC", re:/\bgrc\b/i},
  {k:"IBP", es:"Planificación integrada (IBP)", en:"Integrated Business Planning (IBP)", pt:"Planejamento integrado (IBP)", re:/\bibp\b|integrated\s+business\s+planning/i},
  {k:"CX",  es:"Customer Experience (CX)", en:"Customer Experience (CX)", pt:"Customer Experience (CX)", re:/\bcx\b|customer\s+experience|commerce\s+cloud|sales\s+cloud|service\s+cloud/i}
];
const selVer = new Set(), selMod = new Set();

function renderSap() {
  const box = $("sapver"); if (!box) return;
  const mk = (list, set, name) => list.map(o => `<label class="check"><input type="checkbox" data-k="${o.k}" data-g="${name}" ${set.has(o.k) ? "checked" : ""}><span>${esc(o[UI])}</span></label>`).join("");
  box.innerHTML = mk(SAP_VER, selVer, "ver");
  $("sapmods").innerHTML = mk(SAP_MOD, selMod, "mod");
  document.querySelectorAll("#sapbox input[type=checkbox]").forEach(cb => cb.onchange = () => {
    const set = cb.dataset.g === "ver" ? selVer : selMod, k = cb.dataset.k;
    if (cb.checked) {
      set.add(k);
      if (cb.dataset.g === "ver") {                                   // "No lo sé" / "No usamos SAP" son excluyentes
        const excl = SAP_VER.filter(o => o.excl).map(o => o.k);
        if (excl.includes(k)) [...selVer].forEach(x => { if (x !== k) selVer.delete(x); });
        else excl.forEach(x => selVer.delete(x));
        renderSap();
      }
    } else set.delete(k);
  });
}

// Lee un texto (dictado o escrito) y tilda las opciones que reconoce. Solo agrega marcas, nunca quita las del usuario.
function sapParse(txt) {
  const hits = [];
  const f = {};
  SAP_VER.forEach(o => { f[o.k] = o.re ? o.re.test(txt) : false; });
  const habla4 = /s\s*\/?\s*4|hana/i.test(txt);
  if (f.s4op && !habla4) f.s4op = false;                              // "on-premise" suelto no basta: tiene que hablar de S/4
  if (f.s4pub || f.s4priv || f.s4op) f.s4 = false;                    // ya se sabe la edición: no tildar la genérica
  if (f.none) {                                                       // "no usamos SAP" excluye todo lo demás
    selVer.clear(); selVer.add("none"); hits.push(SAP_VER.find(o => o.k === "none")[UI]);
  } else {
    SAP_VER.forEach(o => { if (f[o.k]) { selVer.add(o.k); hits.push(o[UI]); } });
    if (hits.length) ["unk","none"].forEach(x => selVer.delete(x));
  }
  SAP_MOD.forEach(o => { if (o.re.test(txt)) { selMod.add(o.k); hits.push(o[UI]); } });
  return hits;
}

function sapPayload() {
  const version = SAP_VER.filter(o => selVer.has(o.k)).map(o => o.es);
  const modulos = SAP_MOD.filter(o => selMod.has(o.k)).map(o => o.es);
  const texto = ($("sapfree")?.value || "").trim().slice(0, 400);
  return (version.length || modulos.length || texto) ? {version, modulos, texto} : null;
}

function initSap() {
  if (!SAPMODE || !$("sapbox")) return;
  renderSap();
  const ta = $("sapfree"), out = $("sapparsed");
  let tm = null;
  ta.addEventListener("input", () => {
    clearTimeout(tm);
    tm = setTimeout(() => {
      const hits = sapParse(ta.value);
      renderSap();
      out.textContent = ta.value.trim() ? (hits.length ? t("sap_parsed") + " " + [...new Set(hits)].join(", ") : t("sap_none")) : "";
    }, 250);
  });
  dictado(ta, $("sapmic"), $("lang"), $("sapmsg"));
}

let UI = "es";
const t = k => I18N[UI][k];

// ---------- Idioma: país del visitante → idioma del navegador; la elección manual se recuerda ----------
const PT_C = ["BR","PT","AO","MZ","CV","GW","ST","TL"];
const ES_C = ["AR","UY","PY","BO","CL","PE","EC","CO","VE","MX","GT","HN","SV","NI","CR","PA","CU","DO","PR","ES","GQ"];
const porPais = c => PT_C.includes(c) ? "pt" : ES_C.includes(c) ? "es" : "en";
const porNavegador = () => { const l = (navigator.language || "").toLowerCase(); return l.startsWith("pt") ? "pt" : l.startsWith("es") ? "es" : "en"; };
let eligioIdioma = false;

let lastD = null;            // último resultado mostrado, para re-dibujarlo al cambiar de idioma
function aplicarIdioma(l, manual) {
  UI = l;
  const T = I18N[l];
  document.documentElement.lang = l;
  document.title = T.title;
  const md = document.querySelector('meta[name="description"]'); if (md) md.content = T.desc;
  const sol = "https://ai-q.fit/soluciones" + (l === "es" ? "" : "-" + l) + ".html";
  if ($("navsol")) $("navsol").href = sol;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.innerHTML = T[el.dataset.i18n].replace("{SOL}", sol); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = T[el.dataset.i18nPh]);
  document.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", T[el.dataset.i18nAria]));
  document.querySelectorAll(".chip").forEach(c => c.querySelector(".lbl").textContent = T["ex" + c.dataset.ex]);
  document.querySelectorAll("#uilang button").forEach(b => b.classList.toggle("active", b.dataset.l === l));
  const mic = $("mic"), on = mic.classList.contains("on");
  mic.querySelector(".lbl").textContent = on ? T.detener : T.dictar;
  // El dictado sigue al idioma de la página (el visitante puede cambiarlo después en su selector)
  const sel = $("lang");
  if (sel.value !== DICT[l]) { sel.value = DICT[l]; sel.dispatchEvent(new Event("change")); }
  if (SAPMODE) { renderSap(); const m2 = $("sapmic"); if (m2) m2.querySelector(".lbl").textContent = m2.classList.contains("on") ? T.detener : T.dictar; }
  if (lastD) pintar(lastD, false);
  if (manual) { eligioIdioma = true; try { localStorage.setItem("as_lang", l); } catch {} }
}
document.querySelectorAll("#uilang button").forEach(b => b.onclick = () => aplicarIdioma(b.dataset.l, true));

$("t").addEventListener("input", e => $("c").textContent = e.target.value.length + " / " + MAXC);
document.querySelectorAll(".chip").forEach(a => a.onclick = () => { $("t").value = t("ex" + a.dataset.ex + "t"); $("t").dispatchEvent(new Event("input")); $("t").focus(); });

// ---- Dictado por voz (Web Speech API del navegador) ----
// Reutilizable: lo usan el cuadro principal y el de respuesta a la repregunta.
let detenerDictado = null;               // solo un dictado activo a la vez
function dictado(ta, mic, sel, msg) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;                       // navegador sin soporte: el botón queda oculto
  mic.hidden = false; sel.hidden = false;
  const rec = new SR();
  rec.lang = sel.value;
  rec.continuous = true;
  rec.interimResults = true;
  const max = +ta.maxLength > 0 ? +ta.maxLength : MAXC;
  let base = "", listening = false;
  sel.addEventListener("change", () => { if (listening) rec.stop(); rec.lang = sel.value; });
  const setUI = on => {
    listening = on;
    mic.classList.toggle("on", on);
    mic.setAttribute("aria-pressed", on);
    mic.querySelector(".lbl").textContent = on ? t("detener") : t("dictar");
    msg.textContent = on ? t("escuchando") : "";
  };
  rec.onresult = e => {
    let finals = "", interim = "";
    for (let i = 0; i < e.results.length; i++) {
      const tr = e.results[i][0].transcript;
      e.results[i].isFinal ? finals += tr : interim += tr;
    }
    ta.value = (base + " " + finals + interim).replace(/\s+/g, " ").trim().slice(0, max);
    ta.dispatchEvent(new Event("input"));
  };
  rec.onerror = e => {
    const m = {"not-allowed":t("mic_denied"), "no-speech":t("mic_nospeech"), "audio-capture":t("mic_nodev"), "network":t("mic_net")};
    setUI(false);
    msg.textContent = m[e.error] || t("mic_err");
  };
  rec.onend = () => { if (listening) setUI(false); };
  mic.onclick = () => {
    if (listening) { rec.stop(); return; }
    if (detenerDictado) detenerDictado();          // corta el otro dictado si estaba activo
    base = ta.value.trim();
    try { rec.start(); setUI(true); detenerDictado = () => rec.stop(); } catch { /* ya estaba iniciado */ }
  };
}
dictado($("t"), $("mic"), $("lang"), $("micmsg"));

// ---- Estado "analizando" ----
let timer = null;
function showThinking() {
  const steps = t("steps");
  const li = steps.map((s, i) => `<li data-i="${i}"><i></i>${esc(s)}</li>`).join("");
  $("think").innerHTML = `<section class="panel think" role="status"><div class="panel-header"><span><span class="accent">●</span> ${esc(t("thinking"))}</span><span class="kicker-tiny">${esc(t("secs"))}</span></div>
    <div class="panel-body"><ul class="steps">${li}</ul><div class="scan"></div></div></section>`;
  let n = 0;
  const paint = () => document.querySelectorAll("#think .steps li").forEach((el, i) => {
    el.className = i < n ? "done" : i === n ? "now" : "";
  });
  paint();
  clearInterval(timer);
  timer = setInterval(() => { if (n < steps.length - 1) { n++; paint(); } }, 2200);
  $("think").scrollIntoView({behavior: "smooth", block: "center"});
}
function hideThinking() { clearInterval(timer); $("think").innerHTML = ""; }

// La descripción original y las respuestas a repreguntas se guardan acá, no en el cuadro de texto,
// para que el contexto no se pierda aunque el visitante edite o borre el cuadro.
let contexto = "";
let ocupado = false;

// Dibuja un resultado (o la repregunta) y conecta sus botones.
function pintar(d, scroll) {
  const out = $("out");
  const prev = $("t2") ? $("t2").value : "";
  lastD = d;
  out.innerHTML = render(d);
  if (d.suficiente_info === false) {
    const t2n = $("t2"), go2 = $("go2");
    t2n.value = prev;
    const l2 = $("lang2"); l2.value = $("lang").value;   // hereda el idioma elegido arriba
    dictado(t2n, $("mic2"), l2, $("micmsg2"));
    if (scroll) t2n.focus();
    t2n.addEventListener("keydown", e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) go2.click(); });
    go2.onclick = () => {
      if (detenerDictado) detenerDictado();
      const resp = t2n.value.trim();
      if (resp.length < 3) { t2n.focus(); return; }
      contexto += `\n\n[Pregunta de AI-Q] ${d.pregunta || ""}\n[Respuesta del visitante] ${resp}`;
      evaluar();
    };
  } else if (scroll) {
    out.scrollIntoView({behavior: "smooth", block: "start"});
  }
}

async function evaluar() {
  if (ocupado) return;
  ocupado = true;
  const out = $("out");
  const t2 = $("t2");
  document.querySelectorAll("#go, #go2").forEach(b => b.disabled = true);
  $("t").disabled = true; if (t2) t2.disabled = true;
  out.classList.add("busy");           // lo anterior queda visible pero atenuado: nada desaparece de golpe
  showThinking();
  let d = null, errHtml = "";
  try {
    const r = await fetch(ENDPOINT, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({texto: contexto, lang: UI, brand: BRAND, sap: SAPMODE ? sapPayload() : null})});
    d = await r.json();
    if (!r.ok) throw new Error(d.error || "Error");
  } catch (e) {
    d = null;
    errHtml = '<div class="err" role="alert">' + esc(e.message || t("fail")) + '</div>';
  }
  hideThinking();
  out.classList.remove("busy");
  if (d) pintar(d, true);
  else out.insertAdjacentHTML("afterbegin", errHtml);
  $("t").disabled = false;
  if ($("t2")) $("t2").disabled = false;
  document.querySelectorAll("#go, #go2").forEach(b => b.disabled = false);
  ocupado = false;
}

$("go").onclick = () => {
  if (detenerDictado) detenerDictado();   // corta el dictado antes de enviar
  const texto = $("t").value.trim();
  if (texto.length < 25) { $("out").innerHTML = '<div class="err" role="alert">' + esc(t("short")) + '</div>'; lastD = null; return; }
  contexto = texto;
  lastD = null;
  evaluar();
};

function render(d) {
  if (d.suficiente_info === false) {
    return `<section class="panel"><div class="panel-header"><span><span class="accent">${NUM}</span> / ${esc(t("need"))}</span></div>
      <div class="panel-body">
        <div class="recap"><b>${esc(t("yourdesc"))}</b> ${esc(contexto.split("\n\n[Pregunta")[0])}</div>
        <p class="q">${esc(d.pregunta || t("defq"))}</p>
        <textarea id="t2" class="textarea" maxlength="600" style="min-height:90px" placeholder="${esc(t("ans_ph"))}" aria-label="${esc(t("ans_aria"))}"></textarea>
        <div class="row"><div class="btns">
          <select id="lang2" class="select" hidden aria-label="${esc(t("dict_lang"))}"><option value="es-AR">ES</option><option value="en-US">EN</option><option value="pt-BR">PT</option></select>
          <button id="mic2" class="btn mic" type="button" hidden aria-pressed="false"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="8"/><path d="M3 7.5a5 5 0 0010 0M8 12.5v2"/></svg><span class="dot"></span><span class="lbl">${esc(t("dictar"))}</span></button>
        </div><button id="go2" class="btn primary" type="button">${esc(t("answer"))}</button></div>
        <p id="micmsg2" style="font-size:12px;color:var(--aq-ink2);margin:10px 0 0;min-height:1em" aria-live="polite"></p>
      </div></section>`;
  }
  const C = t("crit");
  const crit = Object.keys(C).map(k => {
    const v = Math.min(5, Math.max(1, d.criterios?.[k] || 1));
    return `<div class="crit"><span>${esc(C[k])}</span><div class="cells">${[1,2,3,4,5].map(i => `<s class="${i <= v ? "on" : ""}"></s>`).join("")}</div><b>${v}</b></div>`;
  }).join("");
  const matches = (d.matches || []).map(m => {
    const n = NM[m.id];
    const nombre = UI !== "es" && n ? n[UI][0] : m.nombre;
    const area = UI !== "es" && n ? n[UI][1] : m.area;
    const url = UI !== "es" && n && n.pag ? `https://ai-q.fit/${n.pag}-${UI}.html` : m.url;
    return `<div class="match"><a href="${esc(url)}" target="_blank" rel="noopener">${esc(nombre)}</a>
    <span class="label-tag ${m.tipo === 'directo' ? 'accent' : ''}">${esc(t(m.tipo) || m.tipo)}</span>
    <p>${esc(area)} · ${esc(m.por_que)}</p></div>`;
  }).join("");
  const val = (d.puntos_a_validar || []).map(p => `<li>${esc(p)}</li>`).join("");
  return `
  <section class="panel ${d.nivel}"><div class="panel-header"><span><span class="accent">${NUM}</span> / ${esc(t("est"))}</span></div>
    <div class="panel-body">
      <div class="score"><b>${d.puntaje}<small>/100</small></b><span class="lvl">${esc(t("niv_" + d.nivel) || d.nivel)}</span></div>
      <div class="meter"><i style="width:${d.puntaje}%"></i></div>
      <p class="res" style="color:var(--aq-ink)">${esc(d.resumen)}</p>
    </div></section>
  <section class="panel"><div class="panel-header"><span>${esc(t("detail"))}</span></div><div class="panel-body">${crit}</div></section>
  <section class="panel"><div class="panel-header"><span>${esc(t("have"))}</span></div><div class="panel-body">${matches || "<p style='margin:0'>" + esc(t("nomatch")) + "</p>"}</div></section>
  <section class="panel"><div class="panel-header"><span>${esc(t("how"))}</span></div><div class="panel-body"><p style="margin:0">${esc(d.como_se_automatizaria)}</p></div></section>
  ${val ? `<section class="panel"><div class="panel-header"><span>${esc(t("validate"))}</span></div><div class="panel-body"><ul>${val}</ul></div></section>` : ""}
  <div class="cta"><a class="btn accent btn-lg" href="${CALENDLY}" target="_blank" rel="noopener">${esc(t("cta1"))}</a>
  <a class="btn btn-lg" href="mailto:fedeandino@ai-q.fit?subject=${encodeURIComponent(t("mailsub"))}">${esc(t("cta2"))}</a></div>
  <div style="height:var(--aq-space-6)"></div>`;
}

initSap();

// ---- Arranque: idioma guardado → país (Cloudflare /cdn-cgi/trace) → idioma del navegador ----
(async () => {
  let guardado = null;
  try { guardado = localStorage.getItem("as_lang"); } catch {}
  if (guardado && I18N[guardado]) { aplicarIdioma(guardado, false); eligioIdioma = true; return; }
  aplicarIdioma(porNavegador(), false);                 // pinta ya, sin esperar la red
  try {
    const r = await fetch("/cdn-cgi/trace", {cache: "no-store"});
    const loc = (await r.text()).match(/^loc=([A-Z]{2})$/m);
    if (loc && loc[1] !== "XX" && loc[1] !== "T1" && !eligioIdioma) aplicarIdioma(porPais(loc[1]), false);
  } catch { /* sin geolocalización: queda el idioma del navegador */ }
})();
