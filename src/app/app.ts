import { 
  Component, 
  signal, 
  Inject, 
  PLATFORM_ID, 
  ApplicationRef, 
  EnvironmentInjector,
  runInInjectionContext,
  OnInit
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { DashboardComponent } from './components/dashboard/dashboard';

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
        <!-- PORTFOLIOS RENDERED HERE DYNAMICALLY -->
      </div>

      @if (view() !== 'dashboard') {
        <div class="exit-overlay" (mouseenter)="isOverlayHovered.set(true)" (mouseleave)="isOverlayHovered.set(false)">
          <button class="exit-btn" (click)="exitToDashboard()" [class.expanded]="isOverlayHovered()">
            <span class="exit-icon">↩</span>
            @if (isOverlayHovered()) {
              <span class="exit-text">Exit to Dashboard</span>
            }
          </button>
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
    }
    .exit-btn {
      background: rgba(124, 58, 255, 0.4); backdrop-filter: blur(10px);
      border: 1px solid rgba(124, 58, 255, 0.6); border-radius: 50px;
      color: #fff; cursor: pointer; padding: 12px; display: flex; align-items: center;
      gap: 10px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    }
    .exit-btn.expanded { padding: 12px 24px; background: rgba(124, 58, 255, 0.6); }
    .exit-icon { font-size: 20px; line-height: 1; }
    .exit-text { font-size: 13px; font-weight: 700; white-space: nowrap; font-family: 'JetBrains Mono', monospace; }
    .exit-btn:hover { border-color: #00f5ff; box-shadow: 0 0 25px rgba(0, 245, 255, 0.5); }
  `]
})
export class App implements OnInit {
  view = signal<'dashboard' | 'os' | 'classic'>('dashboard');
  isOverlayHovered = signal(false);
  private currentAppRef: ApplicationRef | null = null;
  private activeStyleTag: HTMLLinkElement | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private injector: EnvironmentInjector
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateRootClasses('dashboard');
    }
  }

  async onExperienceSelect(type: 'os' | 'classic') {
    if (!isPlatformBrowser(this.platformId)) return;

    // 1. STYLE WARMUP: Inject styles immediately
    this.injectAppStyles(type);

    try {
      await runInInjectionContext(this.injector, async () => {
        let rootComponent: any;
        let config: any;

        // Parallelize module imports for faster resolution
        if (type === 'os') {
          const [compMod, configMod] = await Promise.all([
            import('@os-app/app.component'),
            import('@os-app/app.config')
          ]);
          rootComponent = compMod.AppComponent;
          config = configMod.appConfig;
        } else {
          const [compMod, configMod] = await Promise.all([
            import('@classic-app/app'),
            import('@classic-app/app.config')
          ]);
          rootComponent = compMod.App;
          config = configMod.appConfig;
        }

        // 2. PREPARE VIEW
        this.view.set(type);
        this.updateRootClasses('portfolio');
        
        const container = this.document.getElementById('portfolio-container');
        if (container) {
          container.innerHTML = '<app-root></app-root>';
          window.scrollTo(0, 0);
        }

        // Give DOM and styles a moment to settle
        await new Promise(resolve => setTimeout(resolve, 50));

        // 3. BOOTSTRAP
        this.currentAppRef = await bootstrapApplication(rootComponent, config);
        
        // 4. LOADER PURGE
        this.purgePortoliosLoaders();
        
        console.log(`Successfully bootstrapped: ${type}`);
      });
    } catch (err) {
      console.error(`Bootstrap failed for ${type}:`, err);
      this.exitToDashboard();
    }
  }

  private purgePortoliosLoaders() {
    // Portfolios use #loader for their initial loading screens
    const loaders = this.document.querySelectorAll('#loader');
    loaders.forEach(ldr => {
      (ldr as HTMLElement).style.display = 'none';
      ldr.classList.add('gone');
    });
  }

  exitToDashboard() {
    if (this.currentAppRef) {
      this.currentAppRef.destroy();
      this.currentAppRef = null;
    }
    this.removeAppStyles();
    this.updateRootClasses('dashboard');
    window.scrollTo(0, 0);
    const container = this.document.getElementById('portfolio-container');
    if (container) container.innerHTML = '';
    this.view.set('dashboard');
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
}
