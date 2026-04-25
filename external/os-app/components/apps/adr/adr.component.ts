import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService } from '../../../services/translation.service';

interface ADR {
  id: string;
  title: string;
  status: 'Accepted' | 'Proposed' | 'Deprecated';
  date: string;
  context: string;
  decision: string;
  consequences: string;
}

@Component({
  selector: 'app-adr',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  template: `
    <div class="adr-container">
      <div class="adr-sidebar">
        <div class="slbl" [appTranslate]="'adr.records_label'"></div>
        @for (adr of adrs(); track adr.id) {
          <button class="adr-nav-item" 
                  [class.active]="selectedId() === adr.id"
                  (click)="selectedId.set(adr.id)">
            <span class="adr-id">{{adr.id}}</span>
            <span class="adr-nav-title">{{adr.title}}</span>
            <div class="adr-status-dot" [class]="adr.status.toLowerCase()"></div>
          </button>
        }
      </div>

      <div class="adr-main">
        @if (selectedAdr(); as adr) {
          <div class="adr-content fade-in">
            <header class="adr-header">
              <div class="adr-meta">
                <span class="adr-badge" [class]="adr.status.toLowerCase()">{{adr.status}}</span>
                <span class="adr-date">{{adr.date}}</span>
              </div>
              <h1 class="adr-title">{{adr.id}}: {{adr.title}}</h1>
            </header>

            <section class="adr-section">
              <h3 class="adr-sh" [appTranslate]="'adr.context_sh'"></h3>
              <p>{{adr.context}}</p>
            </section>

            <section class="adr-section highlighted">
              <h3 class="adr-sh" [appTranslate]="'adr.decision_sh'"></h3>
              <p>{{adr.decision}}</p>
            </section>

            <section class="adr-section">
              <h3 class="adr-sh" [appTranslate]="'adr.conseq_sh'"></h3>
              <p>{{adr.consequences}}</p>
            </section>
          </div>
        } @else {
          <div class="adr-placeholder">
            <div class="adr-p-icon">📜</div>
            <p [appTranslate]="'adr.placeholder'"></p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .adr-container { display: flex; height: 100%; background: #020308; color: #fff; font-family: var(--font-b); overflow: hidden; }
    
    .adr-sidebar { width: 280px; border-right: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; padding: 1.5rem 0; background: rgba(255,255,255,0.01); }
    .slbl { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); letter-spacing: 0.2em; padding: 0 1.5rem 1rem; }
    
    .adr-nav-item { 
      display: flex; align-items: center; gap: 12px; padding: 12px 1.5rem; width: 100%; text-align: left;
      background: none; border: none; cursor: pointer; border-left: 3px solid transparent; transition: all 0.2s;
    }
    .adr-nav-item:hover { background: rgba(255,255,255,0.03); }
    .adr-nav-item.active { background: rgba(86,205,250,0.08); border-left-color: var(--ice); }
    
    .adr-id { font-family: var(--font-m); font-size: 0.7rem !important; color: var(--ice); opacity: 0.7; width: 50px; flex-shrink: 0; }
    .adr-nav-title { font-size: 0.85rem !important; color: var(--text2); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .adr-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .adr-status-dot.accepted { background: var(--emerald); box-shadow: 0 0 8px var(--emerald); }
    .adr-status-dot.proposed { background: var(--amber); }

    .adr-main { flex: 1; overflow-y: auto; padding: 3rem; scrollbar-width: thin; }
    .adr-header { margin-bottom: 2.5rem; }
    .adr-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
    .adr-badge { font-family: var(--font-m); font-size: 0.6rem !important; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .adr-badge.accepted { background: rgba(54,217,151,0.15); color: var(--emerald); border: 1px solid rgba(54,217,151,0.3); }
    .adr-badge.proposed { background: rgba(245,166,35,0.15); color: var(--amber); border: 1px solid rgba(245,166,35,0.3); }
    .adr-date { font-family: var(--font-m); font-size: 0.7rem !important; color: var(--text3); }
    .adr-title { font-family: var(--font-d); font-size: 1.75rem !important; font-weight: 900; }

    .adr-section { margin-bottom: 2rem; max-width: 700px; }
    .adr-section.highlighted { background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--ice); }
    .adr-sh { font-family: var(--font-m); font-size: 0.75rem !important; color: var(--ice); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
    .adr-section p { font-size: 1rem !important; color: var(--text2); line-height: 1.7; }

    .adr-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text3); opacity: 0.5; }
    .adr-p-icon { font-size: 4rem; margin-bottom: 1rem; }
  `]
})
export class AdrComponent {
  selectedId = signal<string | null>('ADR-001');

  adrs = signal<ADR[]>([
    {
      id: 'ADR-001',
      title: 'Adopt Standalone Components as Default',
      status: 'Accepted',
      date: 'November 2022',
      context: 'Angular 14 introduced standalone components. The team had been using NgModules, which led to complex dependency graphs and slower compilation.',
      decision: 'Mandate standalone components for all new feature development. Begin incremental migration of core platform components.',
      consequences: 'Improved tree-shaking, 15% faster build times, and explicit dependency management at the component level.'
    },
    {
      id: 'ADR-007',
      title: 'Mandate @defer for Non-Critical Viewports',
      status: 'Accepted',
      date: 'October 2023',
      context: 'Large dashboard pages were suffering from high LCP due to eager loading of complex data charts and heavy secondary panels.',
      decision: 'Use the @defer block for any component tree not visible in the initial 1280x720 viewport. Use viewport intersection as the primary trigger.',
      consequences: 'Initial bundle size reduced by 30%, measurable improvement in INP across the platform.'
    },
    {
      id: 'ADR-012',
      title: 'Reactive Forms for Complex Financial Data',
      status: 'Accepted',
      date: 'March 2021',
      context: 'The platform required complex, multi-step financial transaction forms with cross-field validation and dynamic field generation.',
      decision: 'Adopt Reactive Forms for all enterprise forms with >5 fields or complex validation logic. Template-driven forms reserved for simple inputs.',
      consequences: 'Type-safe form models, 100% unit test coverage for validation logic, and decoupled UI from business rules.'
    },
    {
      id: 'ADR-019',
      title: 'FAISS IVF-PQ for Production RAG Retrieval',
      status: 'Accepted',
      date: 'February 2024',
      context: 'Initial RAG implementation used a flat index, which scaled poorly as document volume exceeded 100k chunks, causing sub-par latency.',
      decision: 'Migrate to FAISS Inverted File with Product Quantization (IVF-PQ). Cluster vectors into centroids for logarithmic search time.',
      consequences: 'Retrieval latency dropped from 3s to <500ms while maintaining 98%+ recall accuracy.'
    }
  ]);

  selectedAdr = computed(() => this.adrs().find(a => a.id === this.selectedId()));
}
