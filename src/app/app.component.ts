import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'commercial-calendar';

  @HostListener('document:keydown.escape')
  private debug() {
    // document.documentElement.classList.toggle('debug');
  }
}
