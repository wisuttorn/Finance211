/* Chapter 9: Capital budgeting */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var pick = function (a) { return a[rnd(0, a.length - 1)]; };
  var nf = function (v) { return G.fmt(Math.round(v), 0); };
  var p2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var tl = function (a) { return Math.max(1, Math.abs(a) * 0.002); };
  var npv = function (r, cf) { var s = 0, t; for (t = 0; t < cf.length; t++) s += cf[t] / Math.pow(1 + r, t); return s; };
  function irr(cf) { var lo = -0.9, hi = 3, m, k; if (npv(lo, cf) * npv(hi, cf) > 0) return null; for (k = 0; k < 100; k++) { m = (lo + hi) / 2; if (npv(m, cf) > 0) lo = m; else hi = m; } return (lo + hi) / 2; }
  function payback(cf) { var c = cf[0], t; for (t = 1; t < cf.length; t++) { if (c + cf[t] >= 0) return t - 1 + (-c) / cf[t]; c += cf[t]; } return null; }
  function line(el, xs, series, cols, labels, mark) {
    var all = [].concat.apply([], series), mn = Math.min.apply(null, all.concat([0])), mx = Math.max.apply(null, all.concat([1])), W = 600, H = 150;
    var X = function (i) { return 30 + i / (xs.length - 1) * W; }, Y = function (v) { return 10 + (mx - v) / (mx - mn) * (H - 25); };
    var s = '<svg class="chart" viewBox="0 0 660 170" role="img" aria-label="NPV ตามอัตราคิดลด"><line x1="30" x2="630" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="#58706A" stroke-dasharray="3"/>';
    series.forEach(function (v, k) { s += '<polyline fill="none" stroke="' + cols[k] + '" stroke-width="3" points="' + v.map(function (y, i) { return X(i).toFixed(1) + ',' + Y(y).toFixed(1); }).join(' ') + '"/><text x="' + (X(xs.length - 1) - 40) + '" y="' + (Y(v[v.length - 1]) - 6) + '" font-size="12" fill="' + cols[k] + '">' + labels[k] + '</text>'; });
    xs.forEach(function (x, i) { if (i % 2 === 0) s += '<text x="' + X(i) + '" y="165" font-size="10" text-anchor="middle" fill="#58706A">' + x + '%</text>'; });
    if (mark !== undefined) s += '<line x1="' + X(mark) + '" x2="' + X(mark) + '" y1="5" y2="' + (H - 12) + '" stroke="#B4412E" stroke-dasharray="4"/>';
    el.innerHTML = s + '</svg>';
  }
  G.tally($('g-poll'), { options: ['โครงการ A (คืนทุน 3 ปี)', 'โครงการ B (คืนทุน 2.5 ปี)', 'ต้องดูข้อมูลอื่นก่อน'] });
  G.sort($('g-type'), {
    buckets: [{ id: 'r', label: 'ทดแทน' }, { id: 'e', label: 'ขยายงาน' }, { id: 'm', label: 'ความปลอดภัย/บังคับ' }],
    items: [
      { t: 'เปลี่ยนรถบรรทุกเก่าที่เสื่อมสภาพ', b: 'r', why: 'แทนสินทรัพย์เดิม' }, { t: 'ซื้อเครื่องจักรใหม่แทนเครื่องที่ล้าสมัย', b: 'r', why: 'ทดแทนของเดิม' },
      { t: 'เปิดสาขาใหม่ในจังหวัดอื่น', b: 'e', why: 'ตลาดใหม่' }, { t: 'ลงทุนผลิตสินค้าใหม่', b: 'e', why: 'สินค้าใหม่' }, { t: 'เพิ่มกำลังผลิตสินค้าเดิม', b: 'e', why: 'ตลาดเดิม สินค้าเดิม' },
      { t: 'ติดตั้งระบบบำบัดน้ำเสียตามกฎหมาย', b: 'm', why: 'โครงการบังคับ/สิ่งแวดล้อม' }, { t: 'ติดตั้งอุปกรณ์ความปลอดภัยในโรงงาน', b: 'm', why: 'Safety' }
    ]
  });
  G.sort($('g-rel'), {
    buckets: [{ id: 'y', label: 'รวมในกระแสเงินสด' }, { id: 'n', label: 'ไม่รวม' }],
    items: [
      { t: 'ยอดขายที่เพิ่มขึ้นจากโครงการ', b: 'y', why: 'ส่วนเพิ่ม' }, { t: 'ภาษีที่ต้องจ่ายเพิ่ม', b: 'y', why: 'กระทบเงินสด' }, { t: 'เงินทุนหมุนเวียนที่ต้องลงทุนเพิ่ม', b: 'y', why: 'เงินสดจริง' },
      { t: 'ค่าเช่าที่ดินที่โครงการนี้ใช้ ซึ่งเดิมให้คนอื่นเช่าได้', b: 'y', why: 'ต้นทุนเสียโอกาส' }, { t: 'ดอกเบี้ยจ่ายจากเงินกู้ที่ใช้ลงทุน', b: 'n', why: 'อยู่ในอัตราคิดลดแล้ว' },
      { t: 'ค่าเสื่อมราคา (ตัวมันเอง ไม่ใช่เงินสด)', b: 'n', why: 'ไม่ใช่เงินสดจ่าย แต่ต้องนำมาคิดภาษีที่ประหยัด' }, { t: 'ค่าศึกษาความเป็นไปได้ที่จ่ายไปแล้วในอดีต', b: 'n', why: 'ต้นทุนจม แก้ไขไม่ได้' }
    ]
  });
  G.drill($('g-drill-init'), { gen: function () {
    var np = rnd(8, 30) * 100000, bv = rnd(2, 9) * 10000, sp = bv + pick([-3, -2, 2, 3, 5]) * 10000, t = pick([20, 25, 30, 35]), tax = (sp - bv) * t / 100, net = sp - tax, inv = np - net;
    return { q: 'เครื่องใหม่ <b>' + nf(np) + '</b> เครื่องเก่ามูลค่าบัญชี <b>' + nf(bv) + '</b> ขายได้ <b>' + nf(sp) + '</b> ภาษี <b>' + t + '%</b> (ขาดทุนประหยัดภาษีได้)', fields: [{ label: 'ภาษีจ่าย (ลบ = ประหยัด)', ans: tax, tol: 1 }, { label: 'เงินลงทุนเริ่มแรก', ans: inv, tol: 1, show: nf(inv) }], why: 'กำไร(ขาดทุน) = ' + nf(sp - bv) + '  ภาษี = ' + nf(tax) + '  เงินสุทธิ = ' + nf(net) + '  เงินลงทุน = ' + nf(np) + ' − ' + nf(net) };
  } });
  G.drill($('g-drill-ocf'), { gen: function () {
    var R = rnd(20, 90) * 10000, E = Math.round(R * pick([0.4, 0.5, 0.6]) / 10000) * 10000, D = rnd(2, 8) * 10000, T = pick([20, 30, 35, 40]), o = (R - E - D) * (1 - T / 100) + D;
    return { q: 'R = <b>' + nf(R) + '</b> E = <b>' + nf(E) + '</b> D = <b>' + nf(D) + '</b> T = <b>' + T + '%</b>', fields: [{ label: 'กำไรสุทธิ', ans: (R - E - D) * (1 - T / 100), tol: 1 }, { label: 'OCF', ans: o, tol: 1, show: nf(o) }], why: '(' + nf(R) + ' − ' + nf(E) + ' − ' + nf(D) + ') × ' + (1 - T / 100).toFixed(2) + ' + ' + nf(D) + ' = ' + nf(o) };
  } });
  G.range(['oc-r', 'oc-e', 'oc-d', 'oc-t'], function (R, E, D, T) {
    $('oc-ro').textContent = nf(R); $('oc-eo').textContent = nf(E); $('oc-do').textContent = nf(D); $('oc-to').textContent = T + '%';
    var b = R - E - D, n = b * (1 - T / 100), o = n + D;
    $('oc-b').textContent = nf(b); $('oc-n').textContent = nf(n); $('oc-o').textContent = nf(o); $('oc-s').textContent = nf(T / 100 * D);
    var v = $('oc-vd'); v.className = 'verdict ' + (b < 0 ? 'bad' : 'ok');
    v.textContent = 'ค่าเสื่อมราคา ' + nf(D) + ' ไม่ใช่เงินสดจ่าย แต่ช่วยลดภาษี ' + nf(T / 100 * D) + ' จึงบวกกลับเข้า OCF' + (b < 0 ? ' (กำไรก่อนภาษีติดลบ ภาษีเป็น 0 ในทางปฏิบัติ)' : '');
  });
  G.range(['rp-n', 'rp-s', 'rp-a', 'rp-l', 'rp-k'], function (np, sp, ad, life, k) {
    $('rp-no').textContent = nf(np); $('rp-so').textContent = nf(sp); $('rp-ao').textContent = nf(ad); $('rp-lo').textContent = life + ' ปี'; $('rp-ko').textContent = k.toFixed(1) + '%';
    var bvOld = 120000, T = 0.35, net = sp - T * (sp - bvOld), inv = np - net, dNew = np / life, dOld = 10000, ocf = ad * (1 - T) + T * (dNew - dOld);
    var cf = [-inv]; for (var t = 1; t <= life; t++) cf.push(ocf); var v = npv(k / 100, cf), pb = inv / ocf;
    $('rp-i').textContent = nf(inv); $('rp-o').textContent = nf(ocf); $('rp-v').textContent = nf(v); $('rp-b').textContent = pb.toFixed(2);
    var e = $('rp-vd'); e.className = 'verdict ' + (v > 0 ? 'ok' : 'bad');
    e.textContent = v > 0 ? 'NPV เป็นบวก ' + nf(v) + ' ควรเปลี่ยนเครื่องจักร' : 'NPV ติดลบ ' + nf(v) + ' ไม่ควรเปลี่ยน (เครื่องเก่ามูลค่าบัญชี 120,000 ภาษี 35% ค่าเสื่อมเก่า 10,000)';
  });
  G.match($('g-tech'), { pairs: [
    ['ใช้กำไรสุทธิหลังภาษีและเงินลงทุนเฉลี่ย', 'ARR'], ['นับปีที่เงินสะสมคืนเงินลงทุนครบ ไม่คิดมูลค่าเงินตามเวลา', 'Payback'],
    ['PV ของกระแสเงินสดรับ − เงินลงทุน', 'NPV'], ['อัตราคิดลดที่ทำให้ NPV = 0', 'IRR'], ['PV ของกระแสเงินสดรับ ÷ เงินลงทุน', 'PI']
  ] });
  G.drill($('g-drill-pb'), { gen: function () {
    var cf = [rnd(2, 6) * 10000, rnd(2, 6) * 10000, rnd(2, 6) * 10000, rnd(3, 6) * 10000], c = 0, i;
    var inv = (cf[0] + cf[1]) + rnd(1, 9) * cf[2] / 10; inv = Math.round(inv / 1000) * 1000;
    var all = [-inv].concat(cf), pb = payback(all);
    return { q: 'เงินลงทุน <b>' + nf(inv) + '</b> กระแสเงินสดรับปี 1–4: <b>' + cf.map(nf).join(' / ') + '</b>', fields: [{ label: 'Payback', ans: pb, tol: 0.02, unit: 'ปี', show: p2(pb) }], why: 'สะสมจนเกือบครบ แล้วนำส่วนที่ขาดหารด้วยกระแสเงินสดปีถัดไป = ' + p2(pb) + ' ปี' };
  } });
  G.drill($('g-drill-npv'), { gen: function () {
    var inv = rnd(5, 20) * 10000, cf = [rnd(3, 9) * 10000, rnd(3, 9) * 10000, rnd(3, 9) * 10000], k = pick([8, 10, 12, 15]), v = npv(k / 100, [-inv].concat(cf));
    return { q: 'เงินลงทุน <b>' + nf(inv) + '</b> กระแสเงินสดรับปี 1–3: <b>' + cf.map(nf).join(' / ') + '</b> k = <b>' + k + '%</b>', fields: [{ label: 'NPV', ans: v, tol: tl(v), show: nf(v) }, { label: 'PI', ans: (v + inv) / inv, tol: 0.01, show: p2((v + inv) / inv) }], why: 'NPV = ' + nf(v) + (v > 0 ? ' (ลงทุน)' : ' (ไม่ลงทุน)') };
  } });
  G.sort($('g-irr'), {
    buckets: [{ id: 'y', label: 'ผ่านเกณฑ์ (IRR > 20%)' }, { id: 'n', label: 'ไม่ผ่าน' }],
    items: [
      { t: 'ABC โครงการ A (IRR 19.9%)', b: 'n', why: '19.9% < 20%' }, { t: 'ABC โครงการ B (IRR 21.7%)', b: 'y', why: '21.7% > 20%' },
      { t: 'XYZ โครงการ A (IRR 17.0%)', b: 'n', why: '17.0% < 20%' }, { t: 'XYZ โครงการ B (IRR 14.9%)', b: 'n', why: '14.9% < 20%' }, { t: 'โครงการสมมติ IRR 25%', b: 'y', why: '25% > 20%' }
    ]
  });
  G.range(['tl-i', 'tl-c', 'tl-n', 'tl-k'], function (inv, c, n, k) {
    $('tl-io').textContent = nf(inv); $('tl-co').textContent = nf(c); $('tl-no').textContent = n + ' ปี'; $('tl-ko').textContent = k.toFixed(1) + '%';
    var cf = [-inv]; for (var t = 1; t <= n; t++) cf.push(c);
    var pb = payback(cf), r = irr(cf), v = npv(k / 100, cf);
    $('tl-b').textContent = pb === null ? 'ไม่คืนทุน' : pb.toFixed(2); $('tl-v').textContent = nf(v); $('tl-r').textContent = r === null ? '-' : (r * 100).toFixed(1) + '%'; $('tl-p').textContent = ((v + inv) / inv).toFixed(2);
    var xs = [0, 5, 10, 15, 20, 25, 30]; line($('tl-chart'), xs, [xs.map(function (x) { return npv(x / 100, cf); })], ['#7B4AA0'], ['NPV'], k / 5 > 6 ? undefined : k / 5);
    var e = $('tl-vd'); e.className = 'verdict ' + (v > 0 ? 'ok' : 'bad');
    e.textContent = v > 0 ? 'NPV > 0 · PI > 1 · IRR (' + (r * 100).toFixed(1) + '%) > k จึงควรลงทุน' : 'NPV ≤ 0 · PI ≤ 1 · IRR ต่ำกว่า k ไม่ควรลงทุน';
  });
  G.sort($('g-cmp'), {
    buckets: [{ id: 'a', label: 'ชี้ว่า A ดีกว่า' }, { id: 'b', label: 'ชี้ว่า B ดีกว่า' }],
    items: [
      { t: 'ARR 26.67% เทียบ 22.22%', b: 'a', why: 'ARR ของ A สูงกว่า' }, { t: 'NPV 11,071 เทียบ 10,924', b: 'a', why: 'NPV ของ A สูงกว่า' }, { t: 'PI 1.26 เทียบ 1.24', b: 'a', why: 'PI ของ A สูงกว่า' },
      { t: 'ระยะเวลาคืนทุน 3.0 เทียบ 2.5 ปี', b: 'b', why: 'B คืนทุนเร็วกว่า' }, { t: 'IRR 19.9% เทียบ 21.7%', b: 'b', why: 'IRR ของ B สูงกว่า' }
    ]
  });
  var XA = [-50000, 15625, 15625, 15625, 15625, 15625], XB = [-50000, 0, 0, 0, 0, 100000];
  G.range(['xz-k'], function (k) {
    $('xz-ko').textContent = k.toFixed(1) + '%';
    var a = npv(k / 100, XA), b = npv(k / 100, XB);
    $('xz-a').textContent = nf(a); $('xz-b').textContent = nf(b); $('xz-w').textContent = (a > b ? 'A' : 'B') + (Math.max(a, b) <= 0 ? ' (แต่ NPV ไม่เป็นบวก)' : '');
    var xs = []; for (var i = 0; i <= 20; i += 2) xs.push(i);
    line($('xz-chart'), xs, [xs.map(function (x) { return npv(x / 100, XA); }), xs.map(function (x) { return npv(x / 100, XB); })], ['#1B7F6B', '#7B4AA0'], ['A', 'B'], k / 2);
    var e = $('xz-vd'); e.className = 'verdict ok';
    e.textContent = k < 12.37 ? 'k ต่ำกว่าจุดตัด 12.4%: NPV เลือก B แต่ IRR เลือก A (17.0% > 14.9%) ขัดแย้งกัน ให้เชื่อ NPV' : 'k สูงกว่าจุดตัด 12.4%: NPV กับ IRR เลือก A ตรงกัน';
  });
  G.quiz($('g-q9'), { questions: [
    { q: 'ซื้อเครื่องใหม่ 500,000 ขายเครื่องเก่า 100,000 มูลค่าบัญชี 60,000 ภาษี 25% เงินลงทุนเริ่มแรกคือ', o: ['410,000', '400,000', '390,000', '500,000'], a: 0, why: 'ภาษี 10,000 เงินสุทธิ 90,000 → 500,000 − 90,000' },
    { q: 'R = 400,000 E = 250,000 D = 50,000 T = 30% OCF เท่าใด', o: ['120,000', '70,000', '100,000', '105,000'], a: 0, why: '(100,000)(0.7) + 50,000' },
    { q: 'ลงทุน 100,000 ได้ปีละ 40,000 Payback', o: ['2.5 ปี', '2 ปี', '3 ปี', '4 ปี'], a: 0, why: '100,000 ÷ 40,000' },
    { q: 'ลงทุน 60,000 ได้ปีละ 25,000 สี่ปี k = 10% NPV ประมาณ', o: ['19,247', '40,000', '−5,000', '25,000'], a: 0, why: '25,000 × 3.1699 − 60,000' },
    { q: 'เมื่อ NPV = 0 อัตราคิดลดเรียกว่า', o: ['IRR', 'ARR', 'PI', 'WACC'], a: 0, why: 'IRR คือ k ที่ทำให้ NPV = 0' },
    { q: 'ข้อใดไม่ควรรวมในกระแสเงินสดโครงการ', o: ['ดอกเบี้ยจ่าย', 'ΔNWC', 'ต้นทุนเสียโอกาส', 'ภาษีเพิ่ม'], a: 0, why: 'ต้นทุนเงินทุนอยู่ในอัตราคิดลดแล้ว' },
    { q: 'เมื่อ NPV กับ IRR เลือกโครงการแข่งกันต่างกัน ควรยึด', o: ['NPV', 'IRR', 'Payback', 'ARR'], a: 0, why: 'NPV วัดมูลค่าเพิ่มจริง' },
    { q: 'เงินทุน 50 ล้านบาท Y+Z มี NPV 44.93 X มี 39.03 ควรเลือก', o: ['Y + Z', 'X', 'ไม่เลือกเลย'], a: 0, why: 'NPV รวมสูงกว่าในงบเท่ากัน' }
  ] });
})();
