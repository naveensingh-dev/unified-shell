import { Component } from '@angular/core';

@Component({
  selector: 'app-case-studies',
  standalone: true,
  imports: [],
  templateUrl: './case-studies.html',
  styleUrl: './case-studies.css',
})
export class CaseStudies {
  openLM(title: string) {
    (window as any).openLM?.(title);
  }
}
