import { fromEvent, of, interval } from 'rxjs';
import {
  map, mapTo,
  tap,
  filter,
  combineLatest, merge,
  pairwise,
} from 'rxjs/operators';

import { AudioSourceManager } from './audio-source-manager';
import { BarsVisualizerType, WaveformVisualizerType } from './visuzlizer-types';
import { AudioAnalyser } from './audio-analyser';
import { Visualizer } from './visualizer';


const VIS_TYPE = {
  Bars: BarsVisualizerType,
  Waveform: WaveformVisualizerType
}['Waveform']; // CHANGE ME FOR DIFFERENT VISUALIZATION


function runDemo() {
  const trackPickerEl = <HTMLSelectElement>document.querySelector('select');
  const audioEl = <HTMLAudioElement>document.querySelector('audio');
  const canvasEl = <HTMLCanvasElement>document.querySelector('canvas');

  const audioSourceManager = new AudioSourceManager(trackPickerEl, audioEl);
  audioSourceManager.loadSources()
    .then(audioSourceManager.selectFirstTrack)
    .catch(console.error);

  const analyser = (new AudioAnalyser(audioEl)).getAnalyser();
  const visualizer = new Visualizer(canvasEl);

  // -------- keypress analyzer --------
  const keyUp$ = fromEvent(window, 'keyup')
    .pipe(
      mapTo(false)
    );
  const keyDown$ = fromEvent(window, 'keydown')
    .pipe(
      map((e: Event) => (<KeyboardEvent>e).shiftKey)
    );
  const kbd$ = of(false) // initial value
    .pipe(
      merge(keyUp$, keyDown$)
    );

    kbd$.pipe(
      pairwise()
    ).subscribe(([prev, current]) => {
      if (current) {
        console.log('---> Shift is pressed');
      } else if (prev) {
        console.log('<--- Shift was released');
      }
    });

  // -------- poll the analyser --------
  let fftCache: Array<number>;
  const timer$ = interval(40).pipe(
    map(() => ({'@': Date.now()})),
  );
  const analyser$ = interval(80)
    .pipe(
      map(() => {
        const fftData = VIS_TYPE.getFftData(analyser);
        return {
          '@': Date.now(),
          fftData
        };
      }),
      filter(({ fftData }) => VIS_TYPE.filter(fftData)),
      combineLatest(timer$),
      map(([analyserData, timer]): Array<number> => {
        if (timer['@'] > analyserData['@']) {
          return fftCache.map(x => x * .975);
        } else {
          return analyserData.fftData;
        }
      }),
      tap((data) => { fftCache = data; }),
      combineLatest(kbd$)
    );

  analyser$.subscribe(([fftData, colorize]: [Array<number>, boolean]) => {
    if (VIS_TYPE === BarsVisualizerType) {
      visualizer.drawBars(fftData, colorize);
    } else /*WaveformVisualizerType*/ {
      visualizer.drawWaveform(fftData, colorize);
    }
  });
}


window.addEventListener('load', runDemo);
