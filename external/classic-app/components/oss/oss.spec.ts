import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oss } from './oss';

describe('Oss', () => {
  let component: Oss;
  let fixture: ComponentFixture<Oss>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Oss]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Oss);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
