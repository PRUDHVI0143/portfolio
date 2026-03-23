/**
 * Google Space-style Gravity Effect
 * Drops all elements on the page with physics (bounce, friction, rotation)
 * Usage: call triggerGravity() to activate, resetGravity() to restore
 */

(function () {
  const GRAVITY   = 0.3;   // Standard gravity
  const BOUNCE    = 0.6;   // Moderate bounce
  const FRICTION  = 0.98;  // Air resistance
  const FLOOR_PAD = 2;     // px gap from bottom

  let particles = [];
  let rafId     = null;
  let active    = false;
  let draggedParticle = null;
  let lastMouseX = 0;
  let lastMouseY = 0;

  function collectElements() {
    const section = document.getElementById('certifications');
    if (!section) return [];
    return [...section.querySelectorAll('.cert-card')].filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 4 && rect.height > 4;
    });
  }

  function makeParticle(el) {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const section = document.getElementById('certifications');
    const sectRect = section.getBoundingClientRect();

    // Clone element and position it absolutely relative to the section
    const clone = el.cloneNode(true);
    Object.assign(clone.style, {
      position:      'absolute',
      left:          (rect.left - sectRect.left) + 'px',
      top:           (rect.top - sectRect.top)  + 'px',
      width:         rect.width  + 'px',
      height:        rect.height + 'px',
      margin:        '0',
      padding:       style.padding,
      fontSize:      style.fontSize,
      lineHeight:    style.lineHeight,
      color:         style.color,
      background:    style.background,
      backgroundColor: style.backgroundColor,
      border:        style.border,
      borderRadius:  style.borderRadius,
      boxShadow:     style.boxShadow,
      display:       'flex',
      alignItems:    'center',
      justifyContent:'center',
      pointerEvents: 'auto', // Changed to allow dragging
      cursor:        'grab',
      zIndex:        '99999',
      boxSizing:     'border-box',
      willChange:    'transform',
      transition:    'none',
      animation:     'none',
    });

    section.appendChild(clone);
    el.style.visibility = 'hidden'; // hide original

    // Define floor relative to section height. Force min height if needed.
    const floorY = Math.max(sectRect.height, 800) - rect.height - FLOOR_PAD;

    const p = {
      el: clone,
      original: el,
      x: rect.left - sectRect.left,
      y: rect.top - sectRect.top,
      w: rect.width,
      h: rect.height,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 5,
      floorY,
      angle:  0,
      vAngle: 0, // NO ROTATION
      settled: false,
    };

    clone.addEventListener('mousedown', (e) => {
        draggedParticle = p;
        clone.style.cursor = 'grabbing';
        e.preventDefault();
        e.stopPropagation();
    });

    return p;
  }

  function step() {
    let allSettled = true;
    const section = document.getElementById('certifications');
    const sectRect = section.getBoundingClientRect();
    const secW = sectRect.width;

    for (const p of particles) {
      if (p === draggedParticle) continue;
      
      if (!p.settled) allSettled = false;

      p.vy += GRAVITY;
      p.vx *= FRICTION;
      p.x  += p.vx;
      p.y  += p.vy;
      p.angle += p.vAngle;

      // Wall/Ceiling collisions
      if (p.x < 0)               { p.x = 0;           p.vx =  Math.abs(p.vx) * BOUNCE; p.settled = false; }
      if (p.x > secW - p.w) { p.x = secW - p.w; p.vx = -Math.abs(p.vx) * BOUNCE; p.settled = false; }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy) * BOUNCE; p.settled = false; } // Add ceiling bounce for zero-G

      // Floor collision
      if (p.y >= p.floorY) {
        p.y  = p.floorY;
        p.vy = -Math.abs(p.vy) * BOUNCE;
        p.vx *= 0.88;
        p.vAngle = 0; // disabled

        if (Math.abs(p.vy) < 0.9 && Math.abs(p.vx) < 0.4) {
          p.vy = 0; p.vx = 0; p.vAngle = 0; p.settled = true;
        } else {
          p.settled = false;
        }
      }

      p.el.style.transform = `translate(${p.x - parseFloat(p.el.style.left)}px, ${p.y - parseFloat(p.el.style.top)}px) rotate(${p.angle}deg)`;
    }

    if (draggedParticle) allSettled = false;
    rafId = allSettled ? null : requestAnimationFrame(step);
  }
  
  window.addEventListener('mousemove', (e) => {
      if (draggedParticle) {
          const section = document.getElementById('certifications');
          const sectRect = section.getBoundingClientRect();
          
          draggedParticle.x = e.clientX - sectRect.left - draggedParticle.w / 2;
          draggedParticle.y = e.clientY - sectRect.top - draggedParticle.h / 2;
          draggedParticle.vx = e.clientX - lastMouseX;
          draggedParticle.vy = e.clientY - lastMouseY;
          draggedParticle.vAngle = 0; // disabled
          draggedParticle.settled = false;
          draggedParticle.el.style.transform = `translate(${draggedParticle.x - parseFloat(draggedParticle.el.style.left)}px, ${draggedParticle.y - parseFloat(draggedParticle.el.style.top)}px) rotate(0deg)`;
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
      if (draggedParticle) {
          draggedParticle.el.style.cursor = 'grab';
          draggedParticle = null;
          if (!rafId) rafId = requestAnimationFrame(step);
      }
  });

  /** Drop all page elements */
  window.triggerGravity = function () {
    if (active) return;
    active = true;
    window.isGravityOn = true;

    const els = collectElements();
    particles = els.map(makeParticle);
    rafId = requestAnimationFrame(step);
  };

  /** Restore the page to its original state */
  window.resetGravity = function () {
    if (rafId) cancelAnimationFrame(rafId);
    draggedParticle = null;
    for (const p of particles) {
      p.el.remove();
      p.original.style.visibility = '';
    }
    particles = [];
    active    = false;
    window.isGravityOn = false;
    rafId     = null;
  };

})();
