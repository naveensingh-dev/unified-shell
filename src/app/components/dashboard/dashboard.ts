import { 
  Component, 
  EventEmitter, 
  Output, 
  ElementRef, 
  ViewChild, 
  OnDestroy, 
  afterNextRender,
  Inject,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-wrapper" [class.hovering]="isHovering()" [class.clicking]="isClicking()">
      
      <!-- CUSTOM CURSOR -->
      <div id="cur-dot" #curDot aria-hidden="true"></div>
      <div id="cur-ring" #curRing aria-hidden="true"></div>

      <!-- BOOT SCREEN -->
      <div id="boot" [class.gone]="bootGone()" role="status" aria-label="Loading portfolio">
        <div class="boot-inner">
          <div class="boot-logo">
            <span class="bl-ns">NS</span>
            <span class="bl-ver">v3.0.1-Neural</span>
          </div>
          <div class="boot-track"><div class="boot-bar" [style.width.%]="bootProgress()"></div></div>
          <div class="boot-pct">{{bootProgress()}}%</div>
          <div class="boot-log">
            <span *ngFor="let log of bootLogs()" class="log-line" [ngClass]="log.type">{{log.txt}}</span>
          </div>
          <div class="boot-sep"></div>
          <div class="boot-welcome">{{bootWelcomeText()}}</div>
        </div>
      </div>

      <!-- BG LAYERS -->
      <canvas id="aurora-canvas" #auroraCanvas aria-hidden="true"></canvas>
      <canvas id="trail-canvas" #trailCanvas aria-hidden="true"></canvas>
      <div class="grid-veil" aria-hidden="true"></div>
      <div class="scan-veil" aria-hidden="true"></div>
      <div class="orb orb1" aria-hidden="true"></div>
      <div class="orb orb2" aria-hidden="true"></div>
      <div class="orb orb3" aria-hidden="true"></div>
      <div class="hex-field" #hexField aria-hidden="true"></div>

      <!-- MAIN CONTAINER -->
      <div id="main" [class.visible]="mainVisible()" aria-live="polite">

        <!-- HERO -->
        <section class="hero" #heroSection>
          <div class="hero-eyebrow">
            <div class="ey-line"></div>
            <span class="ey-dot"></span>
            <span>Neural Link Active</span>
            <span class="ey-dot"></span>
            <div class="ey-line" style="transform:scaleX(-1)"></div>
          </div>

          <h1 id="name-el" aria-label="Naveen Singh" 
              (mouseenter)="isHovering.set(true)" (mouseleave)="isHovering.set(false)">
            <span class="name-r" aria-hidden="true">Naveen Singh</span>
            <span class="name-text">{{scrambleText()}}</span>
            <span class="name-b" aria-hidden="true">Naveen Singh</span>
          </h1>

          <div class="subtitle-wrap">
            <span>{{typedSubtitle()}}</span><span class="t-cur" aria-hidden="true"></span>
          </div>
        </section>

        <!-- HORIZON -->
        <div class="horizon">
          <div class="horizon-line"></div>
          <div class="horizon-center">
            <div class="horizon-diamond"></div>
            <span>Select Interface Mode</span>
            <div class="horizon-diamond"></div>
          </div>
          <div class="horizon-line"></div>
        </div>

        <!-- CARDS -->
        <div class="cards-grid">
          <div class="card-shell card-os-b" id="shell-1"
               (mouseenter)="isHovering.set(true)" (mouseleave)="isHovering.set(false)"
               (mousemove)="handleCardTilt($event, card1)"
               (mousedown)="triggerBurst($event, '#00f5ff')">
            <div class="card card-os" #card1 (click)="onSelect('os')">
              <div class="card-noise" aria-hidden="true"></div>
              <div class="card-holo" aria-hidden="true"></div>
              <div class="card-spotlight" aria-hidden="true"></div>
              <span class="card-coords" aria-hidden="true">01.OS // 48.3N</span>
              <div class="card-inner">
                <div class="card-badge"><span class="badge-dot"></span>Desktop Experience</div>
                <span class="card-icon">🖥️</span>
                <h2 class="card-title">Naveen OS</h2>
                <p class="card-desc">Advanced desktop-inspired environment with windowing system, dock, and native applications.</p>
                <ul class="card-features">
                  <li class="feat"><span class="feat-icon">⬡</span><span>Windowing & Drag-Drop</span><span class="feat-line"></span></li>
                  <li class="feat"><span class="feat-icon">⬡</span><span>Live App Ecosystem</span><span class="feat-line"></span></li>
                </ul>
                <button class="card-btn">
                  <span class="card-btn-inner">
                    <span>Launch OS</span>
                    <span class="card-btn-arrow">→</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div class="card-shell card-shell-2 card-ip-b" id="shell-2"
               (mouseenter)="isHovering.set(true)" (mouseleave)="isHovering.set(false)"
               (mousemove)="handleCardTilt($event, card2)"
               (mousedown)="triggerBurst($event, '#ff00cc')">
            <div class="card card-ip" #card2 (click)="onSelect('classic')">
              <div class="card-noise" aria-hidden="true"></div>
              <div class="card-holo" aria-hidden="true"></div>
              <div class="card-spotlight" aria-hidden="true"></div>
              <span class="card-coords" aria-hidden="true">02.IP // 22.7W</span>
              <div class="card-inner">
                <div class="card-badge"><span class="badge-dot"></span>Immersive Mode</div>
                <span class="card-icon">✨</span>
                <h2 class="card-title">Classic Mode</h2>
                <p class="card-desc">High-performance scrolling experience with advanced WebGL effects and CLI terminal suite.</p>
                <ul class="card-features">
                  <li class="feat"><span class="feat-icon">⬡</span><span>Immersive Storytelling</span><span class="feat-line"></span></li>
                  <li class="feat"><span class="feat-icon">⬡</span><span>Built-in CLI terminal</span><span class="feat-line"></span></li>
                </ul>
                <button class="card-btn">
                  <span class="card-btn-inner">
                    <span>Enter Classic</span>
                    <span class="card-btn-arrow">→</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="status-row">
          <div class="status-item"><span class="s-dot"></span><span>Systems Nominal</span></div>
          <div class="s-sep" aria-hidden="true"></div>
          <div class="status-item">Angular 21 + Signals</div>
          <div class="s-sep" aria-hidden="true"></div>
          <div class="status-item">Build: v3.0.1-Neural</div>
          <div class="s-sep" aria-hidden="true"></div>
          <div class="status-item">{{currentTime()}} UTC</div>
        </div>

        <footer class="footer">
          Neural Interface &nbsp;·&nbsp; Unified Portfolio Ecosystem
        </footer>

      </div>
    </div>
  `,
  styles: [`
    :host { 
      --void: #000208; --deep: #010a1e; --cyan: #00f5ff; --magenta: #ff00cc; --violet: #7c3aff; --gold: #ffc840; --white: #d8ecff; --dim: rgba(100,180,255,0.25); --card-bg: rgba(1,6,20,0.88); --font-head: 'Orbitron', monospace; --font-mono: 'JetBrains Mono', monospace;
      display: block; height: 100vh; width: 100%; overflow: hidden;
    }
    @property --angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }

    .dashboard-wrapper { 
      background: var(--void); color: var(--white); font-family: 'JetBrains Mono', monospace;
      height: 100vh; width: 100%; overflow: hidden; position: relative;
    }
    .dashboard-wrapper.hovering { cursor: none; }

    #cur-dot { position:fixed; width:8px; height:8px; background:var(--cyan); border-radius:50%; pointer-events:none; z-index:10000; transform:translate(-50%,-50%); box-shadow: 0 0 12px var(--cyan), 0 0 30px rgba(0,245,255,0.4); mix-blend-mode: screen; opacity: 0; }
    #cur-ring { position:fixed; width:32px; height:32px; border:1px solid rgba(0,245,255,0.5); border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition: width .3s cubic-bezier(.25,1,.25,1), height .3s cubic-bezier(.25,1,.25,1), border-color .3s; opacity: 0; }
    .hovering #cur-dot { width:14px; height:14px; background:var(--magenta); box-shadow:0 0 20px var(--magenta),0 0 50px rgba(255,0,204,0.4); opacity: 1; }
    .hovering #cur-ring { width:52px; height:52px; border-color:rgba(255,0,204,0.5); opacity: 1; }
    .clicking #cur-dot { width:5px; height:5px; }
    .clicking #cur-ring { width:20px; height:20px; }

    #boot { position:fixed; inset:0; z-index:9000; background: var(--void); display:flex; align-items:center; justify-content:center; }
    #boot.gone { opacity:0; visibility:hidden; pointer-events:none; transition: opacity .8s ease, visibility .8s ease; }
    .boot-inner { width: min(560px,90vw); }
    .boot-logo { display:flex; align-items:baseline; gap:16px; margin-bottom:32px; }
    .bl-ns { font-family: 'Orbitron', monospace; font-size: 48px; font-weight:900; background: linear-gradient(135deg, var(--cyan), var(--violet)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; filter: drop-shadow(0 0 20px rgba(0,245,255,0.5)); }
    .bl-ver { font-size:12px; color:rgba(0,245,255,0.5); letter-spacing:.3em; }
    .boot-track { height:2px; background:rgba(0,245,255,0.1); border-radius:2px; margin-bottom:8px; overflow:hidden; }
    .boot-bar { height:100%; background: linear-gradient(90deg, var(--violet), var(--cyan)); box-shadow:0 0 12px var(--cyan); transition: width .05s linear; }
    .boot-pct { font-size:10px; color:rgba(0,245,255,0.4); letter-spacing:.2em; margin-bottom:24px; text-align:right; }
    .boot-log { font-size:11px; line-height:2.2; color:rgba(100,180,255,0.6); min-height:110px; }
    .log-line { display:block; }
    .log-line.ok::before { content:'✓ '; color:var(--cyan); }
    .log-line.run::before { content:'» '; color:var(--gold); }
    .log-line.alert::before { content:'! '; color:var(--magenta); }
    .boot-sep { height:1px; background:rgba(0,245,255,0.1); margin:20px 0; }
    .boot-welcome { font-size:11px; color:rgba(0,245,255,0.3); letter-spacing:.25em; text-transform:uppercase; min-height: 1.2em; }

    #aurora-canvas, #trail-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }
    .grid-veil { position:fixed; inset:0; z-index:2; pointer-events:none; background-image: linear-gradient(rgba(0,245,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,.025) 1px, transparent 1px); background-size:80px 80px; mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%); }
    .scan-veil { position:fixed; inset:0; z-index:3; pointer-events:none; background: repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 6px); animation: scan-shift 12s linear infinite; }
    @keyframes scan-shift { from{background-position:0 0} to{background-position:0 200px} }
    .orb { position:fixed; border-radius:50%; pointer-events:none; z-index:1; filter:blur(80px); opacity:.18; animation:float-orb 8s ease-in-out infinite; }
    .orb1 { width:600px;height:600px; background:radial-gradient(var(--violet),transparent 70%); top:-200px;left:-200px; animation-delay:0s; }
    .orb2 { width:500px;height:500px; background:radial-gradient(var(--cyan),transparent 70%); bottom:-150px;right:-100px; animation-delay:-3s; }
    .orb3 { width:400px;height:400px; background:radial-gradient(var(--magenta),transparent 70%); top:40%;left:60%; animation-delay:-5s; }
    @keyframes float-orb { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(40px,-30px) scale(1.08); } 66% { transform:translate(-20px,20px) scale(0.94); } }
    .hex-field { position:fixed; inset:0; z-index:2; pointer-events:none; overflow:hidden; }

    #main { position:relative; z-index:100; height: 100vh; width: 100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 20px; opacity:0; transform:scale(.96); transition: opacity 1.2s cubic-bezier(.16,1,.3,1), transform 1.2s cubic-bezier(.16,1,.3,1); }
    #main.visible { opacity:1; transform:scale(1); }

    .hero { text-align:center; margin-bottom:40px; position:relative; }
    .hero-eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:10px; letter-spacing:.35em; text-transform:uppercase; color:rgba(0,245,255,.5); margin-bottom:24px; }
    .ey-dot { width:6px; height:6px; border-radius:50%; background:var(--cyan); box-shadow:0 0 10px var(--cyan); animation: pulse-dot 1.8s ease-in-out infinite; }
    .ey-line { width:30px; height:1px; background:linear-gradient(90deg,transparent,rgba(0,245,255,.4)); }
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
    #name-el { font-family: 'Orbitron', monospace; font-size: clamp(44px, 9.5vw, 100px); font-weight:900; letter-spacing:-.03em; line-height:1; position:relative; margin:0; }
    #name-el .name-text { background: linear-gradient(135deg, #a8d4ff 0%, #5b9fff 25%, var(--violet) 55%, var(--magenta) 80%, var(--cyan) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; filter:drop-shadow(0 0 30px rgba(124,58,255,.4)); display:inline-block; transition:filter .3s ease; }
    #name-el:hover .name-text { filter:drop-shadow(0 0 50px rgba(0,245,255,.5)) drop-shadow(0 0 80px rgba(255,0,204,.3)); animation: name-breathe 2s ease-in-out infinite; }
    @keyframes name-breathe { 0%,100%{filter:drop-shadow(0 0 40px rgba(0,245,255,.4)) drop-shadow(0 0 60px rgba(255,0,204,.2))} 50%{filter:drop-shadow(0 0 70px rgba(0,245,255,.7)) drop-shadow(0 0 100px rgba(255,0,204,.4))} }
    .name-r, .name-b { position:absolute; top:0; left:0; right:0; font-family: 'Orbitron', monospace; font-size: inherit; font-weight:900; pointer-events:none; opacity:0; -webkit-background-clip:text; -webkit-text-fill-color:transparent; transition:opacity .3s ease; }
    .name-r { background:#ff003c; transform:translate(-3px,0); }
    .name-b { background:#00f5ff; transform:translate(3px,0); }
    #name-el:hover .name-r, #name-el:hover .name-b { opacity:.35; }
    .subtitle-wrap { margin-top:18px; font-size:clamp(11px,1.5vw,14px); color:rgba(100,180,255,.5); letter-spacing:.12em; }
    .t-cur { display:inline-block; width:9px; height:14px; background:var(--cyan); margin-left:4px; vertical-align:middle; animation:blink 1s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .horizon { display:flex; align-items:center; gap:16px; margin-bottom:40px; width:100%; max-width:900px; }
    .horizon-line { flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(0,245,255,.2),transparent); }
    .horizon-center { display:flex; align-items:center; gap:10px; font-size:9px; letter-spacing:.35em; text-transform:uppercase; color:rgba(0,245,255,.3); }
    .horizon-diamond { width:8px; height:8px; background:var(--cyan); transform:rotate(45deg); box-shadow:0 0 10px var(--cyan); animation:diamond-pulse 2s ease-in-out infinite; }
    @keyframes diamond-pulse { 0%,100%{box-shadow:0 0 10px var(--cyan)} 50%{box-shadow:0 0 25px var(--cyan),0 0 50px rgba(0,245,255,.3)} }

    .cards-grid { display:grid; grid-template-columns:repeat(2, minmax(0,480px)); gap:28px; width:100%; max-width:1000px; }
    .card-shell { position:relative; border-radius:24px; padding:1.5px; background:conic-gradient(from var(--angle), rgba(0,245,255,0) 0%, rgba(0,245,255,0) 65%, rgba(0,245,255,0.9) 75%, rgba(255,0,204,0.9) 85%, rgba(124,58,255,0.8) 90%, rgba(0,245,255,0) 100%); animation: spin-border 3s linear infinite; box-shadow: 0 0 40px rgba(0,245,255,.08); transition: box-shadow .4s ease; }
    .card-shell.card-shell-2 { animation-delay:-1.5s; }
    .card-shell:hover { box-shadow:0 0 80px rgba(0,245,255,.2), 0 40px 100px rgba(0,0,0,.7); }
    @keyframes spin-border { to { --angle:360deg; } }
    .card { background: var(--card-bg); border-radius:22px; padding:40px 36px 36px; position:relative; overflow:hidden; transition: transform .4s cubic-bezier(.25,1,.25,1); transform-style:preserve-3d; height:100%; cursor: pointer; }
    .card-holo { position:absolute; inset:0; border-radius:22px; pointer-events:none; z-index:1; opacity:0; background: linear-gradient(105deg, rgba(255,0,128,.07) 0%, rgba(255,200,0,.05) 15%, rgba(0,255,128,.07) 30%, rgba(0,200,255,.05) 45%, rgba(100,0,255,.07) 60%, rgba(255,0,200,.05) 75%, rgba(255,150,0,.07) 90%, rgba(0,255,200,.05) 100%); background-size:300% 300%; transition:opacity .4s ease; mix-blend-mode:screen; }
    .card:hover .card-holo { opacity:1; }
    .card-noise { position:absolute; inset:0; border-radius:22px; pointer-events:none; z-index:0; opacity:.04; background:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:200px; }
    .card-spotlight { position:absolute; width:300px; height:300px; border-radius:50%; pointer-events:none; z-index:0; background:radial-gradient(circle, rgba(0,245,255,.08) 0%, transparent 70%); transform:translate(-50%,-50%); transition:left .08s,top .08s; opacity:0; transition:opacity .3s ease; }
    .card:hover .card-spotlight { opacity:1; }
    .card-inner { position:relative; z-index:2; }
    .card-coords { position:absolute; top:18px; right:20px; font-size:9px; letter-spacing:.2em; color:rgba(0,245,255,.2); transition:color .3s; }
    .card:hover .card-coords { color:rgba(0,245,255,.5); }
    .card-badge { display:inline-flex; align-items:center; gap:8px; padding:5px 14px; border-radius:100px; font-size:9px; letter-spacing:.3em; text-transform:uppercase; margin-bottom:28px; border:1px solid; transition:box-shadow .3s ease; }
    .card-os-b .card-badge { color:var(--cyan); border-color:rgba(0,245,255,.25); background:rgba(0,245,255,.06); }
    .card-ip-b .card-badge { color:var(--magenta); border-color:rgba(255,0,204,.25); background:rgba(255,0,204,.06); }
    .card-icon { font-size:56px; display:block; margin-bottom:22px; line-height:1; transition:transform .4s cubic-bezier(.34,1.56,.64,1), filter .4s ease; }
    .card-os-b:hover .card-icon { transform:translateY(-6px) scale(1.1) rotate(-5deg); filter:drop-shadow(0 8px 30px rgba(0,245,255,.5)); }
    .card-ip-b:hover .card-icon { transform:translateY(-6px) scale(1.1) rotate(5deg); filter:drop-shadow(0 8px 30px rgba(255,0,204,.6)) drop-shadow(0 0 40px rgba(255,200,0,.3)); }
    .card-title { font-family: 'Orbitron', monospace; font-size:clamp(22px,3vw,30px); font-weight:700; letter-spacing:-.01em; margin-bottom:12px; line-height:1.1; transition:color .3s ease; }
    .card-os-b:hover .card-title { color:var(--cyan); text-shadow:0 0 30px rgba(0,245,255,.4); }
    .card-ip-b:hover .card-title { color:var(--magenta); text-shadow:0 0 30px rgba(255,0,204,.4); }
    .card-desc { font-size:12px; line-height:1.9; color:rgba(150,200,255,.5); margin-bottom:28px; }
    .card-features { display:flex; flex-direction:column; gap:8px; margin-bottom:32px; list-style: none; }
    .feat { display:flex; align-items:center; gap:10px; font-size:10px; letter-spacing:.08em; color:rgba(120,170,255,.45); }
    .feat-icon { font-size:12px; opacity:.7; flex-shrink:0; }
    .feat-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(0,245,255,.12),transparent); }
    .card-btn { position:relative; width:100%; padding:15px 24px; border:none; border-radius:12px; font-family: 'Orbitron', monospace; font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; overflow:hidden; color:#fff; transition:transform .2s ease, box-shadow .2s ease; }
    .card-btn-inner { position:relative; z-index:1; display:flex; align-items:center; justify-content:center; gap:12px; }
    .card-btn:hover { transform:translateY(-2px); }
    .card-os-b .card-btn { background:linear-gradient(135deg,#0a3fa0,#1a6fff,#4ab8ff); box-shadow:0 8px 30px rgba(26,111,255,.35); }
    .card-ip-b .card-btn { background:linear-gradient(135deg,#8b0060,#d400a8,#ff4dd6); box-shadow:0 8px 30px rgba(212,0,168,.35); }

    .status-row { display:flex; align-items:center; margin-top:48px; flex-wrap:wrap; justify-content:center; border:1px solid rgba(0,245,255,.08); border-radius:100px; padding:10px 24px; gap:20px; background:rgba(0,10,30,.5); backdrop-filter:blur(16px); }
    .status-item { display:flex; align-items:center; gap:8px; font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:rgba(0,245,255,.35); }
    .s-dot { width:5px; height:5px; border-radius:50%; background:#22c55e; box-shadow:0 0 8px #22c55e; }
    .s-sep { width:1px; height:14px; background:rgba(0,245,255,.1); }
    .footer { margin-top:18px; font-size:9px; letter-spacing:.25em; text-transform:uppercase; color:rgba(0,245,255,.18); text-align:center; }
    .footer em { color:rgba(0,245,255,.45); font-style:normal; }

    ::ng-deep .burst-particle { position:fixed; width:5px; height:5px; border-radius:50%; pointer-events:none; z-index:9500; animation:burst-out .8s ease-out forwards; }
    @keyframes burst-out { 0% { transform:translate(0,0) scale(1); opacity:1; } 100% { transform:translate(var(--bx),var(--by)) scale(0); opacity:0; } }
    @keyframes shockwave { to { width:160px; height:160px; opacity:0; border-width:0; } }

    @media(max-width:720px){
      .cards-grid { grid-template-columns:1fr; max-width:440px; }
      .status-row { flex-direction:column; border-radius:16px; padding: 15px; }
      .s-sep { display:none; }
      #main { overflow-y: auto; }
    }
  `]
})
export class DashboardComponent implements OnDestroy {
  @Output() select = new EventEmitter<'os' | 'classic'>();

  @ViewChild('curDot') curDot!: ElementRef<HTMLDivElement>;
  @ViewChild('curRing') curRing!: ElementRef<HTMLDivElement>;
  @ViewChild('auroraCanvas') auroraCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trailCanvas') trailCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hexField') hexField!: ElementRef<HTMLDivElement>;
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;

  bootProgress = signal(0);
  bootLogs = signal<{txt: string, type: string}[]>([]);
  bootWelcomeText = signal('');
  bootGone = signal(false);
  mainVisible = signal(false);
  currentTime = signal('--:--:--');
  scrambleText = signal('Naveen Singh');
  typedSubtitle = signal('');
  isHovering = signal(false);
  isClicking = signal(false);

  private mx = 0;
  private my = 0;
  private rx = 0;
  private ry = 0;
  private trailPts: any[] = [];
  private auroraAnimationId?: number;
  private cursorAnimationId?: number;
  private parallaxListenerRef?: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.mx = window.innerWidth / 2;
        this.my = window.innerHeight / 2;
        this.rx = this.mx;
        this.ry = this.my;

        this.runBootSequence();
        this.initEventListeners();
        this.initCanvases();
        this.initHexField();
        this.startClock();
        this.animateCursor();
      });
    }
  }

  private mouseMoveHandler = (e: MouseEvent) => {
    this.mx = e.clientX;
    this.my = e.clientY;
  };

  private mouseDownHandler = () => this.isClicking.set(true);
  private mouseUpHandler = () => this.isClicking.set(false);

  private initEventListeners() {
    this.document.addEventListener('mousemove', this.mouseMoveHandler);
    this.document.addEventListener('mousedown', this.mouseDownHandler);
    this.document.addEventListener('mouseup', this.mouseUpHandler);
  }

  private runBootSequence() {
    const BOOT_LINES = [
      {t:'run',  d:0,    txt:'NEURAL KERNEL v3.0.1 — INITIALIZING UNIFIED ECOSYSTEM'},
      {t:'ok',   d:100,  txt:'Naveen OS Engine: SignalStore & Bento Mode READY'},
      {t:'ok',   d:200,  txt:'Classic Portfolio: High-Performance Scroll Architecture READY'},
      {t:'run',  d:300,  txt:'Syncing shared assets and internationalization maps...'},
      {t:'ok',   d:400,  txt:'WebGL & GSAP Interaction layers: ESTABLISHED'},
      {t:'ok',   d:500,  txt:'Portfolios Decrypted: Full system integrity verified.'},
      {t:'run',  d:600,  txt:'Calibrating Multi-App Dynamic Bootstrapping...'},
      {t:'ok',   d:700,  txt:'Neural Link Stable. Accessing Naveen Singh Workspace.'},
    ];

    const PROGRESS_STEPS = [
      {at:50,val:18},{at:150,val:35},{at:250,val:52},
      {at:350,val:67},{at:450,val:78},{at:550,val:89},{at:650,val:95},{at:750,val:100}
    ];

    PROGRESS_STEPS.forEach(s => setTimeout(() => this.bootProgress.set(s.val), s.at));
    BOOT_LINES.forEach(line => setTimeout(() => {
      this.bootLogs.update(logs => [...logs, { txt: line.txt, type: line.t }]);
    }, line.d));

    setTimeout(() => {
      const text = 'WELCOME TO THE ECOSYSTEM, USER.';
      let i = 0;
      const iv = setInterval(() => {
        if(i <= text.length) { this.bootWelcomeText.set(text.slice(0,i)); i++; }
        else clearInterval(iv);
      }, 10);
    }, 800);

    setTimeout(() => {
      this.bootGone.set(true);
      setTimeout(() => this.launchMain(), 300);
    }, 1200);
  }

  private launchMain() {
    this.mainVisible.set(true);
    setTimeout(() => this.scramble('Naveen Singh'), 300);
    setTimeout(() => this.typeSubtitle('Unified Portfolio Ecosystem'), 800);
    this.initParallax();
  }

  private scramble(finalText: string) {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}';
    let frame = 0;
    const duration = 1600;
    const totalFrames = duration / 40;
    const iv = setInterval(() => {
      const progress = frame / totalFrames;
      const text = finalText.split('').map((ch, i) => {
        if(ch === ' ') return ' ';
        if(i / finalText.length < progress) return ch;
        return CHARS[Math.floor(Math.random()*CHARS.length)];
      }).join('');
      this.scrambleText.set(text);
      if(frame++ >= totalFrames){ this.scrambleText.set(finalText); clearInterval(iv); }
    }, 40);
  }

  private typeSubtitle(text: string) {
    let i = 0;
    const iv = setInterval(() => {
      if(i <= text.length) { this.typedSubtitle.set(text.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 48);
  }

  private initCanvases() {
    const aCtx = this.auroraCanvas.nativeElement.getContext('2d')!;
    const tCtx = this.trailCanvas.nativeElement.getContext('2d')!;
    let W = window.innerWidth, H = window.innerHeight;

    const resize = () => {
      W = this.auroraCanvas.nativeElement.width = this.trailCanvas.nativeElement.width = window.innerWidth;
      H = this.auroraCanvas.nativeElement.height = this.trailCanvas.nativeElement.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const drawAurora = (t: number) => {
      aCtx.clearRect(0,0,W,H);
      const base = aCtx.createLinearGradient(0,0,W,H);
      base.addColorStop(0, '#000410'); base.addColorStop(1, '#000208');
      aCtx.fillStyle = base; aCtx.fillRect(0,0,W,H);

      const blob = (cx:number,cy:number,rx:number,ry:number,color:string,alpha:number) => {
        const g = aCtx.createRadialGradient(cx,cy,0,cx,cy,Math.max(rx,ry));
        g.addColorStop(0, color.replace(')',`,${alpha})`).replace('rgb','rgba'));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        aCtx.save(); aCtx.scale(1, ry/rx); aCtx.fillStyle = g; aCtx.globalCompositeOperation = 'screen';
        aCtx.beginPath(); aCtx.arc(cx, cy*rx/ry, rx, 0, Math.PI*2); aCtx.fill(); aCtx.restore();
      };

      blob(W*0.2 + Math.sin(t*0.4)*W*0.12, H*0.25 + Math.cos(t*0.3)*H*0.1, W*0.38, H*0.35, 'rgb(0,180,255)', 0.12);
      blob(W*0.55 + Math.cos(t*0.25)*W*0.15, H*0.5 + Math.sin(t*0.35)*H*0.12, W*0.42, H*0.4, 'rgb(100,0,255)', 0.1);
      blob(W*0.82 + Math.sin(t*0.5)*W*0.08, H*0.6 + Math.cos(t*0.45)*H*0.1, W*0.35, H*0.35, 'rgb(220,0,160)', 0.09);
      
      this.drawTrail(tCtx, W, H);
      this.auroraAnimationId = requestAnimationFrame((t2) => drawAurora(t2/1000));
    };
    drawAurora(0);
  }

  private drawTrail(ctx: CanvasRenderingContext2D, W: number, H: number) {
    this.trailPts.push({ x: this.mx, y: this.my, a: 1, r: 4+Math.random()*3 });
    if(this.trailPts.length > 40) this.trailPts.shift();

    ctx.clearRect(0,0,W,H);
    this.trailPts.forEach((p, i) => {
      const progress = i / this.trailPts.length;
      p.a *= 0.92; if(p.r > 1) p.r -= 0.08;
      const hue = 180 + progress * 120;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${p.a * 0.6})`; ctx.fill();
      const grd = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
      grd.addColorStop(0,`hsla(${hue},100%,80%,${p.a*0.15})`); grd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2); ctx.fill();
    });
  }

  private animateCursor() {
    const step = () => {
      if (!this.curDot) return;
      this.curDot.nativeElement.style.left = this.mx + 'px';
      this.curDot.nativeElement.style.top = this.my + 'px';
      this.rx += (this.mx - this.rx) * 0.14;
      this.ry += (this.my - this.ry) * 0.14;
      this.curRing.nativeElement.style.left = this.rx + 'px';
      this.curRing.nativeElement.style.top = this.ry + 'px';
      this.cursorAnimationId = requestAnimationFrame(step);
    };
    step();
  }

  private initHexField() {
    const hexSVGs = [
      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polygon points="12,2 22,12 12,22 2,12" stroke="rgba(0,245,255,0.3)" stroke-width="1" fill="none"/></svg>`,
      `<svg width="30" height="30" viewBox="0 0 30 30" fill="none"><polygon points="15,2 27,8.5 27,21.5 15,28 3,21.5 3,8.5" stroke="rgba(124,58,255,0.3)" stroke-width="1" fill="none"/></svg>`,
    ];

    for(let i=0; i<16; i++) {
      const div = this.document.createElement('div');
      div.className = 'hex';
      div.innerHTML = hexSVGs[i%hexSVGs.length];
      div.style.cssText = `position:absolute; left:${Math.random()*100}%; top:${60+Math.random()*40}%; animation-delay:${Math.random()*10}s; animation-duration:${10+Math.random()*8}s;`;
      this.hexField.nativeElement.appendChild(div);
    }
  }

  private initParallax() {
    this.parallaxListenerRef = (e: MouseEvent) => {
      const cx = window.innerWidth/2, cy = window.innerHeight/2;
      const dx = (e.clientX-cx)/cx, dy = (e.clientY-cy)/cy;
      if (this.heroSection) this.heroSection.nativeElement.style.transform = `translate(${dx*8}px, ${dy*5}px)`;
    };
    this.document.addEventListener('mousemove', this.parallaxListenerRef);
  }

  private startClock() {
    const update = () => {
      const n = new Date();
      const time = [n.getUTCHours(), n.getUTCMinutes(), n.getUTCSeconds()]
        .map(v => String(v).padStart(2, '0')).join(':');
      this.currentTime.set(time);
    };
    setTimeout(update, 0);
    setInterval(update, 1000);
  }

  handleCardTilt(e: MouseEvent, card: HTMLElement) {
    const spotlight = card.querySelector('.card-spotlight') as HTMLElement;
    const holo = card.querySelector('.card-holo') as HTMLElement;
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / (r.width/2), dy = (e.clientY - cy) / (r.height/2);

    card.style.transform = `perspective(800px) rotateX(${-dy*7}deg) rotateY(${dx*7}deg) translateZ(8px)`;
    const lx = e.clientX - r.left, ly = e.clientY - r.top;
    if (spotlight) { spotlight.style.left = lx+'px'; spotlight.style.top = ly+'px'; }
    if (holo) {
      const px = ((lx/r.width) * 100).toFixed(1), py = ((ly/r.height) * 100).toFixed(1);
      holo.style.backgroundPosition = `${px}% ${py}%`;
      holo.style.transform = `rotate(${dx*8}deg) scale(1.05)`;
    }
    card.addEventListener('mouseleave', () => { card.style.transform = ''; if (holo) holo.style.transform = ''; }, { once: true });
  }

  triggerBurst(e: MouseEvent, color: string) {
    const x = e.clientX, y = e.clientY;
    for(let i=0; i<28; i++) {
      const p = this.document.createElement('div');
      p.className = 'burst-particle';
      const angle = (i/28)*Math.PI*2 + Math.random()*0.5;
      const dist = 60 + Math.random()*100;
      p.style.cssText = `left:${x}px; top:${y}px; background:${color}; box-shadow:0 0 6px ${color}; width:${3+Math.random()*4}px; height:${3+Math.random()*4}px; --bx:${Math.cos(angle)*dist}px; --by:${Math.sin(angle)*dist}px;`;
      this.document.body.appendChild(p);
      setTimeout(() => p.remove(), 850);
    }
  }

  onSelect(mode: 'os' | 'classic') {
    this.isHovering.set(false);
    this.select.emit(mode);
  }

  ngOnDestroy() {
    // KILL ALL ANIMATIONS
    if (this.auroraAnimationId) cancelAnimationFrame(this.auroraAnimationId);
    if (this.cursorAnimationId) cancelAnimationFrame(this.cursorAnimationId);
    
    // DETACH ALL LISTENERS (Unifying parallax cleanup)
    this.document.removeEventListener('mousemove', this.mouseMoveHandler);
    if (this.parallaxListenerRef) this.document.removeEventListener('mousemove', this.parallaxListenerRef);
    this.document.removeEventListener('mousedown', this.mouseDownHandler);
    this.document.removeEventListener('mouseup', this.mouseUpHandler);

    // PHYSICAL DOM REMOVAL
    if (this.curDot) this.curDot.nativeElement.remove();
    if (this.curRing) this.curRing.nativeElement.remove();
  }
}
