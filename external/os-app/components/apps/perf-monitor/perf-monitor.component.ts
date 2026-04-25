import { Component, signal, computed, effect, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService } from '../../../services/translation.service';

interface Metric {
  l: string;
  v: string;
  d: string;
  c: string;
}

@Component({
  selector: 'app-perf-monitor',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  template: `
    <div class="perf-tabs-r">
      <div class="perf-tab" [class.act]="activeTab() === 'digigo'" (click)="activeTab.set('digigo')" [appTranslate]="'perf.tabs.core'"></div>
      <div class="perf-tab" [class.act]="activeTab() === 'idp'" (click)="activeTab.set('idp')" [appTranslate]="'perf.tabs.ai'"></div>
      <div class="perf-tab" [class.act]="activeTab() === 'live'" (click)="activeTab.set('live')" [appTranslate]="'perf.tabs.live'"></div>
      <div class="perf-tab" [class.act]="activeTab() === 'architecture'" (click)="activeTab.set('architecture')" [appTranslate]="'perf.tabs.tech'"></div>
    </div>
    
    <div class="perf-c">
      @if (activeTab() !== 'architecture') {
        <div class="perf-header">{{currentData().h}}</div>
        
        <div class="m-grid">
          @for (m of currentData().m; track m.l) {
            <div class="mc" [style.--mc]="m.c">
              <div class="mc-l">{{m.l}}</div>
              <div class="mc-v" [style.color]="m.c">{{m.v}}</div>
              <div class="mc-d up">{{m.d}}</div>
            </div>
          }
        </div>

        <div class="cc">
          <div class="cc-hd">{{currentData().chartTitle}}</div>
          @if (activeTab() === 'digigo') {
            <svg width="100%" height="70" viewBox="0 0 580 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lcpg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--ice)" stop-opacity=".22"/>
                  <stop offset="100%" stop-color="var(--ice)" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path [class.animate]="animateChart()" d="M0,14 C30,13 60,17 90,15 S130,20 155,56 S185,52 210,44 S250,28 290,20 S340,14 390,10 S460,8 520,7 L580,6" 
                    stroke="var(--ice)" stroke-width="2" fill="none" class="chart-path"/>
              <path d="M0,14 C30,13 60,17 90,15 S130,20 155,56 S185,52 210,44 S250,28 290,20 S340,14 390,10 S460,8 520,7 L580,6 L580,70 L0,70Z" fill="url(#lcpg)"/>
            </svg>
          } @else if (activeTab() === 'idp') {
            <div class="bc">
              @for (bar of currentBars(); track bar.l) {
                <div class="bg">
                  <div class="bb" [style.height.px]="bar.h" [style.background]="bar.c"></div>
                  <div class="bl2">{{bar.l}}<br><span [style.color]="bar.c">{{bar.v}}</span></div>
                </div>
              }
            </div>
          } @else if (activeTab() === 'live') {
            <div class="live-chart-container">
              <svg width="100%" height="70" viewBox="0 0 200 70" preserveAspectRatio="none">
                <path [attr.d]="fpsPath()" 
                      stroke="var(--emerald)" 
                      stroke-width="1.5" 
                      fill="none" 
                      class="live-path"/>
              </svg>
              <div class="live-legend">
                <span>0 FPS</span>
                <span>30 FPS</span>
                <span>60 FPS</span>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="tech-section">
          <div class="slbl" [appTranslate]="'perf.tech_slbl'"></div>
          <div class="tech-grid">
            <div class="tech-card">
              <div class="tech-name" [appTranslate]="'perf.tech.zoneless.title'"></div>
              <div class="tech-desc" [appTranslate]="'perf.tech.zoneless.desc'"></div>
            </div>
            <div class="tech-card">
              <div class="tech-name" [appTranslate]="'perf.tech.signals.title'"></div>
              <div class="tech-desc" [appTranslate]="'perf.tech.signals.desc'"></div>
            </div>
            <div class="tech-card">
              <div class="tech-name" [appTranslate]="'perf.tech.defer.title'"></div>
              <div class="tech-desc" [appTranslate]="'perf.tech.defer.desc'"></div>
            </div>
            <div class="tech-card">
              <div class="tech-name" [appTranslate]="'perf.tech.assets.title'"></div>
              <div class="tech-desc" [appTranslate]="'perf.tech.assets.desc'"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .perf-tabs-r { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.3); }
    .perf-tab { font-family: var(--font-m); font-size: 0.7rem !important; padding: 12px 16px; color: var(--text3); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; }
    .perf-tab.act { color: var(--emerald); border-bottom-color: var(--emerald); background: rgba(255,255,255,0.02); }
    
    .perf-c { padding: var(--win-pad) !important; overflow-y: auto; height: calc(100% - 41px); background: #03040e; font-family: var(--font-b); }
    .perf-header { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 1rem; }
    
    .m-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 1.5rem; }
    .mc { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; position: relative; overflow: hidden; }
    .mc::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--mc); }
    .mc-l { font-family: var(--font-m); font-size: 0.6rem !important; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
    .mc-v { font-family: var(--font-d); font-size: 1.5rem !important; font-weight: 800; line-height: 1; color: #fff; }
    .mc-d { font-family: var(--font-m); font-size: 0.6rem !important; margin-top: 4px; opacity: 0.8; }
    .mc-d.up { color: var(--emerald); }
    
    .cc { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; min-height: 120px; }
    .cc-hd { font-family: var(--font-m); font-size: 0.62rem !important; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
    
    .chart-path { stroke-dasharray: 720; stroke-dashoffset: 720; }
    .chart-path.animate { animation: dash 1.9s cubic-bezier(.22,1,.36,1) forwards; }
    @keyframes dash { to { stroke-dashoffset: 0; } }

    .bc { display: flex; align-items: flex-end; gap: 8px; height: 80px; }
    .bg { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
    .bb { border-radius: 3px 3px 0 0; width: 100%; max-width: 32px; transition: height .6s var(--ease); }
    .bl2 { font-family: var(--font-m); font-size: 0.55rem !important; color: var(--text3); text-align: center; margin-top: 4px; line-height: 1.2; }

    .live-chart-container { position: relative; height: 80px; }
    .live-path { transition: d 0.1s linear; }
    .live-legend { display: flex; justify-content: space-between; margin-top: 4px; font-family: var(--font-m); font-size: 0.5rem; color: var(--text3); opacity: 0.5; }

    .tech-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 1rem; }
    .tech-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; }
    .tech-name { font-family: var(--font-d); font-size: 0.95rem !important; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .tech-desc { font-size: 0.85rem !important; color: var(--text2); line-height: 1.6; }
    .slbl { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px; }

    @media (max-width: 768px) {
      .m-grid, .tech-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class PerfMonitorComponent implements OnDestroy {
  private ts = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);
  
  activeTab = signal<'digigo' | 'idp' | 'live' | 'architecture'>('digigo');
  animateChart = signal(false);

  // Live Metrics
  liveFps = signal(0);
  liveDom = signal(0);
  liveMem = signal('0 MB');
  fpsHistory = signal<number[]>(new Array(40).fill(60));
  
  private rafId?: number;
  private lastTime = 0;
  private frames = 0;

  data = computed(() => ({
    digigo: {
      h: this.ts.translate('perf.digigo.header'),
      chartTitle: this.ts.translate('perf.digigo.chart_title'),
      m: [
        { l: this.ts.translate('perf.digigo.metrics.lcp.label'), v: '0.8s', d: this.ts.translate('perf.digigo.metrics.lcp.desc'), c: 'var(--ice)' },
        { l: this.ts.translate('perf.digigo.metrics.lighthouse.label'), v: '100', d: this.ts.translate('perf.digigo.metrics.lighthouse.desc'), c: 'var(--emerald)' },
        { l: this.ts.translate('perf.digigo.metrics.tti.label'), v: '1.1s', d: this.ts.translate('perf.digigo.metrics.tti.desc'), c: 'var(--violet)' }
      ]
    },
    idp: {
      h: this.ts.translate('perf.idp.header'),
      chartTitle: this.ts.translate('perf.idp.chart_title'),
      m: [
        { l: this.ts.translate('perf.idp.metrics.accuracy.label'), v: '98%+', d: this.ts.translate('perf.idp.metrics.accuracy.desc'), c: 'var(--emerald)' },
        { l: this.ts.translate('perf.idp.metrics.retrieval.label'), v: '<500ms', d: this.ts.translate('perf.idp.metrics.retrieval.desc'), c: 'var(--ice)' },
        { l: this.ts.translate('perf.idp.metrics.ttft.label'), v: '<200ms', d: this.ts.translate('perf.idp.metrics.ttft.desc'), c: 'var(--violet)' }
      ]
    },
    live: {
      h: this.ts.translate('perf.live_session.header'),
      chartTitle: this.ts.translate('perf.live_session.chart_title'),
      m: [
        { l: this.ts.translate('perf.live_session.metrics.fps.label'), v: `${this.liveFps()} FPS`, d: this.ts.translate('perf.live_session.metrics.fps.desc'), c: this.liveFps() > 50 ? 'var(--emerald)' : 'var(--amber)' },
        { l: this.ts.translate('perf.live_session.metrics.dom.label'), v: this.liveDom().toString(), d: this.ts.translate('perf.live_session.metrics.dom.desc'), c: 'var(--ice)' },
        { l: this.ts.translate('perf.live_session.metrics.mem.label'), v: this.liveMem(), d: this.ts.translate('perf.live_session.metrics.mem.desc'), c: 'var(--violet)' }
      ]
    }
  }));

  bars = computed(() => ({
    idp: [
      { l: this.ts.translate('perf.idp.bars.chunk'), v: '12ms', h: 10, c: 'var(--text3)' },
      { l: this.ts.translate('perf.idp.bars.embed'), v: '22ms', h: 15, c: 'var(--violet)' },
      { l: this.ts.translate('perf.idp.bars.retrieve'), v: '380ms', h: 45, c: 'var(--ice)' },
      { l: this.ts.translate('perf.idp.bars.safety'), v: '42ms', h: 20, c: 'var(--amber)' },
      { l: this.ts.translate('perf.idp.bars.stream'), v: '1100ms', h: 60, c: 'var(--emerald)' }
    ]
  }));

  currentData = computed(() => (this.data() as any)[this.activeTab()]);
  currentBars = computed(() => (this.bars() as any)[this.activeTab()] || []);

  fpsPath = computed(() => {
    const history = this.fpsHistory();
    if (history.length === 0) return '';
    const width = 200;
    const height = 70;
    const step = width / (history.length - 1);
    
    return history.reduce((path, fps, i) => {
      const x = i * step;
      const y = height - (fps / 60) * height;
      return path + (i === 0 ? `M${x},${y}` : ` L${x},${y}`);
    }, '');
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.startLiveTelemetry();
    }

    effect(() => {
      this.activeTab();
      this.ts.lang();
      this.animateChart.set(false);
      setTimeout(() => this.animateChart.set(true), 100);
    });
  }

  private startLiveTelemetry() {
    const update = (time: number) => {
      this.frames++;
      if (time >= this.lastTime + 1000) {
        const fps = Math.round((this.frames * 1000) / (time - this.lastTime));
        this.liveFps.set(fps);
        this.fpsHistory.update(h => [...h.slice(1), fps]);
        
        this.liveDom.set(document.querySelectorAll('*').length);
        
        const mem = (performance as any).memory;
        if (mem) {
          this.liveMem.set(`${Math.round(mem.usedJSHeapSize / 1048576)} MB`);
        } else {
          this.liveMem.set('N/A');
        }

        this.frames = 0;
        this.lastTime = time;
      }
      this.rafId = requestAnimationFrame(update);
    };
    this.rafId = requestAnimationFrame(update);
  }

  ngOnDestroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
