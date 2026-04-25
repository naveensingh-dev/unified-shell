import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoIntro } from './video-intro';

describe('VideoIntro', () => {
  let component: VideoIntro;
  let fixture: ComponentFixture<VideoIntro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoIntro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoIntro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
