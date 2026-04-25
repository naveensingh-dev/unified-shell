import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <div class="onboarding-overlay" (click)="close()">
        <div class="onboarding-card" (click)="$event.stopPropagation()">
          <header class="onboarding-header">
            <div class="os-logo">NAV_OS</div>
            <h2>{{ slides[currentSlide()].title }}</h2>
          </header>
          
          <div class="onboarding-content">
            <p>{{ slides[currentSlide()].description }}</p>
            <div class="feature-tip" [innerHTML]="slides[currentSlide()].tip"></div>
          </div>

          <footer class="onboarding-footer">
            <div class="slide-dots">
              @for (s of slides; track $index) {
                <div class="dot" [class.active]="$index === currentSlide()"></div>
              }
            </div>
            <div class="footer-actions">
               @if (currentSlide() > 0) {
                 <button class="btn secondary" (click)="prev()">BACK</button>
               }
               <button class="btn primary" (click)="next()">
                 {{ currentSlide() === slides.length - 1 ? 'GET STARTED' : 'CONTINUE' }}
               </button>
            </div>
          </footer>
        </div>
      </div>
    }
  `,
  styles: [`
    .onboarding-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(20px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; animation: fadeIn 0.5s var(--ease);
    }
    .onboarding-card {
      width: 100%; max-width: 480px; background: rgba(20, 22, 30, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px;
      padding: 40px; box-shadow: 0 40px 100px rgba(0,0,0,0.8);
      display: flex; flex-direction: column; gap: 30px;
    }
    .os-logo { font-family: var(--font-m); font-size: 0.6rem; color: var(--ice); letter-spacing: 0.2em; margin-bottom: 10px; }
    h2 { font-family: var(--font-d); font-size: 2rem; color: #fff; margin: 0; }
    p { font-size: 1rem; color: var(--text2); line-height: 1.6; margin: 0; }
    .feature-tip { 
      background: rgba(255, 255, 255, 0.03); padding: 20px; border-radius: 12px; 
      border-left: 3px solid var(--ice); color: var(--text3); font-size: 0.85rem; font-family: var(--font-m);
    }
    .onboarding-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
    .slide-dots { display: flex; gap: 8px; }
    .dot { width: 6px; height: 6px; background: rgba(255,255,255,0.2); border-radius: 50%; transition: all 0.3s; }
    .dot.active { width: 24px; background: var(--ice); border-radius: 10px; }
    .footer-actions { display: flex; gap: 12px; }
    .btn { padding: 10px 24px; border-radius: 8px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn.primary { background: var(--ice); color: #000; }
    .btn.primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(86,205,250,0.3); }
    .btn.secondary { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class OnboardingComponent {
  private platformId = inject(PLATFORM_ID);
  isVisible = signal(false);
  currentSlide = signal(0);

  slides = [
    { 
      title: 'Welcome to NavOS', 
      description: 'A hyper-dimensional operating system simulating the mind of an Angular Architect.',
      tip: 'TIP: Explore the <b>Dock</b> at the bottom to launch various apps and labs.'
    },
    { 
      title: 'Power Searching', 
      description: 'Find anything instantly—skills, projects, or architectural decisions.',
      tip: 'TIP: Press <b>Cmd/Ctrl + K</b> to activate the Neural Spotlight search engine.'
    },
    { 
      title: 'Neural Assistant', 
      description: 'NaveenAI is integrated throughout. Ask it about my experience or specific tech stacks.',
      tip: 'TIP: Launch the <b>Terminal</b> or <b>NaveenAI</b> app to start a conversation.'
    }
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const seen = localStorage.getItem('nav_os_onboarded');
      if (!seen) this.isVisible.set(true);
    }
  }

  next() {
    if (this.currentSlide() < this.slides.length - 1) {
      this.currentSlide.update(v => v + 1);
    } else {
      this.close();
    }
  }

  prev() {
    if (this.currentSlide() > 0) {
      this.currentSlide.update(v => v - 1);
    }
  }

  close() {
    this.isVisible.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('nav_os_onboarded', 'true');
    }
  }
}
