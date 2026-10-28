/* Reusable classroom game components (no data is stored or sent anywhere) */
(function () {
  var G = {};
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  G.fmt = function (n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
  G.shuffle = shuffle;

  /* ---------- Sorter: drag (desktop) or tap item then tap box (mobile) ---------- */
  G.sort = function (el, cfg) {
    var items = cfg.items, place = items.map(function () { return null; }), sel = null, checked = false, order = shuffle(items.map(function (_, i) { return i; }));
    el.innerHTML = '';
    var pool = h('div', 'pool'), bk = h('div', 'buckets'), fb = h('div', 'feedback'), ctl = h('div', 'flow-ctl');
    bk.style.gridTemplateColumns = 'repeat(' + (cfg.buckets.length > 3 ? 2 : cfg.buckets.length) + ',1fr)';
    if (window.innerWidth < 700) bk.style.gridTemplateColumns = '1fr';
    var bEls = {};
    cfg.buckets.forEach(function (b) {
      var d = h('div', 'bucket'); d.innerHTML = '<h4>' + b.label + '</h4><div class="drop"></div>'; d.dataset.b = b.id; bEls[b.id] = d.querySelector('.drop');
      d.addEventListener('click', function (e) { if (e.target.closest('.chip')) return; if (sel !== null && !checked) { put(sel, b.id); } });
      d.addEventListener('dragover', function (e) { e.preventDefault(); d.classList.add('over'); });
      d.addEventListener('dragleave', function () { d.classList.remove('over'); });
      d.addEventListener('drop', function (e) { e.preventDefault(); d.classList.remove('over'); var i = parseInt(e.dataTransfer.getData('text/plain'), 10); if (!isNaN(i) && !checked) put(i, b.id); });
      bk.appendChild(d);
    });
    var check = h('button', 'btn pri', 'ตรวจคำตอบ'), reset = h('button', 'btn ghost', 'เล่นใหม่');
    ctl.appendChild(check); ctl.appendChild(reset);
    el.appendChild(pool); el.appendChild(bk); el.appendChild(ctl); el.appendChild(fb);
    function put(i, b) { place[i] = b; sel = null; render(); }
    function render() {
      pool.innerHTML = ''; Object.keys(bEls).forEach(function (k) { bEls[k].innerHTML = ''; });
      order.forEach(function (i) {
        var c = h('div', 'chip'); c.textContent = items[i].t; c.draggable = !checked; c.dataset.i = i;
        if (sel === i) c.classList.add('sel');
        if (checked && place[i] !== null) {
          var okk = place[i] === items[i].b; c.classList.add(okk ? 'ok' : 'bad');
          if (!okk) { var w = h('span', 'why'); var lab = cfg.buckets.filter(function (b) { return b.id === items[i].b; })[0].label.replace(/<[^>]+>/g, ''); w.textContent = '→ ' + lab + (items[i].why ? ': ' + items[i].why : ''); c.appendChild(w); }
        }
        c.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', String(i)); });
        c.addEventListener('click', function () {
          if (checked) return;
          if (place[i] !== null) { place[i] = null; sel = null; render(); return; }
          sel = sel === i ? null : i; render();
        });
        (place[i] === null ? pool : bEls[place[i]]).appendChild(c);
      });
      if (!pool.children.length) { pool.style.display = 'none'; } else { pool.style.display = ''; }
    }
    check.onclick = function () {
      var left = place.filter(function (p) { return p === null; }).length;
      if (left) { fb.className = 'feedback bad'; fb.textContent = 'ยังเหลืออีก ' + left + ' ใบที่ยังไม่ได้จัดกลุ่ม'; return; }
      checked = true; render();
      var s = items.filter(function (it, i) { return place[i] === it.b; }).length;
      fb.className = 'feedback ' + (s === items.length ? 'ok' : 'bad');
      fb.textContent = 'ได้ ' + s + ' / ' + items.length + (s === items.length ? ' ถูกทั้งหมด!' : ' (ข้อที่ผิดแสดงกลุ่มที่ถูกต้องไว้ใต้ข้อความ)');
    };
    reset.onclick = function () { place = items.map(function () { return null; }); sel = null; checked = false; order = shuffle(order); fb.textContent = ''; fb.className = 'feedback'; render(); };
    render();
  };

  /* ---------- Quiz ---------- */
  G.quiz = function (el, cfg) {
    var qs = cfg.questions, i = 0, score = 0;
    function render() {
      el.innerHTML = '';
      if (i >= qs.length) {
        var pct = score / qs.length;
        el.innerHTML = '<div class="big">' + score + ' / ' + qs.length + '</div><p>' + (pct === 1 ? 'เยี่ยมมาก! เข้าใจภาพรวมการเงินครบถ้วน' : pct >= .7 ? 'ดีมาก ทบทวนข้อที่พลาดอีกนิดก็พร้อมแล้ว' : 'ลองทบทวนบทนี้อีกครั้ง แล้วกดเล่นใหม่') + '</p>';
        var r = h('button', 'btn pri', 'เล่นใหม่'); r.onclick = function () { i = 0; score = 0; render(); }; el.appendChild(r); return;
      }
      var q = qs[i];
      var pr = h('div', 'qprog', '<i style="width:' + (i / qs.length * 100) + '%"></i>');
      var top = h('div', 'gh small', 'ข้อ ' + (i + 1) + ' / ' + qs.length + '<span class="score">คะแนน ' + score + '</span>');
      var qq = h('div', null, '<h3>' + q.q + '</h3>'), opts = h('div', 'qopts'), fb = h('div', 'feedback'), nx = h('button', 'btn pri hide', i === qs.length - 1 ? 'ดูคะแนน' : 'ข้อถัดไป');
      q.o.forEach(function (t, k) {
        var b = h('button', 'qopt'); b.innerHTML = t;
        b.onclick = function () {
          Array.prototype.forEach.call(opts.children, function (x) { x.disabled = true; });
          if (k === q.a) { b.classList.add('ok'); score++; fb.className = 'feedback ok'; fb.textContent = 'ถูกต้อง! ' + (q.why || ''); }
          else { b.classList.add('bad'); opts.children[q.a].classList.add('ok'); fb.className = 'feedback bad'; fb.textContent = 'ยังไม่ถูก — ' + (q.why || ''); }
          nx.classList.remove('hide');
        };
        opts.appendChild(b);
      });
      nx.onclick = function () { i++; render(); };
      [pr, top, qq, opts, fb, nx].forEach(function (x) { el.appendChild(x); });
    }
    render();
  };

  /* ---------- Match: tap left then right ---------- */
  G.match = function (el, cfg) {
    var pairs = cfg.pairs, rights = shuffle(pairs.map(function (p, i) { return i; })), sel = null, done = 0, miss = 0;
    el.innerHTML = '';
    var grid = h('div', 'mgrid'), L = h('div', 'tally'), R = h('div', 'tally'), fb = h('div', 'feedback');
    var lb = [], rb = [];
    pairs.forEach(function (p, i) { var b = h('button', 'mitem', p[0]); b.onclick = function () { if (b.classList.contains('done')) return; lb.forEach(function (x) { x.classList.remove('sel'); }); sel = i; b.classList.add('sel'); }; lb.push(b); L.appendChild(b); });
    rights.forEach(function (i) {
      var b = h('button', 'mitem', pairs[i][1]);
      b.onclick = function () {
        if (b.classList.contains('done') || sel === null) { if (sel === null) { fb.className = 'feedback'; fb.textContent = 'แตะข้อทางซ้ายก่อน แล้วแตะคำตอบทางขวา'; } return; }
        if (sel === i) { b.classList.add('done'); lb[i].classList.remove('sel'); lb[i].classList.add('done'); sel = null; done++; fb.className = 'feedback ok'; fb.textContent = done === pairs.length ? 'ครบแล้ว! ผิด ' + miss + ' ครั้ง' : 'ถูกต้อง'; }
        else { miss++; b.classList.add('shake'); setTimeout(function () { b.classList.remove('shake'); }, 400); fb.className = 'feedback bad'; fb.textContent = 'ยังไม่ใช่ ลองใหม่'; }
      };
      rb.push(b); R.appendChild(b);
    });
    grid.appendChild(L); grid.appendChild(R); el.appendChild(grid); el.appendChild(fb);
  };

  /* ---------- Hand-count tally (instructor counts raised hands) ---------- */
  G.tally = function (el, cfg) {
    var n = cfg.options.map(function () { return 0; });
    el.innerHTML = '';
    var box = h('div', 'tally'), rs = h('button', 'btn ghost sm', 'ล้างคะแนน'), rows = [];
    cfg.options.forEach(function (o, i) {
      var r = h('div', 'trow'); r.innerHTML = '<div>' + o + '</div><div class="tbar"><i></i></div><div class="tctl"><button class="btn sm" aria-label="ลด">−</button><b>0</b><button class="btn sm pri" aria-label="เพิ่ม">+</button></div>';
      var bs = r.querySelectorAll('button');
      bs[0].onclick = function () { n[i] = Math.max(0, n[i] - 1); up(); }; bs[1].onclick = function () { n[i]++; up(); };
      rows.push(r); box.appendChild(r);
    });
    function up() { var t = n.reduce(function (a, b) { return a + b; }, 0) || 1; rows.forEach(function (r, i) { r.querySelector('b').textContent = n[i]; r.querySelector('.tbar i').style.width = (n[i] / t * 100) + '%'; }); }
    rs.onclick = function () { n = n.map(function () { return 0; }); up(); };
    el.appendChild(box); el.appendChild(rs);
  };

  /* ---------- Fill-in-the-number checks ---------- */
  G.fills = function (root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('input.fill[data-answer]'), function (inp) {
      function chk() {
        var v = parseFloat(String(inp.value).replace(/,/g, '')); if (isNaN(v)) { inp.className = 'fill'; return; }
        var ok = Math.abs(v - parseFloat(inp.dataset.answer)) <= parseFloat(inp.dataset.tol || '0.01');
        inp.className = 'fill ' + (ok ? 'ok' : 'bad');
        var t = inp.dataset.reveal && document.querySelector(inp.dataset.reveal); if (t) t.classList.toggle('hide', !ok);
      }
      inp.addEventListener('change', chk); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') chk(); });
      inp.addEventListener('input', function () { inp.className = 'fill'; });
    });
  };

  /* ---------- Toggle buttons ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-toggle]'); if (!b) return;
    var t = document.querySelector(b.dataset.toggle); if (!t) return;
    var hid = t.classList.toggle('hide');
    if (b.dataset.alt) { var a = b.dataset.alt; b.dataset.alt = b.textContent; b.textContent = a; }
  });

  /* ---------- Range helper ---------- */
  G.range = function (ids, fn) {
    var els = ids.map(function (id) { return document.getElementById(id); });
    function run() { fn.apply(null, els.map(function (e) { return parseFloat(e.value); })); }
    els.forEach(function (e) { e.addEventListener('input', run); });
    run(); return run;
  };

  window.Games = G;
})();
