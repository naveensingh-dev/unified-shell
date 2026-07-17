import { 
  Component, 
  signal, 
  computed,
  PLATFORM_ID, 
  EnvironmentInjector,
  OnInit,
  ViewChild,
  ViewContainerRef,
  createEnvironmentInjector,
  ComponentRef,
  OnDestroy,
  Inject,
  inject,
  runInInjectionContext,
  HostListener
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard';
import { NaveenAiEngineService } from '@os-app/services/naveen-ai-engine.service';

// ----------------------------------------------------
// TACTILE WEB AUDIO SYNTHESIZER
// ----------------------------------------------------
class CyberAudioSynth {
  private ctx: AudioContext | null = null;
  
  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  playClick(pitch = 800, dur = 0.05) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch (e) {}
  }

  playSwoosh() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  playSelect() {
    this.playClick(1000, 0.06);
    setTimeout(() => this.playClick(1300, 0.1), 50);
  }

  playHum() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }
}

const audioSynth = new CyberAudioSynth();

@Component({
  selector: 'app-shell-root',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    <div class="shell-container" [class.dashboard-mode]="view() === 'dashboard'">
      
      @if (view() === 'dashboard') {
        <app-dashboard (select)="onExperienceSelect($event)"></app-dashboard>
      }

      <div id="portfolio-container" [hidden]="view() === 'dashboard'">
        <ng-container #portfolioHost></ng-container>
      </div>

      <!-- FLOATING HUD switcher / EXIT OVERLAY -->
      <div class="exit-overlay">
        @if (view() !== 'dashboard') {
          <button class="exit-btn" (click)="exitToDashboard()">
            <span class="exit-icon">↩</span>
            <span class="exit-text">Exit to Dashboard</span>
          </button>
        }
        
        <!-- TELEMETRY HUD -->
        @if (showTelemetry()) {
          <div class="telemetry-hud">
            <div class="tel-row"><span class="tel-label">FPS:</span> <span class="tel-val">{{fps()}}</span></div>
            <div class="tel-row"><span class="tel-label">LATENCY:</span> <span class="tel-val">{{latency()}}ms</span></div>
            <div class="tel-row"><span class="tel-label">DOM NODES:</span> <span class="tel-val">{{domNodes()}}</span></div>
            <div class="tel-row"><span class="tel-label">SYSTEM:</span> <span class="tel-val status-ok">{{view().toUpperCase()}}</span></div>
          </div>
        }
      </div>

      <!-- COMMAND PALETTE (CMD+K / ALT+K) -->
      @if (isCommandBarOpen()) {
        <div class="cmd-overlay" (click)="closeCommandBar()">
          <div class="cmd-box" (click)="$event.stopPropagation()">
            <div class="cmd-header">
              <span class="cmd-prompt">❯</span>
              <input #cmdInput type="text" class="cmd-input" placeholder="Type a command or query NaveenAI..." 
                     [value]="cmdFilter()" (input)="onCmdInput($event)" (keydown)="onCmdKeydown($event)"/>
              <span class="cmd-badge">ESC</span>
            </div>
            
            @if (isSandboxActive()) {
              <!-- SANDBOX IDE VIEW -->
              <div class="sandbox-ide">
                <div class="sb-topbar">
                  <span class="sb-file">📁 {{sandboxChallenges[currentChallengeIndex()].title}}</span>
                  <div class="sb-actions">
                    <button class="sb-btn sb-compile" style="background: rgba(0,245,255,0.15); color: #00f5ff" (click)="nextChallenge()">Next Challenge ❯</button>
                    <button class="sb-btn sb-compile" (click)="runManualCompile()">Manual Compile</button>
                    <button class="sb-btn sb-agent" [class.running]="sbAgentRunning()" (click)="runAgentDebug()">Activate Agent</button>
                  </div>
                </div>
                <div class="sb-editor">
                  <pre><code class="sb-code">{{sandboxCode()}}</code></pre>
                </div>
                <div class="sb-console">
                  <div class="sb-console-header">Console Output Logs</div>
                  <div class="sb-console-body">
                    @for (log of sandboxLogs(); track log) {
                      <div class="sb-log-line" [class.err]="log.includes('ERROR') || log.includes('warning') || log.includes('Vulnerability') || log.includes('leak') || log.includes('UNSAFE')" [class.ok]="log.includes('SUCCESS')">{{log}}</div>
                    }
                  </div>
                </div>
                <button class="ai-clear-btn" style="margin-top: 4px;" (click)="closeSandbox()">Return to Terminal</button>
              </div>
            } @else if (aiLoading() || aiResponse() || aiLogs().length > 0) {
              <!-- AI CHAT TERMINAL INTERFACE -->
              <div class="ai-terminal">
                <div class="ai-logs">
                  @for (log of aiLogs(); track log) {
                    <div class="ai-log-line">{{log}}</div>
                  }
                  @if (aiLoading()) {
                    <div class="ai-log-line loading-dots">Thinking</div>
                  }
                </div>
                @if (aiResponse()) {
                  <div class="ai-answer-box">
                    <div class="ai-badge">🤖 NaveenAI RAG Response</div>
                    <div class="ai-text" [innerHTML]="aiResponse()"></div>
                    <button class="ai-clear-btn" (click)="clearAIState()">Clear & Return</button>
                  </div>
                }
              </div>
            } @else {
              <!-- STANDARD COMMAND RESULTS -->
              <div class="cmd-results">
                @for (item of filteredCommands(); track item.id; let idx = $index) {
                  <div class="cmd-item" [class.active]="idx === activeCmdIndex()" 
                       (mouseenter)="onCmdHover(idx)" (click)="executeCommand(item)">
                    <span class="cmd-icon">{{item.icon}}</span>
                    <div class="cmd-details">
                      <span class="cmd-name">{{item.name}}</span>
                      <span class="cmd-desc">{{item.desc}}</span>
                    </div>
                    @if (item.shortcut) {
                      <span class="cmd-shortcut">{{item.shortcut}}</span>
                    }
                  </div>
                }
                
                @if (cmdFilter()) {
                  <div class="cmd-item ai-suggest" [class.active]="activeCmdIndex() === filteredCommands().length"
                       (mouseenter)="onCmdHover(filteredCommands().length)" (click)="askAI()">
                    <span class="cmd-icon">🤖</span>
                    <div class="cmd-details">
                      <span class="cmd-name" style="color: #ff00cc">Ask NaveenAI Engine</span>
                      <span class="cmd-desc">Query the semantic RAG database for: "{{cmdFilter()}}"</span>
                    </div>
                    <span class="cmd-shortcut">ENTER</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .shell-container { width: 100%; position: relative; background: #000; }
    .dashboard-mode { height: 100vh; overflow: hidden; background: #000208; }
    
    #portfolio-container { width: 100%; }

    .exit-overlay {
      position: fixed; bottom: 20px; left: 20px; z-index: 2000000;
      display: flex; flex-direction: column; gap: 12px;
    }
    .exit-btn {
      background: rgba(10, 10, 20, 0.7); backdrop-filter: blur(12px);
      border: 1px solid rgba(124, 58, 255, 0.4); border-radius: 12px;
      color: #fff; cursor: pointer; padding: 12px 24px; display: flex; align-items: center;
      gap: 12px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
      font-size: 13px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    }
    .exit-icon { font-size: 18px; line-height: 1; color: #7c3aff; }
    .exit-btn:hover { 
      border-color: #00f5ff; 
      box-shadow: 0 0 25px rgba(0, 245, 255, 0.4); 
      transform: translateY(-2px);
    }

    /* TELEMETRY HUD */
    .telemetry-hud {
      background: rgba(5, 5, 10, 0.8); backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 245, 255, 0.25); border-radius: 12px;
      padding: 12px 16px; width: 220px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.6);
      font-family: 'JetBrains Mono', monospace; font-size: 11px;
      display: flex; flex-direction: column; gap: 6px;
    }
    .tel-row { display: flex; justify-content: space-between; align-items: center; }
    .tel-label { color: rgba(255,255,255,0.4); letter-spacing: 0.05em; }
    .tel-val { color: #00f5ff; font-weight: bold; text-shadow: 0 0 8px rgba(0,245,255,0.4); }
    .status-ok { color: #ff00cc; text-shadow: 0 0 8px rgba(255,0,204,0.4); }

    /* COMMAND BAR OVERLAY */
    .cmd-overlay {
      position: fixed; inset: 0; background: rgba(0, 1, 5, 0.85); backdrop-filter: blur(16px);
      z-index: 3000000; display: flex; justify-content: center; align-items: flex-start;
      padding-top: 15vh;
    }
    .cmd-box {
      width: min(640px, 90vw); background: rgba(10, 15, 28, 0.95);
      border: 1px solid rgba(124, 58, 255, 0.4); border-radius: 16px;
      box-shadow: 0 30px 100px rgba(0,0,0,0.9), 0 0 60px rgba(124, 58, 255, 0.15);
      overflow: hidden; animation: cmd-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes cmd-slide-in {
      from { transform: translateY(-20px) scale(0.98); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    .cmd-header {
      display: flex; align-items: center; gap: 16px; padding: 18px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .cmd-prompt { font-size: 16px; color: #7c3aff; font-weight: bold; }
    .cmd-input {
      flex: 1; background: transparent; border: none; outline: none;
      color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 15px;
    }
    .cmd-input::placeholder { color: rgba(255,255,255,0.3); }
    .cmd-badge {
      font-size: 9px; padding: 3px 6px; border-radius: 4px;
      background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.4);
      font-family: inherit; font-weight: bold; border: 1px solid rgba(255,255,255,0.1);
    }
    .cmd-results {
      max-height: 380px; overflow-y: auto; padding: 12px;
      display: flex; flex-direction: column; gap: 4px;
    }
    .cmd-item {
      display: flex; align-items: center; gap: 16px; padding: 12px 16px;
      border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    .cmd-item.active, .cmd-item:hover {
      background: rgba(124, 58, 255, 0.15);
      border-color: rgba(0, 245, 255, 0.3);
    }
    .cmd-icon { font-size: 20px; line-height: 1; }
    .cmd-details { display: flex; flex-direction: column; flex: 1; }
    .cmd-name { font-size: 13px; font-weight: 700; color: #fff; font-family: 'Orbitron', monospace; }
    .cmd-desc { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
    .cmd-shortcut {
      font-size: 9px; padding: 3px 8px; border-radius: 6px;
      background: rgba(0, 245, 255, 0.1); color: #00f5ff;
      border: 1px solid rgba(0,245,255,0.2); font-family: inherit;
    }
    .cmd-no-results {
      padding: 32px; text-align: center; color: rgba(255,255,255,0.3);
      font-size: 13px;
    }

    /* AI TERMINAL AND RESPONSES */
    .ai-terminal {
      background: #01040f; padding: 24px; border-top: 1px solid rgba(255,255,255,0.06);
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      display: flex; flex-direction: column; gap: 16px;
    }
    .ai-logs {
      display: flex; flex-direction: column; gap: 4px;
      color: #00f5ff; opacity: 0.8;
    }
    .ai-log-line::before { content: '❯ '; color: #7c3aff; }
    .loading-dots::after {
      content: '...'; display: inline-block; animation: dots 1.5s steps(4, end) infinite; width: 0; overflow: hidden; vertical-align: bottom;
    }
    @keyframes dots { to { width: 1.25em; } }
    .ai-answer-box {
      border: 1px solid rgba(255,0,204,0.3); border-radius: 12px;
      padding: 16px 20px; background: rgba(255,0,204,0.04);
      animation: cmd-slide-in 0.3s ease-out;
    }
    .ai-badge {
      font-size: 10px; color: #ff00cc; font-weight: bold;
      letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;
    }
    .ai-text { color: #d8ecff; line-height: 1.8; font-size: 13px; }
    .ai-clear-btn {
      margin-top: 16px; background: transparent; border: 1px solid rgba(0,245,255,0.4);
      color: #00f5ff; border-radius: 8px; padding: 6px 14px; cursor: pointer;
      font-family: inherit; font-size: 11px; transition: all 0.2s;
    }
    .ai-clear-btn:hover { background: rgba(0,245,255,0.1); border-color: #00f5ff; }

    /* SANDBOX STYLING */
    .sandbox-ide {
      background: #02050f; display: flex; flex-direction: column; gap: 12px;
      padding: 20px; border-top: 1px solid rgba(255,255,255,0.06);
      font-family: 'JetBrains Mono', monospace;
    }
    .sb-topbar {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;
    }
    .sb-file { font-size: 11px; color: rgba(255,255,255,0.4); }
    .sb-actions { display: flex; gap: 8px; }
    .sb-btn {
      font-size: 11px; font-weight: bold; border: none; border-radius: 6px;
      padding: 6px 12px; cursor: pointer; font-family: inherit; transition: all 0.2s;
    }
    .sb-compile { background: rgba(255,255,255,0.08); color: #fff; }
    .sb-compile:hover { background: rgba(255,255,255,0.15); }
    .sb-agent { background: #7c3aff; color: #fff; box-shadow: 0 0 10px rgba(124,58,255,0.4); }
    .sb-agent:hover { background: #9258ff; box-shadow: 0 0 15px rgba(124,58,255,0.6); }
    .sb-agent.running { opacity: 0.6; cursor: wait; animation: pulse-btn 1.5s infinite; }
    @keyframes pulse-btn { 0%,100%{opacity:0.6} 50%{opacity:1} }
    .sb-editor {
      background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05);
      border-radius: 8px; padding: 12px 16px; font-size: 11px; color: #a5d6ff;
      overflow-x: auto; min-height: 120px;
    }
    .sb-editor pre { margin: 0; }
    .sb-console {
      background: #000; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
      font-size: 10px; overflow: hidden;
    }
    .sb-console-header {
      background: rgba(255,255,255,0.03); padding: 6px 12px;
      color: rgba(255,255,255,0.4); border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .sb-console-body {
      padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
      max-height: 120px; overflow-y: auto; min-height: 80px;
    }
    .sb-log-line { color: #88cfff; }
    .sb-log-line.err { color: #ff5555; font-weight: bold; }
    .sb-log-line.ok { color: #55ff55; font-weight: bold; }
  `]
})
export class ShellRoot implements OnInit, OnDestroy {
  @ViewChild('portfolioHost', { read: ViewContainerRef }) portfolioHost!: ViewContainerRef;

  view = signal<'dashboard' | 'os' | 'classic'>('dashboard');
  isOverlayHovered = signal(false);
  
  // COMMAND BAR SIGNALS & DATA
  isCommandBarOpen = signal(false);
  cmdFilter = signal('');
  activeCmdIndex = signal(0);
  showTelemetry = signal(true);

  // AI TERMINAL & RAG SIGNALS
  aiLoading = signal(false);
  aiResponse = signal('');
  aiLogs = signal<string[]>([]);

  // SANDBOX SIMULATOR SIGNALS
  isSandboxActive = signal(false);
  sbAgentRunning = signal(false);
  sandboxCode = signal('');
  sandboxLogs = signal<string[]>([]);
  currentChallengeIndex = signal(0);

  sandboxChallenges = [
    {
      id: 'rxjs-leak',
      title: 'Issue 1: RxJS Memory Leak',
      broken: `// Angular Component subscription leak
ngOnInit() {
  this.userService.activeUsers$
    .subscribe(users => {
      this.users = users;
      this.updateGrid();
    });
}`,
      fixed: `// Resolved by NaveenAI Agent (takeUntilDestroyed)
private destroyRef = inject(DestroyRef);

ngOnInit() {
  this.userService.activeUsers$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(users => {
      this.users = users;
      this.updateGrid();
    });
}`,
      warnLog: '[Compiler] WARNING: Memory leak risk detected!',
      errLog: '[Compiler] Subscription userService.activeUsers$ is never unsubscribed.'
    },
    {
      id: 'computed-sideeffect',
      title: 'Issue 2: Computed Signal Side-Effect',
      broken: `// Anti-Pattern: Modifying state inside computed()
activeUsersCount = computed(() => {
  const users = this.users();
  this.analyticsService.log(users.length); // Side Effect!
  return users.filter(u => u.active).length;
});`,
      fixed: `// Resolved: Compute pure value; execute side-effect in effect()
activeUsersCount = computed(() => {
  return this.users().filter(u => u.active).length;
});

constructor() {
  effect(() => {
    this.analyticsService.log(this.activeUsersCount());
  });
}`,
      warnLog: '[Compiler] WARNING: Signals inside computed must be side-effect free.',
      errLog: '[Compiler] ERROR: Disallowed write to analytics inside computed block.'
    },
    {
      id: 'cd-loop',
      title: 'Issue 3: Template Performance Loop',
      broken: `<!-- Template performance bottleneck -->
@for (item of items; track item.id) {
  <div>Tax calculated: {{ computeExpensiveTax(item.price) }}</div>
}`,
      fixed: `// Resolved: Map items using Computed Signal once
taxedItems = computed(() => 
  this.items().map(i => ({ ...i, tax: i.price * 0.18 }))
);

<!-- Template usage -->
@for (item of taxedItems(); track item.id) {
  <div>Tax calculated: {{ item.tax }}</div>
}`,
      warnLog: '[Compiler] WARNING: Component function called directly inside template loop.',
      errLog: '[Compiler] ERROR: Heavy computation triggered on every Change Detection cycle.'
    },
    {
      id: 'timeout-leak',
      title: 'Issue 4: Uncleaned setTimeout Memory Leak',
      broken: `// Dangling async timer
startTicker() {
  setInterval(() => {
    this.timeCounter++;
    this.refreshCharts();
  }, 1000);
}`,
      fixed: `// Resolved: Retain interval handle and clear on destroy
private intervalId: any;

startTicker() {
  this.intervalId = setInterval(() => {
    this.timeCounter++;
    this.refreshCharts();
  }, 1000);
}

ngOnDestroy() {
  if (this.intervalId) clearInterval(this.intervalId);
}`,
      warnLog: '[Compiler] WARNING: setInterval callback retains class references.',
      errLog: '[Compiler] Memory Leak: Interval active after component destruction.'
    },
    {
      id: 'nested-subs',
      title: 'Issue 5: RxJS Nested Subscriptions',
      broken: `// Callback Hell / Race Conditions
ngOnInit() {
  this.route.params.subscribe(params => {
    this.userService.getUser(params.id).subscribe(user => {
      this.userProfile = user;
    });
  });
}`,
      fixed: `// Resolved: Flatten observable chain using switchMap
ngOnInit() {
  this.route.params
    .pipe(
      switchMap(params => this.userService.getUser(params.id)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(user => {
      this.userProfile = user;
    });
}`,
      warnLog: '[Compiler] WARNING: Nested subscribe calls lead to leak tracking problems.',
      errLog: '[Compiler] ERROR: Observable race condition risk.'
    },
    {
      id: 'unsafexss',
      title: 'Issue 6: XSS InnerHTML Vulnerability',
      broken: `// Danger: Binding raw user strings directly
renderComments(rawHtml: string) {
  this.commentHtml = rawHtml;
}

<div [innerHTML]="commentHtml"></div>`,
      fixed: `// Resolved: Inject DomSanitizer and sanitize input safely
private sanitizer = inject(DomSanitizer);

renderComments(rawHtml: string) {
  this.commentHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
}`,
      warnLog: '[Compiler] WARNING: Angular security context bypassed.',
      errLog: '[Compiler] ERROR: UNSAFE HTML binding could lead to Script Injection (XSS).'
    },
    {
      id: 'zone-canvas',
      title: 'Issue 7: NgZone Animation Frame Overhead',
      broken: `// Canvas render loop runs inside Angular CD Zone
initRenderLoop() {
  requestAnimationFrame(function tick() {
    this.updateParticles();
    requestAnimationFrame(tick);
  });
}`,
      fixed: `// Resolved: Run canvas animation cycle outside Angular NgZone
private ngZone = inject(NgZone);

initRenderLoop() {
  this.ngZone.runOutsideAngular(() => {
    requestAnimationFrame(function tick() {
      this.updateParticles();
      requestAnimationFrame(tick);
    });
  });
}`,
      warnLog: '[Compiler] WARNING: High frequency animation loop inside NgZone.',
      errLog: '[Compiler] ERROR: Frame drops. Change Detection triggered 60 times/sec.'
    },
    {
      id: 'trackby-index',
      title: 'Issue 8: Unstable trackBy Index Reference',
      broken: `<!-- Bad trackBy: Using indices for volatile arrays -->
@for (project of volatileProjects; track $index) {
  <app-project-card [data]="project"></app-project-card>
}`,
      fixed: `<!-- Resolved: Track volatile items by unique persistent ID -->
@for (project of volatileProjects; track project.id) {
  <app-project-card [data]="project"></app-project-card>
}`,
      warnLog: '[Compiler] WARNING: Tracking volatile datasets by index causes full DOM rebuilds.',
      errLog: '[Compiler] Performance Warning: Inefficient list sorting change detection.'
    },
    {
      id: 'debounce-search',
      title: 'Issue 9: Unthrottled Keyup API Searching',
      broken: `// Keyup triggers API request on every keystroke
onSearchChange(term: string) {
  this.searchService.fetchResults(term)
    .subscribe(res => this.results = res);
}`,
      fixed: `// Resolved: Add debounceTime and switchMap flow operators
searchSubject = new Subject<string>();

onSearchChange(term: string) {
  this.searchSubject.next(term);
}

ngOnInit() {
  this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.searchService.fetchResults(term)),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(res => this.results = res);
}`,
      warnLog: '[Compiler] WARNING: Unthrottled API requests could flood server backend.',
      errLog: '[Compiler] Network Performance Warning: Out of order response race conditions.'
    },
    {
      id: 'mut-style',
      title: 'Issue 10: Scroll Mutation Paint Bottleneck',
      broken: `// Direct Style mutation in window scroll
@HostListener('window:scroll')
onScroll() {
  const top = window.scrollY;
  document.body.style.setProperty('--scroll-deg', top * 0.1 + 'deg');
}`,
      fixed: `// Resolved: Throttle scroll event using requestAnimationFrame
private ticking = false;

@HostListener('window:scroll')
onScroll() {
  if (!this.ticking) {
    window.requestAnimationFrame(() => {
      document.body.style.setProperty('--scroll-deg', window.scrollY * 0.1 + 'deg');
      this.ticking = false;
    });
    this.ticking = true;
  }
}`,
      warnLog: '[Compiler] WARNING: Style properties mutated on scroll without throttling.',
      errLog: '[Compiler] Layout Bottleneck: Redundant style invalidation paint recalculations.'
    }
  ];

  // TELEMETRY HUD SIGNALS
  fps = signal(60);
  latency = signal(0);
  domNodes = signal(0);

  commandsList = [
    { id: 'dashboard', name: 'Go to Dashboard', desc: 'Return to the main neural shell dashboard', icon: '🏠', action: () => this.exitToDashboard(), shortcut: 'D' },
    { id: 'os', name: 'Launch Naveen OS', desc: 'Boot the windowed Desktop interface', icon: '🖥️', action: () => this.onExperienceSelect('os'), shortcut: 'O' },
    { id: 'classic', name: 'Launch Classic Mode', desc: 'Enter the CLI terminal-supported scrolling portfolio', icon: '✨', action: () => this.onExperienceSelect('classic'), shortcut: 'C' },
    { id: 'sandbox', name: 'Run Debug Sandbox', desc: 'Launch the agentic code debugger simulation', icon: '🛠️', action: () => this.openSandbox(), shortcut: 'S' },
    { id: 'telemetry', name: 'Toggle System HUD', desc: 'Show or hide the real-time performance telemetry', icon: '📊', action: () => this.showTelemetry.update(v => !v), shortcut: 'T' },
    { id: 'resume', name: 'Download Technical Dossier', desc: 'Grab Naveen Singh\'s PDF resume profile', icon: '📥', action: () => this.downloadResume(), shortcut: 'R' }
  ];

  filteredCommands = computed(() => {
    const filter = this.cmdFilter().toLowerCase();
    if (!filter) return this.commandsList;
    return this.commandsList.filter(cmd => 
      cmd.name.toLowerCase().includes(filter) || 
      cmd.desc.toLowerCase().includes(filter)
    );
  });

  private aiEngine = inject(NaveenAiEngineService);

  private currentComponentRef: ComponentRef<any> | null = null;
  private currentEnvInjector: EnvironmentInjector | null = null;
  private activeStyleTag: HTMLLinkElement | null = null;
  
  // FPS calculation variables
  private lastFpsUpdate = 0;
  private frameCount = 0;
  private animFrameId?: number;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private envInjector: EnvironmentInjector
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateRootClasses('dashboard');
      this.startFpsMeter();
      this.startTelemetryPoller();
    }
  }

  // GLOBAL COMMAND PALETTE HOTKEY
  @HostListener('document:keydown', ['$event'])
  handleGlobalShortcut(event: KeyboardEvent) {
    if (!isPlatformBrowser(this.platformId)) return;

    const isMeta = event.metaKey || event.ctrlKey;
    const isAlt = event.altKey;

    if ((isMeta || isAlt) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.toggleCommandBar();
    } else if (event.key === 'Escape' && this.isCommandBarOpen()) {
      event.preventDefault();
      this.closeCommandBar();
    }
  }

  toggleCommandBar() {
    this.isCommandBarOpen.update(v => !v);
    this.cmdFilter.set('');
    this.activeCmdIndex.set(0);
    this.clearAIState();
    this.isSandboxActive.set(false);
    
    if (this.isCommandBarOpen()) {
      audioSynth.playSwoosh();
      setTimeout(() => {
        const input = this.document.querySelector('.cmd-input') as HTMLInputElement;
        input?.focus();
      }, 50);
    }
  }

  closeCommandBar() {
    this.isCommandBarOpen.set(false);
    this.clearAIState();
    this.isSandboxActive.set(false);
  }

  onCmdInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.cmdFilter.set(val);
    this.activeCmdIndex.set(0);
    audioSynth.playClick(900, 0.03);
  }

  onCmdHover(idx: number) {
    if (idx !== this.activeCmdIndex()) {
      this.activeCmdIndex.set(idx);
      audioSynth.playClick(1000, 0.02);
    }
  }

  onCmdKeydown(event: KeyboardEvent) {
    if (this.isSandboxActive()) return; // Lock command arrow inputs during sandbox editor play
    const list = this.filteredCommands();
    const totalCount = list.length + (this.cmdFilter() ? 1 : 0);
    if (totalCount === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeCmdIndex.update(idx => (idx + 1) % totalCount);
      audioSynth.playClick(1000, 0.02);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeCmdIndex.update(idx => (idx - 1 + totalCount) % totalCount);
      audioSynth.playClick(1000, 0.02);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.activeCmdIndex() < list.length) {
        this.executeCommand(list[this.activeCmdIndex()]);
      } else {
        this.askAI();
      }
    }
  }

  executeCommand(item: any) {
    audioSynth.playSelect();
    item.action();
    if (item.id !== 'sandbox') {
      this.closeCommandBar();
    }
  }

  // SANDBOX METHODS
  openSandbox() {
    this.isSandboxActive.set(true);
    this.currentChallengeIndex.set(0);
    this.loadChallenge(0);
  }

  loadChallenge(index: number) {
    const chall = this.sandboxChallenges[index];
    this.sandboxCode.set(chall.broken);
    this.sandboxLogs.set(['[System] Idle. Click Manual Compile or Activate Agent.']);
  }

  nextChallenge() {
    audioSynth.playClick(1100, 0.05);
    const nextIdx = (this.currentChallengeIndex() + 1) % this.sandboxChallenges.length;
    this.currentChallengeIndex.set(nextIdx);
    this.loadChallenge(nextIdx);
  }

  closeSandbox() {
    this.isSandboxActive.set(false);
    this.cmdFilter.set('');
    this.activeCmdIndex.set(0);
  }

  runManualCompile() {
    audioSynth.playClick(800, 0.05);
    const chall = this.sandboxChallenges[this.currentChallengeIndex()];
    this.sandboxLogs.set([
      '[Compiler] Starting build sequence...',
      chall.warnLog,
      chall.errLog
    ]);
  }

  async runAgentDebug() {
    if (this.sbAgentRunning()) return;
    this.sbAgentRunning.set(true);
    this.sandboxLogs.set([]);
    audioSynth.playSelect();

    const chall = this.sandboxChallenges[this.currentChallengeIndex()];

    const pushLog = async (logText: string, delayMs = 300) => {
      this.sandboxLogs.update(logs => [...logs, logText]);
      audioSynth.playHum();
      await new Promise(resolve => setTimeout(resolve, delayMs));
    };

    await pushLog('[Agent] Initializing Angular Memory & Syntax Profiler...', 200);
    await pushLog('[Agent] Scanning syntax nodes for patterns...', 250);
    await pushLog(`[Agent] Identified target anti-pattern: ${chall.id}`, 300);
    await pushLog('[Agent] Plan: Refactor code node to comply with modern Angular standards.', 200);
    
    // Animate patch
    this.sandboxCode.set(chall.fixed);

    await pushLog('[Agent] Code modifications successfully applied.', 300);
    await pushLog('[Compiler] Starting validation build...', 200);
    await pushLog('[Compiler] SUCCESS: Compilation completed with 0 warnings.', 200);
    await pushLog('[System] Codebase security validation check: 100% PASS', 100);

    audioSynth.playClick(1400, 0.15);
    this.sbAgentRunning.set(false);
  }

  // Live RAG Integration
  async askAI() {
    const query = this.cmdFilter();
    if (!query) return;

    audioSynth.playSelect();
    this.aiLoading.set(true);
    this.aiResponse.set('');
    this.aiLogs.set([]);

    const pushLog = async (logText: string, delayMs = 300) => {
      this.aiLogs.update(logs => [...logs, logText]);
      audioSynth.playHum();
      await new Promise(resolve => setTimeout(resolve, delayMs));
    };

    try {
      await pushLog('Initializing Neural Link Connection...', 200);
      await pushLog('Parsing intent parameters and tokenizing query words...', 250);
      await pushLog('Executing vector search simulator (IVF-PQ compressed space)...', 300);
      await pushLog('Analyzing candidate semantic data layers...', 200);
      
      const result = await this.aiEngine.queryEngine(query);
      
      await pushLog('Retrieving relevant chunks and validating groundings...', 300);
      await pushLog('Synthesizing responses via LLM context builder...', 200);
      
      this.aiLoading.set(false);
      this.aiResponse.set(result.answer);
      audioSynth.playClick(1400, 0.15);
    } catch (e) {
      this.aiLoading.set(false);
      this.aiResponse.set('Failed to connect to the RAG Neural Network. Please try again.');
    }
  }

  clearAIState() {
    this.aiLogs.set([]);
    this.aiResponse.set('');
    this.aiLoading.set(false);
  }

  // ANIMATED SHIM VIEW TRANSITION
  private startTransition(fn: () => void) {
    if (typeof this.document !== 'undefined' && 'startViewTransition' in this.document) {
      (this.document as any).startViewTransition(fn);
    } else {
      fn();
    }
  }

  async onExperienceSelect(type: 'os' | 'classic') {
    if (!isPlatformBrowser(this.platformId)) return;

    audioSynth.playSelect();
    const startTimestamp = performance.now();
    this.injectAppStyles(type);

    try {
      let rootComponent: any;
      let appConfig: any;

      if (type === 'os') {
        const [compMod, configMod] = await Promise.all([
          import('@os-app/app.component'),
          import('@os-app/app.config')
        ]);
        rootComponent = compMod.AppComponent;
        appConfig = configMod.appConfig;
      } else {
        const [compMod, configMod] = await Promise.all([
          import('@classic-app/app'),
          import('@classic-app/app.config')
        ]);
        rootComponent = compMod.App;
        appConfig = configMod.appConfig;
      }

      this.startTransition(() => {
        runInInjectionContext(this.envInjector, () => {
          this.destroyCurrentExperience();
          this.purgePortoliosLoaders();

          this.currentEnvInjector = createEnvironmentInjector(
            [],
            this.envInjector,
            `PortfolioInjector:${type}`
          );

          runInInjectionContext(this.currentEnvInjector, () => {
            this.currentComponentRef = this.portfolioHost.createComponent(rootComponent, {
              environmentInjector: this.currentEnvInjector
            });
          });

          this.view.set(type);
          this.updateRootClasses('portfolio');
        });
      });
      
      const latencyMs = Math.round(performance.now() - startTimestamp);
      this.latency.set(latencyMs);
      console.log(`Successfully orchestrated ${type} experience in ${latencyMs}ms.`);
    } catch (err) {
      console.error(`Orchestration failed for ${type}:`, err);
      this.exitToDashboard();
    }
  }

  private destroyCurrentExperience() {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }
    if (this.currentEnvInjector) {
      this.currentEnvInjector.destroy();
      this.currentEnvInjector = null;
    }
    if (this.portfolioHost) {
      this.portfolioHost.clear();
    }
  }

  private purgePortoliosLoaders() {
    const loaders = this.document.querySelectorAll('#loader, #os-loader');
    loaders.forEach(ldr => {
      (ldr as HTMLElement).style.display = 'none';
      ldr.classList.add('gone', 'loaded');
    });
  }

  exitToDashboard() {
    audioSynth.playSwoosh();
    this.startTransition(() => {
      this.destroyCurrentExperience();
      this.removeAppStyles();
      this.updateRootClasses('dashboard');
      window.scrollTo(0, 0);
      this.view.set('dashboard');
    });
  }

  private injectAppStyles(type: 'os' | 'classic') {
    this.removeAppStyles();
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'dynamic-portfolio-styles';
    link.href = type === 'os' ? 'assets/os/styles.css' : 'assets/classic/styles.css';
    this.document.head.appendChild(link);
    this.activeStyleTag = link;
  }

  private removeAppStyles() {
    if (this.activeStyleTag) {
      this.activeStyleTag.remove();
      this.activeStyleTag = null;
    }
    this.document.getElementById('dynamic-portfolio-styles')?.remove();
  }

  private updateRootClasses(mode: 'dashboard' | 'portfolio') {
    const html = this.document.documentElement;
    const body = this.document.body;

    if (mode === 'dashboard') {
      html.classList.remove('is-portfolio');
      body.classList.remove('is-portfolio');
      body.classList.add('dashboard-active');
    } else {
      body.classList.remove('dashboard-active');
      html.classList.add('is-portfolio');
      body.classList.add('is-portfolio');
    }
  }

  private downloadResume() {
    const link = this.document.createElement('a');
    link.href = 'assets/classic/NAVEEN_SINGH_ANGULAR_ARCHITECT.pdf';
    link.download = 'Naveen_Singh_Angular_Architect_Resume.pdf';
    this.document.body.appendChild(link);
    link.click();
    this.document.body.removeChild(link);
  }

  // HUD TELEMETRY METRIC LOGIC
  private startFpsMeter() {
    this.lastFpsUpdate = performance.now();
    const tick = () => {
      this.frameCount++;
      const now = performance.now();
      if (now - this.lastFpsUpdate >= 1000) {
        this.fps.set(Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate)));
        this.frameCount = 0;
        this.lastFpsUpdate = now;
      }
      this.animFrameId = requestAnimationFrame(tick);
    };
    tick();
  }

  private startTelemetryPoller() {
    const poll = () => {
      if (typeof this.document !== 'undefined') {
        this.domNodes.set(this.document.getElementsByTagName('*').length);
      }
    };
    poll();
    setInterval(poll, 2000);
  }

  ngOnDestroy() {
    this.destroyCurrentExperience();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
