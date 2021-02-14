import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogUpdateChapter, TrackerComponent } from './tracker/tracker.component';
import { SharedModule } from 'app/shared/shared.module';
import { MangaRoutingModule } from './manga-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AddMangaDialogComponent } from './tracker/add-manga-dialog/add-manga-dialog.component';



@NgModule({
  declarations: [TrackerComponent, DialogUpdateChapter, AddMangaDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MangaRoutingModule,
  ],
  exports: [SharedModule]
})
export class MangaModule { }
