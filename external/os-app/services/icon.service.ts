import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class IconService {
  private sanitizer = inject(DomSanitizer);

  get(id: string): SafeHtml {
    const svgs: Record<string, string> = {
      // NaveenOS Logo -> Animated Neural Core NS
      os: `
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" stroke="url(#logo-grad-svc)" stroke-width="2" stroke-dasharray="10 6" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="15s" repeatCount="indefinite" />
          </circle>
          <g stroke="url(#logo-grad-svc)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M32 62 V38 L48 62 V38">
              <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M54 38 H68 V50 H54 V62 H68">
              <animate attributeName="stroke-dashoffset" values="100;0" dur="3s" repeatCount="indefinite" />
              <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="3s" repeatCount="indefinite" />
            </path>
          </g>
          <defs>
            <linearGradient id="logo-grad-svc" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#56cdfa;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8b93ff;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>`,

      // System Overview -> Apple System Preferences (Silver cog with depth)
      sys: `
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" fill="url(#sys-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
          <path d="M24 14v4m0 12v4m-10-10h4m12 0h4m-15.5-5.5 2.8 2.8m8.4 8.4 2.8 2.8m-14 0 2.8-2.8m8.4-8.4 2.8-2.8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="24" cy="24" r="5" stroke="white" stroke-width="2.5"/>
          <defs>
            <linearGradient id="sys-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stop-color="#8E8E93"/><stop offset="1" stop-color="#48484A"/>
            </linearGradient>
          </defs>
        </svg>`,
      
      // About Me -> Safari (Compass with 3D needle)
      about: `
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" fill="white"/>
          <circle cx="24" cy="24" r="18" fill="url(#safari-bg)"/>
          <path d="M24 10a14 14 0 1 0 0 28 14 14 0 0 0 0-28z" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
          <path d="M28 20l-8 8 3-11 5 3z" fill="#FF3B30"/>
          <path d="M20 28l8-8-3 11-5-3z" fill="#F2F2F7"/>
          <circle cx="24" cy="24" r="1.5" fill="white"/>
          <defs>
            <linearGradient id="safari-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stop-color="#007AFF"/><stop offset="1" stop-color="#00C7BE"/>
            </linearGradient>
          </defs>
        </svg>`,
      
      // Experience -> Launchpad (Rocket or Grid)
      exp: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#launch-grad)"/>
          <circle cx="14" cy="14" r="3" fill="white" fill-opacity="0.9"/>
          <circle cx="24" cy="14" r="3" fill="white" fill-opacity="0.9"/>
          <circle cx="34" cy="14" r="3" fill="white" fill-opacity="0.9"/>
          <circle cx="14" cy="24" r="3" fill="white" fill-opacity="0.9"/>
          <circle cx="24" cy="24" r="3" fill="white" fill-opacity="0.9"/>
          <circle cx="34" cy="24" r="3" fill="white" fill-opacity="0.9"/>
          <circle cx="14" cy="34" r="3" fill="white" fill-opacity="0.9"/>
          <circle cx="24" cy="34" r="3" fill="white" fill-opacity="0.9"/>
          <circle cx="34" cy="34" r="3" fill="white" fill-opacity="0.9"/>
          <defs>
            <linearGradient id="launch-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stop-color="#AF52DE"/><stop offset="1" stop-color="#5856D6"/>
            </linearGradient>
          </defs>
        </svg>`,
      
      // Projects -> Xcode (Blueprint blue with depth)
      proj: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#xcode-bg)"/>
          <path d="M12 12h24v24H12z" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="2 2"/>
          <path d="M12 18h24M12 24h24M12 30h24M18 12v24M24 12v24M30 12v24" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
          <path d="M16 14l16 20M32 14L16 34" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
          <defs>
            <linearGradient id="xcode-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stop-color="#007AFF"/><stop offset="1" stop-color="#0040DD"/>
            </linearGradient>
          </defs>
        </svg>`,
      
      // AI Research -> Siri (Neural colorful swirl)
      ai: `
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" fill="black"/>
          <circle cx="24" cy="24" r="18" fill="url(#siri-grad)" opacity="0.8">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/>
          </circle>
          <path d="M12 24c0-6.6 5.4-12 12-12s12 5.4 12 12-5.4 12-12 12-12-5.4-12-12z" stroke="white" stroke-width="0.5" opacity="0.3"/>
          <defs>
            <radialGradient id="siri-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 24) rotate(90) scale(18)">
              <stop stop-color="#5E5CE6"/><stop offset="0.5" stop-color="#BF5AF2"/><stop offset="1" stop-color="#FF375F"/>
            </radialGradient>
          </defs>
        </svg>`,
      
      // Performance -> Activity Monitor
      perf: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#1C1C1E"/>
          <path d="M8 30h6l4-14 6 20 4-10h12" stroke="#32D74B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 24h40" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        </svg>`,
      
      // Skills -> System Settings (Gray Gear)
      skills: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#8E8E93"/>
          <path d="M24 16a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" fill="rgba(0,0,0,0.1)"/>
          <path d="M24 20a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="white"/>
          <path d="M24 12v4m0 16v4m-8-12h4m12 0h4m-14-10l2.8 2.8m8.4 8.4l2.8 2.8m-14 0l2.8-2.8m8.4-8.4l2.8-2.8" stroke="white" stroke-width="3" stroke-linecap="round"/>
        </svg>`,
      
      // Book Call -> FaceTime (Green with video camera)
      sch: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#face-grad)"/>
          <path d="M14 18h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" fill="white"/>
          <path d="M28 22l6-3v10l-6-3v-4z" fill="white"/>
          <defs>
            <linearGradient id="face-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stop-color="#34C759"/><stop offset="1" stop-color="#28CD41"/>
            </linearGradient>
          </defs>
        </svg>`,
      
      // Resume -> Pages (Orange with lines)
      resume: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#pages-grad)"/>
          <path d="M14 16h20M14 22h20M14 28h12" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <defs>
            <linearGradient id="pages-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FF9F0A"/><stop offset="1" stop-color="#FF8E00"/>
            </linearGradient>
          </defs>
        </svg>`,
      
      // Milestones -> Photos (Colorful flower)
      tl: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="white"/>
          <circle cx="24" cy="24" r="5" fill="#FFD60A"/>
          <ellipse cx="24" cy="15" rx="4" ry="7" fill="#FF3B30" opacity="0.8"/>
          <ellipse cx="24" cy="33" rx="4" ry="7" fill="#5856D6" opacity="0.8"/>
          <ellipse cx="15" cy="24" rx="7" ry="4" fill="#FF9500" opacity="0.8"/>
          <ellipse cx="33" cy="24" rx="7" ry="4" fill="#34C759" opacity="0.8"/>
        </svg>`,
      
      // Why Me? -> App Store (Blue 'A' made of sticks)
      why: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#as-grad)"/>
          <path d="M24 12v24M14 30l20-12M34 30L14 18" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <defs>
            <linearGradient id="as-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stop-color="#007AFF"/><stop offset="1" stop-color="#00C7BE"/>
            </linearGradient>
          </defs>
        </svg>`,
      
      // NaveenAI -> Intelligence (Premium dark Siri)
      nai: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#000"/>
          <circle cx="24" cy="24" r="14" fill="url(#ai-grad)">
            <animate attributeName="r" values="12;15;12" dur="4s" repeatCount="indefinite"/>
          </circle>
          <defs>
            <radialGradient id="ai-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 24) rotate(90) scale(15)">
              <stop stop-color="#00f2ff"/><stop offset="1" stop-color="#7000ff"/>
            </radialGradient>
          </defs>
        </svg>`,
      
      // Contact -> Mail (Blue with envelope)
      contact: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#mail-grad)"/>
          <path d="M12 16l12 10 12-10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="12" y="16" width="24" height="16" rx="2" stroke="white" stroke-width="2.5"/>
          <defs>
            <linearGradient id="mail-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stop-color="#5AC8FA"/><stop offset="1" stop-color="#007AFF"/>
            </linearGradient>
          </defs>
        </svg>`,
      
      // Terminal -> Terminal (Black with prompt)
      term: `
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#2C2C2E" stroke="rgba(255,255,255,0.1)"/>
          <path d="M12 18l4 4-4 4m6 0h6" stroke="#32D74B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      
      // Desktop -> Finder Face (Two-tone blue)
      desktop: `
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M4 14c0-5.5 4.5-10 10-10h10v40H14c-5.5 0-10-4.5-10-10V14z" fill="#74BDFE"/>
          <path d="M24 4h10c5.5 0 10 4.5 10 10v20c0 5.5-4.5 10-10 10H24V4z" fill="#1D89F5"/>
          <path d="M16 16v2m16-2v2" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <path d="M12 28s4 4 12 4 12-4 12-4" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <path d="M24 4v32l-6 4" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        </svg>`
    };
    const svg = svgs[id] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>';
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
