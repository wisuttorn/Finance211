/* Chapter 5: Working capital policies and cycles */
(function () {
  var G = Games, $ = function (id) { return document.getElementById(id); };
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var r2 = function (v) { return (Math.round(v * 100) / 100).toFixed(2); };
  var nf = function (v) { return G.fmt(Math.round(v), 0); };
  var nd = function (v, d) { return G.fmt(v, d); };

  G.tally($('g-poll'), { options: ['ลูกหนี้ไม่จ่ายตามกำหนด', 'สินค้าค้างสต็อก', 'ต้องจ่ายเจ้าหนี้เร็วเกินไป', 'ต้นทุนและค่าใช้จ่ายพุ่ง'] });
  G.sort($('g-wcsort'), {
    buckets: [{ id: 'ca', label: 'สินทรัพย์หมุนเวียน' }, { id: 'fa', label: 'สินทรัพย์ไม่หมุนเวียน' }, { id: 'cl', label: 'หนี้สินหมุนเวียน' }],
    items: [
      { t: 'เงินสด', b: 'ca', why: 'สภาพคล่องสูงสุด' }, { t: 'ลูกหนี้การค้า', b: 'ca', why: 'เก็บเงินภายใน 1 ปี' }, { t: 'สินค้าคงเหลือ', b: 'ca', why: 'ขายภายในรอบดำเนินงาน' }, { t: 'หลักทรัพย์ในความต้องการของตลาด', b: 'ca', why: 'แปลงเป็นเงินสดได้เร็ว' },
      { t: 'เครื่องจักร', b: 'fa', why: 'ถือไว้ใช้ระยะยาว' }, { t: 'อาคาร', b: 'fa', why: 'สินทรัพย์ถาวร' },
      { t: 'เจ้าหนี้การค้า', b: 'cl', why: 'ชำระภายใน 1 ปี' }, { t: 'ค่าใช้จ่ายค้างจ่าย', b: 'cl', why: 'ชำระเร็ว ๆ นี้' }, { t: 'ตั๋วเงินจ่าย', b: 'cl', why: 'ครบกำหนดภายใน 1 ปี' }
    ]
  });
  G.drill($('g-drill-nwc'), { gen: function () {
    var ca = rnd(10, 90) * 100, cl = rnd(10, 90) * 100, n = ca - cl;
    return { q: 'สินทรัพย์หมุนเวียน <b>' + nf(ca) + '</b> หนี้สินหมุนเวียน <b>' + nf(cl) + '</b> (ใส่เครื่องหมาย − ถ้า NWC ติดลบ)', fields: [{ label: 'NWC', ans: n, tol: 0.5, show: n }], why: nf(ca) + ' − ' + nf(cl) + ' = ' + nf(n) + ' ' + (n > 0 ? 'สถานะบวก' : n < 0 ? 'สถานะลบ' : 'สถานะศูนย์') };
  } });
  G.order($('g-cycle'), { items: ['ซื้อวัตถุดิบ (เกิดเจ้าหนี้การค้า)', 'ผลิต (สินค้าระหว่างผลิต)', 'ได้สินค้าสำเร็จรูป', 'ขายสินค้า (เกิดลูกหนี้)', 'เก็บเงินจากลูกหนี้ได้เงินสด', 'นำเงินสดไปจ่ายเจ้าหนี้และต้นทุน แล้วเริ่มรอบใหม่'] });
  G.sort($('g-pos'), {
    buckets: [{ id: 'p', label: 'NWC บวก' }, { id: 'z', label: 'NWC ศูนย์' }, { id: 'n', label: 'NWC ลบ' }],
    items: [
      { t: 'กำไรต่ำ สภาพคล่องสูง ความเสี่ยงต่ำ', b: 'p', why: 'ถือสินทรัพย์หมุนเวียนมาก ปลอดภัยแต่ผลตอบแทนต่ำ' }, { t: 'ใช้เงินทุนระยะยาวหนุนสินทรัพย์หมุนเวียนบางส่วน', b: 'p', why: 'NWC บวกคือส่วนที่ได้เงินทุนระยะยาว' },
      { t: 'กำไรปานกลาง สภาพคล่องปานกลาง ความเสี่ยงปานกลาง', b: 'z', why: 'สินทรัพย์หมุนเวียนเท่ากับหนี้สินหมุนเวียน' }, { t: 'สินทรัพย์หมุนเวียนเท่ากับหนี้สินหมุนเวียน', b: 'z', why: 'NWC = 0' },
      { t: 'กำไรสูง สภาพคล่องต่ำ ความเสี่ยงสูง', b: 'n', why: 'ใช้หนี้ระยะสั้นซื้อสินทรัพย์ระยะยาว' }, { t: 'หนี้สินหมุนเวียนมากกว่าสินทรัพย์หมุนเวียน', b: 'n', why: 'NWC ติดลบ' }
    ]
  });
  G.quiz($('g-factor'), { questions: [
    { q: 'ธุรกิจขายตามฤดูกาล ยอดขายผันผวนมาก ควรถือสินทรัพย์หมุนเวียน', o: ['น้อย', 'มากกว่าธุรกิจที่ยอดขายคงที่', 'เท่ากัน'], a: 1, why: 'ยอดขายผันผวนต้องมีสำรองรองรับ' },
    { q: 'กิจการกู้ธนาคารได้ทันทีเมื่อต้องการ ควรถือสินทรัพย์หมุนเวียน', o: ['น้อยลงได้', 'มากขึ้น', 'ไม่เกี่ยวข้อง'], a: 0, why: 'หาเงินได้เร็วจึงไม่ต้องเก็บสำรองมาก' },
    { q: 'ผู้บริหารที่เน้นความปลอดภัยมักเลือกนโยบาย', o: ['เชิงรุก', 'อนุรักษ์นิยม', 'ไม่มีนโยบาย'], a: 1, why: 'ถือสินทรัพย์หมุนเวียนมาก ลดความเสี่ยงขาดสภาพคล่อง' },
    { q: 'ตลาดแข่งขันรุนแรงต้องให้เครดิตลูกค้านาน ผลคือลูกหนี้', o: ['ลดลง', 'เพิ่มขึ้น', 'ไม่เปลี่ยน'], a: 1, why: 'เครดิตนานขึ้น ลูกหนี้ค้างมากขึ้น' }
  ] });
  /* investment policy lab */
  G.range(['iv-s', 'iv-r'], function (s, r) {
    $('iv-so').textContent = nf(s); $('iv-ro').textContent = r.toFixed(1) + '%';
    var c = s / 3.3, a = s / 4.3, g = s / 6.3, sv = (c - g) * r / 100;
    $('iv-c').textContent = nf(c); $('iv-a').textContent = nf(a); $('iv-g').textContent = nf(g); $('iv-sv').textContent = nd(sv, 1);
    var v = $('iv-vd'); v.className = 'verdict ok';
    v.textContent = 'เชิงรุกใช้สินทรัพย์หมุนเวียนน้อยกว่าอนุรักษ์นิยม ' + nf(c - g) + ' ลดต้นทุนเงินทุนได้ปีละ ' + nd(sv, 1) + ' แต่เสี่ยงสินค้าขาดและเก็บเงินไม่ทัน';
  });
  G.drill($('g-drill-inv'), { gen: function () {
    var t = [[3.3, 'อนุรักษ์นิยม'], [4.3, 'ปานกลาง'], [6.3, 'เชิงรุก']][rnd(0, 2)], s = rnd(4, 30) * 100, a = s / t[0];
    return { q: 'ยอดขาย <b>' + nf(s) + '</b> นโยบาย<b>' + t[1] + '</b> อัตราหมุนเวียน <b>' + t[0] + '</b> เท่า', fields: [{ label: 'สินทรัพย์หมุนเวียน', ans: a, tol: 1, show: nd(a, 1) }], why: nf(s) + ' ÷ ' + t[0] + ' = ' + nd(a, 1) };
  } });
  G.sort($('g-src'), {
    buckets: [{ id: 's', label: 'ระยะสั้น' }, { id: 'l', label: 'ระยะยาว' }],
    items: [
      { t: 'เจ้าหนี้การค้า', b: 's', why: 'ชำระภายใน 1 ปี' }, { t: 'ตั๋วเงินจ่าย', b: 's', why: 'ครบกำหนดสั้น' }, { t: 'เงินเบิกเกินบัญชี', b: 's', why: 'วงเงินระยะสั้น' }, { t: 'ค่าใช้จ่ายค้างจ่าย', b: 's', why: 'ค้างชำระระยะสั้น' },
      { t: 'เงินกู้ระยะยาว', b: 'l', why: 'ครบกำหนดเกิน 1 ปี' }, { t: 'หุ้นกู้', b: 'l', why: 'ตราสารหนี้ระยะยาว' }, { t: 'ส่วนของเจ้าของ', b: 'l', why: 'ไม่มีกำหนดคืน' }
    ]
  });
  /* strategy lab */
  var TA = [740, 820, 900, 860, 780, 700];
  function stratCost(lt, l, s) { var st = TA.map(function (v) { return Math.max(0, v - lt); }), avg = st.reduce(function (a, b) { return a + b; }, 0) / TA.length; return lt * l / 100 + avg * s / 100; }
  G.range(['sg-l', 'sg-s'], function (l, s) {
    $('sg-lo').textContent = l.toFixed(1) + '%'; $('sg-so').textContent = s.toFixed(1) + '%';
    var c = stratCost(900, l, s), m = stratCost(700, l, s), a = stratCost(550, l, s);
    $('sg-c').textContent = nd(c, 1); $('sg-m').textContent = nd(m, 1); $('sg-a').textContent = nd(a, 1);
    var mn = Math.min(c, m, a), nm = mn === c ? 'อนุรักษ์นิยม' : mn === m ? 'จับคู่' : 'เชิงรุก';
    $('sg-b').textContent = nm;
    var v = $('sg-vd'); v.className = 'verdict ok';
    v.textContent = s > l ? 'ต้นทุนระยะสั้นสูงกว่าระยะยาว กลยุทธ์ใช้หนี้ระยะสั้นมากกลับแพงกว่า และยังเสี่ยงกว่า' : 'ต้นทุนต่ำสุดคือ' + nm + ' (' + nd(mn, 1) + ') แต่ต้องชั่งน้ำหนักความเสี่ยงต่ออัตราดอกเบี้ยและการรีไฟแนนซ์ด้วย';
  });
  G.match($('g-strat'), { pairs: [
    ['ระยะยาวหนุนถึงจุดสูงสุดของ FCA แทบไม่ใช้หนี้ระยะสั้น', 'อนุรักษ์นิยม'],
    ['ระยะสั้นหนุน FCA และบางส่วนของ PCA', 'เชิงรุก'],
    ['ระยะสั้นหนุนเฉพาะ FCA ระยะยาวหนุน PCA และ FA', 'จับคู่']
  ] });
  /* drills: cash cycle */
  G.drill($('g-drill-cc'), { gen: function () {
    var a = rnd(30, 150), r = rnd(20, 90), p = rnd(10, 60), oc = a + r, cc = oc - p;
    return { q: 'AAI <b>' + a + '</b> วัน ACP <b>' + r + '</b> วัน APP <b>' + p + '</b> วัน', fields: [{ label: 'วงจรดำเนินงาน', ans: oc, tol: 0.5, unit: 'วัน' }, { label: 'วงจรเงินสด', ans: cc, tol: 0.5, unit: 'วัน' }, { label: 'รอบหมุนเงินสด', ans: 365 / cc, tol: 0.02, unit: 'รอบ', show: r2(365 / cc) }], why: 'OC = ' + oc + '  CC = ' + oc + ' − ' + p + ' = ' + cc + '  รอบ = 365 ÷ ' + cc + ' = ' + r2(365 / cc) };
  } });
  G.drill($('g-drill-days'), { gen: function () {
    var cogs = rnd(10, 60) * 365, inv = Math.round(cogs / 365 * rnd(20, 90)), days = Math.round(inv / cogs * 365);
    return { q: 'ต้นทุนสินค้าขาย <b>' + nf(cogs) + '</b> สินค้าคงเหลือ <b>' + nf(inv) + '</b>', fields: [{ label: 'AAI', ans: inv / cogs * 365, tol: 0.5, unit: 'วัน', show: days }], why: nf(inv) + ' ÷ ' + nf(cogs) + ' × 365 = ' + days + ' วัน' };
  } });
  /* cycle lab */
  G.range(['cy-i', 'cy-r', 'cy-p', 'cy-d'], function (i, r, p, d) {
    $('cy-io').textContent = i + ' วัน'; $('cy-ro').textContent = r + ' วัน'; $('cy-po').textContent = p + ' วัน'; $('cy-do').textContent = d;
    var oc = i + r, cc = oc - p;
    $('cy-oc').textContent = oc; $('cy-cc').textContent = cc; $('cy-t').textContent = cc > 0 ? r2(365 / cc) : '-'; $('cy-n').textContent = nf(cc * d);
    var W = 600, X = function (v) { return 20 + v / Math.max(oc, p, 1) * 560; };
    $('cy-chart').innerHTML = '<svg class="chart" viewBox="0 0 640 150" role="img" aria-label="วงจรเงินสด">' +
      '<rect x="20" y="10" width="' + (X(i) - 20) + '" height="26" fill="#2BA6A0"/><rect x="' + X(i) + '" y="10" width="' + (X(oc) - X(i)) + '" height="26" fill="#7B4AA0"/>' +
      '<text x="26" y="28" font-size="12" fill="#fff">AAI ' + i + '</text><text x="' + (X(i) + 6) + '" y="28" font-size="12" fill="#fff">ACP ' + r + '</text>' +
      '<rect x="20" y="52" width="' + (X(p) - 20) + '" height="26" fill="#B4412E"/><text x="26" y="70" font-size="12" fill="#fff">APP ' + p + '</text>' +
      '<rect x="' + (cc >= 0 ? X(p) : 20) + '" y="94" width="' + Math.max(2, Math.abs(X(Math.abs(cc)) - 20)) + '" height="26" fill="#C9A400"/><text x="' + ((cc >= 0 ? X(p) : 20) + 6) + '" y="112" font-size="12" fill="#12332B">วงจรเงินสด ' + cc + ' วัน</text></svg>';
    var v = $('cy-vd'); v.className = 'verdict ' + (cc <= 0 ? 'ok' : 'ok');
    v.textContent = cc <= 0 ? 'วงจรเงินสดติดลบ: ได้เงินจากลูกค้าก่อนจ่ายเจ้าหนี้ (เหมือนซุปเปอร์มาร์เก็ต) แทบไม่ต้องใช้เงินทุนหมุนเวียน' : 'เงินสดจมประมาณ ' + nf(cc * d) + ' พันบาท ลดวงจรเงินสดลง 1 วันจะปลดปล่อยเงิน ' + d + ' พันบาท';
  });
  G.quiz($('g-q5'), { questions: [
    { q: 'สินทรัพย์หมุนเวียน 5,000 หนี้สินหมุนเวียน 3,200 NWC เท่าใด', o: ['1,800', '8,200', '−1,800', '3,200'], a: 0, why: '5,000 − 3,200 = 1,800' },
    { q: 'ยอดขาย 1,260 อัตราหมุนเวียน 6.3 เท่า สินทรัพย์หมุนเวียนเท่าใด', o: ['200', '300', '126', '7,938'], a: 0, why: '1,260 ÷ 6.3 = 200' },
    { q: 'กลยุทธ์ใดใช้หนี้ระยะสั้นสนับสนุน PCA ด้วย', o: ['อนุรักษ์นิยม', 'เชิงรุก', 'จับคู่'], a: 1, why: 'เชิงรุกใช้หนี้ระยะสั้นทั้ง FCA และบางส่วนของ PCA' },
    { q: 'AAI 90 ACP 45 APP 30 วงจรเงินสดเท่าใด', o: ['105 วัน', '135 วัน', '165 วัน', '75 วัน'], a: 0, why: '90 + 45 − 30 = 105' },
    { q: 'วงจรเงินสด 105 วัน รอบหมุนเงินสดต่อปี', o: ['3.48', '2.00', '1.05', '5.00'], a: 0, why: '365 ÷ 105 = 3.48' },
    { q: 'สินค้าคงเหลือ 400 ต้นทุนขาย 2,920 AAI เท่าใด', o: ['50 วัน', '73 วัน', '40 วัน', '30 วัน'], a: 0, why: '400 ÷ 2,920 × 365 = 50' },
    { q: 'ข้อใดทำให้วงจรเงินสดสั้นลง', o: ['เร่งเก็บหนี้', 'ถือสินค้ามากขึ้น', 'จ่ายเจ้าหนี้เร็วขึ้น', 'ให้เครดิตนานขึ้น'], a: 0, why: 'ลด ACP ทำให้ CC สั้นลง' },
    { q: 'สถานะ NWC ติดลบเสี่ยงเพราะอะไร', o: ['หนี้สินหมุนเวียนมากกว่าสินทรัพย์หมุนเวียน', 'สินทรัพย์ถาวรมาก', 'กำไรต่ำ', 'ไม่มีความเสี่ยง'], a: 0, why: 'อาจหาเงินจ่ายหนี้ระยะสั้นไม่ทัน' }
  ] });
})();
/*XTRA-START*/
(function(){var G=Games,$=function(i){return document.getElementById(i)};var rnd=function(a,b){return a+Math.floor(Math.random()*(b-a+1))};var pick=function(a){return a[rnd(0,a.length-1)]};var d1=function(v){return (Math.round(v*10)/10).toFixed(1)};var d2=function(v){return (Math.round(v*100)/100).toFixed(2)};var nf=function(v){return G.fmt(Math.round(v),0)};
G.drill($('g-xd1'),{gen:function(){var ca=pick([400,500,600,800]),cl=pick([200,250,300,400]),n=ca-cl,c=ca/cl;return {q:"สินทรัพย์หมุนเวียน <b>"+ca+"</b> · หนี้สินหมุนเวียน <b>"+cl+"</b>",fields:[{label:"NWC",ans:n,tol:0.5,unit:"",show:nf(n)},{label:"CR",ans:c,tol:0.011,unit:"เท่า",show:d2(c)}],why:"NWC = "+ca+" − "+cl+" = "+nf(n)+" · CR = "+ca+" ÷ "+cl+" = "+d2(c)};}});
G.drill($('g-xd2'),{gen:function(){var cg=pick([1800,2400,3600]),sl=cg*pick([1.25,1.5]),iv=cg/365*pick([30,45,60]),ar=sl/365*pick([30,40,50]),ap=cg/365*pick([20,30,40]),i=iv/(cg/365),r=ar/(sl/365),p=ap/(cg/365);return {q:"ต้นทุนขาย <b>"+nf(cg)+"</b> · ยอดขาย <b>"+nf(sl)+"</b> · สินค้า <b>"+d1(iv)+"</b> · ลูกหนี้ <b>"+d1(ar)+"</b> · เจ้าหนี้ <b>"+d1(ap)+"</b> (ต่อปี 365 วัน)",fields:[{label:"ICP",ans:i,tol:0.6,unit:"วัน",show:d1(i)},{label:"RCP",ans:r,tol:0.6,unit:"วัน",show:d1(r)},{label:"PDP",ans:p,tol:0.6,unit:"วัน",show:d1(p)}],why:"ICP = สินค้า ÷ (ต้นทุนขาย ÷ 365) · RCP = ลูกหนี้ ÷ (ยอดขาย ÷ 365) · PDP = เจ้าหนี้ ÷ (ต้นทุนขาย ÷ 365)"};}});
G.drill($('g-xd3'),{gen:function(){var i=pick([30,45,60,80]),r=pick([25,35,45,60]),p=pick([15,25,30,40]),oc=i+r,c=oc-p;return {q:"ICP <b>"+i+"</b> · RCP <b>"+r+"</b> · PDP <b>"+p+"</b> วัน",fields:[{label:"OC",ans:oc,tol:0.5,unit:"วัน",show:nf(oc)},{label:"CCC",ans:c,tol:0.5,unit:"วัน",show:nf(c)}],why:"OC = "+i+" + "+r+" = "+oc+" · CCC = "+oc+" − "+p+" = "+c};}});
G.drill($('g-xd4'),{gen:function(){var cg=pick([3650,7300,18250]),c=pick([40,60,75,90]),k=pick([6,8,10,12]),d=cg/365,f=d*c,cost=f*k/100;return {q:"ต้นทุนขายปีละ <b>"+nf(cg)+"</b> · CCC <b>"+c+"</b> วัน · ดอกเบี้ย <b>"+k+"%</b>",fields:[{label:"เงินทุนที่ต้องจัดหา",ans:f,tol:0.6,unit:"",show:nf(f)},{label:"ต้นทุนการเงินต่อปี",ans:cost,tol:0.06,unit:"",show:d1(cost)}],why:"ต้นทุนขายต่อวัน "+d1(d)+" × "+c+" = "+nf(f)+" · × "+k+"% = "+d1(cost)};}});
G.drill($('g-xd5'),{gen:function(){var eb=pick([800,1000,1200]),fa=pick([3000,4000]),c1=pick([4000,5000]),c2=pick([2000,3000]),r1=eb/(fa+c1)*100,r2=eb/(fa+c2)*100;return {q:"EBIT <b>"+eb+"</b> · สินทรัพย์ถาวร <b>"+fa+"</b> · CA อนุรักษ์ <b>"+c1+"</b> · CA เชิงรุก <b>"+c2+"</b>",fields:[{label:"ROA อนุรักษ์",ans:r1,tol:0.06,unit:"%",show:d1(r1)},{label:"ROA เชิงรุก",ans:r2,tol:0.06,unit:"%",show:d1(r2)}],why:"ROA = EBIT ÷ (สินทรัพย์ถาวร + CA) · อนุรักษ์ "+d1(r1)+"% · เชิงรุก "+d1(r2)+"%"};}});
G.quiz($('g-xq1'),{questions:[{"q": "NWC เท่ากับ", "o": ["CA − CL", "CA + CL", "CL − CA", "CA ÷ CL"], "a": 0, "why": "นิยาม NWC"}, {"q": "CR = 2.0 CL = 400 CA เท่ากับ", "o": ["800", "200", "2,400", "600"], "a": 0, "why": "CA = CR × CL"}, {"q": "QR ต่างจาก CR ตรงที่", "o": ["ตัดสินค้าคงเหลือออก", "ตัดเงินสดออก", "ตัดเจ้าหนี้ออก", "ตัดลูกหนี้ออก"], "a": 0, "why": "สินค้าเปลี่ยนเป็นเงินสดช้า"}, {"q": "ICP คือ", "o": ["วันที่สินค้าอยู่ในกิจการก่อนขาย", "วันเก็บหนี้", "วันชำระเจ้าหนี้", "วันที่เงินสดคงที่"], "a": 0, "why": "Inventory conversion period"}, {"q": "OC = ", "o": ["ICP + RCP", "ICP − RCP", "RCP − PDP", "PDP + RCP"], "a": 0, "why": "วงจรดำเนินงาน"}, {"q": "CCC = ", "o": ["OC − PDP", "OC + PDP", "ICP − RCP", "PDP − OC"], "a": 0, "why": "วงจรเงินสด"}]});
G.quiz($('g-xq2'),{questions:[{"q": "ICP 50 RCP 40 PDP 30 CCC เท่ากับ", "o": ["60 วัน", "120 วัน", "20 วัน", "−40 วัน"], "a": 0, "why": "50 + 40 − 30"}, {"q": "วิธีลด CCC ที่ถูกต้องคือ", "o": ["เก็บหนี้เร็วขึ้น", "จ่ายเจ้าหนี้เร็วขึ้น", "สต็อกสินค้ามากขึ้น", "ให้เครดิตลูกค้านานขึ้น"], "a": 0, "why": "RCP ลดลง CCC ลดลง"}, {"q": "นโยบายเชิงรุกถือ CA", "o": ["น้อย ผลตอบแทนสูงแต่เสี่ยงสภาพคล่อง", "มาก ปลอดภัยสุด", "เท่ากับ CL", "ไม่เกี่ยวกับ CA"], "a": 0, "why": "ลดสินทรัพย์ที่ไม่ก่อรายได้"}, {"q": "เงินทุนระยะสั้นเมื่อเทียบกับระยะยาวโดยทั่วไป", "o": ["ต้นทุนต่ำกว่าแต่เสี่ยงต่ออายุ", "ต้นทุนสูงกว่าเสมอ", "ไม่มีความเสี่ยง", "ใช้ซื้อที่ดินเท่านั้น"], "a": 0, "why": "เส้นอัตราผลตอบแทนปกติ"}, {"q": "ต้นทุนขายต่อวัน 10 CCC 60 วัน ต้องจัดหาเงินทุน", "o": ["600", "70", "6", "1,200"], "a": 0, "why": "10 × 60"}, {"q": "Maturity matching คือ", "o": ["ใช้เงินทุนอายุสอดคล้องกับอายุสินทรัพย์", "กู้ระยะสั้นทั้งหมด", "กู้ระยะยาวทั้งหมด", "ไม่ใช้หนี้"], "a": 0, "why": "จับคู่อายุ"}]});
})();
/*XTRA-END*/
