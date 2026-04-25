import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  template: `
    <div class="tl-wrap">
      <div class="tl-header">
        <h1 appTranslate="timeline.title"></h1>
        <p class="tl-sub" appTranslate="timeline.sub"></p>
      </div>

      <div class="tl-scroll-area">
        <div class="tl-track">
          @for (m of milestones(); track m.year + m.title) {
            <div class="tl-item">
              <div class="tl-meta">
                <div class="tl-year">{{m.year}}</div>
                <div class="tl-dot" [class.edu]="m.isEdu"></div>
              </div>
              <div class="tl-card" [class.edu-card]="m.isEdu">
                <div class="tl-title">{{m.title}}</div>
                <div class="tl-org">{{m.org}}</div>
                <p class="tl-desc">{{m.desc}}</p>
                <div class="tl-tech">
                  @for (t of m.tech; track t) {
                    <span class="tl-tag" [class.edu-tag]="m.isEdu">{{t}}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; width: 100%; overflow: hidden; }
    
    .tl-wrap { 
      display: flex; flex-direction: column; height: 100%; width: 100%; 
      background: #03040e; padding: 2rem;
    }

    .tl-header { flex-shrink: 0; margin-bottom: 2.5rem; }
    .tl-sub { color: var(--text3); font-size: 0.95rem !important; margin-top: 8px;}

    .tl-scroll-area { 
      flex: 1; overflow-y: auto; overflow-x: hidden; min-height: 0;
      scrollbar-width: thin; scrollbar-color: var(--ice) transparent;
      padding-right: 1.5rem;
    }
    .tl-scroll-area::-webkit-scrollbar { width: 8px; }
    .tl-scroll-area::-webkit-scrollbar-thumb { background: rgba(86, 205, 250, 0.3); border-radius: 10px; }

    .tl-track { position: relative; padding-left: 2rem; border-left: 2px solid rgba(255,255,255,0.05); margin-left: 1rem; padding-bottom: 2rem; }

    .tl-item { position: relative; margin-bottom: 3.5rem; }
    
    .tl-meta { position: absolute; left: -3.2rem; top: 0; display: flex; align-items: center; gap: 1.2rem; }
    .tl-year { font-family: var(--font-m); font-size: 0.8rem !important; color: #fff; font-weight: 800; background: #03040e; padding: 4px 0; }
    .tl-dot { width: 14px; height: 14px; border-radius: 50%; background: var(--ice); box-shadow: 0 0 10px var(--ice); border: 2px solid #03040e; }
    .tl-dot.edu { background: var(--violet); box-shadow: 0 0 10px var(--violet); }

    .tl-card { 
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-left: 3px solid var(--ice);
      padding: 1.5rem; border-radius: 12px; transition: all 0.3s var(--ease);
    }
    .tl-card.edu-card { border-left-color: var(--violet); }
    .tl-card:hover { background: rgba(255,255,255,0.04); transform: translateX(8px); }

    .tl-title { font-family: var(--font-d); font-size: 1.2rem !important; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .tl-org { font-family: var(--font-m); font-size: 0.75rem !important; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .tl-desc { color: var(--text2); font-size: 0.95rem !important; line-height: 1.6; margin-bottom: 1rem; }

    .tl-tech { display: flex; flex-wrap: wrap; gap: 8px; }
    .tl-tag { font-family: var(--font-m); font-size: 0.65rem !important; padding: 4px 10px; border-radius: 6px; background: rgba(86,205,250,0.1); color: var(--ice); border: 1px solid rgba(86,205,250,0.2); }
    .tl-tag.edu-tag { background: rgba(139,147,255,0.1); color: var(--violet); border-color: rgba(139,147,255,0.2); }

    @media (max-width: 768px) {
      .tl-wrap { padding: 1.5rem; }
      .tl-track { margin-left: 0.5rem; }
      .tl-card { padding: 1.25rem; }
      .tl-meta { left: -2.7rem; }
    }
  `]
})
export class TimelineComponent {
  private ts = inject(TranslationService);

  milestones = computed(() => [
    { 
      year: this.ts.translate('timeline.m1_year'), 
      title: this.ts.translate('timeline.m1_title'), 
      org: this.ts.translate('timeline.m1_org'), 
      desc: this.ts.translate('timeline.m1_desc'), 
      tech: ['GenAI', 'Agentic AI', 'Tool Use'] 
    },
    { 
      year: this.ts.translate('timeline.m2_year'), 
      title: this.ts.translate('timeline.m2_title'), 
      org: this.ts.translate('timeline.m2_org'), 
      desc: this.ts.translate('timeline.m2_desc'), 
      tech: ['Azure Doc Intel', 'LangChain', 'FAISS IVF-PQ'] 
    },
    { 
      year: this.ts.translate('timeline.m3_year'), 
      title: this.ts.translate('timeline.m3_title'), 
      org: this.ts.translate('timeline.m3_org'), 
      desc: this.ts.translate('timeline.m3_desc'), 
      tech: ['Angular 19', 'FastAPI', 'LangChain', 'FAISS'] 
    },
    { 
      year: this.ts.translate('timeline.m4_year'), 
      title: this.ts.translate('timeline.m4_title'), 
      org: this.ts.translate('timeline.m4_org'), 
      desc: this.ts.translate('timeline.m4_desc'), 
      tech: ['Platform Blueprint', 'MFE', 'CI Governance'] 
    },
    { 
      year: this.ts.translate('timeline.m5_year'), 
      title: this.ts.translate('timeline.m5_title'), 
      org: this.ts.translate('timeline.m5_org'), 
      desc: this.ts.translate('timeline.m5_desc'), 
      tech: ['Webpack 5', 'Module Federation', 'Nx'] 
    },
    { 
      year: this.ts.translate('timeline.m6_year'), 
      title: this.ts.translate('timeline.m6_title'), 
      org: this.ts.translate('timeline.m6_org'), 
      desc: this.ts.translate('timeline.m6_desc'), 
      tech: ['Angular', 'RxJS', 'Signals'] 
    },
    { 
      year: this.ts.translate('timeline.m7_year'), 
      title: this.ts.translate('timeline.m7_title'), 
      org: this.ts.translate('timeline.m7_org'), 
      desc: this.ts.translate('timeline.m7_desc'), 
      tech: ['Angular 9', 'Auth0', 'REST'] 
    },
    { 
      year: this.ts.translate('timeline.m8_year'), 
      title: this.ts.translate('timeline.m8_title'), 
      org: this.ts.translate('timeline.m8_org'), 
      desc: this.ts.translate('timeline.m8_desc'), 
      tech: ['Angular 2-6', 'RxJS', 'Jasmine'] 
    },
    { 
      year: this.ts.translate('timeline.m9_year'), 
      title: this.ts.translate('timeline.m9_title'), 
      org: this.ts.translate('timeline.m9_org'), 
      desc: this.ts.translate('timeline.m9_desc'), 
      tech: ['Systems Arch', 'Data Structures'], 
      isEdu: true 
    },
    { 
      year: this.ts.translate('timeline.m10_year'), 
      title: this.ts.translate('timeline.m10_title'), 
      org: this.ts.translate('timeline.m10_org'), 
      desc: this.ts.translate('timeline.m10_desc'), 
      tech: ['Programming', 'Databases'], 
      isEdu: true 
    }
  ]);
}
