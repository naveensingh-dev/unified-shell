import { Component, signal, computed, effect, ElementRef, ViewChild, inject, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { WindowStore } from '../../../store/window.store';
import { QuantumLoaderComponent } from '../../shared/quantum-loader.component';
import { MermaidComponent } from '../../shared/mermaid.component';
import { DiagramExplorerComponent } from '../../shared/diagram-explorer.component';

export interface ProjectIssue {
  anomalousEvent: string;
  thinkingApproach: string;
  solution: string;
}

export interface BlueprintNode {
  x: number;
  y: number;
  type: 'Input' | 'Process' | 'Decision' | 'Store' | 'Output';
  label: string;
  description: string;
}

export interface BlueprintConnection {
  from: number;
  to: number;
  label?: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  techStack: string[];
  status: 'PROD' | 'BETA' | 'DEV' | 'PRIVATE';
  syncRate: number;
  about: string; 
  challenges: {
    context: string;
    painPoint: string;
    resolution: string;
  };
  blueprint: {
    nodes: BlueprintNode[];
    connections: BlueprintConnection[];
    mermaidRaw?: string;
  };
  impact: {
    outcome: string;
    competitiveEdge: string;
  };
  issues: ProjectIssue[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateDirective, QuantumLoaderComponent, MermaidComponent, DiagramExplorerComponent],
  template: `
    <div class="integrated-terminal" [class.is-mobile]="isMobile()">
      <div class="terminal-bg-mesh"></div>
      <div class="terminal-scanline"></div>

      <!-- DESKTOP SIDEBAR -->
      @if (!isMobile()) {
        <aside class="system-hub">
          <header class="hub-header">
            <div class="status-box">
              <div class="pulse-dot"></div>
              <span class="hub-title" [appTranslate]="'projects.registry_title'"></span>
            </div>
          </header>

          <div class="hub-search">
            <input type="text" [appTranslateAttr]="{ placeholder: 'projects.search_placeholder' }" (input)="updateSearch($event)" spellcheck="false">
          </div>

          <nav class="hub-scroll custom-scrollbar">
            <div class="hub-list">
              @for (p of filteredProjects(); track p.id; let i = $index) {
                <div class="registry-item" 
                     [class.active]="selectedId() === p.id"
                     (click)="selectProject(p.id)">
                  <div class="active-indicator"></div>
                  <div class="item-content">
                    <div class="item-meta">
                      <span class="item-index">NODE_0{{ (i + 1) < 10 ? '0' + (i+1) : (i+1) }}</span>
                      <span class="item-status" [attr.data-status]="p.status">
                        [{{ p.status === 'PROD' ? 'PROD' : p.status === 'PRIVATE' ? 'PRIV' : p.status }}]
                      </span>
                    </div>
                    <div class="item-name">{{ p.name }}</div>
                  </div>
                </div>
              }
            </div>
          </nav>

          <footer class="hub-footer">
            <div class="f-stat"><span [appTranslate]="'projects.systems_active'"></span>: {{projects().length}}</div>
            <div class="f-stat"><span [appTranslate]="'common.uptime'"></span>: {{uptime()}}</div>
          </footer>
        </aside>
      }

      <!-- MAIN: DATA VAULT -->
      <main class="data-terminal">
        @if (selectedProject(); as p) {
          <!-- MOBILE TOP PROJECT SELECTOR -->
          @if (isMobile()) {
            <div class="mobile-project-switcher">
              <div class="switcher-header" (click)="toggleMobileRegistry()">
                <div class="current-info">
                  <span class="current-label" [appTranslate]="'projects.active_node'"></span>
                  <span class="current-name">{{ p.name }}</span>
                </div>
                <div class="switcher-icon" [class.open]="isRegistryOpen()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>
              
              @if (isRegistryOpen()) {
                <div class="mobile-registry-dropdown fade-in">
                  <div class="dropdown-scroll custom-scrollbar">
                    @for (proj of projects(); track proj.id) {
                      <div class="dropdown-item" 
                           [class.active]="selectedId() === proj.id"
                           (click)="selectProject(proj.id)">
                        <span class="d-status">[{{ proj.status === 'PROD' ? 'PROD' : proj.status === 'PRIVATE' ? 'PRIV' : proj.status }}]</span>
                        <span class="d-name">{{ proj.name }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }

          <div class="terminal-content" [class.glitch-anim]="isBooting()">
            <header class="content-header" [class.hidden-mobile]="isMobile()">
              <div class="title-zone">
                <h1 class="project-title">{{ p.name }}</h1>
                <p class="project-tagline">{{ p.tagline }}</p>
              </div>
              <div class="meta-zone">
                <div class="meta-tag"><span [appTranslate]="'projects.core_id'"></span>: {{ p.id.toUpperCase() }}</div>
                <div class="meta-tag status">AUTH_LEVEL: PRINCIPAL_ARCHITECT</div>
              </div>
            </header>

            <!-- DESKTOP TABS -->
            @if (!isMobile()) {
              <nav class="data-tabs">
                @for (tab of tabs; track tab) {
                  <button class="tab-trigger" 
                          [class.active]="activeTab() === tab"
                          (click)="setTab(tab)">
                    <span class="tab-text" [appTranslate]="'projects.tabs.' + tab.toLowerCase()"></span>
                  </button>
                }
              </nav>
            }

            <div class="content-viewport custom-scrollbar" #viewport (scroll)="handleScroll($event)">
              @if (isMobile()) {
                <div class="mobile-header-minimal fade-in">
                  <h1 class="m-title">{{ p.name }}</h1>
                  <p class="m-tagline">{{ p.tagline }}</p>
                  <div class="m-meta">
                    <span class="m-status" [attr.data-status]="p.status">{{ p.status }}</span>
                    <span class="m-id">ID:{{ p.id.toUpperCase() }}</span>
                  </div>
                </div>
              }

              <!-- ABOUT TAB -->
              @if (activeTab() === 'ABOUT') {
                <div class="tab-pane fade-in">
                  <div class="section-label" [appTranslate]="'projects.summary_label'"></div>
                  <div class="about-container">
                    <p class="about-text">{{ p.about }}</p>
                  </div>
                  
                  <div class="section-label" [appTranslate]="'projects.modules_label'"></div>
                  <div class="tech-cloud">
                    @for (t of p.techStack; track t) {
                      <div class="tech-tag">{{ t }}</div>
                    }
                  </div>
                </div>
              }

              <!-- CHALLENGES TAB -->
              @if (activeTab() === 'CHALLENGES') {
                <div class="tab-pane fade-in">
                  <div class="challenge-matrix">
                    <div class="c-box">
                      <div class="c-hdr" [appTranslate]="'projects.strategic_context'"></div>
                      <p>{{ p.challenges.context }}</p>
                    </div>
                    <div class="c-box warning">
                      <div class="c-hdr" [appTranslate]="'projects.client_pain'"></div>
                      <p>{{ p.challenges.painPoint }}</p>
                    </div>
                    <div class="c-box success">
                      <div class="c-hdr" [appTranslate]="'projects.resolution_path'"></div>
                      <p>{{ p.challenges.resolution }}</p>
                    </div>
                  </div>
                </div>
              }

              <!-- ARCHITECTURE TAB -->
              @if (activeTab() === 'ARCHITECTURE') {
                <div class="tab-pane fade-in">
                  <div class="arch-terminal" [class.is-zoomed]="isArchZoomed()">
                    <div class="arch-controls">
                      <div class="section-label">BLUEPRINT_LOGIC_FLOW</div>
                      <button class="zoom-toggle" (click)="p.blueprint.mermaidRaw ? showExplorer.set(true) : toggleArchZoom()">
                        {{ p.blueprint.mermaidRaw ? 'FULL_SCALE_SCAN' : (isArchZoomed() ? 'EXIT_FULL_SCAN' : 'ENHANCE_VIEW') }}
                      </button>
                    </div>

                    @if (isMobile() && !isArchZoomed() && !p.blueprint.mermaidRaw) {
                      <div class="mobile-hint fade-in">
                        <span class="hint-pulse"></span>
                        <span class="hint-text">DOUBLE_TAP_TO_ENHANCE</span>
                      </div>
                    }
                    
                    <div class="pipeline-scroller custom-scrollbar" (dblclick)="!p.blueprint.mermaidRaw && toggleArchZoom()">
                      @if (p.blueprint.mermaidRaw) {
                        <div class="mermaid-preview-container" (click)="showExplorer.set(true)">
                          <app-mermaid [diagram]="p.blueprint.mermaidRaw"></app-mermaid>
                          <div class="preview-overlay">
                             <div class="overlay-text">CLICK_TO_INITIALIZE_DEEP_SCAN</div>
                          </div>
                        </div>
                      } @else {
                        <div class="pipeline-container" [style.transform]="isArchZoomed() ? 'scale(2.25)' : 'scale(1)'">
                          <!-- HUD Overlay -->
                          @if (hoveredNode(); as node) {
                            <div class="node-info-hud fade-in" 
                                [style.left.px]="node.x + 20" 
                                [style.top.px]="node.y - 120"
                                [attr.data-type]="node.type">
                              <div class="hud-scanner"></div>
                              <div class="hud-header">
                                <span class="hud-stream">STREAM::{{node.label}}</span>
                              </div>
                              <div class="hud-body">
                                <p class="hud-desc">{{node.description}}</p>
                              </div>
                            </div>
                          }

                          <svg [attr.viewBox]="'0 0 800 ' + svgHeight()" [style.height.px]="svgHeight()" width="800" class="pipeline-svg">
                            <defs>
                              <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                <feMerge>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                              </filter>
                              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orientation="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#00f2ff" />
                              </marker>
                            </defs>

                            <!-- Connections -->
                            @for (conn of p.blueprint.connections; track $index) {
                              @if (p.blueprint.nodes[conn.from] && p.blueprint.nodes[conn.to]) {
                                <g class="flow-group">
                                  <path [attr.d]="getConnectionPath(p.blueprint.nodes[conn.from], p.blueprint.nodes[conn.to])" 
                                        class="flow-line animated" 
                                        stroke-dasharray="6,4"
                                        marker-end="url(#arrowhead)"
                                        filter="url(#glow)" />
                                  
                                  <circle r="3" fill="#00f2ff" class="flow-particle">
                                    <animateMotion dur="3s" repeatCount="indefinite" 
                                                  [attr.path]="getConnectionPath(p.blueprint.nodes[conn.from], p.blueprint.nodes[conn.to])" />
                                  </circle>
                                </g>
                              }
                            }
                            
                            <!-- Nodes -->
                            @for (node of p.blueprint.nodes; track $index) {
                              <g [attr.transform]="'translate(' + node.x + ', ' + node.y + ')'" 
                                class="node-group"
                                (mouseenter)="hoveredNode.set(node)"
                                (mouseleave)="hoveredNode.set(null)"
                                (click)="hoveredNode.set(node)">
                                
                                @if (node.type === 'Process') {
                                  <rect x="-65" y="-35" width="130" height="70" rx="4" class="node-shape process" filter="url(#glow)" />
                                } @else if (node.type === 'Decision') {
                                  <path d="M 0 -45 L 75 0 L 0 45 L -75 0 Z" class="node-shape decision" filter="url(#glow)" />
                                } @else if (node.type === 'Store') {
                                  <path d="M -55 -25 A 55 15 0 1 1 55 -25 L 55 25 A 55 15 0 1 1 -55 25 Z" class="node-shape store" filter="url(#glow)" />
                                  <ellipse cx="0" cy="-25" rx="55" ry="15" class="node-shape store-top" />
                                } @else {
                                  <rect x="-65" y="-35" width="130" height="70" rx="35" class="node-shape input-output" filter="url(#glow)" />
                                }
                                
                                <text y="5" class="node-text">{{ node.label }}</text>
                                <text y="48" class="node-type-label">{{ node.type }}</text>
                              </g>
                            }
                          </svg>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }

              <!-- IMPACT TAB -->
              @if (activeTab() === 'IMPACT') {
                <div class="tab-pane fade-in">
                  <div class="impact-terminal">
                    <div class="i-card success">
                      <div class="i-hdr">KPI_OUTCOME</div>
                      <p class="i-hero">{{ p.impact.outcome }}</p>
                    </div>
                    <div class="i-card">
                      <div class="i-hdr">STRATEGIC_DIFFERENTIATOR</div>
                      <p>{{ p.impact.competitiveEdge }}</p>
                    </div>
                  </div>
                </div>
              }

              <!-- ISSUES TAB -->
              @if (activeTab() === 'ISSUES') {
                <div class="tab-pane fade-in">
                  <div class="section-label" [appTranslate]="'projects.anomalous_event'"></div>
                  <div class="issues-console">
                    @for (issue of p.issues; track issue.anomalousEvent; let i = $index) {
                      <div class="console-entry">
                        <div class="e-hdr">
                          <span class="e-tag">STABILIZED</span>
                          <span class="e-title">{{ issue.anomalousEvent }}</span>
                        </div>
                        <div class="e-body">
                          <div class="e-section">
                            <span class="e-lbl" [appTranslate]="'projects.thinking_approach'"></span>: {{ issue.thinkingApproach }}
                          </div>
                          <div class="e-section success">
                            <span class="e-lbl" [appTranslate]="'projects.solution_path'"></span>: {{ issue.solution }}
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- MOBILE BOTTOM NAV -->
            @if (isMobile()) {
              <nav class="mobile-bottom-nav">
                @for (tab of tabs; track tab) {
                  <button class="nav-item" 
                          [class.active]="activeTab() === tab"
                          (click)="setTab(tab)">
                    <span class="nav-icon">
                      @if (tab === 'ABOUT') { ℹ️ }
                      @if (tab === 'CHALLENGES') { ⚡ }
                      @if (tab === 'ARCHITECTURE') { 📐 }
                      @if (tab === 'IMPACT') { 🎯 }
                      @if (tab === 'ISSUES') { 🛠️ }
                    </span>
                    <span class="nav-text" [appTranslate]="'projects.tabs.' + tab.toLowerCase()"></span>
                  </button>
                }
              </nav>
            }

            @if (showScrollToTop()) {
              <button class="scroll-top-btn fade-in" 
                      [style.bottom.px]="isMobile() ? 90 : 25"
                      (click)="scrollToTop()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              </button>
            }
          </div>

          <!-- FULLSCREEN EXPLORER -->
          @if (showExplorer() && p.blueprint.mermaidRaw) {
             <app-diagram-explorer 
                [diagram]="p.blueprint.mermaidRaw" 
                [projectId]="p.id"
                (close)="showExplorer.set(false)">
             </app-diagram-explorer>
          }
        }

        @if (isBooting()) {
          <app-quantum-loader [label]="'FETCHING_DOSSIER: ' + selectedId().toUpperCase()"></app-quantum-loader>
        }
      </main>
    </div>
  `,
  styles: [`
    :host { 
      display: block; height: 100%; width: 100%; overflow: hidden; 
      font-family: 'JetBrains Mono', monospace; color: #fff;
    }

    /* --- UI REFINEMENTS: CUSTOM SCROLLBAR --- */
    .custom-scrollbar {
      overflow-y: auto !important;
      scrollbar-width: thin;
      scrollbar-color: #00f2ff rgba(0, 242, 255, 0.05);
    }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 242, 255, 0.05); }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #00f2ff; border-radius: 10px; border: 2px solid #02040a; }

    /* --- LAYOUT ARCHITECTURE: TERMINAL INTERFACE --- */
    .integrated-terminal { 
      display: flex; height: 100%; width: 100%; background: #000; 
      position: relative; min-height: 0; 
      transform-style: preserve-3d;
    }
    .terminal-bg-mesh { position: absolute; inset: 0; background-image: radial-gradient(rgba(0, 242, 255, 0.05) 1.5px, transparent 1.5px); background-size: 40px 40px; pointer-events: none; }
    .terminal-scanline { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(0, 242, 255, 0.03) 50%, transparent); background-size: 100% 10px; animation: scanAnim 12s linear infinite; pointer-events: none; z-index: 10; }

    .system-hub { 
      width: 320px; background: #000; 
      border-right: 1px solid rgba(0, 242, 255, 0.1); 
      display: flex; flex-direction: column; z-index: 20; 
      backdrop-filter: blur(10px); min-height: 0;
      box-shadow: 20px 0 50px rgba(0,0,0,0.5);
    }
    .hub-header { padding: 40px 30px 20px; }
    .status-box { display: flex; align-items: center; gap: 12px; }
    .pulse-dot { width: 8px; height: 8px; background: #00f2ff; border-radius: 50%; box-shadow: 0 0 15px #00f2ff; animation: pulseGlow 2s infinite; }
    .hub-title { font-size: 0.75rem; font-weight: 800; color: #00f2ff; letter-spacing: 2px; }
    .hub-search { padding: 0 30px 25px; }
    .hub-search input { width: 100%; background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.2); padding: 12px 15px; color: #fff; font-size: 0.75rem; font-family: inherit; outline: none; border-radius: 4px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
    .hub-scroll { flex: 1; min-height: 0; }
    .registry-item { position: relative; padding: 22px 30px; cursor: pointer; border-bottom: 1px solid rgba(255, 255, 255, 0.03); transition: all 0.3s var(--ease); transform-style: preserve-3d; }
    .registry-item:hover { background: rgba(0, 242, 255, 0.04); transform: translateZ(20px) translateX(5px); }
    .registry-item.active { background: rgba(0, 242, 255, 0.08); box-shadow: inset 4px 0 0 #00f2ff, 10px 0 20px rgba(0,242,255,0.05); }
    .active-indicator { display: none; }
    .item-meta { display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center; transform: translateZ(10px); }
    .item-index { font-size: 0.6rem; color: rgba(255,255,255,0.4); }
    .item-status { font-size: 0.55rem; font-weight: 900; padding: 2px 6px; border-radius: 3px; }
    .item-status[data-status="PROD"] { color: #00ff88; background: rgba(0,255,136,0.1); }
    .item-name { font-size: 0.85rem; color: rgba(255,255,255,0.7); font-weight: 700; text-transform: uppercase; transform: translateZ(15px); }
    .hub-footer { padding: 20px 30px; border-top: 1px solid rgba(0,242,255,0.1); display: flex; justify-content: space-between; }
    .f-stat { font-size: 0.6rem; color: rgba(0, 242, 255, 0.5); }

    .mobile-project-switcher { position: sticky; top: 0; z-index: 100; background: rgba(2, 4, 10, 0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0, 242, 255, 0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .switcher-header { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
    .current-label { font-size: 0.55rem; color: #00f2ff; opacity: 0.6; display: block; }
    .current-name { font-size: 0.9rem; font-weight: 900; color: #fff; text-transform: uppercase; }
    .mobile-registry-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: rgba(2, 4, 10, 0.98); border-bottom: 1px solid rgba(0, 242, 255, 0.3); max-height: 60vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
    .dropdown-item { padding: 15px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .dropdown-item.active { background: rgba(0, 242, 255, 0.15); border-left: 4px solid #00f2ff; }

    .mobile-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 75px; background: rgba(10, 15, 25, 0.98); backdrop-filter: blur(25px); border-top: 1px solid rgba(255,255,255,0.1); display: flex; z-index: 1000; padding-bottom: env(safe-area-inset-bottom); box-shadow: 0 -10px 30px rgba(0,0,0,0.5); }
    .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); }
    .nav-item.active { color: #00f2ff; background: rgba(0, 242, 255, 0.05); }
    .nav-text { font-size: 0.55rem; font-weight: 800; text-transform: uppercase; margin-top: 2px; }

    .data-terminal { flex: 1; background: #000; display: flex; flex-direction: column; overflow: hidden; position: relative; min-height: 0; perspective: 1000px; }
    .terminal-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; min-height: 0; transform-style: preserve-3d; }
    .content-header { padding: 40px 60px; display: flex; justify-content: space-between; align-items: flex-start; transform: translateZ(30px); }
    .project-title { font-size: 2.2rem; font-weight: 900; line-height: 1; text-shadow: 0 10px 20px rgba(0,0,0,0.8); }
    .project-tagline { font-size: 0.9rem; color: #00f2ff; margin-top: 8px; }
    .data-tabs { display: flex; gap: 30px; padding: 0 60px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); transform: translateZ(20px); }
    .tab-trigger { color: rgba(255, 255, 255, 0.4); padding: 15px 0; font-size: 0.7rem; font-weight: 800; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .tab-trigger.active { color: #00f2ff; border-bottom-color: #00f2ff; transform: translateY(-2px); }

    .content-viewport { flex: 1; padding: 40px 60px; overflow-y: auto; min-height: 0; transform-style: preserve-3d; }
    .tab-pane { padding-bottom: 100px; transform-style: preserve-3d; }
    .section-label { font-size: 0.65rem; color: #00f2ff; font-weight: 900; letter-spacing: 3px; margin-bottom: 20px; border-left: 3px solid #00f2ff; padding-left: 12px; transform: translateZ(10px); }
    .about-text { font-size: 1rem; line-height: 1.8; color: rgba(255,255,255,0.8); white-space: pre-line; transform: translateZ(5px); }
    .tech-cloud { display: flex; flex-wrap: wrap; gap: 8px; transform: translateZ(15px); }
    .tech-tag { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; font-size: 0.65rem; border-radius: 4px; transition: all 0.3s; }
    .tech-tag:hover { background: rgba(0,242,255,0.1); border-color: #00f2ff; transform: translateZ(10px); }

    .challenge-matrix { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; transform-style: preserve-3d; }
    .c-box { 
      background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; 
      border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s var(--ease);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 20px -10px rgba(0,0,0,0.5);
      transform: translateZ(10px);
    }
    .c-box:hover { transform: translateZ(30px) scale(1.02); background: rgba(255,255,255,0.04); border-color: rgba(0, 242, 255, 0.3); }
    .c-hdr { font-size: 0.6rem; font-weight: 900; color: #00f2ff; margin-bottom: 10px; }
    .c-box p { font-size: 0.85rem; line-height: 1.6; }

    .arch-terminal { 
      background: #000; padding: 20px; border: 1px solid rgba(0,242,255,0.1); 
      border-radius: 8px; width: 100%; overflow: hidden; 
      transform: translateZ(10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .pipeline-scroller { width: 100%; overflow: auto; min-height: 400px; display: flex; justify-content: center; }
    .pipeline-container { position: relative; }
    
    .mermaid-preview-container { 
      width: 100%; min-width: 600px; position: relative; cursor: zoom-in; 
      background: rgba(0, 242, 255, 0.02); border: 1px dashed rgba(0, 242, 255, 0.2);
      transition: all 0.3s var(--ease); overflow: hidden;
    }
    .mermaid-preview-container:hover { border-color: #00f2ff; background: rgba(0, 242, 255, 0.05); }
    .preview-overlay { 
      position: absolute; inset: 0; background: rgba(0,0,0,0.4); 
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s; pointer-events: none;
    }
    .mermaid-preview-container:hover .preview-overlay { opacity: 1; }
    .overlay-text { 
      background: #00f2ff; color: #000; padding: 8px 16px; border-radius: 4px;
      font-size: 0.65rem; font-weight: 900; letter-spacing: 1px;
      box-shadow: 0 10px 20px rgba(0, 242, 255, 0.3);
    }

    .node-info-hud { position: absolute; width: 260px; background: rgba(5, 10, 20, 0.95); border: 1px solid #00f2ff; padding: 15px; z-index: 1000; pointer-events: none; border-radius: 8px; transform: translateZ(50px); }
    .hud-header { font-size: 0.6rem; color: #00f2ff; font-weight: 900; margin-bottom: 10px; }
    .hud-desc { font-size: 0.8rem; line-height: 1.5; margin: 0; }

    .node-shape { fill: #050a14; stroke: #00f2ff; stroke-width: 2; }
    .node-text { fill: #fff; font-size: 10px; text-anchor: middle; font-weight: 800; }
    .flow-line { fill: none; stroke: rgba(0,242,255,0.3); stroke-width: 1.5; }
    .flow-line.animated { stroke: #00f2ff; stroke-dasharray: 5; animation: flowDash 3s linear infinite; }

    .impact-terminal { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; transform-style: preserve-3d; }
    .i-card { 
      background: rgba(255,255,255,0.02); padding: 25px; border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.3s var(--ease);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
      transform: translateZ(10px);
    }
    .i-card:hover { transform: translateZ(30px); background: rgba(255,255,255,0.04); border-color: #00f2ff; }
    .i-hero { font-size: 1.2rem; font-weight: 900; }

    .issues-console { display: flex; flex-direction: column; gap: 15px; transform-style: preserve-3d; }
    .console-entry { 
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255, 255, 255, 0.05); 
      padding: 20px; border-radius: 8px; transition: all 0.3s var(--ease);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
      transform: translateZ(10px);
    }
    .console-entry:hover { transform: translateZ(25px); background: rgba(255,255,255,0.03); border-color: rgba(255, 255, 255, 0.1); }
    .e-tag { font-size: 0.5rem; color: #00ff88; border: 1px solid #00ff88; padding: 2px 6px; border-radius: 3px; }
    .e-title { font-size: 0.9rem; font-weight: 800; }
    .e-lbl { color: #00f2ff; font-weight: 900; font-size: 0.65rem; }
    .e-section { font-size: 0.85rem; margin-top: 8px; }

    .scroll-top-btn { position: fixed; right: 20px; bottom: 90px; width: 40px; height: 40px; background: #00f2ff; color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 1001; }

    @keyframes scanAnim { from { background-position: 0 0; } to { background-position: 0 100%; } }
    @keyframes flowDash { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }
    .fade-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .content-viewport { padding: 20px 20px 100px; }
      .content-header { display: none; }
      .challenge-matrix { grid-template-columns: 1fr; }
      .impact-terminal { grid-template-columns: 1fr; }
      .about-text { font-size: 0.9rem; }
      .arch-terminal { padding: 10px; }
      .pipeline-scroller { min-height: 300px; }
      .mermaid-preview-container { min-width: 100%; }
    }
  `]
})
export class ProjectsComponent {
  @ViewChild('viewport') viewport!: ElementRef;

