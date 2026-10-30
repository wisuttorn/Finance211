/* Slide engine: one slide at a time, keyboard / swipe / menu, hash deep-links */
(function () {
  // font size controls (per chapter, remembered in this browser only)
  (function () {
    var hd = document.querySelector('header.top'); if (!hd) return;
    var key = 'fs:' + location.pathname, sc = 1;
    try { var v = parseFloat(localStorage.getItem(key)); if (v >= 0.7 && v <= 1.8) sc = v; } catch (e) {}
    function apply() { document.documentElement.style.setProperty('--fs', sc); try { localStorage.setItem(key, String(sc)); } catch (e) {} }
    var box = document.createElement('div'); box.className = 'fsz'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'ขนาดตัวอักษร');
    [['A−', -0.1, 'ลดขนาดตัวอักษร'], ['A', 0, 'ขนาดตัวอักษรปกติ'], ['A+', 0.1, 'เพิ่มขนาดตัวอักษร']].forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = c[0]; b.title = c[2]; b.setAttribute('aria-label', c[2]);
      b.addEventListener('click', function (e) { e.stopPropagation(); sc = c[1] === 0 ? 1 : Math.max(0.7, Math.min(1.8, Math.round((sc + c[1]) * 10) / 10)); apply(); b.blur(); });
      b.addEventListener('keydown', function (e) { e.stopPropagation(); });
      box.appendChild(b);
    });
    var imgs = hd.querySelectorAll('img'); hd.insertBefore(box, imgs[imgs.length - 1]); apply();
  })();
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var cur = -1;
  var $ = function (id) { return document.getElementById(id); };
  var bar = document.querySelector('#progress i');
  var counter = $('counter');
  var menu = $('menu'), list = $('menuList');

  function show(i, noHash) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === cur) return;
    if (cur >= 0) slides[cur].classList.remove('active');
    cur = i;
    var s = slides[i];
    s.classList.add('active');
    s.scrollTop = 0;
    bar.style.width = ((i + 1) / slides.length * 100) + '%';
    counter.textContent = (i + 1) + ' / ' + slides.length;
    $('prev').disabled = i === 0;
    $('next').disabled = i === slides.length - 1;
    if (!noHash) { try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) {} }
    Array.prototype.forEach.call(list.children, function (b, k) { b.classList.toggle('cur', k === i); });
    s.dispatchEvent(new CustomEvent('slideshow', { bubbles: true }));
  }
  function next() { show(cur + 1); }
  function prev() { show(cur - 1); }

  // menu
  slides.forEach(function (s, k) {
    var b = document.createElement('button');
    if (s.querySelector('.game')) b.className = 'game';
    b.innerHTML = '<span>' + (k + 1) + '</span><span></span>';
    b.lastChild.textContent = s.getAttribute('data-title') || ('สไลด์ ' + (k + 1));
    b.onclick = function () { menu.classList.remove('open'); show(k); };
    list.appendChild(b);
  });
  $('menuBtn').onclick = function () { menu.classList.add('open'); };
  menu.onclick = function (e) { if (e.target === menu) menu.classList.remove('open'); };
  $('prev').onclick = prev; $('next').onclick = next;
  $('fsBtn').onclick = function () {
    var d = document, el = d.documentElement;
    if (!d.fullscreenElement) { (el.requestFullscreen || function () {}).call(el); }
    else { d.exitFullscreen(); }
  };

  document.addEventListener('keydown', function (e) {
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'Escape') { menu.classList.remove('open'); return; }
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { next(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { prev(); e.preventDefault(); }
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(slides.length - 1);
    else if (e.key === 'f' || e.key === 'F') $('fsBtn').click();
    else if (e.key === 'm' || e.key === 'M') menu.classList.toggle('open');
  });

  // swipe (ignore sliders, inputs and draggable chips)
  var sx = 0, sy = 0, ok = false;
  document.getElementById('deck').addEventListener('touchstart', function (e) {
    var t = e.target;
    ok = !(t.closest && t.closest('input,select,textarea,.chip,svg,.noswipe'));
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  document.getElementById('deck').addEventListener('touchend', function (e) {
    if (!ok) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  window.addEventListener('hashchange', function () {
    var n = parseInt(location.hash.slice(1), 10);
    if (n) show(n - 1, true);
  });
  var start = parseInt(location.hash.slice(1), 10);
  show(start ? start - 1 : 0, true);
  window.Deck = { index: function () { return cur; }, show: show, next: next, prev: prev, count: slides.length };
})();
