/* A Dose of Awareness: installable app support (home-screen install, offline shell). */
(function () {
  "use strict";
  var DW = window.DW, A = DW.app, L = A.L, deferred = null;
  var isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !A.embed && !window.Capacitor) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
  DW.installSlot = function () {
    var el = A.qs("#install-slot"); if (!el) return;
    if (A.isApp || A.embed) { el.innerHTML = ""; return; }
    if (deferred) el.innerHTML = '<div class="install"><div><b>' + L("ثبّت التطبيق على هاتفك", "Install the app on your phone") + "</b><span>" + L("يفتح من الشاشة الرئيسية ويعمل دون إنترنت.", "It opens from the home screen and works offline.") + '</span></div><button class="btn" data-act="install">' + L("ثبّت التطبيق", "Install the app") + "</button></div>";
    else if (isIos) el.innerHTML = '<div class="install"><div><b>' + L("أضف التطبيق إلى الشاشة الرئيسية", "Add the app to your home screen") + "</b><span>" + L("في سفاري: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».", "In Safari: tap the Share button, then Add to Home Screen.") + "</span></div></div>";
    else el.innerHTML = "";
  };
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; DW.installSlot(); });
  window.addEventListener("appinstalled", function () { deferred = null; A.send("install"); DW.installSlot(); });
  DW.acts.install = function () { if (!deferred) return; deferred.prompt(); deferred.userChoice.then(function () { deferred = null; DW.installSlot(); }); };
})();
