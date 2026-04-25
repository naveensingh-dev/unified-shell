import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

class DataPulse {
  progress = 0;
  speed = 0.02;
  constructor(public source: any, public target: any, public color: string, isTorrent = false) {
    this.speed = isTorrent ? (0.04 + Math.random() * 0.03) : (0.01 + Math.random() * 0.02);
  }
  update() {
    this.progress += this.speed;
    return this.progress >= 1;
  }
}

class AmbientParticle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  constructor(w: number, h: number) {
    this.x = (Math.random() - 0.5) * w * 2;
    this.y = (Math.random() - 0.5) * h * 2;
    this.z = Math.random() * 1000;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.vz = (Math.random() - 0.5) * 0.2;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.z += this.vz;
    if (this.z < 0) this.z = 1000;
    if (this.z > 1000) this.z = 0;
  }
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills implements AfterViewInit, OnDestroy {
  @ViewChild('skillCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  private nodes: any[] = [];
  private edges: any[] = [];
  private ambientParticles: AmbientParticle[] = [];
  private pulses: DataPulse[] = [];
  private W = 0;
  private H = 0;
  private focalLength = 800;

  private mouse = { x: -1000, y: -1000 };
  private hoveredNode: any = null;
  private focusedNode: any = null;
  private activeFilter = 'all';
  private time = 0;

  // 3D Orbit Controls
  private camera = { rotX: 0, rotY: 0, targetRotX: 0, targetRotY: 0 };
  private isDraggingOrbit = false;
  private lastMouse = { x: 0, y: 0 };
  private autoRotateSpeed = 0.002;

  private PALETTE = {
    core: { r: 139, g: 92, b: 246, hex: '#8b5cf6' },
    ai: { r: 16, g: 185, b: 129, hex: '#10b981' },
    plat: { r: 8, g: 145, b: 178, hex: '#0891b2' }
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initEngine();
      this.initSkillFilters();
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  private initSkillFilters() {
    document.querySelectorAll('.cn-filter-btn').forEach((btn: any) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cn-filter-btn').forEach((b: any) => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.cat;

        // Explosive Transition Physics
        this.nodes.forEach(n => {
          const isActive = this.activeFilter === 'all' || n.cat === this.activeFilter;
          n.targetAlpha = isActive ? 1 : 0.05;
          if (isActive) {
            n.targetZ3d = n.baseZ3d;
            n.targetX3d = n.baseX3d;
            n.targetY3d = n.baseY3d;
          } else {
            // Explode outward
            n.targetZ3d = n.baseZ3d - 800 - Math.random() * 500;
            n.targetX3d = n.baseX3d * (1.5 + Math.random());
            n.targetY3d = n.baseY3d * (1.5 + Math.random());
          }
        });
      });
    });

    const sfpClose = document.getElementById("sfp-close");
    if (sfpClose) sfpClose.addEventListener('click', () => {
      this.focusedNode = null;
      document.getElementById("skill-focus-panel")?.classList.remove("open");
    });
  }

  private project(x: number, y: number, z: number) {
    const cosY = Math.cos(this.camera.rotY), sinY = Math.sin(this.camera.rotY);
    const cosX = Math.cos(this.camera.rotX), sinX = Math.sin(this.camera.rotX);

    // Rotate Y
    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;

    // Rotate X
    let y2 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;

    const zOffset = z2 + this.focalLength;
    if (zOffset <= 50) return { sx: 0, sy: 0, scale: 0, z: z2, visible: false };

    const scale = this.focalLength / zOffset;
    return {
      sx: (this.W / 2) + x1 * scale,
      sy: (this.H / 2) + y2 * scale,
      scale: scale,
      z: z2,
      visible: true
    };
  }

  private initEngine() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const rawNodes = [
      { id: "angular", label: "Angular v19", cat: "core", val: 98, tags: ["Ivy Renderer", "Zone-less", "@defer", "Custom Schematics", "Hierarchical DI"], desc: "Enterprise platform strategy lead." },
      { id: "ngrx", label: "NgRx Signals", cat: "core", val: 94, tags: ["Signal Store", "Reactive State", "Change Detection", "Enterprise Scale"], desc: "Fine-grained reactive state management." },
      { id: "ts", label: "TypeScript", cat: "core", val: 96, tags: ["Advanced Types", "Generics", "Decorators", "Type Guards"], desc: "Architecting complex type-safe ecosystems." },
      { id: "rxjs", label: "RxJS", cat: "core", val: 91, tags: ["Custom Operators", "Hot/Cold", "Marble Tests", "Schedulers"], desc: "Asynchronous data flow orchestration." },
      { id: "nx", label: "Nx Monorepo", cat: "core", val: 92, tags: ["Multi-Package", "Build Cache", "Dep Graph", "CI"], desc: "Optimizing developer velocity." },
      { id: "analog", label: "Analog.js", cat: "core", val: 87, tags: ["File Routing", "SSR", "Vite", "Full-Stack Angular"], desc: "Full-stack meta-framework expertise." },
      { id: "cdk", label: "Angular CDK", cat: "core", val: 88, tags: ["Overlay", "DragDrop", "A11y", "Virtual Scroll"], desc: "Custom low-level UI component architecture." },
      { id: "perf", label: "Web Vitals", cat: "core", val: 92, tags: ["LCP", "INP", "CLS", "Lighthouse CI"], desc: "Critical performance governance." },
      { id: "rag", label: "Advanced RAG", cat: "ai", val: 89, tags: ["LangChain", "FAISS IVF-PQ", "Hybrid Retrieval", "HyDE"], desc: "Production-grade RAG pipelines." },
      { id: "llm", label: "LLM Fine-tuning", cat: "ai", val: 86, tags: ["Domain Adapt.", "RLHF", "Eval Frameworks", "Prompting"], desc: "Domain-specific model alignment." },
      { id: "genai", label: "GenAI Pipelines", cat: "ai", val: 87, tags: ["Production LLM", "OpenAI", "Streaming", "LangSmith"], desc: "Streaming AI integrations." },
      { id: "devops", label: "DevOps & Cloud", cat: "plat", val: 82, tags: ["GitHub Actions", "Docker", "K8s", "CI/CD"], desc: "Modern CI/CD infrastructure." },
      { id: "testing", label: "Testing & QA", cat: "plat", val: 88, tags: ["Jest", "Cypress E2E", "Jasmine", "Integration"], desc: "Comprehensive quality assurance." },
      { id: "mfe", label: "Micro-Frontends", cat: "plat", val: 90, tags: ["Module Fed.", "Shell Apps", "Nx MFE", "Routing"], desc: "Decoupled distributed delivery models." },
      { id: "arch", label: "Architecture", cat: "plat", val: 96, tags: ["ADR/RFC", "Governance", "Nx", "Performance"], desc: "Scalable frontend systems design." },
      { id: "ai", label: "Generative AI", cat: "ai", val: 94, tags: ["RAG", "LangChain", "LLM-as-Judge", "Prompting"], desc: "Production-grade AI integration." },
      { id: "signals", label: "Signals", cat: "core", val: 98, tags: ["Fine-grained", "Reactivity", "Performance"], desc: "Signal-driven architecture expert." },
      { id: "python", label: "Python/FastAPI", cat: "ai", val: 88, tags: ["Backend", "AI APIs", "Streaming"], desc: "Robust AI backend services." },
      { id: "gov", label: "Governance", cat: "plat", val: 90, tags: ["Mentorship", "Standards", "Reviews"], desc: "Engineering quality standards." }
    ];

    const rawEdges = [
      ["angular", "signals"], ["angular", "mfe"], ["angular", "nx"], ["angular", "arch"],
      ["ai", "rag"], ["ai", "python"], ["ai", "arch"],
      ["arch", "mfe"], ["arch", "nx"], ["arch", "perf"], ["arch", "gov"],
      ["perf", "angular"], ["rag", "python"], ["gov", "nx"],
      ["angular", "ngrx"], ["angular", "ts"], ["angular", "rxjs"], ["angular", "nx"],
      ["angular", "analog"], ["angular", "cdk"], ["angular", "perf"], ["angular", "mfe"],
      ["ngrx", "rxjs"], ["ts", "rag"], ["ts", "genai"], ["ts", "llm"],
      ["rag", "llm"], ["rag", "genai"], ["nx", "devops"], ["nx", "mfe"],
      ["analog", "devops"], ["perf", "testing"], ["mfe", "devops"]
    ];

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      this.W = rect?.width || 800; this.H = 700;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = this.W * dpr; canvas.height = this.H * dpr;
      ctx.scale(dpr, dpr);
    };
    this.resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) this.resizeObserver.observe(canvas.parentElement);
    resize();

    // Spread nodes globally in a spherical distribution
    this.nodes = rawNodes.map((n, i) => {
      const phi = Math.acos(-1 + (2 * i) / rawNodes.length);
      const theta = Math.sqrt(rawNodes.length * Math.PI) * phi;
      const r = 350;
      const baseX = r * Math.cos(theta) * Math.sin(phi);
      const baseY = r * Math.sin(theta) * Math.sin(phi);
      const baseZ = r * Math.cos(phi);

      return {
        ...n,
        baseX3d: baseX, baseY3d: baseY, baseZ3d: baseZ,
        targetX3d: baseX, targetY3d: baseY, targetZ3d: baseZ,
        x3d: baseX, y3d: baseY, z3d: baseZ,
        radius: 12,
        color: this.PALETTE[n.cat as keyof typeof this.PALETTE],
        alpha: 1, targetAlpha: 1,
        sx: 0, sy: 0, scale: 1, visible: true
      };
    });

    this.edges = rawEdges.map(e => ({
      source: this.nodes.find(n => n.id === e[0]),
      target: this.nodes.find(n => n.id === e[1]),
      active: 0
    })).filter(e => e.source && e.target);

    for (let i = 0; i < 150; i++) this.ambientParticles.push(new AmbientParticle(this.W, this.H));

    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: cx - rect.left, y: cy - rect.top };
    };

    canvas.addEventListener('mousedown', (e) => {
      this.isDraggingOrbit = true;
      const p = getPos(e);
      this.lastMouse.x = p.x;
      this.lastMouse.y = p.y;
      canvas.style.cursor = 'grabbing';

      // If clicked on a node, select it
      if (this.hoveredNode) {
        this.focusedNode = this.hoveredNode;
        // this.showPanel(this.focusedNode); // Kept if you still want panel, but hud is primary now
        this.isDraggingOrbit = false; // Don't drag if clicking a node
      } else {
        this.focusedNode = null;
        document.getElementById("skill-focus-panel")?.classList.remove("open");
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDraggingOrbit = false;
      canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('mousemove', (e) => {
      const p = getPos(e);
      this.mouse.x = p.x; this.mouse.y = p.y;

      if (this.isDraggingOrbit) {
        const dx = p.x - this.lastMouse.x;
        const dy = p.y - this.lastMouse.y;
        this.camera.targetRotY += dx * 0.005;
        this.camera.targetRotX += dy * 0.005;
        // Clamp X rotation
        this.camera.targetRotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.camera.targetRotX));
      } else {
        // Hover detection
        let found: any | null = null;
        this.nodes.forEach(n => {
          if (!n.visible || n.alpha < 0.5) return;
          if (Math.hypot(n.sx - this.mouse.x, n.sy - this.mouse.y) < 35 * n.scale) found = n;
        });
        if (this.hoveredNode !== found) {
          this.hoveredNode = found;
          this.updateTooltip();
          // Data Torrent on hover
          if (found) {
            this.edges.forEach(edge => {
              if (edge.source === found || edge.target === found) {
                for (let k = 0; k < 3; k++) {
                  setTimeout(() => {
                    this.pulses.push(new DataPulse(edge.source, edge.target, found.cat, true));
                    this.pulses.push(new DataPulse(edge.target, edge.source, found.cat, true));
                  }, k * 100);
                }
              }
            });
          }
        }
        canvas.style.cursor = found ? 'crosshair' : 'grab';
      }
      this.lastMouse.x = p.x;
      this.lastMouse.y = p.y;
    });

    const render = () => {
      this.animationFrameId = requestAnimationFrame(render);
      this.time += 0.01;

      // Auto-rotation & Orbit Interpolation
      if (!this.isDraggingOrbit && !this.hoveredNode && !this.focusedNode) {
        this.camera.targetRotY += this.autoRotateSpeed;
      }
      this.camera.rotX += (this.camera.targetRotX - this.camera.rotX) * 0.1;
      this.camera.rotY += (this.camera.targetRotY - this.camera.rotY) * 0.1;

      // Elastic physics for nodes (return to target positions)
      this.nodes.forEach(n => {
        n.x3d += (n.targetX3d - n.x3d) * 0.08;
        n.y3d += (n.targetY3d - n.y3d) * 0.08;
        n.z3d += (n.targetZ3d - n.z3d) * 0.08;

        // Add breathing motion
        n.y3d += Math.sin(this.time * 2 + n.id.length) * 0.5;
      });

      ctx.fillStyle = '#030407';
      ctx.fillRect(0, 0, this.W, this.H);

      // Ambient Particles with Depth of Field simulation
      this.ambientParticles.forEach(p => {
        p.update();
        const proj = this.project(p.x, p.y, p.z - 500);
        if (!proj.visible) return;
        const alpha = Math.max(0, 0.5 - Math.abs(proj.z) / 1000);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.3})`;
        ctx.beginPath(); ctx.arc(proj.sx, proj.sy, Math.max(0, 1.5 * proj.scale), 0, Math.PI * 2); ctx.fill();
      });

      this.nodes.forEach(n => {
        const proj = this.project(n.x3d, n.y3d, n.z3d);
        n.sx = proj.sx; n.sy = proj.sy; n.scale = proj.scale; n.z = proj.z; n.visible = proj.visible;
      });

      // Update tooltip position if visible
      if (this.hoveredNode || this.focusedNode) {
        this.updateTooltip();
        this.updateTetherSVG();
      } else {
        const tetherSvg = document.getElementById('hud-tether-svg');
        if (tetherSvg) tetherSvg.style.opacity = '0';
      }

      // Sort nodes/edges by Z for painter's algorithm
      const sortedItems = [...this.edges, ...this.nodes].sort((a, b) => {
        const zA = a.z3d !== undefined ? a.z : (a.source.z + a.target.z) / 2;
        const zB = b.z3d !== undefined ? b.z : (b.source.z + b.target.z) / 2;
        return zB - zA;
      });

      if (Math.random() > 0.95 && this.edges.length > 0) {
        const e = this.edges[Math.floor(Math.random() * this.edges.length)];
        this.pulses.push(new DataPulse(e.source, e.target, e.source.cat));
      }

      sortedItems.forEach(item => {
        if (item.source) { // It's an edge
          if (!item.source.visible || !item.target.visible) return;
          const isFocusPath = this.focusedNode && (item.source === this.focusedNode || item.target === this.focusedNode);
          const isHoverPath = this.hoveredNode && (item.source === this.hoveredNode || item.target === this.hoveredNode);

          let alpha = Math.min(item.source.alpha, item.target.alpha) * 0.15 * item.source.scale;
          if (this.focusedNode || this.hoveredNode) {
            alpha = (isFocusPath || isHoverPath) ? 0.6 * item.source.scale : 0.02;
          }

          ctx.beginPath();
          ctx.moveTo(item.source.sx, item.source.sy);

          // Curved Neural Edges (Bezier)
          const midX = (item.source.sx + item.target.sx) / 2;
          const midY = (item.source.sy + item.target.sy) / 2 - 50 * item.source.scale; // Arc upwards
          ctx.quadraticCurveTo(midX, midY, item.target.sx, item.target.sy);

          ctx.strokeStyle = `rgba(${item.source.color.r},${item.source.color.g},${item.source.color.b},${alpha})`;
          ctx.lineWidth = (isFocusPath || isHoverPath) ? 2 * item.source.scale : 1 * item.source.scale;

          if (isFocusPath || isHoverPath) {
            ctx.shadowBlur = 10 * item.source.scale;
            ctx.shadowColor = `rgba(${item.source.color.r},${item.source.color.g},${item.source.color.b},1)`;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else { // It's a node
          const n = item;
          if (!n.visible) return;
          n.alpha += (n.targetAlpha - n.alpha) * 0.1;
          if (n.alpha < 0.01) return;

          ctx.save();
          let nodeAlpha = n.alpha;
          if (this.focusedNode && n !== this.focusedNode && !this.edges.some(e => (e.source === n && e.target === this.focusedNode) || (e.target === n && e.source === this.focusedNode))) {
            nodeAlpha = 0.1;
          }
          ctx.globalAlpha = nodeAlpha;

          // Depth of Field Simulation (Blur via alpha & sizing for distant nodes)
          const isDistant = n.z > 200;
          if (isDistant && !this.focusedNode) ctx.globalAlpha *= 0.5;

          // Holographic Core
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = i * Math.PI / 3;
            const r = n.radius * n.scale * (n === this.hoveredNode ? 1.5 : 1);
            ctx.lineTo(n.sx + r * Math.cos(a), n.sy + r * Math.sin(a));
          }
          ctx.closePath();
          ctx.strokeStyle = `rgb(${n.color.r},${n.color.g},${n.color.b})`;
          ctx.lineWidth = 2 * n.scale;
          ctx.stroke();
          ctx.fillStyle = 'rgba(6,10,20,0.8)';
          ctx.fill();

          const pulse = Math.sin(this.time * 5 + n.id.length) * 0.2 + 0.8;
          ctx.beginPath(); ctx.arc(n.sx, n.sy, Math.max(0, 4 * n.scale * pulse), 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${n.color.r},${n.color.g},${n.color.b})`;
          ctx.shadowBlur = 15 * n.scale; ctx.shadowColor = ctx.fillStyle;
          ctx.fill(); ctx.shadowBlur = 0;

          if (n === this.hoveredNode || n === this.focusedNode) {
            this.drawNodeHUD(ctx, n);
          }

          if (n.scale > 0.4 && !isDistant) {
            ctx.font = `600 ${10 * n.scale}px 'DM Mono'`;
            ctx.fillStyle = `rgba(255,255,255,${nodeAlpha})`;
            ctx.textAlign = 'center';
            ctx.fillText(n.label.toUpperCase(), n.sx, n.sy + 28 * n.scale);
          }
          ctx.restore();
        }
      });

      this.pulses = this.pulses.filter(p => {
        p.update();
        const x = p.source.x3d + (p.target.x3d - p.source.x3d) * p.progress;
        const y = p.source.y3d + (p.target.y3d - p.source.y3d) * p.progress;
        const z = p.source.z3d + (p.target.z3d - p.source.z3d) * p.progress;
        const proj = this.project(x, y, z);
        if (!proj.visible) return true;

        // Arc path interpolation for pulse to match bezier edge
        const midX = (p.source.sx + p.target.sx) / 2;
        const midY = (p.source.sy + p.target.sy) / 2 - 50 * p.source.scale;

        const t = p.progress;
        const invT = 1 - t;
        const px = invT * invT * p.source.sx + 2 * invT * t * midX + t * t * p.target.sx;
        const py = invT * invT * p.source.sy + 2 * invT * t * midY + t * t * p.target.sy;

        ctx.beginPath(); ctx.arc(px, py, Math.max(0, 2.5 * proj.scale), 0, Math.PI * 2);
        const c = this.PALETTE[p.color as keyof typeof this.PALETTE];
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 15 * proj.scale; ctx.shadowColor = `rgb(${c.r},${c.g},${c.b})`;
        ctx.fill();
        ctx.shadowBlur = 0;
        return p.progress < 1;
      });
    };
    render();
  }

  private drawNodeHUD(ctx: CanvasRenderingContext2D, n: any) {
    const size = 35 * n.scale;
    const t = this.time * 2;
    ctx.strokeStyle = `rgba(${n.color.r},${n.color.g},${n.color.b}, 0.8)`;
    ctx.lineWidth = 1.5;

    // Rotating Tactical Brackets
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(n.sx, n.sy);
      ctx.rotate(i * Math.PI / 2 + t);
      ctx.beginPath();
      ctx.moveTo(size, size - 12);
      ctx.lineTo(size, size);
      ctx.lineTo(size - 12, size);
      ctx.stroke();
      ctx.restore();
    }
  }

  private updateTetherSVG() {
    const n = this.focusedNode || this.hoveredNode;
    const card = document.getElementById('ch-card');
    const svg = document.getElementById('hud-tether-svg');
    const path = document.getElementById('hud-tether-path');
    const d1 = document.getElementById('hud-tether-dot1');
    const d2 = document.getElementById('hud-tether-dot2');
    const pulse = document.getElementById('hud-tether-pulse');

    if (!n || !card || !svg || !card.classList.contains('show')) {
      if (svg) svg.style.opacity = '0';
      return;
    }

    svg.style.opacity = '1';

    const canvas = this.canvasRef.nativeElement;
    const canvasRect = canvas.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    // Canvas relative coordinates
    const startX = n.sx;
    const startY = n.sy;

    // Card relative coordinates (anchor point)
    let endX, endY;
    const isRightSide = parseFloat(card.style.left) > startX;

    if (isRightSide) {
      endX = (cardRect.left - canvasRect.left);
      endY = (cardRect.top - canvasRect.top) + 40; // Align with header
    } else {
      endX = (cardRect.right - canvasRect.left);
      endY = (cardRect.top - canvasRect.top) + 40;
    }

    // SVG Path drawing (stepped cyber line)
    const midX = startX + (endX - startX) * 0.4;
    const d = `M ${startX} ${startY} L ${midX} ${startY} L ${endX} ${endY}`;

    if (path) {
      path.setAttribute('d', d);
      path.style.stroke = `rgb(${n.color.r},${n.color.g},${n.color.b})`;
    }

    if (d1) {
      d1.setAttribute('cx', midX.toString());
      d1.setAttribute('cy', startY.toString());
    }

    if (d2) {
      d2.setAttribute('cx', endX.toString());
      d2.setAttribute('cy', endY.toString());
    }

    if (pulse) {
      pulse.setAttribute('cx', endX.toString());
      pulse.setAttribute('cy', endY.toString());
      pulse.style.color = `rgb(${n.color.r},${n.color.g},${n.color.b})`;
    }
  }

  private updateTooltip() {
    const card = document.getElementById('ch-card');
    if (!card) return;

    const n = this.focusedNode || this.hoveredNode;

    if (n) {
      card.classList.add('show');

      // Update Texts
      document.getElementById('ch-title')!.textContent = n.label;
      document.getElementById('ch-subtitle')!.textContent = n.desc.toUpperCase();
      document.getElementById('ch-pct')!.textContent = n.val + '%';

      // Update Chips
      document.getElementById('ch-chips')!.innerHTML = n.tags.map((t: string) => `<div class='ch-chip'>${t}</div>`).join('');

      // Update Colors dynamically using CSS variables
      const rgb = `${n.color.r},${n.color.g},${n.color.b}`;
      card.style.borderColor = `rgba(${rgb}, 0.5)`;
      card.style.boxShadow = `0 30px 60px rgba(0,0,0,0.8), 0 0 20px rgba(${rgb}, 0.2)`;

      const ringWrap = card.querySelector('.ch-ring-wrap') as HTMLElement;
      if (ringWrap) ringWrap.style.color = `rgb(${rgb})`;

      const barFill = document.getElementById('ch-bar-fill');
      if (barFill) {
        barFill.style.background = `rgb(${rgb})`;
        barFill.style.boxShadow = `0 0 15px rgb(${rgb})`;
        setTimeout(() => barFill.style.width = n.val + '%', 50);
      }

      // Position logic
      const cardWidth = 380;
      const cardHeight = 260; // approximate
      let offset = 80;

      let left = n.sx + offset;
      let top = n.sy - cardHeight / 2;

      // Flip side if out of bounds right
      if (left + cardWidth > this.W - 20) {
        left = n.sx - cardWidth - offset;
      }

      // Keep in vertical bounds
      if (top < 20) top = 20;
      if (top + cardHeight > this.H - 20) top = this.H - cardHeight - 20;

      card.style.left = left + 'px';
      card.style.top = top + 'px';

    } else {
      card.classList.remove('show');
      const barFill = document.getElementById('ch-bar-fill');
      if (barFill) barFill.style.width = '0%';
    }
  }

  private showPanel(node: any) {
    // Keeping for structural fallback, but HUD does everything now
    const panel = document.getElementById("skill-focus-panel");
    if (!panel) return;
    panel.classList.add("open");
  }
}
