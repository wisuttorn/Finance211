/* Chapter 4: Cash Budget and CVP games */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var r1 = function (v) { return (Math.round(v * 10) / 10).toFixed(1); }, r2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var fmt = function (n) { var v = Math.round(n * 100) / 100; return (v < 0 ? '(' : '') + G.fmt(Math.abs(v), Math.abs(v) % 1 ? 2 : 0) + (v < 0 ? ')' : ''); };
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- Part 3: Cash budget ---------- */
  function cashBudget(beg, rec, dis, minc, unit, rate) {
    var out = 0, acc = 0, cash = beg, rows = [];
    rec.forEach(function (r, t) {
      var pre = cash + r - dis[t], loan = 0, repay = 0, intr = 0;
      if (pre < minc) { loan = Math.ceil((minc - pre) / unit - 1e-9) * unit; out += loan; }
      acc += out * rate / 12;
      if (loan === 0 && out > 0) { var rp = Math.floor((pre - minc - acc) / unit + 1e-9) * unit; if (rp > 0) { repay = Math.min(out, rp); intr = acc; acc = 0; out -= repay; } }
      var end = pre + loan - repay - intr;
      rows.push({ beg: cash, rec: r, dis: dis[t], pre: pre, loan: loan, repay: repay, intr: intr, end: end, out: out });
      cash = end;
    });
    return rows;
  }
  window.cashBudget = cashBudget;
  G.sort($('g-cbsort'), {
    buckets: [{ id: 'r', label: 'เงินสดรับ' }, { id: 'd', label: 'เงินสดจ่าย (ก่อนจัดการเงิน)' }, { id: 'f', label: 'การจัดการทางการเงิน' }],
    items: [
      { t: 'ขายเงินสด', b: 'r' }, { t: 'เก็บเงินจากลูกหนี้การค้า', b: 'r' }, { t: 'ซื้อเงินสด', b: 'd' }, { t: 'จ่ายเงินให้เจ้าหนี้การค้า', b: 'd' }, { t: 'ค่าเช่า เงินเดือน ค่าแรง', b: 'd' }, { t: 'ค่าภาษี', b: 'd' },
      { t: 'ลงทุนในสินทรัพย์ไม่หมุนเวียน', b: 'd' }, { t: 'จ่ายเงินปันผล', b: 'd' }, { t: 'กู้ยืมเพิ่ม', b: 'f', why: 'ทำเมื่อเงินสดต่ำกว่าขั้นต่ำ' }, { t: 'จ่ายคืนเงินต้น', b: 'f', why: 'ทำเมื่อเงินสดเหลือเกินขั้นต่ำ' }, { t: 'จ่ายดอกเบี้ยของเงินกู้ที่คืน', b: 'f', why: 'จ่ายเมื่อคืนเงินต้น' }
    ]
  });
  /* collection lab */
  G.range(['cl-a', 'cl-b'], function (a, b) {
    var c = 100 - a - b, S = [100, 200, 400, 300, 200];
    $('cl-ao').textContent = a + '%'; $('cl-bo').textContent = b + '%';
    $('cl-c').textContent = 'เก็บอีกเดือนถัดไป (c) = ' + c + '%' + (c < 0 ? '  (รวมเกิน 100% ปรับใหม่)' : '');
    var f = function (t) { return (a * S[t] + b * S[t - 1] + Math.max(c, 0) * S[t - 2]) / 100; }, tg = { o: 210, n: 320, d: 340 }, v = { o: f(2), n: f(3), d: f(4) };
    ['o', 'n', 'd'].forEach(function (k) { $('cl-' + k).textContent = G.fmt(v[k], 1); var df = v[k] - tg[k]; $('cl-' + k + 'd').textContent = (df > 0 ? '+' : '') + df.toFixed(1); });
    var ok = Math.abs(v.o - 210) < 0.05 && Math.abs(v.n - 320) < 0.05, vd = $('cl-v');
    vd.className = 'verdict ' + (c < 0 ? 'bad' : ok ? 'ok' : 'w');
    vd.textContent = c < 0 ? 'a + b เกิน 100% ไม่ได้' : ok ? 'ตรงยอดเงินสดรับ ต.ค. และ พ.ย. ของไฟล์ต้นฉบับ! ธ.ค. ต่างอยู่ ' + (340 - v.d).toFixed(0) + ' ถือเป็นเงินสดรับอื่น' : 'ยังไม่ตรง ลองปรับ a และ b ให้ ต.ค. = 210 และ พ.ย. = 320';
  });
  /* cash budget lab */
  (function () {
    var F = [['beg', 'เงินสดต้นงวด ต.ค.', 0, 150, 1], ['r1', 'เงินสดรับ ต.ค.', 0, 600, 1], ['r2', 'เงินสดรับ พ.ย.', 0, 600, 1], ['r3', 'เงินสดรับ ธ.ค.', 0, 600, 1], ['d1', 'เงินสดจ่าย ต.ค.', 0, 600, 1], ['d2', 'เงินสดจ่าย พ.ย.', 0, 600, 1], ['d3', 'เงินสดจ่าย ธ.ค.', 0, 600, 1], ['min', 'เงินสดขั้นต่ำ', 0, 100, 5], ['unit', 'หน่วยเงินกู้/คืน', 1, 20, 1], ['rate', 'ดอกเบี้ยต่อปี (%)', 0, 24, 1]];
    var PRE = { abc: { beg: 50, r1: 210, r2: 320, r3: 340, d1: 213, d2: 418, d3: 305, min: 25, unit: 5, rate: 12 }, slow: { beg: 50, r1: 189, r2: 288, r3: 306, d1: 213, d2: 418, d3: 305, min: 25, unit: 5, rate: 12 }, strong: { beg: 50, r1: 252, r2: 384, r3: 408, d1: 213, d2: 418, d3: 305, min: 25, unit: 5, rate: 12 } };
    var el = $('g-cblab'), inp = {}, pb = h('div', 'flow-ctl'), box = h('div', 'lab-in'), res = h('div', 'lab-out');
    F.forEach(function (f) { var r = h('div', 'sl'); r.innerHTML = '<label for="cb-' + f[0] + '">' + f[1] + '</label><input type="range" id="cb-' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '"><output id="cbo-' + f[0] + '"></output>'; box.appendChild(r); });
    [['abc', 'ABC (ไฟล์ต้นฉบับ)'], ['slow', 'เก็บเงินช้าลง (รับ −10%)'], ['strong', 'ขายดี (รับ +20%)']].forEach(function (p) { var b = h('button', 'btn sm ghost', p[1]); b.onclick = function () { load(p[0]); }; pb.appendChild(b); });
    var lw = h('div', 'lab-wrap'), left = h('div'); left.appendChild(pb); left.appendChild(box); lw.appendChild(left); lw.appendChild(res); el.appendChild(lw);
    var vd = h('div', 'verdict ok'); vd.id = 'cb-vd'; el.appendChild(vd);
    F.forEach(function (f) { inp[f[0]] = $('cb-' + f[0]); inp[f[0]].addEventListener('input', up); });
    function load(k) { F.forEach(function (f) { inp[f[0]].value = PRE[k][f[0]]; }); up(); }
    function up() {
      var v = {}; F.forEach(function (f) { v[f[0]] = parseFloat(inp[f[0]].value); $('cbo-' + f[0]).textContent = G.fmt(v[f[0]]); });
      var rows = cashBudget(v.beg, [v.r1, v.r2, v.r3], [v.d1, v.d2, v.d3], v.min, v.unit, v.rate / 100), M = ['ต.ค.', 'พ.ย.', 'ธ.ค.'];
      var line = function (name, k, neg, bold) { return '<tr><td>' + (bold ? '<b>' : '') + name + (bold ? '</b>' : '') + '</td>' + rows.map(function (r) { var x = r[k]; if (neg) x = -x; return '<td class="n"' + (x < 0 && k !== 'dis' ? ' style="color:var(--bad)"' : '') + '>' + (x === 0 && (k === 'loan' || k === 'repay' || k === 'intr') ? '-' : fmt(x)) + '</td>'; }).join('') + '</tr>'; };
      res.innerHTML = '<table class="tb"><tr><th>หน่วย: พัน</th>' + M.map(function (m) { return '<th class="n">' + m + '</th>'; }).join('') + '</tr>' + line('เงินสดต้นงวด', 'beg') + line('เงินสดรับ', 'rec') + line('เงินสดจ่าย', 'dis') + line('เงินสดสุทธิ (ก่อนจัดการเงิน)', 'pre', 0, 1) + line('เงินกู้', 'loan') + line('จ่ายคืนเงินต้น', 'repay', 1) + line('จ่ายดอกเบี้ย', 'intr', 1) + line('เงินสดปลายงวด', 'end', 0, 1) + line('เงินกู้คงค้าง', 'out') + '</table>';
      var tl = rows.reduce(function (a, r) { return a + r.loan; }, 0), tr = rows.reduce(function (a, r) { return a + r.repay; }, 0), last = rows[2];
      vd.className = 'verdict ' + (tl === 0 ? 'ok' : last.out > 0 ? 'w' : 'ok');
      vd.textContent = (tl === 0 ? 'ไม่ต้องกู้เลยใน 3 เดือน' : 'กู้รวม ' + fmt(tl) + ' คืนรวม ' + fmt(tr) + ' สิ้น ธ.ค. เหลือหนี้ ' + fmt(last.out)) + ' · เงินสดปลายงวด ธ.ค. = ' + fmt(last.end);
    }
    load('abc');
  })();
  G.drill($('g-drill-loan'), { gen: function () {
    var unit = Math.random() < 0.5 ? 5 : 10, minc = rnd(2, 6) * 5, beg = rnd(1, 10) * 5, rec = rnd(6, 20) * 10, pre = rnd(-60, minc - 3), dis = beg + rec - pre;
    var loan = Math.ceil((minc - pre) / unit) * unit;
    return { q: 'เงินสดต้นงวด <b>' + beg + '</b>  เงินสดรับ <b>' + rec + '</b>  เงินสดจ่าย <b>' + dis + '</b>  เงินสดขั้นต่ำ <b>' + minc + '</b>  กู้เป็นหน่วย <b>' + unit + '</b> (พิมพ์ค่าลบด้วย −)',
      fields: [{ label: 'เงินสดก่อนจัดการเงิน', ans: pre, tol: 0.5, show: pre }, { label: 'เงินกู้', ans: loan, tol: 0.5, show: loan }, { label: 'เงินสดปลายงวด', ans: pre + loan, tol: 0.5, show: pre + loan }],
      why: 'ก่อนจัดการ = ' + beg + ' + ' + rec + ' − ' + dis + ' = ' + pre + '  ขาด ' + (minc - pre) + ' ปัดขึ้นเป็นหน่วย ' + unit + ' ได้กู้ ' + loan + '  ปลายงวด = ' + (pre + loan) };
  } });
  G.drill($('g-drill-repay'), { gen: function () {
    var out = rnd(4, 20) * 5, m = rnd(1, 4), intr = out * 0.12 / 12 * m, minc = rnd(2, 6) * 5, pre = Math.round(minc + intr + rnd(6, 90)), beg = rnd(1, 10) * 5, rec = rnd(10, 25) * 10, dis = beg + rec - pre;
    var rp = Math.min(out, Math.floor((pre - minc - intr) / 5) * 5), it = Math.round(intr * 100) / 100;
    return { q: 'เงินสดต้นงวด <b>' + beg + '</b>  รับ <b>' + rec + '</b>  จ่าย <b>' + dis + '</b>  ขั้นต่ำ <b>' + minc + '</b>  มีเงินกู้ค้าง <b>' + out + '</b> ดอกเบี้ย 12% ต่อปี ค้างมา <b>' + m + '</b> เดือน  คืนเป็นหน่วย 5',
      fields: [{ label: 'เงินสดก่อนจัดการเงิน', ans: pre, tol: 0.5, show: pre }, { label: 'ดอกเบี้ยที่ต้องจ่าย', ans: it, tol: 0.05, show: it }, { label: 'คืนเงินต้นได้สูงสุด', ans: rp, tol: 0.5, show: rp }, { label: 'เงินสดปลายงวด', ans: pre - rp - it, tol: 0.06, show: Math.round((pre - rp - it) * 100) / 100 }],
      why: 'ดอกเบี้ย = ' + out + ' × 12% × ' + m + ' ÷ 12 = ' + it + '  คืนได้ ≤ ' + pre + ' − ' + minc + ' − ' + it + ' = ' + Math.round((pre - minc - it) * 100) / 100 + ' ปัดลงหน่วย 5 (ไม่เกินเงินกู้ค้าง) = ' + rp };
  } });
  G.quiz($('g-cbq'), { questions: [
    { q: 'เงินสดก่อนจัดการเงิน = −51 ขั้นต่ำ 25 หน่วยกู้ 5 กู้เท่าใด', o: ['75', '76', '80', '85'], a: 2, why: 'ขาด 76 ปัดขึ้นเป็นหน่วย 5 = 80' },
    { q: 'ข้อใดไม่ใช่ประโยชน์ของงบประมาณเงินสด', o: ['รู้ล่วงหน้าว่าเมื่อใดต้องกู้', 'วางแผนเวลาคืนเงินกู้', 'รายงานเงินสดที่เกิดขึ้นจริงในอดีต', 'ประเมินความต้องการเงินทุนระยะสั้น'], a: 2, why: 'การรายงานอดีตเป็นหน้าที่งบกระแสเงินสด' },
    { q: 'ขายเชื่อมากขึ้น (เก็บเงินช้าลง) โดยยอดขายเท่าเดิม เงินสดรับในเดือนนั้นจะ', o: ['เพิ่ม', 'ลด', 'เท่าเดิม'], a: 1, why: 'เงินสดรับเลื่อนไปเดือนถัดไป' },
    { q: 'เงินกู้ 80 ดอกเบี้ย 12% ต่อปี ค้าง 2 เดือน ดอกเบี้ยเท่าใด', o: ['0.8', '1.6', '9.6', '16'], a: 1, why: '80 × 12% × 2 ÷ 12 = 1.6' },
    { q: 'เงินสดก่อนจัดการเงิน 64 ขั้นต่ำ 25 ดอกเบี้ย 1.6 คืนเงินต้นได้สูงสุด (หน่วย 5)', o: ['40', '35', '39', '30'], a: 1, why: '64 − 25 − 1.6 = 37.4 ปัดลง = 35' },
    { q: 'เหตุใดจึงตรึงเงินสดขั้นต่ำไว้', o: ['เผื่อความคลาดเคลื่อนของการพยากรณ์', 'เพื่อลดภาษี', 'เพื่อเพิ่มกำไร'], a: 0, why: 'ป้องกันเงินขาดมือเมื่อเกิดเหตุไม่คาดคิด' }
  ] });

  /* ---------- Opening poll ---------- */
  G.tally($('g-poll'), { options: ['ยอดขายที่คุ้มทุน (ไม่ขาดทุน)', 'เงินสดที่ต้องมีหมุนเวียน', 'ราคาขายที่ลูกค้ายอมรับ', 'ยังไม่แน่ใจ ขอเรียนก่อน'] });

  /* ---------- Part 2: CVP ---------- */
  var nf = function (v) { return G.fmt(Math.round(v), 0); };
  G.sort($('g-cost'), {
    buckets: [{ id: 'f', label: 'คงที่ (F)' }, { id: 'v', label: 'ผันแปร (V)' }, { id: 's', label: 'กึ่งผันแปร (S)' }],
    items: [
      { t: 'ค่าเสื่อมราคา', b: 'f', why: 'ไม่เปลี่ยนตามปริมาณผลิต' }, { t: 'ค่าวัตถุดิบ', b: 'v', why: 'เพิ่มตามจำนวนที่ผลิต' }, { t: 'ค่าแรงในการผลิต', b: 'v', why: 'จ่ายตามปริมาณงาน' },
      { t: 'ค่าบำรุงรักษาเครื่องจักร อุปกรณ์', b: 's', why: 'มีทั้งส่วนคงที่และส่วนที่ขึ้นกับการใช้งาน' }, { t: 'ค่าใช้จ่ายสำนักงานทั่วไป', b: 'f', why: 'ไม่ขึ้นกับปริมาณขาย' }, { t: 'ค่าเช่า', b: 'f', why: 'จ่ายเท่าเดิมทุกเดือน' },
      { t: 'ค่านายหน้าพนักงานขาย', b: 's', why: 'มีทั้งส่วนคงที่และส่วนตามยอดขาย' }, { t: 'เงินเดือนผู้บริหาร', b: 'f', why: 'จ่ายคงที่' }, { t: 'เงินเดือนเจ้าหน้าที่ทั่วไป', b: 'f', why: 'จ่ายคงที่' }
    ]
  });
  G.sort($('g-sens'), {
    buckets: [{ id: 'u', label: 'จุดคุ้มทุนเพิ่มขึ้น' }, { id: 'd', label: 'จุดคุ้มทุนลดลง' }],
    items: [
      { t: 'ต้นทุนคงที่เพิ่มขึ้น', b: 'u', why: 'ต้องขายมากขึ้นเพื่อคุ้ม FC ที่สูงขึ้น' }, { t: 'ราคาขายเพิ่มขึ้น', b: 'd', why: 'ส่วนเกินต่อหน่วยมากขึ้น' }, { t: 'ต้นทุนผันแปรต่อหน่วยเพิ่มขึ้น', b: 'u', why: 'ส่วนเกินต่อหน่วยน้อยลง' },
      { t: 'ต้นทุนคงที่ลดลง', b: 'd', why: 'FC น้อยลง คุ้มเร็วขึ้น' }, { t: 'ราคาขายลดลง', b: 'u', why: 'ส่วนเกินต่อหน่วยน้อยลง' }, { t: 'ต้นทุนผันแปรต่อหน่วยลดลง', b: 'd', why: 'ส่วนเกินต่อหน่วยมากขึ้น' }
    ]
  });
  /* CVP lab */
  G.range(['bl-p', 'bl-v', 'bl-f', 'bl-q'], function (p, v, f, q) {
    $('bl-po').textContent = p.toFixed(2); $('bl-vo').textContent = v.toFixed(2); $('bl-fo').textContent = nf(f); $('bl-qo').textContent = nf(q);
    var cm = p - v, vd = $('bl-vd'), ch = $('bl-chart');
    if (cm <= 0) { ['bl-bq', 'bl-bb', 'bl-pf', 'bl-mos'].forEach(function (i) { $(i).textContent = '-'; }); vd.className = 'verdict bad'; vd.textContent = 'ราคาขายต้องมากกว่าต้นทุนผันแปรต่อหน่วย มิฉะนั้นยิ่งขายยิ่งขาดทุน'; ch.innerHTML = ''; return; }
    var bq = f / cm, pf = cm * q - f, mos = (q - bq) / q;
    $('bl-bq').textContent = nf(bq); $('bl-bb').textContent = nf(bq * p); $('bl-pf').textContent = (pf < 0 ? '(' + nf(-pf) + ')' : nf(pf)); $('bl-mos').textContent = mos > 0 ? (mos * 100).toFixed(1) + '%' : 'ต่ำกว่าจุดคุ้มทุน';
    vd.className = 'verdict ' + (pf >= 0 ? 'ok' : 'bad');
    vd.textContent = pf >= 0 ? 'ยอดขายงบประมาณสูงกว่าจุดคุ้มทุน ' + nf(q - bq) + ' หน่วย กำไร ' + nf(pf) + ' บาท  ยอดขายลดลงได้ ' + (mos * 100).toFixed(1) + '% ก่อนขาดทุน' : 'ยอดขายงบประมาณต่ำกว่าจุดคุ้มทุน ' + nf(bq - q) + ' หน่วย ขาดทุน ' + nf(-pf) + ' บาท';
    var W = 600, H = 220, xm = Math.max(q, bq) * 1.3, ym = Math.max(p * xm, f + v * xm) * 1.05, X = function (a) { return 50 + a / xm * (W - 70); }, Y = function (a) { return H - 10 - a / ym * (H - 30); };
    ch.innerHTML = '<svg class="chart" viewBox="0 0 ' + W + ' ' + (H + 20) + '" role="img" aria-label="กราฟจุดคุ้มทุน">' +
      '<line x1="50" y1="' + (H - 10) + '" x2="' + (W - 20) + '" y2="' + (H - 10) + '" stroke="#9fb2ac"/><line x1="50" y1="10" x2="50" y2="' + (H - 10) + '" stroke="#9fb2ac"/>' +
      '<line x1="' + X(0) + '" y1="' + Y(f) + '" x2="' + X(xm) + '" y2="' + Y(f) + '" stroke="#8A9A95" stroke-dasharray="5 4"/>' +
      '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(xm) + '" y2="' + Y(p * xm) + '" stroke="#1B7F6B" stroke-width="3"/>' +
      '<line x1="' + X(0) + '" y1="' + Y(f) + '" x2="' + X(xm) + '" y2="' + Y(f + v * xm) + '" stroke="#B4412E" stroke-width="3"/>' +
      '<line x1="' + X(q) + '" y1="12" x2="' + X(q) + '" y2="' + (H - 10) + '" stroke="#7B4AA0" stroke-dasharray="3 3"/><circle cx="' + X(bq) + '" cy="' + Y(bq * p) + '" r="6" fill="#7B4AA0"/>' +
      '<text x="' + (X(bq) + 8) + '" y="' + (Y(bq * p) + 16) + '" font-size="13" fill="#0F5C4D">คุ้มทุน ' + nf(bq) + '</text><text x="' + (X(q) + 4) + '" y="24" font-size="12" fill="#7B4AA0">ยอดขายงบประมาณ</text>' +
      '<text x="' + (W - 120) + '" y="' + (H + 14) + '" font-size="12" fill="#58706A">ปริมาณขาย (หน่วย)</text><text x="54" y="22" font-size="12" fill="#1B7F6B">รายรับ</text><text x="54" y="' + (Y(f) - 6) + '" font-size="12" fill="#B4412E">ต้นทุนรวม / ต้นทุนคงที่ (ประ)</text></svg>';
  });
  /* drills */
  G.drill($('g-drill-bep'), { gen: function () {
    var P = rnd(10, 50), V = rnd(3, P - 4), cm = P - V, k = rnd(20, 200) * 10, FC = cm * k;
    return { q: 'ราคาขาย <b>' + P + '</b> บาท ต้นทุนผันแปร <b>' + V + '</b> บาทต่อหน่วย ต้นทุนคงที่ <b>' + nf(FC) + '</b> บาท', fields: [{ label: 'จุดคุ้มทุน (หน่วย)', ans: k, tol: 1 }, { label: 'จุดคุ้มทุน (บาท)', ans: k * P, tol: 5 }], why: 'ส่วนเกิน ' + cm + ' บาท  ' + nf(FC) + ' ÷ ' + cm + ' = ' + nf(k) + ' หน่วย  × ' + P + ' = ' + nf(k * P) + ' บาท' };
  } });
  G.drill($('g-drill-tp'), { gen: function () {
    var P = rnd(10, 50), V = rnd(3, P - 4), cm = P - V, k = rnd(20, 100) * 10, m = rnd(5, 60) * 10, FC = cm * k, T = cm * m;
    return { q: 'ราคาขาย <b>' + P + '</b> บาท ต้นทุนผันแปร <b>' + V + '</b> บาท ต้นทุนคงที่ <b>' + nf(FC) + '</b> บาท ต้องการกำไร <b>' + nf(T) + '</b> บาท', fields: [{ label: 'ปริมาณที่ต้องขาย (หน่วย)', ans: k + m, tol: 1 }], why: '(' + nf(FC) + ' + ' + nf(T) + ') ÷ ' + cm + ' = ' + nf(k + m) + ' หน่วย' };
  } });
  G.drill($('g-drill-mos'), { gen: function () {
    var k = rnd(10, 60) * 60, c = [[1.25, 20], [2, 50], [4 / 3, 25], [5 / 3, 40], [2.5, 60]][rnd(0, 4)], Q = Math.round(k * c[0]);
    return { q: 'ยอดขายตามงบประมาณ <b>' + nf(Q) + '</b> หน่วย ยอดขายที่จุดคุ้มทุน <b>' + nf(k) + '</b> หน่วย', fields: [{ label: 'ส่วนเกินที่ปลอดภัย', ans: c[1], tol: 0.2, unit: '%' }], why: '(' + nf(Q) + ' − ' + nf(k) + ') ÷ ' + nf(Q) + ' = ' + c[1] + '%' };
  } });
  /* sales mix lab */
  G.range(['mx-a'], function (a) {
    a = a / 100; $('mx-ao').textContent = Math.round(a * 100) + ' : ' + Math.round((1 - a) * 100);
    var cm = a * 0.4 + (1 - a) * 0.7, bq = 7600 / cm;
    $('mx-cm').textContent = (cm * 100).toFixed(1) + '%'; $('mx-bq').textContent = nf(bq); $('mx-ba').textContent = nf(bq * a); $('mx-bb').textContent = nf(bq * (1 - a));
    var v = $('mx-vd'); v.className = 'verdict ok'; v.textContent = 'ขายสินค้า B (อัตราส่วนเกิน 70%) สัดส่วนมากขึ้น จุดคุ้มทุนรวมลดลง ที่สัดส่วน ' + Math.round(a * 100) + ':' + Math.round((1 - a) * 100) + ' คุ้มทุนที่ยอดขาย ' + nf(bq);
  });
  G.quiz($('g-cvpq'), { questions: [
    { q: 'FC 90,000 P 20 VC 12 จุดคุ้มทุนกี่หน่วย', o: ['7,500', '11,250', '4,500', '15,000'], a: 1, why: '90,000 ÷ (20 − 12) = 11,250' },
    { q: 'อัตราส่วนเกินของสินค้าที่ P 20 VC 12 คือเท่าใด', o: ['40%', '60%', '8%', '12%'], a: 0, why: '(20 − 12) ÷ 20 = 40%' },
    { q: 'ราคาขายเพิ่มขึ้น ตัวแปรอื่นเท่าเดิม จุดคุ้มทุนจะ', o: ['เพิ่ม', 'ลด', 'เท่าเดิม'], a: 1, why: 'ส่วนเกินต่อหน่วยเพิ่ม จึงคุ้มทุนเร็วขึ้น' },
    { q: 'ข้อใดไม่ใช่ข้อสมมติของ BEP เส้นตรง', o: ['ราคาขายต่อหน่วยคงที่', 'VC ต่อหน่วยคงที่', 'ผลิตมากกว่าขายได้เสมอ', 'FC รวมคงที่'], a: 2, why: 'ข้อสมมติคือผลิตเท่ากับขาย' },
    { q: 'ยอดขายงบประมาณ 15,000 BEP 11,250 MOS เท่าใด', o: ['25%', '33%', '75%', '20%'], a: 0, why: '(15,000 − 11,250) ÷ 15,000 = 25%' },
    { q: 'BEP เงินสดต่ำกว่า BEP ทางบัญชี เพราะอะไร', o: ['ราคาขายสูงกว่า', 'ต้นทุนคงที่บางส่วนไม่ใช้เงินสด เช่น ค่าเสื่อม', 'VC น้อยกว่า', 'ภาษีน้อยกว่า'], a: 1, why: 'ค่าเสื่อมไม่ทำให้เงินสดไหลออก' }
  ] });
})();
