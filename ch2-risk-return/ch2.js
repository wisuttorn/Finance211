/* Chapter 2 – Risk & Return: games, drills and simulations */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var money = function (n) { return (n < 0 ? '−' : '') + G.fmt(Math.abs(n)); };

  /* ---------- Poll / sorters / match ---------- */
  G.tally($('g-poll'), { options: ['สินทรัพย์ระยะสั้น <span class="en">(ออมทรัพย์ บัตรเงินฝาก)</span>', 'สินทรัพย์ระยะปานกลาง <span class="en">(พันธบัตร หุ้นกู้)</span>', 'หุ้น หรือกองทุนตราสารทุน', 'อื่น ๆ <span class="en">(อสังหาริมทรัพย์ อนุพันธ์)</span>'] });
  G.tally($('g-att'), { options: ['กลัวความเสี่ยง <span class="en">(Risk Averse)</span>', 'เฉย ๆ กับความเสี่ยง <span class="en">(Risk Neutral)</span>', 'รักความเสี่ยง <span class="en">(Risk Seeking)</span>'] });
  G.sort($('g-cash'), {
    buckets: [{ id: 'c', label: 'กระแสเงินสด (นักการเงินสนใจ)' }, { id: 'a', label: 'กำไรทางบัญชี' }],
    items: [
      { t: 'เงินปันผลที่โอนเข้าบัญชีแล้ว', b: 'c', why: 'เป็นเงินสดที่ผู้ลงทุนได้รับจริง' },
      { t: 'รายได้จากการขายเชื่อที่ยังไม่ได้รับเงิน', b: 'a', why: 'บันทึกเป็นรายได้แล้ว แต่ยังไม่มีเงินสดเข้า' },
      { t: 'เงินสดที่ได้จากการขายหุ้นออกไป', b: 'c', why: 'เป็นเงินสดรับจริง' },
      { t: 'ค่าเสื่อมราคาเครื่องจักร', b: 'a', why: 'เป็นรายการทางบัญชี ไม่ใช่เงินสดจ่ายออกในงวดนั้น' },
      { t: 'ดอกเบี้ยรับที่ได้เป็นเงินสด', b: 'c', why: 'เป็นเงินสดรับจริง' },
      { t: 'กำไรสุทธิตามงบกำไรขาดทุน', b: 'a', why: 'เป็นตัวเลขทางบัญชี อาจยังไม่ได้เป็นเงินสด' }
    ]
  });
  G.match($('g-match1'), { pairs: [
    ['ความไม่แน่นอน (Uncertainty)', 'ไม่รู้แน่ว่าอนาคตจะเกิดอะไรขึ้น'],
    ['ความเสี่ยง (Risk)', 'ระดับของความไม่แน่นอนว่ามีมากน้อยเพียงใด'],
    ['ความเสี่ยงทางธุรกิจ', 'กระแสเงินสดคลาดเคลื่อนจากความเสี่ยงด้านการขายและการดำเนินงาน'],
    ['ความเสี่ยงทางการเงิน', 'ภาระดอกเบี้ยและเงินต้นจากการจัดหาเงินทุนโดยการกู้ยืม'],
    ['ผลตอบแทนที่คาดหวัง', 'ค่าเฉลี่ยของผลตอบแทน ถ่วงน้ำหนักด้วยความน่าจะเป็น']
  ] });
  G.sort($('g-brfr'), {
    buckets: [{ id: 'b', label: 'ความเสี่ยงทางธุรกิจ (Business Risk)' }, { id: 'f', label: 'ความเสี่ยงทางการเงิน (Financial Risk)' }],
    items: [
      { t: 'ยอดขายลดลงเพราะคู่แข่งรายใหม่', b: 'b', why: 'เกี่ยวกับการขายและการดำเนินงาน' },
      { t: 'กู้เงินมากจนภาระดอกเบี้ยสูง', b: 'f', why: 'มาจากการจัดหาเงินทุนด้วยการกู้ยืม' },
      { t: 'ต้นทุนคงที่สูง กำไรผันผวนตามยอดขาย', b: 'b', why: 'โครงสร้างต้นทุนของการดำเนินงาน' },
      { t: 'ออกหุ้นกู้จนสัดส่วนหนี้สินสูงมาก', b: 'f', why: 'โครงสร้างเงินทุน' },
      { t: 'เครื่องจักรเสียทำให้ผลิตไม่ได้', b: 'b', why: 'ปัญหาด้านการดำเนินงาน' },
      { t: 'ดอกเบี้ยเงินกู้ปรับขึ้น กระทบความสามารถชำระหนี้', b: 'f', why: 'ภาระผูกพันจากการกู้ยืม' }
    ]
  });
  G.match($('g-match2'), { pairs: [
    ['ความเสี่ยงที่ไม่เป็นระบบ', 'กระจายการลงทุน (Diversification) แทบไม่มีต้นทุน'],
    ['ความเสี่ยงที่เป็นระบบ', 'ป้องกันความเสี่ยง (Hedge) มีต้นทุน'],
    ['เบต้า (β)', 'วัดความไวต่อความเสี่ยงที่เป็นระบบ'],
    ['ถือหุ้นหลายบริษัทหลายอุตสาหกรรม', 'ลดความเสี่ยงเฉพาะตัวของแต่ละบริษัท'],
    ['อัตราแลกเปลี่ยนผันผวน', 'เป็นความเสี่ยงที่เป็นระบบ ลด Exposure ด้วย Hedge']
  ] });
  G.sort($('g-sys'), {
    buckets: [{ id: 's', label: 'เป็นระบบ (Systematic)' }, { id: 'u', label: 'ไม่เป็นระบบ (Unsystematic)' }],
    items: [
      { t: 'เศรษฐกิจถดถอยทั้งประเทศ', b: 's', why: 'กระทบทุกธุรกิจ' },
      { t: 'ผู้บริหารหลักของบริษัทลาออกกะทันหัน', b: 'u', why: 'เกิดกับบริษัทเดียว' },
      { t: 'ธนาคารกลางขึ้นอัตราดอกเบี้ย', b: 's', why: 'กระทบทั้งตลาด' },
      { t: 'โรงงานของบริษัทไฟไหม้', b: 'u', why: 'เป็นเหตุเฉพาะบริษัท' },
      { t: 'ค่าเงินบาทผันผวนรุนแรง', b: 's', why: 'ความเสี่ยงอัตราแลกเปลี่ยนกระทบทั้งระบบ' },
      { t: 'พนักงานบริษัทหนึ่งนัดหยุดงาน', b: 'u', why: 'เป็นปัญหาเฉพาะบริษัท' },
      { t: 'ราคาน้ำมันโลกพุ่งสูง กระทบทุกอุตสาหกรรม', b: 's', why: 'ความเสี่ยงด้านราคาสินค้า กระทบทั้งระบบ' },
      { t: 'สินค้าใหม่ของบริษัทหนึ่งขายไม่ออก', b: 'u', why: 'เป็นความเสี่ยงเฉพาะตัว' }
    ]
  });
  G.order($('g-order'), { items: [
    'คำนวณผลตอบแทนที่คาดหวัง (R̄)',
    'หาส่วนเบี่ยงเบนของแต่ละเหตุการณ์จาก R̄  (R − R̄)',
    'ยกกำลังสองส่วนเบี่ยงเบน  (R − R̄)²',
    'คูณด้วยความน่าจะเป็นของแต่ละเหตุการณ์  (R − R̄)² × P',
    'รวมทุกเหตุการณ์ ได้ความแปรปรวน (σ²)',
    'ถอดรากที่สอง ได้ส่วนเบี่ยงเบนมาตรฐาน (σ)'
  ] });

  /* ---------- Quizzes ---------- */
  G.quiz($('g-q1'), { questions: [
    { q: 'A และ B มีผลตอบแทนที่คาดหวัง 15% เท่ากัน ใครเสี่ยงกว่า', o: ['A', 'B', 'เสี่ยงเท่ากัน เพราะ R̄ เท่ากัน'], a: 1, why: 'B มี SD 5.66% สูงกว่า A (1.41%) ผลตอบแทนกระจายตัวห่างจาก 15% มากกว่า' },
    { q: 'เหตุใด SD ของ B จึงมากกว่า A ประมาณ 4 เท่า', o: ['B มีความน่าจะเป็นสูงกว่า', 'ผลตอบแทนของ B ห่างจาก R̄ ถึง ±8% ขณะที่ A ห่างเพียง ±2%', 'B มีเหตุการณ์มากกว่า'], a: 1, why: 'ส่วนเบี่ยงเบนยกกำลังสองของ B คือ 64 ส่วนของ A คือ 4' },
    { q: 'ถ้า A มี R̄ 15%, σ 1.41% และ B มี R̄ 18%, σ 5.66% ควรใช้เกณฑ์ใดเปรียบเทียบความเสี่ยงต่อหนึ่งหน่วยผลตอบแทน', o: ['พิสัย', 'สัมประสิทธิ์ความแปรปรวน (CV)', 'ผลตอบแทนอย่างเดียว'], a: 1, why: 'CV ของ A = 0.09 ต่ำกว่า CV ของ B = 0.31 จึงเสี่ยงต่อหน่วยผลตอบแทนน้อยกว่า' }
  ] });
  G.quiz($('g-q2'), { questions: [
    { q: 'นักลงทุนเฉย ๆ กับความเสี่ยง เลือกเส้น I₁ (ผลตอบแทนสูง) หรือ I₂ (ผลตอบแทนต่ำ)', o: ['I₁', 'I₂'], a: 0, why: 'ไม่สนใจความเสี่ยง จึงเลือกผลตอบแทนที่สูงกว่า' },
    { q: 'นักลงทุนกลัวความเสี่ยง เส้น I₃ อยู่ซ้ายกว่า I₄ ควรเลือกเส้นใด', o: ['I₃', 'I₄'], a: 0, why: 'ที่ผลตอบแทนเท่ากัน I₃ มีความเสี่ยงต่ำกว่า จึงพอใจกว่า' },
    { q: 'เหตุใดเส้นความพอใจของนักลงทุนที่กลัวความเสี่ยงจึงลาดขึ้น', o: ['ความเสี่ยงเพิ่มขึ้น ต้องได้ผลตอบแทนเพิ่มเพื่อให้พอใจเท่าเดิม', 'ยิ่งเสี่ยง ยิ่งยอมรับผลตอบแทนต่ำ', 'ผลตอบแทนไม่เกี่ยวกับความเสี่ยง'], a: 0, why: 'ต้องการค่าตอบแทนสำหรับความเสี่ยงที่เพิ่มขึ้น' }
  ] });
  G.quiz($('g-q3'), { questions: [
    { q: 'เหลือ Project 2 (R̄ 20%, σ 0) กับ Project 3 (R̄ 26%, σ 24.7%) ผู้กลัวความเสี่ยงมักเลือกอะไร', o: ['Project 2', 'Project 3'], a: 0, why: 'ผลตอบแทนเพิ่ม 6% แต่ต้องรับ σ 24.7% จึงไม่คุ้มสำหรับผู้กลัวความเสี่ยง ผู้รักความเสี่ยงอาจเลือก Project 3' },
    { q: 'ถ้ามี Project 6 ที่ R̄ 26% และ σ 10% จะเกิดอะไรกับ Project 3', o: ['ยังเหมาะเท่าเดิม', 'ถูกตัดทิ้ง เพราะผลตอบแทนเท่ากันแต่ Project 6 เสี่ยงน้อยกว่า'], a: 1, why: 'Project 6 ครอบงำ Project 3' }
  ] });
  G.quiz($('g-final'), { questions: [
    { q: 'ซื้อหุ้น 50 บาท ได้ปันผล 2 บาท ขายที่ 56 บาท อัตราผลตอบแทนเท่าใด', o: ['12%', '16%', '8%', '4%'], a: 1, why: '(2 + 6) ÷ 50 = 16%' },
    { q: 'ผลตอบแทน 0%, 10%, 20% ความน่าจะเป็น 0.3, 0.4, 0.3 ผลตอบแทนที่คาดหวังเท่าใด', o: ['8%', '10%', '12%', '15%'], a: 1, why: '0 + 4 + 6 = 10%' },
    { q: 'โครงการ X: R̄ 12%, σ 6% และ Y: R̄ 20%, σ 15% โครงการใดเสี่ยงต่อหน่วยผลตอบแทนน้อยกว่า', o: ['X (CV 0.50)', 'Y (CV 0.75)', 'เท่ากัน'], a: 0, why: 'CV ของ X = 6 ÷ 12 = 0.50 ต่ำกว่า' },
    { q: 'ข้อใดเป็นความเสี่ยงที่เป็นระบบ', o: ['ผู้บริหารหลักลาออก', 'ธนาคารกลางขึ้นดอกเบี้ย', 'โรงงานบริษัทไฟไหม้', 'สินค้าใหม่ขายไม่ดี'], a: 1, why: 'กระทบทั้งตลาด ไม่ใช่เฉพาะบริษัท' },
    { q: 'การกระจายการลงทุนลดความเสี่ยงชนิดใดได้', o: ['ที่เป็นระบบ', 'ที่ไม่เป็นระบบ', 'ทั้งสองชนิด', 'ไม่ลดเลย'], a: 1, why: 'ความเสี่ยงเฉพาะตัวหักล้างกันในพอร์ต ส่วนที่เป็นระบบยังอยู่' },
    { q: 'โครงการสองแห่ง R̄ เท่ากัน ผู้กลัวความเสี่ยงเลือกโครงการใด', o: ['ที่ σ สูงกว่า', 'ที่ σ ต่ำกว่า', 'เลือกอย่างไรก็ได้'], a: 1, why: 'ผลตอบแทนเท่ากัน เลือกที่เสี่ยงน้อยกว่า' },
    { q: 'โครงการ P (R̄ 20%, σ 10%) กับ Q (R̄ 15%, σ 10%)', o: ['Q ด้อยกว่า P', 'P ด้อยกว่า Q', 'เลือกไม่ได้'], a: 0, why: 'ความเสี่ยงเท่ากัน แต่ P ผลตอบแทนสูงกว่า' },
    { q: 'เหตุใดนักการเงินใช้ SD มากกว่าพิสัย', o: ['คำนวณง่ายกว่า', 'SD คำนึงถึงความน่าจะเป็นและการกระจายของทุกเหตุการณ์', 'พิสัยใช้ไม่ได้เลย'], a: 1, why: 'พิสัยดูแค่ค่าสูงสุดและต่ำสุด' },
    { q: 'Hedge ใช้จัดการความเสี่ยงชนิดใดเป็นหลัก', o: ['ที่ไม่เป็นระบบ', 'ที่เป็นระบบ', 'ความเสี่ยงของบริษัทเดียว'], a: 1, why: 'กระจายความเสี่ยงที่เป็นระบบไม่ได้ จึงต้องป้องกันด้วย Hedge ซึ่งมีต้นทุน' },
    { q: 'ถ้า σ² ของโครงการเท่ากับ 144 ค่า σ เท่าใด', o: ['6', '12', '24', '72'], a: 1, why: '√144 = 12' }
  ] });

  /* ---------- Random drills ---------- */
  G.drill($('g-drill1'), { gen: function () {
    var bond = Math.random() < 0.5, buy = rnd(8, 40) * 5, inc = rnd(1, Math.max(2, Math.round(buy * 0.08))), sell = buy + rnd(-Math.round(buy * 0.2), Math.round(buy * 0.3));
    if (sell === buy) sell += 2;
    var iy = inc / buy * 100, cg = (sell - buy) / buy * 100, tot = iy + cg, nm = bond ? 'หุ้นกู้' : 'หุ้นสามัญ', ik = bond ? 'ดอกเบี้ยรับ' : 'เงินปันผล';
    var f1 = function (v) { return (Math.round(v * 10) / 10).toFixed(1); };
    return {
      q: 'ซื้อ' + nm + 'ต้นปีที่ราคา <b>' + buy + '</b> บาท ปลายปีได้' + ik + ' <b>' + inc + '</b> บาท แล้วขายได้ <b>' + sell + '</b> บาท',
      fields: [{ label: ik + ' ÷ ราคาซื้อ', ans: iy, tol: 0.06, unit: '%', show: f1(iy) }, { label: '(ราคาขาย − ราคาซื้อ) ÷ ราคาซื้อ', ans: cg, tol: 0.06, unit: '%', show: f1(cg) }, { label: 'อัตราผลตอบแทนรวม', ans: tot, tol: 0.06, unit: '%', show: f1(tot) }],
      why: '(' + inc + ' + ' + (sell - buy) + ') ÷ ' + buy + ' = ' + f1(tot) + '%'
    };
  } });
  G.drill($('g-drill2'), { gen: function () {
    var a, b, ca, cb;
    do { a = [rnd(8, 30), rnd(5, 40)]; b = [rnd(8, 30), rnd(5, 40)]; ca = a[1] / a[0]; cb = b[1] / b[0]; } while (Math.abs(ca - cb) < 0.08);
    var f2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
    return {
      q: 'โครงการ A: R̄ = <b>' + a[0] + '%</b>, σ = <b>' + a[1] + '%</b> &nbsp;|&nbsp; โครงการ B: R̄ = <b>' + b[0] + '%</b>, σ = <b>' + b[1] + '%</b>',
      fields: [{ label: 'CV ของ A', ans: ca, tol: 0.011, show: f2(ca) }, { label: 'CV ของ B', ans: cb, tol: 0.011, show: f2(cb) }, { label: 'โครงการที่เสี่ยงน้อยกว่าต่อหนึ่งหน่วยผลตอบแทน (พิมพ์ 1 = A, 2 = B)', ans: ca < cb ? 1 : 2, tol: 0, show: ca < cb ? '1' : '2' }],
      why: 'CV ของ A = ' + f2(ca) + ', CV ของ B = ' + f2(cb) + ' ค่าต่ำกว่าคือเสี่ยงน้อยกว่า'
    };
  } });

  /* ---------- Return simulator ---------- */
  (function () {
    var d = $('rd'), s = $('rs');
    function up() {
      var dv = parseFloat(d.value), sv = parseFloat(s.value), dy = dv / 100 * 100, cg = (sv - 100), tot = dy + cg;
      $('rdo').textContent = dv.toFixed(1) + ' บาท'; $('rso').textContent = sv + ' บาท';
      var set = function (i, v) { $('rb' + i).style.width = Math.min(100, Math.abs(v) / 60 * 100) + '%'; $('rb' + i).style.background = v < 0 ? 'var(--bad)' : ['', 'var(--purple)', 'var(--teal)', 'var(--green)'][i]; $('rv' + i).textContent = v.toFixed(1) + '%'; };
      set(1, dy); set(2, cg); set(3, tot);
      var vd = $('rvd'); vd.className = 'verdict ' + (Math.abs(tot - 15) < 0.05 ? 'ok' : tot < 0 ? 'bad' : 'w');
      vd.textContent = Math.abs(tot - 15) < 0.05 ? 'ได้ 15.0% พอดี! ' : tot < 0 ? 'ขาดทุน: ราคาที่ลดลงมากกว่าเงินปันผลที่ได้' : 'ผลตอบแทนรวม = ' + dy.toFixed(1) + '% + ' + cg.toFixed(1) + '% = ' + tot.toFixed(1) + '%';
    }
    d.addEventListener('input', up); s.addEventListener('input', up); up();
  })();

  /* ---------- Certainty equivalent ---------- */
  (function () {
    var games = [{ hi: 100000, lo: 0, d: 'โยนเหรียญ ออกหัวได้ 100,000 บาท ออกก้อยได้ 0 บาท (โอกาสละ 50%) หรือรับเงินแน่นอนแทน' }, { hi: 200000, lo: -100000, d: 'โยนเหรียญ ออกหัวได้ 200,000 บาท ออกก้อยเสีย 100,000 บาท (โอกาสละ 50%) หรือรับเงินแน่นอนแทน' }], cur = 0, ce = $('ce');
    function up() {
      var g = games[cur], ev = (g.hi + g.lo) / 2, v = parseFloat(ce.value), pr = ev - v;
      $('gdesc').textContent = g.d; $('ceo').textContent = money(v); $('gev').textContent = money(ev); $('gce').textContent = money(v); $('gpr').textContent = money(pr);
      var vd = $('gverd'), t;
      if (Math.abs(pr) <= 1500) { vd.className = 'verdict w'; t = 'เฉย ๆ กับความเสี่ยง (Risk Neutral): ยอมรับเงินแน่นอนเท่ากับค่าคาดหวัง'; }
      else if (pr > 0) { vd.className = 'verdict ok'; t = 'กลัวความเสี่ยง (Risk Averse): ยอมรับเงินแน่นอนต่ำกว่าค่าคาดหวัง ยอมสละ ' + money(pr) + ' บาท เพื่อตัดความไม่แน่นอน'; }
      else { vd.className = 'verdict bad'; t = 'รักความเสี่ยง (Risk Seeking): ต้องได้เงินแน่นอนมากกว่าค่าคาดหวังจึงจะยอมแลกกับการเล่นเกม'; }
      vd.textContent = t;
    }
    function pick(i) { cur = i; $('gm1').className = 'btn sm' + (i ? ' ghost' : ''); $('gm2').className = 'btn sm' + (i ? '' : ' ghost'); ce.min = Math.min(games[i].lo, 0) - 20000; ce.max = games[i].hi + 20000; ce.value = (games[i].hi + games[i].lo) / 2 - 20000; up(); }
    $('gm1').onclick = function () { pick(0); }; $('gm2').onclick = function () { pick(1); }; ce.addEventListener('input', up); pick(0);
  })();

  /* ---------- Probability playground ---------- */
  (function () {
    var pp = $('pp'), po = $('po');
    function up(e) {
      var a = parseFloat(pp.value), b = parseFloat(po.value);
      if (a + b > 100) { if (e && e.target === pp) b = 100 - a; else a = 100 - b; pp.value = a; po.value = b; }
      var m = 100 - a - b, P = [a / 100, m / 100, b / 100], R = [7, 15, 23], E = 0, V = 0, i;
      for (i = 0; i < 3; i++) E += R[i] * P[i]; for (i = 0; i < 3; i++) V += Math.pow(R[i] - E, 2) * P[i];
      $('ppo').textContent = a + '%'; $('poo').textContent = b + '%'; $('pmid').textContent = 'โอกาสเป็นไปได้มากที่สุด (15%) = ' + m + '%';
      $('pe').textContent = E.toFixed(2) + '%'; $('ps').textContent = Math.sqrt(V).toFixed(2) + '%';
      var rg = (P[0] > 0 ? 7 : P[1] > 0 ? 15 : 23); var lo = P[0] > 0 ? 7 : (P[1] > 0 ? 15 : 23), hi = P[2] > 0 ? 23 : (P[1] > 0 ? 15 : 7);
      $('pr').textContent = '16% (ตามเดิม)';
      $('pv').className = 'verdict ' + (V < 1 ? 'ok' : 'w');
      $('pv').textContent = V < 1 ? 'SD เกือบเป็น 0 แล้ว ทั้งที่พิสัยของสินทรัพย์ยังเป็น 16%: พิสัยไม่สะท้อนความน่าจะเป็น' : 'พิสัยยังเท่าเดิม แต่ SD เปลี่ยนตามโอกาสของแต่ละสถานการณ์';
    }
    pp.addEventListener('input', up); po.addEventListener('input', up); up();
  })();

  /* ---------- SD Lab ---------- */
  G.sdlab($('g-lab'), { presets: [
    { name: 'หุ้นบริษัทหนึ่ง', rows: [[-10, .1], [5, .2], [15, .4], [25, .2], [40, .1]] },
    { name: 'สินทรัพย์ A', rows: [[13, .25], [15, .5], [17, .25]] },
    { name: 'สินทรัพย์ B', rows: [[7, .25], [15, .5], [23, .25]] },
    { name: 'Project 3', rows: [[-16, .25], [36, .5], [48, .25]] },
    { name: 'Project 4', rows: [[-8, .25], [16, .5], [24, .25]] },
    { name: 'Project 5', rows: [[-40, .1], [0, .6], [100, .3]] }
  ] });

  /* ---------- Risk tolerance questionnaire ---------- */
  var RT = {}, QDATA = [
    { id: 1, multi: true, q: '1. ประสบการณ์ลงทุน (เลือกได้หลายข้อ ใช้คะแนนสูงสุดของข้อที่เลือก)', o: [['สินทรัพย์ระยะสั้นที่ให้ผลตอบแทนสม่ำเสมอ เช่น บัญชีออมทรัพย์ บัตรเงินฝาก กองทุนรวมตลาดเงิน', 0], ['สินทรัพย์ระยะปานกลาง เช่น พันธบัตร หุ้นกู้ กองทุนตราสารหนี้', 3], ['สินทรัพย์ที่มูลค่ามีโอกาสเพิ่มสูงในระยะยาว เช่น หุ้น กองทุนตราสารทุน', 5], ['อื่น ๆ เช่น อสังหาริมทรัพย์ ตราสารอนุพันธ์ สินค้าเกษตรล่วงหน้า', 6]] },
    { id: 2, q: '2. ข้อความใดเกี่ยวกับเงินเฟ้อที่อธิบายความรู้สึกของคุณ', o: [['พอใจกับการลงทุนที่เสี่ยงต่ำ แม้ผลตอบแทนใกล้เคียงเงินเฟ้อ', 0], ['ยอมรับการขาดทุนเล็กน้อย เพื่อโอกาสได้ผลตอบแทนสูงกว่าเงินเฟ้อ', 8], ['หวังผลตอบแทนสูงกว่าเงินเฟ้อมาก แม้เสี่ยงขาดทุนสูง', 14]] },
    { id: 3, q: '3. คุณลงทุนในกองทุนรวมที่ในอดีตได้ผลตอบแทน 10% ต่อปี บางปีได้ 25% หรือขาดทุน 10% ตั้งแต่ซื้อเมื่อ 1 ปีก่อน คุณขาดทุน 10% คุณจะ', o: [['ขายทิ้งทั้งหมด', 0], ['ขายครึ่งหนึ่งและเก็บไว้ครึ่งหนึ่ง', 4], ['ถือไว้ทั้งหมด', 10], ['ซื้อเพิ่ม', 14]] },
    { id: 4, q: '4. ปัจจัยหลักที่ให้ความสำคัญที่สุดในการตัดสินใจลงทุน', o: [['เฉพาะความเป็นไปได้ที่จะขาดทุน', 0], ['คำนึงถึงโอกาสขาดทุน แต่ยังคำนึงถึงโอกาสทำกำไรด้วย', 4], ['โอกาสทำกำไรหรือขาดทุนเท่า ๆ กัน', 6], ['โอกาสทำกำไรเป็นหลัก แต่ยังคำนึงถึงโอกาสขาดทุน', 10], ['เฉพาะโอกาสที่จะทำกำไร', 14]] },
    { id: 5, q: '5. มีเงิน 5,000 บาท ลงทุน 5 ปี เลือกข้อใดข้อหนึ่ง', o: [['ลงทุนใน X: ได้ผลตอบแทนแน่นอน 500 บาท', 0], ['ลงทุนใน Y: 70% ได้กำไร 1,000 บาท และ 30% ขาดทุน 500 บาท', 10]] },
    { id: 6, q: '6. ซื้อกองทุนหุ้น 20,000 บาทเมื่อปีก่อน ตลาดตก มูลค่าเหลือ 16,000 บาท ถ้าเลือกการลงทุนที่มั่นคงกว่าวันนี้จะมีเงิน 21,000 บาท คุณจะ', o: [['ขายกองทุนหุ้นแล้วไปลงทุนอย่างอื่นที่มั่นคงกว่า', 0], ['ถือกองทุนนั้นต่อ', 6], ['เปลี่ยนไปลงทุนที่เสี่ยงสูงขึ้นเพื่อถอนทุนคืน', 8], ['ซื้อกองทุนนั้นเพิ่มเพราะราคาต่ำลง', 13]] },
    { id: 7, q: '7. ถ้าทุกกองทุนที่คุณลงทุนขาดทุนในปีนี้ คุณคิดจะขายบางส่วนไปลงทุนอย่างอื่นที่มั่นคงกว่าหรือไม่', o: [['ใช่', 0], ['ไม่ใช่', 11]] },
    { id: 8, q: '8. คุณเคยกู้ยืมเงินเพื่อมาซื้อหุ้นหรือไม่', o: [['ใช่', 10], ['ไม่ใช่', 0]] }
  ];
  function buildQ(el, ids) {
    el.innerHTML = '';
    QDATA.filter(function (q) { return ids.indexOf(q.id) >= 0; }).forEach(function (q) {
      var box = document.createElement('div'); box.className = 'game'; box.style.marginBottom = '.7rem';
      var html = '<div style="font-weight:600;margin-bottom:.4rem">' + q.q + '</div><div class="opt-grid">';
      q.o.forEach(function (o, k) { html += '<label><input type="' + (q.multi ? 'checkbox' : 'radio') + '" name="q' + q.id + '" data-q="' + q.id + '" data-s="' + o[1] + '"><span>' + o[0] + '</span></label>'; });
      box.innerHTML = html + '</div>'; el.appendChild(box);
    });
    el.addEventListener('change', function (e) {
      var i = e.target; if (!i.dataset || !i.dataset.q) return;
      var q = i.dataset.q, all = el.querySelectorAll('input[data-q="' + q + '"]:checked'), mx = null;
      Array.prototype.forEach.call(all, function (x) { var v = parseInt(x.dataset.s, 10); if (mx === null || v > mx) mx = v; });
      if (mx === null) delete RT[q]; else RT[q] = mx;
    });
  }
  buildQ($('rt1'), [1, 2, 3, 4]); buildQ($('rt2'), [5, 6, 7, 8]);
  $('s-result').addEventListener('slideshow', function () {
    var sc = 0, n = 0; Object.keys(RT).forEach(function (k) { sc += RT[k]; n++; });
    var miss = 8 - n; $('rt-score').textContent = sc + ' / 92';
    $('rt-pin').style.left = Math.min(98, sc / 92 * 100) + '%';
    var v = $('rt-verdict'), lv = sc < 40 ? ['ok', 'เสี่ยงต่ำ (Low Risk): ยอมรับความผันผวนได้น้อย เหมาะกับทรัพย์สินที่ผลตอบแทนแน่นอนกว่า'] : sc < 75 ? ['w', 'เสี่ยงปานกลาง (Moderate Risk): ยอมรับความผันผวนได้ระดับหนึ่งเพื่อผลตอบแทนที่สูงขึ้น'] : ['bad', 'เสี่ยงสูง (High Risk): ยอมรับความผันผวนสูงเพื่อโอกาสได้ผลตอบแทนมาก'];
    v.className = 'verdict ' + lv[0]; v.textContent = lv[1] + (miss ? '  (ยังไม่ได้ตอบ ' + miss + ' ข้อ นับเป็น 0 คะแนน)' : '');
  });

  /* ---------- Scatter elimination ---------- */
  (function () {
    var P = [{ n: 'Project 1', r: 16, s: 0 }, { n: 'Project 2', r: 20, s: 0 }, { n: 'Project 3', r: 26, s: 24.7 }, { n: 'Project 4', r: 12, s: 12 }, { n: 'Project 5', r: 26, s: 49.8 }], out = {}, el = $('g-scat');
    var DOM = { 0: 'Project 1 ด้อยกว่า Project 2 (σ = 0 เท่ากัน แต่ผลตอบแทนต่ำกว่า)', 3: 'Project 4 ด้อยกว่า Project 1 และ 2 (ผลตอบแทนต่ำกว่าและเสี่ยงกว่า)', 4: 'Project 5 ด้อยกว่า Project 3 (R̄ = 26% เท่ากัน แต่ σ สูงกว่า)' };
    var X = function (v) { return 50 + v / 55 * 440; }, Y = function (v) { return 290 - v / 30 * 260; };
    function draw() {
      var s = '<svg class="chart" viewBox="0 0 520 330" role="img" aria-label="กราฟ R̄ กับ σ"><line x1="50" y1="290" x2="500" y2="290" stroke="#58706A"/><line x1="50" y1="20" x2="50" y2="290" stroke="#58706A"/>';
      [0, 10, 20, 30].forEach(function (v) { s += '<line x1="50" y1="' + Y(v) + '" x2="500" y2="' + Y(v) + '" stroke="#DCE6E2"/><text x="42" y="' + (Y(v) + 4) + '" font-size="11" text-anchor="end" fill="#58706A">' + v + '</text>'; });
      [0, 10, 20, 30, 40, 50].forEach(function (v) { s += '<text x="' + X(v) + '" y="308" font-size="11" text-anchor="middle" fill="#58706A">' + v + '</text>'; });
      s += '<text x="275" y="326" font-size="12" text-anchor="middle" fill="#58706A">ความเสี่ยง σ (%)</text><text x="14" y="160" font-size="12" fill="#58706A" transform="rotate(-90 14 160)" text-anchor="middle">R̄ (%)</text>';
      P.forEach(function (p, i) {
        var x = X(p.s), y = Y(p.r), o = out[i], dx = i === 1 ? 10 : i === 0 ? 10 : 12, dy = i === 1 ? -10 : i === 0 ? 18 : -12;
        s += '<g class="sc-pt" data-i="' + i + '"><circle cx="' + x + '" cy="' + y + '" r="14" fill="' + (o ? '#FBE9E5' : '#F0E9F6') + '" stroke="' + (o ? '#B4412E' : '#7B4AA0') + '" stroke-width="2.5"/>' + (o ? '<path d="M' + (x - 8) + ' ' + (y - 8) + ' L' + (x + 8) + ' ' + (y + 8) + ' M' + (x + 8) + ' ' + (y - 8) + ' L' + (x - 8) + ' ' + (y + 8) + '" stroke="#B4412E" stroke-width="3"/>' : '<circle cx="' + x + '" cy="' + y + '" r="5" fill="#7B4AA0"/>') + '<text x="' + (x + dx + 8) + '" y="' + (y + dy) + '" font-size="12" font-weight="600" fill="' + (o ? '#B4412E' : '#12332B') + '">P' + (i + 1) + ' (' + p.r + ', ' + p.s + ')</text></g>';
      });
      s += '</svg>';
      el.innerHTML = s + '<div class="flow-ctl"><button class="btn pri" id="sc-chk">ตรวจคำตอบ</button><button class="btn ghost" id="sc-rst">ล้าง</button></div><div class="feedback" id="sc-fb"></div>';
      Array.prototype.forEach.call(el.querySelectorAll('.sc-pt'), function (g) { g.addEventListener('click', function () { var i = +g.dataset.i; out[i] = !out[i]; draw(); }); });
      $('sc-rst').onclick = function () { out = {}; draw(); };
      $('sc-chk').onclick = function () {
        var fb = $('sc-fb'), wrong = [], k;
        for (k = 0; k < 5; k++) { var should = DOM.hasOwnProperty(k), did = !!out[k]; if (did && !should) wrong.push('Project ' + (k + 1) + ' ยังไม่ถูกครอบงำ ห้ามตัดทิ้ง'); if (!did && should) wrong.push('ยังไม่ได้ตัด: ' + DOM[k]); }
        if (!wrong.length) { fb.className = 'feedback ok'; fb.innerHTML = 'ถูกต้อง! เหลือ Project 2 และ Project 3 เท่านั้น<br>' + Object.keys(DOM).map(function (k) { return DOM[k]; }).join('<br>'); }
        else { fb.className = 'feedback bad'; fb.innerHTML = wrong.join('<br>'); }
      };
    }
    draw();
  })();

  /* ---------- Diversification ---------- */
  (function () {
    var nn = $('nn'), svg = $('dvsvg');
    var th = function (n) { return Math.sqrt(400 + 900 / n); };
    function gauss() { var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function draw() {
      var n = parseInt(nn.value, 10), X = function (v) { return 50 + (v - 1) / 29 * 520; }, Y = function (v) { return 230 - v / 40 * 210; };
      var s = '<line x1="50" y1="230" x2="580" y2="230" stroke="#58706A"/><line x1="50" y1="20" x2="50" y2="230" stroke="#58706A"/>';
      [0, 10, 20, 30, 40].forEach(function (v) { s += '<line x1="50" y1="' + Y(v) + '" x2="580" y2="' + Y(v) + '" stroke="#DCE6E2"/><text x="42" y="' + (Y(v) + 4) + '" font-size="11" text-anchor="end" fill="#58706A">' + v + '</text>'; });
      [1, 5, 10, 15, 20, 25, 30].forEach(function (v) { s += '<text x="' + X(v) + '" y="246" font-size="11" text-anchor="middle" fill="#58706A">' + v + '</text>'; });
      s += '<line x1="50" y1="' + Y(20) + '" x2="580" y2="' + Y(20) + '" stroke="#1B7F6B" stroke-width="2" stroke-dasharray="6 4"/><text x="580" y="' + (Y(20) + 16) + '" font-size="12" text-anchor="end" fill="#1B7F6B">ความเสี่ยงที่เป็นระบบ 20%</text>';
      var pts = []; for (var k = 1; k <= 30; k++) pts.push(X(k) + ',' + Y(th(k)));
      s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#7B4AA0" stroke-width="3"/><circle cx="' + X(n) + '" cy="' + Y(th(n)) + '" r="7" fill="#B4412E"/><text x="' + (X(n) + (n > 20 ? -10 : 10)) + '" y="' + (Y(th(n)) - 10) + '" font-size="12" font-weight="600" fill="#B4412E" text-anchor="' + (n > 20 ? 'end' : 'start') + '">N = ' + n + '</text>';
      s += '<text x="315" y="262" font-size="12" text-anchor="middle" fill="#58706A">จำนวนหุ้นในพอร์ต</text>';
      svg.innerHTML = s; $('nno').textContent = n + ' ตัว'; $('dv-th').textContent = th(n).toFixed(2) + '%'; $('dv-mc').textContent = '–';
    }
    $('dv-run').onclick = function () {
      var n = parseInt(nn.value, 10), T = 3000, sum = 0, sq = 0, t, i;
      for (t = 0; t < T; t++) { var m = 20 * gauss(), e = 0; for (i = 0; i < n; i++) e += 30 * gauss(); var r = m + e / n; sum += r; sq += r * r; }
      var mean = sum / T; $('dv-mc').textContent = Math.sqrt(sq / T - mean * mean).toFixed(2) + '%';
    };
    nn.addEventListener('input', draw); draw();
  })();

  G.fills();
})();
