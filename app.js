(function () {
  "use strict";
  var C = window.LP_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Dados institucionais vindos do config ---------- */
  if (C.oab) {
    $$('[data-cfg="oab"]').forEach(function (el) { el.textContent = C.oab; });
    $$('[data-cfg-row="oab"]').forEach(function (el) { el.hidden = false; });
  }
  if (C.endereco) {
    $$('[data-cfg="endereco-full"]').forEach(function (el) { el.textContent = C.endereco; });
    $$('[data-cfg-row="endereco"]').forEach(function (el) { el.hidden = false; });
  }
  var faq = {
    presencial_e_online: "Não é obrigatório. Você pode ser atendido no escritório, em Três Pontas, ou à distância, pelo WhatsApp e por chamada. A equipe combina com você a forma mais confortável.",
    online: "Não. O atendimento pode ser feito à distância, pelo WhatsApp e por chamada, sem precisar sair de casa.",
    presencial: "O primeiro contato pode ser feito pelo WhatsApp. Depois, a equipe agenda o atendimento no escritório, em Três Pontas."
  };
  if (faq[C.modalidadeAtendimento]) $("#faq-presencial").textContent = faq[C.modalidadeAtendimento];

  /* ---------- UTMs e identificadores de anúncio (guardados na sessão) ---------- */
  var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];
  var qs = new URLSearchParams(location.search);
  keys.forEach(function (k) { if (qs.get(k)) store.set("lp_" + k, qs.get(k).slice(0, 200)); });
  try { if (document.referrer && !store.get("lp_ref")) { var rh = new URL(document.referrer).hostname; if (rh !== location.hostname) store.set("lp_ref", rh); } } catch (e) {}

  /* ---------- 1 visita por carregamento de página ---------- */
  setTimeout(function () {
    sbPost("lp_visits", {
      site: C.site || "brisida-paliao",
      referrer: (document.referrer || "").slice(0, 300) || null,
      path: (location.pathname + location.search).slice(0, 300)
    }).catch(function () {});
  }, 400);


  /* ---------- Revelação suave das ilustrações ---------- */
  var rev = $$("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    rev.forEach(function (el) { ro.observe(el); });
  } else rev.forEach(function (el) { el.classList.add("in"); });

  /* ---------- Passos x marcações no extrato (seção 05) ---------- */
  function mark(n) {
    $$("#doc [data-step]").forEach(function (el) {
      var on = el.getAttribute("data-step") === n;
      el.classList.toggle("hl", on && el.classList.contains("d-row"));
      var p = el.querySelector(".pin"); if (p) p.classList.toggle("hl", on);
    });
    $$("#passos li").forEach(function (li) { li.classList.toggle("hl", li.getAttribute("data-step") === n); });
  }
  $$("#passos li").forEach(function (li) {
    var n = li.getAttribute("data-step");
    ["mouseenter", "focus", "click"].forEach(function (ev) { li.addEventListener(ev, function () { mark(n); }); });
  });
  var passos = $("#passos");
  if (passos) passos.addEventListener("mouseleave", function () { mark(null); });

  /* ---------- Lista de situações (seção 02) ---------- */
  var msg = $("#ledger-msg"), lcta = $("#ledger-cta");
  var base = msg ? msg.innerHTML : "";
  var curtas = ["empréstimo que não lembro de ter contratado", "descontos que não consigo identificar",
    "cartão consignado que desconta e a dívida não diminui", "seguro ou associação que não autorizei",
    "cartão que eu achava que era empréstimo"];
  $$("#ledger input").forEach(function (cb, i) {
    cb.setAttribute("data-curta", curtas[i] || "");
    cb.addEventListener("change", function () {
      var marcados = $$("#ledger input:checked");
      var n = marcados.length;
      store.set("lp_situacoes", marcados.map(function (m) { return m.getAttribute("data-curta"); }).join("; "));
      msg.innerHTML = n === 0 ? base
        : "Você marcou <strong>" + n + (n === 1 ? " situação" : " situações") + "</strong>. Envie para a equipe: o que você marcou já vai junto na mensagem.";
      if (lcta) lcta.lastChild.textContent = n === 0 ? " Conversar com a equipe" : " Enviar para a equipe";
    });
  });

  /* ---------- Botão flutuante: aparece depois do topo, some quando um formulário está na tela ---------- */
  var flut = $("#flut"), hero = $("#inicio");
  if ("IntersectionObserver" in window && flut) {
    var vis = new Map();
    var upd = function () { var any = false; vis.forEach(function (v) { if (v) any = true; }); flut.classList.toggle("on", !any); };
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { vis.set(e.target, e.isIntersecting); }); upd(); }, { threshold: 0.05 });
    io.observe(hero); $$("form[data-lead]").forEach(function (f) { io.observe(f); });
  }

  /* ---------- CTAs: guardam o contexto e levam ao formulário ---------- */
  var finalForm = $("#lead-form"), tag = finalForm ? finalForm.querySelector(".assunto-tag") : null;
  function showAssunto() {
    var as = store.get("lp_assunto");
    if (tag) { tag.hidden = !as; if (as) tag.textContent = "Assunto: " + as; }
  }
  $$('a[href="#contato"]').forEach(function (a) {
    a.addEventListener("click", function () {
      store.set("lp_cta", a.getAttribute("data-cta") || "");
      if (a.hasAttribute("data-assunto")) store.set("lp_assunto", a.getAttribute("data-assunto"));
      showAssunto();
      setTimeout(function () { var i = $("#f-nome"); if (i && !i.value) i.focus({ preventScroll: true }); }, 500);
    });
  });
  showAssunto();

  /* ---------- Formulários (topo e final) ---------- */
  function digits(v) { return (v || "").replace(/\D/g, ""); }
  function maskTel(v) {
    var d = digits(v);
    if (d.length > 11 && d.indexOf("55") === 0) d = d.slice(2);
    d = d.slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }
  function validNome(v) { v = (v || "").trim(); return v.length >= 2 && /[A-Za-zÀ-ÿ]/.test(v); }
  function validTel(v) {
    var d = digits(v);
    if (d.length !== 10 && d.length !== 11) return false;
    if (/^(\d)\1+$/.test(d)) return false;
    var ddd = +d.slice(0, 2);
    if (ddd < 11 || ddd > 99) return false;
    if (d.length === 11 && d[2] !== "9") return false;
    return true;
  }

  function sbPost(table, row) {
    if (!C.supabaseUrl || !C.supabaseAnonKey) {
      if (window.console) console.warn("[LP] Supabase não configurado: nada foi gravado (modo de teste).");
      return Promise.resolve();
    }
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var t = ctrl ? setTimeout(function () { ctrl.abort(); }, 10000) : null;
    return fetch(C.supabaseUrl.replace(/\/$/, "") + "/rest/v1/" + table, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": C.supabaseAnonKey, "Authorization": "Bearer " + C.supabaseAnonKey, "Prefer": "return=minimal" },
      body: JSON.stringify(row),
      keepalive: true,
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) { if (t) clearTimeout(t); if (!r.ok) throw new Error("HTTP " + r.status); });
  }
  function origemLead() {
    var src = store.get("lp_utm_source"), camp = store.get("lp_utm_campaign");
    if (src) return (src + (camp ? " / " + camp : "")).slice(0, 120);
    if (store.get("lp_fbclid")) return "meta";
    if (store.get("lp_gclid")) return "google";
    var ref = store.get("lp_ref");
    return ref ? ("site: " + ref).slice(0, 120) : "direto";
  }
  function saveLead(p) {
    return sbPost("lp_leads", {
      site: C.site || "brisida-paliao",
      nome: p.nome,
      whatsapp: p.telefone,
      origem: origemLead(),
      servico: p.assunto || null
    });
  }
  function track(eventId) {
    try { if (window.fbq) window.fbq("track", "Lead", {}, { eventID: eventId }); } catch (e) {}
    try { if (window.gtag && C.googleAdsId && C.googleAdsLeadLabel) window.gtag("event", "conversion", { send_to: C.googleAdsId + "/" + C.googleAdsLeadLabel }); } catch (e) {}
  }

  var sending = false;
  $$("form[data-lead]").forEach(function (form) {
    var nome = form.querySelector('[name="nome"]'), tel = form.querySelector('[name="telefone"]');
    var hp = form.querySelector('[name="site"]'), btn = form.querySelector('button[type="submit"]');
    var status = form.querySelector(".form-status"), label = btn.querySelector("span"), labelTxt = label.textContent;

    function check(input) {
      var ok = input === nome ? validNome(input.value) : validTel(input.value);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      var e = document.getElementById(input.getAttribute("aria-describedby")); if (e) e.classList.toggle("on", !ok);
      return ok;
    }
    function setStatus(t, erro) { status.textContent = t; status.className = "form-status" + (erro ? " erro" : ""); }
    function busy(b) { sending = b; btn.disabled = b; label.textContent = b ? "Enviando…" : labelTxt; }

    tel.addEventListener("input", function () { tel.value = maskTel(tel.value); if (tel.getAttribute("aria-invalid") === "true") check(tel); });
    nome.addEventListener("input", function () { if (nome.getAttribute("aria-invalid") === "true") check(nome); });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (sending) return;
      var a = check(nome), b = check(tel);
      if (!a || !b) { (a ? tel : nome).focus(); setStatus("Confira o campo marcado em vermelho.", true); return; }
      if (hp && hp.value) return;

      var d = digits(tel.value);
      store.set("lp_nome", nome.value.trim().split(/\s+/)[0]);
      if (store.get("lp_sent") === d) { location.href = "redirect/index.html"; return; }

      var eventId = "lead-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
      var payload = {
        nome: nome.value.trim().replace(/\s+/g, " ").slice(0, 80),
        telefone: "55" + d,
        origem: "lp-direito-bancario",
        pagina: location.origin + location.pathname,
        formulario: form.getAttribute("data-lead"),
        cta: store.get("lp_cta") || null,
        assunto: store.get("lp_assunto") || null,
        situacoes: store.get("lp_situacoes") || null,
        event_id: eventId,
        user_agent: navigator.userAgent.slice(0, 300)
      };
      keys.forEach(function (k) { payload[k] = store.get("lp_" + k) || null; });

      busy(true); setStatus("Enviando seus dados…");
      saveLead(payload).then(function () {
        store.set("lp_sent", d);
        track(eventId);
        setStatus("Pronto! Abrindo o WhatsApp…");
        setTimeout(function () { location.href = "redirect/index.html"; }, 300);
      }).catch(function () {
        busy(false);
        setStatus("Não foi possível enviar agora. Verifique a internet e toque no botão verde de novo.", true);
      });
    });
  });

  /* ---------- Pixels (só carregam se configurados, depois da página pronta) ---------- */
  function loadPixels() {
    if (C.metaPixelId) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", C.metaPixelId); window.fbq("track", "PageView");
    }
    if (C.googleAdsId) {
      var s = document.createElement("script"); s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(C.googleAdsId);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", C.googleAdsId);
    }
  }
  if (document.readyState === "complete") setTimeout(loadPixels, 1500);
  else window.addEventListener("load", function () { setTimeout(loadPixels, 1500); });
})();
