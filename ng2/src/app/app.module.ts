import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { WebcamComponent } from './webcam/webcam.component';
import { CubeComponent } from './webcam/cube/cube.component';

@NgModule({
  declarations: [
    AppComponent,
    WebcamComponent,
    CubeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
