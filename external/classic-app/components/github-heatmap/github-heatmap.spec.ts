import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubHeatmap } from './github-heatmap';

describe('GithubHeatmap', () => {
  let component: GithubHeatmap;
  let fixture: ComponentFixture<GithubHeatmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GithubHeatmap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GithubHeatmap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
