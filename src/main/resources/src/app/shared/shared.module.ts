import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule, MaterialModule, HttpClientModule,
    FormsModule, ReactiveFormsModule 
  ],
  exports: [CommonModule, MaterialModule,HttpClientModule,
    FormsModule, ReactiveFormsModule ]
})
export class SharedModule { }
