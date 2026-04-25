import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

/**
 * Global application configuration.
 * 
 * Performance Optimization:
 * - Switching to provideZonelessChangeDetection() removes zone.js dependency.
 *   This reduces bundle size and eliminates the overhead of change detection 
 *   cycles triggered by every async event, significantly improving TBT.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter([])
  ]
};
