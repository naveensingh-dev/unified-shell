import { computed, effect, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed, withHooks } from '@ngrx/signals';
import { TranslationService } from '../services/translation.service';

export interface WindowConfig {
  id: string;
  title: string;
  icon: string;
  width: number;
  height: number;
  top: number;
  left: number;
  zIndex: number;
  focused: boolean;
  minimized: boolean;
  maximized: boolean;
  isDownload?: boolean;
  url?: string;
}

interface WindowState {
  windows: WindowConfig[];
  zIndexCounter: number;
  missionControl: boolean;
  isMobile: boolean;
  
  // CENTRALIZED DRAG/RESIZE STATE
  activeInteraction: {
    id: string;
    type: 'drag' | 'resize' | null;
    resizeDir?: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    startT: number;
    startL: number;
  };
}

const STORAGE_KEY = 'naveen_os_state_v2';

const initialState: WindowState = {
  windows: [],
  zIndexCounter: 200,
  missionControl: false,
  isMobile: false,
  activeInteraction: {
    id: '',
    type: null,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
    startT: 0,
    startL: 0
  }
};

export const WindowStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ windows }) => ({
    allWindows: computed(() => windows()),
    isWindowOpen: computed(() => (id: string) => windows().some(w => w.id === id)),
    focusedId: computed(() => windows().find(w => w.focused)?.id || null)
  })),
  withMethods((store) => {
    const ts = inject(TranslationService);

    return {
    setMobile(val: boolean) {
      patchState(store, { isMobile: val });
    },
    
    loadState() {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          patchState(store, { 
            windows: parsed.windows || [], 
            zIndexCounter: parsed.zIndexCounter || 200 
          });
        } catch (e) {
          console.error('Failed to restore OS state', e);
        }
      }
    },

    open(id: string, config: Partial<WindowConfig>) {
      if (store.missionControl()) {
        patchState(store, { missionControl: false });
      }
      
      const existing = store.windows().find(w => w.id === id);
      if (existing) {
        if (existing.focused && !existing.minimized) {
          this.toggleMinimize(id);
        } else {
          this.focus(id);
          if (existing.minimized) this.toggleMinimize(id);
        }
        return;
      }

      const nextZ = store.zIndexCounter() + 1;
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

      const isMobile = store.isMobile();
      let width = config.width || (isMobile ? vw : Math.min(vw * 0.85, 1200));
      let height = config.height || (isMobile ? vh - 32 : Math.min(vh * 0.80, 800));
      
      // AUTO-TRANSLATE TITLE BASED ON ID
      let title = config.title;
      if (!title) {
        if (id === 'about') title = ts.translate('topbar.about');
        else if (id === 'exp') title = ts.translate('topbar.experience');
        else if (id === 'proj') title = ts.translate('topbar.projects');
        else if (id === 'skills') title = ts.translate('topbar.skills');
        else if (id === 'ai') title = ts.translate('topbar.ai_research');
        else if (id === 'perf') title = ts.translate('dock.perf');
        else if (id === 'sys') title = ts.translate('dock.sys');
        else if (id === 'term') title = ts.translate('dock.term');
        else if (id === 'sets') title = ts.translate('topbar.settings');
        else if (id === 'sch') title = ts.translate('dock.sch');
        else if (id === 'nai') title = ts.translate('dock.nai');
        else if (id === 'match') title = ts.translate('dock.match');
        else if (id === 'contact') title = ts.translate('dock.contact');
        else if (id === 'tl') title = ts.translate('dock.tl');
        else if (id === 'why') title = ts.translate('dock.why');
      }
      
      title = title || 'App';
      let icon = config.icon || '📄';

      let top = config.top || Math.floor((vh - height) / 2);
      let left = config.left || Math.floor((vw - width) / 2);

      if (!isMobile && !config.top && !config.left && store.windows().length > 0) {
        const staggerOffset = (store.windows().length % 5) * 20;
        top += staggerOffset;
        left += staggerOffset;
      }

      const newWin: WindowConfig = {
        id, title, icon, width, height,
        top: isMobile ? 32 : Math.max(32, top),
        left: isMobile ? 0 : Math.max(0, left),
        zIndex: nextZ,
        focused: true,
        minimized: false,
        maximized: isMobile,
        isDownload: config.isDownload,
        url: config.url
      };

      patchState(store, (state) => ({
        windows: [...state.windows.map(w => ({ ...w, focused: false })), newWin],
        zIndexCounter: nextZ
      }));
    },
    
    close(id: string) {
      patchState(store, (state) => ({
        windows: state.windows.filter(w => w.id !== id)
      }));
    },
    
    closeAll() {
      patchState(store, { windows: [] });
    },

    focus(id: string) {
      const nextZ = store.zIndexCounter() + 1;
      patchState(store, (state) => ({
        windows: state.windows.map(w => ({
          ...w,
          focused: w.id === id,
          zIndex: w.id === id ? nextZ : w.zIndex
        })),
        zIndexCounter: nextZ
      }));
    },
    
    toggleMinimize(id: string) {
      patchState(store, (state) => ({
        windows: state.windows.map(w => 
          w.id === id ? { ...w, minimized: !w.minimized, focused: !w.minimized } : w
        )
      }));
    },

    minimizeAll() {
      patchState(store, (state) => ({
        windows: state.windows.map(w => ({ ...w, minimized: true, focused: false }))
      }));
    },

    toggleMaximize(id: string) {
      patchState(store, (state) => ({
        windows: state.windows.map(w => 
          w.id === id ? { ...w, maximized: !w.maximized } : w
        )
      }));
    },
    
    updatePosition(id: string, top: number, left: number) {
      patchState(store, (state) => ({
        windows: state.windows.map(w => 
          w.id === id ? { ...w, top, left } : w
        )
      }));
    },

    updateBounds(id: string, top: number, left: number, width: number, height: number) {
      patchState(store, (state) => ({
        windows: state.windows.map(w => 
          w.id === id ? { ...w, top, left, width, height } : w
        )
      }));
    },

    toggleMissionControl() {
      patchState(store, { missionControl: !store.missionControl() });
    },

    startDrag(id: string, x: number, y: number, t: number, l: number) {
      patchState(store, { 
        activeInteraction: { id, type: 'drag', startX: x, startY: y, startT: t, startL: l, startW: 0, startH: 0 } 
      });
    },
    startResize(id: string, dir: string, x: number, y: number, w: number, h: number, t: number, l: number) {
      patchState(store, { 
        activeInteraction: { id, type: 'resize', resizeDir: dir, startX: x, startY: y, startW: w, startH: h, startT: t, startL: l } 
      });
    },
    stopInteraction() {
      patchState(store, { activeInteraction: { id: '', type: null, startX: 0, startY: 0, startW: 0, startH: 0, startT: 0, startL: 0 } });
    }
    };
  }),
  withHooks({
    onInit(store) {
      store.loadState();
      effect((onCleanup) => {
        const state = { windows: store.windows(), zIndexCounter: store.zIndexCounter() };
        if (typeof window !== 'undefined') {
          const timer = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          }, 500);
          onCleanup(() => clearTimeout(timer));
        }
      });

      // DEFAULT STATE: Open 'about' if nothing is open on first start
      if (store.windows().length === 0) {
        setTimeout(() => store.open('about', { title: 'About Me', icon: '👤' }), 1000);
      }
    }
  })
);
