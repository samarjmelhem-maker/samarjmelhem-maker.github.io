/* A Dose of Awareness: app modules, part two. Student teams and reels, workshop tools, certificates, about and sources. */
(function () {
  "use strict";
  var DW = window.DW, C = DW.config, A = DW.app;
  var L = A.L, T = A.T, qs = A.qs, qsa = A.qsa, esc = A.esc, link = A.link, store = A.store;

  function topic(id) { return DW.topics[id - 1]; }
  function tint(t) { var v = A.vac(t.v); return v ? "--bg:" + v.bg + ";--deep:" + v.deep : "--bg:#E6EEF7;--deep:#16264F"; }
  function crefs(ids) { return (ids || []).map(function (id) { var s = DW.csources[id]; return s ? (s.u ? '<a class="ref" href="' + s.u + '" target="_blank" rel="noopener" title="' + esc(s.t) + '">[' + L("المصدر", "source") + "]</a>" : "") : ""; }).join(" "); }
  function teamsOf(tid) { var a = []; for (var n = 1; n <= DW.teamCount; n++) if (DW.teamTopics(n).indexOf(tid) >= 0) a.push(DW.teamCode(n)); return a; }
  function teamOptions(sel) { var h = ""; for (var n = 1; n <= DW.teamCount; n++) h += '<option value="' + DW.teamCode(n) + '"' + (DW.teamCode(n) === sel ? " selected" : "") + ">" + DW.teamCode(n) + "</option>"; return h; }
  function num(code) { return +String(code).replace(/\D/g, "") || 1; }

  /* =============================== TEAMS =============================== */
  DW.titles.teams = function () { return L("فرق الطلبة", "Student teams"); };
  function registerHTML(data) {
    var by = {}; (data || []).forEach(function (t) { by[t.code] = t; });
    var h = "", n, code, tp, row, mine = store.get("dw-team", "");
    for (n = 1; n <= DW.teamCount; n++) {
      code = DW.teamCode(n); tp = DW.teamTopics(n); row = by[code] || { reels: {} };
      h += '<li' + (code === mine ? ' class="mine"' : "") + '><b class="code">' + code + '</b><span class="tname">' + esc(row.name || L("الفريق " + n, "Team " + n)) + "</span>" + tp.map(function (tid) {
        var t = topic(tid);
        return '<span class="tp" style="' + tint(t) + '"><span class="tt">' + tid + ". " + T(t.title) + "</span>" + ["A", "B"].map(function (f) { var st = (row.reels || {})[tid + f] || ""; return '<i class="tk ' + st + '" title="' + T(DW.formats[f].name) + (st === "approved" ? L(": معتمد", ": approved") : st === "pending" ? L(": بانتظار الاعتماد", ": awaiting approval") : L(": لم يُرفع", ": not submitted")) + '"></i>'; }).join("") + "</span>";
      }).join("") + "</li>";
    }
    return '<ol class="register">' + h + "</ol>";
  }
  function topicSelect(code) { return DW.teamTopics(num(code)).map(function (tid) { return '<option value="' + tid + '">' + tid + ". " + T(topic(tid).title) + "</option>"; }).join(""); }
  function submitHTML() {
    var mine = store.get("dw-team", "T01");
    return '<form class="tool" id="tm-form" novalidate><p>' + L("يرفع مسؤول النشر في الفريق روابط الفيلم بعد نشره على قنوات الحملة. يظهر الفيلم في الموقع بعد اعتماد المشرف.", "The team's publishing lead submits the links once the reel is live on the campaign channels. It appears on the site after the supervisor approves it.") + '</p><div class="grid2">' +
      '<label class="field" for="tm-code">' + L("رمز الفريق", "Team code") + '<select id="tm-code" data-input="tm-code">' + teamOptions(mine) + "</select></label>" +
      '<label class="field" for="tm-pin">' + L("الرقم السري للفريق", "Team PIN") + '<input id="tm-pin" inputmode="numeric" autocomplete="off" maxlength="8"></label>' +
      '<label class="field" for="tm-topic">' + L("الموضوع", "Topic") + '<select id="tm-topic">' + topicSelect(mine) + "</select></label>" +
      '<label class="field" for="tm-format">' + L("نوع الفيلم", "Reel type") + '<select id="tm-format"><option value="A">' + T(DW.formats.A.name) + '</option><option value="B">' + T(DW.formats.B.name) + "</option></select></label></div>" +
      '<label class="field" for="tm-title">' + L("عنوان الفيلم", "Reel title") + '<input id="tm-title" maxlength="90"></label><div class="grid2">' +
      DW.platforms.map(function (p) { return '<label class="field" for="tm-' + p[0] + '">' + p[1] + '<input id="tm-' + p[0] + '" type="url" inputmode="url" dir="ltr" placeholder="https://" maxlength="300"></label>'; }).join("") + "</div>" +
      '<label class="tick" for="tm-ok"><input type="checkbox" id="tm-ok"><span>' + L("اجتاز الفيلم بنود التدقيق العشرة ووقّع عليه المدقق العلمي.", "The reel passed the ten checks and the evidence reviewer signed it off.") + '</span></label><div class="row"><button class="btn go" type="button" data-act="tm-send">' + L("ارفع الروابط", "Submit the links") + '</button></div><div class="out" id="tm-out" role="status"></div></form>';
  }
  DW.pages.teams = function () {
    return '<section class="band first"><div class="wrap"><h1>' + L("فرق الطلبة", "Student teams") + '</h1><p class="lead">' + L("عشرون فريقاً وعشرون موضوعاً. يتناول كل موضوع فريقان، ويصنع كل فريق فيلمين قصيرين عن كل موضوع من موضوعيه.", "Twenty teams and twenty topics. Two teams take each topic, and each team makes two reels on each of its two topics.") + "</p>" +
      DW.ledger([["20", L("فريقاً", "teams")], ["20", L("موضوعاً", "topics")], ["80", L("فيلماً قصيراً", "reels"), L("4 لكل فريق", "4 from each team")], ["320", L("منشوراً", "posts"), L("كل فيلم على 4 منصات", "every reel on 4 platforms")]]) +
      "<h2>" + L("سجل الفرق", "Team register") + '</h2><div class="legend"><span><i class="tk"></i>' + L("لم يُرفع", "Not submitted") + '</span><span><i class="tk pending"></i>' + L("بانتظار الاعتماد", "Awaiting approval") + '</span><span><i class="tk approved"></i>' + L("معتمد ومنشور", "Approved and published") + '</span></div><div id="tm-reg">' + registerHTML(null) + "</div>" +
      "<h2>" + L("ارفع روابط فيلمك", "Submit your reel links") + '</h2><div id="tm-submit">' + submitHTML() + "</div>" +
      "<h2>" + L("أفلام الطلبة المعتمدة", "Approved student reels") + '</h2><div id="tm-reels" class="reels"><p class="note">' + L("تظهر الأفلام هنا بعد اعتمادها.", "Reels appear here once they are approved.") + "</p></div>" +
      "<h2>" + L("المواضيع العشرون", "The twenty topics") + '</h2><div class="stack">' + DW.topics.map(function (t) {
        return '<details class="topic" style="' + tint(t) + '"><summary><b>' + t.id + "</b><span>" + T(t.title) + '</span><small>' + teamsOf(t.id).join(L(" و", " and ")) + "</small></summary><div class=\"ans\"><p>" + T(t.msg) + " " + A.refs(t.s) + crefs(t.cs) + "</p><p><b>" + L("الخطوة: ", "The step: ") + "</b>" + T(t.act) + "</p></div></details>";
      }).join("") + '</div><div class="row"><a class="btn line" href="' + link("workshop") + '">' + L("أدوات الورشة: بناء النص وقائمة التدقيق", "Workshop tools: script builder and checklist") + "</a></div></div></section>";
  };
  DW.after.teams = function () {
    A.apiRoot().then(function (b) {
      if (!qs("#tm-reg")) return;
      if (!b) { qs("#tm-submit").innerHTML = '<p class="note">' + L("يُفتح رفع الروابط عند ربط خادم الحملة.", "Submissions open once the campaign server is connected.") + (C.submitFormUrl ? ' <a href="' + C.submitFormUrl + '" target="_blank" rel="noopener">' + L("نموذج المشاركة المؤقت", "Temporary submission form") + "</a>" : "") + "</p>"; return; }
      A.apiGet("teams").then(function (d) { if (d && d.teams && qs("#tm-reg")) qs("#tm-reg").innerHTML = registerHTML(d.teams); });
      A.apiGet("reels").then(function (d) {
        var el = qs("#tm-reels"); if (!el || !d || !d.items || !d.items.length) return;
        el.innerHTML = d.items.map(function (r) {
          var t = topic(+r.topic) || DW.topics[0];
          return '<div class="reel" style="' + tint(t) + '"><b>' + esc(r.title) + '</b><span class="small">' + esc(r.team) + " · " + T(t.title) + '</span><div class="row">' + DW.platforms.filter(function (p) { return r.links && r.links[p[0]]; }).map(function (p) { return '<a class="chip" href="' + esc(r.links[p[0]]) + '" target="_blank" rel="noopener">' + p[1] + "</a>"; }).join("") + "</div></div>";
        }).join("");
      });
    });
  };
  DW.acts["tm-code"] = function (el) { qs("#tm-topic").innerHTML = topicSelect(el.value); };
  DW.acts["tm-send"] = function (el) {
    var v = function (id) { return (qs("#tm-" + id).value || "").trim(); }, links = {}, any = false, out = qs("#tm-out");
    DW.platforms.forEach(function (p) { var u = v(p[0]); if (u) { links[p[0]] = u; any = true; } });
    if (!v("pin") || !v("title") || !any || !qs("#tm-ok").checked) { out.innerHTML = L("أكمل الرقم السري والعنوان ورابطاً واحداً على الأقل، وأكّد اجتياز التدقيق.", "Fill in the PIN, the title and at least one link, and confirm the checks."); return; }
    el.disabled = true;
    A.apiPost("reels", { team: v("code"), pin: v("pin"), topic: +v("topic"), format: v("format"), title: v("title"), links: links }).then(function (r) {
      el.disabled = false;
      if (r.ok) { store.set("dw-team", v("code")); out.innerHTML = "<b>" + L("وصلت الروابط.", "Links received.") + "</b> " + L("تظهر في السجل بانتظار اعتماد المشرف.", "They show in the register as awaiting the supervisor's approval."); ["title"].concat(DW.platforms.map(function (p) { return p[0]; })).forEach(function (id) { qs("#tm-" + id).value = ""; }); qs("#tm-ok").checked = false; DW.after.teams(); }
      else out.innerHTML = r.error === "pin" ? L("الرقم السري غير صحيح.", "The PIN is not correct.") : r.error === "url" ? L("أحد الروابط لا يبدو رابطاً صحيحاً لإحدى المنصات الأربع.", "One of the links does not look like a valid link to one of the four platforms.") : r.error === "rate" ? L("محاولات كثيرة. انتظر دقيقة ثم حاول.", "Too many attempts. Wait a minute and try again.") : L("تعذر الإرسال. حاول مرة أخرى.", "Could not send. Please try again.");
    });
  };

  /* =============================== WORKSHOP =============================== */
  DW.titles.workshop = function () { return L("ورشة الصيدلاني على وسائل التواصل", "Social media pharmacist workshop"); };
  function hm(m) { return Math.floor(m / 60) + ":" + ("0" + (m % 60)).slice(-2); }
  DW.pages.workshop = function () {
    var t = 0, sb = store.get("dw-script", {}), ck = store.get("dw-checks", {});
    var f = function (id, label, rows, ph) { return '<label class="field" for="sb-' + id + '">' + label + (rows ? '<textarea id="sb-' + id + '" rows="' + rows + '" data-input="sb" placeholder="' + esc(ph || "") + '">' + esc(sb[id] || "") + "</textarea>" : '<input id="sb-' + id + '" data-input="sb" placeholder="' + esc(ph || "") + '" value="' + esc(sb[id] || "") + '">') + "</label>"; };
    return '<section class="band first"><div class="wrap"><h1>' + L("ورشة الصيدلاني على وسائل التواصل", "The social media pharmacist workshop") + '</h1><p class="lead">' + L("ست ساعات تدريبية عملية لطلبة الحملة. يخرج كل فريق منها بنص مدقق ومسودة فيلمه الأول وخطة نشر.", "Six practical training hours for the campaign's students. Each team leaves with a checked script, the draft of its first reel and a publishing plan.") + "</p>" +
      '<div class="note"><b>' + L("لماذا هذه الورشة؟", "Why this workshop?") + "</b><p>" + L("في دراسة حلّلت 682 منشوراً عربياً عن صحة المرأة على ست منصات، كتب الصيادلة 49.6% من المنشورات وكانت 94.1% من منشوراتهم دقيقة مقابل 71.8% لمجمل المنشورات. لكن وصول المنشور ارتبط بالمنصة وبشكل المحتوى أكثر من ارتباطه بهوية كاتبه. الدقة عندنا، والورشة تدرّب على المكان والطريقة.", "A study of 682 Arabic posts on women's health across six platforms found that pharmacists wrote 49.6% of the posts and that 94.1% of their posts were accurate, against 71.8% of all posts. Reach, however, followed the platform and the format more than the author's profession. The accuracy is already there. The workshop trains the where and the how.") + " " + crefs(["melhem-26"]) + "</p></div>" +
      "<h2>" + L("برنامج الساعات الست", "The six-hour programme") + '</h2><ol class="prog">' + DW.workshop.map(function (b) { var s = t; t += b.min; return '<li><span class="when">' + hm(s) + " - " + hm(t) + "</span><div><b>" + T(b.title) + "</b><p>" + T(b.how) + '</p><span class="sticker">' + L("المخرج: ", "Output: ") + T(b.out) + "</span></div></li>"; }).join("") + '</ol><p class="small muted">' + L("الأوقات محسوبة من بداية الورشة، وتُضاف الاستراحات بينها.", "Times count from the start of the workshop. Breaks are added between blocks.") + "</p>" +

      "<h2>" + L("أداة بناء النص", "Script builder") + '</h2><div class="tool" id="sb"><div class="grid2"><label class="field" for="sb-team">' + L("الفريق", "Team") + '<select id="sb-team" data-input="sb-team">' + teamOptions(store.get("dw-team", "T01")) + '</select></label><label class="field" for="sb-hook">' + L("طريقة الافتتاح", "Opening pattern") + '<select id="sb-hook" data-input="sb">' + DW.hooks.map(function (h, i) { return '<option value="' + i + '"' + (+sb.hook === i ? " selected" : "") + ">" + T(h.k) + "</option>"; }).join("") + '</select></label></div><p class="small" id="sb-topics"></p><p class="small muted" id="sb-ex"></p>' +
      f("open", L("جملة الافتتاح (أول ثلاث ثوانٍ)", "Opening line (first three seconds)"), 0) + f("fact", L("الحقيقة", "The fact"), 2) + f("warn", L("التنبيه والإشاعة (لفيلم «إشاعة وحقيقة»)", "Warning and rumour (for a Rumour and fact reel)"), 2, L("تنتشر إشاعة تقول...", "A rumour going round says...")) + f("why", L("لماذا هي خطأ؟", "Why it is wrong"), 2) + f("step", L("الخطوة الواحدة", "The one step"), 0) + f("src", L("سطر المصدر", "Source line"), 0, L("المصدر: منظمة الصحة العالمية 2025", "Source: WHO 2025")) +
      '<div class="meter"><div class="bar"><i id="sb-bar"></i></div><span id="sb-count" class="small"></span></div><div class="row"><button class="btn" type="button" data-act="sb-copy">' + L("انسخ النص", "Copy the script") + '</button><button class="btn line" type="button" data-act="sb-clear">' + L("ابدأ من جديد", "Start again") + '</button></div><p class="small muted">' + L("يُحفظ ما تكتبه على هذا الجهاز فقط.", "What you write is saved on this device only.") + "</p></div>" +

      "<h2>" + L("عشرة بنود قبل الرفع", "Ten checks before you submit") + '</h2><div class="tool" id="ck">' + DW.prepost.map(function (c, i) { return '<label class="tick" for="ck-' + i + '"><input type="checkbox" id="ck-' + i + '" data-input="ck"' + (ck[i] ? " checked" : "") + "><span>" + T(c) + "</span></label>"; }).join("") + '<div class="out" id="ck-out" role="status"></div></div>' +

      "<h2>" + L("الشهادات", "Certificates") + '</h2><div class="two"><div class="tile" style="--deep:#0B67B2"><b>' + L("شهادة الورشة: 6 ساعات تدريبية", "Workshop certificate: 6 training hours") + "</b><span>" + L("لمن حضر الأجزاء الستة وسلّم مع فريقه النص المدقق ومسودة الفيلم الأول.", "For students who attended all six blocks and, with their team, handed in the checked script and the draft of the first reel.") + '</span></div><div class="tile" style="--deep:#0A7F63"><b>' + L("شهادة الحملة", "Campaign certificate") + "</b><span>" + L("لأعضاء الفريق الذي نشر أفلامه الأربعة المعتمدة وسلّم سجل الأرقام الأسبوعي.", "For members of a team that published its four approved reels and handed in the weekly numbers log.") + '</span></div></div><div class="row"><a class="btn line" href="' + link("certificate") + '">' + L("تحقق من شهادة", "Verify a certificate") + "</a></div></div></section>";
  };
  function words(s) { return (String(s || "").trim().match(/\S+/g) || []).length; }
  function sbRead() { var o = {}; ["hook", "open", "fact", "warn", "why", "step", "src"].forEach(function (k) { var el = qs("#sb-" + k); if (el) o[k] = el.value; }); return o; }
  function sbPaint() {
    var o = sbRead(), w = words(o.open) + words(o.fact) + words(o.warn) + words(o.why) + words(o.step), sec = Math.round(w / 2.2), h = DW.hooks[+o.hook || 0], n = num((qs("#sb-team") || {}).value || "T01");
    qs("#sb-ex").textContent = L("مثال: ", "Example: ") + T(h.ex);
    qs("#sb-topics").innerHTML = L("موضوعا الفريق: ", "The team's topics: ") + DW.teamTopics(n).map(function (id) { return "<b>" + id + ". " + T(topic(id).title) + "</b>"; }).join(L(" و", " and "));
    qs("#sb-bar").style.width = Math.min(100, Math.round((sec / 60) * 100)) + "%"; qs("#sb-bar").className = sec > 60 ? "over" : sec >= 30 ? "fit" : "";
    qs("#sb-count").textContent = L(w + " كلمة، نحو " + sec + " ثانية عند القراءة بسرعة معتدلة. المطلوب بين 30 و60 ثانية.", w + " words, about " + sec + " seconds at a moderate reading pace. The target is 30 to 60 seconds.");
  }
  DW.acts.sb = function () { store.set("dw-script", sbRead()); sbPaint(); };
  DW.acts["sb-team"] = function (el) { store.set("dw-team", el.value); sbPaint(); };
  DW.acts["sb-clear"] = function () { store.set("dw-script", {}); A.render(true); };
  DW.acts["sb-copy"] = function (el) {
    var o = sbRead(), txt = [o.open, o.fact, o.warn, o.why, o.fact && o.warn ? o.fact : "", o.step, o.src].filter(function (x) { return x && x.trim(); }).join("\n");
    try { navigator.clipboard.writeText(txt).then(function () { el.textContent = L("نُسخ النص", "Script copied"); }); } catch (e) { DW.kit.toast(L("انسخ النص يدوياً من الحقول.", "Copy the text from the fields by hand.")); }
  };
  function ckPaint() {
    var n = qsa("#ck input:checked").length, all = DW.prepost.length;
    qs("#ck-out").innerHTML = n === all ? "<b>" + L("الفيلم جاهز للرفع.", "The reel is ready to submit.") + '</b> <a href="' + link("teams") + '">' + L("افتح لوحة الفرق", "Open the teams board") + "</a>" : L("أنجزت " + n + " من " + all + ".", n + " of " + all + " done.");
  }
  DW.acts.ck = function () { var o = {}; qsa("#ck input").forEach(function (el, i) { if (el.checked) o[i] = 1; }); store.set("dw-checks", o); ckPaint(); };
  DW.after.workshop = function () { sbPaint(); ckPaint(); };

  /* =============================== CERTIFICATE =============================== */
  DW.titles.certificate = function () { return L("التحقق من شهادة", "Verify a certificate"); };
  function codeFromUrl() { var m = /[?&]code=([A-Za-z0-9-]{4,20})/.exec(location.hash + "&" + location.search.replace("?", "&")); return m ? m[1].toUpperCase() : ""; }
  DW.certHTML = function (c) {
    var kinds = { workshop: [L("شهادة ورشة تدريبية", "Certificate of training"), L("لإتمام ورشة «الصيدلاني على وسائل التواصل» ومدتها " + (c.hours || 6) + " ساعات تدريبية، ضمن حملة «جرعة وعي» للتوعية بالمطاعيم، وتسليم متطلباتها العملية.", "for completing the Social Media Pharmacist workshop of " + (c.hours || 6) + " training hours, held within the Dose of Awareness vaccine awareness campaign, and handing in its practical work.")],
      campaign: [L("شهادة مشاركة", "Certificate of participation"), L("تقديراً للمشاركة في حملة «جرعة وعي» للتوعية بالمطاعيم" + (c.team ? " ضمن الفريق " + c.team : "") + "، وإنتاج أفلام قصيرة توعوية معتمدة ومنشورة.", "in recognition of taking part in the Dose of Awareness vaccine awareness campaign" + (c.team ? " as a member of team " + c.team : "") + ", and producing approved, published awareness reels.")],
      merit: [L("شهادة تميّز", "Certificate of merit"), L("تقديراً لعمل متميز في حملة «جرعة وعي» للتوعية بالمطاعيم" + (c.team ? " ضمن الفريق " + c.team : "") + ".", "in recognition of outstanding work in the Dose of Awareness vaccine awareness campaign" + (c.team ? " as a member of team " + c.team : "") + ".")] };
    var k = kinds[c.kind] || kinds.campaign, ppl = C.people || [];
    return '<div class="cert" id="cert">' + (C.watermark ? '<img class="wm" src="' + C.watermark + '" alt="">' : "") + '<div class="chead">' + (C.logos || []).map(function (l) { return '<img data-opt src="' + l.src + '" alt="' + esc(T(l.alt)) + '">'; }).join("") + "<div><b>" + L("الجامعة الأردنية", "The University of Jordan") + "</b><span>" + L("مركز الأمراض المعدية والمطاعيم", "Infectious Disease and Vaccine Center") + "</span><span>" + L("كلية الصيدلة", "Faculty of Pharmacy") + '</span></div></div><p class="ckind">' + k[0] + "</p><p>" + L("تُمنح هذه الشهادة إلى", "This certificate is awarded to") + '</p><p class="cname">' + esc(c.name) + '</p><p class="cbody">' + k[1] + '</p><div class="csign">' + ppl.map(function (x) { return "<div><i></i><b>" + T(x.name) + "</b><span>" + T(x.role) + "</span></div>"; }).join("") + '</div><p class="ccode"><span>' + L("التاريخ: ", "Date: ") + A.fmtDate(A.parseDate(c.date) || A.today()) + "</span><span>" + L("رمز التحقق: ", "Verification code: ") + '<b dir="ltr">' + esc(c.code) + "</b></span></p></div>";
  };
  DW.pages.certificate = function () {
    return '<section class="band first"><div class="wrap"><h1 class="noprint">' + L("التحقق من شهادة", "Verify a certificate") + '</h1><div class="tool noprint"><div class="grid2"><label class="field" for="cf-code">' + L("رمز التحقق المطبوع على الشهادة", "The verification code printed on the certificate") + '<input id="cf-code" dir="ltr" maxlength="20" autocomplete="off" value="' + esc(codeFromUrl()) + '"></label></div><div class="row"><button class="btn" data-act="cf-go">' + L("تحقق", "Verify") + '</button></div></div><div id="cf-out" role="status"></div></div></section>';
  };
  DW.acts["cf-go"] = function () {
    var code = (qs("#cf-code").value || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, ""), out = qs("#cf-out"); if (!code) return;
    A.apiRoot().then(function (b) {
      if (!b) { out.innerHTML = '<p class="note">' + L("التحقق يحتاج إلى خادم الحملة، وهو غير متصل بهذه النسخة.", "Verification needs the campaign server, which is not connected to this copy.") + "</p>"; return; }
      A.apiGet("cert/" + encodeURIComponent(code)).then(function (c) {
        if (!c || !c.code) { out.innerHTML = '<p class="note y">' + L("لا توجد شهادة بهذا الرمز.", "No certificate carries this code.") + "</p>"; return; }
        out.innerHTML = '<p class="fb noprint"><b>' + L("شهادة صحيحة.", "This certificate is valid.") + "</b> " + L("صدرت عن حملة «جرعة وعي».", "It was issued by the Dose of Awareness campaign.") + '</p><div class="row noprint"><button class="btn line" data-act="cf-print">' + L("اطبع أو احفظ PDF", "Print or save as PDF") + "</button></div>" + DW.certHTML(c);
        qsa("#cf-out img[data-opt]").forEach(function (im) { im.addEventListener("error", function () { im.remove(); }); });
      });
    });
  };
  DW.acts["cf-print"] = function () { window.print(); };
  DW.after.certificate = function () {
    if (!qs("#cert-page")) { var st = document.createElement("style"); st.id = "cert-page"; st.textContent = "@page { size: A4 landscape; margin: 10mm; }"; document.head.appendChild(st); }
    if (codeFromUrl()) DW.acts["cf-go"]();
  };
  window.addEventListener("hashchange", function () { var st = qs("#cert-page"); if (st && A.route() !== "certificate") st.remove(); });

  /* =============================== ABOUT =============================== */
  DW.titles.about = function () { return L("عن الحملة والمصادر", "About and sources"); };
  DW.pages.about = function () {
    var ids = Object.keys(DW.sources), cids = Object.keys(DW.csources);
    return '<section class="band first"><div class="wrap"><h1>' + L("عن الحملة", "About the campaign") + '</h1><p class="lead">' + L("«جرعة وعي» حملة توعية رقمية بستة مطاعيم، يقودها طلبة كلية الصيدلة في الجامعة الأردنية مع مركز الأمراض المعدية والمطاعيم.", "A Dose of Awareness is a digital awareness campaign on six vaccines, led by students of the Faculty of Pharmacy at the University of Jordan with the Infectious Disease and Vaccine Center.") + '</p><div class="people">' + (C.people || []).map(function (x) { return '<div class="person"><span>' + T(x.role) + "</span><b>" + T(x.name) + "</b><span>" + T(x.title) + "</span>" + (x.orcid ? '<a class="small" dir="ltr" href="https://orcid.org/' + x.orcid + '" target="_blank" rel="noopener">ORCID ' + x.orcid + "</a>" : "") + "</div>"; }).join("") + "</div>" +
      "<h2>" + L("كيف تُراجَع المعلومات؟", "How the information is reviewed") + '</h2><ul class="clean"><li>' + L("المرجع الأول وزارة الصحة الأردنية ومنظمة الصحة العالمية، ثم مراكز مكافحة الأمراض واليونيسف والدراسات المحكّمة.", "The first references are the Jordanian Ministry of Health and WHO, then the CDC, UNICEF and peer-reviewed studies.") + "</li><li>" + L("كل رقم يُنقل كما ورد في مصدره مع سنته، وكل معلومة في الموقع تحمل رابط مصدرها.", "Every number is reported as published, with its year, and every statement on the site links to its source.") + "</li><li>" + L("يراجع أعضاء هيئة التدريس المحتوى قبل نشره. آخر مراجعة: ", "Faculty review the content before it is published. Last review: ") + A.fmtDate(A.parseDate(C.reviewed) || A.today()) + ".</li><li>" + L("المعلومات للتوعية ولا تغني عن استشارة الطبيب أو الصيدلاني.", "The information is for awareness and does not replace advice from your doctor or pharmacist.") + "</li></ul>" +
      "<h2>" + L("الخصوصية", "Privacy") + '</h2><ul class="clean"><li>' + L("لا يطلب الموقع من الزائر اسماً ولا رقم هاتف، ولا يستخدم ملفات تتبع ولا إعلانات.", "The site asks visitors for no name or phone number and uses no tracking cookies or adverts.") + "</li><li>" + L("الأختام والنتائج والتعهدات تُحفظ على جهازك. يسجل خادم الحملة أعداداً إجمالية فقط: نوع الحدث والصفحة واللغة ومصدر الزيارة، دون عنوان الإنترنت.", "Stamps, scores and pledges are kept on your own device. The campaign server records totals only: the type of event, the page, the language and the source of the visit, without the IP address.") + "</li><li>" + L("لوحة الصدارة تعرض اسماً مستعاراً يختاره اللاعب. روابط أفلام الطلبة تُحفظ مع رمز الفريق، وأسماء الطلبة تُحفظ لإصدار الشهادات فقط.", "The leaderboard shows a nickname the player chooses. Student reel links are stored with the team code, and student names are stored only to issue certificates.") + "</li></ul>" +
      "<h2>" + L("الحقوق", "Rights") + "</h2><p>" + T(C.copyright) + " " + L("لا يجوز نسخ المحتوى أو التصميم أو البرمجيات أو إعادة استخدامها دون إذن خطي.", "The content, design and software may not be copied or reused without written permission.") + "</p>" +
      "<h2>" + L("المصادر الطبية", "Medical sources") + '</h2><ol class="src">' + ids.map(function (id) { var s = DW.sources[id]; return "<li>" + esc(s.t) + (s.u ? ' <a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.u.replace(/^https?:\/\//, "").slice(0, 60)) + "</a>" : "") + "</li>"; }).join("") + "</ol>" +
      "<h2>" + L("مصادر التواصل الصحي", "Health communication sources") + '</h2><ol class="src">' + cids.map(function (id) { var s = DW.csources[id]; return "<li>" + esc(s.t) + (s.u ? ' <a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.u.replace(/^https?:\/\//, "").slice(0, 60)) + "</a>" : "") + "</li>"; }).join("") + "</ol></div></section>";
  };

  /* start the application once every page is registered */
  DW.start();
})();
