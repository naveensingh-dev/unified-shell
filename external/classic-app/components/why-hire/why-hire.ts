import { Component, AfterViewInit, Inject, PLATFORM_ID, ElementRef, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-why-hire',
  standalone: true,
  imports: [],
  templateUrl: './why-hire.html',
  styleUrl: './why-hire.css',
})
export class WhyHire implements AfterViewInit, OnDestroy {
  private animationFrameId: number | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private el: ElementRef
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initCubePhysics();
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initCubePhysics() {
    const cube = this.el.nativeElement.querySelector('#whyCube3d');
    const scene = this.el.nativeElement.querySelector('#whyCubeScene');
    if (!cube || !scene) return;

    let dragging = false;
    let lastX = 0, lastY = 0;
    let rotX = -20, rotY = 0;
    let velX = 0, velY = 0.5; // Initial velocity for auto-rotation
    const friction = 0.95;
    const autoSpinSpeed = 0.5;

    const update = () => {
      if (!dragging) {
        // Apply friction to user-generated velocity
        velX *= friction;
        velY *= friction;

        // Blend back into auto-rotation
        // If velocity drops below auto-speed, gently nudge it back
        if (Math.abs(velY) < autoSpinSpeed) {
          velY += (autoSpinSpeed - velY) * 0.05;
        }

        rotY += velY;
        rotX += velX;

        // Keep rotX within reasonable bounds
        rotX = Math.max(-40, Math.min(40, rotX));

        cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
      this.animationFrameId = requestAnimationFrame(update);
    };

    const startDrag = (x: number, y: number) => {
      dragging = true;
      lastX = x;
      lastY = y;
    };

    const moveDrag = (x: number, y: number) => {
      if (!dragging) return;

      const deltaX = x - lastX;
      const deltaY = y - lastY;

      velY = deltaX * 0.5;
      velX = -deltaY * 0.5;

      rotY += velY;
      rotX += velX;
      rotX = Math.max(-80, Math.min(80, rotX));

      cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      lastX = x;
      lastY = y;
    };

    const endDrag = () => {
      dragging = false;
    };

    scene.addEventListener('mousedown', (e: MouseEvent) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e: MouseEvent) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);

    scene.addEventListener('touchstart', (e: TouchEvent) => {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e: TouchEvent) => {
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', endDrag);

    update();
  }
}

