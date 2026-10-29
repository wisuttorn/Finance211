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


  /* ---------- Check-all button for a group of fill-in inputs ----------
     <button class="btn pri" data-check="#box">ตรวจคำตอบ</button> ... inputs inside #box. Second click shows the answers. */
  function parseNum(v) { return parseFloat(String(v).replace(/,/g, '').replace(/[\u2212\u2013]/g, '-').replace(/^\((.*)\)$/, '-$1')); }
  function okFill(inp) { var v = parseNum(inp.value); return !isNaN(v) && Math.abs(v - parseFloat(inp.dataset.answer)) <= parseFloat(inp.dataset.tol || '0.01'); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-check]'); if (!b) return;
    var box = document.querySelector(b.dataset.check); if (!box) return;
    var ins = Array.prototype.slice.call(box.querySelectorAll('input.fill[data-answer]'));
    var out = box.querySelector('.chk-out') || (function () { var d = h('div', 'feedback chk-out'); b.parentNode.insertBefore(d, b.nextSibling); return d; })();
    var tries = parseInt(box.dataset.tries || '0', 10);
    var good = 0, empty = 0;
    ins.forEach(function (i) { if (i.value === '') empty++; var ok = okFill(i); if (ok) good++; i.className = 'fill ' + (ok ? 'ok' : 'bad'); });
    box.dataset.tries = tries + 1;
    if (good === ins.length) { out.className = 'feedback ok chk-out'; out.textContent = 'ถูกทุกช่อง! ' + good + ' / ' + ins.length + (box.dataset.msg ? ' — ' + box.dataset.msg : ''); b.textContent = 'ตรวจอีกครั้ง'; return; }
    if (tries >= 1) {   // second failed attempt: reveal
      ins.forEach(function (i) { if (!okFill(i)) { i.value = i.dataset.show || i.dataset.answer; i.className = 'fill rev'; } });
      out.className = 'feedback bad chk-out'; out.textContent = 'ได้ ' + good + ' / ' + ins.length + ' — ช่องสีเหลืองคือเฉลย ลองทำความเข้าใจวิธีคิดอีกครั้ง'; b.textContent = 'ตรวจอีกครั้ง'; box.dataset.tries = 0; return;
    }
    out.className = 'feedback bad chk-out'; out.textContent = 'ถูก ' + good + ' / ' + ins.length + (empty ? ' (ยังว่าง ' + empty + ' ช่อง)' : '') + ' — แก้แล้วกดตรวจอีกครั้ง (ถ้าผิดอีกจะแสดงเฉลย)'; b.textContent = 'ตรวจอีกครั้ง';
  });
  document.addEventListener('input', function (e) { var i = e.target; if (i.classList && i.classList.contains('fill') && i.classList.contains('rev')) i.className = 'fill'; });

  /* ---------- Tap-in-order game ---------- */
  G.order = function (el, cfg) {
    var items = cfg.items, nxt = 0, miss = 0, order = shuffle(items.map(function (_, i) { return i; }));
    function render() {
      el.innerHTML = '';
      var list = h('div', 'qopts'), fb = h('div', 'feedback'), rs = h('button', 'btn ghost sm', 'เริ่มใหม่');
      order.forEach(function (i) {
        var b = h('button', 'qopt'); b.innerHTML = i < nxt ? '<b>' + (i + 1) + '.</b> ' + items[i] : items[i];
        if (i < nxt) { b.classList.add('ok'); b.disabled = true; }
        b.onclick = function () {
          if (i === nxt) { nxt++; if (nxt === items.length) { render(); fb = el.querySelector('.feedback'); fb.className = 'feedback ok'; fb.textContent = 'เรียงถูกครบ! พลาด ' + miss + ' ครั้ง'; return; } render(); }
          else { miss++; b.classList.add('bad'); setTimeout(function () { b.classList.remove('bad'); }, 500); fb.className = 'feedback bad'; fb.textContent = 'ยังไม่ใช่ขั้นถัดไป ลองใหม่'; }
        };
        list.appendChild(b);
      });
      rs.onclick = function () { nxt = 0; miss = 0; order = shuffle(order); render(); };
      el.appendChild(h('p', 'small', cfg.hint || 'แตะข้อความตามลำดับที่ถูกต้อง ตั้งแต่ขั้นแรกถึงขั้นสุดท้าย'));
      el.appendChild(list); el.appendChild(fb); el.appendChild(rs);
    }
    render();
  };

  /* ---------- Random drill: generates a new numeric problem each time ----------
     cfg.gen() -> { q: html, fields:[{label, ans, tol, unit}], why: html } */
  G.drill = function (el, cfg) {
    var score = 0, total = 0, cur = null;
    function nextQ() {
      cur = cfg.gen(); el.innerHTML = '';
      var top = h('div', 'gh small', 'โจทย์สุ่มใหม่ทุกครั้ง<span class="score">ถูก ' + score + ' / ' + total + ' โจทย์</span>');
      var q = h('div', 'callout', cur.q), box = h('div', 'chkbox'), fb = h('div', 'feedback'), btn = h('button', 'btn pri', 'ตรวจคำตอบ'), nx = h('button', 'btn ghost', 'โจทย์ใหม่');
      var ins = [];
      cur.fields.forEach(function (f) {
        var p = h('p', null, f.label + ' = '), i = h('input', 'fill'); i.setAttribute('inputmode', 'decimal'); i.setAttribute('aria-label', f.label); ins.push(i);
        p.appendChild(i); p.appendChild(document.createTextNode(' ' + (f.unit || ''))); box.appendChild(p);
        i.addEventListener('keydown', function (e) { if (e.key === 'Enter') btn.click(); e.stopPropagation(); });
      });
      var done = false;
      btn.onclick = function () {
        if (done) return; var good = 0;
        ins.forEach(function (i, k) { var v = parseNum(i.value), ok = !isNaN(v) && Math.abs(v - cur.fields[k].ans) <= (cur.fields[k].tol || 0.01); i.className = 'fill ' + (ok ? 'ok' : 'bad'); if (ok) good++; });
        done = good === ins.length;
        if (done) { total++; score++; fb.className = 'feedback ok'; fb.innerHTML = 'ถูกต้อง! ' + (cur.why || ''); top.querySelector('.score').textContent = 'ถูก ' + score + ' / ' + total + ' โจทย์'; }
        else { fb.className = 'feedback bad'; fb.textContent = 'ถูก ' + good + ' / ' + ins.length + ' ช่อง ลองคำนวณใหม่ หรือกด "ดูเฉลย"'; show.classList.remove('hide'); }
      };
      var show = h('button', 'btn ghost hide', 'ดูเฉลย');
      show.onclick = function () { if (!done) { total++; done = true; } ins.forEach(function (i, k) { i.value = cur.fields[k].show || cur.fields[k].ans; i.className = 'fill rev'; }); fb.className = 'feedback bad'; fb.innerHTML = 'เฉลย: ' + (cur.why || ''); top.querySelector('.score').textContent = 'ถูก ' + score + ' / ' + total + ' โจทย์'; };
      nx.onclick = function () { if (!done && !cfg.free) total++; nextQ(); };
      [top, q, box, h('div', 'flow-ctl'), fb].forEach(function (x) { el.appendChild(x); });
      var ctl = el.querySelector('.flow-ctl'); ctl.appendChild(btn); ctl.appendChild(show); ctl.appendChild(nx);
    }
    nextQ();
  };

  /* ---------- SD laboratory: editable scenarios -> E(R), variance, SD, CV, range, step table ---------- */
  G.sdlab = function (el, cfg) {
    var rows = cfg.presets[0].rows.map(function (r) { return r.slice(); });
    function calc() {
      var ps = rows.reduce(function (a, r) { return a + r[1]; }, 0);
      var m = rows.reduce(function (a, r) { return a + r[0] * r[1]; }, 0), v = rows.reduce(function (a, r) { return a + Math.pow(r[0] - m, 2) * r[1]; }, 0);
      var mn = Math.min.apply(null, rows.map(function (r) { return r[0]; })), mx = Math.max.apply(null, rows.map(function (r) { return r[0]; }));
      return { ps: ps, m: m, v: v, sd: Math.sqrt(v), mn: mn, mx: mx };
    }
    function render(keepFocus) {
      var c = calc(); el.innerHTML = '';
      var pre = h('div', 'flow-ctl');
      cfg.presets.forEach(function (p) { var b = h('button', 'btn sm ghost', p.name); b.onclick = function () { rows = p.rows.map(function (r) { return r.slice(); }); render(); }; pre.appendChild(b); });
      var add = h('button', 'btn sm', '+ เพิ่มเหตุการณ์'); add.onclick = function () { if (rows.length < 8) { rows.push([10, 0]); render(); } }; pre.appendChild(add);
      var t = h('div', 'scrollx'), html = '<table class="tb"><tr><th>#</th><th class="n">ผลตอบแทน R (%)</th><th class="n">ความน่าจะเป็น P</th><th class="n">R × P</th><th class="n">R − R̄</th><th class="n">(R − R̄)²</th><th class="n">(R − R̄)² × P</th><th></th></tr>';
      rows.forEach(function (r, i) {
        var d = r[0] - c.m;
        html += '<tr><td>' + (i + 1) + '</td><td class="n"><input class="fill sm" data-i="' + i + '" data-k="0" type="number" step="any" value="' + r[0] + '"></td><td class="n"><input class="fill sm" data-i="' + i + '" data-k="1" type="number" step="0.05" min="0" max="1" value="' + r[1] + '"></td><td class="n">' + (r[0] * r[1]).toFixed(2) + '</td><td class="n">' + d.toFixed(2) + '</td><td class="n">' + (d * d).toFixed(2) + '</td><td class="n">' + (d * d * r[1]).toFixed(2) + '</td><td>' + (rows.length > 1 ? '<button class="btn sm ghost" data-del="' + i + '" aria-label="ลบ">×</button>' : '') + '</td></tr>';
      });
      html += '<tr><td colspan="3"><b>รวม</b></td><td class="n hl">' + c.m.toFixed(2) + '</td><td></td><td></td><td class="n hl">' + c.v.toFixed(2) + '</td><td></td></tr></table>';
      t.innerHTML = html;
      var warn = Math.abs(c.ps - 1) > 0.001 ? '<div class="verdict bad">ผลรวมความน่าจะเป็น = ' + c.ps.toFixed(2) + ' (ต้องเท่ากับ 1.00)</div>' : '';
      var res = h('div', 'cols c4 keep2', '<div class="card g"><span class="small">ผลตอบแทนที่คาดหวัง R̄</span><div class="big">' + c.m.toFixed(2) + '%</div></div><div class="card p"><span class="small">ความแปรปรวน σ²</span><div class="big">' + c.v.toFixed(2) + '</div></div><div class="card t"><span class="small">ส่วนเบี่ยงเบนมาตรฐาน σ</span><div class="big">' + c.sd.toFixed(2) + '%</div></div><div class="card l"><span class="small">CV = σ ÷ R̄ · พิสัย</span><div class="big">' + (c.m ? (c.sd / c.m).toFixed(2) : '–') + ' · ' + (c.mx - c.mn).toFixed(0) + '%</div></div>');
      // distribution bars
      var W = 600, H = 150, xs = rows.map(function (r) { return r[0]; }), lo = Math.min(-10, Math.min.apply(null, xs) - 5), hi = Math.max(30, Math.max.apply(null, xs) + 5), X = function (v) { return 30 + (v - lo) / (hi - lo) * (W - 60); };
      var svg = '<svg class="chart" viewBox="0 0 ' + W + ' ' + (H + 30) + '" role="img" aria-label="การกระจายผลตอบแทน"><line x1="20" y1="' + H + '" x2="' + (W - 10) + '" y2="' + H + '" stroke="#58706A"/>';
      rows.forEach(function (r) { var bh = Math.min(1, r[1]) * (H - 20); svg += '<rect x="' + (X(r[0]) - 8) + '" y="' + (H - bh) + '" width="16" height="' + bh + '" fill="#7B4AA0" opacity=".8"/><text x="' + X(r[0]) + '" y="' + (H + 16) + '" font-size="11" text-anchor="middle" fill="#58706A">' + r[0] + '</text>'; });
      svg += '<line x1="' + X(c.m) + '" y1="5" x2="' + X(c.m) + '" y2="' + H + '" stroke="#1B7F6B" stroke-width="2" stroke-dasharray="5 4"/><text x="' + (X(c.m) + 4) + '" y="16" font-size="12" fill="#1B7F6B">R̄ = ' + c.m.toFixed(1) + '</text>';
      svg += '<line x1="' + X(c.m - c.sd) + '" y1="' + (H - 6) + '" x2="' + X(c.m + c.sd) + '" y2="' + (H - 6) + '" stroke="#B4412E" stroke-width="3"/><text x="' + X(c.m) + '" y="' + (H - 12) + '" font-size="11" text-anchor="middle" fill="#B4412E">± 1 SD</text></svg>';
      [pre, t, h('div', null, warn), res, h('div', null, svg)].forEach(function (x) { el.appendChild(x); });
      Array.prototype.forEach.call(el.querySelectorAll('input.fill.sm'), function (inp) {
        inp.addEventListener('change', function () { var v = parseFloat(inp.value); rows[+inp.dataset.i][+inp.dataset.k] = isNaN(v) ? 0 : v; render(); });
        inp.addEventListener('keydown', function (e) { e.stopPropagation(); });
      });
      Array.prototype.forEach.call(el.querySelectorAll('[data-del]'), function (b) { b.onclick = function () { rows.splice(+b.dataset.del, 1); render(); }; });
    }
    render();
  };

  window.Games = G;
})();
