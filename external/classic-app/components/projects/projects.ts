import { Component, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PORTFOLIO_DATA } from '../../data/portfolio-data';

interface DetailSegment {
  type: 'p' | 'h3';
  content: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements AfterViewInit {
  projects = PORTFOLIO_DATA.projects;
  selectedProject = this.projects[0];
  activeTab = 'about';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();
    }
  }

  selectProject(project: any) {
    this.selectedProject = project;
    this.activeTab = 'about'; 
    this.cdr.detectChanges();
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  getFormattedAbout(text: string): DetailSegment[] {
    if (!text) return [];
    return text.split('\n\n').map(part => {
      if (part.startsWith('### ')) {
        return { type: 'h3', content: part.replace('### ', '') };
      }
      return { type: 'p', content: part };
    });
  }

  getBlueprintGroups(project: any) {
    return project.blueprint?.groups || [];
  }

  getBlueprintConnections(project: any) {
    if (!project || !project.blueprint || !project.blueprint.connections) return [];
    
    return project.blueprint.connections.map((c: any) => {
      const fromNode = project.blueprint.nodes[c.from];
      const toNode = project.blueprint.nodes[c.to];
      
      if (!fromNode || !toNode) return null;

      // Smart Bezier Routing: Using mid-point curves to ensure wires don't overlap too much
      const midY = (fromNode.y + toNode.y) / 2;
      const path = `M ${fromNode.x} ${fromNode.y} C ${fromNode.x} ${midY}, ${toNode.x} ${midY}, ${toNode.x} ${toNode.y}`;

      return {
        d: path,
        label: c.label || '',
        labelX: (fromNode.x + toNode.x) / 2,
        labelY: midY
      };
    }).filter((c: any) => c !== null);
  }

  getBlueprintHeight(project: any): number {
    if (!project || !project.blueprint || !project.blueprint.nodes || !project.blueprint.nodes.length) return 600;
    const maxY = Math.max(...project.blueprint.nodes.map((n: any) => n.y));
    const maxGroupY = project.blueprint.groups ? Math.max(...project.blueprint.groups.map((g: any) => g.y + g.h)) : 0;
    return Math.max(maxY + 150, maxGroupY + 100, 800);
  }

  private initIntersectionObserver() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in-view');
          obs.disconnect();
        }
      });
    }, { threshold: 0.1 });

    const el = document.getElementById('projects');
    if (el) obs.observe(el);
  }
}
