/* Chapter 12: Dividend policy */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var pick = function (a) { return a[rnd(0, a.length - 1)]; };
  var nf = function (v) { return G.fmt(Math.round(v), 0); };
  var d2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var d3 = function (v) { return (Math.round(v * 1000) / 1000).toFixed(3); };
  var polC = function (e) { return 1 + 0.5 * Math.max(0, e - 4); };

  G.tally($('g-poll'), { options: ['เงินปันผลสด', 'หุ้นปันผล', 'ให้บริษัทเก็บกำไรไปลงทุน', 'ให้ซื้อหุ้นคืน'] });
  G.sort($('g-form'), {
    buckets: [{ id: 'c', label: 'เงินสด' }, { id: 's', label: 'หุ้น' }, { id: 'n', label: 'สินทรัพย์/ตั๋ว' }],
    items: [
      { t: 'โอนเงินปันผลเข้าบัญชีผู้ถือหุ้น 2 บาทต่อหุ้น', b: 'c', why: 'Cash dividend' }, { t: 'ผู้ถือหุ้น 10 หุ้นได้รับหุ้นสามัญเพิ่ม 1 หุ้น', b: 's', why: 'Stock dividend' },
      { t: 'แจกสินค้าที่บริษัทผลิตให้ผู้ถือหุ้น', b: 'n', why: 'Property dividend' }, { t: 'บริษัทออกตั๋วสัญญาใช้เงินให้ผู้ถือหุ้น ครบกำหนดจ่ายเงินสด', b: 'n', why: 'Scrip dividend' },
      { t: 'เก็บเงินสดไว้ใช้ลงทุน จึงจ่ายเป็นหุ้นแทน', b: 's', why: 'ไม่ใช้เงินสด' }, { t: 'จ่ายเช็คเงินปันผลวันจ่ายตามประกาศ', b: 'c', why: 'เป็นเงินสด' }
    ]
  });
  G.drill($('g-drill-dy'), { gen: function () {
    var eps = pick([2, 4, 5, 8]), po = pick([25, 40, 50, 60]), pr = pick([30, 40, 50, 80]), dps = eps * po / 100, y = dps / pr * 100;
    return { q: 'EPS <b>' + eps + '</b> บาท อัตราจ่ายปันผล <b>' + po + '%</b> ราคาหุ้น <b>' + pr + '</b> บาท', fields: [{ label: 'DPS', ans: dps, tol: 0.005, unit: 'บาท', show: d2(dps) }, { label: 'Dividend yield', ans: y, tol: 0.01, unit: '%', show: d2(y) }], why: 'DPS = ' + eps + ' × ' + po + '% = ' + d2(dps) + ' · yield = ' + d2(dps) + ' ÷ ' + pr + ' = ' + d2(y) + '%' };
  } });
  G.range(['py-e', 'py-s', 'py-p', 'py-r'], function (e, s, p, r) {
    $('py-eo').textContent = nf(e); $('py-so').textContent = nf(s); $('py-po').textContent = p; $('py-ro').textContent = r + '%';
    var eps = e / s, dps = eps * r / 100;
    $('py-d').textContent = d2(dps); $('py-y').textContent = d2(dps / p * 100) + '%'; $('py-c').textContent = d2(e * r / 100); $('py-t').textContent = d2(e * (1 - r / 100));
    var v = $('py-vd'); v.className = 'verdict ok'; v.textContent = 'EPS ' + d2(eps) + ' บาท จ่าย ' + r + '% = ' + d2(dps) + ' บาทต่อหุ้น เก็บกำไรสะสม ' + (100 - r) + '% ไว้ลงทุนต่อ';
  });
  G.order($('g-date'), { items: ['วันประกาศจ่ายเงินปันผล (Declaration date)', 'วัน XD (Ex-dividend date)', 'วันปิดทะเบียน (Holder of record date)', 'วันจ่ายเงินปันผล (Payment date)'] });
  G.drill($('g-drill-xd'), { gen: function () {
    var sh = pick([5, 10, 20, 50]), dps = pick([1, 1.5, 2, 3]), pr = pick([30, 40, 50, 80]), tot = sh * dps;
    return { q: 'หุ้น <b>' + sh + '</b> ล้านหุ้น ปันผลหุ้นละ <b>' + dps + '</b> บาท ราคาก่อน XD <b>' + pr + '</b> บาท', fields: [{ label: 'ปันผลรวม', ans: tot, tol: 0.05, unit: 'ล้านบาท', show: d2(tot) }, { label: 'ราคาประมาณหลัง XD', ans: pr - dps, tol: 0.005, unit: 'บาท', show: d2(pr - dps) }], why: sh + ' × ' + dps + ' = ' + d2(tot) + ' ล้านบาท · ' + pr + ' − ' + dps + ' = ' + d2(pr - dps) };
  } });
  G.match($('g-pol'), { pairs: [['Stable dividend', 'จ่ายเป็นจำนวนบาทต่อหุ้นคงที่ทุกปี'], ['Constant payout ratio', 'จ่ายเป็นร้อยละคงที่ของกำไร ปันผลผันผวนตามกำไร'], ['Low regular + extra', 'จ่ายน้อยสม่ำเสมอ ปีกำไรดีจ่ายพิเศษเพิ่ม'], ['Residual policy', 'จ่ายจากกำไรที่เหลือหลังลงทุนตามสัดส่วนทุนเป้าหมาย']] });
  G.drill($('g-drill-pol'), { gen: function () {
    var e = pick([2, 3, 5, 6, 7, 8, 10]), b = 0.4 * e, c = polC(e);
    return { q: 'EPS <b>' + e + '</b> บาท · B: จ่าย 40% · C: 1 บาท + พิเศษ 50% ของ EPS ส่วนที่เกิน 4 บาท', fields: [{ label: 'ปันผลนโยบาย B', ans: b, tol: 0.005, unit: 'บาท', show: d2(b) }, { label: 'ปันผลนโยบาย C', ans: c, tol: 0.005, unit: 'บาท', show: d2(c) }], why: 'B = 0.4 × ' + e + ' = ' + d2(b) + ' · C = 1 + 0.5 × max(0, ' + e + ' − 4) = ' + d2(c) };
  } });
  G.range(['pl-e'], function (e) {
    $('pl-eo').textContent = e.toFixed(1);
    $('pl-a').textContent = '2.00'; $('pl-b').textContent = d2(0.4 * e); $('pl-c').textContent = d2(polC(e)); $('pl-p').textContent = e > 0 ? d2(2 / e * 100) + '%' : '-';
    var v = $('pl-vd'); v.className = 'verdict ' + (e < 2 ? 'bad' : 'ok');
    v.textContent = e < 2 ? 'EPS ต่ำกว่า 2 บาท นโยบาย A จ่ายเกินกำไร (Payout > 100%) ต้องใช้กำไรสะสมหรือเงินสดเดิม' : 'A นิ่ง B ผันผวนตามกำไร C ยืดหยุ่น: จ่ายพิเศษเมื่อ EPS เกิน 4 บาท';
  });
  G.drill($('g-drill-res'), { gen: function () {
    var ni = pick([40, 50, 80, 100]), cx = pick([40, 60, 80, 100]), eq = pick([50, 60, 70, 100]), sh = pick([5, 10, 20]), need = cx * eq / 100, div = Math.max(0, ni - need);
    return { q: 'กำไรสุทธิ <b>' + ni + '</b> ล้านบาท งบลงทุน <b>' + cx + '</b> ล้านบาท ใช้ส่วนของทุน <b>' + eq + '%</b> หุ้น <b>' + sh + '</b> ล้านหุ้น (ถ้าติดลบให้ตอบ 0)', fields: [{ label: 'ปันผลที่จ่ายได้', ans: div, tol: 0.05, unit: 'ล้านบาท', show: d2(div) }, { label: 'DPS', ans: div / sh, tol: 0.005, unit: 'บาท', show: d2(div / sh) }], why: 'ทุนที่ใช้ = ' + cx + ' × ' + eq + '% = ' + d2(need) + ' · ปันผล = ' + ni + ' − ' + d2(need) + ' = ' + d2(div) + ' · DPS = ' + d2(div / sh) };
  } });
  G.sort($('g-ss'), {
    buckets: [{ id: 's', label: 'แตกหุ้น' }, { id: 'd', label: 'หุ้นปันผล' }],
    items: [
      { t: 'ไม่เปลี่ยนรายการในส่วนของเจ้าของ (เปลี่ยน par ตามสัดส่วน)', b: 's', why: 'Stock split' }, { t: 'โอนกำไรสะสมเป็นทุนชำระแล้วและส่วนเกินมูลค่าหุ้น', b: 'd', why: 'ตามมูลค่าตลาด' },
      { t: 'กำไรสะสมลดลง', b: 'd', why: 'โอนเป็นทุน' }, { t: 'กำไรสะสมเท่าเดิม', b: 's', why: 'ไม่โอนอะไร' },
      { t: 'ราคาที่ตราไว้ลดลงตามสัดส่วน', b: 's', why: 'หุ้นเพิ่ม par ลด' }, { t: 'ใช้แทนเงินสดเมื่อต้องเก็บเงินไว้ลงทุน', b: 'd', why: 'ให้ผลตอบแทนเป็นหุ้น' }
    ]
  });
  G.drill($('g-drill-split'), { gen: function () {
    var k = pick([2, 3, 4, 5, 1.5]), pr = pick([30, 40, 60, 90]), sh = pick([20, 50, 75, 100]), eq = sh * pick([10, 15, 20]), bv = eq / sh, h = pick([100, 500, 1000]);
    return { q: 'แตกหุ้น <b>' + k + ' ต่อ 1</b> ส่วนของเจ้าของรวม <b>' + nf(eq) + '</b> ล้านบาท หุ้นเดิม <b>' + sh + '</b> ล้านหุ้น ราคาตลาด <b>' + pr + '</b> บาท', fields: [{ label: 'หุ้นรวมใหม่', ans: sh * k, tol: 0.05, unit: 'ล้านหุ้น', show: d2(sh * k) }, { label: 'ราคาตามบัญชีใหม่', ans: bv / k, tol: 0.01, unit: 'บาท', show: d2(bv / k) }, { label: 'ราคาตลาดตามทฤษฎี', ans: pr / k, tol: 0.01, unit: 'บาท', show: d2(pr / k) }], why: 'หุ้นใหม่ = ' + sh + ' × ' + k + ' = ' + d2(sh * k) + ' · BV = ' + nf(eq) + ' ÷ ' + d2(sh * k) + ' = ' + d2(bv / k) + ' · ราคา = ' + pr + ' ÷ ' + k + ' = ' + d2(pr / k) };
  } });
  G.range(['sp-k', 'sp-p', 'sp-h'], function (k, p, h) {
    $('sp-ko').textContent = k.toFixed(1) + ' ต่อ 1'; $('sp-po').textContent = p; $('sp-ho').textContent = nf(h);
    $('sp-s').textContent = d2(75 * k); $('sp-b').textContent = d2(1500 / (75 * k)); $('sp-m').textContent = d2(p / k); $('sp-v').textContent = nf(h * k * p / k);
    var v = $('sp-vd'); v.className = 'verdict ok'; v.textContent = 'หุ้นของผู้ถือเพิ่มเป็น ' + nf(h * k) + ' หุ้น ราคาลดเป็น ' + d2(p / k) + ' มูลค่ารวม ' + nf(h * p) + ' บาท เท่าเดิม (ส่วนของเจ้าของรวม 1,500 ล้านบาทไม่เปลี่ยน)';
  });
  function sd(r, P, sh, eq, par) { var n = sh * r / 100, cap = n * P; return { n: n, cap: cap, prem: n * (P - par), bv: eq / (sh + n), mkt: P / (1 + r / 100) }; }
  G.drill($('g-drill-sd'), { gen: function () {
    var r = pick([10, 20, 25, 50]), P = pick([20, 25, 30, 40]), sh = pick([40, 50, 75]), eq = sh * pick([15, 20]), x = sd(r, P, sh, eq, 1);
    return { q: 'หุ้นปันผล <b>' + r + '%</b> ราคาตลาด <b>' + P + '</b> บาท หุ้นเดิม <b>' + sh + '</b> ล้านหุ้น par 1 ส่วนของเจ้าของรวม <b>' + nf(eq) + '</b> ล้านบาท', fields: [{ label: 'หุ้นใหม่', ans: x.n, tol: 0.05, unit: 'ล้านหุ้น', show: d2(x.n) }, { label: 'กำไรสะสมที่ลดลง', ans: x.cap, tol: 0.5, unit: 'ล้านบาท', show: nf(x.cap) }, { label: 'ราคาตามบัญชีใหม่', ans: x.bv, tol: 0.01, unit: 'บาท', show: d2(x.bv) }], why: 'หุ้นใหม่ = ' + sh + ' × ' + r + '% = ' + d2(x.n) + ' · โอน ' + d2(x.n) + ' × ' + P + ' = ' + nf(x.cap) + ' · BV = ' + nf(eq) + ' ÷ ' + d2(sh + x.n) + ' = ' + d2(x.bv) };
  } });
  G.range(['sd-r', 'sd-p'], function (r, P) {
    $('sd-ro').textContent = r + '%'; $('sd-po').textContent = P;
    var x = sd(r, P, 75, 1500, 1);
    $('sd-n').textContent = d2(x.n); $('sd-c').textContent = d2(x.cap); $('sd-b').textContent = d2(x.bv); $('sd-m').textContent = d2(x.mkt);
    var v = $('sd-vd'); v.className = x.cap > 1125 ? 'bad' : 'ok';
    v.textContent = x.cap > 1125 ? 'โอนเกินกำไรสะสม 1,125 ล้านบาท ทำไม่ได้' : 'กำไรสะสมเหลือ ' + d2(1125 - x.cap) + ' ล้านบาท ส่วนของเจ้าของรวมยัง 1,500 ล้านบาท ผู้ถือหุ้นยังถือสัดส่วนเท่าเดิม';
  });
  G.drill($('g-drill-rb'), { gen: function () {
    var ni = pick([100, 150, 200]), sh = pick([50, 75, 100]), P = pick([20, 25, 40]), amt = pick([10, 15, 20]), n = amt / P, left = sh - n, eps = ni / left;
    return { q: 'กำไรสุทธิ <b>' + ni + '</b> ล้านบาท หุ้น <b>' + sh + '</b> ล้านหุ้น ซื้อหุ้นคืนด้วยเงิน <b>' + amt + '</b> ล้านบาท ที่ราคา <b>' + P + '</b> บาท', fields: [{ label: 'หุ้นคงเหลือ', ans: left, tol: 0.005, unit: 'ล้านหุ้น', show: d3(left) }, { label: 'EPS ใหม่', ans: eps, tol: 0.001, unit: 'บาท', show: d3(eps) }], why: 'ซื้อคืน ' + amt + ' ÷ ' + P + ' = ' + d2(n) + ' ล้านหุ้น · คงเหลือ ' + d3(left) + ' · EPS = ' + ni + ' ÷ ' + d3(left) + ' = ' + d3(eps) + ' (เดิม ' + d3(ni / sh) + ')' };
  } });
  G.sort($('g-fac'), {
    buckets: [{ id: 'u', label: 'จ่ายปันผลมากขึ้น' }, { id: 'd', label: 'จ่ายปันผลน้อยลง' }],
    items: [
      { t: 'กำไรมั่นคงและคาดการณ์ได้', b: 'u', why: 'จ่ายอัตราสูงได้' }, { t: 'มีโครงการลงทุน NPV บวกจำนวนมาก', b: 'd', why: 'ต้องเก็บกำไรไว้ลงทุน' },
      { t: 'ระดมทุนจากตลาดทุนได้ง่าย', b: 'u', why: 'ไม่ต้องพึ่งกำไรสะสม' }, { t: 'สัญญาเงินกู้จำกัดการจ่ายปันผล', b: 'd', why: 'ข้อจำกัดจากเจ้าหนี้' },
      { t: 'มีหนี้ครบกำหนดชำระมาก เงินสดตึง', b: 'd', why: 'ต้องรักษาสภาพคล่อง' }, { t: 'ผู้ถือหุ้นใหญ่ไม่ต้องการให้ออกหุ้นใหม่ลดสัดส่วน', b: 'd', why: 'เก็บกำไรไว้ลงทุนแทนออกหุ้น' }
    ]
  });
  G.match($('g-law'), { pairs: [['มาตรา 1201', 'ต้องมีมติที่ประชุมใหญ่ และจ่ายจากกำไรเท่านั้น'], ['มาตรา 1202', 'กันทุนสำรองอย่างน้อย 5% ของกำไร จนถึง 10% ของทุน'], ['มาตรา 1203', 'จ่ายฝ่าฝืน เจ้าหนี้เรียกคืนจากบริษัทได้'], ['มาตรา 1204', 'ประกาศลงหนังสือพิมพ์อย่างน้อย 2 ครั้ง หรือส่งจดหมายถึงผู้ถือหุ้น']] });
  G.drill($('g-drill-rsv'), { gen: function () {
    var cap = pick([50, 80, 100, 200]), ni = pick([10, 20, 30, 40]), ex = cap * 0.1 - pick([0, 0.2, 0.5, 1, 3, 5]), room = cap * 0.1 - ex, set = Math.min(ni * 0.05, room);
    return { q: 'ทุนจด <b>' + cap + '</b> ล้านบาท กำไร <b>' + ni + '</b> ล้านบาท ทุนสำรองเดิม <b>' + d2(ex) + '</b> ล้านบาท', fields: [{ label: 'เพดานทุนสำรอง (10%)', ans: cap * 0.1, tol: 0.005, unit: 'ล้านบาท', show: d2(cap * 0.1) }, { label: 'ต้องกันปีนี้', ans: set, tol: 0.005, unit: 'ล้านบาท', show: d2(set) }], why: 'เพดาน ' + d2(cap * 0.1) + ' · ที่ว่าง ' + d2(room) + ' · ตามอัตรา 5% = ' + d2(ni * 0.05) + ' → กัน ' + d2(set) };
  } });
  G.quiz($('g-q12'), { questions: [
    { q: 'EPS 5 บาท จ่ายปันผล 2 บาท Payout ratio คือ', o: ['40%', '60%', '25%', '250%'], a: 0, why: '2 ÷ 5' },
    { q: 'ราคา 80 บาท ปันผล 3.20 บาท Dividend yield', o: ['4%', '2.5%', '40%', '3.2%'], a: 0, why: '3.20 ÷ 80' },
    { q: 'วันใดที่ผู้ซื้อหุ้นใหม่จะไม่ได้รับเงินปันผลงวดนั้น', o: ['วัน XD เป็นต้นไป', 'วันประกาศ', 'วันจ่าย', 'ก่อนวันประกาศ'], a: 0, why: 'ซื้อตั้งแต่ XD ไม่ทันชื่อในทะเบียน' },
    { q: 'ราคาก่อน XD 36 ปันผล 1.50 ราคาหลัง XD ประมาณ', o: ['34.50', '37.50', '36.00', '35.00'], a: 0, why: '36 − 1.50' },
    { q: 'นโยบายที่ปันผลผันผวนตามกำไรมากที่สุดคือ', o: ['อัตราจ่ายคงที่', 'จ่ายคงที่', 'ต่ำสม่ำเสมอ + พิเศษ', 'ไม่จ่ายเลย'], a: 0, why: 'DPS = ร้อยละคงที่ × EPS' },
    { q: 'แตกหุ้น 3 ต่อ 1 ราคา 45 บาท ราคาหลังแตกตามทฤษฎี', o: ['15 บาท', '135 บาท', '45 บาท', '22.5 บาท'], a: 0, why: '45 ÷ 3' },
    { q: 'หุ้นปันผลส่งผลต่อส่วนของเจ้าของรวมอย่างไร', o: ['ไม่เปลี่ยน', 'เพิ่มขึ้น', 'ลดลง', 'เป็นศูนย์'], a: 0, why: 'เพียงโอนกำไรสะสมเป็นทุน' },
    { q: 'หุ้นปันผล 10% หุ้น 50 ล้านหุ้น ราคา 30 กำไรสะสมลด', o: ['150 ล้านบาท', '50 ล้านบาท', '15 ล้านบาท', '300 ล้านบาท'], a: 0, why: '5 ล้านหุ้น × 30' },
    { q: 'การซื้อหุ้นคืนทำให้ EPS', o: ['เพิ่มขึ้น (เมื่อกำไรเท่าเดิม)', 'ลดลง', 'ไม่เปลี่ยน', 'เป็นศูนย์'], a: 0, why: 'จำนวนหุ้นลดลง' },
    { q: 'มาตรา 1202 กำหนดให้กันทุนสำรองอย่างน้อย', o: ['5% ของกำไร จนถึง 10% ของทุน', '10% ของกำไร', '20% ของทุน', 'ไม่ต้องกัน'], a: 0, why: '1 ใน 20 ของกำไร จนทุนสำรองถึง 1 ใน 10 ของทุน' }
  ] });
})();
