/* =====================================================================
   DİYAGRAM MOTORU — çizgi-adam çizimleri (SVG).
   Her hareket 1 veya 2 "poz"dan oluşur (başlangıç / bitiş).
   Açılar derece: 0 = aşağı, 90 = sağ (ileri), 180 = yukarı, -90 = sol (geri).
   Poz anahtarları:
     t gövde · a,b üst kol, ön kol · l,m uyluk, kaval · f ayak · w el
     A,B / L,M = diğer kol / bacak · front=true → önden görünüm
   ===================================================================== */
(function () {
  const R = Math.PI / 180;
  const dir = a => [Math.sin(a * R), Math.cos(a * R)];
  const add = (p, a, l) => { const v = dir(a); return [p[0] + v[0] * l, p[1] + v[1] * l]; };
  const LEN = { t: 32, ua: 17, fa: 16, th: 23, sh: 23, ft: 8, hd: 6, hand: 6 };
  const f1 = n => Math.round(n * 10) / 10;
  const S = o => Object.assign({ t: 180, a: 0, b: 0, l: 0, m: 0, f: 90 }, o);

  function fig(p) {
    const fr = !!p.front, ts = p.ts || 1;
    const hw = fr ? 4 : 0, sw = fr ? 7 : 0;
    const hx = p.x == null ? 80 : p.x;
    const hip = [hx, 0];
    const sh = add(hip, p.t, LEN.t * ts);
    const head = add(sh, p.h == null ? p.t : p.h, LEN.hd + 3);
    const segs = [], P = {};
    function arm(side, a, b, w, far) {
      const o = [sh[0] + side * sw, sh[1]];
      const e = add(o, a, LEN.ua), h = add(e, b, LEN.fa);
      const he = w == null ? h : add(h, w, LEN.hand);
      segs.push([o, e, far], [e, h, far]);
      if (w != null) segs.push([h, he, far]);
      return { e, h, he };
    }
    function leg(side, l, m, f, far) {
      const o = [hip[0] + side * hw, hip[1]];
      const k = add(o, l, LEN.th), an = add(k, m, LEN.sh), to = add(an, f, LEN.ft);
      segs.push([o, k, far], [k, an, far], [an, to, far]);
      return { k, an, to };
    }
    segs.push([hip, sh, false], [sh, head, false]);
    P.N = arm(1, p.a, p.b, p.w, false);
    if (p.A != null) P.F = arm(fr ? -1 : 0, p.A, p.B, p.W, true);
    else if (fr && !p.one) P.F = arm(-1, -p.a, -p.b, p.w == null ? null : -p.w, true);
    P.n = leg(1, p.l, p.m, p.f, false);
    if (p.L != null) P.f = leg(fr ? -1 : 0, p.L, p.M, p.F2 == null ? p.f : p.F2, true);
    else if (fr) P.f = leg(-1, -p.l, -p.m, -p.f, true);
    // zemine / çubuğa göre dikey kaydırma
    let all = [hip, sh, head];
    [P.N, P.F].forEach(x => x && all.push(x.e, x.h));
    [P.n, P.f].forEach(x => x && all.push(x.k, x.an, x.to));
    const maxY = Math.max.apply(null, all.map(q => q[1]));
    let dy;
    if (p.y != null) dy = p.y;
    else if (p.hang) dy = 18 - P.N.h[1];
    else if (p.stepH) dy = 112 - p.stepH - Math.max(P.n.an[1], P.n.to[1]);
    else dy = 112 - maxY;
    dy -= (p.up || 0);
    const sh2 = q => [q[0], q[1] + dy];
    segs.forEach(s => { s[0] = sh2(s[0]); s[1] = sh2(s[1]); });
    const out = { hip: sh2(hip), sh: sh2(sh), head: sh2(head), segs, front: fr };
    ['N', 'F'].forEach(k => { if (P[k]) out[k] = { e: sh2(P[k].e), h: sh2(P[k].h), he: sh2(P[k].he) }; });
    ['n', 'f'].forEach(k => { if (P[k]) out[k] = { k: sh2(P[k].k), an: sh2(P[k].an), to: sh2(P[k].to) }; });
    return out;
  }

  const line = (a, b, cls, extra) => `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" class="${cls}" ${extra || ''}/>`;
  function arrow(x1, y1, x2, y2) {
    const a = Math.atan2(y2 - y1, x2 - x1), s = 5;
    const p1 = [x2 - s * Math.cos(a - 0.5), y2 - s * Math.sin(a - 0.5)];
    const p2 = [x2 - s * Math.cos(a + 0.5), y2 - s * Math.sin(a + 0.5)];
    return `<path d="M${x1} ${y1}L${x2} ${y2}M${f1(p1[0])} ${f1(p1[1])}L${x2} ${y2}L${f1(p2[0])} ${f1(p2[1])}" class="ar"/>`;
  }
  function circ(x, y, r) {
    return `<path d="M${x + r} ${y}A${r} ${r} 0 1 1 ${x} ${y - r}" class="ar"/><path d="M${x - 3} ${y - r - 3}L${x} ${y - r}L${x - 3} ${y - r + 3}" class="ar"/>`;
  }
  function dumbbell(h, vert) {
    return vert
      ? `<rect x="${f1(h[0] - 2.5)}" y="${f1(h[1] - 6)}" width="5" height="12" rx="1.5" class="pf"/>`
      : `<rect x="${f1(h[0] - 6)}" y="${f1(h[1] - 2.5)}" width="12" height="5" rx="1.5" class="pf"/>`;
  }

  function render(p) {
    const f = fig(p);
    let s = '<line x1="6" y1="114" x2="154" y2="114" class="fl"/>';
    // sahne araçları (arka planda)
    (p.props || []).forEach(pr => {
      const k = Array.isArray(pr) ? pr[0] : pr;
      if (k === 'bar') s += `<line x1="${f.N.h[0] - 28}" y1="${f.N.h[1]}" x2="${f.N.h[0] + 28}" y2="${f.N.h[1]}" class="pl"/>`;
      if (k === 'seat') s += line([f.hip[0] - 12, f.hip[1] + 4], [f.hip[0] + 8, f.hip[1] + 4], 'pl') + line([f.hip[0] + 6, f.hip[1] + 4], [f.hip[0] + 6, 113], 'pl');
      if (k === 'incb') {
        const dx = f.sh[0] - f.hip[0], dy = f.sh[1] - f.hip[1], L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L;
        s += line([f.hip[0] + nx * 5 + dx * -0.05, f.hip[1] + ny * 5 - dy * 0.05], [f.sh[0] + nx * 5 + dx * 0.15, f.sh[1] + ny * 5 + dy * 0.15], 'pl');
        s += line([f.hip[0] - 3, f.hip[1] + 5], [f.hip[0] + 16, f.hip[1] + 5], 'pl') + line([f.hip[0] + 12, f.hip[1] + 5], [f.hip[0] + 12, 113], 'pl');
      }
      if (k === 'benchH') s += line([f.F.h[0] - 16, f.F.h[1] + 3], [f.F.h[0] + 16, f.F.h[1] + 3], 'pl') + line([f.F.h[0] - 12, f.F.h[1] + 3], [f.F.h[0] - 12, 113], 'pl') + line([f.F.h[0] + 12, f.F.h[1] + 3], [f.F.h[0] + 12, 113], 'pl');
      if (k === 'bench') s += line([pr[1], pr[2]], [pr[3], pr[4]], 'pl');
      if (k === 'step') s += `<rect x="${f1(f.n.an[0] - 12)}" y="${f1(f.n.an[1] + 3)}" width="24" height="${f1(Math.max(2, 112 - f.n.an[1] - 3))}" class="pf2"/>`;
      if (k === 'stepB') s += `<rect x="${f1(f.n.an[0] - 14)}" y="${f1(f.n.an[1] + 3)}" width="${pr[1] || 30}" height="${f1(Math.max(2, 112 - f.n.an[1] - 3))}" class="pf2"/>`;
      if (k === 'box') s += `<rect x="${pr[1]}" y="${pr[2]}" width="${pr[3] - pr[1]}" height="${pr[4] - pr[2]}" class="pf2"/>`;
      if (k === 'wallH') s += line([f.N.h[0] + 5, 6], [f.N.h[0] + 5, 113], 'pl');
      if (k === 'wallX') s += line([pr[1], 6], [pr[1], 113], 'pl');
      if (k === 'frame') s += line([f.N.h[0], 8], [f.N.h[0], 113], 'pl') + line([f.F.h[0], 8], [f.F.h[0], 113], 'pl');
      if (k === 'rope') s += `<ellipse cx="${f.hip[0]}" cy="${f1(f.hip[1] - 14)}" rx="27" ry="${f1((112 - f.hip[1]) / 2 + 40)}" class="ar" stroke-dasharray="3 3"/>`;
    });
    // figür
    f.segs.forEach(g => { s += line(g[0], g[1], g[2] ? 'sf' : 'sn'); });
    s += `<circle cx="${f1(f.head[0])}" cy="${f1(f.head[1])}" r="6" class="hd"/>`;
    // el aletleri / bantlar (önde)
    (p.props || []).forEach(pr => {
      const k = Array.isArray(pr) ? pr[0] : pr;
      const hN = f.N.he, hF = f.F && f.F.he;
      if (k === 'db') s += dumbbell(hN);
      if (k === 'dbv') s += dumbbell(hN, true);
      if (k === 'dbF') s += dumbbell(hF);
      if (k === 'db2') { s += dumbbell(hN); if (hF) s += dumbbell(hF); }
      if (k === 'db2v') { s += dumbbell(hN, true); if (hF) s += dumbbell(hF, true); }
      if (k === 'band') { const y = pr[2] == null ? hN[1] : pr[2]; s += line(hN, [pr[1], y], 'bd') + `<circle cx="${pr[1]}" cy="${f1(y)}" r="2.6" class="pf"/>`; }
      if (k === 'bandUp') { const y = pr[1]; s += line(hN, [hN[0], y], 'bd') + `<circle cx="${f1(hN[0])}" cy="${y}" r="2.6" class="pf"/>`; }
      if (k === 'bandHH' && hF) s += line(hN, hF, 'bd');
      if (k === 'bandFoot') s += line(hN, f.n.to, 'bd');
    });
    (p.props || []).forEach(pr => {
      if (!Array.isArray(pr)) return;
      if (pr[0] === 'arrow') s += arrow(pr[1], pr[2], pr[3], pr[4]);
      if (pr[0] === 'circ') s += circ(pr[1], pr[2], pr[3]);
    });
    return `<svg viewBox="0 0 160 120" role="img" aria-hidden="true">${s}</svg>`;
  }

  window.Diyagram = { render, S };
})();
