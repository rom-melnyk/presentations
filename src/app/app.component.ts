import { Component, OnInit, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-player (heightSet)="setCanvasHeight($event)" (analyserNodeSet)="setAnalyserNode($event)"></app-player>
    <app-canvas [style.height]="canvasHeight" [fftData]="fftData" [colorize]="colorize"></app-canvas>
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
export class AppComponent implements OnInit {
  public canvasHeight: string;
  public colorize = false;
  public fftData = new Uint8Array();

  /*@HostListener('window:keydown', ['$event.shiftKey']) onKeyDown(e) {
    console.log('down', e);
  }
  @HostListener('window:keyup', ['$event.shiftKey']) onKeyUp(e) {
    console.log('up', e);
  }*/

  constructor(
    private el: ElementRef,
  ) {}

  ngOnInit() {}

  setCanvasHeight(playerHeight: number) {
    const paddingCompensation = 8;
    const canvasHeight = this.el.nativeElement.offsetHeight - playerHeight - paddingCompensation;
    this.canvasHeight = `${canvasHeight}px`;
  }

  setAnalyserNode(analyserNode: AnalyserNode) {
    /*const arr = new Uint8Array(8);
    arr.forEach((x, i) => {
      arr[i] = Math.round(Math.random() * 256);
    });
    Promise.resolve()
      .then(() => {
        this.fftData = arr;
      });*/
  }
}
