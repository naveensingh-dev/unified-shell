import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowComponent } from './window.component';
import { WindowStore } from '../../store/window.store';
import { IconService } from '../../services/icon.service';
import { TranslateDirective } from '../../core/directives/translate.directive';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WindowComponent', () => {
  let component: WindowComponent;
  let fixture: ComponentFixture<WindowComponent>;
  let store: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowComponent, TranslateDirective],
      providers: [
        WindowStore,
        IconService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WindowComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(WindowStore);
    
    component.config = {
      id: 'test-app',
      title: 'Test App',
      icon: '📄',
      width: 800,
      height: 600,
      top: 100,
      left: 100,
      zIndex: 200,
      focused: true,
      minimized: false,
      maximized: false
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.win-lbl')?.textContent).toContain('Test App');
  });

  it('should call close on store when close button clicked', () => {
    const spy = spyOn(store, 'close');
    const closeBtn = fixture.nativeElement.querySelector('.win-btn.close');
    closeBtn.click();
    expect(spy).toHaveBeenCalledWith('test-app');
  });

  it('should call startDrag on mousedown on header', () => {
    const spy = spyOn(store, 'startDrag');
    const header = fixture.nativeElement.querySelector('.win-h');
    const event = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
    header.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });
});
