/* Chapter 8: Cost of capital */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var pick = function (a) { return a[rnd(0, a.length - 1)]; };
  var nf = function (v) { return G.fmt(Math.round(v), 0); };
  var nd = function (v, d) { return G.fmt(v, d); };
  var p2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var pva = function (i, n) { return (1 - Math.pow(1 + i, -n)) / i; };
  function ytm(nd0, I, M, n) { var lo = 0.0001, hi = 0.8, r, k, pr; for (k = 0; k < 80; k++) { r = (lo + hi) / 2; pr = I * pva(r, n) + M * Math.pow(1 + r, -n); if (pr > nd0) lo = r; else hi = r; } return (lo + hi) / 2; }
  function approx(Nd, I, M, n) { return (I + (M - Nd) / n) / ((M + Nd) / 2); }
  G.tally($('g-poll'), { options: ['เงินกู้ธนาคาร', 'หุ้นกู้', 'หุ้นบุริมสิทธิ์', 'หุ้นสามัญ'] });
  G.sort($('g-src'), {
    buckets: [{ id: 'y', label: 'นำมาคิดต้นทุนเงินทุน' }, { id: 'n', label: 'ไม่นำมาคิดโดยทั่วไป' }],
    items: [
      { t: 'หุ้นกู้ระยะยาว', b: 'y', why: 'หนี้ระยะยาวที่มีต้นทุนดอกเบี้ย' }, { t: 'เงินกู้ระยะยาวจากธนาคาร', b: 'y', why: 'หนี้ระยะยาว' }, { t: 'หุ้นบุริมสิทธิ์', b: 'y', why: 'เงินทุนระยะยาว จ่ายปันผลคงที่' },
      { t: 'หุ้นสามัญ', b: 'y', why: 'ส่วนของเจ้าของ' }, { t: 'กำไรสะสม', b: 'y', why: 'เป็นเงินของเจ้าของ มีต้นทุนเสียโอกาส' },
      { t: 'เจ้าหนี้การค้า', b: 'n', why: 'หนี้หมุนเวียน ไม่มีดอกเบี้ยชัดเจน' }, { t: 'ค่าใช้จ่ายค้างจ่าย', b: 'n', why: 'หนี้หมุนเวียนระยะสั้น' }
    ]
  });
  G.range(['kd-c', 'kd-p', 'kd-f', 'kd-n', 'kd-t'], function (c, p, f, n, t) {
    $('kd-co').textContent = c.toFixed(1) + '%'; $('kd-po').textContent = nf(p); $('kd-fo').textContent = f.toFixed(1) + '%'; $('kd-no').textContent = n + ' ปี'; $('kd-to').textContent = t + '%';
    var I = c * 10, Nd = p - f * 10, a = approx(Nd, I, 1000, n), x = ytm(Nd, I, 1000, n);
    $('kd-nd').textContent = nf(Nd); $('kd-a').textContent = (a * 100).toFixed(2) + '%'; $('kd-x').textContent = (x * 100).toFixed(2) + '%'; $('kd-i').textContent = (x * (1 - t / 100) * 100).toFixed(2) + '%';
    var v = $('kd-vd'); v.className = 'verdict ok';
    v.textContent = (Nd < 1000 ? 'ขายต่ำกว่าพาร์/มีค่าใช้จ่ายออก ' : 'ขายสูงกว่าพาร์ ') + 'ต้นทุนก่อนภาษี ' + (x * 100).toFixed(2) + '% เทียบคูปอง ' + c.toFixed(1) + '% ภาษีช่วยลดเหลือ ' + (x * (1 - t / 100) * 100).toFixed(2) + '%';
  });
  G.drill($('g-drill-kd'), { gen: function () {
    var c = rnd(6, 12), p = rnd(90, 105) * 10, n = pick([10, 15, 20, 25]), t = pick([30, 40]), Nd = p - 20, a = approx(Nd, c * 10, 1000, n) * 100;
    return { q: 'หุ้นกู้พาร์ <b>1,000</b> คูปอง <b>' + c + '%</b> อายุ <b>' + n + '</b> ปี ขายได้ <b>' + p + '</b> ค่าใช้จ่ายออก <b>20</b> บาท ภาษี <b>' + t + '%</b> (ใช้สูตรประมาณ)', fields: [{ label: 'Nd', ans: Nd, tol: 0.5 }, { label: 'kd', ans: a, tol: 0.03, unit: '%', show: p2(a) }, { label: 'ki', ans: a * (1 - t / 100), tol: 0.03, unit: '%', show: p2(a * (1 - t / 100)) }], why: 'kd = [' + c * 10 + ' + (1,000 − ' + Nd + ')/' + n + '] ÷ [(1,000 + ' + Nd + ')/2] = ' + p2(a) + '%  ki = kd × (1 − ' + t + '%)' };
  } });
  G.drill($('g-drill-kp'), { gen: function () {
    var P = rnd(5, 12) * 10, D = Math.round(P * rnd(8, 12)) / 100, F = rnd(1, 6), k = D / (P - F) * 100;
    return { q: 'หุ้นบุริมสิทธิ์จ่ายปันผล <b>' + D.toFixed(2) + '</b> บาท ขาย <b>' + P + '</b> บาท ค่าใช้จ่ายในการออก <b>' + F + '</b> บาทต่อหุ้น', fields: [{ label: 'kp', ans: k, tol: 0.03, unit: '%', show: p2(k) }], why: D.toFixed(2) + " ÷ (" + P + ' − ' + F + ') = ' + p2(k) + '%' };
  } });
  G.match($('g-tax'), { pairs: [
    ['ดอกเบี้ยจ่ายหักภาษีได้', 'ต้นทุนหนี้ ปรับด้วย (1 − T)'], ['เงินปันผลไม่ใช่ค่าใช้จ่ายทางภาษี', 'ต้นทุนหุ้นบุริมสิทธิ์ ไม่ปรับภาษี'],
    ['ผลตอบแทนที่ผู้ถือหุ้นต้องการ', 'ต้นทุนหุ้นสามัญ ไม่ปรับภาษี'], ['ต้นทุนเท่ากับหุ้นสามัญ ไม่มีค่าใช้จ่ายออก', 'ต้นทุนกำไรสะสม']
  ] });
  G.drill($('g-drill-gd'), { gen: function () {
    var P = rnd(2, 10) * 10, g = rnd(2, 10), D = Math.round(P * rnd(3, 6)) / 100, k = D / P * 100 + g;
    return { q: 'ราคาหุ้น <b>' + P + '</b> ปันผลปีหน้า D₁ = <b>' + D.toFixed(2) + '</b> ปันผลโต <b>' + g + '%</b> ต่อปีคงที่', fields: [{ label: 'ks', ans: k, tol: 0.03, unit: '%', show: p2(k) }], why: D.toFixed(2) + ' ÷ ' + P + ' + ' + g + '% = ' + p2(k) + '%' };
  } });
  G.drill($('g-drill-cp'), { gen: function () {
    var rf = rnd(2, 8), km = rf + rnd(3, 9), b = pick([0.6, 0.8, 1, 1.2, 1.5, 1.8]), k = rf + b * (km - rf);
    return { q: 'kRF = <b>' + rf + '%</b> kM = <b>' + km + '%</b> เบต้า = <b>' + b + '</b>', fields: [{ label: 'ks', ans: k, tol: 0.03, unit: '%', show: p2(k) }], why: rf + '% + ' + b + ' × (' + km + '% − ' + rf + '%) = ' + p2(k) + '%' };
  } });
  G.range(['ke-d', 'ke-g', 'ke-p', 'ke-r', 'ke-m', 'ke-b'], function (d0, g, p, rf, mp, b) {
    $('ke-do').textContent = d0.toFixed(2); $('ke-go').textContent = g.toFixed(1) + '%'; $('ke-po').textContent = p; $('ke-ro').textContent = rf.toFixed(1) + '%'; $('ke-mo').textContent = mp.toFixed(1) + '%'; $('ke-bo').textContent = b.toFixed(2);
    var gd = d0 * (1 + g / 100) / p * 100 + g, cp = rf + b * mp;
    $('ke-gd').textContent = gd.toFixed(2) + '%'; $('ke-cp').textContent = cp.toFixed(2) + '%'; $('ke-df').textContent = (gd - cp).toFixed(2);
    var v = $('ke-vd'); v.className = 'verdict ok';
    v.textContent = Math.abs(gd - cp) < 0.5 ? 'สองวิธีให้ผลใกล้เคียงกัน' : 'ผลต่างกัน ' + Math.abs(gd - cp).toFixed(2) + ' จุด เพราะสมมติฐานต่างกัน (ปันผลโตคงที่ เทียบความเสี่ยงที่เป็นระบบ)';
  });
  G.drill($('g-drill-ns'), { gen: function () {
    var P = rnd(3, 10) * 10, F = pick([5, 8, 10, 12]), g = rnd(2, 8), D = Math.round(P * rnd(3, 6)) / 100, k = D / (P * (1 - F / 100)) * 100 + g;
    return { q: 'ขายหุ้นใหม่ราคา <b>' + P + '</b> ค่าใช้จ่ายออก <b>' + F + '%</b> ปันผลปีหน้า <b>' + D.toFixed(2) + '</b> โต <b>' + g + '%</b>', fields: [{ label: 'ks*', ans: k, tol: 0.03, unit: '%', show: p2(k) }], why: D.toFixed(2) + ' ÷ (' + P + ' × ' + (1 - F / 100).toFixed(2) + ') + ' + g + '% = ' + p2(k) + '%' };
  } });
  G.sort($('g-kr'), {
    buckets: [{ id: 'k', label: 'ks / kr (ไม่มีค่าใช้จ่ายออก)' }, { id: 's', label: 'ks* (หุ้นใหม่)' }],
    items: [
      { t: 'ต้นทุนของกำไรสะสม', b: 'k', why: 'kr = ks' }, { t: 'ต้องจ่ายค่าเตรียมเอกสารและค่าประกันการจำหน่าย', b: 's', why: 'Flotation cost' },
      { t: 'D₁ ÷ P₀ + g', b: 'k', why: 'สูตร Gordon ปกติ' }, { t: 'D₁ ÷ [P₀(1 − F)] + g', b: 's', why: 'ปรับด้วยค่าใช้จ่ายออก' },
      { t: 'ต้นทุนสูงกว่า ks เสมอ (เมื่อ F > 0)', b: 's', why: 'เงินสุทธิน้อยลง' }, { t: 'ใช้ก่อน เมื่อมีกำไรสะสมเหลือ', b: 'k', why: 'ถูกกว่าหุ้นใหม่' }
    ]
  });
  G.range(['wc-d', 'wc-p', 'wc-k', 'wc-t', 'wc-q', 'wc-s'], function (d, p, kd, t, kp, ks) {
    $('wc-do').textContent = d + '%'; $('wc-po').textContent = p + '%'; $('wc-ko').textContent = kd.toFixed(2) + '%'; $('wc-to').textContent = t + '%'; $('wc-qo').textContent = kp.toFixed(2) + '%'; $('wc-so').textContent = ks.toFixed(2) + '%';
    var e = 100 - d - p, ki = kd * (1 - t / 100), w = (d * ki + p * kp + e * ks) / 100;
    $('wc-e').textContent = e + '%'; $('wc-i').textContent = ki.toFixed(2) + '%'; $('wc-w').textContent = e < 0 ? '—' : w.toFixed(2) + '%';
    var v = $('wc-vd');
    if (e < 0) { v.className = 'verdict bad'; v.textContent = 'หนี้ + บุริมสิทธิ์ เกิน 100% ลดสัดส่วนลง'; $('wc-chart').innerHTML = ''; return; }
    v.className = 'verdict ok';
    var parts = [['หนี้', d * ki / 100, '#B4412E'], ['บุริมสิทธิ์', p * kp / 100, '#C9A400'], ['หุ้นสามัญ', e * ks / 100, '#7B4AA0']], x = 20, s = '<svg class="chart" viewBox="0 0 640 90" role="img" aria-label="องค์ประกอบ WACC">';
    parts.forEach(function (q) { var ww = w > 0 ? q[1] / w * 600 : 0; if (ww > 0) s += '<rect x="' + x + '" y="15" width="' + ww + '" height="34" fill="' + q[2] + '"/><text x="' + (x + 6) + '" y="37" font-size="12" fill="#fff">' + q[0] + ' ' + q[1].toFixed(2) + '</text>'; x += ww; });
    $('wc-chart').innerHTML = s + '<text x="20" y="75" font-size="12" fill="#12332B">แถบแสดงส่วนที่แต่ละแหล่งมีต่อ WACC รวม ' + w.toFixed(2) + '%</text></svg>';
    v.textContent = 'WACC = ' + w.toFixed(2) + '% ถ้าเพิ่มสัดส่วนหนี้ (ต้นทุนหลังภาษีต่ำกว่า) WACC จะลดลงในการคำนวณนี้ แต่ความเสี่ยงทางการเงินจะสูงขึ้น';
  });
  G.drill($('g-drill-wc'), { gen: function () {
    var d = pick([20, 30, 40]), p = pick([0, 10]), e = 100 - d - p, kd = pick([8, 9, 10, 12]), t = pick([30, 40]), kp = pick([9, 10, 11]), ks = pick([12, 13, 14, 15]), ki = kd * (1 - t / 100), w = (d * ki + p * kp + e * ks) / 100;
    return { q: 'หนี้ <b>' + d + '%</b> (kd ก่อนภาษี <b>' + kd + '%</b> ภาษี <b>' + t + '%</b>) บุริมสิทธิ์ <b>' + p + '%</b> (kp <b>' + kp + '%</b>) หุ้นสามัญ <b>' + e + '%</b> (ks <b>' + ks + '%</b>)', fields: [{ label: 'ki', ans: ki, tol: 0.03, unit: '%', show: p2(ki) }, { label: 'WACC', ans: w, tol: 0.03, unit: '%', show: p2(w) }], why: 'ki = ' + kd + ' × ' + (1 - t / 100).toFixed(2) + ' = ' + p2(ki) + '  WACC = ' + p2(w) + '%' };
  } });
  G.quiz($('g-q8'), { questions: [
    { q: 'หุ้นกู้พาร์ 1,000 ขายได้ 950 ค่าใช้จ่าย 20 Nd เท่าใด', o: ['930', '950', '1,000', '970'], a: 0, why: '950 − 20' },
    { q: 'kd = 10% ภาษี 30% ki เท่าใด', o: ['7%', '10%', '3%', '13%'], a: 0, why: '10% × 0.70' },
    { q: 'ต้นทุนหุ้นบุริมสิทธิ์ต้องปรับภาษีหรือไม่', o: ['ไม่ต้อง เพราะปันผลไม่หักภาษี', 'ต้อง', 'ต้องเฉพาะกำไรสะสม'], a: 0, why: 'เงินปันผลไม่ใช่ค่าใช้จ่ายทางภาษี' },
    { q: 'P₀ = 40 D₁ = 2 g = 6% ks เท่าใด', o: ['11%', '5%', '6%', '16%'], a: 0, why: '2/40 + 6%' },
    { q: 'kRF 6% kM 12% β 0.8 ks จาก CAPM', o: ['10.8%', '12%', '9.6%', '6.8%'], a: 0, why: '6% + 0.8 × 6%' },
    { q: 'ต้นทุนกำไรสะสมเมื่อเทียบกับ ks', o: ['เท่ากัน', 'ต่ำกว่า เพราะไม่มีต้นทุน', 'สูงกว่า'], a: 0, why: 'kr = ks' },
    { q: 'หนี้ 30% (ki 6%) หุ้นสามัญ 70% (ks 14%) WACC', o: ['11.6%', '10%', '12.4%', '8.8%'], a: 0, why: '0.3 × 6 + 0.7 × 14' },
    { q: 'ทำไมหุ้นสามัญออกใหม่ต้นทุนสูงกว่ากำไรสะสม', o: ['มีค่าใช้จ่ายในการออก', 'เสียภาษี', 'ผลตอบแทนต่ำกว่า'], a: 0, why: 'ได้เงินสุทธิน้อยลง' }
  ] });
})();
