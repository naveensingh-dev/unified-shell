import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { QuantumLoaderComponent } from '../../shared/quantum-loader.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, TranslateDirective, QuantumLoaderComponent],
  template: `
    @if (!isLoaded()) {
      <app-quantum-loader label="DECRYPTING_EXPERIENCE_RECORDS"></app-quantum-loader>
    } @else {
      <div class="exp-wrap fade-in">
        <div class="exp-header">
          <h1 [appTranslate]="'experience.title'"></h1>
          <p class="exp-sub" [appTranslate]="'experience.sub'"></p>
        </div>

        <div class="exp-scroll">
          @for (j of localizedJobs(); track j.co) {
            <div class="job-card">
              <div class="job-side">
                <div class="job-logo">{{j.logo}}</div>
                <div class="job-line"></div>
              </div>
              <div class="job-main">
                <div class="job-meta">
                  <h2 class="job-title">{{j.title}}</h2>
                  <div class="job-co">{{j.co}} <span class="job-loc">• {{j.loc}}</span></div>
                  <div class="job-per">{{j.period}}</div>
                </div>
                
                @if (j.progression) {
                  <div class="job-progression">
                    <strong [appTranslate]="'experience.progression'"></strong>: {{j.progression}}
                  </div>
                }

                <ul class="job-bullets">
                  @for (b of j.bullets; track b) {
                    <li [innerHTML]="b"></li>
                  }
                </ul>
                <div class="job-tech">
                  @for (t of j.tech; track t) {
                    <span class="j-tag">{{t}}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; min-height: 0; flex: 1; }
    .exp-wrap { 
      flex: 1 1 auto; 
      display: flex; 
      flex-direction: column; 
      height: 100%; 
      width: 100%; 
      background: #03040e; 
      padding: 2rem; 
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 100px !important;
      scrollbar-width: thin;
      scrollbar-color: var(--ice) transparent;
    }
    .exp-wrap::-webkit-scrollbar { width: 6px; }
    .exp-wrap::-webkit-scrollbar-thumb { background: var(--ice); border-radius: 4px; }

    .exp-header { flex-shrink: 0; margin-bottom: 2rem; }
    .exp-sub { color: var(--text3); font-size: 0.95rem !important; }
    
    .exp-scroll { flex: 1; min-height: 0; }

    .job-card { display: flex; gap: 2rem; margin-bottom: 3.5rem; position: relative; }
    .job-side { display: flex; flex-direction: column; align-items: center; width: 44px; flex-shrink: 0; }
    .job-logo { width: 44px; height: 44px; background: rgba(86,205,250,0.08); border: 1px solid rgba(86,205,250,0.3); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
    .job-line { flex: 1; width: 2px; background: linear-gradient(to bottom, rgba(86,205,250,0.3), rgba(255,255,255,0.02)); margin-top: 1rem; }

    .job-main { flex: 1; }
    .job-meta { margin-bottom: 1.2rem; }
    .job-title { font-family: var(--font-d); font-size: 1.4rem !important; font-weight: 800; color: #fff; margin-bottom: 4px; line-height: 1.2; }
    .job-co { font-family: var(--font-m); color: var(--ice); text-transform: uppercase; font-size: 0.85rem !important; letter-spacing: 0.05em; font-weight: 700; }
    .job-loc { color: var(--text3); font-weight: 400; text-transform: none; letter-spacing: normal; }
    .job-per { font-size: 0.8rem !important; color: var(--text3); margin-top: 6px; font-weight: 500; }

    .job-progression { font-size: 0.85rem !important; color: var(--text2); background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; border-left: 2px solid var(--violet); margin-bottom: 1.5rem; line-height: 1.5; }
    .job-progression strong { color: var(--violet); }

    .job-bullets { padding-left: 1.2rem; margin-bottom: 1.5rem; }
    .job-bullets li { color: var(--text2); font-size: 0.95rem !important; margin-bottom: 12px; line-height: 1.7; list-style-type: square; }
    ::ng-deep .job-bullets li strong { color: #fff; font-weight: 700; }
    
    .job-tech { display: flex; flex-wrap: wrap; gap: 8px; }
    .j-tag { font-family: var(--font-m); font-size: 0.65rem !important; padding: 5px 12px; border-radius: 6px; background: rgba(255,255,255,0.03); color: var(--text2); border: 1px solid rgba(255,255,255,0.1); }

    .fade-in { animation: fadeIn 0.5s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .job-card { gap: 1rem; }
      .job-side { width: 30px; }
      .job-logo { width: 32px; height: 32px; font-size: 1rem; }
      .exp-wrap { padding: 1.25rem; }
      .job-title { font-size: 1.2rem !important; }
      .job-co { font-size: 0.75rem !important; }
      .job-bullets { padding-left: 1rem; }
      .job-bullets li { font-size: 0.85rem !important; line-height: 1.6; }
    }
  `]
})
export class ExperienceComponent {
  ts = inject(TranslationService);
  isLoaded = signal(false);

  constructor() {
    setTimeout(() => this.isLoaded.set(true), 2000);
  }

  localizedJobs = computed(() => {
    return [
      {
        title: this.ts.translate('experience.job1_title'), 
        co: this.ts.translate('experience.co1'), 
        loc: this.ts.translate('experience.job1_loc'), 
        period: this.ts.translate('experience.job1_period'), 
        logo: '🚀',
        progression: this.ts.translate('experience.job1_prog'),
        bullets: [
          this.ts.translate('experience.job1_b1'),
          this.ts.translate('experience.job1_b2'),
          this.ts.translate('experience.job1_b3'),
          this.ts.translate('experience.job1_b4'),
          this.ts.translate('experience.job1_b5')
        ],
        tech: [
          this.ts.translate('experience.tech.angular_6_19'),
          this.ts.translate('experience.tech.typescript'),
          this.ts.translate('experience.tech.rxjs'),
          this.ts.translate('experience.tech.signals'),
          this.ts.translate('experience.tech.defer'),
          this.ts.translate('experience.tech.module_federation'),
          this.ts.translate('experience.tech.nx'),
          this.ts.translate('experience.tech.ssr'),
          this.ts.translate('experience.tech.docker'),
          this.ts.translate('experience.tech.sonarqube')
        ]
      },
      {
        title: this.ts.translate('experience.job2_title'), 
        co: this.ts.translate('experience.co2'), 
        loc: this.ts.translate('experience.job2_loc'), 
        period: this.ts.translate('experience.job2_period'), 
        logo: '🏦',
        bullets: [
          this.ts.translate('experience.job2_b1'),
          this.ts.translate('experience.job2_b2'),
          this.ts.translate('experience.job2_b3'),
          this.ts.translate('experience.job2_b4')
        ],
        tech: [
          this.ts.translate('experience.tech.angular_2_6'),
          this.ts.translate('experience.tech.typescript'),
          this.ts.translate('experience.tech.rxjs'),
          this.ts.translate('experience.tech.rest_apis'),
          this.ts.translate('experience.tech.jasmine'),
          this.ts.translate('experience.tech.karma'),
          this.ts.translate('experience.tech.git'),
          this.ts.translate('experience.tech.agile_scrum')
        ]
      }
    ];
  });
}
