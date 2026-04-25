import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [],
  templateUrl: './metrics.html',
  styleUrl: './metrics.css',
})
export class Metrics implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initCounters();
    }
  }

  private initCounters() {
    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.querySelectorAll('.metric-gauge-num[data-t]').forEach((el: any, i) => {
          const target = +el.dataset.t, suffix = el.dataset.s || '';
          const start = performance.now(), dur = 1600 + i * 200;
          setTimeout(() => {
            const frame = (now: number) => {
              const prog = Math.min((now - start) / dur, 1);
              const val = Math.round(easeOutCubic(prog) * target);
              el.textContent = val + suffix;
              if (prog < 1) requestAnimationFrame(frame);
            };
            requestAnimationFrame(frame);
          }, i * 120);
        });
        
        // Circular gauges
        en.target.querySelectorAll('.gauge-fill').forEach((el: any) => {
          const offset = el.getAttribute('data-active');
          el.style.setProperty('--gauge-offset', offset);
        });

        obs.disconnect();
      });
    }, { threshold: 0.15 });

    const mr = document.getElementById('metrics-row');
    if (mr) obs.observe(mr);
  }
}
