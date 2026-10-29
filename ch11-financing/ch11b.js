/* Chapter 11: Financing */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var pick = function (a) { return a[rnd(0, a.length - 1)]; };
  var nf = function (v) { return G.fmt(Math.round(v), 0); };
  var d2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var d3 = function (v) { return (Math.round(v * 1000) / 1000).toFixed(3); };
  var pm = function (P, i, n) { return i === 0 ? P / n : P * i / (1 - Math.pow(1 + i, -n)); };
  var bond = function (c, y, n) { var s = 0, t; for (t = 1; t <= n; t++) s += 1000 * c / Math.pow(1 + y, t); return s + 1000 / Math.pow(1 + y, n); };
  var tcost = function (cd, n) { return cd / (1 - cd) * 360 / n * 100; };

  G.tally($('g-poll'), { options: ['เงินเก็บส่วนตัว', 'เพื่อนและญาติ', 'กู้ธนาคาร', 'หา Angel หรือ VC'] });
  G.sort($('g-term'), {
    buckets: [{ id: 's', label: 'ระยะสั้น (≤ 1 ปี)' }, { id: 'm', label: 'ระยะปานกลาง (1–5 ปี)' }, { id: 'l', label: 'ระยะยาว (> 5 ปี)' }],
    items: [
      { t: 'สินเชื่อการค้า (Trade credit)', b: 's', why: 'ชำระภายในไม่กี่สิบวัน' }, { t: 'ตราสารพาณิชย์', b: 's', why: 'ตั๋วสัญญาใช้เงินระยะสั้น' }, { t: 'ค่าใช้จ่ายค้างจ่าย', b: 's', why: 'แหล่งเงินอัตโนมัติระยะสั้น' },
      { t: 'เช่าซื้ออุปกรณ์ 36–60 เดือน', b: 'm', why: '3–5 ปี' }, { t: 'Venture Capital', b: 'm', why: 'จัดเป็นแหล่งระยะปานกลางตามเนื้อหา' },
      { t: 'หุ้นกู้อายุ 10 ปี', b: 'l', why: 'เกิน 5 ปี' }, { t: 'กำไรสะสม', b: 'l', why: 'แหล่งภายในระยะยาว' }, { t: 'หุ้นสามัญ', b: 'l', why: 'ส่วนของทุนไม่มีกำหนดคืน' }
    ]
  });
  G.sort($('g-de'), {
    buckets: [{ id: 'd', label: 'หนี้สิน' }, { id: 'e', label: 'ส่วนของเจ้าของ' }],
    items: [
      { t: 'ดอกเบี้ยคงที่ตามสัญญา', b: 'd', why: 'ภาระคงที่' }, { t: 'ดอกเบี้ยจ่ายลดภาษีได้', b: 'd', why: 'เป็นค่าใช้จ่ายทางภาษี' }, { t: 'ได้รับชำระก่อนเมื่อเลิกกิจการ', b: 'd', why: 'ลำดับเรียกร้องสูงกว่า' },
      { t: 'ผู้ถือมีสิทธิออกเสียงควบคุมกิจการ', b: 'e', why: 'ผู้ถือหุ้นสามัญเป็นเจ้าของ' }, { t: 'เงินปันผลไม่ลดภาษี', b: 'e', why: 'ไม่ใช่ค่าใช้จ่าย' }, { t: 'ไม่ต้องจ่ายคืนต้น', b: 'e', why: 'ไม่มีกำหนดไถ่ถอน' }, { t: 'เพิ่มความเสี่ยงทางการเงิน (Financial leverage)', b: 'd', why: 'ภาระคงที่ทำให้กำไรผันผวน' }
    ]
  });
  function eps(e, r, t) { var a = (e - 5000000 * r / 100) * (1 - t / 100) / 1000000, b = e * (1 - t / 100) / 1500000; return [a, b]; }
  G.drill($('g-drill-eps'), { gen: function () {
    var e = pick([1, 1.5, 2, 2.5, 3]) * 1000000, r = pick([6, 8, 10]), x = eps(e, r, 20);
    return { q: 'EBIT <b>' + nf(e) + '</b> ภาษี 20% หุ้นเดิม 1,000,000 · แผน A กู้ 5,000,000 ดอกเบี้ย <b>' + r + '%</b> · แผน B ออกหุ้นใหม่ 500,000 หุ้น', fields: [{ label: 'EPS แผน A', ans: x[0], tol: 0.005, show: d2(x[0]) }, { label: 'EPS แผน B', ans: x[1], tol: 0.005, show: d2(x[1]) }], why: 'A = (' + nf(e) + ' − ' + nf(5000000 * r / 100) + ') × 0.8 ÷ 1,000,000 = ' + d2(x[0]) + ' · B = ' + nf(e) + ' × 0.8 ÷ 1,500,000 = ' + d2(x[1]) + (x[0] > x[1] ? ' แผนกู้ดีกว่า' : ' แผนออกหุ้นดีกว่า') };
  } });
  G.range(['ep-e', 'ep-r', 'ep-t'], function (e, r, t) {
    $('ep-eo').textContent = nf(e); $('ep-ro').textContent = r.toFixed(1) + '%'; $('ep-to').textContent = t + '%';
    var x = eps(e, r, t), I = 5000000 * r / 100, be = 3 * I; /* 1.5(E-I)=E -> E=3I */
    $('ep-a').textContent = d2(x[0]); $('ep-b').textContent = d2(x[1]); $('ep-x').textContent = nf(be); $('ep-w').textContent = x[0] > x[1] ? 'A (กู้)' : (x[0] < x[1] ? 'B (ออกหุ้น)' : 'เท่ากัน');
    var v = $('ep-vd'); v.className = 'verdict ok';
    v.textContent = e > be ? 'EBIT สูงกว่าจุดเสมอ ' + nf(be) + ' การกู้ให้ EPS สูงกว่า (Financial leverage ช่วย)' : 'EBIT ต่ำกว่าจุดเสมอ ' + nf(be) + ' การออกหุ้นให้ EPS สูงกว่า (ภาระดอกเบี้ยกดกำไร)';
  });
  G.drill($('g-drill-tc'), { gen: function () {
    var cd = pick([1, 2, 3]), dd = pick([10, 15]), nd = pick([30, 45, 60]), n = nd - dd, c = tcost(cd / 100, n);
    return { q: 'เงื่อนไข <b>' + cd + '/' + dd + ', n/' + nd + '</b>', fields: [{ label: 'n (วันที่ยืดชำระ)', ans: n, tol: 0.01 }, { label: 'ต้นทุนไม่รับส่วนลด', ans: c, tol: 0.01, unit: '%', show: d2(c) }], why: 'n = ' + nd + ' − ' + dd + ' = ' + n + ' · (' + cd / 100 + ' ÷ ' + (1 - cd / 100).toFixed(2) + ') × (360 ÷ ' + n + ') = ' + d2(c) + '%' };
  } });
  G.range(['tl-c', 'tl-d', 'tl-n', 'tl-b'], function (c, dd, nn, b) {
    $('tl-co').textContent = c.toFixed(1) + '%'; $('tl-do').textContent = dd + ' วัน'; $('tl-no').textContent = nn + ' วัน'; $('tl-bo').textContent = b + '%';
    var n = nn - dd, cost = tcost(c / 100, n);
    $('tl-x').textContent = n + ' วัน'; $('tl-s').textContent = d2(cost) + '%'; $('tl-m').textContent = d2(cost - b) + ' จุด';
    var v = $('tl-vd'); v.className = 'verdict ' + (cost > b ? 'ok' : 'bad');
    v.textContent = cost > b ? 'ต้นทุนการไม่รับส่วนลดสูงกว่าดอกเบี้ยธนาคาร ควรกู้มาจ่ายเร็วเพื่อรับส่วนลด' : 'ต้นทุนการไม่รับส่วนลดต่ำกว่าดอกเบี้ยธนาคาร ไม่ควรกู้มาจ่ายเร็ว (จ่ายวันครบกำหนดดีกว่า)';
  });
  G.match($('g-loan'), { pairs: [['Transaction Loan', 'กู้เฉพาะโครงการ ระบุเวลาและดอกเบี้ย'], ['Line of Credit', 'ข้อตกลงไม่เป็นทางการ ธนาคารกำหนดวงเงินสูงสุด'], ['Revolving Credit', 'ข้อตกลงเป็นทางการ มีค่าธรรมเนียมผูกพันเงินกู้'], ['Commitment Fee', 'คิดจากวงเงินที่ยังไม่ได้ใช้']] });
  G.drill($('g-drill-disc'), { gen: function () {
    var P = pick([10, 20, 50, 100]) * 1000, r = pick([8, 10, 12, 14]), pr = P * (1 - r / 100), eff = r / (100 - r) * 100;
    return { q: 'กู้ <b>' + nf(P) + '</b> บาท 1 ปี ดอกเบี้ย <b>' + r + '%</b> หักล่วงหน้า (Discount basis)', fields: [{ label: 'เงินที่ได้รับจริง', ans: pr, tol: 1, show: nf(pr) }, { label: 'อัตราที่แท้จริง', ans: eff, tol: 0.01, unit: '%', show: d2(eff) }], why: 'ดอกเบี้ย ' + nf(P * r / 100) + ' ได้ ' + nf(pr) + ' · อัตราจริง = ' + nf(P * r / 100) + ' ÷ ' + nf(pr) + ' = ' + d2(eff) + '%' };
  } });
  var ear = function (r, m) { return (Math.pow(1 + r / 100 / m, m) - 1) * 100; };
  G.drill($('g-drill-ear'), { gen: function () {
    var r = pick([6, 8, 9, 12, 15, 18]), m = pick([2, 4, 12]), e = ear(r, m);
    return { q: 'อัตราที่ระบุ <b>' + r + '%</b> ต่อปี ทบต้น <b>' + m + '</b> ครั้งต่อปี', fields: [{ label: 'EAR', ans: e, tol: 0.01, unit: '%', show: d2(e) }], why: '(1 + ' + r / 100 + ' ÷ ' + m + ')^' + m + ' − 1 = ' + d2(e) + '%' };
  } });
  G.range(['er-r', 'er-m'], function (r, m) {
    $('er-ro').textContent = r + '%'; $('er-mo').textContent = m;
    var e = ear(r, m), c = (Math.exp(r / 100) - 1) * 100;
    $('er-e').textContent = d2(e) + '%'; $('er-d').textContent = d2(e - r) + ' จุด'; $('er-c').textContent = d2(c) + '%';
    var v = $('er-vd'); v.className = 'verdict ok'; v.textContent = 'ทบต้นบ่อยขึ้น EAR สูงขึ้น แต่เพิ่มขึ้นช้าลงเรื่อย ๆ และไม่เกินค่าทบต้นต่อเนื่อง ' + d2(c) + '%';
  });
  function rev(F0, B, r, c, f) { var i = B * r / 100, u = (F0 - B) * f / 100, a = B * (1 - c / 100); return { i: i, u: u, a: a, e: (i + u) / a * 100 }; }
  G.drill($('g-drill-rev'), { gen: function () {
    var F0 = pick([1, 2, 3]) * 1000000, B = F0 * pick([0.4, 0.5, 0.6, 0.8]), r = pick([10, 12, 14]), c = pick([5, 10, 15]), f = pick([0.25, 0.5, 1]), x = rev(F0, B, r, c, f);
    return { q: 'วงเงิน <b>' + nf(F0) + '</b> ดอกเบี้ย <b>' + r + '%</b> เงินฝากค้ำ <b>' + c + '%</b> ของเงินกู้ ค่าธรรมเนียมผูกพัน <b>' + f + '%</b> ของวงเงินที่ไม่ใช้ กู้ <b>' + nf(B) + '</b> ตลอดปี', fields: [{ label: 'เงินที่ใช้ได้จริง', ans: x.a, tol: 1, show: nf(x.a) }, { label: 'อัตราที่แท้จริง', ans: x.e, tol: 0.01, unit: '%', show: d2(x.e) }], why: 'ดอกเบี้ย ' + nf(x.i) + ' + ค่าธรรมเนียม ' + nf(x.u) + ' = ' + nf(x.i + x.u) + ' ÷ ' + nf(x.a) + ' = ' + d2(x.e) + '%' };
  } });
  G.range(['rv-b', 'rv-r', 'rv-c', 'rv-f'], function (B, r, c, f) {
    $('rv-bo').textContent = nf(B); $('rv-ro').textContent = r.toFixed(1) + '%'; $('rv-co').textContent = c + '%'; $('rv-fo').textContent = f.toFixed(1) + '%';
    var x = rev(1000000, B, r, c, f);
    $('rv-i').textContent = nf(x.i); $('rv-u').textContent = nf(x.u); $('rv-a').textContent = nf(x.a); $('rv-e').textContent = d2(x.e) + '%';
    var v = $('rv-vd'); v.className = 'verdict ok'; v.textContent = 'อัตราที่แท้จริง ' + d2(x.e) + '% สูงกว่าอัตราที่ระบุ ' + r + '% เพราะเงินฝากค้ำทำให้ใช้เงินได้น้อยลง และมีค่าธรรมเนียมผูกพัน';
  });
  G.match($('g-5c'), { pairs: [['Characteristics', 'ลักษณะความตั้งใจของผู้กู้'], ['Capacity', 'ความสามารถในการชำระหนี้'], ['Capital', 'เงินลงทุนของเจ้าของ'], ['Collateral', 'หลักประกัน'], ['Conditions', 'สถานการณ์เศรษฐกิจและอุตสาหกรรม']] });
  G.sort($('g-af'), {
    buckets: [{ id: 'a', label: 'Assignment (ค้ำเงินกู้)' }, { id: 'f', label: 'Factoring (ขายลูกหนี้)' }],
    items: [
      { t: 'กรรมสิทธิ์ในลูกหนี้ยังเป็นของกิจการ', b: 'a', why: 'ใช้เป็นหลักประกันเท่านั้น' }, { t: 'โอนกรรมสิทธิ์ลูกหนี้ให้ผู้ให้เงิน', b: 'f', why: 'ขายสินทรัพย์' },
      { t: 'ความเสี่ยงหนี้สูญตกอยู่ที่ผู้กู้', b: 'a', why: 'ผู้กู้ยังรับความเสี่ยง' }, { t: 'ความเสี่ยงหนี้สูญตกอยู่ที่ Factor (กรณีไม่ไล่เบี้ย)', b: 'f', why: 'ความเสี่ยงโอนไปด้วย' },
      { t: 'ถือเป็นเงินกู้ระยะสั้นที่มีหลักประกัน', b: 'a', why: 'ผู้กู้ต้องคืนเงินกู้' }, { t: 'Factor เป็นผู้เก็บเงินจากลูกค้า', b: 'f', why: 'ผู้ซื้อลูกหนี้เก็บเงินเอง' }
    ]
  });
  G.order($('g-flow'), { items: ['ลูกค้าส่งคำสั่งซื้อให้กิจการ', 'กิจการส่งคำสั่งซื้อให้ Factor วิเคราะห์ลูกค้า', 'Factor แจ้งผลการวิเคราะห์', 'กิจการส่งสินค้าให้ลูกค้า', 'โอนกรรมสิทธิ์ในลูกหนี้ให้ Factor', 'กิจการขอรับเงินล่วงหน้า', 'Factor จ่ายเงินให้กิจการ', 'ลูกค้าชำระหนี้ให้ Factor ตามกำหนด'] });
  G.drill($('g-drill-fact'), { gen: function () {
    var R = pick([5, 10, 20]) * 100000, a = pick([70, 80, 90]), fee = pick([1, 2, 3]), r = pick([10, 12, 14]), days = pick([30, 45, 60, 90]), adv = R * a / 100, f = R * fee / 100, it = adv * r / 100 * days / 360, net = adv - f - it, ann = (f + it) / net * 360 / days * 100;
    return { q: 'ลูกหนี้ <b>' + nf(R) + '</b> เก็บเงินเฉลี่ย <b>' + days + '</b> วัน ล่วงหน้า <b>' + a + '%</b> ค่าธรรมเนียม <b>' + fee + '%</b> ของลูกหนี้ ดอกเบี้ย <b>' + r + '%</b> ต่อปีหักไว้ก่อน', fields: [{ label: 'เงินที่ได้รับจริง', ans: net, tol: 1, show: nf(net) }, { label: 'ต้นทุนต่อปี', ans: ann, tol: 0.02, unit: '%', show: d2(ann) }], why: 'ล่วงหน้า ' + nf(adv) + ' − ค่าธรรมเนียม ' + nf(f) + ' − ดอกเบี้ย ' + nf(it) + ' = ' + nf(net) + ' · ต้นทุน = ' + nf(f + it) + ' ÷ ' + nf(net) + ' × 360 ÷ ' + days + ' = ' + d2(ann) + '%' };
  } });
  G.sort($('g-lease'), {
    buckets: [{ id: 'l', label: 'สินเชื่ออุปกรณ์ (ผ่อนส่ง)' }, { id: 'r', label: 'เช่าซื้ออุปกรณ์ (Lease)' }],
    items: [
      { t: 'จ่ายเงินดาวน์ประมาณ 25–30%', b: 'l', why: 'ลักษณะของสินเชื่อผ่อนส่ง' }, { t: 'เป็นการเช่าแทนการกู้เงินซื้อ', b: 'r', why: 'ลักษณะของ Lease' },
      { t: 'ป้องกันอุปกรณ์ล้าสมัย', b: 'r', why: 'ข้อดีของการเช่า' }, { t: 'ได้ผลประโยชน์ทางภาษีจากค่าเช่า', b: 'r', why: 'ข้อดีของการเช่า' },
      { t: 'วงเงินสินเชื่อไม่ถูกใช้ไป', b: 'r', why: 'เงินและวงเงินยังเหลือ' }, { t: 'ผู้ซื้อเป็นเจ้าของอุปกรณ์เมื่อผ่อนครบ', b: 'l', why: 'ซื้อโดยการผ่อน' }
    ]
  });
  G.drill($('g-drill-pmt'), { gen: function () {
    var P = pick([3, 5, 8, 10]) * 100000, r = pick([6, 8, 10, 12]), y = pick([2, 3, 4, 5]), a = pm(P, r / 1200, y * 12);
    return { q: 'เงินกู้ <b>' + nf(P) + '</b> ดอกเบี้ย <b>' + r + '%</b> ต่อปี คิดรายเดือน ผ่อน <b>' + y + '</b> ปี', fields: [{ label: 'ค่างวดต่อเดือน', ans: a, tol: Math.max(1, a * 0.0003), show: d2(a) }, { label: 'ดอกเบี้ยรวม', ans: a * y * 12 - P, tol: Math.max(2, a * y * 12 * 0.0003), show: nf(a * y * 12 - P) }], why: 'i = ' + (r / 12).toFixed(3) + '% ต่อเดือน n = ' + y * 12 + ' · ค่างวด = ' + d2(a) + ' · ดอกเบี้ยรวม = ' + nf(a * y * 12 - P) };
  } });
  G.range(['pm-p', 'pm-d', 'pm-r', 'pm-n'], function (p, d, r, n) {
    $('pm-po').textContent = nf(p); $('pm-do').textContent = d + '%'; $('pm-ro').textContent = r.toFixed(1) + '%'; $('pm-no').textContent = n + ' เดือน';
    var L0 = p * (1 - d / 100), a = pm(L0, r / 1200, n), tot = a * n - L0;
    $('pm-l').textContent = nf(L0); $('pm-a').textContent = d2(a); $('pm-i').textContent = nf(tot); $('pm-e').textContent = d2(ear(r, 12)) + '%';
    var v = $('pm-vd'); v.className = 'verdict ok'; v.textContent = 'ดอกเบี้ยรวม ' + nf(tot) + ' คิดเป็น ' + d2(tot / L0 * 100) + '% ของเงินกู้ ยิ่งผ่อนนาน ค่างวดต่ำลงแต่ดอกเบี้ยรวมสูงขึ้น';
  });
  G.sort($('g-mkt'), {
    buckets: [{ id: 'm', label: 'ตลาดเงิน (ไม่เกิน 1 ปี)' }, { id: 'c', label: 'ตลาดทุน (เกิน 1 ปี)' }],
    items: [
      { t: 'ตราสารพาณิชย์อายุ 90 วัน', b: 'm', why: 'อายุไม่เกิน 1 ปี' }, { t: 'หุ้นสามัญ', b: 'c', why: 'ตลาดตราสารทุน' }, { t: 'หุ้นกู้อายุ 5 ปี', b: 'c', why: 'ตลาดตราสารหนี้ระยะยาว' },
      { t: 'พันธบัตรรัฐบาลอายุ 10 ปี', b: 'c', why: 'เกิน 1 ปี' }, { t: 'ตั๋วเงินคลังอายุ 6 เดือน', b: 'm', why: 'ไม่เกิน 1 ปี' }
    ]
  });
  G.match($('g-name'), { pairs: [['พันธบัตร (ไทย)', 'ผู้ออกเป็นรัฐบาลหรือองค์กรของรัฐ'], ['หุ้นกู้ (ไทย)', 'ผู้ออกเป็นภาคเอกชน'], ['Bond (ต่างประเทศ)', 'มีหลักทรัพย์ค้ำประกัน'], ['Debenture (ต่างประเทศ)', 'ไม่มีหลักทรัพย์ค้ำประกัน']] });
  G.drill($('g-drill-bond'), { gen: function () {
    var c = pick([5, 6, 7, 8]), n = pick([2, 3, 4, 5]), y = pick([4, 5, 6, 7, 9, 10]), p = bond(c / 100, y / 100, n);
    return { q: 'มูลค่าที่ตราไว้ 1,000 ดอกเบี้ย <b>' + c + '%</b> ต่อปี อายุ <b>' + n + '</b> ปี ตลาดต้องการผลตอบแทน <b>' + y + '%</b>', fields: [{ label: 'ราคาพันธบัตร', ans: p, tol: 0.05, show: d2(p) }, { label: 'ต่ำกว่า/สูงกว่ามูลค่าที่ตราไว้ (1 = สูงกว่า, 0 = เท่ากัน, −1 = ต่ำกว่า)', ans: c === y ? 0 : (c > y ? 1 : -1), tol: 0.01, show: String(c === y ? 0 : (c > y ? 1 : -1)) }], why: 'ราคา = ' + d2(p) + (c > y ? ' (Premium เพราะดอกเบี้ยสูงกว่าที่ตลาดต้องการ)' : ' (Discount เพราะดอกเบี้ยต่ำกว่าที่ตลาดต้องการ)') };
  } });
  G.range(['bd-c', 'bd-y', 'bd-n'], function (c, y, n) {
    $('bd-co').textContent = c.toFixed(1) + '%'; $('bd-yo').textContent = y.toFixed(1) + '%'; $('bd-no').textContent = n + ' ปี';
    var p = bond(c / 100, y / 100, n);
    $('bd-p').textContent = d2(p); $('bd-s').textContent = c === y ? 'เท่ามูลค่าที่ตราไว้' : (c > y ? 'Premium (สูงกว่า)' : 'Discount (ต่ำกว่า)'); $('bd-d').textContent = d2(p - 1000);
    var v = $('bd-vd'); v.className = 'verdict ok'; v.textContent = c > y ? 'ดอกเบี้ยพันธบัตรสูงกว่าที่ตลาดต้องการ นักลงทุนยอมจ่ายสูงกว่ามูลค่าที่ตราไว้' : (c < y ? 'ดอกเบี้ยต่ำกว่าที่ตลาดต้องการ ราคาต้องลดลงเพื่อให้ผลตอบแทนเท่าตลาด' : 'ดอกเบี้ยเท่าผลตอบแทนตลาด ราคาเท่ามูลค่าที่ตราไว้');
  });
  G.drill($('g-drill-rights'), { gen: function () {
    var P = pick([40, 50, 60, 80]), n = pick([2, 3, 4, 5]), S = Math.round(P * pick([0.7, 0.8, 0.9])), x = (n * P + S) / (n + 1);
    return { q: 'ราคาตลาด <b>' + P + '</b> เสนอขายหุ้นใหม่ <b>1 ต่อ ' + n + '</b> ที่ราคา <b>' + S + '</b>', fields: [{ label: 'ราคาเชิงทฤษฎีหลังสิทธิ', ans: x, tol: 0.005, show: d2(x) }, { label: 'มูลค่าสิทธิต่อหุ้นเดิม', ans: P - x, tol: 0.005, show: d2(P - x) }], why: '(' + n + ' × ' + P + ' + ' + S + ') ÷ ' + (n + 1) + ' = ' + d2(x) + ' · มูลค่าสิทธิ = ' + P + ' − ' + d2(x) + ' = ' + d2(P - x) };
  } });
  G.drill($('g-drill-pref'), { gen: function () {
    var d = pick([4, 5, 6, 7, 8]), pr = pick([50, 60, 80, 90, 100]), y = d / pr * 100;
    return { q: 'Par 100 บาท ปันผล <b>' + d + '%</b> ราคาตลาด <b>' + pr + '</b> บาท', fields: [{ label: 'ปันผลต่อหุ้น', ans: d, tol: 0.005 }, { label: 'ผลตอบแทน', ans: y, tol: 0.01, unit: '%', show: d2(y) }], why: '100 × ' + d + '% = ' + d + ' · ' + d + ' ÷ ' + pr + ' = ' + d2(y) + '%' };
  } });
  G.order($('g-pri'), { items: ['Senior bond', 'Subordinated bond', 'Preferred stock', 'Common stock'] });
  G.drill($('g-drill-claim'), { gen: function () {
    var sn = pick([1, 2, 3]), sb = pick([1, 1.5, 2]), pf = pick([1, 1.5, 2]), tot = pick([2, 3, 4, 5, 6, 8]);
    var r = tot, g1 = Math.min(r, sn); r -= g1; var g2 = Math.min(r, sb); r -= g2; var g3 = Math.min(r, pf); r -= g3;
    return { q: 'ขายสินทรัพย์ได้ <b>' + tot + '</b> ล้านบาท · Senior <b>' + sn + '</b> · Sub <b>' + sb + '</b> · Preferred <b>' + pf + '</b> ล้านบาท', fields: [{ label: 'Preferred ได้รับ', ans: g3, tol: 0.005, unit: 'ล้าน', show: d2(g3) }, { label: 'Common ได้รับ', ans: r, tol: 0.005, unit: 'ล้าน', show: d2(r) }], why: 'Senior ' + d2(g1) + ' → Sub ' + d2(g2) + ' → Preferred ' + d2(g3) + ' → Common ' + d2(r) + ' ล้านบาท' };
  } });
  G.quiz($('g-q11'), { questions: [
    { q: 'เงื่อนไข 2/10, n/30 หมายความว่า', o: ['ส่วนลด 2% ถ้าจ่ายใน 10 วัน มิฉะนั้นจ่ายเต็มใน 30 วัน', 'ดอกเบี้ย 2% ต่อ 10 วัน', 'ส่วนลด 10% ถ้าจ่ายใน 2 วัน', 'ต้องจ่ายใน 2 วัน'], a: 0, why: 'CD = 2% วันส่วนลด 10 วัน ครบกำหนด 30 วัน' },
    { q: 'ต้นทุนการไม่รับส่วนลดของ 1/10, n/30 (แบบแม่นยำ) ประมาณ', o: ['18.18%', '9.09%', '36%', '12%'], a: 0, why: '(0.01 ÷ 0.99) × 18' },
    { q: 'กู้ 10,000 ดอกเบี้ย 1,000 แบบ Discount basis อัตราที่แท้จริงคือ', o: ['11.11%', '10.00%', '9.00%', '12.00%'], a: 0, why: '1,000 ÷ 9,000' },
    { q: 'ค่าธรรมเนียมผูกพันเงินกู้ (Commitment fee) คิดจาก', o: ['วงเงินที่ยังไม่ได้ใช้', 'เงินที่กู้ไปแล้ว', 'ดอกเบี้ย', 'กำไรสุทธิ'], a: 0, why: 'ธนาคารต้องกันวงเงินไว้ให้' },
    { q: 'ข้อใดต่างกันระหว่าง Factoring กับ Assignment', o: ['Factoring โอนกรรมสิทธิ์ลูกหนี้และความเสี่ยงหนี้สูญ', 'Assignment โอนกรรมสิทธิ์ลูกหนี้', 'ไม่ต่างกัน', 'Factoring ไม่ได้เงินล่วงหน้า'], a: 0, why: 'Assignment กรรมสิทธิ์ยังอยู่ที่ผู้กู้' },
    { q: 'ดอกเบี้ย 12% ทบต้นรายเดือน EAR ประมาณ', o: ['12.68%', '12.00%', '13.50%', '11.46%'], a: 0, why: '(1.01)^12 − 1' },
    { q: 'ผลตอบแทนที่ตลาดต้องการสูงกว่าดอกเบี้ยพันธบัตร ราคาพันธบัตรจะ', o: ['ต่ำกว่ามูลค่าที่ตราไว้', 'สูงกว่ามูลค่าที่ตราไว้', 'เท่ากับมูลค่าที่ตราไว้', 'เป็นศูนย์'], a: 0, why: 'ต้องลดราคาเพื่อให้ได้ผลตอบแทนเท่าตลาด' },
    { q: 'ราคาตลาด 60 เสนอหุ้นใหม่ 1 ต่อ 3 ที่ 48 ราคาหลังสิทธิ', o: ['57.00', '60.00', '54.00', '48.00'], a: 0, why: '(3 × 60 + 48) ÷ 4' },
    { q: 'ปันผลหุ้นบุริมสิทธิ์ 6 บาท ราคาตลาด 75 ผลตอบแทน', o: ['8.00%', '6.00%', '12.50%', '4.50%'], a: 0, why: '6 ÷ 75' },
    { q: 'เมื่อเลิกกิจการ ผู้ได้รับชำระเป็นลำดับสุดท้ายคือ', o: ['ผู้ถือหุ้นสามัญ', 'ผู้ถือ Senior bond', 'ผู้ถือหุ้นบุริมสิทธิ์', 'ธนาคารผู้ให้กู้'], a: 0, why: 'ผู้ถือหุ้นสามัญรับส่วนที่เหลือ' }
  ] });
})();
