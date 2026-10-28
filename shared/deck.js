/* Slide engine: one slide at a time, keyboard / swipe / menu, hash deep-links */
(function () {
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
  window.Deck = { show: show, next: next, prev: prev, count: slides.length };
})();
