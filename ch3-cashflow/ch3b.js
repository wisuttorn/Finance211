/* Chapter 3 (part 1 & 3): Financial statement analysis and Cash Budget games */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var r1 = function (v) { return (Math.round(v * 10) / 10).toFixed(1); }, r2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var fmt = function (n) { var v = Math.round(n * 100) / 100; return (v < 0 ? '(' : '') + G.fmt(Math.abs(v), Math.abs(v) % 1 ? 2 : 0) + (v < 0 ? ')' : ''); };
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- Part 1: FSA ---------- */
  G.sort($('g-users'), {
    buckets: [{ id: 'i', label: 'ผู้ใช้ภายในกิจการ' }, { id: 'e', label: 'ผู้ใช้ภายนอกกิจการ' }],
    items: [
      { t: 'ผู้บริหาร', b: 'i', why: 'ใช้วางแผนและควบคุมการดำเนินงาน' }, { t: 'พนักงาน', b: 'i', why: 'ดูความมั่นคงของนายจ้าง' }, { t: 'เจ้าของกิจการ', b: 'i', why: 'ดูผลงานของการลงทุน' },
      { t: 'ผู้ให้กู้ (ธนาคาร)', b: 'e', why: 'ประเมินความสามารถชำระหนี้' }, { t: 'ผู้ขายสินค้าเชื่อ', b: 'e', why: 'ประเมินเครดิต' }, { t: 'ลูกค้า', b: 'e', why: 'ดูความต่อเนื่องของกิจการ' },
      { t: 'กรมสรรพากร', b: 'e', why: 'ตรวจภาษี' }, { t: 'นักวิเคราะห์การลงทุน', b: 'e', why: 'ประเมินมูลค่า' }, { t: 'คู่แข่ง', b: 'e', why: 'เปรียบเทียบผลงาน' }, { t: 'ชุมชน', b: 'e', why: 'ผลกระทบต่อสังคม' }
    ]
  });
  G.match($('g-match3'), { pairs: [
    ['เงินสดเคลื่อนไหวอย่างไรในช่วงเวลาหนึ่ง', 'งบกระแสเงินสด (Cash Flow Statement)'],
    ['สร้างความมั่งคั่งได้เท่าใดในช่วงเวลาหนึ่ง', 'งบกำไรขาดทุน (Profit and Loss)'],
    ['ความมั่งคั่งสะสม ณ วันสิ้นงวดเป็นเท่าใด', 'งบฐานะการเงิน (Statement of Financial Position)']
  ] });
  G.sort($('g-sfpsort'), {
    buckets: [{ id: 'ca', label: 'สินทรัพย์หมุนเวียน' }, { id: 'na', label: 'สินทรัพย์ไม่หมุนเวียน' }, { id: 'cl', label: 'หนี้สินหมุนเวียน' }, { id: 'nl', label: 'หนี้สินไม่หมุนเวียน' }, { id: 'eq', label: 'ส่วนของเจ้าของ' }],
    items: [
      { t: 'เงินสด', b: 'ca', why: 'สภาพคล่องสูงสุด' }, { t: 'ลูกหนี้การค้า', b: 'ca', why: 'เก็บเงินภายใน 1 ปี' }, { t: 'สินค้าคงเหลือ', b: 'ca', why: 'ขายภายในรอบดำเนินงาน' },
      { t: 'ที่ดิน อาคารและอุปกรณ์', b: 'na', why: 'ถือไว้ใช้ระยะยาว' }, { t: 'สินทรัพย์ไม่มีตัวตน', b: 'na', why: 'ใช้ประโยชน์ระยะยาว' },
      { t: 'เจ้าหนี้การค้า', b: 'cl', why: 'ชำระภายใน 1 ปี' }, { t: 'ค่าใช้จ่ายค้างจ่าย', b: 'cl', why: 'ชำระเร็ว ๆ นี้' }, { t: 'เงินเบิกเกินบัญชี', b: 'cl', why: 'หนี้ระยะสั้น' },
      { t: 'เงินกู้ยืมระยะยาว', b: 'nl', why: 'ครบกำหนดเกิน 1 ปี' }, { t: 'หุ้นสามัญ', b: 'eq', why: 'เงินทุนของเจ้าของ' }, { t: 'กำไรสะสม', b: 'eq', why: 'กำไรที่ยังไม่จ่ายออก' }
    ]
  });
  G.drill($('g-drill-eq'), { gen: function () {
    var A = rnd(40, 200) * 10, L = rnd(10, Math.floor(A / 10) - 5) * 10, re0 = rnd(5, 60) * 10, ni = rnd(5, 30) * 10, dv = rnd(1, Math.floor(ni / 10) - 1) * 10;
    return { q: 'สินทรัพย์รวม <b>' + A + '</b>  หนี้สินรวม <b>' + L + '</b>  |  กำไรสะสมต้นงวด <b>' + re0 + '</b>  กำไรสุทธิ <b>' + ni + '</b>  เงินปันผลจ่าย <b>' + dv + '</b>',
      fields: [{ label: 'ส่วนของเจ้าของ', ans: A - L, tol: 0.5, show: A - L }, { label: 'กำไรสะสมปลายงวด', ans: re0 + ni - dv, tol: 0.5, show: re0 + ni - dv }],
      why: 'ส่วนของเจ้าของ = ' + A + ' − ' + L + ' = ' + (A - L) + '  กำไรสะสมปลาย = ' + re0 + ' + ' + ni + ' − ' + dv + ' = ' + (re0 + ni - dv) };
  } });
  G.sort($('g-plsort'), {
    buckets: [{ id: 'or', label: 'รายได้จากการดำเนินงาน' }, { id: 'xr', label: 'รายได้อื่น' }, { id: 'oe', label: 'ค่าใช้จ่ายในการดำเนินงาน' }, { id: 'xe', label: 'ค่าใช้จ่ายอื่น' }],
    items: [
      { t: 'รายได้จากการขายสินค้า', b: 'or', why: 'กิจกรรมหลัก' }, { t: 'รายได้ค่าเช่า (กิจการไม่ได้ให้เช่าเป็นหลัก)', b: 'xr', why: 'ไม่ใช่กิจกรรมหลัก' }, { t: 'ดอกเบี้ยรับ', b: 'xr', why: 'ไม่ใช่กิจกรรมหลัก' },
      { t: 'ต้นทุนขาย', b: 'oe', why: 'ต้นทุนของกิจกรรมหลัก' }, { t: 'ค่าใช้จ่ายในการขาย', b: 'oe', why: 'ดำเนินงาน' }, { t: 'ค่าใช้จ่ายในการบริหาร', b: 'oe', why: 'ดำเนินงาน' },
      { t: 'ดอกเบี้ยจ่าย', b: 'xe', why: 'ต้นทุนทางการเงิน อยู่ในรายการอื่น' }, { t: 'ขาดทุนจากการขายอุปกรณ์', b: 'xe', why: 'ไม่ใช่กิจกรรมหลัก' }
    ]
  });
  G.sort($('g-ratiosort'), {
    buckets: [{ id: 'l', label: 'สภาพคล่อง' }, { id: 'a', label: 'ประสิทธิภาพ' }, { id: 'v', label: 'การก่อหนี้' }, { id: 'p', label: 'ความสามารถทำกำไร' }],
    items: [
      { t: 'Current ratio', b: 'l' }, { t: 'Quick ratio', b: 'l' }, { t: 'อัตราหมุนเวียนลูกหนี้', b: 'a' }, { t: 'อัตราหมุนเวียนสินค้าคงเหลือ', b: 'a' }, { t: 'อัตราหมุนเวียนสินทรัพย์รวม', b: 'a' },
      { t: 'Debt ratio', b: 'v' }, { t: 'Times interest earned', b: 'v' }, { t: 'หนี้สินต่อส่วนผู้ถือหุ้น', b: 'v' }, { t: 'Gross profit margin', b: 'p' }, { t: 'ROA', b: 'p' }, { t: 'ROE', b: 'p' }
    ]
  });
  /* DuPont lab */
  G.range(['dp-n', 'dp-t', 'dp-e'], function (n, t, e) {
    var roa = n * t, roe = roa * e, d = (1 - 1 / e) * 100;
    $('dp-no').textContent = n.toFixed(1) + '%'; $('dp-to').textContent = t.toFixed(2); $('dp-eo').textContent = e.toFixed(2);
    $('dp-roa').textContent = roa.toFixed(1) + '%'; $('dp-roe').textContent = roe.toFixed(1) + '%'; $('dp-d').textContent = d.toFixed(0) + '%';
    var v = $('dp-v'); v.className = 'verdict ' + (e > 3 ? 'bad' : 'ok');
    v.textContent = e > 3 ? 'ROE สูงเพราะใช้หนี้มาก (หนี้ ' + d.toFixed(0) + '% ของสินทรัพย์) ความเสี่ยงสูงตามไปด้วย' : 'ค่าตั้งต้น (7.13% × 2.26 × 1.98) ให้ ROA 16.1% และ ROE 31.9% ลองเพิ่มตัวทวีดูว่า ROE เพิ่มเท่าใด';
  });
  G.drill($('g-drill-ratio'), { gen: function () {
    var ta = rnd(50, 150) * 10, ca = rnd(Math.floor(ta * 0.25 / 10), Math.floor(ta * 0.6 / 10)) * 10, inv = rnd(1, Math.floor(ca / 10 * 0.6)) * 10, cl = rnd(10, 50) * 10, debt = rnd(Math.floor(ta * 0.2 / 10), Math.floor(ta * 0.7 / 10)) * 10, ni = rnd(5, 20) * 10, eq = ta - debt;
    return { q: 'สินทรัพย์หมุนเวียน <b>' + ca + '</b>  สินค้าคงเหลือ <b>' + inv + '</b>  หนี้สินหมุนเวียน <b>' + cl + '</b>  สินทรัพย์รวม <b>' + ta + '</b>  หนี้สินรวม <b>' + debt + '</b>  กำไรสุทธิ <b>' + ni + '</b> (ส่วนผู้ถือหุ้น = สินทรัพย์รวม − หนี้สินรวม)',
      fields: [{ label: 'Current ratio (เท่า)', ans: ca / cl, tol: 0.011, show: r2(ca / cl) }, { label: 'Quick ratio (เท่า)', ans: (ca - inv) / cl, tol: 0.011, show: r2((ca - inv) / cl) }, { label: 'Debt ratio', ans: debt / ta * 100, tol: 0.11, unit: '%', show: r1(debt / ta * 100) }, { label: 'ROE', ans: ni / eq * 100, tol: 0.11, unit: '%', show: r1(ni / eq * 100) }],
      why: 'Current = ' + ca + ' ÷ ' + cl + ' = ' + r2(ca / cl) + '  Quick = (' + ca + ' − ' + inv + ') ÷ ' + cl + ' = ' + r2((ca - inv) / cl) + '  Debt = ' + debt + ' ÷ ' + ta + ' = ' + r1(debt / ta * 100) + '%  ROE = ' + ni + ' ÷ ' + eq + ' = ' + r1(ni / eq * 100) + '%' };
  } });
  G.quiz($('g-ratioq'), { questions: [
    { q: 'Current ratio 1.87 และ Quick ratio 0.84 บอกอะไร', o: ['สภาพคล่องขึ้นกับสินค้าคงเหลือค่อนข้างมาก', 'ไม่มีหนี้สินระยะสั้น', 'กำไรสูง'], a: 0, why: 'ตัดสินค้าคงเหลือแล้วอัตราส่วนลดจาก 1.87 เหลือ 0.84' },
    { q: 'ระยะเวลาเก็บเงินจากลูกหนี้เฉลี่ย 39 วัน และบริษัทให้เครดิต 30 วัน แปลว่า', o: ['เก็บเงินช้ากว่านโยบาย', 'เก็บเงินเร็วกว่านโยบาย', 'ไม่มีลูกหนี้'], a: 0, why: '39 วัน มากกว่า 30 วัน' },
    { q: 'Debt ratio 49.7% หมายความว่า', o: ['สินทรัพย์ราว 50% ได้มาจากหนี้สิน', 'กำไรเท่ากับหนี้ 50%', 'หนี้สินน้อยมาก'], a: 0, why: 'หนี้สินรวมต่อสินทรัพย์รวม' },
    { q: 'ROE 31.9% สูงกว่า ROA 16.1% เพราะอะไร', o: ['ใช้หนี้ช่วยหาทุน (ตัวทวีประมาณ 1.98)', 'ยอดขายเพิ่ม', 'ภาษีต่ำ'], a: 0, why: 'ROE = ROA × Equity multiplier' },
    { q: 'การเปรียบเทียบอัตราส่วนกับบริษัทอื่นในอุตสาหกรรมเดียวกันเรียกว่า', o: ['Cross-section / Benchmark', 'Trend analysis', 'Common size'], a: 0, why: 'ส่วนเทียบกับอดีตของตนเองเรียก Trend / Time series' }
  ] });
  G.match($('g-limit'), { pairs: [
    ['ไม่มีค่าเฉลี่ยอุตสาหกรรมที่ครบถ้วน', 'เทียบกับเกณฑ์ที่เหมาะสมได้ยาก'],
    ['ไม่คำนึงถึงเงินเฟ้อ', 'อำนาจซื้อของเงินลดลงโดยไม่เห็นในตัวเลข'],
    ['ปัญหาฤดูกาล', 'งบ ณ วันสิ้นงวดอาจไม่สะท้อนภาพทั้งปี'],
    ['Window dressing', 'งบดูดีกว่าความเป็นจริง'],
    ['นโยบายบัญชีต่างกัน', 'เปรียบเทียบข้ามบริษัทผิดพลาด']
  ] });

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
})();
