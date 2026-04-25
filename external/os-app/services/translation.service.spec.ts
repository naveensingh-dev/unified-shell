import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TranslationService } from './translation.service';
import { PLATFORM_ID } from '@angular/core';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Clear localStorage to ensure clean state
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({
      providers: [
        TranslationService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', fakeAsync(() => {
    const req = httpMock.expectOne('/assets/i18n/en.json');
    req.flush({ 'key': 'val' });
    tick();
    expect(service).toBeTruthy();
  }));

  it('should load translations on init', fakeAsync(() => {
    const enReq = httpMock.expectOne('/assets/i18n/en.json');
    enReq.flush({ 'test': 'value' });
    tick();
    
    expect(service.translate('test')).toBe('value');
  }));

  it('should fallback to English for missing keys', fakeAsync(() => {
    // English load on init
    httpMock.expectOne('/assets/i18n/en.json').flush({ 'fallback': 'en-val' });
    tick();
    
    // Switch to HI
    service.setLang('HI');
    httpMock.expectOne('/assets/i18n/hi.json').flush({ 'something': 'hi-val' });
    tick();
    
    expect(service.translate('fallback')).toBe('en-val');
    expect(service.translate('something')).toBe('hi-val');
  }));

  it('should return key if translation is missing everywhere', fakeAsync(() => {
    httpMock.expectOne('/assets/i18n/en.json').flush({});
    tick();
    expect(service.translate('missing.key')).toBe('missing.key');
  }));
});
