import { TestBed } from '@angular/core/testing';
import { WindowStore } from './window.store';

describe('WindowStore', () => {
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowStore]
    });
    store = TestBed.inject(WindowStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should open a window', () => {
    store.open('test-app', { title: 'Test App' });
    expect(store.windows().length).toBe(1);
    expect(store.windows()[0].id).toBe('test-app');
    expect(store.windows()[0].focused).toBe(true);
  });

  it('should close a window', () => {
    store.open('test-app', { title: 'Test App' });
    store.close('test-app');
    expect(store.windows().length).toBe(0);
  });

  it('should focus a window', () => {
    store.open('app1', { title: 'App 1' });
    store.open('app2', { title: 'App 2' });
    expect(store.windows().find((w: any) => w.id === 'app2').focused).toBe(true);
    
    store.focus('app1');
    expect(store.windows().find((w: any) => w.id === 'app1').focused).toBe(true);
    expect(store.windows().find((w: any) => w.id === 'app2').focused).toBe(false);
  });

  it('should toggle minimize', () => {
    store.open('test-app', { title: 'Test App' });
    store.toggleMinimize('test-app');
    expect(store.windows()[0].minimized).toBe(true);
    store.toggleMinimize('test-app');
    expect(store.windows()[0].minimized).toBe(false);
  });

  it('should debounce persistence', (done) => {
    const spy = spyOn(localStorage, 'setItem');
    store.open('test-app', { title: 'Test App' });
    
    // SetItem shouldn't be called immediately due to debounce
    expect(spy).not.toHaveBeenCalled();
    
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 600);
  });
});
