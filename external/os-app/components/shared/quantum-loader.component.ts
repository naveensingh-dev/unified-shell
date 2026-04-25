import { Component, Input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantum-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container" [class.full-screen]="fullScreen">
      <div class="quantum-nexus">
        <!-- OUTER ROTATING RINGS -->
        <div class="ring outer"></div>
        <div class="ring middle"></div>
        <div class="ring inner"></div>
        
        <!-- DATA PARTICLES -->
        <div class="particle-system">
          @for (p of particles; track $index) {
            <div class="particle" [style.--delay]="$index * 0.2 + 's'" [style.--angle]="$index * 45 + 'deg'"></div>
          }
        </div>

        <!-- BIONIC CORE -->
        <div class="bionic-core">
          <div class="core-iris"></div>
          <div class="core-pupil"></div>
          <div class="core-glint"></div>
        </div>
      </div>

      <!-- DECRYPTING STATUS TEXT -->
      <div class="status-wrap">
        <div class="status-text">{{ currentStatus() }}</div>
        <div class="progress-track">
          <div class="progress-fill"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loader-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      width: 100%; height: 100%; min-height: 200px;
      background: rgba(2, 4, 10, 0.7); backdrop-filter: blur(15px);
      z-index: 9999; gap: 30px;
    }
    .loader-container.full-screen {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: #010206;
    }

    .quantum-nexus {
      position: relative; width: 120px; height: 120px;
      display: flex; align-items: center; justify-content: center;
    }

    /* RINGS */
    .ring {
      position: absolute; border-radius: 50%;
      border: 2px solid transparent;
    }
    .ring.outer {
      width: 120px; height: 120px;
      border-top-color: var(--ice);
      border-bottom-color: var(--ice);
      animation: spin 2s linear infinite;
      box-shadow: 0 0 20px rgba(86, 205, 250, 0.2);
    }
    .ring.middle {
      width: 90px; height: 90px;
      border-left-color: var(--violet);
      border-right-color: var(--violet);
      animation: spin 1.5s linear infinite reverse;
      opacity: 0.6;
    }
    .ring.inner {
      width: 60px; height: 60px;
      border-top-color: var(--ice);
      animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }

    /* BIONIC CORE */
    .bionic-core {
      position: relative; width: 30px; height: 30px;
      background: #000; border-radius: 50%;
      border: 1px solid var(--ice);
      box-shadow: 0 0 15px var(--ice);
      display: flex; align-items: center; justify-content: center;
      animation: pulse 1.5s ease-in-out infinite;
    }
    .core-iris {
      width: 18px; height: 18px; border-radius: 50%;
      background: radial-gradient(circle, var(--ice) 0%, transparent 70%);
      opacity: 0.8;
    }
    .core-pupil {
      position: absolute; width: 6px; height: 6px; background: #fff;
      border-radius: 50%; box-shadow: 0 0 10px #fff;
    }
    .core-glint {
      position: absolute; top: 20%; right: 20%; width: 4px; height: 4px;
      background: rgba(255,255,255,0.8); border-radius: 50%;
    }

    /* PARTICLES */
    .particle-system {
      position: absolute; inset: 0; animation: spin 10s linear infinite;
    }
    .particle {
      position: absolute; top: 50%; left: 50%;
      width: 4px; height: 4px; background: var(--ice);
      border-radius: 50%;
      offset-path: ray(var(--angle));
      animation: particleMove 2s infinite var(--delay);
      opacity: 0;
    }

    @keyframes particleMove {
      0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0); }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--angle)) translateY(60px); }
    }

    /* STATUS TEXT */
    .status-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 200px; }
    .status-text {
      font-family: var(--font-m); font-size: 0.65rem; color: var(--ice);
      letter-spacing: 0.3em; font-weight: 800; text-transform: uppercase;
      text-align: center; height: 1.2em;
    }
    .progress-track { width: 100%; height: 2px; background: rgba(255,255,255,0.05); overflow: hidden; border-radius: 2px; }
    .progress-fill { 
      width: 100%; height: 100%; background: var(--ice);
      box-shadow: 0 0 10px var(--ice);
      animation: progressAnim 2s ease-in-out infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }
    @keyframes progressAnim {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(0); }
      100% { transform: translateX(100%); }
    }
  `]
})
export class QuantumLoaderComponent implements OnInit, OnDestroy {
  @Input() fullScreen: boolean = false;
  @Input() label: string = 'INITIALIZING_NEURAL_LAYERS';

  particles = new Array(8);
  currentStatus = signal('');
  
  private statusMessages = [
    'FETCHING_DATA_SHARDS',
    'DECRYPTING_NEURAL_CORES',
    'SYNCHRONIZING_BUFFERS',
    'STABILIZING_QUANTUM_FIELD',
    'ESTABLISHING_BIONIC_LINK'
  ];
  private interval: any;

  ngOnInit() {
    this.currentStatus.set(this.label);
    let i = 0;
    this.interval = setInterval(() => {
      this.currentStatus.set(this.statusMessages[i % this.statusMessages.length]);
      i++;
    }, 800);
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}
