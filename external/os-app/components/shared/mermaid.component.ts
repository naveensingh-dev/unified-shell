import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import mermaid from 'mermaid';

@Component({
  selector: 'app-mermaid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mermaid-container" [class.is-fullscreen]="fullscreen" #mermaidContainer>
      @if (!isBrowser) {
        <pre>{{ diagram }}</pre>
      }
    </div>
  `,
  styles: [`
    .mermaid-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: visible;
      background: transparent;
      padding: 20px;
    }
    .mermaid-container:not(.is-fullscreen) ::ng-deep svg {
      max-width: 100%;
      height: auto;
    }
    .mermaid-container.is-fullscreen ::ng-deep svg {
      width: auto !important;
      height: auto !important;
      max-width: none !important;
      min-width: 1200px; /* Force a base resolution for complex diagrams */
    }
    ::ng-deep .mermaid-container svg {
      filter: drop-shadow(0 0 10px rgba(0, 242, 255, 0.1));
    }
    /* ENHANCE SVG TEXT RENDERING */
    ::ng-deep .mermaid-container svg text {
      font-weight: 700 !important;
      letter-spacing: 0.5px !important;
    }
    ::ng-deep .mermaid-container .edgeLabel {
      color: #fff !important;
      font-weight: 800 !important;
      background-color: #050a14 !important;
      padding: 2px 4px !important;
    }
  `]
})
export class MermaidComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) diagram: string = '';
  @Input() fullscreen: boolean = false;
  @ViewChild('mermaidContainer') mermaidContainer!: ElementRef;

  isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    if (this.isBrowser) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 20, // Increased global font size
        flowchart: {
          useMaxWidth: false, // Ensure mermaid doesn't restrict itself
          htmlLabels: true,
          curve: 'basis'
        },
        themeVariables: {
          fontSize: '18px',
          primaryColor: '#00f2ff',
          primaryTextColor: '#fff',
          primaryBorderColor: '#00f2ff',
          lineColor: '#00f2ff',
          secondaryColor: '#1a1a2e',
          tertiaryColor: '#0f3460',
          mainBkg: '#050a14',
          nodeBorder: '#00f2ff',
          clusterBkg: 'rgba(0, 242, 255, 0.1)',
          clusterBorder: '#00f2ff',
          defaultLinkColor: '#00f2ff',
          titleColor: '#00f2ff',
          edgeLabelBackground: '#050a14',
          nodeTextColor: '#fff'
        }
      });
    }
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['diagram'] && !changes['diagram'].isFirstChange()) {
      this.render();
    }
  }

  private async render() {
    if (!this.isBrowser || !this.diagram || !this.mermaidContainer) return;

    try {
      const uniqueId = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      const { svg } = await mermaid.render(uniqueId, this.diagram);
      this.mermaidContainer.nativeElement.innerHTML = svg;
    } catch (error) {
      console.error('Mermaid rendering failed:', error);
      this.mermaidContainer.nativeElement.innerHTML = `<div style="color:var(--rose);font-size:0.8rem">Error rendering diagram</div>`;
    }
  }
}
