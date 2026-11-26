/* A Dose of Awareness: games, films, student hub and impact pages. */
(function () {
  "use strict";
  var DW = window.DW, C = DW.config, A = DW.app;
  var L = A.L, T = A.T, qs = A.qs, out = A.out, link = A.link, shuffle = A.shuffle, esc = A.esc;

  /* =============================== GAMES =============================== */
  var G = null;
  var GAMES = {
    rf: { name: function () { return L("إشاعة أم حقيقة؟", "Rumour or fact?"); }, desc: function () { return L("عشر عبارات عن المطاعيم. احكم على كل واحدة قبل أن ترى الجواب ومصدره.", "Ten statements about vaccines. Judge each one before you see the answer and its source."); } },
    counter: { name: function () { return L("على الكاونتر", "At the counter"); }, desc: function () { return L("أنت الصيدلاني. ستة مراجعين، ولكل واحد سؤال أو اعتراض. اختر أفضل رد.", "You are the pharmacist. Six customers, each with a question or an objection. Choose the best reply."); } },
    trick: { name: function () { return L("اكشف الحيلة", "Spot the trick"); }, desc: function () { return L("منشورات مصنوعة على طريقة الإشاعات. سمِّ الحيلة التي يستخدمها كل منشور.", "Posts written the way rumours are. Name the trick each one uses."); } }
  };
  function levels(pct) {
    return pct >= 90 ? L("صيدلاني الحيّ الموثوق", "The trusted neighbourhood pharmacist") : pct >= 70 ? L("صائد الإشاعات", "Rumour hunter") : pct >= 40 ? L("متدرّب مجتهد", "Keen trainee") : L("بداية الطريق", "Just getting started");
  }
  DW.pages.games = function () {
    G = null;
    return '<section class="band" style="border:0"><div class="wrap"><h1>' + L("العب وتعلّم", "Play and learn") + '</h1><p class="lead">' + L("ثلاث ألعاب قصيرة، كل واحدة في دقيقتين أو ثلاث. كل جواب موثق بمصدره.", "Three short games, two or three minutes each. Every answer carries its source.") + '</p><div class="three">' +
      Object.keys(GAMES).map(function (k) { return '<div class="tile"><b>' + GAMES[k].name() + "</b><span>" + GAMES[k].desc() + '</span><div class="row"><button class="btn go" data-act="g-start" data-k="' + k + '">' + L("ابدأ", "Start") + "</button></div></div>"; }).join("") +
      '</div><div id="g-area"></div><div id="g-board" class="stack"></div></div></section>';
  };
  DW.after.games = function () { board(); };

  DW.acts["g-start"] = function (el) {
    var k = el.getAttribute("data-k"), rounds;
    if (k === "rf") {
      rounds = shuffle(shuffle(DW.myths).slice(0, 5).map(function (m) { return { text: T(m.claim), a: false, exp: T(m.fact), s: m.s }; })
        .concat(shuffle(DW.truths).slice(0, 5).map(function (t) { return { text: T(t.q), a: true, exp: L("هذه معلومة موثقة.", "This statement is documented."), s: t.s }; })));
    } else if (k === "counter") {
      rounds = shuffle(DW.cases).slice(0, 6).map(function (c) { return { who: T(c.who), text: T(c.says), opts: shuffle(c.opts.map(function (o, i) { return { t: T(o), ok: i === c.best }; })), exp: T(c.why) }; });
    } else {
      var keys = Object.keys(DW.tricks);
      rounds = shuffle(DW.posts).map(function (p) { var others = shuffle(keys.filter(function (x) { return x !== p.t; })).slice(0, 2); return { text: T(p.post), opts: shuffle([p.t].concat(others)).map(function (x) { return { t: T(DW.tricks[x].name), ok: x === p.t }; }), exp: T(p.why) }; });
    }
    G = { k: k, rounds: rounds, i: 0, score: 0, right: 0, streak: 0, done: false };
    draw(); var a = qs("#g-area"); if (a) a.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  function draw() {
    var r = G.rounds[G.i], n = G.rounds.length, h;
    var head = '<div class="row" style="justify-content:space-between"><b>' + GAMES[G.k].name() + '</b><div class="score"><span>' + L("الجولة ", "Round ") + (G.i + 1) + L(" من ", " of ") + n + "</span><span>" + L("النقاط ", "Points ") + G.score + '</span></div></div><div class="bar"><i style="width:' + Math.round((G.i / n) * 100) + '%"></i></div>';
    if (G.k === "rf") h = '<div class="gcard">' + r.text + '</div><div class="pair" id="g-ans"><button class="btn fact" data-act="g-rf" data-a="1">' + L("حقيقة", "Fact") + '</button><button class="btn rumour" data-act="g-rf" data-a="0">' + L("إشاعة", "Rumour") + "</button></div>";
    else h = (G.k === "counter" ? '<div class="gcard"><small>' + r.who + "</small>«" + r.text + "»</div>" : '<div class="gcard post"><small>' + L("منشور متداول (مثال تعليمي)", "A circulating post (teaching example)") + "</small>" + r.text + "</div><p><b>" + L("ما الحيلة المستخدمة؟", "Which trick is at work?") + "</b></p>") +
      '<div class="opts" id="g-ans">' + r.opts.map(function (o, i) { return '<button class="opt" data-act="g-opt" data-i="' + i + '">' + o.t + "</button>"; }).join("") + "</div>";
    qs("#g-area").innerHTML = '<div class="game" style="margin-top:18px">' + head + h + '<div id="g-fb" role="status"></div></div>';
  }
  function feedback(ok, exp, s) {
    if (ok) { G.right++; G.streak++; G.score += 10 + (G.streak >= 3 ? 5 : 0); } else G.streak = 0;
    var last = G.i === G.rounds.length - 1;
    qs("#g-fb").innerHTML = '<div class="fb' + (ok ? "" : " bad") + '"><b>' + (ok ? L("إجابة صحيحة.", "Correct.") + (G.streak >= 3 ? " " + L("ثلاث متتالية: 5 نقاط إضافية.", "Three in a row: 5 bonus points.") : "") : L("ليست هذه.", "Not this one.")) + "</b> " + exp + (s ? A.refs([s]) : "") + '</div><div class="row" style="margin-top:12px"><button class="btn" data-act="g-next">' + (last ? L("اعرض النتيجة", "Show the result") : L("التالي", "Next")) + "</button></div>";
    var b = qs("#g-fb .btn"); if (b) b.focus();
  }
  DW.acts["g-rf"] = function (el) {
    if (!G || G.done) return; var r = G.rounds[G.i], ok = (el.getAttribute("data-a") === "1") === r.a;
    A.qsa("#g-ans .btn").forEach(function (b) { b.disabled = true; });
    feedback(ok, (r.a ? '<span class="sticker" style="--bg:#D9F3E6">' + L("حقيقة", "Fact") + "</span> " : '<span class="sticker" style="--bg:#FBE0E2">' + L("إشاعة", "Rumour") + "</span> ") + r.exp, r.s);
  };
  DW.acts["g-opt"] = function (el) {
    if (!G || G.done) return; var r = G.rounds[G.i], i = +el.getAttribute("data-i");
    A.qsa("#g-ans .opt").forEach(function (b, k) { b.disabled = true; if (r.opts[k].ok) b.classList.add("ok"); else if (k === i) b.classList.add("bad"); });
    feedback(r.opts[i].ok, r.exp);
  };
  DW.acts["g-next"] = function () {
    if (!G) return;
    if (G.i < G.rounds.length - 1) { G.i++; draw(); return; }
    G.done = true; var pct = Math.round((G.right / G.rounds.length) * 100);
    var best = A.store.get("dw-best", {}); if (!(G.k in best) || G.score > best[G.k]) { best[G.k] = G.score; A.store.set("dw-best", best); }
    A.send("game", { k: G.k, score: G.score, pct: pct });
    qs("#g-area").innerHTML = '<div class="game" style="margin-top:18px"><div class="result"><span class="stamp round new">' + pct + '%</span><div class="big">' + G.score + "</div><b>" + levels(pct) + "</b><p>" + L("أجبت عن " + G.right + " من " + G.rounds.length + " إجابة صحيحة.", "You answered " + G.right + " of " + G.rounds.length + " correctly.") + "</p>" +
      (A.hasApi() ? '<div class="grid2" style="width:100%;max-width:520px"><label class="field" for="g-nick">' + L("اسم مستعار للوحة الصدارة (اختياري)", "Nickname for the leaderboard (optional)") + '<input id="g-nick" maxlength="20" autocomplete="off"></label><label class="field" for="g-team">' + L("رمز الفريق (للطلبة)", "Team code (students)") + '<input id="g-team" maxlength="12" autocomplete="off"></label></div><button class="btn line" data-act="g-save">' + L("احفظ النتيجة", "Save the score") + "</button>" : "") +
      '<div class="row" style="justify-content:center"><button class="btn go" data-act="g-start" data-k="' + G.k + '">' + L("العب مرة أخرى", "Play again") + '</button><a class="btn line" href="' + link("myths") + '">' + L("راجع الإشاعات والحقائق", "Review the rumours and facts") + "</a></div></div></div>";
  };
  DW.acts["g-save"] = function (el) {
    var nick = (qs("#g-nick").value || "").trim().slice(0, 20), team = (qs("#g-team").value || "").trim().slice(0, 12);
    if (!nick) { qs("#g-nick").focus(); return; }
    A.send("score", { k: G.k, score: G.score, nick: nick, team: team }); el.disabled = true; el.textContent = L("حُفظت النتيجة", "Score saved"); setTimeout(board, 1500);
  };
  DW.baseGames = GAMES;
  function board() {
    var el = qs("#g-board"); if (!el) return;
    A.api("scores").then(function (d) {
      el = qs("#g-board"); if (!el) return;
      var name = function (k) { return DW.gameName ? DW.gameName(k) : GAMES[k] ? GAMES[k].name() : ""; };
      if (!d || !d.top || !d.top.length) { var b = A.store.get("dw-best", {}), ks = Object.keys(b).filter(name); el.innerHTML = ks.length ? '<p class="small muted">' + L("أفضل نتائجك على هذا الجهاز: ", "Your best scores on this device: ") + ks.map(function (k) { return name(k) + " " + b[k]; }).join(L("، ", ", ")) + "</p>" : ""; return; }
      el.innerHTML = "<h2>" + L("لوحة الصدارة", "Leaderboard") + '</h2><div class="tblwrap"><table class="tbl"><thead><tr><th>' + L("الاسم", "Name") + "</th><th>" + L("الفريق", "Team") + "</th><th>" + L("اللعبة", "Game") + "</th><th>" + L("النقاط", "Points") + "</th></tr></thead><tbody>" + d.top.slice(0, 10).map(function (r) { return "<tr><td>" + esc(r.nick) + "</td><td>" + esc(r.team || "") + "</td><td>" + name(r.k) + "</td><td>" + (+r.score || 0) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    });
  }
  DW.board = board;

  /* =============================== FILMS =============================== */
  DW.pages.videos = function () {
    var soc = C.social || {}, links = [["instagram", "Instagram"], ["facebook", "Facebook"], ["youtube", "YouTube"], ["tiktok", "TikTok"]].filter(function (s) { return soc[s[0]]; });
    return '<section class="band" style="border:0"><div class="wrap"><h1>' + L("الأفلام", "Films") + '</h1><p class="lead">' + L("ستة أفلام قصيرة، فيلم لكل مطعوم: مشهد من الحياة اليومية، إشاعة تُصحَّح، وخطوة واحدة واضحة.", "Six short films, one for each vaccine: a scene from daily life, a rumour corrected, and one clear step.") + '</p><div class="films">' +
      DW.vaccines.map(function (v) { return '<div class="stack" style="--bg:' + v.bg + ";--deep:" + v.deep + '">' + A.filmHTML(v.id) + '<a class="sticker" style="text-decoration:none;text-align:center" href="' + link(v.id) + '">' + T(v.vac) + "</a></div>"; }).join("") + "</div>" +
      "<h2>" + L("أفلام الطلبة", "Student films") + '</h2><div id="sv" class="films"><p class="note" style="grid-column:1/-1">' + L("لم تُنشر أفلام للطلبة بعد. يُفتح باب المشاركة مع انطلاق الحملة.", "No student films have been published yet. Submissions open when the campaign launches.") + "</p></div>" +
      "<h2>" + L("تابع الحملة", "Follow the campaign") + "</h2>" + (links.length ? '<div class="row">' + links.map(function (s) { return '<a class="btn line" href="' + soc[s[0]] + '" target="_blank" rel="noopener">' + s[1] + "</a>"; }).join("") + "</div>" : "<p>" + L("قنوات الحملة على إنستغرام وفيسبوك ويوتيوب تُعلن عند الانطلاق.", "The campaign channels on Instagram, Facebook and YouTube will be announced at launch.") + "</p>") +
      '<p class="small muted">' + T(C.hashtag) + '</p><div class="row"><a class="btn" href="' + link("students") + '">' + L("أنت طالب صيدلة؟ شارك بفيلمك", "Pharmacy student? Contribute your film") + "</a></div></div></section>";
  };
  DW.after.videos = function () {
    A.api("videos").then(function (d) {
      var el = qs("#sv"); if (!el || !d || !d.items || !d.items.length) return;
      el.innerHTML = d.items.slice(0, 60).map(function (x) {
        var id = String(x.yt || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 15), v = A.vac(x.vaccine) || { bg: "#EEF2F8", deep: "#1F2A5C" };
        return '<div class="stack" style="--bg:' + v.bg + ";--deep:" + v.deep + '"><div class="film" data-yt="' + id + '"><button class="ph" data-act="yt" style="border:0;cursor:pointer"><b>' + esc(A.lang() === "ar" ? x.title_ar || x.title_en || "" : x.title_en || x.title_ar || "") + "</b><span>" + L("شغّل الفيلم", "Play the film") + '</span></button></div><span class="small">' + esc(x.team || "") + ' <a href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener">' + L("افتح في يوتيوب", "Open on YouTube") + "</a></span></div>";
      }).join("");
    });
  };

  /* =============================== STUDENT HUB =============================== */
  function table(head, rows) { return '<div class="tblwrap"><table class="tbl"><thead><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>"; }
  DW.pages.students = function () {
    var pages = [["home", L("الصفحة الرئيسية", "Home page")]].concat(DW.vaccines.map(function (v) { return [v.id, T(v.vac)]; })).concat([["checker", L("أي المطاعيم أسأل عنها؟", "Which vaccines?")], ["games", L("الألعاب", "Games")], ["myths", L("إشاعات وحقائق", "Rumours and facts")]]);
    var srcs = [["brochure", L("بروشور", "Brochure")], ["poster", L("ملصق", "Poster")], ["booth", L("ركن الحملة في الجامعة", "Campus booth")], ["pharmacy", L("صيدلية شريكة", "Partner pharmacy")], ["social", L("منشور على وسائل التواصل", "Social media post")]];
    return '<section class="band" style="border:0"><div class="wrap"><h1>' + L("ملتقى الطلبة", "Student hub") + '</h1><p class="lead">' + L("هنا الأدوار ومعايير المحتوى وأدوات النشر لطلبة السنوات الرابعة والخامسة والسادسة وطلبة الماجستير.", "Roles, content standards and publishing tools for fourth, fifth and sixth-year students and Masters students.") + "</p>" +
      "<h2>" + L("عشرون فريقاً، وأربعة أدوار في كل فريق", "Twenty teams, four roles in each") + "</h2><p>" + L("في كل فريق من أربعة إلى ستة طلبة. يصنع الفريق أربعة أفلام قصيرة: فيلمان عن كل موضوع من موضوعيه. الأفلام القصيرة شرط للحصول على شهادة الحملة.", "Each team has four to six students and makes four reels, two on each of its two topics. The reels are a condition for the campaign certificate.") + "</p>" + table([L("الدور", "Role"), L("من", "Who"), L("المسؤولية", "Responsibility")], [
        [L("قائد المحتوى", "Content lead"), L("السنة الرابعة أو الخامسة", "Fourth or fifth year"), L("يكتب نص الفيلم القصير والمنشور المرافق من مصادر الموضوع", "Writes the reel script and its caption from the topic's sources")],
        [L("المدقق العلمي", "Evidence reviewer"), L("السنة السادسة أو طالب ماجستير", "Sixth year or Masters student"), L("يراجع كل مادة على قائمة التدقيق والمصادر قبل رفعها", "Checks every piece against the checklist and sources before it is submitted")],
        [L("المنتج", "Producer"), L("أي سنة", "Any year"), L("يصوّر ويحرّر ويضيف النص المكتوب على الشاشة، ويجهز النسخة العمودية 1080×1920", "Films, edits and adds on-screen captions, and prepares the 1080×1920 vertical master")],
        [L("مسؤول النشر والقياس", "Publishing and measurement lead"), L("أي سنة", "Any year"), L("يرفع الروابط على لوحة الفرق، ويتابع الأرقام والتعليقات كل أسبوع", "Submits links on the teams board and follows numbers and comments every week")]
      ]) + '<div class="row"><a class="btn" href="' + link("teams") + '">' + L("لوحة الفرق والمواضيع", "Teams and topics board") + '</a><a class="btn line" href="' + link("workshop") + '">' + L("ورشة الصيدلاني على وسائل التواصل", "Social media pharmacist workshop") + "</a></div>" +
      "<h2>" + L("قائمة التدقيق قبل النشر", "Checklist before publishing") + '</h2><ol class="steps">' + [
        L("كل معلومة لها مصدر من القائمة المعتمدة: وزارة الصحة الأردنية، منظمة الصحة العالمية، ثم CDC واليونيسف والدراسات المحكّمة.", "Every statement has a source from the approved list: the Jordanian Ministry of Health, WHO, then CDC, UNICEF and peer-reviewed studies."),
        L("الأرقام تُنقل كما وردت مع سنتها، دون تقريب يغيّر المعنى.", "Numbers are reported as published, with their year, without rounding that changes the meaning."),
        L("لا أسماء تجارية ولا شعارات شركات.", "No brand names and no company logos."),
        L("تصحيح الإشاعة بترتيب ثابت: الحقيقة، ثم التنبيه إلى الإشاعة، ثم سبب خطئها، ثم الحقيقة مرة أخرى.", "Correct a rumour in a fixed order: the fact, a warning that a rumour follows, why it is wrong, then the fact again."),
        L("لا تخويف بلا حل. كل رسالة تنتهي بخطوة واحدة يستطيع القارئ فعلها اليوم.", "No fear without a way out. Every message ends with one step the reader can take today."),
        L("عربية فصيحة مبسطة وجمل قصيرة. نستخدم «مطعوم» ونذكر «لقاح» عند أول استعمال.", "Plain standard Arabic and short sentences. Use the term common in Jordan and give the alternative on first use."),
        L("لا صور لمرضى حقيقيين، ولا لأطفال دون إذن خطي من ذويهم.", "No images of real patients, and none of children without written consent from their guardians."),
        L("يوقّع المدقق العلمي ثم عضو هيئة التدريس قبل النشر.", "The evidence reviewer and then a faculty member sign off before publication.")
      ].map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ol>" +
      "<h2>" + L("من المسودة إلى النشر", "From draft to publication") + '</h2><ol class="steps"><li>' + L("المدقق العلمي في الفريق يراجع النص على قائمة التدقيق ويوقّع.", "The team's evidence reviewer checks the script against the checklist and signs it off.") + "</li><li>" + L("الفريق يصوّر الفيلم ويرسله إلى المشرف للاعتماد.", "The team films the reel and sends it to the supervisor for approval.") + "</li><li>" + L("بعد الاعتماد يُنشر على قنوات الحملة: إنستغرام، تيك توك، يوتيوب، فيسبوك.", "Once approved it is published on the campaign channels: Instagram, TikTok, YouTube and Facebook.") + "</li><li>" + L("مسؤول النشر يرفع الروابط على لوحة الفرق برمز الفريق.", "The publishing lead submits the links on the teams board with the team code.") + "</li><li>" + L("تظهر المادة المعتمدة في الموقع وتُحتسب في سجل الفريق.", "The approved piece appears on the site and counts in the team's record.") + '</li></ol><div class="row"><a class="btn go" href="' + link("teams") + '">' + L("افتح لوحة الفرق", "Open the teams board") + "</a>" + (C.submitFormUrl ? '<a class="btn line" href="' + C.submitFormUrl + '" target="_blank" rel="noopener">' + L("نموذج رفع البروشورات والملصقات", "Form for brochures and posters") + "</a>" : "") + "</div>" +
      "<h2>" + L("مواصفات البروشور على كانفا", "Brochure specification for Canva") + '</h2><ul class="clean"><li>' + L("المقاس: A5 بوجهين، أو A4 مطوي ثلاث طيات.", "Size: A5 double-sided, or A4 tri-fold.") + "</li><li>" + L("رسالة واحدة وخطوة واحدة في كل بروشور.", "One message and one action per brochure.") + "</li><li>" + L("لون المطعوم من ألوان الموقع، وخط واضح لا يقل عن 11 نقطة.", "The vaccine's colour from the site palette, and a clear typeface no smaller than 11 point.") + "</li><li>" + L("رمز QR في الزاوية السفلية بعرض لا يقل عن 2.5 سم، مع سطر المصادر وتاريخ المراجعة.", "A QR code in the bottom corner at least 2.5 cm wide, with a sources line and the review date.") + "</li><li>" + L("التصدير: PDF للطباعة وPNG للنشر الرقمي.", "Export: PDF for print and PNG for digital use.") + "</li></ul>" +
      "<h2>" + L("مولّد رمز QR", "QR code maker") + '</h2><div class="tool"><p class="small">' + L("كل رمز يحمل مصدره ورمز فريقك، فنعرف أي بروشور أو ركن جلب الزيارات.", "Each code carries its source and your team code, so we can see which brochure or booth brought the visits.") + '</p>' + (C.siteUrl ? "" : '<p class="note">' + L("لم يُحدَّد العنوان النهائي للموقع بعد، فالرموز المولّدة الآن تشير إلى عنوان مؤقت. استخدمها للتجربة فقط ولا تطبعها.", "The final address of the site is not set yet, so codes made now point to a temporary address. Use them for testing only and do not print them.") + "</p>") + '<div class="grid2"><label class="field" for="qr-page">' + L("الصفحة", "Page") + '<select id="qr-page" data-input="qr">' + pages.map(function (p) { return '<option value="' + p[0] + '">' + p[1] + "</option>"; }).join("") + '</select></label><label class="field" for="qr-src">' + L("أين سيوضع الرمز؟", "Where will the code be placed?") + '<select id="qr-src" data-input="qr">' + srcs.map(function (s) { return '<option value="' + s[0] + '">' + s[1] + "</option>"; }).join("") + '</select></label><label class="field" for="qr-team">' + L("رمز الفريق", "Team code") + '<input id="qr-team" maxlength="12" data-input="qr" autocomplete="off" placeholder="T01"></label></div><div class="row" style="align-items:flex-start"><div class="qrbox" id="qr-svg"></div><div class="stack" style="flex:1;min-width:220px"><code class="url" id="qr-url"></code><div class="row"><button class="btn line" data-act="copy" id="qr-copy" data-text="">' + L("انسخ الرابط", "Copy link") + "</button>" + (A.framed ? "" : '<button class="btn line" data-act="qr-dl">' + L("نزّل الرمز بصيغة SVG", "Download the code as SVG") + "</button>") + "</div>" + "</div></div></div>" +
      "<h2>" + L("ما يحصل عليه المشاركون", "What participants receive") + '</h2><ul class="clean"><li>' + L("شهادة مشاركة موقّعة لكل طالب يُنشر له عمل معتمد.", "A signed certificate for every student with an approved published piece.") + "</li><li>" + L("عرض أفضل الأعمال في يوم ختامي داخل الكلية.", "A showcase of the best work at a closing day in the faculty.") + "</li><li>" + L("لوحة صدارة للفرق بحسب الزيارات التي جلبتها رموزها.", "A team leaderboard based on the visits their codes bring.") + '</li></ul><div class="row"><a class="btn line" href="' + link("impact") + '">' + L("كيف نقيس الأثر", "How impact is measured") + "</a></div></div></section>";
  };
  function qrUrl() {
    var p = qs("#qr-page").value, base = (C.siteUrl || location.href.split(/[?#]/)[0].replace(/[^/]*$/, "")).replace(/\/$/, "");
    var u = base + "/" + (p === "home" ? "index.html" : p === "games" || p === "checker" || p === "myths" ? p + ".html" : p + ".html");
    return u + "?utm_source=" + qs("#qr-src").value + "&utm_medium=qr&utm_campaign=" + p + (qs("#qr-team").value.trim() ? "&utm_content=" + encodeURIComponent(qs("#qr-team").value.trim()) : "");
  }
  DW.acts.qr = function () {
    if (!qs("#qr-page") || typeof window.qrcode !== "function") return;
    var u = qrUrl(), q = window.qrcode(0, "M"); q.addData(u); q.make();
    qs("#qr-svg").innerHTML = q.createSvgTag({ cellSize: 6, margin: 12, scalable: true });
    qs("#qr-url").textContent = u; qs("#qr-copy").setAttribute("data-text", u);
  };
  DW.acts["qr-dl"] = function () {
    try { var svg = qs("#qr-svg").innerHTML, a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })); a.download = "qr-" + qs("#qr-page").value + "-" + qs("#qr-src").value + ".svg"; document.body.appendChild(a); a.click(); a.remove(); } catch (e) {}
  };
  DW.after.students = function () { DW.acts.qr(); };

  /* =============================== IMPACT =============================== */
  /* The chart follows the wall chart health centres use to monitor immunisation: a cumulative line plotted against a straight target line. */
  function chartSVG(weekly, target, weeks) {
    var W = 720, H = 300, l = 58, r = 14, t = 14, b = 36, pw = W - l - r, ph = H - t - b, cum = 0, pts = [], max = target, i, g = "";
    (weekly || []).slice(0, weeks).forEach(function (v, k) { cum += +v || 0; pts.push([k + 1, cum]); }); if (cum > max) max = cum;
    var x = function (w) { return (l + (w / weeks) * pw).toFixed(1); }, y = function (v) { return (t + ph - (v / max) * ph).toFixed(1); };
    for (i = 0; i <= 4; i++) { var gv = (max / 4) * i; g += '<line class="g" x1="' + l + '" x2="' + (W - r) + '" y1="' + y(gv) + '" y2="' + y(gv) + '"/><text x="' + (l - 8) + '" y="' + (+y(gv) + 4) + '" text-anchor="end">' + Math.round(gv).toLocaleString("en-GB") + "</text>"; }
    for (i = 1; i <= weeks; i++) g += '<line class="g v" x1="' + x(i) + '" x2="' + x(i) + '" y1="' + t + '" y2="' + (t + ph) + '"/><text x="' + x(i) + '" y="' + (H - 12) + '" text-anchor="middle">' + i + "</text>";
    return '<svg class="mchart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + L("الزيارات التراكمية مقابل المسار المستهدف خلال 12 أسبوعاً", "Cumulative visits against the target line over 12 weeks") + '">' + g +
      '<line class="tg" x1="' + x(0) + '" y1="' + y(0) + '" x2="' + x(weeks) + '" y2="' + y(target) + '"/>' +
      (pts.length ? '<polyline class="act" points="' + [[0, 0]].concat(pts).map(function (p) { return x(p[0]) + "," + y(p[1]); }).join(" ") + '"/>' + pts.map(function (p) { return '<circle class="pt" cx="' + x(p[0]) + '" cy="' + y(p[1]) + '" r="4"/>'; }).join("") : "") + "</svg>";
  }
  function ledger(items) { return '<dl class="ledger">' + items.map(function (i) { return "<div><dt>" + i[1] + "</dt><dd>" + i[0] + (i[2] ? "<small>" + i[2] + "</small>" : "") + "</dd></div>"; }).join("") + "</dl>"; }
  function num(v) { return (+v || 0).toLocaleString("en-GB"); }
  DW.chartSVG = chartSVG; DW.ledger = ledger;
  DW.pages.impact = function () {
    return '<section class="band first"><div class="wrap"><h1>' + L("أثر الحملة", "Campaign impact") + '</h1><p class="lead">' + L("نقيس ما يتغير عند الناس: ما يعرفونه، وما ينوون فعله، وما يفعلونه. الأرقام المستهدفة هنا مقترحة للأشهر الثلاثة الأولى.", "We measure what changes for people: what they know, what they intend to do, and what they do. The targets here are proposed for the first three months.") + "</p>" +
      '<div class="monitor"><div class="row" style="justify-content:space-between"><h2>' + L("لوحة المتابعة الأسبوعية", "Weekly monitoring chart") + '</h2><div class="legend"><span><i class="k-act"></i>' + L("الزيارات التراكمية", "Cumulative visits") + '</span><span><i class="k-tg"></i>' + L("المسار المستهدف: 15,000 زيارة", "Target line: 15,000 visits") + '</span></div></div><div id="im-chart">' + chartSVG([], 15000, 12) + '</div><p class="small muted" id="im-note">' + L("المحور الأفقي: أسابيع الحملة. تظهر الأرقام الفعلية بعد ربط خادم الحملة.", "Horizontal axis: campaign weeks. Live figures appear once the campaign server is connected.") + '</p><div id="im-live"></div></div>' +
      "<h2>" + L("ما نقيسه وكيف", "What we measure and how") + "</h2>" + table([L("المستوى", "Level"), L("المؤشر", "Indicator"), L("الهدف خلال 3 أشهر", "Target at 3 months"), L("طريقة القياس", "How it is measured")], [
        [L("الوصول", "Reach"), L("زيارات الموقع والتطبيق", "Site and app visits"), "15,000", L("عدّاد مجهول داخل الموقع", "Anonymous counter in the site")],
        [L("الوصول", "Reach"), L("مشاهدات الأفلام على كل المنصات", "Film views across platforms"), "50,000", L("إحصاءات إنستغرام وتيك توك ويوتيوب وفيسبوك", "Instagram, TikTok, YouTube and Facebook analytics")],
        [L("الوصول", "Reach"), L("مسح رموز QR", "QR code scans"), "3,000", L("وسوم المصدر في الروابط", "Source tags in the links")],
        [L("التفاعل", "Engagement"), L("بطاقات وعي مكتملة", "Completed awareness cards"), "1,500", L("عدّاد الأختام", "Stamp counter")],
        [L("التفاعل", "Engagement"), L("ألعاب مكتملة", "Completed games"), "4,000", L("عدّاد الألعاب", "Game counter")],
        [L("التفاعل", "Engagement"), L("أفلام قصيرة للطلبة معتمدة ومنشورة", "Approved student reels published"), "80", L("سجل الفرق: 4 أفلام لكل فريق من 20 فريقاً", "Team register: 4 reels from each of 20 teams")],
        [L("المعرفة والاتجاهات", "Knowledge and attitudes"), L("ارتفاع درجة المعرفة بعد التعرض للحملة", "Rise in knowledge score after exposure"), L("20 نقطة مئوية", "20 percentage points"), L("استبانة قبلية وبعدية، 400 مشارك على الأقل", "Before and after survey, at least 400 participants")],
        [L("المعرفة والاتجاهات", "Knowledge and attitudes"), L("تحسّن الثقة بالمطاعيم", "Improved confidence in vaccines"), L("فرق ذو دلالة إحصائية", "A statistically significant difference"), L("مقياس 5C بنسخته العربية المحكّمة", "The validated Arabic 5C scale")],
        [L("الفعل", "Action"), L("تعهدات بخطوة عملية", "Pledges of a practical step"), "2,000", L("عدّاد التعهدات", "Pledge counter")],
        [L("الفعل", "Action"), L("من أخذوا المطعوم أو حجزوا موعداً بعد 4 أسابيع", "People vaccinated or booked after 4 weeks"), L("15% من المتابَعين", "15% of those followed up"), L("استبانة متابعة قصيرة", "Short follow-up survey")],
        [L("الفعل", "Action"), L("جرعات الإنفلونزا في الصيدليات الشريكة وأيام التطعيم", "Flu doses at partner pharmacies and vaccination days"), L("مقارنة بالموسم السابق", "Compared with last season"), L("سجلات الصيدليات الشريكة", "Partner pharmacy records")]
      ]) + '<p class="note">' + L("لا يجمع الموقع أسماء الزوار ولا أرقام هواتفهم ولا عناوين الإنترنت. العدّادات تسجل أرقاماً إجمالية فقط. الاستبانات تُجرى بعد موافقة لجنة أخلاقيات البحث العلمي.", "The site collects no visitor names, phone numbers or IP addresses. The counters record totals only. Surveys run after approval by the research ethics committee.") + "</p>" +
      (C.surveyUrl ? '<div class="row"><a class="btn go" href="' + C.surveyUrl + '" target="_blank" rel="noopener">' + L("شارك في الاستبانة", "Take the survey") + "</a></div>" : "") + "</div></section>";
  };
  DW.after.impact = function () {
    A.api("stats").then(function (d) {
      var el = qs("#im-live"); if (!el || !d) return;
      if (d.weekly) { qs("#im-chart").innerHTML = chartSVG(d.weekly, 15000, 12); qs("#im-note").textContent = d.phase === "live" ? L("المحور الأفقي: أسابيع الحملة منذ الانطلاق.", "Horizontal axis: campaign weeks since launch.") : L("قبل الانطلاق: الأرقام من فترة التجربة.", "Before launch: figures come from the rehearsal period."); }
      el.innerHTML = ledger([[num(d.views), L("زيارة", "visits")], [num(d.stamps), L("ختماً", "stamps")], [num(d.games), L("لعبة مكتملة", "games completed")], [num(d.pledges), L("تعهداً", "pledges")]].concat(d.reels == null ? [] : [[num(d.reels), L("فيلماً قصيراً معتمداً", "approved reels"), L("من 80", "of 80")], [num(d.teams), L("فريقاً نشر عملاً", "teams with published work"), L("من 20", "of 20")]]));
    });
  };

  /* the application starts from app-plus.js, after every page is registered */
})();
