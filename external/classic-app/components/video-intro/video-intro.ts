import { Component } from '@angular/core';

@Component({
  selector: 'app-video-intro',
  standalone: true,
  imports: [],
  templateUrl: './video-intro.html',
  styleUrl: './video-intro.css',
})
export class VideoIntro {
  openLinkedin() {
    window.open('https://www.linkedin.com/in/naveen-singh-57051ab9/', '_blank');
  }
}
