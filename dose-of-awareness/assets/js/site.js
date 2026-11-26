/* A Dose of Awareness: application core. No dependencies. Pages are rendered from the data files. */
(function () {
  "use strict";
  var DW = window.DW, C = DW.config, mem = {};
  var qs = function (s, r) { return (r || document).querySelector(s); };
  var qsa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var store = {
    get: function (k, d) { try { var v = window.localStorage.getItem(k); if (v !== null) return JSON.parse(v); } catch (e) {} return k in mem ? mem[k] : d; },
    set: function (k, v) { mem[k] = v; try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  var PAGES = ["home", "flu", "hpv", "measles", "hepb", "pneumo", "mening", "checker", "myths", "games", "videos", "students", "impact", "today", "play", "teams", "workshop", "certificate", "about"];
  var VIDS = DW.vaccines.map(function (v) { return v.id; });
  var fixed = document.body.getAttribute("data-page") || "home";
  var embed = /[?&]embed=1/.test(location.search);
  var framed = false; try { framed = window.self !== window.top; } catch (e) { framed = true; }
  var lang = /[?&]lang=en/.test(location.search) ? "en" : (/[?&]lang=ar/.test(location.search) ? "ar" : store.get("dw-lang", "ar"));

  function L(ar, en) { return lang === "ar" ? ar : en; }
  function T(o) { return o == null ? "" : (typeof o === "object" && "ar" in o ? o[lang] : o); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function vac(id) { return DW.vaccines.filter(function (v) { return v.id === id; })[0]; }
  function homeId() { return isApp ? "today" : "home"; }
  function route() { var h = (location.hash || "").replace("#", "").split("?")[0]; return PAGES.indexOf(h) >= 0 ? h : (fixed === "home" ? homeId() : fixed); }
  function link(p) { return embed ? 'index.html#' + p + '" target="_blank" rel="noopener' : "#" + p; }
  function fmtDate(d) { try { return new Intl.DateTimeFormat(lang === "ar" ? "ar-JO-u-nu-latn" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(d); } catch (e) { return d.toISOString().slice(0, 10); } }
  function parseDate(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ""); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function addMonths(d, n) { var x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
  function today() { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- data service: the campaign server when present, otherwise the optional sheet, otherwise nothing ---------- */
  var isApp = /[?&]app=1/.test(location.search) || !!window.Capacitor || window.navigator.standalone === true || !!(window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
  var utm = (function () { var o = {}; (location.search || "").replace(/[?&](utm_[a-z]+)=([^&]*)/g, function (_, k, v) { try { o[k] = decodeURIComponent(v).slice(0, 60); } catch (e) {} }); return o; })();
  var apiReady = null, apiNow = "";
  function apiRoot() {
    if (apiReady) return apiReady;
    var set = C.apiBase || "", known = null;
    if (set && set !== "auto") { apiNow = set.replace(/\/$/, "") + "/api/"; apiReady = Promise.resolve(apiNow); return apiReady; }
    if (set !== "auto" || !/^https?:$/.test(location.protocol) || window.Capacitor) { apiReady = Promise.resolve(""); return apiReady; }
    var guess = new URL("api/", document.baseURI).href;
    try { known = window.sessionStorage.getItem("dw-api"); } catch (e) {}
    if (known !== null) { apiNow = known; apiReady = Promise.resolve(known); return apiReady; }
    apiReady = fetch(guess + "health", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { return j && j.ok ? guess : ""; }).catch(function () { return ""; })
      .then(function (b) { apiNow = b; try { window.sessionStorage.setItem("dw-api", b); } catch (e) {} return b; });
    return apiReady;
  }
  function hasApi() { return !!apiNow || !!C.backendUrl; }
  function send(type, data) {
    var payload = JSON.stringify(Object.assign({ type: type, lang: lang, page: route(), app: isApp ? 1 : 0 }, utm, data || {}));
    apiRoot().then(function (b) {
      var url = b ? b + (type === "score" ? "score" : "event") : C.backendUrl; if (!url) return;
      try { fetch(url, { method: "POST", body: payload, headers: { "Content-Type": "text/plain" }, mode: b ? "cors" : "no-cors" }).catch(function () {}); } catch (e) {}
    });
  }
  function apiGet(path) {
    return apiRoot().then(function (b) {
      if (b) return fetch(b + path).then(function (r) { return r.ok ? r.json() : null; });
      if (C.backendUrl && /^(scores|videos|stats)$/.test(path)) return fetch(C.backendUrl + "?action=" + path).then(function (r) { return r.json(); });
      return null;
    }).catch(function () { return null; });
  }
  function apiPost(path, body) {
    return apiRoot().then(function (b) {
      if (!b) return { ok: false, error: "offline" };
      return fetch(b + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(function (r) { return r.json().then(function (j) { j.ok = r.ok && j.ok !== false; return j; }); });
    }).catch(function () { return { ok: false, error: "network" }; });
  }
  var api = apiGet;

  /* ---------- pictograms ---------- */
  var PICT = {
    flu: '<circle cx="24" cy="24" r="9"/><path d="M24 9v4M24 35v4M9 24h4M35 24h4M13.4 13.4l2.8 2.8M31.8 31.8l2.8 2.8M34.6 13.4l-2.8 2.8M16.2 31.8l-2.8 2.8"/><circle class="f" cx="24" cy="24" r="3.4"/>',
    hpv: '<path d="M15 43l15-25c3-6-1-11-6-11s-9 5-6 11l15 25"/><circle class="f" cx="24" cy="14" r="2.6"/>',
    measles: '<circle cx="24" cy="24" r="15"/><circle class="f" cx="18" cy="19" r="2.2"/><circle class="f" cx="29" cy="17" r="1.8"/><circle class="f" cx="31" cy="27" r="2.4"/><circle class="f" cx="21" cy="30" r="1.9"/><circle class="f" cx="24" cy="23" r="1.4"/>',
    hepb: '<path d="M7 21c0-7 9-10 19-10s15 5 15 11c0 5-6 7-11 10-5 3-8 6-13 6-7 0-10-9-10-17z"/><path class="f" d="M30 19a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>',
    pneumo: '<path d="M24 7v13"/><path d="M24 20c-4 0-9 4-11 10-2 6-2 11 1 12 4 1 9-3 10-8zM24 20c4 0 9 4 11 10 2 6 2 11-1 12-4 1-9-3-10-8z"/><circle class="f" cx="17" cy="33" r="2.4"/><circle class="f" cx="31" cy="33" r="2.4"/>',
    mening: '<path d="M6 25L42 8 31 42l-8-13z"/><path d="M23 29L42 8"/><circle class="f" cx="12" cy="38" r="3"/>'
  };
  function pict(id) { return '<svg class="pict" viewBox="0 0 48 48" aria-hidden="true">' + (PICT[id] || "") + "</svg>"; }
  var DROP = '<svg viewBox="0 0 34 34" aria-hidden="true"><path d="M17 2c7 9 11 14 11 20a11 11 0 0 1-22 0c0-6 4-11 11-20z" fill="#0B67B2"/><path d="M12 22a5 5 0 0 0 5 5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>';

  /* ---------- shared pieces ---------- */
  function refs(ids, order) {
    return (ids || []).map(function (id) { var s = DW.sources[id]; if (!s) return ""; var n = order ? order.indexOf(id) + 1 : 0; return '<a class="ref" href="' + s.u + '" target="_blank" rel="noopener" title="' + esc(s.t) + '">[' + (n || L("المصدر", "source")) + "]</a>"; }).join(" ");
  }
  function stamps() { return store.get("dw-stamps", {}); }
  function cardHTML() {
    var st = stamps(), n = VIDS.filter(function (id) { return st[id]; }).length;
    return '<div class="acard" id="card"><header><b>' + L("بطاقة الوعي", "Awareness card") + '</b><span class="small">' + L(n + " من 6 أختام", n + " of 6 stamps") + '</span></header><div class="slots">' +
      DW.vaccines.map(function (v) {
        return '<a class="slot" style="--bg:' + v.bg + ";--deep:" + v.deep + '" href="' + link(v.id) + '">' + pict(v.id) + "<b>" + T(v.name) + "</b><small>" + T(v.tag) + "</small>" + (st[v.id] ? '<span class="stamp">' + L("تمّ", "Done") + "</span>" : "") + "</a>";
      }).join("") + '</div><p class="small" style="margin-top:10px">' +
      (n === 6 ? L("أكملتَ البطاقة. شاركها وادعُ غيرك إلى جمع الأختام.", "Card complete. Share it and invite someone else to collect the stamps.") : L("افتح كل مطعوم وأجب عن سؤاله لتحصل على الختم.", "Open each vaccine and answer its question to earn the stamp.")) + "</p></div>";
  }
  function filmHTML(id) {
    var f = (C.videos || {})[id], v = vac(id);
    if (!f) return "";
    if (!f.ready && !f.youtube) return '<div class="film"><div class="ph" style="background:' + v.bg + '">' + pict(id) + "<span>" + L("الفيلم قيد الإعداد", "Film in preparation") + "</span></div></div>";
    if (f.youtube) return '<div class="film" data-yt="' + esc(f.youtube) + '"><button class="ph" data-act="yt" style="border:0;cursor:pointer;background:' + v.bg + '">' + pict(id) + "<span>" + L("شغّل الفيلم", "Play the film") + "</span></button></div>";
    return '<div class="film"><video controls playsinline preload="none" poster="' + f.poster + '" aria-label="' + esc(T(v.vac)) + '"><source src="' + f.file + '" type="video/mp4"></video></div>';
  }
  function mythHTML(m) {
    var tr = m.t && DW.tricks[m.t];
    return '<details class="myth"><summary><span class="stamp no">' + L("إشاعة", "Rumour") + "</span><span>" + T(m.claim) + '</span></summary><div class="ans"><span class="stamp">' + L("حقيقة", "Fact") + "</span><p>" + T(m.fact) + refs([m.s]) + "</p>" +
      (tr ? '<p class="small muted">' + L("الحيلة المستخدمة: ", "The trick at work: ") + "<b>" + T(tr.name) + "</b>. " + T(tr.desc) + "</p>" : "") + "</div></details>";
  }
  function shareRow(p) {
    var base = C.siteUrl ? C.siteUrl.replace(/\/$/, "") + "/" + (p === "home" ? "" : p + ".html") : location.href.split("#")[0] + "#" + p;
    var text = L("جرعة وعي: معلومة موثوقة عن ", "A Dose of Awareness: reliable information on ") + (vac(p) ? T(vac(p).vac) : T(C.campaign)) + " " + base;
    return '<div class="row noprint"><button class="btn line" data-act="copy" data-text="' + esc(base) + '">' + L("انسخ الرابط", "Copy link") + '</button><a class="btn line" href="https://wa.me/?text=' + encodeURIComponent(text) + '" target="_blank" rel="noopener">' + L("أرسل عبر واتساب", "Send on WhatsApp") + "</a></div>";
  }

  /* ---------- header, tab bar and footer ---------- */
  var ICON = {
    home: '<path d="M4 11.5 12 4l8 7.5M6.5 10v9.5h11V10"/>',
    checker: '<path d="M12 3l7 3v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z"/><path d="M9 12l2.2 2.2 4-4.2"/>',
    myths: '<path d="M5 5h14v10h-9l-4 4v-4H5z"/><path d="M9 9h6M9 12h4"/>',
    play: '<rect x="3.5" y="7" width="17" height="10" rx="5"/><path d="M8 10.5v3M6.5 12h3"/><circle cx="15.3" cy="11" r=".6"/><circle cx="17.2" cy="13" r=".6"/>',
    teams: '<circle cx="8.5" cy="9" r="2.6"/><circle cx="16" cy="10" r="2.1"/><path d="M3.5 18.5c.6-3 2.6-4.6 5-4.6s4.4 1.6 5 4.6M14.2 14.2c2.6-.5 4.9.9 5.8 4.3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  function icon(k) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + "</svg>"; }
  function sections() {
    return [[homeId(), L("الرئيسية", "Home")], ["checker", L("أي مطعوم أسأل عنه؟", "Which vaccine?")], ["myths", L("إشاعات وحقائق", "Rumours and facts")], ["play", L("العب وتعلّم", "Play and learn")], ["videos", L("الأفلام", "Films")], ["teams", L("فرق الطلبة", "Student teams")],
      ["workshop", L("ورشة الصيدلاني على وسائل التواصل", "Social media pharmacist workshop")], ["students", L("ملتقى الطلبة", "Student hub")], ["impact", L("أثر الحملة", "Campaign impact")], ["about", L("عن الحملة والمصادر", "About and sources")]].concat(isApp ? [["home", L("صفحة الحملة", "Campaign page")]] : [["today", L("جرعة اليوم", "Today's dose")]]);
  }
  function logosHTML(cls) { return (C.logos || []).map(function (l) { return '<img class="' + cls + '" data-opt src="' + l.src + '" alt="' + esc(T(l.alt)) + '">'; }).join(""); }
  function current(id, p) { return id === p || (id === "play" && p === "games") ? ' aria-current="page"' : ""; }
  function headerHTML(p) {
    var s = sections();
    return (C.preview ? '<div class="ribbon">' + L("نسخة تجريبية قبل الإطلاق، بانتظار المراجعة والاعتماد", "Pre-launch preview, pending review and approval") + "</div>" : "") +
      '<div class="top"><div class="wrap"><a class="brand" href="' + link(homeId()) + '">' + logosHTML("ulogo") + DROP + '<span class="bn"><b>' + T(C.campaign) + "</b><small>" + T(C.unit) + '</small></span></a><nav class="nav" aria-label="' + L("أقسام الموقع", "Site sections") + '">' +
      s.slice(0, 6).map(function (i) { return '<a href="' + link(i[0]) + '"' + current(i[0], p) + ">" + i[1] + "</a>"; }).join("") + "</nav>" +
      '<button class="langbtn" data-act="lang" lang="' + (lang === "ar" ? "en" : "ar") + '">' + (lang === "ar" ? "English" : "العربية") + "</button>" +
      '<details class="menu"><summary aria-label="' + L("القائمة", "Menu") + '">' + icon("menu") + '</summary><div class="sheet">' + s.map(function (i) { return '<a href="' + link(i[0]) + '"' + current(i[0], p) + ">" + i[1] + "</a>"; }).join("") + "</div></details></div></div>";
  }
  function tabsHTML(p) {
    var t = [[homeId(), L("الرئيسية", "Home"), "home"], ["checker", L("المطاعيم", "Vaccines"), "checker"], ["myths", L("حقائق", "Facts"), "myths"], ["play", L("العب", "Play"), "play"], ["teams", L("الفرق", "Teams"), "teams"]];
    var on = function (id) { return id === p || (id === "play" && p === "games") || (id === "checker" && VIDS.indexOf(p) >= 0) || (id === "teams" && (p === "workshop" || p === "students")); };
    return t.map(function (i) { return '<a href="' + link(i[0]) + '"' + (on(i[0]) ? ' aria-current="page"' : "") + ">" + icon(i[2]) + "<span>" + i[1] + "</span></a>"; }).join("");
  }
  function footerHTML() {
    var soc = C.social || {}, links = [["instagram", "Instagram"], ["facebook", "Facebook"], ["youtube", "YouTube"], ["tiktok", "TikTok"]].filter(function (s) { return soc[s[0]]; });
    var ppl = (C.people || []).map(function (x) { return '<div class="cr"><span>' + T(x.role) + "</span><b>" + T(x.name) + "</b><span>" + T(x.title) + "</span></div>"; }).join("");
    return '<div class="wrap fgrid"><div class="stack"><b class="fname">' + T(C.campaign) + "</b><span>" + T(C.slogan) + "</span><span>" + T(C.owner) + "</span><span>" + T(C.unit) + "</span>" + ((C.logos || []).length ? '<div class="logos">' + logosHTML("flogo") + "</div>" : "") + "</div>" +
      '<div class="stack"><b>' + L("عن المعلومات", "About the information") + "</b><span>" + L("المعلومات هنا للتوعية ولا تغني عن استشارة الطبيب أو الصيدلاني.", "This information is for awareness and does not replace advice from your doctor or pharmacist.") + "</span><span>" +
      L("المرجع الأول وزارة الصحة الأردنية ومنظمة الصحة العالمية، ثم الهيئات العلمية الأخرى. كل معلومة موثقة بمصدرها.", "The first references are the Jordanian Ministry of Health and WHO, then other scientific bodies. Every statement carries its source.") + "</span><span>" +
      L("آخر مراجعة علمية: ", "Last scientific review: ") + fmtDate(parseDate(C.reviewed) || today()) + "</span></div>" +
      '<div class="stack"><b>' + L("تابع وشارك", "Follow and share") + "</b>" +
      (links.length ? '<div class="row">' + links.map(function (s) { return '<a href="' + soc[s[0]] + '" target="_blank" rel="noopener">' + s[1] + "</a>"; }).join("") + "</div>" : "<span>" + L("قنوات الحملة تُعلن عند الانطلاق.", "Campaign channels will be announced at launch.") + "</span>") +
      "<span>" + T(C.hashtag) + '</span><a href="' + link("impact") + '">' + L("أثر الحملة وطريقة قياسه", "Campaign impact and how it is measured") + "</a><span>" +
      L("لا يجمع الموقع بيانات شخصية عن الزوار ولا يستخدم ملفات تتبع.", "The site collects no personal data about visitors and uses no tracking cookies.") + "</span>" + (C.contactEmail ? "<span>" + esc(C.contactEmail) + "</span>" : "") + "</div></div>" +
      '<div class="wrap credits">' + ppl + '<div class="cr legal"><span>' + T(C.copyright) + '</span><a href="' + link("about") + '">' + L("عن الحملة والمصادر والخصوصية", "About, sources and privacy") + "</a></div></div>";
  }

  /* ---------- pages ---------- */
  DW.pages = {}; DW.after = {}; DW.acts = {};

  function fieldHTML() { var s = "", i; for (i = 0; i < 100; i++) s += '<i style="--i:' + i + '"></i>'; return '<div class="field100" id="hf" aria-hidden="true">' + s + "</div>"; }
  function paintField(n) {
    var hf = qs("#hf"); if (!hf) return; var gaps = {}, k, ok = n >= 95, msg = qs("#hf-msg");
    for (k = 0; k < 100 - n; k++) gaps[(k * 37 + 11) % 100] = 1;
    qsa("i", hf).forEach(function (c, i) { c.className = gaps[i] ? "gap" : ""; });
    hf.classList.toggle("open", !ok);
    if (msg) msg.innerHTML = "<b>" + L(n + " من كل 100 أخذوا جرعتي مطعوم الحصبة.", n + " in every 100 have had both measles doses.") + "</b> " + (ok ? L("لا تجد العدوى طريقاً بينهم، فتتوقف الفاشيات.", "The infection finds no path between them, so outbreaks stop.") : L("الفراغات تتصل، فتصل العدوى إلى من لا يستطيعون أخذ المطعوم.", "The gaps join up, and infection reaches people who cannot be vaccinated.")) + " " + refs(["who-measles-25"]);
  }
  DW.acts.herofield = function (el) { paintField(+el.value); };
  DW.after.home = function () { paintField(95); if (DW.installSlot) DW.installSlot(); };

  DW.pages.home = function () {
    var f = vac(C.featured) || DW.vaccines[0], pl = store.get("dw-pledge", null);
    var pledges = [L("سأسأل الصيدلاني عن مطعوم الإنفلونزا هذا الأسبوع", "I will ask my pharmacist about the flu vaccine this week"), L("سأراجع بطاقة مطاعيم أطفالي", "I will check my children's vaccination card"), L("سأتحقق من أي منشور عن المطاعيم قبل إعادة إرساله", "I will check any post about vaccines before forwarding it")];
    var tools = [["checker", L("أي المطاعيم أسأل عنها؟", "Which vaccines should I ask about?"), L("أجب عن بضعة أسئلة واحصل على قائمة تأخذها إلى طبيبك أو الصيدلاني.", "Answer a few questions and get a list to take to your doctor or pharmacist."), "#0B67B2"],
      ["myths", L("إشاعات وحقائق", "Rumours and facts"), L("أكثر ما يُتداول عن المطاعيم الستة، وردّ موثق على كل إشاعة.", "The most common claims about the six vaccines, each with a sourced answer."), "#C22D38"],
      ["play", L("العب وتعلّم", "Play and learn"), L("ثماني ألعاب قصيرة: سباق الدقيقة، ذاكرة المطاعيم، أوقف العدوى وغيرها.", "Eight short games: the one-minute race, vaccine memory, stop the outbreak and more."), "#0A7F63"],
      ["videos", L("الأفلام القصيرة", "Short films"), L("فيلم لكل مطعوم: مشهد من الحياة اليومية، إشاعة تُصحَّح، وخطوة واحدة واضحة.", "One film for each vaccine: a scene from daily life, a rumour corrected, and one clear step."), "#B07A00"]];
    return '<section class="hero"><div class="wrap"><div class="stack"><h1>' + L("قبل المطعوم، جرعة وعي", "Before the vaccine, a dose of awareness") + '</h1><p class="lead">' +
      L("ستة مطاعيم تصنع الفرق الأكبر في صحة الأسرة في الأردن. معلومات تستند إلى وزارة الصحة ومنظمة الصحة العالمية، يشرحها طلبة الصيدلة بلغة واضحة.", "Six vaccines that make the biggest difference to family health in Jordan. Information grounded in the Ministry of Health and WHO, explained in plain language by pharmacy students.") +
      '</p><div class="row"><a class="btn light" href="' + link("checker") + '">' + L("أي المطاعيم أسأل عنها؟", "Which vaccines should I ask about?") + '</a><a class="btn ghost" href="' + link("videos") + '">' + L("شاهد الأفلام القصيرة", "Watch the short films") + "</a></div></div>" +
      '<figure class="commune">' + fieldHTML() + '<figcaption><p id="hf-msg" aria-live="polite"></p><label class="sr" for="hf-range">' + L("نسبة من أخذوا المطعوم", "Share of people vaccinated") + '</label><input id="hf-range" type="range" min="60" max="100" step="1" value="95" data-input="herofield"><span class="small">' + L("حرّك المؤشر لترى ما يحدث حين تنخفض النسبة.", "Move the slider to see what happens when coverage falls.") + "</span></figcaption></figure></div></section>" +

      '<section class="band"><div class="wrap split"><div class="stack"><h2>' + L("اجمع أختام بطاقة الوعي", "Collect the stamps on your awareness card") + "</h2><p>" + L("ستة مطاعيم، وسؤال واحد عن كل مطعوم. كل إجابة صحيحة تضع ختماً على بطاقتك، والبطاقة المكتملة تستحق المشاركة.", "Six vaccines and one question on each. Every correct answer puts a stamp on your card, and a full card is worth sharing.") + '</p><div id="install-slot"></div></div>' + cardHTML() + "</div></section>" +

      '<section class="band tint"><div class="wrap"><h2>' + L("مطعوم هذا الموسم", "This season's vaccine") + '</h2><div class="label" style="--bg:' + f.bg + ";--deep:" + f.deep + '"><div class="stack"><div class="row">' + pict(f.id) + "<h3>" + T(f.vac) + "</h3></div><p>" + T(f.intro) + '</p><div class="row"><a class="btn" href="' + link(f.id) + '">' + L("اقرأ النشرة كاملة", "Read the full leaflet") + '</a></div></div><div class="stack">' +
      f.stats.map(function (s) { return '<div class="stat"><b>' + T(s.n) + "</b><span>" + T(s.l) + refs([s.s]) + "</span></div>"; }).join("") + "</div></div></div></section>" +

      '<section class="band"><div class="wrap"><h2>' + L("أربع طرق لتبدأ", "Four ways to begin") + '</h2><div class="four">' +
      tools.map(function (t) { return '<a class="tile" style="--deep:' + t[3] + '" href="' + link(t[0]) + '"><b>' + t[1] + "</b><span>" + t[2] + "</span></a>"; }).join("") + "</div>" +
      '<div class="note y"><b>' + L("جديد البرنامج الوطني للتطعيم", "New in the national immunisation programme") + "</b><p>" +
      L("دخل مطعوم المكورات الرئوية (PCV13) البرنامج في 20 أيلول 2025 للمواليد من 1 كانون الثاني 2025، ودخل مطعوم جدري الماء في نيسان 2026 ليصبح المطعوم الرابع عشر.", "The pneumococcal vaccine (PCV13) joined the programme on 20 September 2025 for children born from 1 January 2025, and the varicella vaccine joined in April 2026 as the fourteenth vaccine.") + refs(["moh-pcv-25", "moh-var-26"]) + "</p></div></div></section>" +

      '<section class="band tint"><div class="wrap"><h2>' + L("تعهّد بخطوة واحدة", "Pledge one step") + '</h2><div class="opts" id="pledges">' +
      pledges.map(function (t, i) { return '<button class="opt' + (pl === i ? " ok" : "") + '" data-act="pledge" data-i="' + i + '">' + t + "</button>"; }).join("") + '</div><p class="small muted" id="pledge-msg">' + (pl === null ? "" : L("سُجّل تعهدك على هذا الجهاز. شكراً لك.", "Your pledge is saved on this device. Thank you.")) + "</p></div></section>" +

      '<section class="band"><div class="wrap"><h2>' + L("عشرون فريقاً من طلبة الصيدلة يقودون الحملة", "Twenty teams of pharmacy students lead the campaign") + "</h2><p>" +
      L("طلبة السنوات الرابعة والخامسة والسادسة وطلبة الماجستير يتدربون في ورشة «الصيدلاني على وسائل التواصل»، ثم يصنع كل فريق أفلاماً قصيرة عن موضوعين من عشرين موضوعاً. يراجع أعضاء هيئة التدريس كل فيلم قبل نشره.", "Fourth, fifth and sixth-year students and Masters students train in the Social Media Pharmacist workshop. Each team then makes short films on two of twenty topics, and faculty review every film before it is published.") +
      '</p><div class="row"><a class="btn" href="' + link("teams") + '">' + L("لوحة الفرق والمواضيع", "Teams and topics board") + '</a><a class="btn line" href="' + link("workshop") + '">' + L("برنامج الورشة وأدواتها", "Workshop programme and tools") + "</a></div></div></section>";
  };

  function listSec(id, title, items, srcIds, order) {
    return '<section class="sec" id="' + id + '"><h2>' + title + '</h2><ul class="clean">' + items.map(function (t) { return "<li>" + t + "</li>"; }).join("") + '</ul><p class="small">' + refs(srcIds, order) + "</p></section>";
  }

  function vaccinePage(id) {
    var v = vac(id), o = v.src, st = stamps();
    var myths = DW.myths.filter(function (m) { return m.v === id; });
    var toc = [["who", L("من يحتاجه؟", "Who needs it?")], ["dose", L("متى وكم جرعة؟", "When and how many doses?")], ["jordan", L("أين أجده في الأردن؟", "Where in Jordan?")], ["safety", L("هل هو مأمون؟", "Is it safe?")], ["scene", L("مشهد من الحياة", "A scene from daily life")], ["try", L("جرّب بنفسك", "Try it yourself")], ["rumours", L("إشاعات وحقائق", "Rumours and facts")], ["stampq", L("سؤال الختم", "Stamp question")], ["sources", L("المصادر", "Sources")]];
    return '<div style="--bg:' + v.bg + ";--deep:" + v.deep + '"><section class="vhead"><div class="wrap"><div class="stack"><div class="chips">' +
      DW.vaccines.map(function (x) { return '<a class="chip" style="text-decoration:none' + (x.id === id ? ";background:var(--ink);color:var(--paper)" : "") + '" href="' + link(x.id) + '">' + T(x.name) + "</a>"; }).join("") +
      "</div><h1>" + T(v.vac) + '</h1><div><span class="sticker" style="background:#fff">' + T(v.tag) + "</span></div><p>" + T(v.intro) + "</p></div>" + pict(id) + "</div></section>" +
      '<div class="wrap"><div class="stats" style="padding-top:24px">' + v.stats.map(function (s) { return '<div class="stat"><b>' + T(s.n) + "</b><span>" + T(s.l) + refs([s.s], o) + "</span></div>"; }).join("") + "</div>" +
      '<div class="leaf"><nav class="toc" aria-label="' + L("أقسام النشرة", "Leaflet sections") + '">' + toc.map(function (t) { return '<a href="#' + t[0] + '" data-act="jump">' + t[1] + "</a>"; }).join("") + "</nav><div>" +
      listSec("who", toc[0][1], T(v.who), v.whoSrc, o) + listSec("dose", toc[1][1], T(v.dose), v.doseSrc, o) + listSec("jordan", toc[2][1], T(v.jordan), v.jordanSrc, o) + listSec("safety", toc[3][1], T(v.safety), v.safetySrc, o) +
      '<section class="sec" id="scene"><h2>' + toc[4][1] + '</h2><div class="scene">' + filmHTML(id) + '<div class="stack"><p class="quote">' + T(v.story) + '</p><p class="small muted">' + L("مشهد توضيحي بشخصيات متخيَّلة.", "An illustrative scene with invented characters.") + "</p></div></div></section>" +
      '<section class="sec" id="try"><h2>' + toc[5][1] + "</h2>" + (TOOLS[id] ? TOOLS[id]() : "") + "</section>" +
      '<section class="sec" id="rumours"><h2>' + toc[6][1] + "</h2>" + myths.map(mythHTML).join("") + '<p><a href="' + link("myths") + '">' + L("كل الإشاعات والحقائق", "All rumours and facts") + "</a></p></section>" +
      '<section class="sec" id="stampq"><h2>' + toc[7][1] + '</h2><div class="tool" id="sq"><p><b>' + T(v.check.q) + "</b></p>" +
      (st[id] ? '<div class="row"><span class="stamp">' + L("تمّ", "Done") + "</span><span>" + L("حصلت على ختم هذا المطعوم.", "You have this vaccine's stamp.") + "</span></div>" : '<div class="pair"><button class="btn fact" data-act="stamp" data-id="' + id + '" data-a="1">' + L("حقيقة", "Fact") + '</button><button class="btn rumour" data-act="stamp" data-id="' + id + '" data-a="0">' + L("إشاعة", "Rumour") + "</button></div>") +
      '<div class="out" id="sq-out" role="status"></div></div></section>' +
      '<section class="sec"><div class="cta"><b>' + T(v.cta) + "</b>" + shareRow(id) + "</div></section>" +
      '<section class="sec" id="sources"><h2>' + toc[8][1] + '</h2><ol class="src">' + o.map(function (sid) { var s = DW.sources[sid]; return "<li>" + esc(s.t) + ' <a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.u) + "</a></li>"; }).join("") + "</ol></section></div></div></div></div>";
  }
  VIDS.forEach(function (id) { DW.pages[id] = function () { return vaccinePage(id); }; });

  /* ---------- per-vaccine tools ---------- */
  function tick(id, label) { return '<label class="tick" for="' + id + '"><input type="checkbox" id="' + id + '"><span>' + label + "</span></label>"; }
  var TOOLS = {
    flu: function () {
      return '<div class="tool"><p><b>' + L("هل أنت من الفئات ذات الأولوية؟", "Are you in a priority group?") + '</b></p><div class="grid2">' +
        tick("fl-chronic", L("عندي مرض مزمن: سكري، ربو، قلب، رئة، كلى", "I have a chronic condition: diabetes, asthma, heart, lung, kidney")) + tick("fl-preg", L("أنا حامل", "I am pregnant")) + tick("fl-old", L("عمري 65 عاماً أو أكثر", "I am 65 or older")) + tick("fl-kid", L("طفلي بين 6 أشهر و5 سنوات", "My child is between 6 months and 5 years")) + tick("fl-hcw", L("أعمل أو أتدرب في المجال الصحي", "I work or train in health care")) + tick("fl-home", L("أعيش مع شخص من هذه الفئات", "I live with someone in these groups")) +
        '</div><div class="row"><button class="btn" data-act="tool-flu">' + L("اعرف أولويتك", "See your priority") + '</button></div><div class="out" id="fl-out" role="status"></div></div>';
    },
    hpv: function () {
      return '<div class="tool"><p><b>' + L("كم جرعة بحسب العمر؟", "How many doses for this age?") + '</b></p><div class="grid2"><label class="field" for="hp-age">' + L("العمر بالسنوات", "Age in years") + '<input type="number" id="hp-age" min="5" max="60" inputmode="numeric" value="12"></label>' + tick("hp-imm", L("يوجد ضعف في المناعة", "Weakened immunity")) +
        '</div><div class="row"><button class="btn" data-act="tool-hpv">' + L("اعرض الجدول", "Show the schedule") + '</button></div><div class="out" id="hp-out" role="status"></div></div>';
    },
    measles: function () {
      return '<div class="tool"><p><b>' + L("لماذا نحتاج 95%؟ جرّب بنفسك", "Why 95%? Try it yourself") + "</b></p><p class=\"small\">" + L("400 شخص في مدرسة. اختر نسبة المطعَّمين بجرعتين ثم أدخل مصاباً واحداً.", "A school of 400 people. Choose the share vaccinated with two doses, then introduce one case.") +
        '</p><label class="field" for="ms-cov">' + L("نسبة المطعَّمين: ", "Vaccinated: ") + '<output id="ms-val">80%</output><input type="range" id="ms-cov" min="40" max="99" value="80" data-input="herd-val"></label><div class="row"><button class="btn" data-act="herd-run">' + L("أدخل مصاباً", "Introduce a case") + '</button></div><canvas class="herd" id="ms-canvas" width="400" height="400" aria-label="' + L("شبكة تمثل 400 شخص", "Grid of 400 people") + '"></canvas><div class="legend"><span><i style="background:#0B7D61"></i>' + L("محمي بالمطعوم", "Protected by vaccine") + '</span><span><i style="background:#fff"></i>' + L("غير محمي", "Unprotected") + '</span><span><i style="background:#C22D38"></i>' + L("أصيب", "Infected") + '</span></div><div class="out" id="ms-out" role="status"></div><p class="small muted">' +
        L("محاكاة مبسّطة للتوضيح: كل مصاب يخالط 12 شخصاً، وجرعتان تحميان 97% ممن يتلقونهما.", "A simplified illustration: each case contacts 12 people, and two doses protect 97% of those who receive them.") + "</p></div>";
    },
    hepb: function () {
      return '<div class="tool"><p><b>' + L("هل تلقيت المطعوم رضيعاً؟", "Were you vaccinated as an infant?") + '</b></p><div class="grid2"><label class="field" for="hb-year">' + L("سنة الميلاد", "Year of birth") + '<input type="number" id="hb-year" min="1930" max="2026" inputmode="numeric" value="1990"></label><label class="field" for="hb-d1">' + L("تاريخ الجرعة الأولى، إن بدأت", "Date of first dose, if started") + '<input type="date" id="hb-d1"></label></div><div class="row"><button class="btn" data-act="tool-hepb">' + L("اعرض النتيجة", "Show the result") + '</button></div><div class="out" id="hb-out" role="status"></div></div>';
    },
    pneumo: function () {
      return '<div class="tool"><p><b>' + L("مواعيد جرعات طفلك", "Your child's dose dates") + '</b></p><div class="grid2"><label class="field" for="pn-dob">' + L("تاريخ ميلاد الطفل", "Child's date of birth") + '<input type="date" id="pn-dob"></label></div><div class="row"><button class="btn" data-act="tool-pneumo">' + L("احسب المواعيد", "Work out the dates") + '</button></div><div class="out" id="pn-out" role="status"></div></div>';
    },
    mening: function () {
      return '<div class="tool"><p><b>' + L("آخر موعد لمطعوم العمرة أو الحج", "Vaccination deadline for Umrah or Hajj") + '</b></p><div class="grid2"><label class="field" for="mn-arr">' + L("تاريخ الوصول إلى السعودية", "Date of arrival in Saudi Arabia") + '<input type="date" id="mn-arr"></label><label class="field" for="mn-last">' + L("تاريخ آخر جرعة، إن وُجدت", "Date of last dose, if any") + '<input type="date" id="mn-last"></label></div><div class="row"><button class="btn" data-act="tool-mening">' + L("احسب الموعد", "Work out the deadline") + '</button></div><div class="out" id="mn-out" role="status"></div></div>';
    }
  };
  function out(id, html) { var el = qs("#" + id); if (el) el.innerHTML = html; }
  function chk(id) { var el = qs("#" + id); return !!(el && el.checked); }

  DW.acts["tool-flu"] = function () {
    var pri = chk("fl-chronic") || chk("fl-preg") || chk("fl-old") || chk("fl-kid") || chk("fl-hcw");
    out("fl-out", pri ? L("<b>أنت من الفئات ذات الأولوية.</b> لا تؤجل. المطعوم متوفر في الصيدليات بسعر 8.04 دنانير للثلاثي، واسأل مركزك الصحي عن الكميات المخصصة للفئات ذات الأولوية.", "<b>You are in a priority group.</b> Do not put it off. The vaccine is in pharmacies at 8.04 JOD for the trivalent, and your health centre can tell you about doses reserved for priority groups.")
      : chk("fl-home") ? L("<b>مطعومك يحمي من تعيش معهم.</b> من حولك أكثر عرضة للمضاعفات، وتطعيمك يقلل احتمال أن تنقل العدوى إليهم.", "<b>Your vaccine protects the people you live with.</b> They are more likely to have complications, and your dose lowers the chance of passing flu to them.")
      : L("لست من الفئات ذات الأولوية، والمطعوم ما زال مفيداً لك: يقلل احتمال المرض وأيام الغياب، ويحمي من حولك.", "You are not in a priority group, and the vaccine is still worth having: it lowers your chance of illness and days off, and protects those around you."));
  };
  DW.acts["tool-hpv"] = function () {
    var a = parseInt((qs("#hp-age") || {}).value, 10), t;
    if (!a || a < 1) t = L("اكتب العمر بالسنوات.", "Enter the age in years.");
    else if (a < 9) t = L("يبدأ التطعيم من عمر 9 سنوات.", "Vaccination starts at age 9.");
    else if (a <= 14) t = L("<b>العمر الأمثل.</b> منظمة الصحة العالمية: جرعة واحدة أو جرعتان. جدول CDC: جرعتان بينهما 6 إلى 12 شهراً.", "<b>The ideal age.</b> WHO: one or two doses. CDC schedule: two doses 6 to 12 months apart.");
    else if (a <= 20) t = L("منظمة الصحة العالمية: جرعة واحدة أو جرعتان. جدول CDC: ثلاث جرعات (اليوم، بعد شهر إلى شهرين، بعد 6 أشهر).", "WHO: one or two doses. CDC schedule: three doses (today, after 1 to 2 months, after 6 months).");
    else if (a <= 26) t = L("منظمة الصحة العالمية: جرعتان بينهما 6 أشهر. جدول CDC: ثلاث جرعات.", "WHO: two doses six months apart. CDC schedule: three doses.");
    else if (a <= 45) t = L("بين 27 و45 عاماً القرار مشترك مع الطبيب، لأن الفائدة تقل كلما زاد احتمال التعرض السابق للفيروس.", "Between 27 and 45 the decision is shared with a doctor, because the benefit falls as earlier exposure becomes more likely.");
    else t = L("لا يُنصح به عادةً بعد 45 عاماً. الأهم في هذا العمر الفحص الدوري لعنق الرحم.", "It is not usually advised after 45. At this age regular cervical screening matters most.");
    if (a >= 9 && a <= 45 && chk("hp-imm")) t += " " + L("مع ضعف المناعة: جرعتان على الأقل، والأفضل ثلاث.", "With weakened immunity: at least two doses, ideally three.");
    out("hp-out", t + ' <span class="small muted">' + L("الطبيب يحدد الجدول المناسب.", "Your doctor will set the right schedule.") + "</span>" + refs(["who-hpv-pp", "cdc-adult"]));
  };
  DW.acts["tool-hepb"] = function () {
    var y = parseInt((qs("#hb-year") || {}).value, 10), d1 = parseDate((qs("#hb-d1") || {}).value), t = "";
    if (y && y < 1995) t = L("<b>وُلدت قبل إدخال المطعوم في البرنامج الوطني عام 1995.</b> على الأغلب لم تتلقَّه رضيعاً. اسأل طبيبك عن فحص دم بسيط وعن الجرعات الثلاث.", "<b>You were born before the vaccine entered the national programme in 1995.</b> You were probably not vaccinated as an infant. Ask your doctor about a simple blood test and the three doses.");
    else if (y) t = L("<b>تلقيته على الأغلب رضيعاً ضمن البرنامج الوطني.</b> تأكد من بطاقة مطاعيمك. العاملون الصحيون يُنصحون بفحص الأجسام المضادة للتأكد من الاستجابة.", "<b>You most likely received it as an infant through the national programme.</b> Check your vaccination card. Health workers are advised to have an antibody test to confirm the response.");
    if (d1) t += "<br>" + L("مواعيد جرعاتك: الثانية ", "Your dose dates: second on ") + "<b>" + fmtDate(addMonths(d1, 1)) + "</b>" + L("، والثالثة ", ", third on ") + "<b>" + fmtDate(addMonths(d1, 6)) + "</b>.";
    out("hb-out", t || L("اكتب سنة الميلاد.", "Enter the year of birth."));
  };
  DW.acts["tool-pneumo"] = function () {
    var d = parseDate((qs("#pn-dob") || {}).value), t;
    if (!d) t = L("اختر تاريخ الميلاد.", "Choose the date of birth.");
    else if (d < new Date(2025, 0, 1)) t = L("البرنامج الوطني يشمل المواليد من 1 كانون الثاني 2025. لطفل أكبر من ذلك اسأل طبيب الأطفال عن التطعيم الاستدراكي.", "The national programme covers children born from 1 January 2025. For an older child, ask the paediatrician about catch-up vaccination.");
    else t = L("<b>طفلك مشمول في البرنامج الوطني مجاناً.</b> المواعيد التقريبية: ", "<b>Your child is covered by the national programme, free of charge.</b> Approximate dates: ") + "<br>" + L("الجرعة الأولى: ", "First dose: ") + "<b>" + fmtDate(addMonths(d, 2)) + "</b><br>" + L("الجرعة الثانية: ", "Second dose: ") + "<b>" + fmtDate(addMonths(d, 4)) + "</b><br>" + L("الجرعة المنشطة: ", "Booster: ") + "<b>" + fmtDate(addMonths(d, 12)) + "</b>";
    out("pn-out", t + refs(["moh-pcv-25"]));
  };
  DW.acts["tool-mening"] = function () {
    var arr = parseDate((qs("#mn-arr") || {}).value), last = parseDate((qs("#mn-last") || {}).value), t;
    if (!arr) { out("mn-out", L("اختر تاريخ الوصول.", "Choose the arrival date.")); return; }
    var dl = addDays(arr, -10), left = Math.round((dl - today()) / 864e5);
    if (last && addMonths(last, 60) >= arr && last <= dl) t = L("<b>شهادتك سارية وقت السفر</b> إذا كان المطعوم من النوع المقترن: خمس سنوات من ", "<b>Your certificate is valid at the time of travel</b> if the vaccine was the conjugate type: five years from ") + fmtDate(last) + L(". احتفظ بها مع جواز السفر.", ". Keep it with your passport.");
    else if (left < 0) t = L("<b>فات الموعد الذي تشترطه السعودية.</b> راجع المركز الصحي غداً ومعك ما يثبت السفر، واسألهم عما يلزم في حالتك.", "<b>The deadline required by Saudi Arabia has passed.</b> Go to the health centre tomorrow with proof of travel and ask what applies in your case.");
    else t = L("آخر موعد لأخذ المطعوم: ", "Last day to have the vaccine: ") + "<b>" + fmtDate(dl) + "</b>. " + (left === 0 ? L("اليوم هو آخر يوم.", "Today is the last day.") : L("بقي " + left + " يوماً. لا تنتظر اليوم الأخير.", left + " days left. Do not wait for the last day.")) + (last ? " " + L("شهادتك السابقة لا تغطي هذه الرحلة.", "Your earlier certificate does not cover this trip.") : "");
    out("mn-out", t + refs(["ksa-1447", "moh-hajj-26"]));
  };

  /* Herd immunity illustration */
  var herd = { timer: null };
  function herdDraw(state) {
    var c = qs("#ms-canvas"); if (!c) return; var x = c.getContext("2d"), n = 20, s = c.width / n;
    x.clearRect(0, 0, c.width, c.height);
    for (var i = 0; i < 400; i++) { var px = (i % n) * s, py = Math.floor(i / n) * s; x.fillStyle = state[i] === 2 ? "#C22D38" : state[i] === 1 ? "#0B7D61" : "#FFFFFF"; x.fillRect(px + 2, py + 2, s - 4, s - 4); x.strokeStyle = "#C6CFE4"; x.strokeRect(px + 2.5, py + 2.5, s - 5, s - 5); }
  }
  function herdInit() { var cov = +(qs("#ms-cov") || { value: 80 }).value, st = []; for (var i = 0; i < 400; i++) st.push(Math.random() * 100 < cov && Math.random() < 0.97 ? 1 : 0); herd.state = st; herdDraw(st); return st; }
  DW.acts["herd-val"] = function (el) { var o = qs("#ms-val"); if (o) o.textContent = el.value + "%"; clearTimeout(herd.timer); herdInit(); out("ms-out", ""); };
  DW.acts["herd-run"] = function () {
    clearTimeout(herd.timer);
    var st = herdInit(), sus = []; st.forEach(function (v, i) { if (v === 0) sus.push(i); });
    if (!sus.length) { out("ms-out", L("لا يوجد شخص غير محمي. الحصبة لا تجد من تصيبه.", "No one is unprotected. Measles finds no one to infect.")); return; }
    var wave = [sus[Math.floor(Math.random() * sus.length)]], total = 1; st[wave[0]] = 2; herdDraw(st);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function step() {
      var next = [];
      wave.forEach(function () { for (var k = 0; k < 12; k++) { var j = Math.floor(Math.random() * 400); if (st[j] === 0) { st[j] = 2; next.push(j); total++; } } });
      herdDraw(st); wave = next;
      if (next.length) { if (reduce) step(); else herd.timer = setTimeout(step, 420); }
      else {
        var cov = +qs("#ms-cov").value;
        out("ms-out", L("أصيب <b>" + total + "</b> من 400. ", "<b>" + total + "</b> of 400 were infected. ") + (total <= 5 ? L("العدوى توقفت قبل أن تصبح فاشية. هذا ما تفعله التغطية المرتفعة.", "The infection died out before becoming an outbreak. That is what high coverage does.") : cov >= 95 ? L("حتى مع تغطية مرتفعة قد تقع سلسلة إصابات صغيرة، لكنها تتوقف سريعاً. أعد التجربة.", "Even with high coverage a short chain of cases can happen, but it stops quickly. Run it again.") : L("فاشية. ارفع النسبة إلى 95% وأعد التجربة.", "An outbreak. Raise coverage to 95% and run it again.")));
      }
    }
    herd.timer = setTimeout(step, reduce ? 0 : 420);
  };
  DW.after.measles = function () { herdInit(); };

  /* ---------- checker ---------- */
  DW.pages.checker = function () {
    var ages = [["9", L("9 إلى 14 عاماً", "9 to 14")], ["15", L("15 إلى 26 عاماً", "15 to 26")], ["27", L("27 إلى 49 عاماً", "27 to 49")], ["50", L("50 إلى 64 عاماً", "50 to 64")], ["65", L("65 عاماً فأكثر", "65 or older")]];
    return '<section class="band" style="border:0"><div class="wrap"><h1>' + L("أي المطاعيم أسأل عنها؟", "Which vaccines should I ask about?") + '</h1><p class="lead">' + L("اختر ما ينطبق عليك. تحصل على قائمة قصيرة تأخذها إلى طبيبك أو الصيدلاني. لا يُحفظ أي شيء مما تختاره.", "Tick what applies to you. You get a short list to take to your doctor or pharmacist. Nothing you select is stored.") +
      '</p><div class="tool"><div class="grid2"><label class="field" for="ck-age">' + L("عمرك", "Your age") + '<select id="ck-age">' + ages.map(function (a, i) { return '<option value="' + a[0] + '"' + (i === 2 ? " selected" : "") + ">" + a[1] + "</option>"; }).join("") + '</select></label><label class="field" for="ck-sex">' + L("الجنس", "Sex") + '<select id="ck-sex"><option value="f">' + L("أنثى", "Female") + '</option><option value="m">' + L("ذكر", "Male") + '</option></select></label></div><div class="grid2">' +
      tick("ck-chronic", L("عندي مرض مزمن: سكري، قلب، رئة، كلى، ضعف مناعة", "I have a chronic condition: diabetes, heart, lung, kidney, weakened immunity")) + tick("ck-preg", L("أنا حامل", "I am pregnant")) + tick("ck-plan", L("أخطط للحمل", "I am planning a pregnancy")) + tick("ck-hcw", L("أعمل أو أدرس في المجال الصحي", "I work or study in health care")) + tick("ck-b95", L("وُلدت قبل عام 1995", "I was born before 1995")) + tick("ck-smoke", L("أدخّن", "I smoke")) + tick("ck-hajj", L("أنوي السفر للعمرة أو الحج", "I plan to travel for Umrah or Hajj")) + tick("ck-kid", L("لدي طفل دون 5 سنوات", "I have a child under 5")) + tick("ck-girl", L("لدي ابنة بين 9 و14 عاماً", "I have a daughter aged 9 to 14")) +
      '</div><div class="row"><button class="btn go" data-act="check">' + L("اعرض قائمتي", "Show my list") + '</button></div></div><div id="ck-out" class="stack" role="status"></div></div></section>';
  };
  DW.acts.check = function () {
    var age = qs("#ck-age").value, male = qs("#ck-sex").value === "m", map = {}, order = [];
    function add(id, ar, en) { if (!map[id]) { map[id] = []; order.push(id); } map[id].push(L(ar, en)); }
    var c = function (k) { return chk("ck-" + k); };
    if (c("preg") && !male) add("flu", "الحامل من الفئات ذات الأولوية في أي شهر من الحمل.", "Pregnant women are a priority group at any stage of pregnancy.");
    if (c("chronic")) add("flu", "الأمراض المزمنة ترفع خطر مضاعفات الإنفلونزا.", "Chronic conditions raise the risk of flu complications.");
    if (age === "65") add("flu", "كبار السن من الفئات ذات الأولوية.", "Older adults are a priority group.");
    if (c("hcw")) add("flu", "العاملون الصحيون يتطعمون كل عام لحماية أنفسهم ومرضاهم.", "Health workers are vaccinated every year to protect themselves and their patients.");
    if (c("kid")) add("flu", "الأطفال من 6 أشهر إلى 5 سنوات من الفئات ذات الأولوية.", "Children aged 6 months to 5 years are a priority group.");
    if (c("hajj")) add("flu", "يُنصح به للحجاج والمعتمرين.", "Advised for Hajj and Umrah pilgrims.");
    if (!map.flu) add("flu", "جرعة سنوية مفيدة لكل من أتمّ 6 أشهر، بحسب CDC.", "A yearly dose benefits everyone aged 6 months and over, according to the CDC.");
    if (age === "9") add("hpv", male ? "يمكن تطعيم الفتيان أيضاً. اسأل الطبيب." : "العمر الأمثل للمطعوم بحسب منظمة الصحة العالمية.", male ? "Boys can be vaccinated too. Ask the doctor." : "The ideal age for the vaccine, according to WHO.");
    if (age === "15") add("hpv", "تطعيم استدراكي حتى عمر 26 عاماً.", "Catch-up vaccination up to age 26.");
    if (age === "27") add("hpv", "حتى 45 عاماً: قرار يُتخذ مع الطبيب.", "Up to 45: a decision to make with your doctor.");
    if (c("girl")) add("hpv", "لابنتك: العمر الأمثل من 9 إلى 14 عاماً.", "For your daughter: the ideal age is 9 to 14.");
    if (c("kid")) add("measles", "لطفلك: تأكد من جرعات الشهر 9 و12 و18 في بطاقة المطاعيم.", "For your child: check the doses at 9, 12 and 18 months on the vaccination card.");
    if (c("hcw") || age === "15") add("measles", "طلبة الجامعات والعاملون الصحيون يحتاجون ما يثبت جرعتين.", "University students and health workers need a record of two doses.");
    if (c("plan") && !male) add("measles", "قبل الحمل: تأكدي من مناعتك ضد الحصبة الألمانية. المطعوم لا يُعطى أثناء الحمل.", "Before pregnancy: check your immunity to rubella. The vaccine is not given during pregnancy.");
    if (c("b95")) add("hepb", "وُلدت قبل إدخال المطعوم في البرنامج الوطني. اسأل عن الفحص والجرعات الثلاث.", "You were born before the vaccine entered the national programme. Ask about a test and the three doses.");
    if (c("hcw")) add("hepb", "للعاملين الصحيين: توثيق الجرعات وفحص الاستجابة.", "For health workers: a record of doses and a check of the response.");
    if (c("chronic")) add("hepb", "بعض الأمراض المزمنة مثل السكري وأمراض الكلى: اسأل طبيبك.", "With some chronic conditions such as diabetes and kidney disease: ask your doctor.");
    if (age === "65") add("pneumo", "كبار السن من الفئات الموصى بتطعيمها.", "Older adults are among the groups advised to be vaccinated.");
    if (age === "50") add("pneumo", "توصي CDC به من عمر 50 عاماً. اسأل طبيبك.", "The CDC recommends it from age 50. Ask your doctor.");
    if (c("chronic")) add("pneumo", "السكري وأمراض القلب والرئة والكلى ترفع خطر المرض.", "Diabetes and heart, lung and kidney disease raise the risk.");
    if (c("smoke")) add("pneumo", "التدخين يرفع خطر عدوى المكورات الرئوية.", "Smoking raises the risk of pneumococcal infection.");
    if (c("kid")) add("pneumo", "للمواليد من 1 كانون الثاني 2025: ثلاث جرعات مجانية في الشهر 2 و4 و12.", "For children born from 1 January 2025: three free doses at 2, 4 and 12 months.");
    if (c("hajj")) add("mening", "قبل الوصول إلى السعودية بعشرة أيام على الأقل. الشهادة سارية 5 سنوات.", "At least ten days before arrival in Saudi Arabia. The certificate is valid for 5 years.");
    out("ck-out", "<h2>" + L("تحدّث مع طبيبك أو الصيدلاني عن:", "Talk to your doctor or pharmacist about:") + "</h2>" + order.map(function (id) {
      var v = vac(id); return '<div class="tile" style="--deep:' + v.deep + '"><div class="row"><span class="sticker" style="--bg:' + v.bg + '">' + T(v.vac) + '</span><a href="' + link(id) + '">' + L("اقرأ النشرة", "Read the leaflet") + '</a></div><ul class="clean">' + map[id].map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div>";
    }).join("") + '<p class="note">' + L("هذه القائمة للتوعية وليست تشخيصاً ولا وصفة. القرار يُتخذ مع مقدم الرعاية الصحية بحسب حالتك.", "This list is for awareness. It is not a diagnosis or a prescription. The decision is made with a health professional based on your situation.") + "</p>");
    send("checker", { n: order.length });
  };

  /* ---------- rumours and facts ---------- */
  var mythFilter = "x";
  function mythList() {
    var q = ((qs("#my-q") || {}).value || "").trim().toLowerCase();
    var list = DW.myths.filter(function (m) { return (mythFilter === "x" || m.v === mythFilter) && (!q || (T(m.claim) + " " + T(m.fact)).toLowerCase().indexOf(q) >= 0); });
    return list.length ? list.map(mythHTML).join("") : "<p>" + L("لا توجد نتيجة بهذه الكلمات. جرّب كلمة أخرى.", "Nothing matches those words. Try another word.") + "</p>";
  }
  DW.pages.myths = function () {
    var chips = [["x", L("الكل", "All")]].concat(DW.vaccines.map(function (v) { return [v.id, T(v.name)]; })).concat([["all", L("عن المطاعيم عموماً", "Vaccines in general")]]);
    return '<section class="band" style="border:0"><div class="wrap"><h1>' + L("إشاعات وحقائق", "Rumours and facts") + '</h1><p class="lead">' + L("أكثر ما يُتداول عن المطاعيم الستة. افتح الإشاعة لترى الحقيقة ومصدرها.", "The most common claims about the six vaccines. Open a rumour to see the fact and its source.") +
      '</p><div class="note y"><b>' + L("ثلاثة أسئلة قبل أن تصدّق أو تعيد الإرسال", "Three questions before you believe or forward") + '</b><ol class="steps" style="margin-top:10px"><li>' + L("من قال هذا، وما اختصاصه؟", "Who said this, and what is their field?") + "</li><li>" + L("أين الدليل، وهل نشرته جهة موثوقة؟", "Where is the evidence, and did a trusted body publish it?") + "</li><li>" + L("لماذا يستعجلني أو يخيفني؟", "Why is it rushing or frightening me?") + "</li></ol></div>" +
      '<div class="chips" role="group" aria-label="' + L("تصفية بحسب المطعوم", "Filter by vaccine") + '">' + chips.map(function (c) { return '<button class="chip" data-act="myth-f" data-v="' + c[0] + '" aria-pressed="' + (mythFilter === c[0]) + '">' + c[1] + "</button>"; }).join("") + '</div><label class="field" for="my-q">' + L("ابحث في الإشاعات", "Search the rumours") + '<input type="search" id="my-q" data-input="myth-q" autocomplete="off"></label><div class="stack" id="my-list">' + mythList() + "</div>" +
      "<h2>" + L("ست حيل تتكرر في الإشاعات", "Six tricks that keep coming back") + '</h2><div class="two">' + Object.keys(DW.tricks).map(function (k) { var t = DW.tricks[k]; return '<div class="tile"><b>' + T(t.name) + "</b><span>" + T(t.desc) + "</span></div>"; }).join("") + '</div><div class="row"><a class="btn" href="' + link("games") + '">' + L("تدرّب على كشفها في اللعبة", "Practise spotting them in the game") + "</a></div></div></section>";
  };
  DW.acts["myth-f"] = function (el) { mythFilter = el.getAttribute("data-v"); qsa(".chip[data-act='myth-f']").forEach(function (c) { c.setAttribute("aria-pressed", c === el); }); out("my-list", mythList()); };
  DW.acts["myth-q"] = function () { out("my-list", mythList()); };

  /* ---------- common actions ---------- */
  DW.acts.lang = function () { lang = lang === "ar" ? "en" : "ar"; store.set("dw-lang", lang); render(true); };
  DW.acts.jump = function (el, e) { e.preventDefault(); var t = qs(el.getAttribute("href")); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); };
  DW.acts.copy = function (el) {
    var done = function () { var old = el.textContent; el.textContent = L("نُسخ الرابط", "Link copied"); setTimeout(function () { el.textContent = old; }, 1600); };
    try { navigator.clipboard.writeText(el.getAttribute("data-text")).then(done, function () {}); } catch (e) {}
  };
  DW.acts.yt = function (el) { var box = el.closest(".film"), id = box.getAttribute("data-yt"); box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; };
  DW.acts.pledge = function (el) {
    var i = +el.getAttribute("data-i"); store.set("dw-pledge", i);
    qsa("#pledges .opt").forEach(function (b, k) { b.classList.toggle("ok", k === i); });
    out("pledge-msg", L("سُجّل تعهدك على هذا الجهاز. شكراً لك.", "Your pledge is saved on this device. Thank you.")); send("pledge", { i: i });
  };
  DW.acts.stamp = function (el) {
    var id = el.getAttribute("data-id"), v = vac(id), ok = (el.getAttribute("data-a") === "1") === v.check.a;
    if (ok) {
      var st = stamps(); st[id] = Date.now(); store.set("dw-stamps", st);
      var done = VIDS.filter(function (x) { return st[x]; }).length;
      qs("#sq .pair").outerHTML = '<div class="row"><span class="stamp new">' + L("تمّ", "Done") + "</span><span>" + L("إجابة صحيحة. حصلت على الختم " + done + " من 6.", "Correct. You have stamp " + done + " of 6.") + "</span></div>";
      out("sq-out", done === 6 ? L("<b>أكملت بطاقة الوعي.</b> عد إلى الرئيسية وشاركها.", "<b>You have completed the awareness card.</b> Go back to the home page and share it.") + ' <a href="' + link("home") + '">' + L("افتح البطاقة", "Open the card") + "</a>" : L("المطعوم التالي بانتظارك.", "The next vaccine is waiting.") + ' <a href="' + link("home") + '">' + L("افتح البطاقة", "Open the card") + "</a>");
      send("stamp", { v: id, n: done });
    } else out("sq-out", L("ليست هذه الإجابة. اقرأ قسم «إشاعات وحقائق» في هذه الصفحة ثم حاول ثانية.", "That is not the answer. Read the rumours and facts on this page, then try again."));
  };

  /* ---------- render ---------- */
  DW.titles = {
    checker: function () { return L("أي المطاعيم أسأل عنها؟", "Which vaccines should I ask about?"); }, myths: function () { return L("إشاعات وحقائق", "Rumours and facts"); },
    games: function () { return L("العب وتعلّم", "Play and learn"); }, play: function () { return L("العب وتعلّم", "Play and learn"); }, videos: function () { return L("الأفلام", "Films"); },
    students: function () { return L("ملتقى الطلبة", "Student hub"); }, impact: function () { return L("أثر الحملة", "Campaign impact") }
  };
  function render(keep) {
    var p = route(), root = document.documentElement, tb = qs("#tabs");
    root.lang = lang; root.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("embed", embed); document.body.classList.toggle("app", isApp); document.body.setAttribute("data-route", p);
    qs("#top").innerHTML = headerHTML(p); qs("#foot").innerHTML = footerHTML();
    qs("#app").innerHTML = (DW.pages[p] || DW.pages.home)(p);
    if (!tb) { tb = document.createElement("nav"); tb.id = "tabs"; tb.className = "tabbar"; document.body.appendChild(tb); }
    tb.setAttribute("aria-label", L("التنقل السريع", "Quick navigation")); tb.innerHTML = tabsHTML(p);
    qsa("img[data-opt]").forEach(function (im) { im.addEventListener("error", function () { im.remove(); }); });
    var v = vac(p);
    document.title = (v ? T(v.vac) : DW.titles[p] ? DW.titles[p]() : T(C.slogan)) + (p === "home" ? "" : " - " + T(C.campaign));
    if (DW.after[p]) DW.after[p]();
    if (!keep) window.scrollTo(0, 0);
    if (embed && framed) { try { window.parent.postMessage({ dwHeight: document.documentElement.scrollHeight }, "*"); } catch (e) {} }
    if (!keep) send("view");
  }
  document.addEventListener("click", function (e) { var el = e.target.closest ? e.target.closest("[data-act]") : null; if (el && DW.acts[el.getAttribute("data-act")]) DW.acts[el.getAttribute("data-act")](el, e); });
  document.addEventListener("input", function (e) { var el = e.target.closest ? e.target.closest("[data-input]") : null; if (el && DW.acts[el.getAttribute("data-input")]) DW.acts[el.getAttribute("data-input")](el, e); });
  window.addEventListener("hashchange", function () { render(false); });

  DW.app = { L: L, T: T, esc: esc, qs: qs, qsa: qsa, vac: vac, link: link, refs: refs, pict: pict, store: store, send: send, api: api, apiGet: apiGet, apiPost: apiPost, hasApi: hasApi, apiRoot: apiRoot, out: out, shuffle: shuffle, filmHTML: filmHTML, mythHTML: mythHTML, cardHTML: cardHTML, stamps: stamps, fmtDate: fmtDate, parseDate: parseDate, today: today, framed: framed, embed: embed, isApp: isApp, route: route, homeId: homeId, render: render, lang: function () { return lang; }, VIDS: VIDS };
  DW.start = function () {
    apiRoot();
    render(false);
    if (embed && framed && window.ResizeObserver) { try { new ResizeObserver(function () { window.parent.postMessage({ dwHeight: document.documentElement.scrollHeight }, "*"); }).observe(document.body); } catch (e) {} }
  };
})();
