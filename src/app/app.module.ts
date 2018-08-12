import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayerComponent } from './player.component';
import { CanvasComponent } from './canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
