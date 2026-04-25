import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Advancing } from './advancing';

describe('Advancing', () => {
  let component: Advancing;
  let fixture: ComponentFixture<Advancing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Advancing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Advancing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
