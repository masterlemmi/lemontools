import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogUpdateChapter, TrackerComponent } from './tracker/tracker.component';
import { SharedModule } from 'app/shared/shared.module';
import { MangaRoutingModule } from './manga-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [TrackerComponent, DialogUpdateChapter],
  imports: [
    CommonModule,
    SharedModule,
    MangaRoutingModule,
  ],
  exports: [SharedModule]
})
export class MangaModule { }
