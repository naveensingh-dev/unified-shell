import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements AfterViewInit, OnDestroy {
  private animationFrameId: number | null = null;
  private prefersReducedMotion = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  openScheduler() {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).openCalendlyModal?.();
    }
  }

  openResume(event: Event) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      (window as any).openResumeViewer?.();
    }
  }
}
