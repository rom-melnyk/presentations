import { interval, fromEvent, combineLatest, merge, } from 'rxjs';
import { map, startWith, } from 'rxjs/operators';

import { AudioAnalyser } from './audio-analyser';
import { VisualizerCanvas } from './visualizer-canvas';


function runDemo() {
  const audioEl = <HTMLAudioElement>document.querySelector('audio');
  const canvasEl = <HTMLCanvasElement>document.querySelector('canvas');

  const analyser = new AudioAnalyser(audioEl);
  const visualizer = new VisualizerCanvas(canvasEl);

  fetch('./audio/audio-src.json')
    .then((res: Response) => res.json())
    .then((files: string[]) => {
      audioEl.src = './audio/' + files[0];
      console.info(`Track ${files[0]} selected`);
    });

  const analyser$ = interval(40)
    .pipe(
      map(() => analyser.getFft()),
    );

  const kbd$ = merge(
    fromEvent(window, 'keyup'),
    fromEvent(window, 'keydown'),
  ).pipe(
    map((e: Event) => (<KeyboardEvent>e).shiftKey),
    startWith(false)
  );

  kbd$.subscribe((isShiftPressed: boolean) => {
    console.info(`Shift is ${isShiftPressed ? 'pressed' : 'released'}`);
  });

  combineLatest(analyser$, kbd$)
    .subscribe(([fftData, isShiftPressed]: [number[], boolean]) => {
      visualizer.drawBars(fftData, isShiftPressed);
    });
}


window.addEventListener('load', runDemo);
