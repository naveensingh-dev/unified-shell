import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechPipeline } from './tech-pipeline';

describe('TechPipeline', () => {
  let component: TechPipeline;
  let fixture: ComponentFixture<TechPipeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechPipeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechPipeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
