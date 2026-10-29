/* Chapter 3 – Cash Flow Statement: games, drills and simulations (no data stored) */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var fmt = function (n) { return (n < 0 ? '(' : '') + G.fmt(Math.abs(n)) + (n < 0 ? ')' : ''); };
  var num = function (v) { var x = parseFloat(String(v).replace(/,/g, '').replace(/[−–]/g, '-').replace(/^\((.*)\)$/, '-$1')); return x; };
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- Poll ---------- */
  G.tally($('g-poll'), { options: ['เคย — ธุรกิจมีกำไรแต่เงินสดไม่พอจ่าย', 'ไม่เคย แต่พอเดาได้ว่าเกิดขึ้นได้', 'ไม่แน่ใจ ขอเรียนก่อน'] });

  /* ---------- Sorters ---------- */
  G.sort($('g-cashimpact'), {
    buckets: [{ id: 'y', label: 'เงินสดเปลี่ยนทันที' }, { id: 'n', label: 'เงินสดไม่เปลี่ยน (กำไรหรือฐานะเปลี่ยนเท่านั้น)' }],
    items: [
      { t: 'ซื้อเครื่องจักรด้วยเงินสด', b: 'y', why: 'เงินสดจ่ายออกทันที' },
      { t: 'ขายสินค้าเชื่อ', b: 'n', why: 'ยังไม่ได้รับเงิน เป็นลูกหนี้' },
      { t: 'บันทึกค่าเสื่อมราคา', b: 'n', why: 'เป็นการปันส่วนต้นทุน ไม่มีเงินสดจ่าย' },
      { t: 'จ่ายเงินปันผลเป็นเงินสด', b: 'y', why: 'เงินสดออกให้ผู้ถือหุ้น' },
      { t: 'เก็บเงินจากลูกหนี้', b: 'y', why: 'เงินสดเข้า' },
      { t: 'ตั้งค่าใช้จ่ายค้างจ่าย', b: 'n', why: 'ยังไม่ได้จ่ายเงิน' }
    ]
  });
  G.sort($('g-sourceuse'), {
    buckets: [{ id: 's', label: 'ที่มา (Source of funds)' }, { id: 'u', label: 'ใช้ไป (Use of funds)' }],
    items: [
      { t: 'กำไรในรูปของเงินสด', b: 's', why: 'หาเงินสดเข้ากิจการ' },
      { t: 'จ่ายเงินปันผล', b: 'u', why: 'เงินสดออก' },
      { t: 'ออกหุ้นกู้ใหม่', b: 's', why: 'ได้เงินจากการกู้' },
      { t: 'สินค้าคงคลังลดลง', b: 's', why: 'ขายออก ปลดปล่อยเงินที่จมอยู่' },
      { t: 'ลูกหนี้การค้าเพิ่มขึ้น', b: 'u', why: 'เงินสดจมอยู่ในลูกหนี้' },
      { t: 'เจ้าหนี้การค้าลดลง', b: 'u', why: 'จ่ายเงินให้เจ้าหนี้' },
      { t: 'ขายอุปกรณ์เก่า', b: 's', why: 'ได้เงินสดจากการขายสินทรัพย์' },
      { t: 'ชำระคืนเงินกู้', b: 'u', why: 'เงินสดจ่ายชำระหนี้' }
    ]
  });
  G.sort($('g-act'), {
    buckets: [{ id: 'o', label: 'ดำเนินงาน' }, { id: 'i', label: 'ลงทุน' }, { id: 'f', label: 'จัดหาเงินทุน' }],
    items: [
      { t: 'เงินสดรับจากการขายสินค้า', b: 'o', why: 'รายได้จากการดำเนินงาน' },
      { t: 'จ่ายเงินซื้อสินค้า', b: 'o', why: 'ต้นทุนการดำเนินงาน' },
      { t: 'ลูกหนี้การค้าเพิ่มขึ้น', b: 'o', why: 'เงินทุนหมุนเวียน' },
      { t: 'ซื้ออาคารและอุปกรณ์', b: 'i', why: 'สินทรัพย์ระยะยาว' },
      { t: 'ขายเงินลงทุน', b: 'i', why: 'การลงทุน' },
      { t: 'ให้บุคคลอื่นกู้ยืมเงิน', b: 'i', why: 'เงินให้กู้ยืม (ไม่ใช่ลูกหนี้การค้า)' },
      { t: 'ออกหุ้นทุนเพิ่ม', b: 'f', why: 'ระดมเงินจากเจ้าของ' },
      { t: 'กู้เงินระยะยาวจากธนาคาร', b: 'f', why: 'ระดมเงินจากเจ้าหนี้' },
      { t: 'จ่ายเงินปันผล', b: 'f', why: 'ตอบแทนผู้ถือหุ้น' },
      { t: 'สินค้าคงเหลือลดลง', b: 'o', why: 'เงินทุนหมุนเวียน' },
      { t: 'จ่ายชำระคืนเงินกู้', b: 'f', why: 'คืนเงินแก่เจ้าหนี้' },
      { t: 'เจ้าหนี้การค้าเพิ่มขึ้น', b: 'o', why: 'เงินทุนหมุนเวียน' }
    ]
  });

  /* ---------- Source / Use flash ---------- */
  (function () {
    var items = [['ลูกหนี้การค้าเพิ่มขึ้น', 'U', 'สินทรัพย์เพิ่ม = ใช้เงินสด'], ['ลูกหนี้การค้าลดลง', 'S', 'สินทรัพย์ลด = เก็บเงินได้'], ['สินค้าคงเหลือเพิ่มขึ้น', 'U', 'สินทรัพย์เพิ่ม'], ['สินค้าคงเหลือลดลง', 'S', 'สินทรัพย์ลด'], ['เจ้าหนี้การค้าเพิ่มขึ้น', 'S', 'หนี้สินเพิ่ม = ยังไม่จ่ายเงิน'], ['เจ้าหนี้การค้าลดลง', 'U', 'หนี้สินลด = จ่ายเงิน'], ['ค่าใช้จ่ายค้างจ่ายเพิ่มขึ้น', 'S', 'หนี้สินเพิ่ม'], ['ค่าใช้จ่ายค้างจ่ายลดลง', 'U', 'หนี้สินลด'], ['ที่ดิน อาคาร อุปกรณ์ เพิ่มขึ้น', 'U', 'ซื้อสินทรัพย์ถาวร'], ['ขายอุปกรณ์ได้เงินสด', 'S', 'สินทรัพย์ลด'], ['กู้เงินระยะยาวเพิ่ม', 'S', 'หนี้สินเพิ่ม'], ['ชำระคืนเงินกู้', 'U', 'หนี้สินลด'], ['ออกหุ้นสามัญเพิ่ม', 'S', 'ส่วนของเจ้าของเพิ่ม'], ['ซื้อหุ้นคืน', 'U', 'ส่วนของเจ้าของลด'], ['กำไรสุทธิ', 'S', 'ส่วนของเจ้าของเพิ่ม'], ['จ่ายเงินปันผล', 'U', 'ส่วนของเจ้าของลด'], ['ซื้อหลักทรัพย์ลงทุน', 'U', 'สินทรัพย์เพิ่ม'], ['ค่าเสื่อมราคา (บวกกลับ)', 'S', 'ไม่มีเงินสดจ่ายออก'], ['ขายเงินลงทุน', 'S', 'สินทรัพย์ลด']];
    var el = $('g-flash'), cur = -1, score = 0, total = 0, streak = 0;
    function next() {
      var k; do { k = rnd(0, items.length - 1); } while (k === cur); cur = k;
      el.innerHTML = '';
      var top = h('div', 'gh small', 'ตอบเร็ว<span class="score">ถูก ' + score + ' / ' + total + ' · ต่อเนื่อง ' + streak + '</span>');
      var q = h('div', 'callout', '<b style="font-size:1.25rem">' + items[k][0] + '</b>'), ctl = h('div', 'flow-ctl'), fb = h('div', 'feedback');
      var s = h('button', 'btn pri', 'Source (เงินสดเพิ่ม)'), u = h('button', 'btn', 'Use (เงินสดลด)'), nx = h('button', 'btn ghost hide', 'ข้อต่อไป');
      function ans(a) { total++; s.disabled = u.disabled = true; if (a === items[k][1]) { score++; streak++; fb.className = 'feedback ok'; fb.textContent = 'ถูก! ' + items[k][2]; } else { streak = 0; fb.className = 'feedback bad'; fb.textContent = 'ไม่ถูก คำตอบคือ ' + (items[k][1] === 'S' ? 'Source' : 'Use') + ' เพราะ ' + items[k][2]; } top.querySelector('.score').textContent = 'ถูก ' + score + ' / ' + total + ' · ต่อเนื่อง ' + streak; nx.classList.remove('hide'); }
      s.onclick = function () { ans('S'); }; u.onclick = function () { ans('U'); }; nx.onclick = next;
      ctl.appendChild(s); ctl.appendChild(u); ctl.appendChild(nx);
      [top, q, ctl, fb].forEach(function (x) { el.appendChild(x); });
    }
    next();
  })();

  /* ---------- Order game ---------- */
  G.order($('g-order'), { items: ['คำนวณการเปลี่ยนแปลงของแต่ละรายการในงบฐานะการเงิน', 'แยกประเภทแต่ละรายการเป็น Source หรือ Use', 'ตรวจสอบผลรวมของ Source และ Use', 'หาเงินปันผลจากงบกำไรขาดทุน', 'จัดรายการเข้า 3 กิจกรรม'] });

  /* ---------- Source/Use table game ---------- */
  function suTable(el, cfg) {
    var tries = 0;
    el.innerHTML = '';
    var wrap = h('div', 'scrollx'), tb = h('table', 'tb'), ctl = h('div', 'flow-ctl'), fb = h('div', 'feedback');
    tb.innerHTML = '<tr><th>รายการ</th><th class="n">' + cfg.p + '</th><th class="n">' + cfg.c + '</th><th class="n">เปลี่ยน (ปีหลัง − ปีก่อน)</th><th>Source / Use</th></tr>';
    var rows = [];
    function expect(r) { var d = r.c - r.p; if (d === 0) return '-'; if (r.t === 'A') return d > 0 ? 'U' : 'S'; return d > 0 ? 'S' : 'U'; }
    cfg.rows.forEach(function (r) {
      var tr = h('tr'); tr.innerHTML = '<td>' + r.n + '</td><td class="n">' + G.fmt(r.p) + '</td><td class="n">' + G.fmt(r.c) + '</td>';
      var td1 = h('td', 'n'), td2 = h('td');
      if (r.t === 'cash') { td1.innerHTML = (r.c - r.p > 0 ? '+' : '') + (r.c - r.p); td2.innerHTML = '<span class="small">เงินสดที่เปลี่ยน (ไว้ตรวจสอบ)</span>'; tr.appendChild(td1); tr.appendChild(td2); tb.appendChild(tr); return; }
      var i = h('input', 'fill sm'); i.setAttribute('inputmode', 'text'); i.setAttribute('aria-label', 'การเปลี่ยนแปลง ' + r.n);
      var sel = h('select', 'sel'); sel.innerHTML = '<option value="">เลือก</option><option value="S">Source</option><option value="U">Use</option><option value="-">ไม่เปลี่ยน</option>'; sel.setAttribute('aria-label', 'ประเภท ' + r.n);
      td1.appendChild(i); td2.appendChild(sel); tr.appendChild(td1); tr.appendChild(td2); tb.appendChild(tr);
      rows.push({ r: r, i: i, s: sel });
      i.addEventListener('input', function () { i.className = 'fill sm'; }); sel.addEventListener('change', function () { sel.className = 'sel'; });
      i.addEventListener('keydown', function (e) { e.stopPropagation(); });
    });
    wrap.appendChild(tb);
    var chk = h('button', 'btn pri', 'ตรวจคำตอบ'), rs = h('button', 'btn ghost', 'ล้าง');
    ctl.appendChild(chk); ctl.appendChild(rs);
    chk.onclick = function () {
      var good = 0, total = rows.length * 2, empty = 0;
      rows.forEach(function (x) {
        var d = x.r.c - x.r.p, e = expect(x.r);
        var v = num(x.i.value), ok1 = !isNaN(v) && Math.abs(v - d) < 0.5, ok2 = x.s.value === e;
        if (x.i.value === '') empty++; if (!x.s.value) empty++;
        if (ok1) good++; if (ok2) good++;
        x.i.className = 'fill sm ' + (ok1 ? 'ok' : 'bad'); x.s.className = 'sel ' + (ok2 ? 'ok' : 'bad');
      });
      tries++;
      if (good === total) { fb.className = 'feedback ok'; fb.textContent = 'ถูกครบทุกช่อง! ' + (cfg.done || ''); return; }
      if (tries >= 2) {
        rows.forEach(function (x) { var d = x.r.c - x.r.p, e = expect(x.r); if (!(Math.abs(num(x.i.value) - d) < 0.5)) { x.i.value = d; x.i.className = 'fill sm rev'; } if (x.s.value !== e) { x.s.value = e; x.s.className = 'sel rev'; } });
        fb.className = 'feedback bad'; fb.textContent = 'ได้ ' + good + ' / ' + total + ' ช่องสีเหลืองคือเฉลย ลองไล่ดูเหตุผลทีละรายการ';
      } else { fb.className = 'feedback bad'; fb.textContent = 'ถูก ' + good + ' / ' + total + (empty ? ' (ยังว่าง ' + empty + ' ช่อง)' : '') + ' — แก้แล้วกดตรวจอีกครั้ง ครั้งที่สองจะเฉลย'; }
    };
    rs.onclick = function () { tries = 0; rows.forEach(function (x) { x.i.value = ''; x.i.className = 'fill sm'; x.s.value = ''; x.s.className = 'sel'; }); fb.textContent = ''; fb.className = 'feedback'; };
    el.appendChild(wrap); el.appendChild(ctl); el.appendChild(fb);
  }
  suTable($('g-su-baker'), { p: '2002', c: '2003', done: 'สังเกตว่าเงินสดเพิ่ม 100 ซึ่งเท่ากับ Source − Use', rows: [
    { n: 'เงินสด', p: 300, c: 400, t: 'cash' },
    { n: 'หลักทรัพย์ในความต้องการของตลาด', p: 200, c: 600, t: 'A' }, { n: 'ลูกหนี้การค้า', p: 500, c: 400, t: 'A' }, { n: 'สินค้าคงเหลือ', p: 900, c: 600, t: 'A' },
    { n: 'ที่ดินและอาคาร (ราคาทุน)', p: 1050, c: 1200, t: 'A' }, { n: 'เครื่องจักรและอุปกรณ์', p: 800, c: 850, t: 'A' }, { n: 'เฟอร์นิเจอร์และอุปกรณ์ติดตั้ง', p: 220, c: 300, t: 'A' }, { n: 'ยานพาหนะ', p: 80, c: 100, t: 'A' }, { n: 'อื่น ๆ', p: 50, c: 50, t: 'A' },
    { n: 'ค่าเสื่อมราคาสะสม', p: 1200, c: 1300, t: 'L' },
    { n: 'เจ้าหนี้การค้า', p: 500, c: 700, t: 'L' }, { n: 'ตั๋วเงินจ่าย', p: 700, c: 600, t: 'L' }, { n: 'ค่าใช้จ่ายค้างจ่าย', p: 200, c: 100, t: 'L' }, { n: 'หนี้สินระยะยาว', p: 400, c: 600, t: 'L' },
    { n: 'หุ้นบุริมสิทธิ + หุ้นสามัญ + ส่วนเกินมูลค่า', p: 600, c: 600, t: 'L' }, { n: 'กำไรสะสม', p: 500, c: 600, t: 'L' }] });
  suTable($('g-su-toronto'), { p: 'ปี 1', c: 'ปี 2', done: 'Source 259 − Use 279 = −20 ตรงกับเงินสดที่ลดลง', rows: [
    { n: '(1) เงินสด', p: 120, c: 100, t: 'cash' }, { n: '(2) ลูกหนี้การค้า', p: 200, c: 145, t: 'A' }, { n: '(3) สินค้าคงเหลือ', p: 150, c: 175, t: 'A' }, { n: '(4) สินทรัพย์ถาวร (ราคาทุน)', p: 660, c: 874, t: 'A' },
    { n: '(5) ค่าเสื่อมราคาสะสม', p: 200, c: 244, t: 'L' }, { n: '(6) สินทรัพย์ไม่มีตัวตน', p: 150, c: 100, t: 'A' },
    { n: '(7) เจ้าหนี้การค้า', p: 150, c: 130, t: 'L' }, { n: '(8) หนี้ระยะยาว', p: 420, c: 400, t: 'L' }, { n: '(9) ทุนหุ้น', p: 250, c: 300, t: 'L' }, { n: '(10) กำไรสะสม', p: 260, c: 320, t: 'L' }] });

  /* ---------- Quizzes ---------- */
  G.quiz($('g-pattern'), { questions: [
    { q: 'กระแสเงินสด ดำเนินงาน +  ลงทุน −  จัดหาเงินทุน + มักสื่อถึงอะไร', o: ['ธุรกิจเติบโต ขยายการลงทุนโดยมีเงินกู้หรือเพิ่มทุนเสริม', 'ธุรกิจมีปัญหา', 'ธุรกิจเลิกกิจการ'], a: 0, why: 'ดำเนินงานสร้างเงินสดได้ และนำไปลงทุน โดยเสริมด้วยเงินจากภายนอก' },
    { q: 'ดำเนินงาน +  ลงทุน −  จัดหาเงินทุน − เป็นภาพของธุรกิจแบบใด', o: ['ธุรกิจเริ่มต้น', 'ธุรกิจมั่นคง คืนหนี้และจ่ายปันผลจากเงินสดของตนเอง', 'ธุรกิจวิกฤติ'], a: 1, why: 'เงินสดจากการดำเนินงานเพียงพอทั้งลงทุนและตอบแทนผู้ให้เงินทุน' },
    { q: 'ดำเนินงาน −  ลงทุน +  จัดหาเงินทุน + ควรกังวลเรื่องใด', o: ['ไม่ต้องกังวล', 'ธุรกิจขายสินทรัพย์และกู้เงินเพื่อประคองสภาพคล่อง', 'กำลังขยายกิจการ'], a: 1, why: 'ธุรกิจหลักไม่สร้างเงินสด จึงต้องขายสินทรัพย์และกู้เพิ่ม' },
    { q: 'Baker 2003 มีกระแสเงินสดดำเนินงาน 780 แต่กำไรสุทธิ 180 ส่วนต่างหลักมาจากอะไร', o: ['ค่าเสื่อมราคา และสินค้าคงเหลือที่ลดลง', 'การออกหุ้นใหม่', 'การขายอาคาร'], a: 0, why: 'ค่าเสื่อม 100 และสินค้าคงเหลือลด 300 ช่วยเพิ่มเงินสดมากกว่ากำไร' }
  ] });
  G.quiz($('g-final'), { questions: [
    { q: 'ขายสินค้าเชื่อ 100,000 บาท ส่งผลอย่างไร', o: ['กำไรเพิ่ม เงินสดยังไม่เพิ่ม', 'กำไรและเงินสดเพิ่ม', 'กำไรไม่เพิ่ม เงินสดเพิ่ม'], a: 0, why: 'บันทึกรายได้ทันที แต่เงินสดยังไม่ได้รับ' },
    { q: 'ข้อใดเป็น Source ของเงินสด', o: ['สินค้าคงเหลือเพิ่มขึ้น', 'ลูกหนี้ลดลง', 'จ่ายเงินปันผล', 'ซื้อเครื่องจักร'], a: 1, why: 'สินทรัพย์ลดแปลว่าเก็บเงินได้' },
    { q: 'การจ่ายเงินปันผลจัดอยู่ในกิจกรรมใด', o: ['ดำเนินงาน', 'ลงทุน', 'จัดหาเงินทุน'], a: 2, why: 'เป็นการตอบแทนผู้ให้เงินทุน' },
    { q: 'กำไรสะสมต้นปี 300 ปลายปี 380 กำไรสุทธิ 150 เงินปันผลเท่าใด', o: ['70', '80', '150', '230'], a: 0, why: '150 − (380 − 300) = 70' },
    { q: 'กำไรสุทธิ 200 ค่าเสื่อม 50 ลูกหนี้เพิ่ม 30 เจ้าหนี้เพิ่ม 20 OCF เท่าใด', o: ['240', '200', '280', '300'], a: 0, why: '200 + 50 − 30 + 20 = 240' },
    { q: 'ซื้อที่ดินด้วยเงินสด 500 จัดอยู่ในกิจกรรมใดและทิศทางใด', o: ['ดำเนินงาน −500', 'ลงทุน −500', 'จัดหาเงินทุน −500', 'ลงทุน +500'], a: 1, why: 'ซื้อสินทรัพย์ถาวรเป็นกิจกรรมลงทุนที่เงินสดออก' },
    { q: 'ทำไมจึงต้องบวกค่าเสื่อมราคากลับในวิธีทางอ้อม', o: ['เพราะเป็นเงินสดรับ', 'เพราะหักจากกำไรแต่ไม่มีเงินสดจ่ายออก', 'เพราะเป็นรายได้'], a: 1, why: 'ค่าเสื่อมเป็นค่าใช้จ่ายที่ไม่ใช่เงินสด' },
    { q: 'OCF 600 ซื้อสินทรัพย์ถาวร 250 FCF เท่าใด', o: ['350', '850', '250', '600'], a: 0, why: '600 − 250 = 350' },
    { q: 'เงินสดต้นงวด 100 ดำเนินงาน +80 ลงทุน −120 จัดหาเงินทุน +90 เงินสดปลายงวดเท่าใด', o: ['150', '100', '250', '50'], a: 0, why: '100 + 80 − 120 + 90 = 150' },
    { q: 'ผลรวม Source มากกว่า Use อยู่ 40 แสดงว่า', o: ['เงินสดลดลง 40', 'เงินสดเพิ่มขึ้น 40', 'เงินสดไม่เปลี่ยน'], a: 1, why: 'Source − Use = การเปลี่ยนแปลงสุทธิของเงินสด' }
  ] });
  G.match($('g-mistake'), { pairs: [
    ['บันทึกลูกหนี้เพิ่ม 50 เป็น +50', 'ต้องเป็น −50 เพราะเงินสดจมในลูกหนี้'],
    ['ไม่บวกค่าเสื่อมราคากลับ', 'OCF ต่ำกว่าความเป็นจริง'],
    ['ใช้การเปลี่ยนของกำไรสะสมเป็นกำไรสุทธิ', 'ต้องหาเงินปันผล = NI − ΔRE แยกต่างหาก'],
    ['ใช้มูลค่าสุทธิของสินทรัพย์ถาวรหาค่าซื้อ', 'ต้องดูการเปลี่ยนของราคาทุนรวม'],
    ['จัดเงินปันผลเป็นกิจกรรมดำเนินงาน', 'ในบทนี้เป็นกิจกรรมจัดหาเงินทุน']
  ] });

  /* ---------- Random drills ---------- */
  var sg = function (v, w) { return v > 0 ? (w[0] + ' ' + v) : (w[1] + ' ' + (-v)); };
  G.drill($('g-drill-ocf'), { gen: function () {
    var ni = rnd(10, 60) * 10, dep = rnd(2, 12) * 10, ar = rnd(-8, 8) * 10, inv = rnd(-8, 8) * 10, ap = rnd(-6, 8) * 10;
    if (!ar) ar = 20; if (!inv) inv = -30; if (!ap) ap = 40;
    var ocf = ni + dep - ar - inv + ap;
    return { q: 'กำไรสุทธิ <b>' + ni + '</b>  ค่าเสื่อมราคา <b>' + dep + '</b>  ลูกหนี้' + (ar > 0 ? 'เพิ่มขึ้น' : 'ลดลง') + ' <b>' + Math.abs(ar) + '</b>  สินค้าคงเหลือ' + (inv > 0 ? 'เพิ่มขึ้น' : 'ลดลง') + ' <b>' + Math.abs(inv) + '</b>  เจ้าหนี้' + (ap > 0 ? 'เพิ่มขึ้น' : 'ลดลง') + ' <b>' + Math.abs(ap) + '</b> (หน่วย: พัน) พิมพ์ค่าลบด้วยเครื่องหมาย −',
      fields: [{ label: 'กระแสเงินสดจากการดำเนินงาน', ans: ocf, tol: 0.5, show: ocf }],
      why: ni + ' + ' + dep + ' ' + (ar > 0 ? '− ' : '+ ') + Math.abs(ar) + ' ' + (inv > 0 ? '− ' : '+ ') + Math.abs(inv) + ' ' + (ap > 0 ? '+ ' : '− ') + Math.abs(ap) + ' = ' + ocf };
  } });
  G.drill($('g-drill-div'), { gen: function () {
    var re0 = rnd(20, 90) * 10, ni = rnd(10, 40) * 10, div = rnd(2, Math.floor(ni / 10) - 1) * 10, re1 = re0 + ni - div;
    return { q: 'กำไรสะสมต้นปี <b>' + re0 + '</b>  ปลายปี <b>' + re1 + '</b>  กำไรสุทธิหลังภาษี <b>' + ni + '</b> (หน่วย: พัน)',
      fields: [{ label: 'การเปลี่ยนของกำไรสะสม', ans: re1 - re0, tol: 0.5, show: re1 - re0 }, { label: 'เงินปันผลจ่าย', ans: div, tol: 0.5, show: div }],
      why: 'ΔRE = ' + re1 + ' − ' + re0 + ' = ' + (re1 - re0) + ' เงินปันผล = ' + ni + ' − ' + (re1 - re0) + ' = ' + div };
  } });
  G.drill($('g-drill-full'), { gen: function () {
    var ni = rnd(10, 50) * 10, dep = rnd(2, 10) * 10, ar = rnd(-5, 7) * 10, inv = rnd(-5, 7) * 10, ap = rnd(-4, 6) * 10, capex = rnd(5, 25) * 10, debt = rnd(-8, 12) * 10, div = rnd(1, Math.floor(ni / 20)) * 10, beg = rnd(5, 30) * 10;
    if (!ar) ar = 10; if (!inv) inv = -20; if (!ap) ap = 30; if (!debt) debt = 50;
    var ocf = ni + dep - ar - inv + ap, icf = -capex, fcf = debt - div, net = ocf + icf + fcf;
    return { q: 'กำไรสุทธิ <b>' + ni + '</b>, ค่าเสื่อม <b>' + dep + '</b>, ลูกหนี้' + (ar > 0 ? 'เพิ่ม' : 'ลด') + ' <b>' + Math.abs(ar) + '</b>, สินค้าคงเหลือ' + (inv > 0 ? 'เพิ่ม' : 'ลด') + ' <b>' + Math.abs(inv) + '</b>, เจ้าหนี้' + (ap > 0 ? 'เพิ่ม' : 'ลด') + ' <b>' + Math.abs(ap) + '</b>, ซื้อสินทรัพย์ถาวร <b>' + capex + '</b>, เงินกู้' + (debt > 0 ? 'เพิ่ม' : 'จ่ายคืน') + ' <b>' + Math.abs(debt) + '</b>, จ่ายเงินปันผล <b>' + div + '</b>, เงินสดต้นงวด <b>' + beg + '</b> (พิมพ์ค่าลบด้วย −)',
      fields: [{ label: 'กระแสเงินสดดำเนินงาน', ans: ocf, tol: 0.5, show: ocf }, { label: 'กระแสเงินสดลงทุน', ans: icf, tol: 0.5, show: icf }, { label: 'กระแสเงินสดจัดหาเงินทุน', ans: fcf, tol: 0.5, show: fcf }, { label: 'เงินสดปลายงวด', ans: beg + net, tol: 0.5, show: beg + net }],
      why: 'OCF = ' + ocf + ', ลงทุน = ' + icf + ', จัดหาเงิน = ' + fcf + ' สุทธิ ' + net + ' ปลายงวด = ' + beg + ' + ' + net + ' = ' + (beg + net) };
  } });

  /* ---------- Profit vs cash simulator ---------- */
  G.range(['pc-s', 'pc-c'], function (s, c) {
    var cost = 600 * s / 1000, dep = 100, profit = s - cost - dep, cashIn = s * (1 - c / 100), cash = cashIn - cost, ar = s * c / 100;
    $('pc-so').textContent = G.fmt(s); $('pc-co').textContent = c + '%';
    var set = function (id, v, max) { var b = $(id); b.style.width = Math.min(100, Math.abs(v) / max * 100) + '%'; b.style.background = v < 0 ? 'var(--bad)' : ''; };
    var mx = Math.max(Math.abs(profit), Math.abs(cash), 300);
    set('pc-b1', profit, mx); set('pc-b2', cash, mx); set('pc-b3', ar, Math.max(ar, 300, mx));
    $('pc-v1').textContent = fmt(Math.round(profit)); $('pc-v2').textContent = fmt(Math.round(cash)); $('pc-v3').textContent = fmt(Math.round(ar));
    var vd = $('pc-vd');
    if (profit > 0 && cash < 0) { vd.className = 'verdict bad'; vd.textContent = 'กำไร ' + fmt(Math.round(profit)) + ' แต่เงินสดจากการขายติดลบ ' + fmt(Math.round(cash)) + ' ต้องหาเงินมาจ่ายผู้ขายวัตถุดิบ — นี่คือสาเหตุที่กิจการกำไรแต่เงินสดหมด'; }
    else if (profit <= 0) { vd.className = 'verdict w'; vd.textContent = 'ยอดขายต่ำ กำไรติดลบ'; }
    else { vd.className = 'verdict ok'; vd.textContent = 'กำไรและเงินสดจากการขายเป็นบวกทั้งคู่ แต่เงินสดน้อยกว่ากำไรเพราะลูกหนี้ ' + fmt(Math.round(ar)); }
  });

  /* ---------- Cash flow statement lab ---------- */
  (function () {
    var F = [['ni', 'กำไรสุทธิ', -200, 600, 10], ['dep', 'ค่าเสื่อมราคา', 0, 300, 10], ['dar', 'ลูกหนี้เพิ่ม (ลบ = ลด)', -300, 300, 10], ['dinv', 'สินค้าคงเหลือเพิ่ม (ลบ = ลด)', -400, 400, 10], ['dap', 'เจ้าหนี้เพิ่ม (ลบ = ลด)', -300, 300, 10], ['dac', 'ค่าใช้จ่ายค้างจ่ายเพิ่ม (ลบ = ลด)', -200, 200, 10], ['capex', 'ซื้อสินทรัพย์ถาวร', 0, 600, 10], ['sec', 'ซื้อหลักทรัพย์ (ลบ = ขาย)', -300, 600, 10], ['debt', 'กู้เพิ่ม − ชำระคืนหนี้ (สุทธิ)', -400, 400, 10], ['stock', 'ออกหุ้นเพิ่ม', 0, 400, 10], ['div', 'จ่ายเงินปันผล', 0, 300, 10], ['beg', 'เงินสดต้นงวด', 0, 500, 10]];
    var PRE = { baker: { ni: 180, dep: 100, dar: -100, dinv: -300, dap: 200, dac: -100, capex: 300, sec: 400, debt: 100, stock: 0, div: 80, beg: 300 }, start: { ni: -100, dep: 50, dar: 80, dinv: 120, dap: 20, dac: 0, capex: 200, sec: 0, debt: 300, stock: 200, div: 0, beg: 100 }, steady: { ni: 300, dep: 100, dar: 20, dinv: 20, dap: 10, dac: 0, capex: 100, sec: 0, debt: -100, stock: 0, div: 120, beg: 200 } };
    var el = $('g-lab'), inp = {}, out = {};
    var box = h('div', 'lab-in'); F.forEach(function (f) {
      var r = h('div', 'sl'); r.innerHTML = '<label for="lb-' + f[0] + '">' + f[1] + '</label><input type="range" id="lb-' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '"><output id="lbo-' + f[0] + '"></output>';
      box.appendChild(r);
    });
    var pb = h('div', 'flow-ctl'); [['baker', 'Baker 2003'], ['start', 'ธุรกิจเริ่มต้น (ขาดทุน)'], ['steady', 'ธุรกิจมั่นคง']].forEach(function (p) { var b = h('button', 'btn sm ghost', p[1]); b.onclick = function () { load(p[0]); }; pb.appendChild(b); });
    var res = h('div', 'lab-out');
    var lw = h('div', 'lab-wrap'), left = h('div'); left.appendChild(pb); left.appendChild(box); lw.appendChild(left); lw.appendChild(res); el.appendChild(lw);
    F.forEach(function (f) { inp[f[0]] = $('lb-' + f[0]); inp[f[0]].addEventListener('input', up); });
    function load(k) { F.forEach(function (f) { inp[f[0]].value = PRE[k][f[0]]; }); up(); }
    function up() {
      var v = {}; F.forEach(function (f) { v[f[0]] = parseFloat(inp[f[0]].value); $('lbo-' + f[0]).textContent = G.fmt(v[f[0]]); });
      var ocf = v.ni + v.dep - v.dar - v.dinv + v.dap + v.dac, icf = -v.capex - v.sec, fin = v.debt + v.stock - v.div, net = ocf + icf + fin, end = v.beg + net, fcfv = ocf - v.capex;
      var cl = function (x) { return x < 0 ? ' style="color:var(--bad)"' : ''; };
      res.innerHTML = '<table class="tb"><tr><th>กิจกรรม</th><th class="n">จำนวน</th></tr>' +
        '<tr><td>ดำเนินงาน</td><td class="n"' + cl(ocf) + '>' + fmt(ocf) + '</td></tr><tr><td>ลงทุน</td><td class="n"' + cl(icf) + '>' + fmt(icf) + '</td></tr><tr><td>จัดหาเงินทุน</td><td class="n"' + cl(fin) + '>' + fmt(fin) + '</td></tr>' +
        '<tr><td><b>เงินสดเปลี่ยนสุทธิ</b></td><td class="n hl">' + fmt(net) + '</td></tr><tr><td>เงินสดต้นงวด</td><td class="n">' + fmt(v.beg) + '</td></tr><tr><td><b>เงินสดปลายงวด</b></td><td class="n hl"' + cl(end) + '>' + fmt(end) + '</td></tr>' +
        '<tr><td>กระแสเงินสดอิสระ (OCF − ซื้อสินทรัพย์ถาวร)</td><td class="n">' + fmt(fcfv) + '</td></tr></table>';
      var sgn = function (x) { return x >= 0 ? '+' : '−'; };
      var tx = 'รูปแบบ: ดำเนินงาน ' + sgn(ocf) + '  ลงทุน ' + sgn(icf) + '  จัดหาเงินทุน ' + sgn(fin) + ' — ';
      var cls = 'ok';
      if (ocf >= 0 && icf < 0 && fin >= 0) tx += 'ธุรกิจเติบโต ลงทุนต่อเนื่องโดยมีเงินทุนจากภายนอกเสริม';
      else if (ocf >= 0 && icf < 0 && fin < 0) tx += 'ธุรกิจมั่นคง ใช้เงินสดของตนเองลงทุนและตอบแทนผู้ให้เงินทุน';
      else if (ocf < 0 && icf < 0 && fin >= 0) { tx += 'ธุรกิจเริ่มต้นหรือขาดทุน ต้องพึ่งเงินทุนภายนอก'; cls = 'w'; }
      else if (ocf < 0 && icf >= 0 && fin >= 0) { tx += 'ธุรกิจมีปัญหา ขายสินทรัพย์และกู้เพื่อประคองสภาพคล่อง'; cls = 'bad'; }
      else tx += 'รูปแบบอื่น ต้องดูบริบทประกอบ';
      if (end < 0) { tx += ' · เงินสดปลายงวดติดลบ แสดงว่าเงินไม่พอ ต้องหาเงินทุนเพิ่ม'; cls = 'bad'; }
      var vd = $('lb-vd'); vd.className = 'verdict ' + cls; vd.textContent = tx;
    }
    load('baker');
  })();

  /* ---------- Final summary bars on Baker slide (static) ---------- */
})();
