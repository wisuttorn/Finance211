/* Chapter 6: Cash, receivables, inventory */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var r2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var nf = function (v) { return G.fmt(Math.round(v), 0); };
  var nd = function (v, d) { return G.fmt(v, d); };
  var pick = function (a) { return a[rnd(0, a.length - 1)]; };

  G.tally($('g-poll'), { options: ['ฝากธนาคารไว้ก่อน', 'ลงทุนหลักทรัพย์ระยะสั้น', 'จ่ายเจ้าหนี้ก่อนกำหนด', 'เก็บไว้เป็นเงินสดสำรอง'] });
  G.sort($('g-cyc'), {
    buckets: [{ id: 's', label: 'ทำให้วงจรเงินสดสั้นลง' }, { id: 'l', label: 'ทำให้วงจรเงินสดยาวขึ้น' }],
    items: [
      { t: 'เร่งเก็บหนี้จากลูกหนี้', b: 's', why: 'ลด ACP' }, { t: 'ขายสินค้าให้หมุนเร็วขึ้น', b: 's', why: 'ลด AAI' }, { t: 'ชะลอการจ่ายเจ้าหนี้ (โดยไม่เสียความน่าเชื่อถือ)', b: 's', why: 'เพิ่ม APP' },
      { t: 'ให้เครดิตลูกค้านานขึ้น', b: 'l', why: 'เพิ่ม ACP' }, { t: 'สต็อกสินค้าเพิ่มเกินจำเป็น', b: 'l', why: 'เพิ่ม AAI' }, { t: 'จ่ายเจ้าหนี้เร็วขึ้น', b: 'l', why: 'ลด APP' }
    ]
  });
  G.quiz($('g-float'), { questions: [
    { q: 'Negative float สำหรับผู้ขายคือ', o: ['เวลาที่ต้องรอรับเงินจากลูกค้า', 'เวลาที่ผู้ขายจ่ายเงินล่วงหน้า', 'ส่วนลดเงินสด'], a: 0, why: 'เงินยังไม่เข้าบัญชีผู้ขาย เสียโอกาสนำเงินไปใช้' },
    { q: 'Lock-box ช่วยอะไรเป็นหลัก', o: ['ลด mailing และ processing float', 'เพิ่มหนี้สูญ', 'ยืดเวลาจ่ายเจ้าหนี้'], a: 0, why: 'เช็คเข้าบัญชีเร็วขึ้น' }
  ] });
  var kk = function (T, F, k) { return Math.sqrt(2 * F * T / k); };
  G.range(['bm-t', 'bm-f', 'bm-k'], function (T, F, k) {
    $('bm-to').textContent = nf(T); $('bm-fo').textContent = F; $('bm-ko').textContent = k.toFixed(2) + '%';
    var kr = k / 100, C = kk(T, F, kr), h = kr * C / 2, x = F * T / C;
    $('bm-c').textContent = nf(C); $('bm-n').textContent = nd(T / C, 2); $('bm-h').textContent = nf(h); $('bm-x').textContent = nf(x); $('bm-s').textContent = nf(h + x);
    var v = $('bm-vd'); v.className = 'verdict ok';
    v.textContent = 'ที่จุดต่ำสุด ต้นทุนถือเงินสด (' + nf(h) + ') เท่ากับต้นทุนแปลงหลักทรัพย์ (' + nf(x) + ') ดอกเบี้ยสูงขึ้นจะถือเงินสดน้อยลง ค่าแปลงสูงขึ้นจะแปลงครั้งละมากขึ้น';
  });
  G.drill($('g-drill-bau'), { gen: function () {
    var T = rnd(2, 10) * 100000, F = rnd(5, 20) * 10, k = pick([0.005, 0.01, 0.02]), C = kk(T, F, k);
    return { q: 'ใช้เงินสด <b>' + nf(T) + '</b> ต่อเดือน ค่าแปลง <b>' + F + '</b> ต่อครั้ง ผลตอบแทน <b>' + (k * 100).toFixed(1) + '%</b> ต่อเดือน', fields: [{ label: 'C*', ans: C, tol: 1, show: nf(C) }, { label: 'จำนวนครั้งต่อเดือน', ans: T / C, tol: 0.02, show: r2(T / C) }], why: 'C* = √(2 × ' + F + ' × ' + nf(T) + ' ÷ ' + k + ') = ' + nf(C) + '  ครั้ง = ' + nf(T) + ' ÷ ' + nf(C) + ' = ' + r2(T / C) };
  } });
  var zz = function (F, v, i) { return Math.pow(3 * F * v / (4 * i), 1 / 3); };
  G.range(['mo-l', 'mo-f', 'mo-v', 'mo-i'], function (L, F, v, i) {
    $('mo-lo').textContent = nf(L); $('mo-fo').textContent = F; $('mo-vo').textContent = nf(v); $('mo-io').textContent = i.toFixed(2) + '%';
    var Z = zz(F, v, i / 100), U = L + 3 * Z, C = L + Z, A = (4 * C - L) / 3;
    $('mo-z').textContent = nf(Z); $('mo-u').textContent = nf(U); $('mo-c').textContent = nf(C); $('mo-a').textContent = nf(A);
    var d = $('mo-vd'); d.className = 'verdict ok';
    d.textContent = 'ถือเงินสดระหว่าง ' + nf(L) + ' ถึง ' + nf(U) + ' เมื่อถึงขอบให้ปรับกลับที่ ' + nf(C) + ' ความผันผวนสูงขึ้นทำให้ช่วงกว้างขึ้น';
  });
  G.drill($('g-drill-mo'), { gen: function () {
    var L = rnd(5, 20) * 10000, F = rnd(2, 10) * 100, v = rnd(10, 40) * 1000, i = pick([0.001, 0.002, 0.004]), Z = zz(F, v, i);
    return { q: 'L = <b>' + nf(L) + '</b> F = <b>' + F + '</b> σ<sup>2</sup> = <b>' + nf(v) + '</b> i = <b>' + (i * 100).toFixed(1) + '%</b> ต่อวัน', fields: [{ label: 'Z', ans: Z, tol: 1, show: nf(Z) }, { label: 'U', ans: L + 3 * Z, tol: 3, show: nf(L + 3 * Z) }], why: 'Z = [3 × ' + F + ' × ' + nf(v) + ' ÷ (4 × ' + i + ')]<sup>1/3</sup> = ' + nf(Z) + '  U = L + 3Z = ' + nf(L + 3 * Z) };
  } });
  G.match($('g-sec'), { pairs: [
    ['รัฐบาลออกเพื่อกู้ระยะสั้น เสี่ยงต่ำมาก', 'ตั๋วเงินคลัง'],
    ['ธนาคารรับรองการจ่ายเงินในการค้า', 'Banker\'s acceptance'],
    ['บริษัทใหญ่ออกตราสารหนี้ระยะสั้นไม่มีหลักประกัน', 'Commercial paper'],
    ['ขายหลักทรัพย์พร้อมสัญญาซื้อคืน', 'Repurchase agreement'],
    ['รวมเงินลงทุนในตราสารตลาดเงินหลายชนิด', 'Money market fund']
  ] });
  G.sort($('g-cr'), {
    buckets: [{ id: 'b', label: 'ผลประโยชน์' }, { id: 'c', label: 'ต้นทุน' }],
    items: [
      { t: 'ยอดขายเพิ่มขึ้น', b: 'b', why: 'ขายเชื่อดึงลูกค้าเพิ่ม' }, { t: 'กำไรส่วนเกินต่อหน่วย (P − VC) × หน่วยที่เพิ่ม', b: 'b', why: 'คือผลประโยชน์ที่วัดได้' },
      { t: 'ต้นทุนเงินลงทุนในลูกหนี้', b: 'c', why: 'เงินจมอยู่กับลูกหนี้' }, { t: 'หนี้สูญ', b: 'c', why: 'ลูกหนี้บางส่วนไม่ชำระ' }, { t: 'ส่วนลดเงินสด', b: 'c', why: 'ลดรายรับที่เก็บได้' }, { t: 'ค่าบริหารและติดตามหนี้', b: 'c', why: 'ต้นทุนดำเนินการ' }
    ]
  });
  G.drill($('g-drill-ar'), { gen: function () {
    var vc = rnd(3, 9), u = rnd(20, 100) * 1000, acp = pick([15, 30, 45, 60, 90]), a = vc * u / (360 / acp);
    return { q: 'ต้นทุนผันแปร <b>' + vc + '</b> ต่อหน่วย ขาย <b>' + nf(u) + '</b> หน่วย ระยะเก็บเงิน <b>' + acp + '</b> วัน (ปี 360 วัน)', fields: [{ label: 'เงินลงทุนใน A/R', ans: a, tol: 1, show: nf(a) }], why: nf(vc * u) + ' ÷ (360/' + acp + ') = ' + nf(a) };
  } });
  /* credit lab */
  var U0 = 60000, P = 10, V = 6, K = 0.15;
  G.range(['cl-u', 'cl-a', 'cl-b', 'cl-d', 'cl-t'], function (du, acp, bd, dc, tk) {
    $('cl-uo').textContent = du + '%'; $('cl-ao').textContent = acp + ' วัน'; $('cl-bo').textContent = bd.toFixed(1) + '%'; $('cl-do').textContent = dc.toFixed(1) + '%'; $('cl-to').textContent = tk + '%';
    var U1 = U0 * (1 + du / 100), g = (U1 - U0) * (P - V), a0 = V * U0 / (360 / 30), a1 = V * U1 / (360 / acp), ar = K * (a1 - a0),
      b = bd / 100 * U1 * P - 0.01 * U0 * P, ds = dc / 100 * tk / 100 * U1 * P, n = g - ar - b - ds;
    $('cl-g').textContent = nd(g, 1); $('cl-r').textContent = nd(ar, 1); $('cl-bd').textContent = nd(b, 1); $('cl-ds').textContent = nd(ds, 1); $('cl-n').textContent = nd(n, 1);
    var v = $('cl-vd'); v.className = 'verdict ' + (n > 0 ? 'ok' : 'bad');
    v.textContent = n > 0 ? 'กำไรสุทธิ +' + nd(n, 1) + ' คุ้มที่จะเปลี่ยนเงื่อนไข' : 'กำไรสุทธิ ' + nd(n, 1) + ' ไม่คุ้มที่จะเปลี่ยนเงื่อนไข';
  });
  function preset(id, vals) { $(id).addEventListener('click', function () { ['cl-u', 'cl-a', 'cl-b', 'cl-d', 'cl-t'].forEach(function (k, i) { var e = $(k); e.value = vals[i]; e.dispatchEvent(new Event('input', { bubbles: true })); }); }); }
  preset('cl-p1', [5, 45, 2, 0, 0]); preset('cl-p2', [5, 15, 0.5, 2, 60]);
  G.match($('g-5c'), { pairs: [
    ['ประวัติและเจตนาชำระหนี้ของลูกค้า', 'Character'], ['ความสามารถชำระหนี้จากรายได้และกระแสเงินสด', 'Capacity'],
    ['ฐานะการเงินและส่วนของเจ้าของ', 'Capital'], ['ทรัพย์สินที่ใช้ค้ำประกัน', 'Collateral'], ['สภาวะเศรษฐกิจและอุตสาหกรรม', 'Conditions']
  ] });
  G.order($('g-col'), { items: ['ส่งใบแจ้งหนี้ตามกำหนด', 'ส่งหนังสือหรือโทรเตือนเมื่อเกินกำหนด', 'เจรจาขอให้ชำระหรือผ่อนชำระ', 'ส่งให้ผู้เชี่ยวชาญหรือทนายติดตามหนี้', 'ตัดเป็นหนี้สูญเมื่อติดตามไม่ได้'] });
  G.sort($('g-inv'), {
    buckets: [{ id: 'u', label: 'เพิ่มขึ้น' }, { id: 'd', label: 'ลดลง' }],
    items: [
      { t: 'ต้นทุนเก็บรักษารวมต่อปี', b: 'u', why: 'สต็อกเฉลี่ย Q/2 มากขึ้น' }, { t: 'ความเสี่ยงสินค้าล้าสมัย', b: 'u', why: 'ถือสินค้านานขึ้น' },
      { t: 'จำนวนครั้งที่สั่งซื้อต่อปี', b: 'd', why: 'S ÷ Q ลดลง' }, { t: 'ต้นทุนสั่งซื้อรวมต่อปี', b: 'd', why: 'สั่งน้อยครั้งลง' }
    ]
  });
  var tcost = function (S, O, C, Q) { return C * Q / 2 + O * S / Q; };
  G.range(['eq-s', 'eq-o', 'eq-c', 'eq-q'], function (S, O, C, Q) {
    $('eq-so').textContent = nf(S); $('eq-oo').textContent = O; $('eq-co').textContent = C.toFixed(1); $('eq-qo').textContent = nf(Q);
    var E = Math.sqrt(2 * S * O / C);
    $('eq-e').textContent = nf(E); $('eq-n').textContent = nd(S / E, 1); $('eq-t').textContent = nf(tcost(S, O, C, E)); $('eq-x').textContent = nf(tcost(S, O, C, Q));
    var mx = 3 * E, pts = [], pts2 = [], i, q, W = 600, Hh = 150;
    var top = tcost(S, O, C, E * 0.35), X = function (q) { return 30 + q / mx * W; }, Y = function (v) { return Hh - 10 - Math.min(1, v / top) * (Hh - 30); };
    for (i = 0; i <= 60; i++) { q = Math.max(E * 0.35, mx * i / 60); pts.push(X(q).toFixed(1) + ',' + Y(tcost(S, O, C, q)).toFixed(1)); }
    $('eq-chart').innerHTML = '<svg class="chart" viewBox="0 0 660 160" role="img" aria-label="ต้นทุนรวมตามปริมาณสั่งซื้อ"><polyline fill="none" stroke="#7B4AA0" stroke-width="3" points="' + pts.join(' ') + '"/><line x1="' + X(E) + '" y1="10" x2="' + X(E) + '" y2="' + (Hh - 10) + '" stroke="#2BA6A0" stroke-dasharray="4"/><text x="' + (X(E) + 6) + '" y="24" font-size="12" fill="#12332B">EOQ ' + nf(E) + '</text>' + (Q <= mx ? '<circle cx="' + X(Q) + '" cy="' + Y(tcost(S, O, C, Q)) + '" r="6" fill="#B4412E"/>' : '') + '</svg>';
    var v = $('eq-vd'); v.className = 'verdict ok';
    v.textContent = Math.abs(Q - E) < E * 0.05 ? 'ใกล้ EOQ ต้นทุนรวมต่ำสุด' : 'สั่งครั้งละ ' + nf(Q) + ' ต้นทุนรวมสูงกว่า EOQ อยู่ ' + nf(tcost(S, O, C, Q) - tcost(S, O, C, E));
  });
  G.drill($('g-drill-eoq'), { gen: function () {
    var m = rnd(2, 12), O = pick([50, 100, 200]), C = rnd(1, 5), S = 5000 * m * m * C / O, E = 100 * m;
    return { q: 'ความต้องการ <b>' + nf(S) + '</b> หน่วยต่อปี ค่าสั่งซื้อ <b>' + O + '</b> ต่อครั้ง ค่าเก็บรักษา <b>' + C + '</b> ต่อหน่วยต่อปี', fields: [{ label: 'EOQ', ans: E, tol: 1, unit: 'หน่วย', show: nf(E) }, { label: 'สั่งปีละ', ans: S / E, tol: 0.1, unit: 'ครั้ง', show: nd(S / E, 1) }], why: '√(2 × ' + nf(S) + ' × ' + O + ' ÷ ' + C + ') = ' + nf(E) };
  } });
  G.drill($('g-drill-rop'), { gen: function () {
    var d = rnd(4, 30) * 10, LT = rnd(1, 4), SS = rnd(0, 20) * 10, S = d * 50, rop = LT * d + SS;
    return { q: 'ต้องการ <b>' + nf(S) + '</b> หน่วยต่อปี เปิด <b>50</b> สัปดาห์ LT <b>' + LT + '</b> สัปดาห์ SS <b>' + SS + '</b>', fields: [{ label: 'd', ans: d, tol: 0.5, unit: 'ต่อสัปดาห์' }, { label: 'ROP', ans: rop, tol: 0.5, unit: 'หน่วย' }], why: 'd = ' + nf(S) + ' ÷ 50 = ' + d + '  ROP = ' + LT + ' × ' + d + ' + ' + SS + ' = ' + rop };
  } });
  G.quiz($('g-q6'), { questions: [
    { q: 'AAI 50 ACP 60 APP 30 วงจรเงินสดเท่าใด', o: ['80 วัน', '140 วัน', '110 วัน', '20 วัน'], a: 0, why: '50 + 60 − 30 = 80' },
    { q: 'T = 900,000 F = 100 k = 1% ต่อเดือน C* เท่าใด', o: ['134,164', '90,000', '300,000', '67,082'], a: 0, why: '√(2 × 100 × 900,000 ÷ 0.01) = 134,164' },
    { q: 'Miller-Orr: L = 50,000 Z = 2,000 ค่า U เท่าใด', o: ['56,000', '52,000', '54,000', '58,000'], a: 0, why: 'S = 6,000 U = 50,000 + 6,000' },
    { q: 'เงินลงทุนใน A/R 200,000 ต้นทุนเงิน 12% ต้นทุนเงินลงทุนเท่าใด', o: ['24,000', '12,000', '2,400', '16,667'], a: 0, why: '200,000 × 12%' },
    { q: 'ถ้ากำไรสุทธิจากการเปลี่ยนเงื่อนไขสินเชื่อเป็นบวก', o: ['ควรเปลี่ยนนโยบาย', 'ไม่ควรเปลี่ยน', 'ต้องเพิ่มหนี้สูญ'], a: 0, why: 'ผลประโยชน์มากกว่าต้นทุน' },
    { q: 'S = 8,000 O = 100 C = 4 EOQ เท่าใด', o: ['632', '400', '894', '200'], a: 0, why: '√(2 × 8,000 × 100 ÷ 4) = 632' },
    { q: 'ความต้องการ 5,200 ต่อปี 52 สัปดาห์ LT 3 SS 150 ROP เท่าใด', o: ['450', '300', '150', '350'], a: 0, why: 'd = 100 ROP = 300 + 150' },
    { q: 'Lock-box ลด float 2 วัน รับเช็ควันละ 500,000 ปลดเงินเท่าใด', o: ['1,000,000', '500,000', '250,000', '2,000,000'], a: 0, why: '2 × 500,000' }
  ] });
})();
/*XTRA-START*/
(function(){var G=Games,$=function(i){return document.getElementById(i)};var rnd=function(a,b){return a+Math.floor(Math.random()*(b-a+1))};var pick=function(a){return a[rnd(0,a.length-1)]};var d1=function(v){return (Math.round(v*10)/10).toFixed(1)};var d2=function(v){return (Math.round(v*100)/100).toFixed(2)};var nf=function(v){return G.fmt(Math.round(v),0)};
})();
/*XTRA-END*/
