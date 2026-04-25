import { Type } from '@angular/core';

export const APP_REGISTRY: Record<string, () => Promise<Type<any>>> = {
  'about': () => import('./apps/about/about.component').then(m => m.AboutComponent),
  'exp': () => import('./apps/experience/experience.component').then(m => m.ExperienceComponent),
  'proj': () => import('./apps/projects/projects.component').then(m => m.ProjectsComponent),
  'skills': () => import('./apps/skills/skills.component').then(m => m.SkillsComponent),
  'term': () => import('./apps/terminal/terminal.component').then(m => m.TerminalComponent),
  'sys': () => import('./apps/system-overview/system-overview.component').then(m => m.SystemOverviewComponent),
  'adr': () => import('./apps/adr/adr.component').then(m => m.AdrComponent),
  'ai': () => import('./apps/ai-lab/ai-lab.component').then(m => m.AiLabComponent),
  'perf': () => import('./apps/perf-monitor/perf-monitor.component').then(m => m.PerfMonitorComponent),
  'sets': () => import('./apps/settings/settings.component').then(m => m.SettingsComponent),
  'nai': () => import('./apps/naveen-ai/naveen-ai.component').then(m => m.NaveenAiComponent),
  'contact': () => import('./apps/contact/contact.component').then(m => m.ContactComponent),
  'tl': () => import('./apps/timeline/timeline.component').then(m => m.TimelineComponent),
  'why': () => import('./apps/why-me/why-me.component').then(m => m.WhyMeComponent),
  'match': () => import('./apps/hire-match/hire-match.component').then(m => m.HireMatchComponent),
  'sch': () => import('./apps/scheduler/scheduler.component').then(m => m.SchedulerComponent),
};
