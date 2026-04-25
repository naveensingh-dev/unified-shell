import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WindowStore } from '../../../store/window.store';
import { TranslateDirective } from '../../../core/directives/translate.directive';

@Component({
  selector: 'app-system-overview',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  template: `
    <div class="sys-container">
      <div class="sys-hero">
        <div class="sys-eyebrow" [appTranslate]="'system.eyebrow'"></div>
        <h1 class="sys-name" [appTranslate]="'common.name'"></h1>
        <div class="sys-role" [appTranslate]="'system.role'"></div>

        <!-- LIVE PERFORMANCE OVERLAY -->
        <div class="perf-glass-panel">
          <div class="perf-item">
            <span class="p-lbl" [appTranslate]="'system.metrics.memory'"></span>
            <span class="p-val">{{ (perfMetrics().memory / 1024 / 1024).toFixed(1) }}MB</span>
          </div>
          <div class="perf-item">
            <span class="p-lbl" [appTranslate]="'system.metrics.load_time'"></span>
            <span class="p-val">{{ perfMetrics().loadTime }}ms</span>
          </div>
          <div class="perf-item">
            <span class="p-lbl" [appTranslate]="'system.metrics.dom_nodes'"></span>
            <span class="p-val">{{ perfMetrics().domNodes }}</span>
          </div>
          <div class="perf-item">
            <span class="p-lbl" [appTranslate]="'system.metrics.fps'"></span>
            <span class="p-val">{{ perfMetrics().fps }}</span>
          </div>
        </div>

        <div class="sys-pitch" [appTranslate]="'system.pitch'" [useHtml]="true"></div>
        <div class="sys-chips">
          <div class="sys-chip hl" [appTranslate]="'system.monthly_volume_chip'"></div>
          <div class="sys-chip hl" [appTranslate]="'system.angular_regressions_chip'"></div>
          <div class="sys-chip hl2" [appTranslate]="'system.banking_ai_chip'"></div>
          <div class="sys-chip hl3">🟢 <span [appTranslate]="'common.active'"></span></div>
        </div>
      </div>

      <div class="sys-metrics">
        <div class="sys-m">
          <div class="sys-m-val" style="color:var(--ice)">$50M+</div>
          <div class="sys-m-lbl" [appTranslate]="'system.monthly_volume_label'" [useHtml]="true"></div>
        </div>
        <div class="sys-m">
          <div class="sys-m-val" style="color:var(--amber)">v2-v19</div>
          <div class="sys-m-lbl" [appTranslate]="'system.angular_versions_label'" [useHtml]="true"></div>
        </div>
        <div class="sys-m">
          <div class="sys-m-val" style="color:var(--emerald)">98%+</div>
          <div class="sys-m-lbl" [appTranslate]="'system.rag_accuracy_label'" [useHtml]="true"></div>
        </div>
        <div class="sys-m">
          <div class="sys-m-val" style="color:var(--violet)">4wk</div>
          <div class="sys-m-lbl" [appTranslate]="'system.delivery_label'" [useHtml]="true"></div>
        </div>
      </div>

      <div class="sys-arch">
        <div class="slbl" [appTranslate]="'system.arch_label'"></div>
        <div class="arch-list">
          <div class="arch-l" style="--al-c:var(--ice)" (click)="windowStore.open('skills', {})">
            <div class="arch-dot"></div>
            <div class="arch-name" [appTranslate]="'system.arch.ui_layer'"></div>
            <div class="arch-tech" [appTranslate]="'system.arch.ui_tech'"></div>
            <div class="arch-badge" [appTranslate]="'system.arch.active'"></div>
          </div>
          <div class="arch-l" style="--al-c:var(--amber)" (click)="windowStore.open('proj', {})">
            <div class="arch-dot"></div>
            <div class="arch-name" [appTranslate]="'system.arch.platform_core'"></div>
            <div class="arch-tech" [appTranslate]="'system.arch.platform_tech'"></div>
            <div class="arch-badge" [appTranslate]="'system.arch.stable'"></div>
          </div>
          <div class="arch-l" style="--al-c:var(--violet)" (click)="windowStore.open('ai', {})">
            <div class="arch-dot"></div>
            <div class="arch-name" [appTranslate]="'system.arch.ai_layer'"></div>
            <div class="arch-tech" [appTranslate]="'system.arch.ai_tech'"></div>
            <div class="arch-badge" [appTranslate]="'system.arch.prod'"></div>
          </div>
          <div class="arch-l" style="--al-c:var(--emerald)" (click)="windowStore.open('perf', {})">
            <div class="arch-dot"></div>
            <div class="arch-name" [appTranslate]="'system.arch.observability'"></div>
            <div class="arch-tech" [appTranslate]="'system.arch.obs_tech'"></div>
            <div class="arch-badge" [appTranslate]="'system.arch.monitored'"></div>
          </div>
        </div>
        <div style="margin-top:1.5rem;text-align:center">
          <button (click)="windowStore.open('about', {})" class="story-link" [appTranslate]="'system.story_link'"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; min-height: 0; flex: 1; }
    .sys-container { 
      flex: 1 1 auto; 
      overflow-y: auto !important; 
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-y: contain;
      padding-bottom: 80px !important;
      background: #03040e; 
      font-family: var(--font-b); 
      scrollbar-width: thin;
      scrollbar-color: var(--ice) transparent;
    }
    .sys-container::-webkit-scrollbar { width: 8px; }
    .sys-container::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
    .sys-container::-webkit-scrollbar-thumb { background: var(--ice); border-radius: 4px; box-shadow: 0 0 10px var(--ice); }
    
    .sys-hero { padding: var(--win-pad) !important; border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; }
    
    .perf-glass-panel {
      position: absolute; top: 20px; right: 20px;
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
      padding: 12px; border-radius: 12px;
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(10px);
    }
    .perf-item { display: flex; flex-direction: column; min-width: 60px; }
    .p-lbl { font-family: var(--font-m); font-size: 0.55rem !important; color: var(--text3); letter-spacing: 0.05em; }
    .p-val { font-family: var(--font-m); font-size: 0.75rem !important; color: var(--ice); font-weight: 700; }

    .sys-eyebrow { font-family: var(--font-m); font-size: 0.62rem !important; color: var(--ice); letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 8px; }
    .sys-name { font-family: var(--font-d); font-size: var(--win-hd) !important; font-weight: 900; color: #fff; margin-bottom: 4px; }
    .sys-role { font-size: 1rem !important; color: var(--ice); font-weight: 600; margin-bottom: 12px; }
    .sys-pitch { font-size: 0.95rem !important; color: var(--text2); line-height: 1.7; max-width: 600px; margin-bottom: 1.5rem; }
    .sys-pitch strong { color: #fff; }
    
    .sys-chips { display: flex; gap: 8px; flex-wrap: wrap; }
    .sys-chip { font-family: var(--font-m); font-size: 0.62rem !important; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); color: var(--text2); background: rgba(255,255,255,0.03); }
    .sys-chip.hl { border-color: var(--ice); color: var(--ice); background: var(--ice3); }
    .sys-chip.hl2 { border-color: var(--amber); color: var(--amber); background: rgba(245,166,35,0.1); }
    .sys-chip.hl3 { border-color: var(--emerald); color: var(--emerald); background: rgba(54,217,151,0.1); }

    .sys-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 1.5rem var(--win-pad) !important; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .sys-m { text-align: center; }
    .sys-m-val { font-family: var(--font-d); font-size: 1.5rem !important; font-weight: 800; line-height: 1; margin-bottom: 4px; }
    .sys-m-lbl { font-family: var(--font-m); font-size: 0.6rem !important; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.3; }

    .sys-arch { padding: var(--win-pad) !important; }
    .slbl { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px; }
    
    .arch-list { display: flex; flex-direction: column; gap: 8px; }
    .arch-l {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02);
      cursor: pointer; transition: all 0.2s;
    }
    .arch-l:hover { border-color: var(--al-c); background: rgba(255,255,255,0.05); }
    .arch-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--al-c); flex-shrink: 0; box-shadow: 0 0 8px var(--al-c); }
    .arch-name { font-family: var(--font-m); font-size: 0.85rem !important; color: #fff; flex: 1; font-weight: 700; }
    .arch-tech { font-size: 0.75rem !important; color: var(--text2); font-family: var(--font-m); }
    .arch-badge { font-family: var(--font-m); font-size: 0.55rem !important; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.05); color: var(--text3); border: 1px solid rgba(255,255,255,0.1); }

    .story-link {
      font-family: var(--font-m); font-size: 0.75rem !important; color: var(--amber); cursor: pointer; padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(245,166,35,0.25); background: rgba(245,166,35,0.1); transition: all 0.2s;
    }
    .story-link:hover { background: rgba(245,166,35,0.18); border-color: var(--amber); }
  `]
})
export class SystemOverviewComponent implements OnInit, OnDestroy {
  windowStore = inject(WindowStore);
  private platformId = inject(PLATFORM_ID);
  
  perfMetrics = signal({
    memory: 0,
    loadTime: 0,
    domNodes: 0,
    fps: 0
  });

  private intervalId: any;
  private lastFrameTime = performance.now();
  private frameCount = 0;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateMetrics();
      this.intervalId = setInterval(() => this.updateMetrics(), 2000);
      this.trackFPS();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private updateMetrics() {
    const mem = (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    const load = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    this.perfMetrics.update(p => ({
      ...p,
      memory: mem,
      loadTime: load ? Math.round(load.duration) : 0,
      domNodes: document.getElementsByTagName('*').length
    }));
  }

  private trackFPS() {
    const now = performance.now();
    this.frameCount++;
    if (now >= this.lastFrameTime + 1000) {
      this.perfMetrics.update(p => ({ ...p, fps: this.frameCount }));
      this.frameCount = 0;
      this.lastFrameTime = now;
    }
    requestAnimationFrame(() => this.trackFPS());
  }
}
