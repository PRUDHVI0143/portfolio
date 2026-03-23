/**
 * MILKY WAY ULTRA — Galaxy Background Effect
 *
 * Features:
 *  - 4 spiral arms with realistic star distribution
 *  - Colourful nebula clouds (pink, teal, purple, orange)
 *  - Purple/blue dust lanes
 *  - Blazing galactic core with lens-flare spike cross & rays
 *  - Shooting stars that streak across the background
 *  - Mouse parallax glow
 *  - Differential rotation (core spins faster than halo)
 *  - Twinkling stars with per-star colour (blue giants, red dwarfs, white)
 *
 * Usage:
 *   <canvas id="milkyway" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;"></canvas>
 *   <script src="milkyway.js"></script>
 */

(function () {

  /* ── CONFIG ─────────────────────────────── */
  const CONFIG = {
    starCount  : 4500,    // Optimized for buttery smooth scrolling
    rotSpeed   : 0.00025, // rotation per frame
    tiltDeg    : 58,      // 5=edge-on → 88=top-down
    zoom       : 1.0,     // 0.5–1.6
    bgColor    : '#020208',
    shooters   : true,    // shooting stars on/off
  };
  /* ─────────────────────────────────────── */

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function gauss() {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  const STAR_COLORS = [
    [255,255,255],[210,225,255],[255,245,210],[170,200,255],
    [255,220,170],[255,190,130],[130,175,255],[255,255,225],
    [255,150,100],[100,200,255],
  ];

  function spiralXY(arm, t, spread, sz) {
    const base = (arm / 4) * Math.PI * 2;
    const a = base + t * 3.2 + rnd(-spread, spread);
    const r = t * sz * 0.46 + rnd(-20, 20) * spread * 2;
    return { r, a };
  }

  function buildGalaxy(W, H) {
    const sz  = Math.min(W, H) * CONFIG.zoom;
    const N   = CONFIG.starCount;
    const stars = [], dust = [], nebula = [];

    const nCore = Math.floor(N * 0.25);
    const nArm  = Math.floor(N * 0.60);
    const nHalo = N - nCore - nArm;

    for (let i = 0; i < nCore; i++) {
      const r = Math.abs(gauss()) * sz * 0.11;
      const a = Math.random() * Math.PI * 2;
      const b = rnd(0.55, 1);
      const hot = Math.random() < 0.3;
      const c = hot ? [255,200,120] : STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      stars.push({ r, ba: a, sz: rnd(0.4, hot ? 2.8 : 2) * b, b, col: c, type: 'core', tw: Math.random() * Math.PI * 2, ts: 0.025 + Math.random() * 0.03 });
    }

    for (let i = 0; i < nArm; i++) {
      const arm = i % 4;
      const t   = Math.pow(Math.random(), 0.65);
      const { r, a } = spiralXY(arm, t, 0.15 + t * 0.38, sz);
      const b   = rnd(0.25, 1) * (1 - t * 0.45);
      const isBlue = Math.random() < 0.2, isRed = Math.random() < 0.12;
      const col = isBlue ? [100,160,255] : isRed ? [255,120,80] : STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      stars.push({ r, ba: a, sz: rnd(0.25, 1.8) * b, b, col, type: 'arm', t, tw: Math.random() * Math.PI * 2, ts: 0.015 + Math.random() * 0.02 });
    }

    for (let i = 0; i < nHalo; i++) {
      const r = rnd(sz * 0.08, sz * 0.54);
      const a = Math.random() * Math.PI * 2;
      const b = rnd(0.08, 0.38);
      stars.push({ r, ba: a, sz: rnd(0.15, 0.85), b, col: [200,215,255], type: 'halo', tw: Math.random() * Math.PI * 2, ts: 0.008 + Math.random() * 0.012 });
    }

    for (let i = 0; i < 180; i++) {
      const arm = i % 4;
      const t   = rnd(0.05, 0.95);
      const { r, a } = spiralXY(arm, t, 0.22 + t * 0.42, sz);
      const warm = Math.random() < 0.35;
      dust.push({ r, a, sz: rnd(20, 60) * (1 - t * 0.28), op: rnd(0.04, 0.14), col: warm ? [160,100,220] : [70,55,170] });
    }

    const NEBULA_PALS = [[255,80,120],[80,200,255],[160,80,255],[255,160,60],[60,255,180],[255,60,200]];
    for (let i = 0; i < 28; i++) {
      const arm = i % 4;
      const t   = rnd(0.1, 0.88);
      const { r, a } = spiralXY(arm, t, 0.3, sz);
      const col = NEBULA_PALS[Math.floor(Math.random() * NEBULA_PALS.length)];
      nebula.push({ r, a, sz: rnd(30, 90), op: rnd(0.04, 0.10), col });
    }

    return { stars, dust, nebula };
  }

  window.initMilkyWay = function (canvasId) {
    canvasId = canvasId || 'milkyway';
    const canvas = document.getElementById(canvasId);
    if (!canvas) return console.warn('MilkyWay: canvas #' + canvasId + ' not found');
    const ctx = canvas.getContext('2d');

    let W, H, dpr, angle = 0;
    let stars = [], dust = [], nebula = [], bgStars = [], shooters = [];
    let mouseX = -9999, mouseY = -9999;
    let lastShooter = 0;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      W   = canvas.clientWidth;
      H   = canvas.clientHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = buildGalaxy(W, H);
      stars  = g.stars;
      dust   = g.dust;
      nebula = g.nebula;
      bgStars = Array.from({ length: 350 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: rnd(0.12, 0.9), a: rnd(0.15, 0.85),
        t: Math.random() * Math.PI * 2, ts: 0.003 + Math.random() * 0.009,
      }));
    }

    function project(r, a) {
      const tr = CONFIG.tiltDeg * Math.PI / 180;
      const x3 = r * Math.cos(a);
      const y3 = r * Math.sin(a) * Math.sin(tr);
      const z3 = r * Math.sin(a) * Math.cos(tr);
      return { px: W / 2 + x3, py: H / 2 + y3, dz: z3 };
    }

    function spawnShooter() {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      const spd = rnd(3, 7);
      const off = rnd(-0.3, 0.3);
      if (side === 0)      { x = rnd(0,W); y = -10;   vx = Math.sin(off)*spd; vy =  spd; }
      else if (side === 1) { x = W + 10;   y = rnd(0,H); vx = -spd;            vy = rnd(-1,1); }
      else if (side === 2) { x = rnd(0,W); y = H + 10; vx = Math.sin(off)*spd; vy = -spd; }
      else                 { x = -10;      y = rnd(0,H); vx =  spd;            vy = rnd(-1,1); }
      shooters.push({ x, y, vx, vy, len: rnd(60, 130), life: 1 });
    }

    function frame(ts) {
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.75);
      bg.addColorStop(0, '#0a0820'); bg.addColorStop(0.5, '#060510'); bg.addColorStop(1, CONFIG.bgColor);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      for (const s of bgStars) {
        const b = 0.3 + 0.7 * Math.abs(Math.sin(s.t));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${b * s.a})`; ctx.fill();
        s.t += s.ts;
      }

      if (CONFIG.shooters) {
        if (ts - lastShooter > rnd(1800, 4000)) { spawnShooter(); lastShooter = ts; }
        for (let i = shooters.length - 1; i >= 0; i--) {
          const sh = shooters[i];
          sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.018;
          if (sh.life <= 0 || sh.x < -200 || sh.x > W+200 || sh.y < -200 || sh.y > H+200) { shooters.splice(i, 1); continue; }
          const mag = Math.sqrt(sh.vx*sh.vx + sh.vy*sh.vy);
          const tx  = sh.x - (sh.vx/mag) * sh.len;
          const ty  = sh.y - (sh.vy/mag) * sh.len;
          const g2  = ctx.createLinearGradient(tx, ty, sh.x, sh.y);
          g2.addColorStop(0, 'rgba(255,255,255,0)');
          g2.addColorStop(0.7, `rgba(200,220,255,${sh.life*0.5})`);
          g2.addColorStop(1, `rgba(255,255,255,${sh.life*0.9})`);
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sh.x, sh.y);
          ctx.strokeStyle = g2; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(sh.x, sh.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${sh.life})`; ctx.fill();
        }
      }

      angle += CONFIG.rotSpeed;
      const tr = CONFIG.tiltDeg * Math.PI / 180;

      for (const n of nebula) {
        const a = n.a + angle * 0.75;
        const { px, py } = project(n.r, a);
        const scY = Math.abs(Math.sin(tr));
        const rx = n.sz, ry = n.sz * scY * 0.65 + 3;
        const [r2,g2,b2] = n.col;
        const ng = ctx.createRadialGradient(px, py, 0, px, py, rx);
        ng.addColorStop(0, `rgba(${r2},${g2},${b2},${n.op*1.4})`);
        ng.addColorStop(0.5, `rgba(${r2},${g2},${b2},${n.op*0.6})`);
        ng.addColorStop(1, `rgba(${r2},${g2},${b2},0)`);
        ctx.save(); ctx.translate(px,py); ctx.scale(1, ry/rx); ctx.translate(-px,-py);
        ctx.beginPath(); ctx.arc(px, py, rx, 0, Math.PI*2); ctx.fillStyle = ng; ctx.fill();
        ctx.restore();
      }

      for (const d of dust) {
        const a = d.a + angle * 0.82;
        const { px, py } = project(d.r, a);
        const scY = Math.abs(Math.sin(tr));
        const rx = d.sz, ry = d.sz * scY * 0.6 + 2;
        const [r2,g2,b2] = d.col;
        const dg = ctx.createRadialGradient(px, py, 0, px, py, rx);
        dg.addColorStop(0, `rgba(${r2},${g2},${b2},${d.op})`); dg.addColorStop(1, `rgba(${r2},${g2},${b2},0)`);
        ctx.save(); ctx.translate(px,py); ctx.scale(1, ry/rx); ctx.translate(-px,-py);
        ctx.beginPath(); ctx.arc(px, py, rx, 0, Math.PI*2); ctx.fillStyle = dg; ctx.fill();
        ctx.restore();
      }

      const s = Math.min(W, H);
      const cg = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,s*0.22);
      cg.addColorStop(0,'rgba(255,240,170,0.5)'); cg.addColorStop(0.3,'rgba(255,200,100,0.2)');
      cg.addColorStop(0.6,'rgba(180,120,255,0.08)'); cg.addColorStop(1,'rgba(80,60,180,0)');
      ctx.beginPath(); ctx.arc(W/2,H/2,s*0.22,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill();

      ctx.save(); ctx.translate(W/2, H/2);
      for (let i = 0; i < 8; i++) {
        const ra = i * (Math.PI/4) + angle * 2;
        const len = s * rnd(0.08, 0.18);
        const rg = ctx.createLinearGradient(0,0,Math.cos(ra)*len,Math.sin(ra)*len);
        rg.addColorStop(0,'rgba(255,240,180,0.18)'); rg.addColorStop(1,'rgba(255,220,100,0)');
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(ra)*len,Math.sin(ra)*len);
        ctx.strokeStyle=rg; ctx.lineWidth=2+Math.sin(angle*3+i); ctx.stroke();
      }
      ctx.restore();

      const proj = stars.map(st => {
        const a = st.ba + angle * (st.type==='core' ? 1.0 : st.type==='arm' ? 0.82 : 0.55);
        const { px, py, dz } = project(st.r, a);
        st.tw += st.ts;
        return { ...st, px, py, dz, tf: 0.7 + 0.3*Math.sin(st.tw) };
      });
      proj.sort((a, b) => a.dz - b.dz);

      for (const st of proj) {
        const [r2,g2,b2] = st.col;
        const alpha = st.b * st.tf;
        const sz = st.sz * (st.type==='core' ? 1.3 : 1);
        if (sz > 0.8 && alpha > 0.35) {
          const gl = ctx.createRadialGradient(st.px,st.py,0,st.px,st.py,sz*3.5);
          gl.addColorStop(0,`rgba(${r2},${g2},${b2},${alpha*0.4})`); gl.addColorStop(1,`rgba(${r2},${g2},${b2},0)`);
          ctx.beginPath(); ctx.arc(st.px,st.py,sz*3.5,0,Math.PI*2); ctx.fillStyle=gl; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(st.px,st.py,Math.max(0.18,sz),0,Math.PI*2);
        ctx.fillStyle=`rgba(${r2},${g2},${b2},${Math.min(1,alpha)})`; ctx.fill();
      }

      if (mouseX > 0 && mouseX < W) {
        const mg = ctx.createRadialGradient(mouseX,mouseY,0,mouseX,mouseY,80);
        mg.addColorStop(0,'rgba(160,120,255,0.12)'); mg.addColorStop(1,'rgba(100,80,200,0)');
        ctx.beginPath(); ctx.arc(mouseX,mouseY,80,0,Math.PI*2); ctx.fillStyle=mg; ctx.fill();
      }

      const cc = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,s*0.042);
      cc.addColorStop(0,'rgba(255,255,240,1)'); cc.addColorStop(0.3,'rgba(255,235,160,0.85)');
      cc.addColorStop(0.7,'rgba(255,200,80,0.4)'); cc.addColorStop(1,'rgba(255,160,60,0)');
      ctx.beginPath(); ctx.arc(W/2,H/2,s*0.042,0,Math.PI*2); ctx.fillStyle=cc; ctx.fill();

      ctx.save(); ctx.translate(W/2,H/2);
      for (let i = 0; i < 4; i++) {
        const ra = i * Math.PI * 0.5;
        const len = s * 0.055;
        const sg = ctx.createLinearGradient(0,0,Math.cos(ra)*len,Math.sin(ra)*len);
        sg.addColorStop(0,'rgba(255,255,220,0.7)'); sg.addColorStop(1,'rgba(255,200,80,0)');
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(ra)*len,Math.sin(ra)*len);
        ctx.strokeStyle=sg; ctx.lineWidth=1.5; ctx.stroke();
      }
      ctx.restore();

      requestAnimationFrame(frame);
    }

    canvas.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouseX = e.clientX-r.left; mouseY = e.clientY-r.top; });
    canvas.addEventListener('mouseleave', () => { mouseX=-9999; mouseY=-9999; });
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
  };

  document.addEventListener('DOMContentLoaded', () => initMilkyWay('milkyway'));

})();
