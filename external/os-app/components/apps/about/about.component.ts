import { Component, inject, signal, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService, Lang } from '../../../services/translation.service';
import { ResumeService } from '../../../services/resume.service';
import { QuantumLoaderComponent } from '../../shared/quantum-loader.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateDirective, QuantumLoaderComponent],
  template: `
    @if (!isLoaded()) {
      <app-quantum-loader label="DECRYPTING_BIO_DOSSIER"></app-quantum-loader>
    } @else {
      <div class="about-container fade-in">
        <header class="about-header">
          <h1 class="about-title" [appTranslate]="'about.title'"></h1>
          <p class="about-bio" [appTranslate]="'about.bio'" [useHtml]="true"></p>
        </header>

        <section class="specialties-section">
          <h2 class="section-label" [appTranslate]="'about.focus_label'"></h2>
          <div class="spec-grid">
            <div class="spec-item">
              <div class="spec-icon">🤖</div>
              <div class="spec-text">
                <strong [appTranslate]="'about.spec_ai_title'"></strong>
                <span [appTranslate]="'about.spec_ai_desc'"></span>
              </div>
            </div>
            <div class="spec-item">
              <div class="spec-icon">⚡</div>
              <div class="spec-text">
                <strong [appTranslate]="'about.spec_ang_title'"></strong>
                <span [appTranslate]="'about.spec_ang_desc'"></span>
              </div>
            </div>
            <div class="spec-item">
              <div class="spec-icon">🛡</div>
              <div class="spec-text">
                <strong [appTranslate]="'about.spec_rag_title'"></strong>
                <span [appTranslate]="'about.spec_rag_desc'"></span>
              </div>
            </div>
          </div>
        </section>

        <section class="resume-download-section">
          <h2 class="section-label" [appTranslate]="'common.resume'"></h2>
          <div class="resume-card">
            <div class="res-info">
              <div class="res-icon">📄</div>
              <div class="res-details">
                <strong [appTranslate]="'common.resume'"></strong>
                <span [appTranslate]="'desktop.pdf_depth'"></span>
              </div>
            </div>

            @if (ts.lang() === 'EN') {
              <div class="res-picker">
                <p class="picker-hint" [appTranslate]="'about.resume_picker_hint'"></p>
                <div class="picker-grid">
                  @for (l of languages; track l) {
                    <button class="picker-btn" (click)="downloadResume(l)">
                      <span class="l-code">{{l}}</span>
                      <span class="l-name">{{langNames[l]}}</span>
                    </button>
                  }
                </div>
              </div>
            } @else {
              <button class="download-btn-full" (click)="downloadResume()" [appTranslate]="'common.resume'">
              </button>
            }
          </div>
        </section>

        <section class="recruiter-quickview">
          <div class="slbl" [appTranslate]="'about.hiring_title'"></div>
          <div class="rec-block">
            <div class="rec-item"><strong [appTranslate]="'about.hiring_roles_label'"></strong> <span [appTranslate]="'about.hiring_roles'"></span></div>
            <div class="rec-item"><strong [appTranslate]="'about.hiring_avail_label'"></strong> <span [appTranslate]="'about.hiring_avail'"></span></div>
            <div class="rec-item"><strong [appTranslate]="'about.hiring_loc_label'"></strong> <span [appTranslate]="'about.hiring_loc'"></span></div>
            <div class="rec-item"><strong [appTranslate]="'about.hiring_contact_label'"></strong> <span [appTranslate]="'common.email'"></span> · <span [appTranslate]="'common.phone'"></span></div>
          </div>
        </section>
      </div>
    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; min-height: 0; flex: 1; }
    .about-container { 
      flex: 1 1 auto; padding: var(--win-pad) !important; background: transparent; color: var(--text); overflow-y: auto !important; -webkit-overflow-scrolling: touch; padding-bottom: 100px !important; font-family: var(--font-b); scrollbar-width: thin; scrollbar-color: var(--ice) transparent;
    }
    .about-container::-webkit-scrollbar { width: 6px; }
    .about-container::-webkit-scrollbar-thumb { background: var(--ice); border-radius: 4px; }
    .about-header { margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem; }
    .about-title { font-family: var(--font-d); font-size: var(--win-hd) !important; font-weight: 900; color: #fff; margin-bottom: 12px; letter-spacing: -0.02em; }
    .about-bio { font-size: 0.95rem !important; color: var(--text2); line-height: 1.7; max-width: 800px; }
    .about-bio strong { color: var(--ice); font-weight: 700; }
    .section-label { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1rem; opacity: 0.8; }
    .spec-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 2rem; }
    .spec-item { display: flex; gap: 1rem; background: rgba(255,255,255,0.02); padding: 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); }
    .spec-icon { font-size: 1.5rem; flex-shrink: 0; }
    .spec-text { display: flex; flex-direction: column; gap: 4px; }
    .spec-text strong { font-size: 0.95rem !important; color: #fff; }
    .spec-text span { font-size: 0.85rem !important; color: var(--text3); line-height: 1.5; }
    .resume-download-section { margin-bottom: 2.5rem; }
    .resume-card { background: rgba(86, 205, 250, 0.05); border: 1px solid rgba(86, 205, 250, 0.2); border-radius: 12px; padding: 20px; }
    .res-info { display: flex; gap: 1rem; align-items: center; margin-bottom: 20px; }
    .res-details strong { font-size: 1rem !important; color: #fff; }
    .res-details span { font-size: 0.75rem !important; color: var(--text3); }
    .picker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .picker-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; color: #fff; display: flex; flex-direction: column; align-items: center; }
    .l-code { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--ice); font-weight: 800; }
    .l-name { font-size: 0.75rem !important; opacity: 0.8; }
    .download-btn-full { width: 100%; padding: 14px; background: #fff; color: #000; border: none; border-radius: 8px; font-weight: 800; }
    .recruiter-quickview { margin-top: 2rem; }
    .slbl { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1rem; }
    .rec-block { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .rec-item { font-size: 0.85rem !important; color: var(--text2); line-height: 1.5; }
    .rec-item strong { color: var(--ice); font-weight: 700; }
    .fade-in { animation: fadeIn 0.5s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .about-container { padding: 1.25rem !important; }
      .about-title { font-size: 1.5rem !important; }
      .about-bio { font-size: 0.85rem !important; line-height: 1.6; }
      .rec-block { grid-template-columns: 1fr; }
      .picker-grid { grid-template-columns: repeat(2, 1fr); }
      .spec-text strong { font-size: 0.85rem !important; }
      .spec-text span { font-size: 0.75rem !important; }
    }
  `]
})
export class AboutComponent implements OnInit {
  ts = inject(TranslationService);
  resumeService = inject(ResumeService);
  private platformId = inject(PLATFORM_ID);
  isLoaded = signal(false);

  languages: Lang[] = ['EN', 'HI', 'ZH', 'ES', 'AR', 'FR', 'DE', 'JP', 'PT', 'RU'];
  langNames: Record<string, string> = {
    EN: 'English', HI: 'हिन्दी', ZH: '中文', ES: 'Español', AR: 'العربية', FR: 'Français',
    DE: 'Deutsch', JP: '日本語', PT: 'Português', RU: 'Русский'
  };

  ngOnInit() {
    setTimeout(() => this.isLoaded.set(true), 2000);
  }

  downloadResume(lang?: Lang) {
    if (isPlatformBrowser(this.platformId)) {
      this.resumeService.download(lang);
    }
  }
}
