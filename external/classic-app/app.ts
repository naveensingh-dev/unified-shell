import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectionStrategy, afterNextRender } from '@angular/core';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Metrics } from './components/metrics/metrics';
import { WhyHire } from './components/why-hire/why-hire';
import { Advancing } from './components/advancing/advancing';
import { Skills } from './components/skills/skills';
import { Experience } from './components/experience/experience';
import { Projects } from './components/projects/projects';
import { CaseStudies } from './components/case-studies/case-studies';
import { Footer } from './components/footer/footer';
import { TechPipeline } from './components/tech-pipeline/tech-pipeline';
import { VideoIntro } from './components/video-intro/video-intro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, Header, Hero, Metrics, WhyHire, Advancing, Skills, Experience,
    Projects, CaseStudies, Footer, TechPipeline,
    VideoIntro
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnDestroy {
  @ViewChild('cmdInput') cmdInput!: ElementRef<HTMLInputElement>;
  
  private animationFrameId: number | null = null;
  private gridAnimationFrameId: number | null = null;
  private fpsFrameId: number | null = null;

  // Global State
  lmTitle = '';
  isLMSuccess = false;
  currentSectionId = 'hero';
  isXrayActive = false;
  isCmdOpen = false;
  
  // Performance State
  currentFps = 60;
  isEcoMode = false;

  // Audio Context
  private audioCtx: AudioContext | null = null;
  
  // Scheduler State
  schedStep = 1;
  schedName = '';
  schedEmail = '';
  schedNotes = '';
  selectedAgendaItems: string[] = [];
  confirmDateText = '';
  confirmTimeText = '';
  selectedDate: Date | null = null;
  selectedSlot: {h: number, m: number} | null = null;
  calendarCurrentMonth: Date | null = null;
  calendarDays: any[] = [];
  timeSlots: any[] = [];
  
  readonly WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  private readonly DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  private readonly MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  private readonly MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  readonly AGENDA_OPTIONS = [
    { label: 'Angular Architecture', icon: '🏗️' },
    { label: 'AI/GenAI', icon: '🤖' },
    { label: 'Hiring Discussion', icon: '👥' },
    { label: 'Tech Due Diligence', icon: '🔍' },
    { label: 'Performance Audit', icon: '⚡' },
    { label: 'Product Strategy', icon: '🎯' },
    { label: 'Migration Planning', icon: '🚀' },
    { label: 'Other', icon: '✨' }
  ];

  get schedTitle() {
    switch(this.schedStep) {
      case 1: return 'Pick a Date & Time';
      case 2: return 'Tell me about your project';
      case 3: return 'Confirm your Session';
      case 4: return 'Booking Confirmed';
      default: return 'Schedule a Call';
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    afterNextRender(() => {
      this.initLoader();
      this.initThemeSystem();
      this.initCursor();
      this.initSentientGrid(); 
      this.initFloatingBadges();
      this.initRippleEffect();
      this.initTiltEffect();
      this.initSectionNav();
      this.initCodeSymbols();
      this.initGlobalFunctions();
      this.initMotionBlur();
      this.initAdaptivePerformance();
      
      const initAudio = () => {
        if (!this.audioCtx) {
          const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) this.audioCtx = new AudioContextClass();
        }
        this.document.removeEventListener('click', initAudio);
        this.document.removeEventListener('keydown', initAudio);
      };
      this.document.addEventListener('click', initAudio, { passive: true });
      this.document.addEventListener('keydown', initAudio, { passive: true });
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    if (this.gridAnimationFrameId !== null) cancelAnimationFrame(this.gridAnimationFrameId);
    if (this.fpsFrameId !== null) cancelAnimationFrame(this.fpsFrameId);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!isPlatformBrowser(this.platformId)) return;

    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.toggleCmd(true);
    } else if (event.key === '/' && !this.isCmdOpen) {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA') {
        event.preventDefault();
        this.toggleCmd(true);
      }
    }

    if (event.altKey && event.key.toLowerCase() === 'x') {
      event.preventDefault();
      this.toggleXray();
    }

    if (event.key === 'Escape') {
      if (this.isCmdOpen) { this.toggleCmd(false); this.playSound('blip'); }
      this.closeModals();
    }
  }

  private playSound(type: 'hover' | 'click' | 'blip') {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    const now = this.audioCtx.currentTime;
    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.02, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'blip') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(1200, now + 0.05);
      gainNode.gain.setValueAtTime(0.03, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  private initAdaptivePerformance() {
    let lastTime = performance.now();
    let frames = 0;
    let ecoTriggerCount = 0;
    const fpsEl = this.document.getElementById('sys-fps-val');
    const loadEl = this.document.getElementById('sys-load-val');
    const measure = (time: number) => {
      frames++;
      const delta = time - lastTime;
      if (delta >= 1000) {
        this.currentFps = Math.round((frames * 1000) / delta);
        if (fpsEl) fpsEl.textContent = this.currentFps.toString();
        const load = Math.max(10, Math.min(100, 100 - (this.currentFps - 20) * 1.5)).toFixed(1);
        if (loadEl) loadEl.textContent = `${load}%`;
        if (this.currentFps < 40 && !this.isEcoMode) {
          ecoTriggerCount++;
          if (ecoTriggerCount > 3) {
            this.isEcoMode = true;
            this.document.body.classList.add('eco-mode');
            this.logCmdSystem('[SYS] Frame rate < 40 detected. Engaging Eco-Mode.');
          }
        } else if (this.currentFps > 55 && this.isEcoMode) {
          ecoTriggerCount = 0;
          this.isEcoMode = false;
          this.document.body.classList.remove('eco-mode');
          this.logCmdSystem('[SYS] Resources stabilized. Eco-Mode disengaged.');
        }
        frames = 0;
        lastTime = time;
      }
      this.fpsFrameId = requestAnimationFrame(measure);
    };
    this.fpsFrameId = requestAnimationFrame(measure);
  }

  private logCmdSystem(msg: string) {
    const results = this.document.getElementById('cmd-results');
    if (results) {
      const out = this.document.createElement('div');
      out.className = 'cmd-line intro';
      out.style.color = 'var(--gold2)';
      out.textContent = msg;
      results.appendChild(out);
      results.scrollTop = results.scrollHeight;
    }
  }

  private initLoader() {
    const loader = this.document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('done');
        setTimeout(() => { if (loader) loader.style.display = 'none'; this.triggerPageEntry(); }, 800);
      }, 1500);
    }
  }

  private triggerPageEntry() {
    const targets = this.document.querySelectorAll('main > *');
    targets.forEach((el: any, i) => {
      setTimeout(() => { el.classList.add('entered'); }, i * 100);
    });
  }

  private initThemeSystem() {
    const THEMES: any = {
      'aurora': { '--void':'#030407','--abyss':'#060A12','--base':'#0A0F1E','--raised':'#0F1628','--lifted':'#141D35','--v':'#7C3AED','--v2':'#8B5CF6','--v3':'#A78BFA','--v4':'#C4B5FD','--v-g':'rgba(124,58,237,.08)','--v-b':'rgba(124,58,237,.2)','--v-glow':'rgba(124,58,237,.4)','--c':'#0891B2','--c2':'#06B6D4','--c3':'#22D3EE','--c4':'#67E8F9','--c-g':'rgba(8,145,178,.08)','--c-b':'rgba(8,145,178,.2)','--gold':'#D97706','--gold2':'#F59E0B','--gold3':'#FCD34D','--gold-g':'rgba(217,119,6,.08)','--gold-b':'rgba(217,119,6,.2)','--em':'#059669','--em2':'#10B981','--txt1':'#FFFFFF','--txt2':'#E2E8F0','--txt3':'#94A3B8','--txt4':'#475569' },
      'midnight-rose': { '--void':'#050208','--abyss':'#0A0510','--base':'#110818','--raised':'#190D24','--lifted':'#20112E','--v':'#DB2777','--v2':'#EC4899','--v3':'#F472B6','--v4':'#FBCFE8','--c':'#EA580C','--c2':'#F97316','--c3':'#FB923C','--c4':'#FDBA74','--gold':'#EAB308','--gold2':'#FBBF24','--gold3':'#FDE68A','--em':'#F472B6','--em2':'#FBCFE8','--txt1':'#FDF4FF','--txt2':'#E9D5FF','--txt3':'#7E22CE','--txt4':'#4A1772' },
      'neon-tokyo': { '--void':'#000000','--abyss':'#030305','--base':'#060608','--raised':'#0C0C10','--lifted':'#121218','--v':'#00CC6E','--v2':'#00FF88','--v3':'#33FF99','--v4':'#99FFCC','--c':'#FF1560','--c2':'#FF2D78','--c3':'#FF6B9E','--c4':'#FFB3CE','--gold':'#00CFFF','--gold2':'#33DBFF','--gold3':'#99EDFF','--em':'#00CC6E','--em2':'#00FF88','--txt1':'#FFFFFF','--txt2':'#B0FFD8','--txt3':'#477E60','--txt4':'#2A4A38' },
      'arctic': { '--void':'#03080F','--abyss':'#06101C','--base':'#0A1828','--raised':'#0F2035','--lifted':'#142840','--v':'#1D4ED8','--v2':'#3B82F6','--v3':'#60A5FA','--v4':'#BFDBFE','--c':'#0369A1','--c2':'#0EA5E9','--c3':'#38BDF8','--c4':'#BAE6FD','--gold':'#E2E8F0','--gold2':'#F1F5F9','--gold3':'#FFFFFF','--em':'#0891B2','--em2':'#38BDF8','--txt1':'#F0F9FF','--txt2':'#BAE6FD','--txt3':'#075985','--txt4':'#0C4A6E' },
      'emerald': { '--void':'#020B07','--abyss':'#04120C','--base':'#071A10','--raised':'#0C2418','--lifted':'#102E1E','--v':'#047857','--v2':'#10B981','--v3':'#34D399','--v4':'#A7F3D0','--c':'#7C3AED','--c2':'#8B5CF6','--c3':'#A78BFA','--c4':'#C4B5FD','--gold':'#D97706','--gold2':'#F59E0B','--gold3':'#FDE68A','--em':'#059669','--em2':'#34D399','--txt1':'#ECFDF5','--txt2':'#A7F3D0','--txt3':'#065F46','--txt4':'#064E3B' },
      'royal-gold': { '--void':'#0C0800','--abyss':'#150F00','--base':'#1C1500','--raised':'#261C00','--lifted':'#302300','--v':'#B45309','--v2':'#D97706','--v3':'#F59E0B','--v4':'#FDE68A','--c':'#9CA3AF','--c2':'#D1D5DB','--c3':'#E5E7EB','--c4':'#F9FAFB','--gold':'#F59E0B','--gold2':'#FBBF24','--gold3':'#FDE68A','--em':'#D97706','--em2':'#F59E0B','--txt1':'#FFFBEB','--txt2':'#FDE68A','--txt3':'#92400E','--txt4':'#78350F' }
    };
    const applyTheme = (name: string) => {
      const t = THEMES[name]; if (!t) return;
      const root = this.document.documentElement;
      Object.keys(t).forEach(k => root.style.setProperty(k, t[k]));
      this.document.querySelectorAll('.theme-btn').forEach((b: any) => b.classList.toggle('active', b.dataset.theme === name));
      localStorage.setItem('ns-theme', name);
    };
    const saved = localStorage.getItem('ns-theme') || 'aurora'; applyTheme(saved);
    const toggleBtn = this.document.getElementById('theme-toggle-btn'), panel = this.document.getElementById('theme-panel');
    if (toggleBtn && panel) {
      toggleBtn.onclick = (e) => { e.stopPropagation(); panel.classList.toggle('open'); this.playSound('click'); };
      this.document.onclick = (e) => { if (!this.document.getElementById('theme-toggle')?.contains(e.target as HTMLElement)) panel.classList.remove('open'); };
      this.document.querySelectorAll('.theme-btn').forEach((b: any) => b.onclick = () => { applyTheme(b.dataset.theme); panel.classList.remove('open'); this.playSound('blip'); });
    }
  }

  private initCursor() {
    const dot = this.document.getElementById('cursor-dot'), ring = this.document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dot.style.display = 'none'; ring.style.display = 'none'; return;
    }
    let mx = 0, my = 0, rx = 0, ry = 0;
    let magneticTarget: HTMLElement | null = null;
    this.document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!magneticTarget) dot.style.transform = `translate(-50%,-50%) translate(${mx}px,${my}px)`;
    });
    const animRing = () => {
      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const tx = rect.left + rect.width / 2, ty = rect.top + rect.height / 2;
        rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2;
        dot.style.transform = `translate(-50%,-50%) translate(${tx}px,${ty}px)`;
        dot.style.opacity = '0';
        ring.style.transform = `translate(-50%,-50%) translate(${rx}px,${ry}px)`;
        ring.style.width = `${rect.width + 16}px`; ring.style.height = `${rect.height + 16}px`;
        ring.style.borderRadius = '12px'; ring.style.background = 'rgba(124,58,237,0.1)';
        ring.style.border = '1px solid rgba(124,58,237,0.5)'; ring.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)';
        ring.style.backdropFilter = 'blur(2px)';
      } else {
        rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
        ring.style.transform = `translate(-50%,-50%) translate(${rx}px,${ry}px)`;
        dot.style.opacity = '1';
        if (!this.document.body.classList.contains('cursor-hover')) {
          ring.style.width = '48px'; ring.style.height = '48px';
          ring.style.borderRadius = '50%'; ring.style.background = 'rgba(124,58,237,0.05)';
          ring.style.border = '1px solid rgba(167,139,250,.3)';
          ring.style.boxShadow = 'inset 0 0 20px rgba(124,58,237,0.1)';
          ring.style.backdropFilter = 'invert(0.2) hue-rotate(15deg)';
        }
      }
      this.animationFrameId = requestAnimationFrame(animRing);
    };
    animRing();
    setTimeout(() => {
      this.document.querySelectorAll('a, button, .pf-card, .sg, .cn-filter-btn, .xray-toggle, .theme-toggle-btn').forEach((el: any) => {
        el.addEventListener('mouseenter', () => {
          this.document.body.classList.add('cursor-hover');
          if (el.classList.contains('btn-primary') || el.classList.contains('btn-hire') || el.classList.contains('btn-ghost') || el.classList.contains('xray-toggle')) magneticTarget = el;
        });
        el.addEventListener('mouseleave', () => { this.document.body.classList.remove('cursor-hover'); magneticTarget = null; });
        el.addEventListener('mousedown', () => this.playSound('click'));
      });
    }, 1000);
    this.document.addEventListener('mousedown', () => this.document.body.classList.add('cursor-click'));
    this.document.addEventListener('mouseup', () => this.document.body.classList.remove('cursor-click'));
  }

  private initSentientGrid() {
    const canvas = this.document.createElement('canvas');
    canvas.id = 'sentient-grid-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.6;';
    this.document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let W=0, H=0, mx=0, my=0;
    const resize = () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    this.document.addEventListener('mousemove', (e) => { mx=e.clientX; my=e.clientY; });
    let currentSpacing = 60, currentForce = 40;
    const points: any[] = [];
    const initPoints = (spacing: number) => {
      points.length = 0;
      for(let x=0; x<=window.innerWidth+spacing; x+=spacing) {
        for(let y=0; y<=window.innerHeight+spacing; y+=spacing) points.push({ ox: x, oy: y, x: x, y: y });
      }
    };
    initPoints(currentSpacing);
    const renderGrid = () => {
      this.gridAnimationFrameId = requestAnimationFrame(renderGrid);
      if (this.isEcoMode) return;
      let targetSpacing = 60, targetForce = 40;
      if (this.currentSectionId === 'projects') { targetSpacing = 40; targetForce = 80; ctx.strokeStyle = 'rgba(8,145,178,0.15)'; }
      else if (this.currentSectionId === 'skills') { targetSpacing = 80; targetForce = 60; ctx.strokeStyle = 'rgba(124,58,237,0.15)'; }
      else if (this.currentSectionId === 'contact') { targetSpacing = 100; targetForce = 15; ctx.strokeStyle = 'rgba(148,163,184,0.08)'; }
      else { targetSpacing = 60; targetForce = 40; ctx.strokeStyle = 'rgba(148,163,184,0.12)'; }
      if (Math.abs(currentSpacing - targetSpacing) > 1) { currentSpacing += (targetSpacing - currentSpacing) * 0.05; initPoints(Math.floor(currentSpacing)); }
      currentForce += (targetForce - currentForce) * 0.05;
      ctx.clearRect(0,0,W,H); ctx.lineWidth = 0.5;
      points.forEach(p => {
        const dx = mx - p.ox, dy = my - p.oy, dist = Math.sqrt(dx*dx + dy*dy);
        const force = dist < 300 ? (1 - dist/300) * currentForce : 0;
        const angle = Math.atan2(dy, dx), dir = this.currentSectionId === 'projects' ? 1 : -1;
        p.x = p.ox + Math.cos(angle) * force * dir; p.y = p.oy + Math.sin(angle) * force * dir;
      });
      const cols = Math.floor(W/currentSpacing) + 2, rows = Math.floor(H/currentSpacing) + 2;
      for(let r=0; r<rows; r++) {
        ctx.beginPath();
        for(let c=0; c<cols; c++) { const p = points[c * rows + r]; if(p) c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); }
        ctx.stroke();
      }
      for(let c=0; c<cols; c++) {
        ctx.beginPath();
        for(let r=0; r<rows; r++) { const p = points[c * rows + r]; if(p) r === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); }
        ctx.stroke();
      }
    };
    renderGrid();
  }

  private initFloatingBadges() {
    const badge = this.document.getElementById('float-badge'); if (!badge) return;
    const achievements = [ { ico:'🏆', title:'Architecture Owner', sub:'$50k/month banking platform' }, { ico:'⚡', title:'40% LCP Improvement', sub:'4.0s → 2.4s via Angular Signals' }, { ico:'🤖', title:'GenAI Pioneer', sub:'Zero to production RAG in 6 weeks' }, { ico:'🛠', title:'OSS Maintainer', sub:'128+ stars on technical tools' } ];
    let idx = 0; const showNext = () => {
      const a = achievements[idx % achievements.length], icoEl = this.document.getElementById('float-badge-ico'), titleEl = this.document.getElementById('float-badge-title'), subEl = this.document.getElementById('float-badge-sub');
      if (icoEl) icoEl.textContent = a.ico; if (titleEl) titleEl.textContent = a.title; if (subEl) subEl.textContent = a.sub;
      if (badge) badge.classList.add('show');
      setTimeout(() => { if (badge) badge.classList.remove('show'); idx++; setTimeout(showNext, 5500); }, 3200);
    };
    setTimeout(showNext, 8000);
  }

  private initRippleEffect() {
    this.document.querySelectorAll('.ripple-btn').forEach((btn: any) => {
      btn.onclick = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top, size = Math.max(rect.width, rect.height) * 2, ripple = this.document.createElement('span');
        ripple.className = 'ripple-wave'; ripple.style.cssText = `width:${size}px;height:${size}px;left:${x-size/2}px;top:${y-size/2}px`;
        btn.appendChild(ripple); setTimeout(() => ripple.remove(), 700);
      };
    });
  }

  private initTiltEffect() {
    this.document.querySelectorAll('.cs-card, .why-card, .pf-card, .sg, .advancing-card, .testi-card, .ci, .lm-card, .metric-enhanced, .tl-item, .pc').forEach((el: any) => {
      const updateTilt = (dx: number, dy: number, x: number, y: number, w: number, h: number) => {
        el.style.transform = `perspective(1200px) rotateX(${-dy * 10}deg) rotateY(${dx * 10}deg) scale(1.02)`;
        el.style.setProperty('--spot-x', (x/w*100).toFixed(1)+'%'); el.style.setProperty('--spot-y', (y/h*100).toFixed(1)+'%');
        const layers = el.querySelectorAll('.proj-mock, .pfc-visual-badge, .feat-badge, .pfc-name, .metric-gauge-wrap, .why-card-icon-wrap, .tower-wrap, .pm-screen, .pfc-body > *');
        layers.forEach((layer: any, i: number) => {
          const depth = (i % 3 + 1) * 15;
          layer.style.transform = `translateZ(${depth}px) translateX(${dx * (depth/2)}px) translateY(${dy * (depth/2)}px)`; layer.style.transition = 'none';
        });
        const shine = el.querySelector('.card-shine, .advancing-card-shine');
        if (shine) { shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 80%)`; shine.style.opacity = '1'; }
      };
      el.addEventListener('mousemove', (e: MouseEvent) => {
        if (this.isEcoMode) return;
        const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        updateTilt((x - r.width/2) / (r.width/2), (y - r.height/2) / (r.height/2), x, y, r.width, r.height);
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.querySelectorAll('.proj-mock, .pfc-visual-badge, .feat-badge, .pfc-name, .metric-gauge-wrap, .why-card-icon-wrap, .tower-wrap, .pm-screen, .pfc-body > *').forEach((l: any) => { l.style.transform = ''; l.style.transition = 'transform 0.5s var(--ease)'; });
        const shine = el.querySelector('.card-shine, .advancing-card-shine'); if (shine) shine.style.opacity = '0';
      });
    });
  }

  private initSectionNav() {
    const secs = ['hero', 'why-hire', 'about', 'skills', 'experience', 'projects', 'case-studies', 'ai', 'contact'], labels = ['Home', 'Why Me', 'About', 'Skills', 'Experience', 'Projects', 'Studies', 'GenAI', 'Contact'];
    const nav = this.document.getElementById('section-nav') || this.document.createElement('nav');
    if (!nav.id) { nav.id = 'section-nav'; nav.setAttribute('aria-label', 'Section navigation'); this.document.body.appendChild(nav); }
    nav.innerHTML = ''; secs.forEach((id, i) => {
      const dot = this.document.createElement('div'); dot.className = 'sn-dot'; dot.dataset['label'] = labels[i];
      dot.onclick = () => { const el = this.document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
      nav.appendChild(dot);
    });
    window.addEventListener('scroll', () => {
      let cur = 'hero'; const scrollY = window.pageYOffset;
      secs.forEach(id => { const el = this.document.getElementById(id); if (el && scrollY >= this.getOffsetTop(el) - 200) cur = id; });
      this.currentSectionId = cur; if (nav) nav.classList.toggle('vis', scrollY > 300);
      this.document.querySelectorAll('.sn-dot').forEach((d: any, i) => d.classList.toggle('active', secs[i] === cur));
    }, { passive: true });
  }

  private getOffsetTop(el: HTMLElement): number {
    let top = 0; while (el) { top += el.offsetTop; el = el.offsetParent as HTMLElement; } return top;
  }

  private initCodeSymbols() {
    const symbols=['</>','{}','=>','const','async','await','signal()','&#64;Component','ngFor','import','export','return','class','type','interface','[]','?.','&&','||','...'], cols=['rgba(124,58,237,','rgba(8,145,178,','rgba(16,185,129,','rgba(245,158,11,'];
    for(let i=0; i<14; i++) {
      const el = this.document.createElement('span'); el.className='code-symbol'; el.innerHTML = symbols[Math.floor(Math.random()*symbols.length)];
      el.style.cssText = `color:${cols[Math.floor(Math.random()*cols.length)]}${(Math.random()*.05+.03).toFixed(3)}); left:${Math.random()*95}%; font-size:${10+Math.random()*8}px; --cf-dur:${15+Math.random()*25}s; --cf-d:${-Math.random()*15}s; --cf-rot:${Math.random()*12-6}deg`;
      this.document.body.appendChild(el);
    }
  }

  private initGlobalFunctions() {
    (window as any).openCalendlyModal = () => this.openScheduler();
    (window as any).openResumeViewer = () => { const modal = this.document.getElementById('resume-viewer'); if (modal) { modal.classList.add('open'); this.document.body.style.overflow = 'hidden'; } };
    (window as any).openLM = (title: string) => { this.lmTitle = title; this.isLMSuccess = false; const modal = this.document.getElementById('lm-modal'); if (modal) { modal.classList.add('open'); this.document.body.style.overflow = 'hidden'; } };
  }

  private initMotionBlur() {
    let lastPos = window.pageYOffset;
    const update = () => {
      if (this.isEcoMode) { this.document.body.classList.remove('is-warping'); lastPos = window.pageYOffset; requestAnimationFrame(update); return; }
      const currentPos = window.pageYOffset, diff = Math.abs(currentPos - lastPos), velocity = Math.min(diff / 10, 15);
      this.document.documentElement.style.setProperty('--scroll-velocity', velocity.toFixed(2));
      if (velocity > 2) this.document.body.classList.add('is-warping'); else this.document.body.classList.remove('is-warping');
      lastPos = currentPos; requestAnimationFrame(update);
    };
    update();
  }

  toggleXray() {
    this.isXrayActive = !this.isXrayActive;
    if (this.isXrayActive) {
      this.document.body.classList.add('xray-mode'); this.playSound('blip');
      this.document.querySelectorAll('section, article, .pf-card, .metric-enhanced').forEach((el: any) => {
        let meta = '[Node]'; if (el.tagName === 'APP-HERO') meta = '[Hero]'; else if (el.tagName === 'APP-SKILLS') meta = '[Skills]';
        el.setAttribute('data-arch-meta', meta);
      });
    } else { this.document.body.classList.remove('xray-mode'); this.playSound('click'); }
  }

  toggleCmd(open: boolean) { this.isCmdOpen = open; if (open) { this.playSound('blip'); setTimeout(() => this.cmdInput.nativeElement.focus(), 50); } else this.cmdInput.nativeElement.value = ''; }
  onCmdBlur() {}
  executeCmd(event: any) {
    const input = event.target.value.toLowerCase().trim(), results = this.document.getElementById('cmd-results'); if (!results) return;
    this.playSound('hover'); const line = this.document.createElement('div'); line.className = 'cmd-line'; line.innerHTML = `<span class='cmd-out-prompt'>></span> ${input}`; results.appendChild(line);
    const out = this.document.createElement('div'); out.className = 'cmd-out';
    if (input === 'help') out.innerHTML = `cd [section], cat resume, sudo hire, xray, eco, clear, exit`;
    else if (input.startsWith('cd ')) {
      const sec = input.split(' ')[1], el = this.document.getElementById(sec);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); out.textContent = `Navigating...`; setTimeout(() => this.toggleCmd(false), 800); }
      else out.textContent = `Not found.`;
    } else if (input === 'clear') results.innerHTML = ''; else if (input === 'exit') this.toggleCmd(false);
    else out.textContent = `Not recognized.`;
    results.appendChild(out); results.scrollTop = results.scrollHeight; event.target.value = '';
  }

  copyToClipboard(text: string, event: MouseEvent) {
    const btn = event.currentTarget as HTMLElement, orig = btn.innerHTML;
    navigator.clipboard.writeText(text).then(() => { btn.innerHTML = '✓'; setTimeout(() => btn.innerHTML = orig, 2000); });
    this.playSound('click');
  }

  openScheduler() {
    this.schedStep = 1; this.selectedDate = null; this.selectedSlot = null; this.timeSlots = []; this.schedName = ''; this.schedEmail = ''; this.schedNotes = ''; this.selectedAgendaItems = [];
    this.calendarCurrentMonth = new Date(); this.calendarCurrentMonth.setDate(1); this.calendarCurrentMonth.setHours(0,0,0,0);
    this.buildCalendarMonth(); const modal = this.document.getElementById('sched-modal'); if (modal) modal.classList.add('open'); this.document.body.style.overflow = 'hidden'; this.playSound('blip');
  }
  closeModals() { this.document.querySelectorAll('.modal').forEach(m => m.classList.remove('open')); this.document.body.style.overflow = ''; this.playSound('click'); }
  scrollToTop() { if (isPlatformBrowser(this.platformId)) { window.scrollTo({ top: 0, behavior: 'smooth' }); this.playSound('click'); } }
  openResume(event: Event) { event.preventDefault(); (window as any).openResumeViewer?.(); }
  openLM(title: string) { this.lmTitle = title; this.isLMSuccess = false; const modal = this.document.getElementById('lm-modal'); if (modal) modal.classList.add('open'); this.document.body.style.overflow = 'hidden'; this.playSound('blip'); }
  submitLM() { this.isLMSuccess = true; setTimeout(() => this.closeModals(), 4000); this.playSound('hover'); }
  calPrevMonth() { if (this.calendarCurrentMonth) { this.calendarCurrentMonth.setMonth(this.calendarCurrentMonth.getMonth() - 1); this.calendarCurrentMonth = new Date(this.calendarCurrentMonth); this.buildCalendarMonth(); this.playSound('click'); } }
  calNextMonth() { if (this.calendarCurrentMonth) { this.calendarCurrentMonth.setMonth(this.calendarCurrentMonth.getMonth() + 1); this.calendarCurrentMonth = new Date(this.calendarCurrentMonth); this.buildCalendarMonth(); this.playSound('click'); } }
  buildCalendarMonth() {
    if (!this.calendarCurrentMonth) return; const days = [], firstDay = new Date(this.calendarCurrentMonth), startDayOfWeek = firstDay.getDay(), lastDay = new Date(this.calendarCurrentMonth.getFullYear(), this.calendarCurrentMonth.getMonth() + 1, 0), daysInMonth = lastDay.getDate(), today = new Date(); today.setHours(0,0,0,0);
    const prevMonthLastDay = new Date(this.calendarCurrentMonth.getFullYear(), this.calendarCurrentMonth.getMonth(), 0).getDate();
    for (let i = prevMonthLastDay - startDayOfWeek + 1; i <= prevMonthLastDay; i++) days.push({ day: i, type: 'other' });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(this.calendarCurrentMonth.getFullYear(), this.calendarCurrentMonth.getMonth(), d); date.setHours(0,0,0,0);
      const isPast = date < today, isSun = date.getDay() === 0, dis = isSun || isPast || date.getTime() === today.getTime() || date.getTime() === today.getTime() + 86400000;
      days.push({ day: d, type: 'current', date, disabled: dis, future: !isPast && !isSun && date.getTime() > today.getTime() + 86400000, sunday: isSun });
    }
    while (days.length < 42) days.push({ day: days.length - (daysInMonth + startDayOfWeek) + 1, type: 'other' }); this.calendarDays = days;
  }
  selectDate(day: any) { if (day.type !== 'current' || day.disabled) return; this.selectedDate = day.date; this.selectedSlot = null; this.buildSlotGrid(); this.playSound('click'); }
  buildSlotGrid() { const slots = []; for (let h = 11; h < 18; h++) { for (let m = 0; m < 60; m += 30) { if (h === 17 && m === 30) break; slots.push({h, m}); } } this.timeSlots = slots; }
  selectSlot(slot: any) { this.selectedSlot = slot; setTimeout(() => { this.schedStep = 2; }, 280); this.playSound('hover'); }
  toggleAgendaItem(label: string) { const idx = this.selectedAgendaItems.indexOf(label); if (idx > -1) this.selectedAgendaItems.splice(idx, 1); else this.selectedAgendaItems.push(label); this.playSound('click'); }
  updateSchedName(e: any) { this.schedName = e.target.value; }
  updateSchedEmail(e: any) { this.schedEmail = e.target.value; }
  updateSchedNotes(e: any) { this.schedNotes = e.target.value; }
  getAgendaSlotText() { if (!this.selectedDate || !this.selectedSlot) return '—'; return this.selectedDate.toDateString() + ' ' + this.fmt12(this.selectedSlot.h, this.selectedSlot.m); }
  getMonthYearText() { return this.calendarCurrentMonth ? this.calendarCurrentMonth.toLocaleString('default', { month: 'long', year: 'numeric' }) : ''; }
  getTimeHeaderText() { return this.selectedDate ? this.selectedDate.toDateString() : 'Select a date'; }
  goToCalendarConfirm() { if (!this.schedName || !this.schedEmail.includes('@')) { alert('Valid name/email required'); return; } this.schedStep = 3; this.confirmDateText = this.selectedDate!.toDateString(); this.confirmTimeText = this.fmt12(this.selectedSlot!.h, this.selectedSlot!.m); this.playSound('blip'); }
  openCalendarLink(type: 'google' | 'outlook') { this.schedStep = 4; this.playSound('hover'); }
  downloadIcs() { this.schedStep = 4; this.playSound('hover'); }
  fmt12(h: number, m: number) { const ampm = h >= 12 ? 'PM' : 'AM', h12 = h % 12 || 12; return h12 + ':' + (m === 0 ? '00' : m) + ' ' + ampm; }
  private fmtEndTime(h: number, m: number) { let eh = h, em = m + 30; if (em >= 60) { em -= 60; eh++; } return this.fmt12(eh, em); }
  private toUTCISO(date: Date, h: number, m: number, end = false) { const d = new Date(date); d.setHours(h, m + (end ? 30 : 0), 0, 0); return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrollY = window.scrollY, dh = this.document.documentElement.scrollHeight - window.innerHeight;
      const prog = this.document.getElementById('scroll-progress');
      if (prog) prog.style.transform = `scaleX(${dh > 0 ? scrollY/dh : 0})`;
      const btt = this.document.getElementById('btt'); if (btt) btt.classList.toggle('vis', scrollY > 500);
    }
  }
}
