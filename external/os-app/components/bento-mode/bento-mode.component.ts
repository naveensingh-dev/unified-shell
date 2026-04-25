import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { WindowStore } from '../../store/window.store';
import { SettingsService } from '../../services/settings.service';
import { IconService } from '../../services/icon.service';
import { TranslationService, Lang } from '../../services/translation.service';
import { ResumeService } from '../../services/resume.service';
import { TranslateDirective } from '../../core/directives/translate.directive';

@Component({
  selector: 'app-bento-mode',
  standalone: true,
  imports: [CommonModule, TopBarComponent, TranslateDirective],
  template: `
    <div class="bento-root fade-in">
      <app-top-bar></app-top-bar>
      
      <div class="bento-container">
        <main class="bento-grid">
          
          <!-- HERO BENTO (Large) -->
          <div id="home" class="b-card b-hero b-col-span-2 b-row-span-2">
            <div class="b-hero-content">
              <div class="b-badge-wrap">
                <span class="b-badge status">● AVAILABLE</span>
                <span class="b-badge role">ANGULAR ARCHITECT</span>
              </div>
              <h1 class="b-title" appTranslate="desktop.hero_title"></h1>
              <p class="b-subtitle" [appTranslate]="'desktop.hero_desc'" [stripHtml]="true"></p>
              <div class="b-actions">
                <button class="b-btn primary" (click)="windowStore.open('sch', {})">
                  Schedule Strategy Call <span class="arr">→</span>
                </button>
                <button class="b-btn secondary" (click)="resumeService.download()">
                  Download Resume
                </button>
              </div>
            </div>
            <div class="b-hero-glow"></div>
          </div>

          <!-- METRICS -->
          <div class="b-card b-metric">
            <div class="b-metric-val">100</div>
            <div class="b-metric-lbl">LIGHTHOUSE<br>PERFORMANCE</div>
            <div class="b-metric-icon">⚡</div>
          </div>

          <div class="b-card b-metric">
            <div class="b-metric-val">9+</div>
            <div class="b-metric-lbl">YEARS OF<br>EXPERIENCE</div>
            <div class="b-metric-icon">🚀</div>
          </div>

          <!-- FEATURED PROJECT -->
          <div class="b-card b-featured b-col-span-2">
            <h2 class="b-sec-title">Featured System</h2>
            @if (featuredProject(); as p) {
              <div class="feat-content">
                <div class="feat-status">[{{ p.status }}]</div>
                <h3 class="feat-name">{{ p.name }}</h3>
                <p class="feat-desc">{{ p.tagline }}</p>
                <div class="feat-tags">
                  @for (t of p.techStack.slice(0, 3); track t) {
                    <span class="feat-tag">{{ t }}</span>
                  }
                </div>
              </div>
              <button class="b-link-btn" (click)="windowStore.open('proj', {})">View All Systems <span class="arr">→</span></button>
            }
          </div>

          <!-- ABOUT -->
          <div id="about" class="b-card b-about b-col-span-2">
            <h2 class="b-sec-title">About Me</h2>
            <p class="b-about-text" appTranslate="about.bio" [useHtml]="true"></p>
          </div>

          <!-- TECH STACK -->
          <div id="skills" class="b-card b-skills b-col-span-2">
            <h2 class="b-sec-title">Technical Stack</h2>
            <div class="b-pill-grid">
              <span class="b-pill primary">Angular 21</span>
              <span class="b-pill primary">TypeScript</span>
              <span class="b-pill">RxJS</span>
              <span class="b-pill">NgRx Signals</span>
              <span class="b-pill">Zoneless</span>
              <span class="b-pill primary">GenAI</span>
              <span class="b-pill">RAG</span>
              <span class="b-pill">Node.js</span>
              <span class="b-pill">FastAPI</span>
            </div>
          </div>

          <!-- EXPERIENCE TIMELINE -->
          <div id="experience" class="b-card b-exp b-col-span-2 b-row-span-2">
            <h2 class="b-sec-title">Experience</h2>
            <div class="b-timeline">
              <div class="b-time-item">
                <div class="b-time-dot"></div>
                <div class="b-time-content">
                  <div class="b-time-meta">
                    <span [appTranslate]="'experience.job1_period'"></span> // <span [appTranslate]="'experience.job1_loc'"></span>
                  </div>
                  <h3 class="b-time-role" appTranslate="experience.job1_title"></h3>
                  <div class="b-time-org" appTranslate="experience.co1"></div>
                  <p [appTranslate]="'experience.job1_b1'" [useHtml]="true"></p>
                </div>
              </div>
              <div class="b-time-item">
                <div class="b-time-dot"></div>
                <div class="b-time-content">
                  <div class="b-time-meta">
                    <span [appTranslate]="'experience.job2_period'"></span> // <span [appTranslate]="'experience.job2_loc'"></span>
                  </div>
                  <h3 class="b-time-role" appTranslate="experience.job2_title"></h3>
                  <div class="b-time-org" appTranslate="experience.co2"></div>
                  <p [appTranslate]="'experience.job2_b1'" [useHtml]="true"></p>
                </div>
              </div>
            </div>
          </div>

          <!-- PROJECTS / LABS -->
          <div id="ai-lab" class="b-card b-labs b-col-span-2">
             <h2 class="b-sec-title">AI Research</h2>
             <p [appTranslate]="'ai_lab.sub'" [useHtml]="true"></p>
             <button class="b-link-btn" (click)="windowStore.open('ai', {})">Open AI Lab <span class="arr">→</span></button>
          </div>

          <!-- CONTACT -->
          <div id="contact" class="b-card b-contact b-col-span-2">
            <h2 class="b-sec-title">Contact</h2>
            <div class="b-contact-content">
              <p [appTranslate]="'contact.sub'" [useHtml]="true"></p>
              <div class="b-contact-links">
                <a [href]="'mailto:' + (ts.translate('common.email'))" appTranslate="common.email"></a>
                <button class="b-btn primary small" (click)="windowStore.open('sch', {})">Book Call</button>
              </div>
            </div>
          </div>

          <!-- AI THOUGHT STREAM -->
          <div class="b-card b-ai-stream b-col-span-2">
            <div class="ai-stream-hdr">
              <div class="ai-stream-dot"></div>
              <h2 class="b-sec-title no-margin">NEURAL_THOUGHT_STREAM</h2>
            </div>
            <div class="ai-thought-wrap">
              <p class="ai-thought">{{ currentThought() }}</p>
            </div>
            <div class="ai-stream-footer">
              <span class="ai-status">STATUS: ONLINE</span>
              <span class="ai-latency">LATENCY: 24ms</span>
            </div>
          </div>

          <!-- SETTINGS (Out of the Box) -->
          <div id="settings" class="b-card b-settings">
            <h2 class="b-sec-title">System</h2>
            <div class="b-settings-grid">
              <button class="b-sett-btn" (click)="settings.toggleClassicMode()" [appTranslateAttr]="{ title: 'Toggle OS Mode' }">
                <span class="icon">🖥️</span>
                <span class="label">OS_MODE</span>
              </button>
              <button class="b-sett-btn" (click)="windowStore.open('sets', {})" [appTranslateAttr]="{ title: 'Open Settings' }">
                <span class="icon">⚙️</span>
                <span class="label">CONFIG</span>
              </button>
            </div>
          </div>

          <!-- LANGUAGE SWITCHER -->
          <div class="b-card b-langs">
            <h2 class="b-sec-title">Neural Language</h2>
            <div class="lang-grid">
              @for (l of availableLangs; track l) {
                <button class="lang-btn" [class.active]="ts.lang() === l" (click)="ts.setLang(l)">
                  {{ l }}
                </button>
              }
            </div>
          </div>

          <!-- INTERACTIVE MODULES (Full Width) -->
          <div id="projects" class="b-card b-modules b-col-span-4">
             <div class="b-labs-header">
               <h2 class="b-sec-title">Interactive Modules</h2>
               <p>Launch OS-level deep dives into specific system architectures.</p>
             </div>
             <div class="b-lab-grid">
               @for (app of allApps; track app.id) {
                 <button class="b-lab-btn" (click)="windowStore.open(app.id, {})">
                   <div class="b-lab-ico" [innerHTML]="iconService.get(app.id)"></div>
                   <span class="b-lab-lbl">{{app.label}}</span>
                 </button>
               }
             </div>
          </div>

        </main>
        
        <footer class="b-footer">
          <p>© 2026 NAVEEN SINGH. BUILT WITH THE NAV_OS ENGINE.</p>
          <button class="b-top-btn" (click)="scrollTo('home')">BACK_TO_TOP ↑</button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .bento-root { 
      background: #f8f9fa; color: #111; min-height: 100vh; display: flex; flex-direction: column; 
      overflow-x: hidden; scroll-behavior: smooth; font-family: 'Inter', var(--font-b);
    }
    .bento-container { max-width: 1240px; margin: 100px auto 40px; padding: 0 24px; width: 100%; }
    
    .bento-grid { 
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      grid-auto-rows: minmax(200px, auto);
      gap: 24px; 
    }

    .b-card { 
      background: #ffffff; 
      border: 1px solid rgba(0,0,0,0.06); 
      border-radius: 32px; 
      padding: 40px; 
      position: relative; 
      overflow: hidden; 
      box-shadow: 0 10px 40px rgba(0,0,0,0.02); 
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex; flex-direction: column; justify-content: center;
    }
    .b-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.1); }

    .b-col-span-2 { grid-column: span 2; }
    .b-col-span-4 { grid-column: span 4; }
    .b-row-span-2 { grid-row: span 2; }

    .b-sec-title { font-family: var(--font-m); font-size: 0.75rem; letter-spacing: 0.2em; color: #888; margin-bottom: 30px; font-weight: 700; text-transform: uppercase; }
    
    .b-hero { background: #000; color: #fff; justify-content: flex-end; padding: 60px 50px; }
    .b-hero:hover { border-color: #333; }
    .b-badge-wrap { display: flex; gap: 10px; margin-bottom: 30px; }
    .b-badge { padding: 8px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; font-family: var(--font-m); letter-spacing: 0.05em; }
    .b-badge.status { background: rgba(54, 217, 151, 0.1); color: var(--emerald); border: 1px solid rgba(54, 217, 151, 0.2); }
    .b-badge.role { background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); }
    .b-title { font-family: var(--font-d); font-size: 4rem; line-height: 1; margin: 0 0 20px 0; letter-spacing: -0.03em; color: #fff; }
    .b-subtitle { font-size: 1.25rem; color: #aaa; max-width: 90%; margin-bottom: 40px; line-height: 1.5; }
    
    .b-actions { display: flex; gap: 15px; }
    .b-btn { padding: 16px 28px; border-radius: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
    .b-btn.primary { background: #fff; color: #000; border: none; }
    .b-btn.primary:hover { transform: scale(1.05); }
    .b-btn.primary .arr { transition: transform 0.3s; }
    .b-btn.primary:hover .arr { transform: translateX(4px); }
    .b-btn.secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
    .b-btn.secondary:hover { background: rgba(255,255,255,0.1); }
    
    .b-hero-glow { position: absolute; top: -50%; right: -20%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(86, 205, 250, 0.15) 0%, transparent 70%); pointer-events: none; }

    .b-metric { align-items: center; justify-content: center; text-align: center; gap: 10px; }
    .b-metric-val { font-family: var(--font-d); font-size: 4rem; font-weight: 900; line-height: 1; color: #000; letter-spacing: -0.05em; }
    .b-metric-lbl { font-family: var(--font-m); font-size: 0.75rem; color: #888; font-weight: 700; letter-spacing: 0.1em; line-height: 1.4; }
    .b-metric-icon { font-size: 2rem; margin-top: 10px; opacity: 0.8; }

    .b-about { justify-content: flex-start; }
    .b-about-text { font-size: 1.1rem; line-height: 1.6; color: #444; }
    .b-about-text ::ng-deep strong { color: #000; font-weight: 800; }

    .b-link-btn { margin-top: 20px; align-self: flex-start; padding: 10px 20px; border-radius: 10px; background: #000; color: #fff; border: none; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
    .b-link-btn:hover { background: #333; transform: translateX(5px); }
    .b-link-btn .arr { transition: transform 0.3s; }

    .b-skills { justify-content: flex-start; }
    .b-pill-grid { display: flex; flex-wrap: wrap; gap: 12px; }
    .b-pill { padding: 12px 24px; border-radius: 20px; font-size: 1rem; font-weight: 600; background: #f0f2f5; color: #444; transition: all 0.3s; border: 1px solid transparent; }
    .b-pill:hover { transform: translateY(-2px) scale(1.05); background: #fff; border-color: #ddd; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
    .b-pill.primary { background: #000; color: #fff; }
    .b-pill.primary:hover { background: #333; border-color: #000; }

    .b-exp { justify-content: flex-start; }
    .b-timeline { display: flex; flex-direction: column; gap: 40px; position: relative; }
    .b-timeline::before { content: ''; position: absolute; left: 6px; top: 10px; bottom: 10px; width: 2px; background: #eee; }
    .b-time-item { display: flex; gap: 24px; position: relative; }
    .b-time-dot { width: 14px; height: 14px; background: #000; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 0 0 1px #eee; position: relative; z-index: 2; margin-top: 4px; }
    .b-time-content { flex: 1; }
    .b-time-meta { font-family: var(--font-m); font-size: 0.75rem; color: #888; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.05em; }
    .b-time-role { font-size: 1.6rem; margin: 0 0 4px 0; color: #000; font-weight: 900; }
    .b-time-org { font-size: 1rem; font-weight: 700; color: #666; margin-bottom: 12px; }
    .b-time-content p { font-size: 1.05rem; color: #555; line-height: 1.6; }
    .b-time-content p ::ng-deep strong { color: #000; font-weight: 700; }

    .b-contact { justify-content: flex-start; }
    .b-contact-content { display: flex; flex-direction: column; gap: 20px; }
    .b-contact-links { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
    .b-contact-links a { color: #000; font-weight: 800; font-size: 1.1rem; text-decoration: underline; }
    .b-btn.small { padding: 10px 20px; font-size: 0.85rem; }

    .b-settings { justify-content: flex-start; }
    .b-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .b-sett-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 15px; background: #fafafa; border: 1px solid #eee; border-radius: 16px; cursor: pointer; transition: all 0.2s; }
    .b-sett-btn:hover { background: #000; color: #fff; border-color: #000; }
    .b-sett-btn .icon { font-size: 1.2rem; }
    .b-sett-btn .label { font-family: var(--font-m); font-size: 0.55rem; font-weight: 800; letter-spacing: 0.1em; }

    .b-modules { background: #fafbfc; border-color: #eaeaea; justify-content: flex-start; padding: 50px; }
    .b-labs-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
    .b-labs-header p { color: #666; font-size: 1.1rem; }
    .b-lab-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .b-lab-btn { display: flex; align-items: center; gap: 16px; padding: 20px; background: #fff; border: 1px solid #eee; border-radius: 20px; cursor: pointer; transition: all 0.3s; text-align: left; }
    .b-lab-btn:hover { border-color: #ccc; box-shadow: 0 15px 30px rgba(0,0,0,0.04); transform: translateY(-4px); }
    .b-lab-ico { width: 28px; height: 28px; color: #000; }
    ::ng-deep .b-lab-ico svg { width: 100%; height: 100%; }
    .b-lab-lbl { font-size: 1rem; font-weight: 700; color: #222; }

    .b-footer { margin-top: 60px; text-align: center; padding-bottom: 40px; font-family: var(--font-m); font-size: 0.75rem; color: #aaa; letter-spacing: 0.1em; font-weight: 600; display: flex; flex-direction: column; align-items: center; gap: 20px; }
    .b-top-btn { padding: 8px 16px; border-radius: 20px; background: rgba(0,0,0,0.05); color: #888; font-size: 0.65rem; font-weight: 800; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
    .b-top-btn:hover { background: #000; color: #fff; border-color: #000; transform: translateY(-3px); }

    .b-ai-stream { background: #0a0a0a; border-color: #333; color: #00f2ff; justify-content: space-between; padding: 30px; }
    .ai-stream-hdr { display: flex; align-items: center; gap: 12px; }
    .ai-stream-dot { width: 8px; height: 8px; background: #00f2ff; border-radius: 50%; box-shadow: 0 0 10px #00f2ff; animation: pulse 2s infinite; }
    .no-margin { margin: 0 !important; color: #666; }
    .ai-thought-wrap { flex: 1; display: flex; align-items: center; padding: 20px 0; }
    .ai-thought { font-family: var(--font-m); font-size: 1.1rem; line-height: 1.4; color: #fff; margin: 0; min-height: 3em; }
    .ai-stream-footer { display: flex; justify-content: space-between; font-family: var(--font-m); font-size: 0.6rem; color: #444; letter-spacing: 0.1em; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .b-langs { justify-content: flex-start; }
    .lang-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
    .lang-btn { padding: 8px; border-radius: 8px; border: 1px solid #eee; background: #fafafa; font-family: var(--font-m); font-size: 0.6rem; font-weight: 800; cursor: pointer; transition: all 0.2s; }
    .lang-btn:hover { background: #eee; }
    .lang-btn.active { background: #000; color: #fff; border-color: #000; }

    .b-featured { background: linear-gradient(135deg, #fff 0%, #f0f7ff 100%); border-color: #d0e7ff; justify-content: space-between; }
    .feat-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .feat-status { font-family: var(--font-m); font-size: 0.6rem; font-weight: 800; color: var(--emerald); margin-bottom: 10px; }
    .feat-name { font-family: var(--font-d); font-size: 1.8rem; margin: 0 0 10px 0; color: #000; line-height: 1.1; }
    .feat-desc { font-size: 0.9rem; color: #666; margin-bottom: 20px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .feat-tags { display: flex; gap: 8px; }
    .feat-tag { font-size: 0.65rem; font-weight: 700; background: rgba(0,0,0,0.05); padding: 4px 10px; border-radius: 6px; color: #444; }

    @media (max-width: 1024px) {
      .bento-grid { grid-template-columns: repeat(2, 1fr); }
      .b-col-span-4 { grid-column: span 2; }
    }
    @media (max-width: 768px) {
      .bento-grid { grid-template-columns: 1fr; }
      .b-col-span-2, .b-col-span-4 { grid-column: span 1; }
      .b-row-span-2 { grid-row: span 1; }
      .b-title { font-size: 2.5rem; }
      .b-card { padding: 30px; }
      .b-actions { flex-direction: column; }
    }
  `]
})
export class BentoModeComponent implements OnInit, OnDestroy {
  windowStore = inject(WindowStore);
  settings = inject(SettingsService);
  iconService = inject(IconService);
  ts = inject(TranslationService);
  resumeService = inject(ResumeService);

