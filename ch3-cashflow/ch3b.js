/* Chapter 3 part 1: Financial statement analysis games */
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

})();
