/* Chapter 10: Trends in financial industry */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var pick = function (a) { return a[rnd(0, a.length - 1)]; };
  var nf = function (v) { return G.fmt(Math.round(v), 0); };
  var d1 = function (v) { return (Math.round(v * 10) / 10).toFixed(1); };
  var d2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var d3 = function (v) { return (Math.round(v * 1000) / 1000).toFixed(3); };
  var ann = function (r, n) { return (1 - Math.pow(1 + r, -n)) / r; };

  /* ---- compact SHA-256 ---- */
  function sha256(str) {
    var K = [], H = [], i, j, p = 0, isP = function (n) { for (var k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; }, fr = function (x) { return ((x - Math.floor(x)) * 4294967296) | 0; };
    for (var c = 2; p < 64; c++) if (isP(c)) { if (p < 8) H[p] = fr(Math.pow(c, 0.5)); K[p++] = fr(Math.pow(c, 1 / 3)); }
    var bytes = unescape(encodeURIComponent(str)), len = bytes.length, w = [], m = [];
    for (i = 0; i < len; i++) m[i >> 2] |= bytes.charCodeAt(i) << ((3 - i % 4) * 8);
    m[len >> 2] |= 0x80 << ((3 - len % 4) * 8);
    m[(((len + 8) >> 6) << 4) + 15] = len * 8;
    var h = H.slice(0, 8), rr = function (x, n) { return (x >>> n) | (x << (32 - n)); };
    for (j = 0; j < m.length; j += 16) {
      for (i = 0; i < 64; i++) {
        if (i < 16) w[i] = m[j + i] | 0; else { var a0 = w[i - 15], a1 = w[i - 2]; w[i] = (w[i - 16] + (rr(a0, 7) ^ rr(a0, 18) ^ (a0 >>> 3)) + w[i - 7] + (rr(a1, 17) ^ rr(a1, 19) ^ (a1 >>> 10))) | 0; }
      }
      var a = h[0], b = h[1], cc = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (i = 0; i < 64; i++) {
        var t1 = (hh + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0, t2 = ((rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & b) ^ (a & cc) ^ (b & cc))) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + cc) | 0; h[3] = (h[3] + d) | 0; h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    return h.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }
  window.__sha256 = sha256;

  /* ---- hash chain lab ---- */
  (function () {
    var el = $('hc-lab'); if (!el) return;
    var blocks = [{ d: 'A โอน B 10', n: 0 }, { d: 'B โอน C 4', n: 0 }, { d: 'C โอน D 1', n: 0 }];
    el.innerHTML = '<div class="sl"><label for="hc-z">จำนวนศูนย์นำหน้าที่ต้องการ</label><select id="hc-z"><option>1</option><option selected>2</option><option>3</option></select></div><div id="hc-rows"></div><div class="verdict ok" id="hc-vd"></div>';
    var rows = $('hc-rows'), zsel = $('hc-z');
    function hashOf(i, prev) { return sha256(i + '|' + prev + '|' + blocks[i].d + '|' + blocks[i].n); }
    function render(keep) {
      var z = Array(+zsel.value + 1).join('0'), prev = Array(65).join('0'), ok = true, bad = 0;
      blocks.forEach(function (b, i) {
        var hs = hashOf(i, prev), valid = hs.indexOf(z) === 0, row = $('hc-r' + i);
        if (!row) { row = document.createElement('div'); row.id = 'hc-r' + i; row.className = 'card'; row.style.margin = '.4rem 0'; rows.appendChild(row); row.innerHTML = '<b>บล็อก ' + (i + 1) + '</b> <input class="fill" id="hc-d' + i + '" style="width:12rem" aria-label="ข้อมูลบล็อก ' + (i + 1) + '"> <span class="small">nonce</span> <b id="hc-n' + i + '"></b> <button class="btn" id="hc-m' + i + '">ขุด</button><div class="small" style="font-family:monospace;word-break:break-all">แฮชก่อนหน้า: <span id="hc-p' + i + '"></span></div><div style="font-family:monospace;word-break:break-all">แฮช: <span id="hc-h' + i + '"></span></div><div class="small" id="hc-s' + i + '"></div>'; $('hc-d' + i).value = b.d; $('hc-d' + i).oninput = function () { blocks[i].d = this.value; render(); }; $('hc-m' + i).onclick = function () { mine(i); }; }
        $('hc-n' + i).textContent = b.n; $('hc-p' + i).textContent = prev.slice(0, 16) + '…'; $('hc-h' + i).textContent = hs.slice(0, 16) + '…' + hs.slice(-6);
        $('hc-h' + i).style.color = valid ? '#0F5C4D' : '#B4412E';
        $('hc-s' + i).textContent = valid ? 'ถูกต้อง (แฮชขึ้นต้นด้วย ' + z + ')' : 'ไม่ถูกต้อง ต้องขุดใหม่';
        if (!valid) bad++; prev = hs;
      });
      var v = $('hc-vd'); v.className = 'verdict ' + (bad ? 'bad' : 'ok');
      v.textContent = bad ? 'มี ' + bad + ' บล็อกไม่ถูกต้อง: เมื่อแก้บล็อกใด แฮชของบล็อกนั้นเปลี่ยน ทำให้ทุกบล็อกถัดไปไม่ตรงกัน ต้องขุดใหม่ทีละบล็อกตามลำดับ' : 'ทุกบล็อกถูกต้อง ลองแก้ข้อมูลในบล็อกที่ 1 ดู';
    }
    function mine(i) {
      var z = Array(+zsel.value + 1).join('0'), prev = Array(65).join('0'), k;
      for (k = 0; k < i; k++) prev = hashOf(k, prev);
      var n = 0, tries = 0;
      while (tries < 3000000) { blocks[i].n = n; if (hashOf(i, prev).indexOf(z) === 0) break; n++; tries++; }
      render(); $('hc-s' + i).textContent += ' · ลอง ' + nf(tries + 1) + ' ครั้ง';
    }
    zsel.onchange = function () { render(); autoMine(); }; render();
    function autoMine() { for (var i = 0; i < blocks.length; i++) { blocks[i].n = 0; } for (i = 0; i < blocks.length; i++) mine(i); }
    autoMine();
  })();

  G.tally($('g-poll'), { options: ['ธนาคารเป็นผู้เก็บบัญชี', 'เครือข่ายหลายเครื่องช่วยกันเก็บ', 'ต้องดูข้อมูลอื่นก่อน'] });
  G.sort($('g-cen'), {
    buckets: [{ id: 'c', label: 'รวมศูนย์ (Centralized)' }, { id: 'd', label: 'กระจายศูนย์ (Decentralized)' }],
    items: [
      { t: 'ธนาคารเป็นตัวกลางถือบัญชีหลัก', b: 'c', why: 'มีศูนย์กลางเดียว' }, { t: 'ล่มที่ศูนย์กลาง ทั้งระบบได้รับผลกระทบ', b: 'c', why: 'จุดล้มเหลวจุดเดียว' },
      { t: 'ทุกโหนดถือสำเนาข้อมูลชุดเดียวกัน', b: 'd', why: 'ข้อมูลกระจายหลายสำเนา' }, { t: 'เครือข่ายช่วยกันตรวจสอบธุรกรรม', b: 'd', why: 'ไม่ต้องพึ่งตัวกลาง' },
      { t: 'ผู้ใช้ต้องเชื่อใจตัวกลาง', b: 'c', why: 'ความไว้วางใจอยู่ที่ตัวกลาง' }, { t: 'Bitcoin', b: 'd', why: 'ลดบทบาทของตัวกลาง' }
    ]
  });
  G.match($('g-func'), { pairs: [['บันทึกธุรกรรม (Record)', 'เก็บรายการโอน ซื้อขาย หรือสัญญาเป็นข้อมูลดิจิทัล'], ['ตรวจสอบและยืนยัน (Verify)', 'โหนดตรวจสอบความถูกต้องก่อนบันทึก'], ['เก็บอย่างปลอดภัย (Store)', 'ข้อมูลที่บันทึกแล้วแก้ย้อนหลังไม่ได้'], ['เผยแพร่ข้อมูล (Distribute)', 'ส่งสำเนาให้ทุกโหนดพร้อมกัน']] });
  G.match($('g-feat'), { pairs: [['Distribution', 'โหนดและฟูลโหนดเก็บสำเนาข้อมูล'], ['Encryption', 'กุญแจสาธารณะและกุญแจส่วนตัว'], ['Immutability', 'Timestamp และ Hash ทำให้แก้ย้อนหลังไม่ได้'], ['Tokenization', 'แปลงสิทธิ์ในสินทรัพย์เป็นหน่วยดิจิทัล'], ['Decentralization', 'ตกลงกันด้วยกลไกฉันทามติ ไม่มีศูนย์กลาง']] });
  G.order($('g-flow'), { items: ['ผู้ใช้ขอทำธุรกรรม', 'ส่งไปยังเครือข่าย P2P ของโหนด', 'โหนดตรวจสอบธุรกรรมและสถานะผู้ใช้', 'ธุรกรรมได้รับการยืนยัน', 'รวมกับธุรกรรมอื่นเป็นบล็อกใหม่', 'เพิ่มบล็อกต่อท้ายโซ่ แก้ไขไม่ได้', 'ธุรกรรมเสร็จสมบูรณ์'] });

  /* ---- PoW ---- */
  G.drill($('g-drill-pow'), { gen: function () {
    var d = pick([3, 4, 5]), hr = pick([1000, 2000, 5000, 10000]), tries = Math.pow(16, d), tm = tries / hr;
    return { q: 'แฮชต้องขึ้นต้นด้วยศูนย์ <b>' + d + '</b> ตัว (ฐาน 16) กำลังคำนวณ <b>' + nf(hr) + '</b> แฮชต่อวินาที', fields: [{ label: 'การลองเฉลี่ย 16^d', ans: tries, tol: 0.5, show: nf(tries) }, { label: 'เวลาเฉลี่ย', ans: tm, tol: Math.max(0.01, tm * 0.002), unit: 'วินาที', show: d2(tm) }], why: '16^' + d + ' = ' + nf(tries) + ' ครั้ง ÷ ' + nf(hr) + ' = ' + d2(tm) + ' วินาที' };
  } });
  G.range(['pw-d', 'pw-h'], function (d, hr) {
    $('pw-do').textContent = d; $('pw-ho').textContent = nf(hr);
    var tries = Math.pow(16, d), tm = tries / hr;
    $('pw-t').textContent = nf(tries); $('pw-s').textContent = d2(tm); $('pw-m').textContent = d2(tm / 60); $('pw-p').textContent = '1 ใน ' + nf(tries);
    var v = $('pw-vd'); v.className = 'verdict ' + (tm > 600 ? 'bad' : 'ok');
    v.textContent = 'ใช้เวลาเฉลี่ย ' + d2(tm / 60) + ' นาที เครือข่ายจริงปรับความยากเพื่อให้ได้บล็อกใหม่ราว 10 นาที ถ้านักขุดมากขึ้น ความยาก d จะถูกปรับขึ้น';
  });
  G.drill($('g-drill-halv'), { gen: function () {
    var n = rnd(2, 6), k = rnd(2, 5), r = 50 / Math.pow(2, n), s = 21 * (1 - Math.pow(0.5, k));
    return { q: 'ลดครึ่งไปแล้ว <b>' + n + '</b> ครั้ง และพิจารณาอุปทานสะสมหลังจบยุคที่ <b>' + k + '</b>', fields: [{ label: 'รางวัลต่อบล็อก (BTC)', ans: r, tol: 0.001, show: r.toFixed(4) }, { label: 'อุปทานสะสม (ล้านเหรียญ)', ans: s, tol: 0.002, show: s.toFixed(4) }], why: '50 ÷ 2^' + n + ' = ' + r + ' · 21 × (1 − 0.5^' + k + ') = ' + s.toFixed(4) };
  } });
  G.range(['hv-n'], function (n) {
    $('hv-no').textContent = n; var r = 50 / Math.pow(2, n), s = 21 * (1 - Math.pow(0.5, n + 1));
    $('hv-r').textContent = r.toFixed(4); $('hv-s').textContent = s.toFixed(4); $('hv-c').textContent = (s / 21 * 100).toFixed(2) + '%'; $('hv-y').textContent = n === 0 ? 2009 : 2008 + 4 * n;
    var v = $('hv-vd'); v.className = 'verdict ok'; v.textContent = 'หลังลดครึ่ง ' + n + ' ครั้ง รางวัลเหลือ ' + r.toFixed(4) + ' BTC อุปทานจะเข้าใกล้ 21 ล้านแต่ไม่เกิน';
  });
  G.range(['mn-s', 'mn-n', 'mn-p', 'mn-c'], function (s, n, p, c) {
    $('mn-so').textContent = s.toFixed(1) + '%'; $('mn-no').textContent = n; $('mn-po').textContent = nf(p); $('mn-co').textContent = nf(c);
    var rw = 50 / Math.pow(2, n), blocks = s / 100 * 144, btc = blocks * rw, rev = btc * p, prof = rev - c, be = c / btc;
    $('mn-b').textContent = d2(blocks); $('mn-r').textContent = nf(rev); $('mn-f').textContent = nf(prof); $('mn-e').textContent = nf(be) + ' บาท';
    var v = $('mn-vd'); v.className = 'verdict ' + (prof >= 0 ? 'ok' : 'bad');
    v.textContent = prof >= 0 ? 'รางวัล ' + rw.toFixed(3) + ' BTC ต่อบล็อก กำไรต่อวัน ' + nf(prof) + ' บาท' : 'ขาดทุนต่อวัน ' + nf(-prof) + ' บาท ต้องการราคาอย่างน้อย ' + nf(be) + ' บาทจึงจะเสมอทุน';
  });
  G.drill($('g-drill-pos'), { gen: function () {
    var st = pick([32, 64, 96]), tot = pick([8000, 10000, 16000]), apr = pick([3, 3.5, 4, 4.5]), pr = st / tot * 100, rw = st * apr / 100;
    return { q: 'วางเหรียญ <b>' + st + '</b> ETH จากทั้งเครือข่าย <b>' + nf(tot) + '</b> ETH ผลตอบแทน <b>' + apr + '%</b> ต่อปี', fields: [{ label: 'โอกาสถูกเลือก', ans: pr, tol: 0.005, unit: '%', show: d3(pr) }, { label: 'รางวัลต่อปี', ans: rw, tol: 0.005, unit: 'ETH', show: d2(rw) }], why: st + ' ÷ ' + nf(tot) + ' = ' + d3(pr) + '% · ' + st + ' × ' + apr + '% = ' + d2(rw) + ' ETH' };
  } });
  G.sort($('g-powpos'), {
    buckets: [{ id: 'w', label: 'Proof of Work' }, { id: 's', label: 'Proof of Stake' }],
    items: [
      { t: 'นักขุดแข่งกันแก้โจทย์คำนวณ', b: 'w', why: 'ใช้พลังคำนวณ' }, { t: 'ผู้ตรวจสอบวางเหรียญค้ำ (Staking)', b: 's', why: 'ค้ำด้วยเหรียญ' },
      { t: 'ใช้ไฟฟ้ามาก', b: 'w', why: 'ต้องลองแฮชจำนวนมาก' }, { t: 'ถูกตัดเหรียญเมื่อทำผิดกติกา (Slashing)', b: 's', why: 'ค่าปรับคือเหรียญที่วางค้ำ' },
      { t: 'Bitcoin', b: 'w', why: 'Bitcoin ใช้ PoW' }, { t: 'Ethereum (ปัจจุบัน)', b: 's', why: 'Ethereum ใช้ PoS' }, { t: 'ผู้ชนะได้รางวัลบล็อกและต้องลดครึ่งตามกำหนด', b: 'w', why: 'กลไกรางวัลของ Bitcoin' }
    ]
  });

  /* ---- tokens ---- */
  G.sort($('g-token'), {
    buckets: [{ id: 'p', label: 'Payment token' }, { id: 'u', label: 'Utility token' }, { id: 's', label: 'Security token' }],
    items: [
      { t: 'ใช้เป็นสื่อกลางซื้อสินค้า', b: 'p', why: 'หน้าที่ชำระเงิน' }, { t: 'Stablecoin ผูกกับเงินบาท', b: 'p', why: 'ใช้ชำระเงินและเก็บมูลค่า' },
      { t: 'แลกสิทธิ์ใช้บริการแพลตฟอร์ม ไม่มีส่วนแบ่งกำไร', b: 'u', why: 'ให้สิทธิ์ใช้งาน' }, { t: 'บัตรกำนัลดิจิทัลสำหรับร้านค้าเดียว', b: 'u', why: 'เข้าถึงสินค้าหรือบริการ' },
      { t: 'แทนหุ้นของกิจการและให้สิทธิรับเงินปันผล', b: 's', why: 'สิทธิในผลตอบแทน อยู่ใต้กฎหมายหลักทรัพย์' }, { t: 'โทเคนแทนส่วนของอาคารและรับค่าเช่า', b: 's', why: 'แทนสิทธิในสินทรัพย์' }
    ]
  });
  G.drill($('g-drill-tok'), { gen: function () {
    var v = pick([5, 8, 10, 20]) * 1000000, n = pick([500000, 1000000, 2000000]), q = rnd(1, 9) * 1000, rent = v * pick([0.04, 0.05, 0.06]), own = q / n, inc = rent * own;
    return { q: 'อาคารมูลค่า <b>' + nf(v) + '</b> บาท แปลงเป็น <b>' + nf(n) + '</b> โทเคน ซื้อ <b>' + nf(q) + '</b> โทเคน ค่าเช่าสุทธิทั้งอาคาร <b>' + nf(rent) + '</b> บาทต่อปี', fields: [{ label: 'สัดส่วนเป็นเจ้าของ', ans: own * 100, tol: 0.002, unit: '%', show: (own * 100).toFixed(3) }, { label: 'ค่าเช่าที่ได้ต่อปี', ans: inc, tol: 1, unit: 'บาท', show: nf(inc) }], why: nf(q) + ' ÷ ' + nf(n) + ' = ' + (own * 100).toFixed(3) + '% · ' + nf(rent) + ' × ' + own.toFixed(5) + ' = ' + nf(inc) };
  } });
  G.sort($('g-defi'), {
    buckets: [{ id: 't', label: 'การเงินดั้งเดิม' }, { id: 'd', label: 'DeFi' }],
    items: [
      { t: 'ธนาคารอนุมัติสินเชื่อและกำหนดดอกเบี้ย', b: 't', why: 'ตัวกลางตัดสินใจ' }, { t: 'Smart Contract ปล่อยกู้โดยใช้หลักประกัน', b: 'd', why: 'ทำงานอัตโนมัติ' },
      { t: 'ซื้อขายผ่านโบรกเกอร์ในเวลาทำการ', b: 't', why: 'ตัวกลางและเวลาทำการ' }, { t: 'แลกเหรียญกับกลุ่มสภาพคล่อง (DEX) 24 ชั่วโมง', b: 'd', why: 'ไม่ผ่านโบรกเกอร์' },
      { t: 'ดอกเบี้ยปรับตามอุปสงค์อุปทานของกลุ่มเงิน', b: 'd', why: 'กำหนดด้วยอัลกอริทึม' }, { t: 'ความเสี่ยงหลักคือช่องโหว่ของโค้ด', b: 'd', why: 'ความเสี่ยงของ Smart Contract' }
    ]
  });
  G.drill($('g-drill-lend'), { gen: function () {
    var D = pick([1, 2, 4, 5]) * 1000000, u = pick([40, 50, 60, 70, 80, 90]), B = D * u / 100, br = 2 + 10 * u / 100, sr = br * u / 100 * 0.9;
    return { q: 'เงินฝาก <b>' + nf(D) + '</b> ถูกกู้ <b>' + nf(B) + '</b> · ดอกเบี้ยกู้ = 2% + 10% × U · ดอกเบี้ยฝาก = ดอกเบี้ยกู้ × U × 0.9', fields: [{ label: 'U', ans: u, tol: 0.1, unit: '%' }, { label: 'ดอกเบี้ยกู้', ans: br, tol: 0.01, unit: '%', show: d2(br) }, { label: 'ดอกเบี้ยฝาก', ans: sr, tol: 0.01, unit: '%', show: d2(sr) }], why: 'U = ' + u + '% · กู้ = 2 + 10 × ' + (u / 100) + ' = ' + d2(br) + '% · ฝาก = ' + d2(br) + ' × ' + (u / 100) + ' × 0.9 = ' + d2(sr) + '%' };
  } });
  G.range(['ld-u', 'ld-b', 'ld-s', 'ld-r'], function (u, b, s, r) {
    $('ld-uo').textContent = u + '%'; $('ld-bo').textContent = b.toFixed(1) + '%'; $('ld-so').textContent = s + '%'; $('ld-ro').textContent = r + '%';
    var br = b + s * u / 100, sr = br * u / 100 * (1 - r / 100);
    $('ld-br').textContent = d2(br) + '%'; $('ld-sr').textContent = d2(sr) + '%';
    var v = $('ld-vd'); v.className = 'verdict ok'; v.textContent = u >= 90 ? 'U สูงมาก ดอกเบี้ยกู้พุ่งเพื่อดึงเงินฝากเข้ามาและกันไม่ให้ผู้ฝากถอนไม่ได้' : 'เมื่อมีคนกู้มากขึ้น (U สูงขึ้น) ดอกเบี้ยทั้งสองด้านสูงขึ้น ดึงดูดผู้ฝากเพิ่ม';
  });
  G.drill($('g-drill-hf'), { gen: function () {
    var C = pick([10, 15, 20, 30]) * 1000, ltv = pick([60, 70, 75]), dr = pick([10, 15, 20, 25, 30]), debt = C * ltv / 100, hf = C * (1 - dr / 100) * 0.8 / debt;
    return { q: 'หลักประกัน <b>' + nf(C) + '</b> LTV <b>' + ltv + '%</b> เกณฑ์บังคับขาย <b>80%</b> กู้เต็มวงเงิน ราคาหลักประกันตก <b>' + dr + '%</b>', fields: [{ label: 'กู้ได้สูงสุด', ans: debt, tol: 1, show: nf(debt) }, { label: 'Health factor ใหม่', ans: hf, tol: 0.005, show: d3(hf) }], why: 'หนี้ = ' + nf(debt) + ' · HF = ' + nf(C) + ' × ' + (1 - dr / 100).toFixed(2) + ' × 0.8 ÷ ' + nf(debt) + ' = ' + d3(hf) + (hf < 1 ? ' (ต่ำกว่า 1 ถูกบังคับขาย)' : ' (ปลอดภัย)') };
  } });
  G.range(['hf-c', 'hf-l', 'hf-d'], function (c, l, dd) {
    $('hf-co').textContent = nf(c); $('hf-lo').textContent = l + '%'; $('hf-do').textContent = dd + '%';
    var debt = c * l / 100, hf = c * (1 - dd / 100) * 0.8 / debt, mx = (1 - debt / (c * 0.8)) * 100;
    $('hf-m').textContent = nf(debt); $('hf-h').textContent = d3(hf); $('hf-x').textContent = mx.toFixed(1) + '%';
    var v = $('hf-vd'); v.className = 'verdict ' + (hf < 1 ? 'bad' : 'ok');
    v.textContent = hf < 1 ? 'Health factor ต่ำกว่า 1 ระบบบังคับขายหลักประกัน' : 'ยังปลอดภัย ราคาหลักประกันตกได้อีกก่อนถูกบังคับขาย (ราคาตกรวมได้สูงสุด ' + mx.toFixed(1) + '% จากเริ่มต้น)';
  });
  function dex(x, P, dx, f) { var y = x * P, d = dx * (1 - f / 100), out = y * d / (x + d), avg = out / dx; return { out: out, avg: avg, slip: (P - avg) / P * 100, d: d, newP: (y - out) / (x + dx) }; }
  G.drill($('g-drill-dex'), { gen: function () {
    var x = pick([50, 100, 200, 500]), P = pick([2000, 3000, 4000]), dx = pick([1, 2, 5, 10]), r = dex(x, P, dx, 0.3);
    return { q: 'กลุ่มมี ETH <b>' + x + '</b> และ USDT <b>' + nf(x * P) + '</b> (ราคา ' + nf(P) + ') ขาย ETH <b>' + dx + '</b> หน่วย ค่าธรรมเนียม <b>0.3%</b>', fields: [{ label: 'USDT ที่ได้', ans: r.out, tol: Math.max(1, r.out * 0.0002), show: nf(r.out) }, { label: 'Slippage', ans: r.slip, tol: 0.02, unit: '%', show: d2(r.slip) }], why: 'ETH สุทธิ ' + d3(r.d) + ' · USDT = ' + nf(x * P) + ' × ' + d3(r.d) + ' ÷ (' + x + ' + ' + d3(r.d) + ') = ' + nf(r.out) + ' · ราคาเฉลี่ย ' + nf(r.avg) + ' · slippage ' + d2(r.slip) + '%' };
  } });
  G.range(['dx-x', 'dx-t', 'dx-f'], function (x, t, f) {
    $('dx-xo').textContent = nf(x); $('dx-to').textContent = t.toFixed(1); $('dx-fo').textContent = f.toFixed(2) + '%';
    var r = dex(x, 3000, t, f);
    $('dx-o').textContent = nf(r.out); $('dx-a').textContent = nf(r.avg); $('dx-s').textContent = d2(r.slip) + '%'; $('dx-n').textContent = nf(r.newP);
    var v = $('dx-vd'); v.className = 'verdict ' + (r.slip > 5 ? 'bad' : 'ok');
    v.textContent = r.slip > 5 ? 'Slippage สูง คำสั่งใหญ่เมื่อเทียบกับขนาดกลุ่ม ควรแบ่งขายหรือใช้กลุ่มที่ใหญ่กว่า' : 'Slippage ต่ำ เพราะคำสั่งเล็กเมื่อเทียบกับกลุ่มสภาพคล่อง';
  });

  /* ---- sustainable ---- */
  G.sort($('g-esg'), {
    buckets: [{ id: 'e', label: 'E สิ่งแวดล้อม' }, { id: 's', label: 'S สังคม' }, { id: 'g', label: 'G ธรรมาภิบาล' }],
    items: [
      { t: 'การปล่อยก๊าซเรือนกระจก', b: 'e', why: 'ด้านสิ่งแวดล้อม' }, { t: 'การใช้น้ำและพลังงาน', b: 'e', why: 'ด้านสิ่งแวดล้อม' },
      { t: 'ความปลอดภัยในการทำงานของพนักงาน', b: 's', why: 'ด้านสังคม' }, { t: 'ความเท่าเทียมและการมีส่วนร่วมของชุมชน', b: 's', why: 'ด้านสังคม' },
      { t: 'โครงสร้างคณะกรรมการ', b: 'g', why: 'ธรรมาภิบาล' }, { t: 'การต่อต้านทุจริตและการเปิดเผยข้อมูล', b: 'g', why: 'ธรรมาภิบาล' }
    ]
  });
  G.match($('g-five'), { pairs: [['Climate Finance', 'ลดก๊าซเรือนกระจกและปรับตัวต่อสภาพอากาศ'], ['Green Finance', 'ระดมทุนโครงการสิ่งแวดล้อม เช่น Green bond'], ['Social Finance', 'สนับสนุนการศึกษา สาธารณสุข ที่อยู่อาศัย'], ['Impact Finance', 'ตั้งเป้าผลลัพธ์ที่วัดได้ควบคู่ผลตอบแทน'], ['ESG Investing', 'นำปัจจัย ESG มาคัดเลือกและติดตามหลักทรัพย์']] });
  G.drill($('g-drill-esg'), { gen: function () {
    var sc = [rnd(4, 9) * 10, rnd(4, 9) * 10, rnd(4, 9) * 10], t = 0.4 * sc[0] + 0.3 * sc[1] + 0.3 * sc[2];
    return { q: 'น้ำหนัก E 40% S 30% G 30% คะแนน E = <b>' + sc[0] + '</b> S = <b>' + sc[1] + '</b> G = <b>' + sc[2] + '</b> (ผ่านเมื่อ ≥ 70)', fields: [{ label: 'คะแนนรวม', ans: t, tol: 0.05, show: d1(t) }, { label: 'ผ่านหรือไม่ (1 = ผ่าน, 0 = ไม่ผ่าน)', ans: t >= 70 ? 1 : 0, tol: 0.01, show: t >= 70 ? '1' : '0' }], why: '0.4×' + sc[0] + ' + 0.3×' + sc[1] + ' + 0.3×' + sc[2] + ' = ' + d1(t) + (t >= 70 ? ' ผ่าน' : ' ไม่ผ่าน') };
  } });
  G.match($('g-ten'), { pairs: [['Green / Social / Sustainability bond', 'ใช้เงินกับโครงการเขียวหรือสังคม และรายงานผล'], ['Sustainability-linked bond', 'ดอกเบี้ยเพิ่มเมื่อพลาดเป้า KPI'], ['Sustainable mutual fund', 'รวมเงินรายย่อยลงทุนในกิจการผ่านเกณฑ์ ESG'], ['SET ESG', 'ดัชนีหุ้นที่คัดจากผลการดำเนินงานด้าน ESG'], ['Carbon credit platform', 'ซื้อขายสิทธิลดก๊าซ 1 ตัน CO₂e ต่อหน่วย'], ['Index insurance', 'จ่ายตามค่าดัชนี เช่น ปริมาณน้ำฝน'], ['Sustainability token', 'บันทึกสิทธิคาร์บอนหรือพลังงานสะอาดบนบล็อกเชน'], ['Securitization', 'รวมสินเชื่อเขียวแล้วออกตราสารเป็นชั้นความเสี่ยง'], ['Blended finance', 'ทุนที่รับความเสี่ยงก่อน ดึงทุนเอกชนเข้าร่วม'], ['REC platform', 'ซื้อขายใบรับรองพลังงานหมุนเวียนโดยตรง']] });
  G.drill($('g-drill-green'), { gen: function () {
    var F0 = pick([500, 800, 1000, 2000]), diff = pick([0.1, 0.15, 0.2, 0.25]), sv = F0 * diff / 100, pv = sv * ann(0.04, 10);
    return { q: 'ออก <b>' + nf(F0) + '</b> ล้านบาท 10 ปี ส่วนต่างดอกเบี้ย (Greenium) <b>' + diff.toFixed(2) + '%</b> คิดลด 4% (ตัวคูณเงินงวด 8.1109)', fields: [{ label: 'ประหยัดต่อปี', ans: sv, tol: 0.005, unit: 'ล้านบาท', show: d2(sv) }, { label: 'มูลค่าปัจจุบัน', ans: pv, tol: 0.02, unit: 'ล้านบาท', show: d2(pv) }], why: nf(F0) + ' × ' + diff.toFixed(2) + '% = ' + d2(sv) + ' · × 8.1109 = ' + d2(pv) };
  } });
  G.drill($('g-drill-carb'), { gen: function () {
    var E = pick([5, 8, 10, 15, 20]) * 1000, rd = pick([20, 30, 40, 50]), pr = pick([300, 400, 450, 500]), cr = E * (1 - rd / 100), cost = cr * pr;
    return { q: 'ปล่อย <b>' + nf(E) + '</b> tCO₂e ลดเอง <b>' + rd + '%</b> ซื้อเครดิตส่วนที่เหลือ <b>' + pr + '</b> บาทต่อตัน', fields: [{ label: 'ต้องซื้อเครดิต', ans: cr, tol: 0.5, unit: 'ตัน', show: nf(cr) }, { label: 'ค่าเครดิต', ans: cost, tol: 1, unit: 'บาท', show: nf(cost) }], why: nf(E) + ' × ' + (1 - rd / 100).toFixed(2) + ' = ' + nf(cr) + ' ตัน × ' + pr + ' = ' + nf(cost) };
  } });
  G.range(['cb-e', 'cb-r', 'cb-p', 'cb-t'], function (e, r, p, t) {
    $('cb-eo').textContent = nf(e); $('cb-ro').textContent = r + '%'; $('cb-po').textContent = nf(p); $('cb-to').textContent = nf(t);
    var n = e * (1 - r / 100), c = n * p, x = e * t;
    $('cb-n').textContent = nf(n); $('cb-c').textContent = nf(c); $('cb-x').textContent = nf(x); $('cb-d').textContent = nf(x - c);
    var v = $('cb-vd'); v.className = 'verdict ' + (c <= x ? 'ok' : 'bad');
    v.textContent = c <= x ? 'ซื้อเครดิตชดเชยส่วนที่เหลือ ถูกกว่าจ่ายภาษีคาร์บอนจากทั้งหมด ' + nf(x - c) + ' บาท' : 'ค่าเครดิตสูงกว่าภาษีถ้าไม่ลดเลย เพิ่มสัดส่วนที่ลดเองหรือรอราคาเครดิตลดลง';
  });
  function insPay(rain, trg, ex, lim) { if (rain >= trg) return 0; if (rain <= ex) return lim; return lim * (trg - rain) / (trg - ex); }
  G.drill($('g-drill-ins'), { gen: function () {
    var lim = pick([50, 100, 200]) * 1000, trg = 600, ex = pick([200, 300]), rain = rnd(ex / 10 + 5, 58) * 10, pay = insPay(rain, trg, ex, lim);
    return { q: 'วงเงิน <b>' + nf(lim) + '</b> จ่ายเมื่อฝนต่ำกว่า <b>600</b> มม. จ่ายเต็มเมื่อต่ำกว่า <b>' + ex + '</b> มม. ฝนที่วัดได้ <b>' + rain + '</b> มม.', fields: [{ label: 'สัดส่วนจ่าย', ans: pay / lim * 100, tol: 0.1, unit: '%', show: d1(pay / lim * 100) }, { label: 'เงินชดเชย', ans: pay, tol: 1, unit: 'บาท', show: nf(pay) }], why: '(600 − ' + rain + ') ÷ (600 − ' + ex + ') = ' + d1(pay / lim * 100) + '% × ' + nf(lim) + ' = ' + nf(pay) };
  } });
  G.range(['in-r', 'in-t', 'in-x'], function (r, t, x) {
    $('in-ro').textContent = r + ' มม.'; $('in-to').textContent = t + ' มม.'; $('in-xo').textContent = x + ' มม.';
    var pay = insPay(r, t, x, 100000);
    $('in-p').textContent = d1(pay / 1000) + '%'; $('in-m').textContent = nf(pay); $('in-n').textContent = nf(pay - 8000);
    var v = $('in-vd'); v.className = 'verdict ' + (pay === 0 ? 'bad' : 'ok');
    v.textContent = pay === 0 ? 'ฝนไม่ต่ำกว่าจุดเริ่มจ่าย ไม่มีเงินชดเชย เสียเบี้ย 8,000 บาท' : (pay === 100000 ? 'ฝนต่ำกว่าจุดจ่ายเต็ม ได้รับเต็มวงเงิน' : 'จ่ายตามสัดส่วนที่ฝนต่ำกว่าจุดเริ่มจ่าย');
  });
  G.drill($('g-drill-blend'), { gen: function () {
    var tot = 1000, jr = pick([100, 150, 200, 250]), loss = pick([80, 120, 180, 260, 300, 350]), jl = Math.min(loss, jr), sl = loss - jl, sen = tot - jr;
    return { q: 'กองทุน <b>1,000</b> ล้านบาท ชั้น First-loss <b>' + jr + '</b> ล้าน ชั้นเอกชน <b>' + sen + '</b> ล้าน พอร์ตขาดทุน <b>' + loss + '</b> ล้าน', fields: [{ label: 'ชั้นเอกชนขาดทุน', ans: sl, tol: 0.5, unit: 'ล้านบาท' }, { label: 'ชั้นเอกชนขาดทุนคิดเป็น', ans: sl / sen * 100, tol: 0.05, unit: '%', show: d1(sl / sen * 100) }], why: 'First-loss รับก่อนไม่เกิน ' + jr + ' ล้าน เหลือ ' + sl + ' ล้านตกที่ชั้นเอกชน = ' + sl + ' ÷ ' + sen + ' = ' + d1(sl / sen * 100) + '%' };
  } });
  G.drill($('g-drill-rec'), { gen: function () {
    var kw = pick([100, 200, 400, 500]), hr = pick([4, 4.2, 4.5]), pr = pick([0.75, 0.8, 0.85]), price = pick([200, 300, 400]), mwh = kw * hr * 365 * pr / 1000, rec = Math.floor(mwh);
    return { q: 'โซลาร์ <b>' + kw + '</b> kW ผลิต <b>' + hr + '</b> ชั่วโมงเต็มกำลังต่อวัน ประสิทธิภาพ <b>' + Math.round(pr * 100) + '%</b> ราคา REC <b>' + price + '</b> บาทต่อใบ (1 REC = 1 MWh ปัดลงเป็นใบเต็ม)', fields: [{ label: 'ไฟฟ้าต่อปี', ans: mwh, tol: 0.02, unit: 'MWh', show: d2(mwh) }, { label: 'รายได้จาก REC', ans: rec * price, tol: 1, unit: 'บาท', show: nf(rec * price) }], why: kw + ' × ' + hr + ' × 365 × ' + pr + ' ÷ 1,000 = ' + d2(mwh) + ' MWh → ' + rec + ' ใบ × ' + price + ' = ' + nf(rec * price) };
  } });
  G.quiz($('g-q10'), { questions: [
    { q: 'ข้อใดเป็นคุณสมบัติที่ทำให้แก้ข้อมูลย้อนหลังในบล็อกเชนได้ยาก', o: ['Hash ที่ผูกกับบล็อกก่อนหน้า', 'ธนาคารกลางอนุมัติทุกรายการ', 'ข้อมูลเก็บที่เครื่องเดียว', 'ไม่มี Timestamp'], a: 0, why: 'แก้บล็อกใด แฮชเปลี่ยน ทำให้บล็อกถัดไปไม่ตรง' },
    { q: 'แฮชต้องขึ้นต้นด้วยศูนย์ 4 ตัว (ฐาน 16) การลองเฉลี่ยคือ', o: ['65,536 ครั้ง', '4,096 ครั้ง', '16 ครั้ง', '1,048,576 ครั้ง'], a: 0, why: '16^4 = 65,536' },
    { q: 'รางวัลต่อบล็อกของ Bitcoin หลังลดครึ่งครั้งที่ 3 (เริ่ม 50)', o: ['6.25 BTC', '12.5 BTC', '3.125 BTC', '25 BTC'], a: 0, why: '50 ÷ 8 = 6.25' },
    { q: 'วางเหรียญ 50 ETH จากทั้งหมด 5,000 ETH โอกาสถูกเลือกตามสัดส่วนคือ', o: ['1%', '0.1%', '10%', '5%'], a: 0, why: '50 ÷ 5,000 = 1%' },
    { q: 'โทเคนที่แทนสิทธิรับค่าเช่าอาคารจัดเป็น', o: ['Security token', 'Utility token', 'Payment token', 'ไม่ใช่โทเคน'], a: 0, why: 'แทนสิทธิในสินทรัพย์และผลตอบแทน' },
    { q: 'กลุ่มเงินถูกกู้ 60% ดอกเบี้ยกู้ = 2% + 10% × U คือ', o: ['8%', '6%', '12%', '2.6%'], a: 0, why: '2% + 6%' },
    { q: 'วางหลักประกัน 10,000 LTV 70% เกณฑ์บังคับขาย 80% ราคาตกเกินเท่าใดจึงถูกบังคับขาย', o: ['12.5%', '20%', '30%', '7%'], a: 0, why: '1 − 7,000 ÷ 8,000' },
    { q: 'ใน DEX แบบ x × y = k ถ้าซื้อขายคำสั่งใหญ่เมื่อเทียบกับกลุ่ม', o: ['Slippage สูงขึ้น', 'Slippage ต่ำลง', 'ราคาไม่เปลี่ยน', 'ไม่มีค่าธรรมเนียม'], a: 0, why: 'ราคาเลื่อนไกลขึ้นตามขนาดคำสั่ง' },
    { q: 'Green bond 1,000 ล้านบาท ดอกเบี้ยต่ำกว่าพันธบัตรทั่วไป 0.20% ประหยัดต่อปี', o: ['2 ล้านบาท', '0.2 ล้านบาท', '20 ล้านบาท', '200 ล้านบาท'], a: 0, why: '1,000 × 0.20%' },
    { q: 'ความท้าทายสำคัญของการเงินที่ยั่งยืนคือ', o: ['การวัดผลและป้องกันการฟอกเขียว', 'ไม่มีผู้สนใจลงทุน', 'ต้องไม่มีผลตอบแทน', 'ใช้ได้เฉพาะภาครัฐ'], a: 0, why: 'ต้องวัดผลให้เทียบกันได้และตรวจสอบได้' }
  ] });
})();
