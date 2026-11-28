/* A Dose of Awareness: app modules, part one. Today's dose, badges and the extra games. */
(function () {
  "use strict";
  var DW = window.DW, C = DW.config, A = DW.app;
  var L = A.L, T = A.T, qs = A.qs, qsa = A.qsa, esc = A.esc, link = A.link, store = A.store, shuffle = A.shuffle;

  DW.titles.today = function () { return L("جرعة اليوم", "Today's dose"); };

  /* ---------- small helpers shared with part two ---------- */
  function toast(msg) {
    var t = qs("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("on"); }, 3400);
  }
  function badges() { return store.get("dw-badges", {}); }
  function award(id) {
    var b = badges(), def = DW.badges.filter(function (x) { return x.id === id; })[0]; if (b[id] || !def) return false;
    b[id] = dayKey(); store.set("dw-badges", b); A.send("badge", { k: id }); toast(L("شارة جديدة: ", "New badge: ") + T(def.name)); return true;
  }
  function syncBadges() {
    var st = A.stamps(), n = A.VIDS.filter(function (id) { return st[id]; }).length;
    if (n >= 1) award("first"); if (n === 6) award("card"); if (store.get("dw-pledge", null) !== null) award("pledge");
  }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function best(k, score) { var b = store.get("dw-best", {}); if (!(k in b) || score > b[k]) { b[k] = score; store.set("dw-best", b); } }
  function saveForm(k, score) {
    if (!A.hasApi()) return "";
    return '<div class="grid2 saver"><label class="field" for="x-nick">' + L("اسم مستعار للوحة الصدارة (اختياري)", "Nickname for the leaderboard (optional)") + '<input id="x-nick" maxlength="20" autocomplete="off"></label><label class="field" for="x-team">' + L("رمز الفريق (للطلبة)", "Team code (students)") + '<input id="x-team" maxlength="12" autocomplete="off" value="' + esc(store.get("dw-team", "")) + '"></label></div><div class="row" style="justify-content:center"><button class="btn line" data-act="x-save" data-k="' + k + '" data-score="' + score + '">' + L("احفظ نتيجتي", "Save my score") + "</button></div>";
  }
  DW.acts["x-save"] = function (el) {
    var nick = (qs("#x-nick").value || "").trim().slice(0, 20), team = (qs("#x-team").value || "").trim().slice(0, 12);
    if (!nick) { qs("#x-nick").focus(); return; }
    A.send("score", { k: el.getAttribute("data-k"), score: +el.getAttribute("data-score"), nick: nick, team: team }); el.disabled = true; el.textContent = L("حُفظت النتيجة", "Score saved"); if (DW.board) setTimeout(DW.board, 1500);
  };
  function resultBox(k, big, title, body, score) {
    return '<div class="game"><div class="result"><div class="big">' + big + "</div><b>" + title + "</b>" + body + saveForm(k, score) + '<div class="row" style="justify-content:center"><button class="btn go" data-act="x-start" data-k="' + k + '">' + L("العب مرة أخرى", "Play again") + '</button><a class="btn line" href="' + link("play") + '" data-act="x-close">' + L("كل الألعاب", "All games") + "</a></div></div></div>";
  }
  function area(html) { var a = qs("#g-area"); if (a) { a.innerHTML = html; a.scrollIntoView({ behavior: "smooth", block: "start" }); } }
  DW.kit = { toast: toast, award: award, badges: badges, dayKey: dayKey };

  /* =============================== TODAY =============================== */
  function pool() {
    return DW.myths.map(function (m) { return { text: m.claim, a: false, exp: m.fact, s: m.s }; }).concat(DW.truths.map(function (t) { return { text: t.q, a: true, exp: null, s: t.s }; }));
  }
  function dailyItem() { var p = pool(), n = Math.floor((A.today() - new Date(2026, 0, 1)) / 86400000); return p[(((n * 7 + 3) % p.length) + p.length) % p.length]; }
  function streak() { return store.get("dw-streak", { n: 0, last: "", days: [] }); }
  function doseHTML(it, d) {
    var done = d.day === dayKey();
    if (!done) return '<p class="dq">' + T(it.text) + '</p><div class="pair"><button class="btn fact" data-act="dose" data-a="1">' + L("حقيقة", "Fact") + '</button><button class="btn rumour" data-act="dose" data-a="0">' + L("إشاعة", "Rumour") + "</button></div>";
    var fact = it.a ? T(it.text) : T(it.exp), share = L("جرعة وعي اليوم: ", "Today's dose of awareness: ") + fact;
    return '<p class="dq">' + T(it.text) + '</p><div class="fb' + (d.ok ? "" : " bad") + '"><b>' + (d.ok ? L("إجابة صحيحة.", "Correct.") : L("ليست هذه.", "Not this one.")) + "</b> " + (it.a ? L("هذه حقيقة موثقة.", "This is a documented fact.") : L("هذه إشاعة. ", "This is a rumour. ") + T(it.exp)) + " " + A.refs([it.s]) + '</div><div class="row"><a class="btn light" href="https://wa.me/?text=' + encodeURIComponent(share) + '" target="_blank" rel="noopener">' + L("أرسل الحقيقة عبر واتساب", "Send the fact on WhatsApp") + '</a><span class="small">' + L("سؤال جديد غداً.", "A new question tomorrow.") + "</span></div>";
  }
  DW.acts.dose = function (el) {
    var it = dailyItem(), ok = (el.getAttribute("data-a") === "1") === it.a, s = streak(), today = dayKey(), y = new Date(); y.setDate(y.getDate() - 1);
    if (s.last !== today) { s.n = s.last === dayKey(y) ? s.n + 1 : 1; s.last = today; s.days = (s.days || []).concat([today]).slice(-14); store.set("dw-streak", s); }
    store.set("dw-daily", { day: today, ok: ok }); A.send("daily", { ok: ok ? 1 : 0, n: s.n });
    if (s.n >= 3) award("streak3"); if (s.n >= 7) award("streak7");
    A.render(true);
  };
  function weekDots(s) {
    var h = "", i, d, names = L("ح ن ث ر خ ج س", "S M T W T F S").split(" ");
    for (i = 6; i >= 0; i--) { d = new Date(); d.setDate(d.getDate() - i); h += '<i class="' + ((s.days || []).indexOf(dayKey(d)) >= 0 ? "on" : "") + (i === 0 ? " now" : "") + '"><span>' + names[d.getDay()] + "</span></i>"; }
    return '<div class="week" aria-hidden="true">' + h + "</div>";
  }
  DW.pages.today = function () {
    var st = A.stamps(), n = A.VIDS.filter(function (id) { return st[id]; }).length, s = streak(), d = store.get("dw-daily", {}), b = badges(), y = new Date(); y.setDate(y.getDate() - 1);
    var live = s.last === dayKey() || s.last === dayKey(y) ? s.n : 0;
    return '<section class="today"><div class="wrap"><div class="tgrid"><div class="dose"><div class="row" style="justify-content:space-between"><h1>' + L("جرعة اليوم", "Today's dose") + '</h1><span class="small">' + A.fmtDate(A.today()) + "</span></div>" + doseHTML(dailyItem(), d) + "</div>" +
      '<div class="stack side"><div class="streak"><span>' + L("الأيام المتتالية", "Days in a row") + "</span><b>" + live + "</b>" + weekDots(s) + "</div>" +
      '<a class="progress" href="' + link("home") + '"><span>' + L("بطاقة الوعي", "Awareness card") + "</span><b>" + L(n + " من 6", n + " of 6") + '</b><span class="pips">' + DW.vaccines.map(function (v) { return '<i style="--deep:' + v.deep + '" class="' + (st[v.id] ? "on" : "") + '"></i>'; }).join("") + "</span></a></div></div>" +
      '<div class="quick">' + [["play", L("العب", "Play"), L("ثماني ألعاب قصيرة", "Eight short games")], ["checker", L("أي مطعوم أسأل عنه؟", "Which vaccine?"), L("قائمة تأخذها إلى الصيدلاني", "A list to take to the pharmacist")], ["videos", L("الأفلام", "Films"), L("فيلم لكل مطعوم", "One film per vaccine")], ["teams", L("فريقي", "My team"), L("المواضيع ورفع الروابط", "Topics and submissions")]].map(function (q) { return '<a href="' + link(q[0]) + '"><b>' + q[1] + "</b><span>" + q[2] + "</span></a>"; }).join("") + "</div>" +
      "<h2>" + L("الشارات", "Badges") + '</h2><div class="badges">' + DW.badges.map(function (x) { return '<div class="badge' + (b[x.id] ? " on" : "") + '"><i aria-hidden="true"></i><b>' + T(x.name) + "</b><span>" + (b[x.id] ? L("نلتها في ", "Earned on ") + b[x.id] : T(x.how)) + "</span></div>"; }).join("") + '</div><div id="install-slot"></div></div></section>';
  };
  DW.after.today = function () { syncBadges(); if (DW.installSlot) DW.installSlot(); };
  function lang() { return A.lang(); }

  /* =============================== PLAY HUB =============================== */
  var GLYPH = {
    race: '<circle cx="24" cy="26" r="14"/><path d="M24 26V17M20 7h8M24 7v5"/>',
    memory: '<rect x="8" y="10" width="14" height="19" rx="3"/><rect x="26" y="19" width="14" height="19" rx="3"/><path class="f" d="M13 17h4v4h-4z"/>',
    when: '<rect x="8" y="11" width="32" height="28" rx="4"/><path d="M8 19h32M16 7v8M32 7v8"/><path class="f" d="M27 26h6v6h-6z"/>',
    shield: '<path d="M24 6l14 6v10c0 9-6 16-14 20-8-4-14-11-14-20V12z"/><path d="M18 24l4.5 4.5L31 20"/>',
    rf: '<path d="M8 10h32v20H22l-8 8v-8H8z"/><path d="M19 17l10 6M29 17l-10 6"/>',
    counter: '<path d="M6 34h36M10 34V20h28v14"/><circle cx="24" cy="12" r="5"/>',
    trick: '<circle cx="21" cy="21" r="11"/><path d="M29 29l11 11"/><path class="f" d="M19 16h4v7h-4zM19 25h4v3h-4z"/>'
  };
  var XG = {
    race: { name: function () { return L("سباق الدقيقة", "The one-minute race"); }, desc: function () { return L("ستون ثانية. احكم على أكبر عدد من العبارات: حقيقة أم إشاعة؟", "Sixty seconds. Judge as many statements as you can: fact or rumour?"); } },
    memory: { name: function () { return L("ذاكرة المطاعيم", "Vaccine memory"); }, desc: function () { return L("اقلب البطاقات وطابق كل مطعوم مع رسالته.", "Turn the cards and match each vaccine with its message."); } },
    when: { name: function () { return L("في أي وقت؟", "When?"); }, desc: function () { return L("تسعة أسئلة عن مواعيد الجرعات في الأردن.", "Nine questions on when doses are due in Jordan."); } },
    shield: { name: function () { return L("أوقف العدوى", "Stop the outbreak"); }, desc: function () { return L("مئة شخص في حيّ واحد وخمس عشرة جرعة. من تحمي أولاً؟", "One hundred people in a neighbourhood and fifteen doses. Who do you protect first?"); } }
  };
  DW.gameName = function (k) { return XG[k] ? XG[k].name() : DW.baseGames[k] ? DW.baseGames[k].name() : ""; };
  DW.titles.play = function () { return L("العب وتعلّم", "Play and learn"); };
  function tile(k, g, act, tint) {
    var b = store.get("dw-best", {});
    return '<div class="gtile" style="--deep:' + tint + '"><svg class="pict" viewBox="0 0 48 48" aria-hidden="true">' + GLYPH[k] + "</svg><b>" + g.name() + "</b><span>" + g.desc() + '</span><div class="row"><button class="btn" data-act="' + act + '" data-k="' + k + '">' + L("ابدأ", "Start") + "</button>" + (k in b ? '<span class="small muted">' + L("أفضل نتيجة ", "Best ") + b[k] + "</span>" : "") + "</div></div>";
  }
  DW.pages.play = function () {
    stopRace();
    var tints = ["#0B67B2", "#4A3FB5", "#8A6A00", "#0A7F63", "#C22D38", "#00796B", "#C8442B"], i = 0;
    return '<section class="band first"><div class="wrap"><h1>' + L("العب وتعلّم", "Play and learn") + '</h1><p class="lead">' + L("ثماني ألعاب قصيرة، كل واحدة في دقيقتين أو ثلاث. كل جواب موثق بمصدره.", "Eight short games, two or three minutes each. Every answer carries its source.") + '</p><a class="dailybar" href="' + link("today") + '"><b>' + L("جرعة اليوم", "Today's dose") + "</b><span>" + L("سؤال واحد كل يوم، وشارة لمن يواظب.", "One question a day, and a badge for keeping it up.") + '</span></a><div class="arcade">' +
      Object.keys(XG).map(function (k) { return tile(k, XG[k], "x-start", tints[i++]); }).join("") + Object.keys(DW.baseGames).map(function (k) { return tile(k, DW.baseGames[k], "g-start", tints[i++]); }).join("") +
      '</div><div id="g-area"></div><div id="g-board" class="stack"></div></div></section>';
  };
  DW.after.play = function () { if (DW.board) DW.board(); };
  DW.pages.games = DW.pages.play; DW.after.games = DW.after.play;
  DW.acts["x-close"] = function () { stopRace(); var a = qs("#g-area"); if (a) a.innerHTML = ""; window.scrollTo(0, 0); };
  DW.acts["x-start"] = function (el) { stopRace(); ({ race: raceStart, memory: memStart, when: whenStart, shield: shieldStart })[el.getAttribute("data-k")](); };

  /* ---------- one-minute race ---------- */
  var R = null;
  function stopRace() { if (R && R.timer) { clearInterval(R.timer); R.timer = null; } }
  function raceStart() {
    R = { items: shuffle(pool()), i: 0, right: 0, missed: [], end: Date.now() + 60000, timer: null };
    area('<div class="game race"><div class="row" style="justify-content:space-between"><b>' + XG.race.name() + '</b><div class="score"><span id="r-left">60</span><span id="r-right">0</span></div></div><div class="bar"><i id="r-bar" style="width:100%"></i></div><div class="gcard" id="r-card"></div><div class="pair"><button class="btn fact" data-act="r-ans" data-a="1">' + L("حقيقة", "Fact") + '</button><button class="btn rumour" data-act="r-ans" data-a="0">' + L("إشاعة", "Rumour") + "</button></div></div>");
    raceDraw();
    R.timer = setInterval(function () {
      var left = Math.max(0, R.end - Date.now()), bar = qs("#r-bar");
      if (!bar) { stopRace(); return; }
      bar.style.width = (left / 600).toFixed(1) + "%"; qs("#r-left").textContent = Math.ceil(left / 1000);
      if (left <= 0) raceEnd();
    }, 200);
  }
  function raceDraw() { var c = qs("#r-card"); if (c) { c.textContent = T(R.items[R.i % R.items.length].text); c.classList.remove("flash-ok", "flash-bad"); } }
  DW.acts["r-ans"] = function (el) {
    if (!R || !R.timer) return; var it = R.items[R.i % R.items.length], ok = (el.getAttribute("data-a") === "1") === it.a, c = qs("#r-card");
    if (ok) R.right++; else R.missed.push(it);
    qs("#r-right").textContent = R.right; R.i++;
    if (c) { void c.offsetWidth; c.classList.add(ok ? "flash-ok" : "flash-bad"); }
    setTimeout(raceDraw, 160);
  };
  function raceEnd() {
    stopRace(); best("race", R.right); A.send("game", { k: "race", score: R.right, pct: R.i ? Math.round((R.right / R.i) * 100) : 0 }); if (R.right >= 10) award("race");
    var seen = {}, miss = R.missed.filter(function (m) { var k = T(m.text); if (seen[k]) return false; seen[k] = 1; return true; }).slice(0, 5);
    area(resultBox("race", R.right, L("الإجابات الصحيحة في دقيقة", "correct answers in one minute"), (miss.length ? '<div class="review"><b>' + L("راجع ما فاتك", "Review what you missed") + "</b>" + miss.map(function (m) { return "<p>" + (m.a ? '<span class="sticker" style="--bg:#D9F3E6">' + L("حقيقة", "Fact") + "</span> " + T(m.text) : '<span class="sticker" style="--bg:#FBE0E2">' + L("إشاعة", "Rumour") + "</span> " + T(m.text) + " " + T(m.exp)) + " " + A.refs([m.s]) + "</p>"; }).join("") + "</div>" : "<p>" + L("لم تخطئ في أي عبارة.", "You did not miss a single one.") + "</p>"), R.right));
  }

  /* ---------- memory ---------- */
  var M = null;
  function memStart() {
    var cards = [];
    DW.vaccines.forEach(function (v) { cards.push({ id: v.id, side: "a", v: v }); cards.push({ id: v.id, side: "b", v: v }); });
    M = { cards: shuffle(cards), open: [], done: {}, turns: 0, lock: false };
    area('<div class="game"><div class="row" style="justify-content:space-between"><b>' + XG.memory.name() + '</b><div class="score"><span>' + L("المحاولات ", "Turns ") + '<span id="m-turns">0</span></span></div></div><div class="mem">' + M.cards.map(function (c, i) {
      return '<button class="mcard" data-act="m-flip" data-i="' + i + '" style="--bg:' + c.v.bg + ";--deep:" + c.v.deep + '" aria-label="' + L("بطاقة مقلوبة", "Face-down card") + '"><span class="face">' + (c.side === "a" ? A.pict(c.id) + "<b>" + T(c.v.name) + "</b>" : "<em>" + T(c.v.tag) + "</em>") + "</span></button>";
    }).join("") + '</div><p class="small muted">' + L("طابق اسم المطعوم مع رسالته.", "Match each vaccine with its message.") + "</p></div>");
  }
  DW.acts["m-flip"] = function (el) {
    if (!M || M.lock) return; var i = +el.getAttribute("data-i"), c = M.cards[i];
    if (M.done[i] || M.open.indexOf(i) >= 0) return;
    el.classList.add("up"); el.setAttribute("aria-label", c.side === "a" ? T(c.v.name) : T(c.v.tag)); M.open.push(i);
    if (M.open.length < 2) return;
    M.turns++; qs("#m-turns").textContent = M.turns;
    var a = M.open[0], b = M.open[1], els = qsa(".mcard");
    if (M.cards[a].id === M.cards[b].id) {
      M.done[a] = M.done[b] = 1; els[a].classList.add("ok"); els[b].classList.add("ok"); M.open = [];
      if (Object.keys(M.done).length === M.cards.length) setTimeout(memEnd, 700);
    } else { M.lock = true; setTimeout(function () { if (els[a]) els[a].classList.remove("up"); if (els[b]) els[b].classList.remove("up"); M.open = []; M.lock = false; }, 950); }
  };
  function memEnd() {
    var score = Math.max(10, 100 - (M.turns - 6) * 8); best("memory", score); A.send("game", { k: "memory", score: score, pct: score }); if (M.turns <= 10) award("memory");
    area(resultBox("memory", M.turns, L("عدد المحاولات لمطابقة ستة أزواج", "turns taken to match six pairs"), "<p>" + L("أفضل نتيجة ممكنة ست محاولات.", "The best possible result is six turns.") + "</p>", score));
  }

  /* ---------- when? ---------- */
  var W = null;
  function whenStart() { W = { q: shuffle(DW.when), i: 0, right: 0 }; whenDraw(); }
  function whenDraw() {
    var q = W.q[W.i];
    area('<div class="game"><div class="row" style="justify-content:space-between"><b>' + XG.when.name() + '</b><div class="score"><span>' + (W.i + 1) + L(" من ", " of ") + W.q.length + "</span><span>" + W.right + '</span></div></div><div class="bar"><i style="width:' + Math.round((W.i / W.q.length) * 100) + '%"></i></div><div class="gcard">' + T(q.q) + '</div><div class="tline" id="w-opts">' + q.o.map(function (o, i) { return '<button class="opt" data-act="w-ans" data-i="' + i + '">' + T(o) + "</button>"; }).join("") + '</div><div id="w-fb" role="status"></div></div>');
  }
  DW.acts["w-ans"] = function (el) {
    var q = W.q[W.i], i = +el.getAttribute("data-i"), ok = i === q.a, last = W.i === W.q.length - 1;
    qsa("#w-opts .opt").forEach(function (b, k) { b.disabled = true; if (k === q.a) b.classList.add("ok"); else if (k === i) b.classList.add("bad"); });
    if (ok) W.right++;
    qs("#w-fb").innerHTML = '<div class="fb' + (ok ? "" : " bad") + '"><b>' + (ok ? L("صحيح.", "Correct.") : L("الجواب: ", "The answer: ") + T(q.o[q.a]) + ".") + "</b> " + A.refs([q.s]) + '</div><div class="row" style="margin-top:12px"><button class="btn" data-act="w-next">' + (last ? L("النتيجة", "See the result") : L("التالي", "Next")) + "</button></div>";
    var b = qs("#w-fb .btn"); if (b) b.focus();
  };
  DW.acts["w-next"] = function () {
    if (W.i < W.q.length - 1) { W.i++; whenDraw(); return; }
    var pct = Math.round((W.right / W.q.length) * 100); best("when", W.right * 10); A.send("game", { k: "when", score: W.right * 10, pct: pct }); if (W.right === W.q.length) award("when");
    area(resultBox("when", W.right + "/" + W.q.length, L("المواعيد الصحيحة", "timings right"), "<p>" + L("المواعيد من البرنامج الوطني للتطعيم ومنظمة الصحة العالمية واشتراطات الحج والعمرة. راجع طبيبك أو المركز الصحي لتأكيد موعد طفلك.", "The timings come from the national immunisation programme, WHO and the Hajj and Umrah requirements. Confirm your own child's dates with the doctor or health centre.") + "</p>", W.right * 10));
  };

  /* ---------- stop the outbreak: a simplified model for illustration ---------- */
  var S = null;
  function near(a, b) { return Math.max(Math.abs((a % 10) - (b % 10)), Math.abs(Math.floor(a / 10) - Math.floor(b / 10))) <= 2; }
  function shieldStart() {
    var idx, cells, i, seed, guard = 0;
    do {
      idx = shuffle(Array.apply(null, { length: 100 }).map(function (_, k) { return k; })); cells = []; for (i = 0; i < 100; i++) cells.push("v");
      seed = idx[0]; idx.slice(1, 18).forEach(function (k) { cells[k] = "u"; }); idx.slice(18, 20).forEach(function (k) { cells[k] = "x"; }); cells[seed] = "i";
    } while (guard++ < 50 && (near(seed, idx[18]) || near(seed, idx[19])));
    S = { cells: cells, seed: seed, doses: 15, run: false };
    shieldDraw();
  }
  function shieldDraw(note) {
    var lab = { v: L("أخذ المطعوم", "Vaccinated"), u: L("لم يأخذ المطعوم بعد", "Not yet vaccinated"), p: L("أعطيته جرعة", "You gave a dose"), x: L("لا يستطيع أخذ المطعوم", "Cannot be vaccinated"), i: L("مصاب", "Infected") };
    area('<div class="game"><div class="row" style="justify-content:space-between"><b>' + XG.shield.name() + '</b><div class="score"><span>' + L("الجرعات ", "Doses ") + '<span id="s-doses">' + S.doses + '</span></span></div></div><p>' + L("ظهرت حالة حصبة في الحيّ. أعطِ جرعاتك لمن لم يأخذوا المطعوم، ثم انظر هل تجد العدوى طريقاً. الرضيع والمريض الذي لا يستطيع أخذ المطعوم يعتمدان عليك.", "A measles case has appeared in the neighbourhood. Give your doses to people who are not yet vaccinated, then see whether infection finds a path. The infant and the patient who cannot be vaccinated depend on you.") + '</p><div class="hood" id="s-grid">' + S.cells.map(function (c, i) {
      return c === "u" || c === "p" ? '<button class="c ' + c + '" data-act="s-tap" data-i="' + i + '" aria-label="' + lab[c] + '"' + (S.run ? " disabled" : "") + "></button>" : '<span class="c ' + c + '" role="img" aria-label="' + lab[c] + '"></span>';
    }).join("") + '</div><div class="legend">' + ["v", "u", "p", "x", "i"].map(function (k) { return '<span><i class="c ' + k + '"></i>' + lab[k] + "</span>"; }).join("") + '</div><div id="s-fb" role="status">' + (note || "") + '</div><div class="row"><button class="btn go" data-act="s-run"' + (S.run ? " disabled" : "") + ">" + L("انظر ما يحدث", "See what happens") + '</button><span class="small muted">' + L("نموذج مبسّط للتوضيح.", "A simplified model for illustration.") + "</span></div></div>");
  }
  DW.acts["s-tap"] = function (el) {
    if (!S || S.run) return; var i = +el.getAttribute("data-i");
    if (S.cells[i] === "u") { if (!S.doses) { DW.kit.toast(L("انتهت الجرعات. اضغط على شخص أعطيته جرعة لتستعيدها.", "No doses left. Tap someone you vaccinated to take a dose back.")); return; } S.cells[i] = "p"; S.doses--; } else { S.cells[i] = "u"; S.doses++; }
    el.className = "c " + S.cells[i]; qs("#s-doses").textContent = S.doses;
  };
  DW.acts["s-run"] = function () {
    if (!S || S.run) return; S.run = true; qsa("#s-grid button, [data-act='s-run']").forEach(function (b) { b.disabled = true; });
    var wave = [S.seed], total = 1, hit = 0, els = qsa("#s-grid .c");
    (function step() {
      var next = [];
      wave.forEach(function (a) { S.cells.forEach(function (c, b) { if ((c === "u" || c === "x") && near(a, b)) { if (c === "x") hit++; S.cells[b] = "i"; next.push(b); if (els[b]) els[b].className = "c i new"; } }); });
      total += next.length; wave = next;
      if (next.length) { setTimeout(step, 520); return; }
      var first = !store.get("dw-shield-played", false), perfect = total === 1, good = !hit && total <= 3, score = perfect ? 100 : good ? 70 : 30; store.set("dw-shield-played", true);
      best("shield", score); A.send("game", { k: "shield", score: score, pct: score }); if (perfect && first) award("shield");
      qs("#s-fb").innerHTML = '<div class="fb' + (good ? "" : " bad") + '"><b>' + (perfect ? L("احتواء كامل: لم تنتقل العدوى إلى أحد.", "Fully contained: the infection reached no one else.") : good ? L("انتقلت العدوى إلى عدد قليل (" + (total - 1) + ") ثم توقفت.", "The infection reached " + (total - 1) + " more and then stopped.") : L("عدد المصابين: " + total + (hit ? "، وبينهم من لا يستطيع أخذ المطعوم." : "."), "The infection reached " + total + " people" + (hit ? ", including someone who cannot be vaccinated." : "."))) + "</b> " + L("حين يأخذ 95 من كل 100 الجرعتين تتباعد الفراغات فلا تجد العدوى طريقاً، وجرعتان من المطعوم تحميان 97 من كل 100.", "When 95 in every 100 have both doses, the gaps are too far apart for infection to find a path, and two doses protect 97 in every 100.") + " " + A.refs(["who-measles-25", "cdc-measles"]) + '</div>' + saveForm("shield", score) + '<div class="row" style="margin-top:12px"><button class="btn" data-act="x-start" data-k="shield">' + L("حيّ جديد", "A new neighbourhood") + "</button></div>";
    })();
  };
})();
