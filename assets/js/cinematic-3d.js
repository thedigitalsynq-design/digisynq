/**
 * DIGISYNQ CINEMATIC 3D ENGINE
 * Advanced physical 3D object rendering, 360° 36-frame orbit, interactive exploded-view assembly,
 * magnetic cursor inertia, and 10-Node gravitational physics matrix.
 */

class Cinematic3DEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      totalFrames: 36,
      frameIntervalDeg: 10,
      autoRotate: true,
      autoRotateSpeed: 0.12,
      friction: 0.94,
      sensitivity: 0.55,
      springStrength: 0.08,
      dampening: 0.88,
      accentColor: '#ffffff',
      violetColor: '#8a4fff',
      cyanColor: '#38bdf8',
      emeraldColor: '#10b981',
      hotspots: [
        { angle: 25, title: 'SYNQ OS 2.6 Lens', desc: 'Liquid optic refraction with zero latency', tag: 'Optics' },
        { angle: 115, title: 'Milestone Escrow Vault', desc: '₹45.0L automated multi-sig lock', tag: 'Security' },
        { angle: 205, title: '10-Node Laser Waveguide', desc: 'Real-time studio & talent sync', tag: 'Network' },
        { angle: 295, title: 'Narrative Radar Shield', desc: 'Pre-release box office sentiment telemetry', tag: 'Radar' }
      ]
    }, options);

    // State Variables
    this.currentAngle = 25;
    this.angularVelocity = 0;
    this.isDragging = false;
    this.startX = 0;
    this.lastX = 0;
    this.lastTime = performance.now();
    this.isHovered = false;

    // Exploded View State (0 = Assembled, 1 = Fully Exploded)
    this.explodeProgress = 0;
    this.targetExplodeProgress = 0;
    this.isExploded = false;

    // Magnetic Cursor 3D Tilt (Spring Physics)
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0 };

    // Mode: 'assembled' | 'exploded' | 'orbit' | 'escrow'
    this.mode = 'assembled';

    this.init();
  }

  init() {
    this.container.innerHTML = '';
    this.container.classList.add('cinematic-3d-stage');

    // Create Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'cinematic-3d-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    this.container.appendChild(this.canvas);

    // Create Cinematic HUD & Mode Selector Controls
    this.createCinematicHUD();

    // Bind Interaction Events
    this.bindEvents();

    // IntersectionObserver Performance Optimization: Only render when visible
    this.isVisible = true;
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const wasVisible = this.isVisible;
          this.isVisible = entry.isIntersecting;
          if (!wasVisible && this.isVisible) {
            requestAnimationFrame(this.animate);
          }
        });
      }, { threshold: 0.02 });
      this.observer.observe(this.container);
    }

    // Start 60 FPS Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.container.getBoundingClientRect();
    const w = rect.width || 440;
    const h = rect.height || 480;

    this.width = w;
    this.height = h;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.scale(dpr, dpr);
  }

  createCinematicHUD() {
    const hud = document.createElement('div');
    hud.className = 'cinematic-3d-hud';

    hud.innerHTML = `
      <!-- Top Telemetry Dial -->
      <div class="c3d-top-row">
        <div class="c3d-telemetry-badge">
          <span class="c3d-status-dot"></span>
          <span class="c3d-system-label">SYNQ CORE 3D</span>
          <span class="c3d-deg-readout" id="c3d-deg">25° (F3/36)</span>
        </div>

        <div class="c3d-mode-toggles">
          <button type="button" class="c3d-mode-btn active" data-c3d-mode="assembled">Assembled</button>
          <button type="button" class="c3d-mode-btn" data-c3d-mode="exploded">Exploded</button>
          <button type="button" class="c3d-mode-btn" data-c3d-mode="orbit">Auto-Orbit</button>
        </div>
      </div>

      <!-- Center Interaction Prompt -->
      <div class="c3d-drag-prompt">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        <span>Drag 360° &bull; Magnetic Cursor Active</span>
      </div>

      <!-- Bottom Hotspot & Layer Intelligence -->
      <div class="c3d-bottom-row">
        <div class="c3d-layer-indicator" id="c3d-layer-tag">
          <span class="c3d-layer-count">LAYER 01/04</span>
          <span class="c3d-layer-name">Liquid Frosted Optics</span>
        </div>

        <div class="c3d-hotspot-card" id="c3d-hotspot">
          <div class="c3d-hs-meta">
            <span class="c3d-hs-tag">Optics</span>
            <span class="c3d-hs-pulse"></span>
          </div>
          <div class="c3d-hs-title">SYNQ OS 2.6 Lens</div>
          <div class="c3d-hs-desc">Liquid optic refraction with zero latency</div>
        </div>
      </div>
    `;

    this.container.appendChild(hud);

    this.degDisplay = hud.querySelector('#c3d-deg');
    this.layerTag = hud.querySelector('#c3d-layer-tag');
    this.hotspotCard = hud.querySelector('#c3d-hotspot');

    // Mode Toggle Clicks
    hud.querySelectorAll('.c3d-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        hud.querySelectorAll('.c3d-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setMode(btn.getAttribute('data-c3d-mode'));
      });
    });
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === 'exploded') {
      this.targetExplodeProgress = 1;
      this.options.autoRotate = false;
    } else if (mode === 'assembled') {
      this.targetExplodeProgress = 0;
      this.options.autoRotate = false;
    } else if (mode === 'orbit') {
      this.targetExplodeProgress = 0;
      this.options.autoRotate = true;
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    // Mouse Dragging
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
      this.lastX = e.clientX;
      this.lastTime = performance.now();
      this.angularVelocity = 0;
      this.container.classList.add('is-interacting');
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      // Calculate normalized cursor position (-1 to 1) for magnetic tilt
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (normX >= -1.2 && normX <= 1.2 && normY >= -1.2 && normY <= 1.2) {
        this.mouse.targetX = normX;
        this.mouse.targetY = normY;
      } else {
        this.mouse.targetX = 0;
        this.mouse.targetY = 0;
      }

      if (!this.isDragging) return;
      const deltaX = e.clientX - this.lastX;
      const now = performance.now();
      const dt = Math.max(now - this.lastTime, 1);

      this.currentAngle = (this.currentAngle + deltaX * this.options.sensitivity) % 360;
      if (this.currentAngle < 0) this.currentAngle += 360;

      this.angularVelocity = (deltaX / dt) * 7.5;
      this.lastX = e.clientX;
      this.lastTime = now;
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.container.classList.remove('is-interacting');
      }
    });

    // Touch Dragging
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.lastX = e.touches[0].clientX;
        this.lastTime = performance.now();
        this.angularVelocity = 0;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.lastX;
      const now = performance.now();
      const dt = Math.max(now - this.lastTime, 1);

      this.currentAngle = (this.currentAngle + deltaX * this.options.sensitivity) % 360;
      if (this.currentAngle < 0) this.currentAngle += 360;

      this.angularVelocity = (deltaX / dt) * 7.5;
      this.lastX = e.touches[0].clientX;
      this.lastTime = now;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    this.container.addEventListener('mouseenter', () => this.isHovered = true);
    this.container.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    });

    // Scroll as Camera Depth & Angle Driver
    window.addEventListener('scroll', () => {
      const rect = this.container.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.top < windowH && rect.bottom > 0) {
        const scrollFactor = (windowH - rect.top) / (windowH + rect.height);
        if (!this.isDragging && !this.isHovered && this.mode === 'assembled') {
          this.currentAngle = (25 + scrollFactor * 90) % 360;
        }
      }
    }, { passive: true });
  }

  updatePhysics() {
    // 1. Rotation Inertia & Auto-Orbit
    if (!this.isDragging) {
      if (Math.abs(this.angularVelocity) > 0.04) {
        this.currentAngle = (this.currentAngle + this.angularVelocity) % 360;
        if (this.currentAngle < 0) this.currentAngle += 360;
        this.angularVelocity *= this.options.friction;
      } else if (this.options.autoRotate && !this.isHovered) {
        this.currentAngle = (this.currentAngle + this.options.autoRotateSpeed) % 360;
      }
    }

    // Current 36-frame readout
    this.currentFrame = Math.floor((this.currentAngle % 360) / this.options.frameIntervalDeg);
    if (this.degDisplay) {
      this.degDisplay.textContent = `${Math.round(this.currentAngle)}° (F${this.currentFrame + 1}/36)`;
    }

    // 2. Exploded-View Smooth Interpolation
    const explodeDelta = this.targetExplodeProgress - this.explodeProgress;
    this.explodeProgress += explodeDelta * 0.1;

    // 3. Magnetic Cursor Spring Physics
    const dx = this.mouse.targetX - this.mouse.x;
    const dy = this.mouse.targetY - this.mouse.y;
    this.mouse.vx += dx * this.options.springStrength;
    this.mouse.vy += dy * this.options.springStrength;
    this.mouse.vx *= this.options.dampening;
    this.mouse.vy *= this.options.dampening;
    this.mouse.x += this.mouse.vx;
    this.mouse.y += this.mouse.vy;

    // 4. Update Hotspots & Layer Meta
    this.updateHUDMeta();
  }

  updateHUDMeta() {
    // Active Hotspot based on angular position
    const angle = this.currentAngle;
    let closest = this.options.hotspots[0];
    let minDiff = 360;

    this.options.hotspots.forEach(hs => {
      let diff = Math.abs(angle - hs.angle);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closest = hs;
      }
    });

    if (this.hotspotCard) {
      this.hotspotCard.querySelector('.c3d-hs-tag').textContent = closest.tag;
      this.hotspotCard.querySelector('.c3d-hs-title').textContent = closest.title;
      this.hotspotCard.querySelector('.c3d-hs-desc').textContent = closest.desc;
    }

    if (this.layerTag) {
      if (this.explodeProgress > 0.65) {
        this.layerTag.querySelector('.c3d-layer-count').textContent = 'EXPLODED VIEW';
        this.layerTag.querySelector('.c3d-layer-name').textContent = '4 Physical Layers Decomposed';
      } else {
        this.layerTag.querySelector('.c3d-layer-count').textContent = 'LAYER 01/04';
        this.layerTag.querySelector('.c3d-layer-name').textContent = 'Liquid Frosted Optics';
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2 + 10;
    const rad = (this.currentAngle * Math.PI) / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    ctx.clearRect(0, 0, w, h);

    // 1. Ambient Volumetric Studio Caustic Light
    const studioGlow = ctx.createRadialGradient(cx + this.mouse.x * 40, cy - 20 + this.mouse.y * 30, 20, cx, cy, Math.min(w, h) * 0.75);
    studioGlow.addColorStop(0, 'rgba(255, 94, 54, 0.32)');
    studioGlow.addColorStop(0.4, 'rgba(138, 79, 255, 0.22)');
    studioGlow.addColorStop(0.8, 'rgba(56, 189, 248, 0.08)');
    studioGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = studioGlow;
    ctx.fillRect(0, 0, w, h);

    // 2. Physical 3D Ground Projection & Depth Shadow
    ctx.save();
    ctx.translate(cx + this.mouse.x * 20, cy + 140);
    ctx.scale(1 + this.explodeProgress * 0.15, 0.34);

    ctx.beginPath();
    ctx.arc(0, 0, 160, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fill();

    // Concentric laser radar rings
    for (let r = 40; r <= 150; r += 28) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.14 - r * 0.0007})`;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 6]);
      ctx.stroke();
    }
    ctx.restore();

    // 3. 3D Object Core Matrix Transform
    ctx.save();
    ctx.translate(cx, cy);

    // Apply Magnetic Proximity Tilt
    const tiltX = this.mouse.x * 14;
    const tiltY = this.mouse.y * 12;
    ctx.translate(tiltX, tiltY);

    // Dimensions
    const phoneW = 160;
    const phoneH = 260;
    const cornerR = 28;
    const baseDepth = 22;
    const effW = phoneW * (0.84 + 0.16 * Math.abs(cos));
    const depthOffsetX = cos * baseDepth * 0.75;
    const depthOffsetY = -sin * baseDepth * 0.25;

    // Calculate Exploded View Layer Offsets
    const expZ = this.explodeProgress * 55; // Vertical / spatial separation
    const expX = this.explodeProgress * sin * 45;

    // -------------------------------------------------------------
    // LAYER 4: Solid Machined Obsidian Chassis (Back Base Layer)
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(-expX * 0.9, expZ * 0.9);
    ctx.beginPath();
    this.roundRect(ctx, -effW / 2 + depthOffsetX, -phoneH / 2 + depthOffsetY, effW, phoneH, cornerR);
    const chassisGrad = ctx.createLinearGradient(-effW / 2, -phoneH / 2, effW / 2, phoneH / 2);
    chassisGrad.addColorStop(0, 'rgba(15, 23, 42, 0.92)');
    chassisGrad.addColorStop(0.5, 'rgba(9, 9, 11, 0.95)');
    chassisGrad.addColorStop(1, 'rgba(24, 24, 27, 0.98)');
    ctx.fillStyle = chassisGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    if (this.explodeProgress > 0.3) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = 'bold 7.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LAYER 04: MACHINED CHASSIS', 0, phoneH / 2 + depthOffsetY - 12);
    }
    ctx.restore();

    // -------------------------------------------------------------
    // LAYER 3: Milestone Escrow Security Vault (Multi-sig Logic Core)
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(-expX * 0.3, expZ * 0.3);
    ctx.beginPath();
    this.roundRect(ctx, -effW / 2 + depthOffsetX * 0.6, -phoneH / 2 + depthOffsetY * 0.6, effW, phoneH, cornerR);
    ctx.fillStyle = 'rgba(138, 79, 255, 0.28)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(138, 79, 255, 0.65)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Escrow Grid Blueprint Lines
    ctx.strokeStyle = 'rgba(138, 79, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let gy = -70; gy <= 70; gy += 24) {
      ctx.beginPath();
      ctx.moveTo(-effW / 2 + 15, gy);
      ctx.lineTo(effW / 2 - 15, gy);
      ctx.stroke();
    }

    if (this.explodeProgress > 0.3) {
      ctx.fillStyle = 'rgba(138, 79, 255, 0.9)';
      ctx.font = 'bold 7.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LAYER 03: ESCROW SECURITY VAULT', 0, phoneH / 2 + depthOffsetY * 0.6 - 12);
    }
    ctx.restore();

    // -------------------------------------------------------------
    // LAYER 2: SYNQ Holographic Node Matrix & OLED Emitter
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(expX * 0.3, -expZ * 0.3);
    ctx.beginPath();
    this.roundRect(ctx, -effW / 2 + depthOffsetX * 0.3, -phoneH / 2 + depthOffsetY * 0.3, effW, phoneH, cornerR);
    ctx.fillStyle = 'rgba(9, 9, 11, 0.88)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.clip(); // Clip contents to screen surface

    // Screen Hologram Nodes
    const time = performance.now() * 0.0025;
    const nodePulse = (Math.sin(time) + 1) * 0.5;

    const screenNodes = [
      { x: -38 + sin * 12, y: -50, label: 'IP', color: '#ffffff' },
      { x: 38 - sin * 10, y: -35, label: 'STAGE', color: '#38bdf8' },
      { x: -30 + sin * 8, y: 38, label: 'TALENT', color: '#10b981' },
      { x: 34 - sin * 12, y: 55, label: 'ESCROW', color: '#8a4fff' }
    ];

    // Connect Screen Nodes with Glowing Laser Lines
    screenNodes.forEach(n => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(n.x, n.y);
      ctx.strokeStyle = `${n.color}66`;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(n.x, n.y, 9 + nodePulse * 2, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + 2.5);
    });

    // Core SYNQ Node
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SYNQ', 0, 3.5);

    if (this.explodeProgress > 0.3) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.font = 'bold 7.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LAYER 02: 10-NODE MATRIX', 0, phoneH / 2 - 16);
    }
    ctx.restore();

    // -------------------------------------------------------------
    // LAYER 1: Liquid Frosted Glass Face Panel & Polarized Lens
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(expX * 0.9, -expZ * 0.9);
    ctx.beginPath();
    this.roundRect(ctx, -effW / 2, -phoneH / 2, effW, phoneH, cornerR);

    // Front Glass Body Gradient
    const frontGlass = ctx.createLinearGradient(-effW / 2, -phoneH / 2, effW / 2, phoneH / 2);
    frontGlass.addColorStop(0, 'rgba(255, 255, 255, 0.38)');
    frontGlass.addColorStop(0.35, 'rgba(255, 255, 255, 0.15)');
    frontGlass.addColorStop(0.7, 'rgba(15, 23, 42, 0.42)');
    frontGlass.addColorStop(1, 'rgba(9, 9, 11, 0.72)');
    ctx.fillStyle = frontGlass;
    ctx.fill();

    // Specular Highlight Edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Dynamic Island
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.beginPath();
    this.roundRect(ctx, -32, -phoneH / 2 + 12, 64, 16, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Glowing Island Pulse
    ctx.beginPath();
    ctx.arc(18, -phoneH / 2 + 20, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.options.emeraldColor;
    ctx.fill();

    // Dynamic Studio Glare Sweep
    const glareX = -effW + ((this.currentAngle % 360) / 360) * (effW * 2);
    const glareGrad = ctx.createLinearGradient(glareX, -phoneH, glareX + 65, phoneH);
    glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    glareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)');
    glareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glareGrad;
    ctx.fillRect(-effW / 2, -phoneH / 2, effW, phoneH);

    if (this.explodeProgress > 0.3) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 7.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LAYER 01: LIQUID OPTICS LENS', 0, phoneH / 2 - 16);
    }

    ctx.restore(); // Restore front glass
    ctx.restore(); // Restore main 3D context
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  animate() {
    if (!this.isVisible) return;
    this.updatePhysics();
    this.render();
    requestAnimationFrame(this.animate);
  }
}

// --------------------------------------------------------------------------
// 10-NODE GRAVITATIONAL PHYSICS MATRIX ENGINE
// --------------------------------------------------------------------------
class GravitationalNodeMatrix {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.nodes = [
      { id: 1, label: 'IP Writers', angle: 0, dist: 130, speed: 0.008, color: '#ffffff', size: 13 },
      { id: 2, label: 'Soundstages', angle: 0.6, dist: 170, speed: 0.006, color: '#38bdf8', size: 14 },
      { id: 3, label: 'Marquee Cast', angle: 1.2, dist: 140, speed: 0.009, color: '#10b981', size: 14 },
      { id: 4, label: 'Directors', angle: 1.8, dist: 185, speed: 0.005, color: '#f59e0b', size: 13 },
      { id: 5, label: 'Tech Crew', angle: 2.4, dist: 135, speed: 0.007, color: '#8a4fff', size: 12 },
      { id: 6, label: 'VFX Suites', angle: 3.0, dist: 175, speed: 0.006, color: '#ec4899', size: 13 },
      { id: 7, label: 'Audio Mixing', angle: 3.6, dist: 145, speed: 0.008, color: '#38bdf8', size: 12 },
      { id: 8, label: 'Radar Shield', angle: 4.2, dist: 190, speed: 0.005, color: '#ffffff', size: 14 },
      { id: 9, label: 'Exhibitors', angle: 4.8, dist: 155, speed: 0.007, color: '#10b981', size: 13 },
      { id: 10, label: 'Capital Funds', angle: 5.4, dist: 180, speed: 0.006, color: '#8a4fff', size: 15 }
    ];

    this.mouse = { x: 0, y: 0, active: false };
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left - this.width / 2;
      this.mouse.y = e.clientY - rect.top - this.height / 2;
      this.mouse.active = true;
    });

    this.canvas.addEventListener('mouseleave', () => this.mouse.active = false);

    // IntersectionObserver Performance Optimization: Only render when visible
    this.isVisible = true;
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const wasVisible = this.isVisible;
          this.isVisible = entry.isIntersecting;
          if (!wasVisible && this.isVisible) {
            requestAnimationFrame(this.animate);
          }
        });
      }, { threshold: 0.02 });
      this.observer.observe(this.canvas);
    }

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 600;
    this.height = rect.height || 420;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  render() {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height / 2;
    ctx.clearRect(0, 0, this.width, this.height);

    // Central Core Pulse
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#09090b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SYNQ', cx, cy + 3.5);

    // Concentric Orbits
    [130, 160, 185].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Update & Render Nodes
    this.nodes.forEach(n => {
      n.angle += n.speed;
      let nx = cx + Math.cos(n.angle) * n.dist;
      let ny = cy + Math.sin(n.angle) * (n.dist * 0.7); // Perspective compression

      // Gravitational attraction to cursor
      if (this.mouse.active) {
        const mx = cx + this.mouse.x;
        const my = cy + this.mouse.y;
        const distToMouse = Math.hypot(mx - nx, my - ny);
        if (distToMouse < 100) {
          const pull = (100 - distToMouse) * 0.15;
          nx += (mx - nx) * 0.08;
          ny += (my - ny) * 0.08;
        }
      }

      // Laser Waveguide to Core
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = `${n.color}44`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Node Sphere
      ctx.beginPath();
      ctx.arc(nx, ny, n.size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label Pill
      ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, nx, ny + n.size + 11);
    });
  }

  animate() {
    if (!this.isVisible) return;
    this.render();
    requestAnimationFrame(this.animate);
  }
}

// Auto-initialize 3D Engines
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cinematic-3d-hub')) {
    window.cinematic3DEngine = new Cinematic3DEngine('cinematic-3d-hub');
  }
  if (document.getElementById('gravitational-node-matrix')) {
    window.nodeMatrixEngine = new GravitationalNodeMatrix('gravitational-node-matrix');
  }
});
