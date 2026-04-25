import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancingCards } from './advancing-cards';

describe('AdvancingCards', () => {
  let component: AdvancingCards;
  let fixture: ComponentFixture<AdvancingCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancingCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancingCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
