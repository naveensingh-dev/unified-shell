import { Component, AfterViewInit, Inject, PLATFORM_ID, ElementRef, OnDestroy } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-advancing',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './advancing.html',
  styleUrl: './advancing.css',
})
export class Advancing implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private el: ElementRef
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initHeatmap();
      this.initStoryObserver();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  openResume(event: Event) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      (window as any).openResumeViewer?.();
    }
  }

  openGithub(repo: string = '') {
    const url = repo ? `https://github.com/macbook02082025-creator/${repo}` : 'https://github.com/macbook02082025-creator';
    window.open(url, '_blank');
  }

  private initStoryObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chapterId = entry.target.getAttribute('data-chapter');
          this.highlightChapter(chapterId);
        }
      });
    }, options);

    const chapters = this.el.nativeElement.querySelectorAll('.story-chapter');
    chapters.forEach((ch: HTMLElement) => this.observer?.observe(ch));
  }

  private highlightChapter(id: string | null) {
    if (!id) return;
    
    // Update Chapter Indicators
    const indicators = this.el.nativeElement.querySelectorAll('.story-ch-indicator');
    indicators.forEach((ind: HTMLElement) => {
      ind.classList.toggle('active', ind.getAttribute('data-for') === id);
    });

    // Pulse corresponding stat
    const stats = this.el.nativeElement.querySelectorAll('.story-stat');
    stats.forEach((stat: HTMLElement, index: number) => {
      stat.classList.toggle('highlight', (index + 1).toString() === id);
    });

    // Subtle background shift for left card
    const card = this.el.nativeElement.querySelector('.story-l-inner');
    if (card) {
      const colors = ['rgba(124,58,237,0.05)', 'rgba(8,145,178,0.05)', 'rgba(16,185,129,0.05)', 'rgba(217,119,6,0.05)'];
      const idx = parseInt(id) - 1;
      card.style.backgroundColor = colors[idx % colors.length];
    }
  }

  private initHeatmap() {
    const wrap = document.getElementById('gh-heatmap');
    if (!wrap) return;
    
    function rng(s: number) {
      s = Math.sin(s * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    }
    
    let html = '';
    for (let w = 0; w < 52; w++) {
      html += '<div class="gh-week">';
      for (let d = 0; d < 7; d++) {
        const s = rng(w * 7 + d + 1);
        let prob = (d < 5) ? 0.62 : 0.28;
        if (w >= 8 && w <= 18) prob = 0.82;
        if (w >= 30 && w <= 38) prob = 0.78;
        
        let lv = 0;
        if (s < prob) {
          const r2 = rng(w * 7 + d + 99);
          if (r2 < 0.15) lv = 4;
          else if (r2 < 0.35) lv = 3;
          else if (r2 < 0.6) lv = 2;
          else lv = 1;
        }
        html += `<div class="gh-day" data-l="${lv}" title="${lv ? lv + ' contributions' : 'No contributions'}"></div>`;
      }
      html += '</div>';
    }
    wrap.innerHTML = html;
  }
}
