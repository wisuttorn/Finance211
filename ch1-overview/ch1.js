/* Chapter 1 – games, simulations and interactive diagrams */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var money = function (n) { var s = G.fmt(Math.abs(n)); return n < 0 ? '(' + s + ')' : s; };

  /* ---------- Sorters ---------- */
  G.sort($('g-finecon'), {
    buckets: [{ id: 'f', label: 'การเงิน (Finance)' }, { id: 'e', label: 'เศรษฐศาสตร์ (Economics)' }],
    items: [
      { t: 'ธนาคารควรอนุมัติสินเชื่อให้ลูกค้ารายนี้หรือไม่', b: 'f', why: 'เรื่องการจัดสรรเงินทุนของธนาคาร' },
      { t: 'ประเทศควรจัดสรรที่ดินระหว่างภาคเกษตรกับภาคอุตสาหกรรมอย่างไร', b: 'e', why: 'จัดสรรทรัพยากรประเภทที่ดิน' },
      { t: 'บริษัทควรออกหุ้นกู้หรือกู้ธนาคารเพื่อระดมเงิน 50 ล้านบาท', b: 'f', why: 'เลือกแหล่งเงินทุน' },
      { t: 'ภาครัฐควรจัดสรรแรงงานและเทคโนโลยีอย่างไรเพื่อเพิ่มผลผลิตของประเทศ', b: 'e', why: 'จัดสรรแรงงานและเทคโนโลยี' },
      { t: 'กิจการควรซื้อเครื่องจักรใหม่หรือไม่ เมื่อเงินทุนมีจำกัด', b: 'f', why: 'ตัดสินใจลงทุนด้วยเงินทุนที่จำกัด' },
      { t: 'ราคาข้าวจะเปลี่ยนอย่างไรเมื่ออุปทานข้าวลดลง', b: 'e', why: 'กลไกตลาดและทรัพยากรโดยรวม' }
    ]
  });
  G.tally($('g-poll'), { options: ['ได้ส่วนแบ่งการตลาดตามเป้า <span class="en">(Achieving Target Market Share)</span>', 'อยู่รอดปลอดภัย <span class="en">(Survival)</span>', 'ขยายอาณาจักร <span class="en">(Expanding Empire)</span>', 'สร้างกำไรสูงสุดให้แก่กิจการ <span class="en">(Maximizing Profit)</span>'] });
  G.sort($('g-flaw'), {
    buckets: [{ id: 't', label: 'ระยะเวลา (Timing)' }, { id: 'c', label: 'กระแสเงินสด (Cash Flow)' }, { id: 'r', label: 'ความเสี่ยง (Risk)' }],
    items: [
      { t: 'โครงการ A ได้กำไรรวม 5 ล้านใน 10 ปี โครงการ B ได้ 4 ล้านภายใน 1 ปี', b: 't', why: 'เงินที่ได้เร็วกว่ามีค่ากว่า' },
      { t: 'กิจการมีกำไร 200,000 บาท แต่ลูกค้ายังไม่จ่ายเงิน', b: 'c', why: 'กำไรบัญชีไม่ใช่เงินสด' },
      { t: 'ผู้บริหารไม่จ่ายเงินปันผล แม้กิจการมีกำไรสูง', b: 'c', why: 'ผู้ถือหุ้นไม่ได้รับเงินสด' },
      { t: 'โครงการอาจให้กำไรมาก แต่มีโอกาสขาดทุนสูง', b: 'r', why: 'ความไม่แน่นอนของผลตอบแทน' },
      { t: 'กำไรของสองโครงการเท่ากัน แต่โครงการหนึ่งให้เงินตั้งแต่ปีแรก', b: 't', why: 'ต่างกันที่เวลาได้รับเงิน' },
      { t: 'ยอดขายเพิ่มขึ้น แต่ผันผวนมากตามราคาวัตถุดิบ', b: 'r', why: 'ความผันผวนคือความเสี่ยง' }
    ]
  });
  G.sort($('g-form'), {
    buckets: [{ id: 's', label: 'เจ้าของคนเดียว' }, { id: 'p', label: 'ห้างหุ้นส่วน' }, { id: 'c', label: 'บริษัทจำกัด' }],
    items: [
      { t: 'ร้านกาแฟเล็ก ๆ เจ้าของตัดสินใจเองทุกเรื่อง ใช้เงินทุนส่วนตัว', b: 's', why: 'เจ้าของคนเดียว' },
      { t: 'เพื่อนสองคนร่วมทุนเปิดสำนักงานบัญชี แบ่งกำไรตามสัดส่วนเงินลงทุน', b: 'p', why: 'ตั้งแต่ 2 คนขึ้นไป แบ่งกำไรร่วมกัน' },
      { t: 'สตาร์ทอัปต้องการระดมทุนจากนักลงทุนหลายสิบราย', b: 'c', why: 'แบ่งทุนเป็นหุ้น ระดมทุนได้ง่าย' },
      { t: 'ต้องการให้นักลงทุนบางคนรับผิดชอบหนี้ไม่เกินเงินที่ลงทุน', b: 'p', why: 'ห้างหุ้นส่วนจำกัด' },
      { t: 'ต้องการคณะกรรมการบริหารและความน่าเชื่อถือสูงต่อสถาบันการเงิน', b: 'c', why: 'บริษัทจำกัดน่าเชื่อถือมาก' },
      { t: 'เจ้าของรับผิดชอบหนี้สินทั้งหมดโดยไม่จำกัด เพียงคนเดียว', b: 's', why: 'ไม่มีหุ้นส่วนมาแบ่งรับผิด' }
    ]
  });
  G.sort($('g-tc'), {
    buckets: [{ id: 't', label: 'Treasurer' }, { id: 'c', label: 'Controller' }],
    items: [
      { t: 'ผู้จัดการเงินสด (Cash Manager)', b: 't' }, { t: 'ผู้จัดการสินเชื่อ (Credit Manager)', b: 't' }, { t: 'ผู้จัดการกองทุนบำเหน็จบำนาญ (Pension Fund Manager)', b: 't' },
      { t: 'ผู้จัดการการระดมทุน (Fund Raising Manager)', b: 't' }, { t: 'ผู้จัดการงบลงทุน (Capital Expenditure Manager)', b: 't' },
      { t: 'ผู้จัดการภาษี (Tax Manager)', b: 'c' }, { t: 'ผู้จัดการบัญชีบริษัท (Corporate Accounting Manager)', b: 'c' },
      { t: 'ผู้จัดการบัญชีต้นทุน (Cost Accounting Manager)', b: 'c' }, { t: 'ผู้จัดการบัญชีการเงิน (Financial Accounting Manager)', b: 'c' }
    ]
  });
  G.sort($('g-mkt'), {
    buckets: [{ id: 'm', label: 'ตลาดเงิน (อายุไม่เกิน 1 ปี)' }, { id: 'c', label: 'ตลาดทุน (อายุเกิน 1 ปี)' }],
    items: [
      { t: 'ตั๋วเงินคลัง (Treasury Bill) 6 เดือน', b: 'm' }, { t: 'บัตรเงินฝาก (Certificate of Deposit) 3 เดือน', b: 'm' }, { t: 'ตราสารพาณิชย์ (Commercial Paper) 90 วัน', b: 'm' },
      { t: 'หุ้นสามัญ (Common Stock)', b: 'c', why: 'ไม่มีกำหนดอายุ' }, { t: 'หุ้นกู้ (Debenture) อายุ 5 ปี', b: 'c' }, { t: 'พันธบัตรรัฐบาล อายุ 10 ปี', b: 'c' },
      { t: 'ตั๋วสัญญาใช้เงิน อายุ 60 วัน', b: 'm' }, { t: 'หุ้นบุริมสิทธิ (Preferred Stock)', b: 'c', why: 'ไม่มีกำหนดอายุ' }
    ]
  });
  G.sort($('g-ps'), {
    buckets: [{ id: 'p', label: 'ตลาดแรก (Primary Market)' }, { id: 's', label: 'ตลาดรอง (Secondary Market)' }],
    items: [
      { t: 'บริษัทเสนอขายหุ้นให้ประชาชนครั้งแรก (IPO)', b: 'p', why: 'เงินเข้ากิจการโดยตรง' },
      { t: 'นักลงทุนซื้อหุ้นต่อจากนักลงทุนรายอื่นในตลาดหลักทรัพย์', b: 's', why: 'ซื้อขายกันเอง เงินไม่เข้ากิจการ' },
      { t: 'รัฐบาลประมูลพันธบัตรที่ออกใหม่', b: 'p', why: 'ผู้ออกขายตราสารใหม่' },
      { t: 'ขายหุ้นกู้ที่ถืออยู่ให้ผู้ลงทุนรายอื่นก่อนครบกำหนด', b: 's', why: 'ผู้ลงทุนซื้อขายต่อกัน' },
      { t: 'บริษัทเพิ่มทุนโดยออกหุ้นใหม่ขายให้ผู้ถือหุ้นเดิม', b: 'p', why: 'ออกหุ้นใหม่' },
      { t: 'ซื้อขายหุ้นผ่านระบบของตลาดหลักทรัพย์แห่งประเทศไทย', b: 's', why: 'ซื้อขายหลักทรัพย์ที่ออกแล้ว' }
    ]
  });

  /* ---------- Tally / quiz / match ---------- */
  G.tally($('g-sr'), { options: ['ทำ เพราะลดต้นทุนได้', 'ไม่ทำ เพราะเสี่ยงต่อความมั่งคั่งในระยะยาว', 'ไม่ทำ เพราะเป็นความรับผิดชอบต่อสังคม'] });
  var FN = ['วางแผนการเงิน', 'จัดสรรเงินทุน / ลงทุน', 'จัดหาเงินทุน'];
  G.quiz($('g-fn'), { questions: [
    { q: 'วิเคราะห์งบการเงินและพยากรณ์ยอดขายปีหน้า', o: FN, a: 0, why: 'การวิเคราะห์และพยากรณ์เป็นการวางแผนการเงิน' },
    { q: 'ตัดสินใจซื้อเครื่องจักรใหม่มูลค่า 20 ล้านบาท', o: FN, a: 1, why: 'การพิจารณาการลงทุน (Capital Budgeting)' },
    { q: 'ออกหุ้นกู้เพื่อระดมทุน 100 ล้านบาท', o: FN, a: 2, why: 'เป็นแหล่งเงินทุนระยะยาว' },
    { q: 'กำหนดนโยบายการจ่ายเงินปันผล', o: FN, a: 2, why: 'นโยบายเงินปันผลอยู่ในหน้าที่จัดหาเงินทุน' },
    { q: 'ลดระยะเวลาการเก็บหนี้จากลูกหนี้', o: FN, a: 1, why: 'การบริหารลูกหนี้เป็นส่วนของทุนหมุนเวียน' },
    { q: 'จัดทำงบกระแสเงินสดล่วงหน้า', o: FN, a: 0, why: 'การจัดทำงบการเงินและงบกระแสเงินสดเป็นการวางแผน' }
  ] });
  G.match($('g-cg'), { pairs: [
    ['คณะกรรมการบริษัท (Board of Directors)', 'กำกับดูแลฝ่ายบริหารเพื่อผลประโยชน์ของผู้ถือหุ้น'],
    ['ผู้สอบบัญชี (Auditors)', 'ตรวจสอบงบการเงินอย่างเป็นอิสระ'],
    ['ผู้กำกับดูแล (Regulators)', 'กำกับให้ปฏิบัติตามกฎหมายและกฎเกณฑ์'],
    ['ตลาดตราสารทุน (Equity Markets)', 'ราคาหุ้นสะท้อนผลงานของบริษัท'],
    ['ตลาดตราสารหนี้ (Debt Markets)', 'เจ้าหนี้ติดตามความเสี่ยงและความสามารถชำระหนี้']
  ] });
  G.quiz($('g-final'), { questions: [
    { q: 'เป้าหมายของกิจการในมุมมองของนักการเงินคือข้อใด', o: ['กำไรสูงสุด', 'ส่วนแบ่งตลาดสูงสุด', 'ความมั่งคั่งสูงสุดของผู้ถือหุ้น', 'ต้นทุนต่ำสุด'], a: 2, why: 'Maximizing Shareholders\' Wealth' },
    { q: 'ข้อใดไม่ใช่สิ่งที่ "กำไรสูงสุด" มองข้าม', o: ['ระยะเวลา (Timing)', 'กระแสเงินสด (Cash Flow)', 'ความเสี่ยง (Risk)', 'ตัวเลขกำไรทางบัญชี'], a: 3, why: 'กำไรสูงสุดมองตัวเลขกำไรเป็นหลัก แต่มองข้ามอีกสามข้อ' },
    { q: 'โครงการมี EPS 6 บาท โอกาสได้รับ 50% EPS ที่คาดหวังเท่ากับเท่าใด', o: ['2.00', '3.00', '6.00', '12.00'], a: 1, why: '6 × 0.5 = 3.00' },
    { q: 'ผู้ใดรับผิดชอบหนี้สินของกิจการโดยไม่จำกัดจำนวนเพียงคนเดียว', o: ['เจ้าของธุรกิจเจ้าของคนเดียว', 'ผู้ถือหุ้นที่ชำระค่าหุ้นครบ', 'ผู้เป็นหุ้นส่วนจำกัดความรับผิด', 'กรรมการบริษัทจำกัด'], a: 0, why: 'ไม่มีนิติบุคคลหรือผู้อื่นมาแบ่งความรับผิด' },
    { q: 'การจัดทำงบการเงินและบัญชีต้นทุนอยู่ในความดูแลของใคร', o: ['Treasurer', 'Controller', 'CEO', 'Board of Directors'], a: 1, why: 'Controller ดูแลงานบัญชีภายในองค์การ' },
    { q: 'ตั๋วเงินคลังอายุ 6 เดือน ซื้อขายในตลาดใด', o: ['ตลาดเงิน', 'ตลาดทุน', 'ตลาดปริวรรตเงินตรา', 'ตลาดตราสารทุน'], a: 0, why: 'ตราสารอายุไม่เกิน 1 ปี' },
    { q: 'การเสนอขายหุ้นให้ประชาชนครั้งแรก (IPO) เกิดขึ้นในตลาดใด', o: ['ตลาดแรก', 'ตลาดรอง', 'ตลาดเงิน', 'OTC เท่านั้น'], a: 0, why: 'ผู้ออกขายหลักทรัพย์ใหม่ เงินเข้ากิจการโดยตรง' },
    { q: 'กิจการมีกำไรทางบัญชี แต่ยังเก็บเงินจากลูกค้าไม่ได้ อาจเกิดปัญหาใด', o: ['ภาษีสูงขึ้น', 'ขาดสภาพคล่อง', 'ราคาหุ้นลดลงทันที', 'ต้นทุนลดลง'], a: 1, why: 'กำไรไม่เท่ากับเงินสด' }
  ] });
  G.fills();

  /* ---------- Info groups (org charts, trees) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.infogroup'), function (g) {
    var box = g.closest('.inner').querySelector('[data-infobox]');
    g.addEventListener('click', function (e) {
      var n = e.target.closest('.node'); if (!n || !n.dataset.info) return;
      Array.prototype.forEach.call(g.querySelectorAll('.node'), function (x) { x.classList.remove('on'); });
      n.classList.add('on'); box.textContent = n.dataset.info;
    });
  });

  /* ---------- Balance sheet ---------- */
  (function () {
    var bs = $('bs'), info = $('bsinfo'), cur = null;
    var txt = { plan: 'การวางแผนทางการเงิน ครอบคลุมทั้งสองด้านของงบดุล: วิเคราะห์ พยากรณ์ และจัดทำงบการเงิน',
      inv: 'การลงทุน: ตัดสินใจว่าจะถือสินทรัพย์ชนิดใดและเท่าใด (ด้านสินทรัพย์)',
      fin: 'การหาเงินทุน: ตัดสินใจว่าจะหาเงินจากหนี้สินหรือส่วนของผู้ถือหุ้น (ด้านหนี้สินและส่วนของผู้ถือหุ้น)' };
    Array.prototype.forEach.call(document.querySelectorAll('[data-role]'), function (b) {
      b.onclick = function () {
        cur = b.dataset.role;
        Array.prototype.forEach.call(document.querySelectorAll('[data-role]'), function (x) { x.classList.toggle('pri', x === b); });
        Array.prototype.forEach.call(bs.querySelectorAll('button'), function (c) { c.classList.toggle('on', c.dataset.r.split(' ').indexOf(cur) > -1); });
        info.textContent = txt[cur];
      };
    });
  })();

  /* ---------- PV simulator ---------- */
  G.range(['r10'], function (r) {
    r = r / 100; $('r10o').textContent = Math.round(r * 100) + '%';
    var p1 = [5, .5, .5], p2 = [2, 2, 2], v1 = 0, v2 = 0;
    for (var t = 1; t <= 3; t++) { var f = 1 / Math.pow(1 + r, t); $('f' + t).textContent = f.toFixed(4); v1 += p1[t - 1] * f; v2 += p2[t - 1] * f; }
    $('v1').textContent = v1.toFixed(2); $('v2').textContent = v2.toFixed(2);
    $('b1').style.width = (v1 / 6 * 100) + '%'; $('b2').style.width = (v2 / 6 * 100) + '%';
    var vd = $('vd10');
    if (r === 0) { vd.className = 'verdict w'; vd.textContent = 'อัตราคิดลด 0% (เงินไม่มีค่าตามเวลา): สองโครงการเท่ากัน คือ 6.00'; }
    else { vd.className = 'verdict ok'; vd.textContent = 'Project 1 มีมูลค่าปัจจุบันสูงกว่า ' + (v1 - v2).toFixed(2) + ' บาท เพราะได้เงินก้อนใหญ่เร็วกว่า'; }
  });

  /* ---------- Dividend payout ---------- */
  G.range(['po'], function (p) {
    var np = 1000000, d = np * p / 100;
    $('poo').textContent = p + '%'; $('dv').textContent = G.fmt(d); $('re').textContent = G.fmt(np - d); $('dps').textContent = (d / 200000).toFixed(2);
    var v = $('vdpo');
    v.textContent = p === 0 ? 'บริษัทมีกำไร 1,000,000 บาท แต่ผู้ถือหุ้นไม่ได้รับเงินสดเลย' : p === 100 ? 'จ่ายทั้งหมด ผู้ถือหุ้นได้เงินสดมาก แต่กิจการไม่มีกำไรสะสมไว้ขยายงาน' : 'กำไรส่วนหนึ่งถึงมือผู้ถือหุ้น อีกส่วนเก็บไว้ลงทุนต่อ';
  });

  /* ---------- Liquidity ---------- */
  G.range(['cs', 'cl'], function (cs, cl) {
    $('cso').textContent = G.fmt(cs) + ' บาท'; $('clo').textContent = cl + '%';
    var cin = 1000000 * cl / 100, net = cin - 800000, end = cs + net;
    $('lp').textContent = '200,000'; $('lc').textContent = G.fmt(cin); $('ln').textContent = money(net); $('le').textContent = money(end);
    $('le').style.color = end < 0 ? 'var(--bad)' : 'var(--green)'; $('ln').style.color = net < 0 ? 'var(--bad)' : 'var(--purple)';
    var v = $('vdl');
    if (end < 0) { v.className = 'verdict bad'; v.textContent = 'กำไรทางบัญชี 200,000 บาท แต่เงินสดติดลบ ' + G.fmt(-end) + ' บาท: ขาดสภาพคล่อง ต้องกู้เพิ่มหรืออาจล้มละลาย'; }
    else if (net < 0) { v.className = 'verdict w'; v.textContent = 'ยังรอด เพราะมีเงินสดต้นงวดรองรับ แต่กระแสเงินสดสุทธิยังติดลบ ' + G.fmt(-net) + ' บาท'; }
    else { v.className = 'verdict ok'; v.textContent = 'เก็บเงินครบ กระแสเงินสดสุทธิเป็นบวก ' + G.fmt(net) + ' บาท เท่ากับกำไร'; }
  });

  /* ---------- Risk game ---------- */
  (function () {
    var pick = null, rounds = [], svg = $('rkchart'), N = 20;
    function draw() {
      var n = Math.max(N, rounds.length), W = 640, H = 260, L = 40, B = 28, T = 14, R = 14;
      function x(i) { return L + (W - L - R) * i / n; } function y(v) { return H - B - (H - B - T) * v / 5; }
      var s = '';
      for (var g = 0; g <= 5; g++) { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="#DCE6E2"/><text x="' + (L - 6) + '" y="' + (y(g) + 4) + '" text-anchor="end" font-size="11" fill="#58706A">' + g + '</text>'; }
      s += '<text x="' + (W / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="11" fill="#58706A">จำนวนปีที่ทอย</text>';
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(2.5) + '" y2="' + y(2.5) + '" stroke="#7B4AA0" stroke-dasharray="5 4"/><text x="' + (W - R) + '" y="' + (y(2.5) - 4) + '" text-anchor="end" font-size="11" fill="#7B4AA0">ABC คาดหวัง 2.50</text>';
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(4) + '" y2="' + y(4) + '" stroke="#2BA6A0" stroke-dasharray="5 4"/><text x="' + (W - R) + '" y="' + (y(4) - 4) + '" text-anchor="end" font-size="11" fill="#2BA6A0">XYZ คาดหวัง 4.00</text>';
      var pa = [], px = [], sa = 0, sx = 0;
      rounds.forEach(function (r, i) { sa += r; sx += 4; pa.push(x(i + 1) + ',' + y(sa / (i + 1))); px.push(x(i + 1) + ',' + y(sx / (i + 1))); });
      if (pa.length) {
        s += '<polyline points="' + pa.join(' ') + '" fill="none" stroke="#7B4AA0" stroke-width="3"/><polyline points="' + px.join(' ') + '" fill="none" stroke="#2BA6A0" stroke-width="3"/>';
        pa.forEach(function (p) { s += '<circle cx="' + p.split(',')[0] + '" cy="' + p.split(',')[1] + '" r="3.5" fill="#7B4AA0"/>'; });
      }
      svg.innerHTML = s;
      var fb = $('rkfb'), ta = rounds.reduce(function (a, b) { return a + b; }, 0), tx = rounds.length * 4;
      $('rk-sc').textContent = rounds.length ? 'ทอยแล้ว ' + rounds.length + ' ปี' : '';
      if (!rounds.length) { fb.className = 'feedback'; fb.textContent = 'เส้นม่วง = EPS เฉลี่ยของ ABC · เส้นทีล = EPS เฉลี่ยของ XYZ'; return; }
      var mine = pick === 'A' ? ta : pick === 'X' ? tx : null;
      fb.className = 'feedback' + (mine !== null ? (mine >= (pick === 'A' ? tx : ta) ? ' ok' : ' bad') : '');
      fb.textContent = 'ABC รวม ' + ta.toFixed(0) + ' บาท (เฉลี่ย ' + (ta / rounds.length).toFixed(2) + ') · XYZ รวม ' + tx + ' บาท (เฉลี่ย 4.00)' + (pick ? ' · คุณเลือก ' + (pick === 'A' ? 'ABC' : 'XYZ') : '');
    }
    function roll(k) { for (var i = 0; i < k; i++) rounds.push(Math.random() < 0.5 ? 5 : 0); draw(); }
    $('roll1').onclick = function () { roll(1); }; $('roll20').onclick = function () { roll(20); };
    $('rkreset').onclick = function () { rounds = []; draw(); };
    $('pickA').onclick = function () { pick = 'A'; $('pickA').classList.add('pri'); $('pickX').classList.remove('pri'); draw(); };
    $('pickX').onclick = function () { pick = 'X'; $('pickX').classList.add('pri'); $('pickA').classList.remove('pri'); draw(); };
    draw();
  })();

  /* ---------- Wealth calculator ---------- */
  G.range(['p0', 'dd', 'p1'], function (p0, d, p1) {
    $('p0o').textContent = p0.toFixed(0) + ' บาท'; $('ddo').textContent = d.toFixed(1) + ' บาท'; $('p1o').textContent = p1.toFixed(0) + ' บาท';
    var dy = d / p0 * 100, cg = (p1 - p0) / p0 * 100, tr = dy + cg;
    $('dy').textContent = dy.toFixed(1) + '%'; $('cg').textContent = cg.toFixed(1) + '%'; $('tr').textContent = tr.toFixed(1) + '%';
    $('cg').style.color = cg < 0 ? 'var(--bad)' : 'var(--purple)'; $('tr').style.color = tr < 0 ? 'var(--bad)' : 'var(--green)';
  });

  /* ---------- Liability simulator ---------- */
  G.range(['db', 'np', 'un'], function (db, np, un) {
    $('dbo').textContent = db + ' ล้านบาท'; $('npo').textContent = np + ' คน'; $('uno').textContent = un.toFixed(1) + ' ล้านบาท';
    var f = function (v) { return v.toFixed(1); };
    $('lt').innerHTML = '<tr><th>รูปแบบธุรกิจ</th><th>ใครต้องรับผิด</th><th class="n">ทรัพย์สินส่วนตัวที่ถูกเรียกชำระ (ล้านบาท)</th></tr>' +
      '<tr><td>เจ้าของคนเดียว</td><td>เจ้าของ</td><td class="n hl">' + f(db) + '</td></tr>' +
      '<tr><td>ห้างหุ้นส่วนสามัญ</td><td>หุ้นส่วนทุกคนร่วมกัน ถูกทวงได้เต็มจำนวนจากคนใดคนหนึ่ง</td><td class="n hl">' + f(db) + ' (เฉลี่ยคนละ ' + f(db / np) + ')</td></tr>' +
      '<tr><td>ห้างหุ้นส่วนจำกัด</td><td>หุ้นส่วนไม่จำกัดความรับผิด / หุ้นส่วนจำกัดความรับผิด</td><td class="n hl">' + f(db) + ' / 0.0</td></tr>' +
      '<tr><td>บริษัทจำกัด</td><td>ผู้ถือหุ้น เฉพาะมูลค่าหุ้นที่ยังส่งใช้ไม่ครบ</td><td class="n hl">' + f(Math.min(un, db)) + '</td></tr>';
  });

  /* ---------- Salary guess + chart ---------- */
  var JOBS = [
    { n: 'เจ้าหน้าที่สินเชื่อธนาคารพาณิชย์ (Loan Officer)', lo: 60, hi: 60 },
    { n: 'นักวิเคราะห์การเงินในบริษัท (Financial Analyst)', lo: 38, hi: 47 },
    { n: 'ประธานเจ้าหน้าที่การเงิน (CFO)', lo: 232, hi: 295 },
    { n: 'นักวิเคราะห์ปีแรก วาณิชธนกิจ (First-Year Analyst, Investment Banking)', lo: 60, hi: 110 },
    { n: 'ผู้จัดการกองทุน (Portfolio Management)', lo: 500, hi: 600, plus: true }
  ];
  (function () {
    var i = 0, sc = 0, done = false, sg = $('sg');
    function load() { done = false; $('sg-q').textContent = JOBS[i].n; sg.value = 100; $('sgo').textContent = '$100,000'; $('sg-fb').textContent = ''; $('sg-fb').className = 'feedback'; $('sg-go').disabled = false; }
    sg.oninput = function () { $('sgo').textContent = '$' + G.fmt(sg.value * 1000); };
    $('sg-go').onclick = function () {
      if (done) return; done = true; $('sg-go').disabled = true;
      var j = JOBS[i], v = parseFloat(sg.value), lo = j.lo, hi = j.hi, mid = (lo + hi) / 2;
      var near = j.plus ? v >= 400 : (v >= lo * 0.8 && v <= hi * 1.2) || (lo === hi && Math.abs(v - lo) <= lo * 0.25);
      if (near) sc++;
      $('sg-sc').textContent = 'ใกล้เคียง ' + sc + ' / ' + JOBS.length;
      var real = j.plus ? '$500,000 ขึ้นไป' : lo === hi ? '$' + G.fmt(lo * 1000) : '$' + G.fmt(lo * 1000) + ' – $' + G.fmt(hi * 1000);
      $('sg-fb').className = 'feedback ' + (near ? 'ok' : 'bad'); $('sg-fb').textContent = (near ? 'ใกล้เคียง! ' : 'ห่างพอสมควร ') + 'ค่าจริงต่อปี: ' + real;
    };
    $('sg-nx').onclick = function () { i = (i + 1) % JOBS.length; if (i === 0) sc = 0, $('sg-sc').textContent = ''; load(); };
    load();
  })();
  (function () {
    var rows = [['เจ้าหน้าที่สินเชื่อ (Loan Officer)', 60, 60, 0], ['ผู้จัดการแผนก (Department Manager)', 100, 100, 0], ['นักวิเคราะห์การเงิน (Financial Analyst)', 38, 47, 1], ['การบริหารสินเชื่อ (Credit Management)', 30, 63, 1], ['CFO', 232, 295, 1],
      ['นักวิเคราะห์ปีแรก (IB Analyst)', 60, 110, 2], ['Associate ปีแรก (IB Associate)', 125, 235, 2], ['Director / Principal', 200, 600, 2], ['การบริหารพอร์ต (Portfolio Mgmt) 500+', 500, 600, 3]];
    var cols = ['#2BA6A0', '#1B7F6B', '#7B4AA0', '#8DC63F'], grp = ['ธนาคารพาณิชย์', 'การเงินบริษัท', 'วาณิชธนกิจ', 'การจัดการเงินลงทุน'];
    var s = '', L = 270, W = 440, rh = 38;
    [0, 100, 200, 300, 400, 500, 600].forEach(function (v) { var x = L + W * v / 600; s += '<line x1="' + x + '" x2="' + x + '" y1="10" y2="385" stroke="#DCE6E2"/><text x="' + x + '" y="405" text-anchor="middle" font-size="11" fill="#58706A">' + v + 'k</text>'; });
    rows.forEach(function (r, k) {
      var y = 14 + k * rh, x1 = L + W * r[1] / 600, x2 = L + W * r[2] / 600;
      s += '<text x="' + (L - 10) + '" y="' + (y + 19) + '" text-anchor="end" font-size="12" fill="#12332B">' + r[0] + '</text>';
      s += '<rect x="' + x1 + '" y="' + (y + 6) + '" width="' + Math.max(8, x2 - x1) + '" height="20" rx="6" fill="' + cols[r[3]] + '"/>';
    });
    cols.forEach(function (c, k) { s += '<rect x="' + (14 + k * 175) + '" y="410" width="12" height="9" rx="3" fill="' + c + '"/>'; });
    $('salchart').innerHTML = s;
    $('salchart').setAttribute('viewBox', '0 0 720 425');
  })();

  /* ---------- Financial system flow ---------- */
  (function () {
    var st = 0, txt = [
      'ตลาดการเงินคือสถานที่ที่ให้ผู้ขาดแคลนเงินทุนสร้างสินทรัพย์ทางการเงินออกขาย เพื่อระดมเงินทุนจากผู้มีเงินทุนที่ต้องการออมหรือลงทุน',
      '① ผู้ขาดแคลนเงินทุน (เช่น บริษัท รัฐบาล) ออกหลักทรัพย์ เช่น หุ้นหรือหุ้นกู้ เสนอขายผ่านตลาดการเงิน',
      '② ผู้มีเงินทุนส่วนเกินตัดสินใจลงทุน ซื้อหลักทรัพย์ ส่งเงินเข้าสู่ตลาดการเงิน',
      '③ ตลาดการเงินส่งเงินทุนไปยังผู้ออก และส่งมอบหลักทรัพย์ซึ่งเป็นสิทธิในผลตอบแทนในอนาคตให้ผู้ลงทุน'];
    function up() { for (var k = 1; k <= 3; k++) $('st' + k).style.opacity = st >= k ? 1 : 0; $('fs-txt').textContent = txt[st]; $('fs-next').disabled = st === 3; }
    $('fs-next').onclick = function () { st = Math.min(3, st + 1); up(); };
    $('fs-reset').onclick = function () { st = 0; up(); };
    up();
  })();

  /* ---------- Concept fill-in ---------- */
  (function () {
    var ans = { wealth: 'ความมั่งคั่ง (Wealth)', invest: 'ลงทุน', finance: 'จัดหาทุน', cost: 'ต้นทุนเงินทุน (Cost of Capital)', value: 'มูลค่าธุรกิจ / ราคาหุ้น' };
    var wrong = { wealth: ['กำไร', 'ส่วนแบ่งตลาด'], invest: ['จัดหาทุน', 'จ่ายปันผล'], finance: ['ลงทุน', 'ทำบัญชี'], cost: ['ราคาหุ้น', 'ยอดขาย'], value: ['กำไรต่อหุ้นปีนี้', 'ยอดขายรวม'] };
    Array.prototype.forEach.call(document.querySelectorAll('select.cz'), function (s) {
      var k = s.dataset.c, o = G.shuffle([ans[k]].concat(wrong[k]));
      s.innerHTML = '<option value="">เลือก…</option>' + o.map(function (t) { return '<option>' + t + '</option>'; }).join('');
      s.style.cssText = 'font:inherit;padding:.2rem .4rem;border:2px solid var(--purple);border-radius:.5rem;max-width:100%';
    });
    $('cz-go').onclick = function () {
      var ok = 0, all = document.querySelectorAll('select.cz');
      Array.prototype.forEach.call(all, function (s) { var g = s.value === ans[s.dataset.c]; if (g) ok++; s.style.borderColor = s.value ? (g ? 'var(--ok)' : 'var(--bad)') : 'var(--purple)'; s.style.background = s.value ? (g ? 'var(--ok-l)' : 'var(--bad-l)') : '#fff'; });
      $('cz-fb').className = 'feedback ' + (ok === all.length ? 'ok' : 'bad'); $('cz-fb').textContent = 'ถูก ' + ok + ' / ' + all.length + (ok === all.length ? ' ครบถ้วน!' : ' ลองแก้ช่องที่เป็นสีแดง');
    };
  })();
})();
