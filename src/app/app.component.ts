import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { interval } from 'rxjs';
import { map, combineLatest, filter } from 'rxjs/operators';

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
    const timer$ = interval(100)
      .pipe(
        map(() => {
          return { time: Date.now() };
        })
      );

    const fftData$ = interval(1000)
      .pipe(
        map(() => {
          const fftData = new Uint8Array(analyserNode.frequencyBinCount);
          analyserNode.getByteTimeDomainData(fftData);
          return {
            time: Date.now(),
            fftData
          };
        }),
        filter(({fftData}) => {
          const average = Array.prototype.reduce.call(fftData, (acc, x) => acc + x, 0) / fftData.length;
          return average > 128;
        }),
        combineLatest(timer$),
        map(([ fftData, timerData ]) => {
          return timerData.time > fftData.time
            ? this.fftData.map(x => (x - 128) * .9 + 128)
            : fftData.fftData;
        })
      )
      .subscribe((fftData) => {
        this.fftData = fftData;
      });
  }
}
