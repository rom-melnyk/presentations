import { fromEvent, of, interval } from 'rxjs';
import {
  map, mapTo,
  tap,
  filter,
  combineLatest, merge,
  pairwise,
} from 'rxjs/operators';

import { AudioSourceManager } from './audio-source-manager';
import { AudioAnalyser } from './audio-analyser';
import { IVisualizer, BarsVisualizer, WaveformVisualizer } from './visuzlizers';


function runDemo() {
  const trackPickerEl = <HTMLSelectElement>document.querySelector('select');
  const audioEl = <HTMLAudioElement>document.querySelector('audio');
  const visualizerTypeEls = <NodeList>document.querySelectorAll('[name=visualizer-type]');
  const defaultVisualiserTypeEl = <HTMLInputElement>document.querySelector('[name=visualizer-type][checked]');
  const canvasEl = <HTMLCanvasElement>document.querySelector('canvas');

  const audioSourceManager = new AudioSourceManager(trackPickerEl, audioEl);
  audioSourceManager.loadSources()
    .then(audioSourceManager.selectFirstTrack)
    .catch(console.error);

  const analyser = (new AudioAnalyser(audioEl)).getAnalyser();

  // -------- track visualizer type (radio buttons) --------
  type TVisualizerTypes = 'bars' | 'waveform';
  const visualizerTypes = <{ [key in TVisualizerTypes ]: IVisualizer }>{
    bars: new BarsVisualizer(canvasEl),
    waveform: new WaveformVisualizer(canvasEl),
  };
  const defaultVisualizerType = <TVisualizerTypes>defaultVisualiserTypeEl.value;
  let visualizer: IVisualizer = visualizerTypes[defaultVisualizerType];

  const visTypeEls$$ = (<Array<HTMLInputElement>>[...visualizerTypeEls]).map(
    (el) => fromEvent(el, 'change').pipe(
      map((e: Event) => ({ checked: el.checked, value: el.value })),
      filter(({ checked }) => checked),
      map(({ value }) => <TVisualizerTypes>value)
    )
  );
  of(defaultVisualizerType).pipe(
    merge(...visTypeEls$$)
  ).subscribe((type: TVisualizerTypes) => {
    visualizer = visualizerTypes[type];
  });

  // -------- track Shift keypress --------
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
    map(() => ({ '@': Date.now() })),
  );
  const analyser$ = interval(80)
    .pipe(
      map(() => {
        const fftData = visualizer.fetchFftData(analyser);
        return { '@': Date.now(), fftData };
      }),
      filter(({ fftData }) => visualizer.filter(fftData)),
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
    visualizer.draw(fftData, colorize);
  });
}


window.addEventListener('load', runDemo);
