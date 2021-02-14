import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MangaService } from 'app/manga/services/manga.service';
import { SpinnerService } from 'app/shared/services/spinner.service';

@Component({
  selector: 'app-add-manga-dialog',
  templateUrl: './add-manga-dialog.component.html',
  styleUrls: ['./add-manga-dialog.component.css']
})
export class AddMangaDialogComponent {

  chapterType: string = "latest";

  constructor(public dialogRef: MatDialogRef<AddMangaDialogComponent>,  private _snackBar: MatSnackBar,
     private spinnerService: SpinnerService, private mangaSvc: MangaService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  model = { chapter: '' }

  submitted = false;

  onSubmit() {
    this.spinnerService.spin();

    this.mangaSvc.addManga(this.model).subscribe( 
      data=> {
        this.spinnerService.stop();
        console.log("added")
        this.dialogRef.close();
      },
      err=>{
        this.spinnerService.stop();
        console.log("err");
        this._snackBar.open("There was a problem adding manga", '', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    )


  }

}