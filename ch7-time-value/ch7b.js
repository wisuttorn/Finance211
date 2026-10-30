/* Chapter 7: Time value of money */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var pick = function (a) { return a[rnd(0, a.length - 1)]; };
  var r2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var nf = function (v) { return G.fmt(Math.round(v), 0); };
  var nd = function (v, d) { return G.fmt(v, d); };
  var tl = function (a) { return Math.max(1, Math.abs(a) * 0.002); };
  var fv = function (p, i, n) { return p * Math.pow(1 + i, n); };
  var pv = function (f, i, n) { return f / Math.pow(1 + i, n); };
  var fa = function (i, n) { return i === 0 ? n : (Math.pow(1 + i, n) - 1) / i; };
  var pa = function (i, n) { return i === 0 ? n : (1 - Math.pow(1 + i, -n)) / i; };
  function bars(el, vals, color, lab) {
    var mx = Math.max.apply(null, vals) || 1, n = vals.length, w = 600 / n, s = '<svg class="chart" viewBox="0 0 640 150" role="img" aria-label="' + lab + '">';
    vals.forEach(function (v, k) { var h = v / mx * 115; s += '<rect x="' + (20 + k * w + w * 0.1) + '" y="' + (130 - h) + '" width="' + (w * 0.8) + '" height="' + h + '" fill="' + color + '"/>'; if (n <= 15) s += '<text x="' + (20 + k * w + w * 0.5) + '" y="145" font-size="10" text-anchor="middle" fill="#58706A">' + k + '</text>'; });
    el.innerHTML = s + '</svg>';
  }
  G.tally($('g-poll'), { options: ['รับ 10,000 บาทตอนนี้', 'รับ 10,000 บาทอีก 3 ปี', 'แล้วแต่ดอกเบี้ย'] });
  G.match($('g-why'), { pairs: [
    ['อยากใช้เงินวันนี้ ไม่อยากรอ', 'ความอดทนในการบริโภค'], ['เงินที่ได้เร็วนำไปลงทุนต่อได้', 'โอกาสในการลงทุน'],
    ['ของราคาแพงขึ้น เงินซื้อของได้น้อยลง', 'เงินเฟ้อ'], ['อาจไม่ได้รับเงินตามสัญญา', 'ความเสี่ยง']
  ] });
  G.sort($('g-dir'), {
    buckets: [{ id: 'f', label: 'ทบต้น (หา FV)' }, { id: 'p', label: 'คิดลด (หา PV)' }],
    items: [
      { t: 'ฝากวันนี้ อีก 5 ปีจะมีเท่าใด', b: 'f', why: 'เดินไปข้างหน้า' }, { t: 'อยากได้ 1 ล้านในอีก 10 ปี ต้องมีวันนี้เท่าใด', b: 'p', why: 'ย้อนกลับมาวันนี้' },
      { t: 'ลงทุน 100,000 ได้ 8% ต่อปี 3 ปี เหลือเท่าใด', b: 'f', why: 'ดอกเบี้ยทบต้น' }, { t: 'ตั๋วจะได้ 50,000 ใน 2 ปี ควรซื้อวันนี้ราคาเท่าใด', b: 'p', why: 'คิดลดด้วยอัตราผลตอบแทนที่ต้องการ' },
      { t: 'เงินออมสะสมครบอายุเกษียณ', b: 'f', why: 'หามูลค่าอนาคต' }, { t: 'มูลค่าของโครงการที่จะรับเงินในอนาคต', b: 'p', why: 'ต้องแปลงเป็นมูลค่าวันนี้' }
    ]
  });
  /* FV lab */
  G.range(['fv-p', 'fv-i', 'fv-n'], function (p, i, n) {
    $('fv-po').textContent = nf(p); $('fv-io').textContent = i.toFixed(1) + '%'; $('fv-no').textContent = n + ' ปี';
    var f = fv(p, i / 100, n);
    $('fv-f').textContent = nf(f); $('fv-x').textContent = Math.pow(1 + i / 100, n).toFixed(4); $('fv-it').textContent = nf(f - p); $('fv-s').textContent = nf(p * i / 100 * n);
    var arr = []; for (var k = 0; k <= n; k++) arr.push(fv(p, i / 100, k)); bars($('fv-chart'), arr, '#7B4AA0', 'มูลค่าอนาคตแต่ละปี');
    var v = $('fv-vd'); v.className = 'verdict ok';
    v.textContent = 'ดอกเบี้ยทบต้นได้ ' + nf(f - p) + ' มากกว่าดอกเบี้ยไม่ทบต้น ' + nf(f - p - p * i / 100 * n) + ' ยิ่งนาน ส่วนต่างยิ่งมาก';
  });
  G.drill($('g-drill-fv'), { gen: function () {
    var p = rnd(2, 50) * 1000, i = pick([4, 5, 6, 8, 10, 12]), n = rnd(2, 12), f = fv(p, i / 100, n);
    return { q: 'ฝาก <b>' + nf(p) + '</b> บาท ดอกเบี้ย <b>' + i + '%</b> ต่อปี ทบต้นรายปี <b>' + n + '</b> ปี', fields: [{ label: 'FV', ans: f, tol: tl(f), unit: 'บาท', show: nf(f) }], why: nf(p) + ' × (1.' + (i < 10 ? '0' + i : i) + ')<sup>' + n + '</sup> = ' + nf(f) };
  } });
  G.drill($('g-drill-n'), { gen: function () {
    var i = pick([5, 8, 10, 12]), n = rnd(3, 15), p = rnd(1, 20) * 1000, f = p * Math.pow(1 + i / 100, n);
    return { q: 'ลงทุน <b>' + nf(p) + '</b> ที่ <b>' + i + '%</b> ต่อปี ได้เป็น <b>' + nf(f) + '</b> ใช้เวลากี่ปี (ปัดเป็นจำนวนเต็ม)', fields: [{ label: 'n', ans: n, tol: 0.5, unit: 'ปี' }], why: 'n = ln(' + nf(f) + ' ÷ ' + nf(p) + ') ÷ ln(1.' + (i < 10 ? '0' + i : i) + ') ≈ ' + n };
  } });
  G.drill($('g-drill-i'), { gen: function () {
    var i = pick([4, 5, 6, 8, 10, 12, 15]), n = rnd(3, 10), p = rnd(1, 20) * 1000, f = p * Math.pow(1 + i / 100, n);
    return { q: 'เงิน <b>' + nf(p) + '</b> เติบโตเป็น <b>' + nf(f) + '</b> ใน <b>' + n + '</b> ปี ทบต้นรายปี อัตราดอกเบี้ยต่อปีกี่ %', fields: [{ label: 'i', ans: i, tol: 0.1, unit: '%' }], why: 'i = (' + nf(f) + ' ÷ ' + nf(p) + ')<sup>1/' + n + '</sup> − 1 ≈ ' + i + '%' };
  } });
  /* compounding frequency */
  var MS = [[1, 'รายปี'], [2, 'ราย 6 เดือน'], [4, 'รายไตรมาส'], [12, 'รายเดือน'], [365, 'รายวัน']];
  G.range(['cm-p', 'cm-i', 'cm-n', 'cm-m'], function (p, i, n, mi) {
    var m = MS[mi][0];
    $('cm-po').textContent = nf(p); $('cm-io').textContent = i.toFixed(1) + '%'; $('cm-no').textContent = n + ' ปี'; $('cm-mo').textContent = MS[mi][1] + ' (m = ' + m + ')';
    var f = fv(p, i / 100 / m, n * m), f1 = fv(p, i / 100, n), ear = Math.pow(1 + i / 100 / m, m) - 1;
    $('cm-f').textContent = nf(f); $('cm-e').textContent = (ear * 100).toFixed(2) + '%'; $('cm-d').textContent = nf(f - f1);
    var v = $('cm-vd'); v.className = 'verdict ok';
    v.textContent = 'อัตราประกาศ ' + i.toFixed(1) + '% แต่ได้จริงต่อปี ' + (ear * 100).toFixed(2) + '% เมื่อทบ' + MS[mi][1] + ' ทบถี่ขึ้นได้เพิ่มแต่เพิ่มช้าลงเรื่อย ๆ';
  });
  G.drill($('g-drill-m'), { gen: function () {
    var m = pick([2, 4, 12]), i = pick([6, 8, 10, 12]), n = rnd(1, 6), p = rnd(1, 30) * 1000, f = fv(p, i / 100 / m, n * m);
    return { q: 'ฝาก <b>' + nf(p) + '</b> ดอกเบี้ย <b>' + i + '%</b> ต่อปี ทบต้น <b>' + m + '</b> ครั้งต่อปี นาน <b>' + n + '</b> ปี', fields: [{ label: 'FV', ans: f, tol: tl(f), unit: 'บาท', show: nf(f) }], why: nf(p) + ' × (1 + ' + i + '%/' + m + ')<sup>' + (n * m) + '</sup> = ' + nf(f) };
  } });
  /* PV */
  G.drill($('g-drill-pv'), { gen: function () {
    var f = rnd(2, 60) * 1000, i = pick([4, 5, 6, 8, 10, 12]), n = rnd(2, 12), p = pv(f, i / 100, n);
    return { q: 'จะได้รับ <b>' + nf(f) + '</b> บาท ในอีก <b>' + n + '</b> ปี อัตราคิดลด <b>' + i + '%</b> มีค่าวันนี้เท่าใด', fields: [{ label: 'PV', ans: p, tol: tl(p), unit: 'บาท', show: nf(p) }], why: nf(f) + ' ÷ (1.' + (i < 10 ? '0' + i : i) + ')<sup>' + n + '</sup> = ' + nf(p) };
  } });
  G.range(['pv-f', 'pv-i', 'pv-n'], function (f, i, n) {
    $('pv-fo').textContent = nf(f); $('pv-io').textContent = i.toFixed(1) + '%'; $('pv-no').textContent = n + ' ปี';
    var p = pv(f, i / 100, n);
    $('pv-v').textContent = nf(p); $('pv-x').textContent = (1 / Math.pow(1 + i / 100, n)).toFixed(4); $('pv-l').textContent = nf(f - p);
    var v = $('pv-vd'); v.className = 'verdict ok';
    v.textContent = 'รอ ' + n + ' ปี ที่ ' + i.toFixed(1) + '% เงิน ' + nf(f) + ' มีค่าวันนี้เพียง ' + nf(p) + ' (หายไป ' + nf(f - p) + ')';
  });
  G.sort($('g-ann'), {
    buckets: [{ id: 'o', label: 'Ordinary Annuity' }, { id: 'd', label: 'Annuity Due' }],
    items: [
      { t: 'ฝากทุกสิ้นปี', b: 'o', why: 'จ่ายปลายงวด' }, { t: 'ฝากทุกต้นปี', b: 'd', why: 'จ่ายต้นงวด' }, { t: 'จ่ายค่าเช่าล่วงหน้าต้นเดือน', b: 'd', why: 'จ่ายต้นงวด' },
      { t: 'ผ่อนชำระเงินกู้ปลายปี', b: 'o', why: 'ชำระสิ้นงวด' }, { t: 'ดอกเบี้ยพันธบัตรจ่ายสิ้นปี', b: 'o', why: 'รับปลายงวด' }, { t: 'มีมูลค่าอนาคตสูงกว่าเมื่อจำนวนเงินและงวดเท่ากัน', b: 'd', why: 'ทบต้นนานกว่า 1 งวด' }
    ]
  });
  G.drill($('g-drill-fva'), { gen: function () {
    var p = rnd(1, 20) * 500, i = pick([3, 4, 5, 6, 8, 10]), n = rnd(3, 12), due = Math.random() < 0.5, f = p * fa(i / 100, n) * (due ? 1 + i / 100 : 1);
    return { q: 'ฝาก <b>' + nf(p) + '</b> ทุก<b>' + (due ? 'ต้นปี' : 'สิ้นปี') + '</b> ดอกเบี้ย <b>' + i + '%</b> นาน <b>' + n + '</b> ปี สิ้นปีสุดท้ายมีเท่าใด', fields: [{ label: 'FV', ans: f, tol: tl(f), unit: 'บาท', show: nf(f) }], why: 'FVIFA = ' + fa(i / 100, n).toFixed(4) + (due ? ' และคูณ (1+i)' : '') + '  FV = ' + nf(f) };
  } });
  G.range(['fa-p', 'fa-i', 'fa-n', 'fa-d'], function (p, i, n, d) {
    $('fa-po').textContent = nf(p); $('fa-io').textContent = i.toFixed(1) + '%'; $('fa-no').textContent = n + ' งวด'; $('fa-do').textContent = d ? 'ต้นงวด (Due)' : 'ปลายงวด (Ordinary)';
    var x = fa(i / 100, n), f = p * x * (d ? 1 + i / 100 : 1);
    $('fa-f').textContent = nf(f); $('fa-x').textContent = x.toFixed(4); $('fa-t').textContent = nf(p * n); $('fa-g').textContent = nf(f - p * n);
    var arr = [], k, b = 0; for (k = 1; k <= n; k++) { if (d) { b = (b + p) * (1 + i / 100); } else { b = b * (1 + i / 100) + p; } arr.push(b); } bars($('fa-chart'), arr, '#2BA6A0', 'ยอดเงินสะสมแต่ละงวด');
    var v = $('fa-vd'); v.className = 'verdict ok';
    v.textContent = 'ฝากรวม ' + nf(p * n) + ' ได้เงินสะสม ' + nf(f) + ' ดอกเบี้ยช่วย ' + nf(f - p * n) + (d ? ' (ฝากต้นงวดได้มากกว่า Ordinary ' + nf(f - f / (1 + i / 100)) + ')' : '');
  });
  G.drill($('g-drill-pmt'), { gen: function () {
    var f = rnd(5, 100) * 10000, i = pick([3, 4, 5, 6, 8]), n = rnd(3, 15), pm = f / fa(i / 100, n);
    return { q: 'ต้องการ <b>' + nf(f) + '</b> ในอีก <b>' + n + '</b> ปี ดอกเบี้ย <b>' + i + '%</b> ฝากสิ้นปีเท่ากันทุกปี ปีละเท่าใด', fields: [{ label: 'PMT', ans: pm, tol: tl(pm), unit: 'บาท', show: nf(pm) }], why: nf(f) + ' ÷ ' + fa(i / 100, n).toFixed(4) + ' = ' + nf(pm) };
  } });
  G.drill($('g-drill-pva'), { gen: function () {
    var p = rnd(1, 30) * 500, i = pick([4, 5, 6, 8, 10]), n = rnd(3, 15), due = Math.random() < 0.5, v = p * pa(i / 100, n) * (due ? 1 + i / 100 : 1);
    return { q: 'จะรับ <b>' + nf(p) + '</b> ทุก<b>' + (due ? 'ต้นปี' : 'สิ้นปี') + '</b> นาน <b>' + n + '</b> ปี อัตราคิดลด <b>' + i + '%</b> มีค่าวันนี้เท่าใด', fields: [{ label: 'PV', ans: v, tol: tl(v), unit: 'บาท', show: nf(v) }], why: 'PVIFA = ' + pa(i / 100, n).toFixed(4) + (due ? ' และคูณ (1+i)' : '') + '  PV = ' + nf(v) };
  } });
  G.range(['pa-p', 'pa-i', 'pa-n', 'pa-d'], function (p, i, n, d) {
    $('pa-po').textContent = nf(p); $('pa-io').textContent = i.toFixed(1) + '%'; $('pa-no').textContent = n + ' งวด'; $('pa-do').textContent = d ? 'ต้นงวด (Due)' : 'ปลายงวด (Ordinary)';
    var x = pa(i / 100, n), v = p * x * (d ? 1 + i / 100 : 1);
    $('pa-v').textContent = nf(v); $('pa-x').textContent = x.toFixed(4); $('pa-t').textContent = nf(p * n); $('pa-l').textContent = nf(p * n - v);
    var e = $('pa-vd'); e.className = 'verdict ok';
    e.textContent = 'เงินรับรวม ' + nf(p * n) + ' แต่มีค่าวันนี้ ' + nf(v) + ' เพราะเงินปีหลัง ๆ ถูกคิดลดมากกว่า';
  });
  /* loan */
  G.range(['ln-p', 'ln-i', 'ln-n'], function (p, i, n) {
    $('ln-po').textContent = nf(p); $('ln-io').textContent = i.toFixed(2) + '%'; $('ln-no').textContent = n + ' ปี';
    var pm = p / pa(i / 100, n), arr = [], b = p, k;
    $('ln-m').textContent = nf(pm); $('ln-t').textContent = nf(pm * n); $('ln-it').textContent = nf(pm * n - p); $('ln-s').textContent = (p * i / 100 / pm * 100).toFixed(0) + '%';
    for (k = 0; k < n; k++) { arr.push(b); b = b * (1 + i / 100) - pm; } bars($('ln-chart'), arr, '#B4412E', 'เงินต้นคงเหลือต้นปีแต่ละปี');
    var v = $('ln-vd'); v.className = 'verdict ok';
    v.textContent = 'ผ่อนปีละ ' + nf(pm) + ' ดอกเบี้ยรวม ' + nf(pm * n - p) + ' (' + ((pm * n - p) / p * 100).toFixed(0) + '% ของเงินกู้) ปีแรกส่วนใหญ่เป็นดอกเบี้ย เงินต้นลดช้า';
  });
  G.drill($('g-drill-ln'), { gen: function () {
    var p = rnd(2, 50) * 10000, i = pick([5, 6, 8, 10, 12]), n = rnd(2, 10), pm = p / pa(i / 100, n);
    return { q: 'กู้ <b>' + nf(p) + '</b> ดอกเบี้ย <b>' + i + '%</b> ต่อปี ผ่อนสิ้นปีเท่ากัน <b>' + n + '</b> ปี', fields: [{ label: 'เงินผ่อนต่อปี', ans: pm, tol: tl(pm), unit: 'บาท', show: nf(pm) }, { label: 'ดอกเบี้ยปีแรก', ans: p * i / 100, tol: 1, unit: 'บาท', show: nf(p * i / 100) }], why: 'PVIFA = ' + pa(i / 100, n).toFixed(4) + '  PMT = ' + nf(pm) + '  ดอกเบี้ยปี 1 = ' + nf(p) + ' × ' + i + '%' };
  } });
  G.quiz($('g-q7'), { questions: [
    { q: 'ฝาก 10,000 ที่ 8% ทบต้นรายปี 5 ปี ได้เท่าใด', o: ['14,693', '14,000', '13,310', '15,000'], a: 0, why: '10,000 × 1.08<sup>5</sup> = 14,693' },
    { q: 'ต้องการ 50,000 ใน 4 ปี ที่ 5% ต้องฝากวันนี้', o: ['41,135', '40,000', '43,000', '60,775'], a: 0, why: '50,000 ÷ 1.05<sup>4</sup> = 41,135' },
    { q: 'ทบต้นบ่อยขึ้นในอัตราประกาศเดิม ผลต่อ FV คือ', o: ['เพิ่มขึ้น', 'ลดลง', 'เท่าเดิม'], a: 0, why: 'ดอกเบี้ยเริ่มให้ดอกเบี้ยเร็วขึ้น' },
    { q: 'อัตราคิดลดสูงขึ้น PV ของเงินอนาคตจะ', o: ['ลดลง', 'เพิ่มขึ้น', 'เท่าเดิม'], a: 0, why: 'หารด้วย (1+i)<sup>n</sup> ที่ใหญ่ขึ้น' },
    { q: 'ฝากปีละ 2,000 ทุกสิ้นปี 10 ปี ที่ 6% FVIFA = 13.1808 ได้เท่าใด', o: ['26,362', '20,000', '13,181', '28,000'], a: 0, why: '2,000 × 13.1808 = 26,362' },
    { q: 'ถ้าฝากต้นปีแทนข้อ 5 จำนวนเงินเป็น', o: ['27,944', '26,362', '24,870', '20,000'], a: 0, why: '26,362 × 1.06 = 27,944' },
    { q: 'กู้ 100,000 ที่ 8% ผ่อนสิ้นปี 5 ปี PVIFA = 3.9927 ผ่อนปีละ', o: ['25,046', '20,000', '29,000', '18,500'], a: 0, why: '100,000 ÷ 3.9927 = 25,046' },
    { q: 'ข้อใดเป็นการเทียบกระแสเงินสดต่างเวลาที่ถูกต้อง', o: ['แปลงมาไว้ ณ เวลาเดียวกันก่อน', 'บวกตัวเลขโดยตรง', 'ใช้ค่าเฉลี่ย'], a: 0, why: 'ต้องใช้ FV หรือ PV ให้อยู่เวลาเดียวกัน' }
  ] });
})();
/*XTRA-START*/
(function(){var G=Games,$=function(i){return document.getElementById(i)};var rnd=function(a,b){return a+Math.floor(Math.random()*(b-a+1))};var pick=function(a){return a[rnd(0,a.length-1)]};var d1=function(v){return (Math.round(v*10)/10).toFixed(1)};var d2=function(v){return (Math.round(v*100)/100).toFixed(2)};var nf=function(v){return G.fmt(Math.round(v),0)};
})();
/*XTRA-END*/
