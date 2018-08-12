import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-player></app-player>
    <app-canvas></app-canvas>
  `,
  styles: [
    `:host {
      position: absolute;
      top: 1rem;
      right: 1rem;
      bottom: 1rem;
      left: 1rem;
    }`
  ]
})
export class AppComponent implements OnInit{
  ngOnInit() {

  }
}
