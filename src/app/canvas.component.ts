import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  template: `
    <canvas></canvas>
  `,
  styles: [
    `canvas {
      width: 100%;
    }`
  ]
})
export class CanvasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
