import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-github-heatmap',
  imports: [],
  templateUrl: './github-heatmap.html',
  styleUrl: './github-heatmap.css',
})
export class GithubHeatmap implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initHeatmap();
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