  allApps = [
    { id: 'about', label: 'About' }, { id: 'exp', label: 'Experience' }, { id: 'proj', label: 'Projects' }, { id: 'skills', label: 'Skills' },
    { id: 'sys', label: 'Overview' }, { id: 'adr', label: 'ADR' }, { id: 'ai', label: 'AI Lab' }, { id: 'perf', label: 'Metrics' }, { id: 'term', label: 'Terminal' },
    { id: 'sch', label: 'Booking' }, { id: 'nai', label: 'NaveenAI' }, { id: 'match', label: 'Match' }, { id: 'contact', label: 'Contact' },
  ];

  availableLangs: Lang[] = ['EN', 'HI', 'ZH', 'ES', 'AR', 'FR', 'DE', 'JP', 'PT', 'RU'];

  projects = computed(() => {
    const data = this.ts.getTranslations();
    return (data && data.projects_data) ? data.projects_data : [];
  });

  private featIndex = signal(0);
  featuredProject = computed(() => this.projects()[this.featIndex()]);

  private thoughts = [
    "Optimizing RAG retrieval patterns for banking compliance...",
    "Angular 21 zoneless change detection confirmed stable.",
    "Analyzing token throughput for multi-modal LLM interfaces.",
    "Refactoring MFE architecture to support independent deployments.",
    "Integrating FAISS IVF-PQ indexing for 50ms vector searches.",
    "Synthesizing architectural decisions for NAV_OS v26.0.",
    "Ensuring 100% hydration coverage across high-traffic paths.",
    "Evaluating hallucination guardrails for production deployment."
  ];
  
  private thoughtIndex = signal(0);
  currentThought = computed(() => this.thoughts[this.thoughtIndex()]);
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.thoughtIndex.set((this.thoughtIndex() + 1) % this.thoughts.length);
      if (this.projects().length > 0) {
        this.featIndex.set((this.featIndex() + 1) % Math.min(this.projects().length, 5));
      }
    }, 4500);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  scrollTo(id: string) { 
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  // Temporary helper for translate pipe replacement in template
  translate(key: string) {
    return this.ts.translate(key);
  }
}