  private windowStore = inject(WindowStore);
  private ts = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);
  isMobile = this.windowStore.isMobile;

  selectedId = signal('idp-platform');
  searchTerm = signal('');
  isBooting = signal(false);
  isRegistryOpen = signal(false);
  showScrollToTop = signal(false);
  showExplorer = signal(false);
  activeTab = signal<'ABOUT' | 'CHALLENGES' | 'ARCHITECTURE' | 'IMPACT' | 'ISSUES'>('ABOUT');
  uptime = signal('00:00:00');
  hoveredNode = signal<BlueprintNode | null>(null);
  isArchZoomed = signal(false);

  svgHeight = computed(() => {
    const p = this.selectedProject();
    if (!p) return 1000;
    const maxY = Math.max(...p.blueprint.nodes.map(n => n.y));
    return maxY + 150;
  });

  tabs: ('ABOUT' | 'CHALLENGES' | 'ARCHITECTURE' | 'IMPACT' | 'ISSUES')[] = 
    ['ABOUT', 'CHALLENGES', 'ARCHITECTURE', 'IMPACT', 'ISSUES'];

  projects = computed<Project[]>(() => {
    const data = this.ts.getTranslations();
    return (data && data.projects_data) ? data.projects_data : [];
  });

  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.projects();
    return this.projects().filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.id.toLowerCase().includes(term) ||
      p.techStack.some(t => t.toLowerCase().includes(term))
    );
  });

  selectedProject = computed(() => this.projects().find(p => p.id === this.selectedId()));

  constructor() {
    this.updateUptime();
    
    effect(() => {
      this.selectedId();
      this.activeTab();
      
      if (isPlatformBrowser(this.platformId) && this.viewport?.nativeElement) {
        this.viewport.nativeElement.scrollTop = 0;
      }

      this.isBooting.set(true);
      setTimeout(() => this.isBooting.set(false), 600);
    }, { allowSignalWrites: true });
  }

  toggleMobileRegistry() {
    this.isRegistryOpen.set(!this.isRegistryOpen());
  }

  selectProject(id: string) {
    if (this.selectedId() === id) {
      this.isRegistryOpen.set(false);
      return;
    }
    this.selectedId.set(id);
    this.activeTab.set('ABOUT');
    this.isRegistryOpen.set(false);
  }

  handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.showScrollToTop.set(target.scrollTop > 300);
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId) && this.viewport?.nativeElement) {
      this.viewport.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  updateSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  setTab(tab: 'ABOUT' | 'CHALLENGES' | 'ARCHITECTURE' | 'IMPACT' | 'ISSUES') {
    this.activeTab.set(tab);
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId) && this.viewport?.nativeElement) {
        this.viewport.nativeElement.scrollTop = 0;
      }
    }, 0);
  }

  toggleArchZoom() {
    this.isArchZoomed.set(!this.isArchZoomed());
    if (this.isArchZoomed()) {
      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) { const scroller = document.querySelector('.pipeline-scroller'); if (scroller) { scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2; } }
      }, 100);
    }
  }

  updateUptime() {
    if (isPlatformBrowser(this.platformId)) setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      this.uptime.set(`${h}:${m}:${s}`);
    }, 1000);
  }

  getConnectionPath(start: BlueprintNode, end: BlueprintNode): string {
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
  }
}
