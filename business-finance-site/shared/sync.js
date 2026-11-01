/* Live-follow: instructor (host) broadcasts the current slide; students may opt in to follow.
   Uses Supabase Realtime Broadcast only (no database, nothing is stored).
   Host messages are signed (ECDSA P-256); students verify with the public key in sync-config.js,
   so only someone with the instructor passcode can steer the class. */
(function () {
  var C = window.SYNC_CONFIG;
  if (!C || !C.url || !C.key || !C.pub) return;           // not configured -> feature stays off
  var enc = new TextEncoder();
  var parts = location.pathname.split('/').filter(function (x) { return x && !/\.html?$/i.test(x); });
  var CH = 'f211-' + (parts[parts.length - 1] || 'root');
  var isHost = /[?&]host\b/.test(location.search);
  var follow = false, syncing = false, lastSeen = 0, lastSlide = -1, channel = null, priv = null, hostOn = false, hb = null;

  /* ---------- Live poll API (used by Games.tally): anonymous votes over Broadcast, nothing stored ---------- */
  var vid = ''; try { vid = sessionStorage.getItem('f211vid') || ''; if (!vid) { vid = Math.random().toString(36).slice(2, 10); sessionStorage.setItem('f211vid', vid); } } catch (e) { vid = vid || Math.random().toString(36).slice(2, 10); }
  var voteCbs = [], stateCbs = [];
  window.LiveSync = {
    isHost: isHost,
    open: function () { return isHost ? hostOn : !!(lastSeen && Date.now() - lastSeen < 15000); },
    vote: function (poll, i) { if (channel) channel.send({ type: 'broadcast', event: 'vote', payload: { c: CH, p: poll, v: vid, i: i } }); },
    onVote: function (f) { voteCbs.push(f); },
    onState: function (f) { stateCbs.push(f); }
  };
  document.dispatchEvent(new Event('livesync-ready'));
  function fireState() { stateCbs.forEach(function (f) { try { f(); } catch (e) {} }); }

  function b64(buf) { var a = new Uint8Array(buf), s = ''; for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); }
  function unb64(s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
  function msg(p) { return enc.encode([p.c, p.s, p.t, p.e].join('|')); }

  /* ---------- UI ---------- */
  var css = document.createElement('style');
  css.textContent = '#live{position:fixed;right:.8rem;bottom:4.2rem;z-index:50;display:none;align-items:center;gap:.5rem;background:#fff;border:1.5px solid var(--green,#1B7F6B);border-radius:2rem;padding:.35rem .5rem .35rem .8rem;box-shadow:0 4px 14px rgba(18,51,43,.15);font:600 .82rem "Prompt","Noto Sans Thai",system-ui,sans-serif;color:#0F5C4D}' +
    '#live.show{display:flex}#live .dot{width:.6rem;height:.6rem;border-radius:50%;background:#d33;animation:lv 1.2s infinite}@keyframes lv{50%{opacity:.25}}' +
    '#live button{font:inherit;cursor:pointer;border:0;border-radius:2rem;padding:.35rem .8rem;background:#1B7F6B;color:#fff}#live button.off{background:#fff;color:#0F5C4D;border:1.5px solid #1B7F6B}' +
    '#live.host{border-color:#7B4AA0;color:#7B4AA0}#live.host .dot{background:#7B4AA0}#live.host button{background:#7B4AA0}' +
    '#hostmodal{position:fixed;inset:0;background:rgba(18,51,43,.45);z-index:80;display:none;align-items:center;justify-content:center}#hostmodal.open{display:flex}' +
    '#hostmodal div{background:#fff;border-radius:1rem;padding:1.2rem;width:min(92vw,22rem);font-family:"Prompt","Noto Sans Thai",system-ui,sans-serif}#hostmodal input{width:100%;font:inherit;padding:.5rem;margin:.6rem 0;border:1.5px solid #DCE6E2;border-radius:.6rem}#hostmodal p{margin:0;color:#c0392b;font-size:.85rem;min-height:1.2em}';
  document.head.appendChild(css);
  var pill = document.createElement('div'); pill.id = 'live'; pill.innerHTML = '<span class="dot"></span><span class="lt"></span><button type="button"></button>';
  document.body.appendChild(pill);
  var lt = pill.querySelector('.lt'), btn = pill.querySelector('button');

  function render() {
    pill.classList.toggle('host', isHost);
    if (isHost) {
      pill.classList.add('show');
      lt.textContent = hostOn ? 'กำลังถ่ายทอดสด' : 'โหมดอาจารย์';
      btn.className = ''; btn.textContent = hostOn ? 'จบการสอน' : 'เริ่มถ่ายทอด';
      return;
    }
    var live = lastSeen && (Date.now() - lastSeen < 15000);
    pill.classList.toggle('show', !!live);
    if (!live) { follow = false; return; }
    lt.textContent = 'อาจารย์กำลังสอน';
    btn.className = follow ? '' : 'off';
    btn.textContent = follow ? 'กำลังตามอาจารย์ ✓' : 'ตามอาจารย์ (สไลด์ ' + (lastSlide + 1) + ')';
  }
  var wasOpen = null;
  function tick() { render(); var o = window.LiveSync.open(); if (o !== wasOpen) { wasOpen = o; fireState(); } }
  setInterval(tick, 2000);

  /* ---------- Realtime ---------- */
  function connect(cb) {
    function go() {
      var cl = window.supabase.createClient(C.url, C.key, { realtime: { params: { eventsPerSecond: 5 } } });
      channel = cl.channel(CH, { config: { broadcast: { self: false } } });
      if (!isHost) channel.on('broadcast', { event: 'slide' }, function (m) { onMsg(m.payload); });
      else channel.on('broadcast', { event: 'vote' }, function (m) { var q = m.payload; if (q && q.c === CH && typeof q.i === 'number') voteCbs.forEach(function (f) { try { f(q.p, q.v, q.i); } catch (e) {} }); });
      channel.subscribe(function (st) { if (st === 'SUBSCRIBED' && cb) cb(); });
    }
    if (window.supabase) return go();
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
    s.onload = go; document.head.appendChild(s);
  }

  /* ---------- Student side ---------- */
  var pubKey = null;
  function getPub() { return pubKey || (pubKey = crypto.subtle.importKey('jwk', C.pub, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify'])); }
  function onMsg(p) {
    if (!p || p.c !== CH || Math.abs(Date.now() - p.t) > 180000) return;
    getPub().then(function (k) { return crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, k, unb64(p.g), msg(p)); }).then(function (ok) {
      if (!ok) return;
      if (p.e) { lastSeen = 0; follow = false; render(); return; }
      lastSeen = Date.now(); lastSlide = p.s; if (wasOpen !== true) tick();
      if (follow && window.Deck && window.Deck.index() !== p.s) { syncing = true; window.Deck.show(p.s); syncing = false; }
      render();
    }).catch(function () {});
  }
  btn.addEventListener('click', function () {
    if (isHost) { hostOn ? stopHost() : startHost(); return; }
    follow = !follow;
    if (follow && window.Deck) { syncing = true; window.Deck.show(lastSlide); syncing = false; }
    render();
  });
  document.addEventListener('slideshow', function () {
    if (isHost) { if (hostOn) send(0); }
    else if (follow && !syncing) { follow = false; render(); }   // student navigated manually -> free browsing
  });

  /* ---------- Host side ---------- */
  function send(e) {
    if (!priv || !channel) return;
    var p = { c: CH, s: window.Deck ? window.Deck.index() : 0, t: Date.now(), e: e ? 1 : 0 };
    crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, priv, msg(p)).then(function (sig) {
      p.g = b64(sig); channel.send({ type: 'broadcast', event: 'slide', payload: p });
    });
  }
  function unlock(pass) {
    var E = C.enc;
    return crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']).then(function (km) {
      return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: unb64(E.salt), iterations: E.iter, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    }).then(function (k) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(E.iv) }, k, unb64(E.data)); })
      .then(function (raw) { return crypto.subtle.importKey('pkcs8', raw, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']); });
  }
  var modal = document.createElement('div'); modal.id = 'hostmodal';
  modal.innerHTML = '<div><b>โหมดอาจารย์</b><input type="password" placeholder="รหัสผ่านอาจารย์" autocomplete="off"><p></p><button type="button" class="btn pri">เริ่มถ่ายทอด</button> <button type="button" class="btn">ยกเลิก</button></div>';
  document.body.appendChild(modal);
  var mi = modal.querySelector('input'), mp = modal.querySelector('p'), mb = modal.querySelectorAll('button');
  function startHost() { mi.value = ''; mp.textContent = ''; modal.classList.add('open'); setTimeout(function () { mi.focus(); }, 50); }
  function go() {
    mp.textContent = 'กำลังตรวจสอบ…';
    unlock(mi.value).then(function (k) {
      priv = k; modal.classList.remove('open'); mi.value = '';
      connect(function () { hostOn = true; fireState(); send(0); hb = setInterval(function () { send(0); }, 4000); render(); });
    }).catch(function () { mp.textContent = 'รหัสผ่านไม่ถูกต้อง'; });
  }
  mb[0].onclick = go; mb[1].onclick = function () { modal.classList.remove('open'); };
  mi.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); e.stopPropagation(); });
  function stopHost() { send(1); clearInterval(hb); hostOn = false; render(); fireState(); }
  window.addEventListener('beforeunload', function () { if (hostOn) send(1); });

  if (isHost) render(); else connect();
})();
