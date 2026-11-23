(function () {
  'use strict';
  /* ---- Settings you may edit ---- */
  var CFG = {
    APK_FILE: 'https://github.com/mahmadsoni7m/pythontaj-web/releases/latest/download/PythonTaj.apk',        // the APK you upload into this repository (same folder as index.html)
    VERSION: '1.0',                    // shown next to the download button
    WHATSAPP: '992008336807',          // digits only, with country code
    TELEGRAM: 'Mmmmwll',               // username without @
    PRICE: '20',                       // number shown on the plan card (сомонӣ)
    FREE: 5
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* download buttons */
  $$('[data-apk]').forEach(function (a) { a.href = CFG.APK_FILE; a.setAttribute('download', CFG.APK_FILE); });

  /* contacts */
  var msg = encodeURIComponent('Салом! Мехоҳам курси пурраи PythonТаҷ-ро харам.');
  var wa = 'https://wa.me/' + CFG.WHATSAPP + '?text=' + msg;
  var tg = 'https://t.me/' + CFG.TELEGRAM + '?text=' + msg;
  $('#buyWa').href = wa; $('#buyTg').href = tg;
  $('#waLink').href = wa; $('#tgLink').href = tg;
  $('#priceVal').textContent = CFG.PRICE;
  $('#yr').textContent = new Date().getFullYear();

  /* size / date of the uploaded APK (HEAD request). If the file is not uploaded yet, say so. */
  function setMeta(t) { $('#apkMeta').textContent = t; $('#apkMeta2').textContent = t; }
  setMeta('Версия ' + CFG.VERSION + ' · Android 7.0+');
  if (window.fetch) {
    fetch(CFG.APK_FILE, { method: 'HEAD', cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw 0;
      var len = Number(r.headers.get('content-length')), lm = r.headers.get('last-modified'), d = lm ? new Date(lm) : null;
      var parts = ['Версия ' + CFG.VERSION];
      if (len) parts.push((len / 1048576).toFixed(1).replace('.', ',') + ' МБ');
      if (d && !isNaN(d)) parts.push(d.toLocaleDateString('ru-RU'));
      parts.push('Android 7.0+');
      setMeta(parts.join(' · '));
    })['catch'](function () { setMeta('Файли APK ҳанӯз боргузорӣ нашудааст'); });
  }

  /* hero phone: crossfade between screenshots */
  var shots = $$('#heroShots img'), si = 0;
  if (shots.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(function () { shots[si].classList.remove('on'); si = (si + 1) % shots.length; shots[si].classList.add('on'); }, 3200);
  }

  /* course program from data/manifest.json */
  var lockSvg = '<svg width="14" height="14" style="vertical-align:-2px"><use href="#i-lock"/></svg>';
  fetch('data/manifest.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (m) {
    var html = '';
    (m.modules || []).forEach(function (mod, i) {
      var ls = (m.lessons || []).filter(function (l) { return l.module === mod.id; }).sort(function (a, b) { return a.number - b.number; });
      html += '<details class="mod rv"><summary><span class="n">' + (i + 1) + '</span><span>' + esc(mod.title) + '</span><span class="cnt">' + ls.length + ' дарс</span>' +
        '<svg class="chev"><use href="#i-chev"/></svg></summary><ul>' +
        ls.map(function (l) {
          var free = l.number <= CFG.FREE;
          return '<li><span>' + l.number + '. ' + esc(l.title) + '</span><small class="' + (free ? 'free' : 'paid') + '">' + (free ? 'Ройгон' : lockSvg + ' Код') + '</small></li>';
        }).join('') + '</ul></details>';
    });
    $('#mods').innerHTML = html || '';
    observe($$('#mods .rv'));
  })['catch'](function () { $('#mods').innerHTML = ''; });

  /* reveal on scroll */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  function observe(list) { list.forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); }); }
  observe($$('.rv'));
})();
