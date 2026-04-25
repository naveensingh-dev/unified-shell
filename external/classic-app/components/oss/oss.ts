import { Component } from '@angular/core';

@Component({
  selector: 'app-oss',
  imports: [],
  templateUrl: './oss.html',
  styleUrl: './oss.css',
})
export class Oss {
  openGithub() {
    window.open('https://github.com/naveensingh-dev', '_blank');
  }
}
