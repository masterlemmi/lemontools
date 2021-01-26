import { DataSource } from '@angular/cdk/table';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Manga } from '../model/manga';
import { MangaService } from '../services/manga.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {
  displayedColumns: string[] = ['hasUpdate', 'title', 'lastChapter', 'doneRead'];
  dataSource: DataSource<Manga>;
  refreshing: boolean = false;


  constructor(private mangaSvc: MangaService, 
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.dataSource = new MangaDataSource(mangaSvc.getAllManga());
  }

  ngOnInit(): void {
  }

  markDone(manga: Manga) {
    manga.hasUpdate = false;
    manga.lastChapter = "Updating..."
    this.mangaSvc.markDone(manga.id).subscribe(
      data => {
        manga.hasUpdate = data.hasUpdate;
        manga.lastChapter = data.lastChapter;
        manga.lastChapterUrl = data.lastChapterUrl;
      }
    )
  }

  fetchUpdates() {
    this.refreshing = true;
    let updates = this.mangaSvc.fetchUpdates().subscribe(
      data => {
        this.refreshing = false;
        this.dataSource = new MangaDataSource(this.mangaSvc.getAllManga());
        this._snackBar.open("Success", '', {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      },
      error => {
        this.refreshing = false;
        console.log(error);
        this._snackBar.open("There was a problem fetching updates", '', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      });
  }

  updateChapter(manga: Manga): void {
    const dialogRef = this.dialog.open(DialogUpdateChapter, {
      width: '100%',
      data: manga
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (result != null) {
        manga.hasUpdate = false;
        manga.lastChapter = "Updating ...";
        this.mangaSvc.updateChapter(result).subscribe(data => {
          manga.hasUpdate = data.hasUpdate;
          manga.lastChapter = data.lastChapter;
          manga.lastChapterUrl = data.lastChapterUrl;
        })
      }
    });
  }
}


export class MangaDataSource extends DataSource<Manga> {

  constructor(private data: Observable<Manga[]>) { super() }


  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Manga[]> {
    return this.data;
  }

  disconnect() { }
}


@Component({
  selector: 'update-chapter-dialog',
  templateUrl: 'update-chapter-dialog.html',
  styleUrls: ['./update-chapter-dialog.css']
})
export class DialogUpdateChapter {

  chapterType: string = "latest";

  constructor(
    public dialogRef: MatDialogRef<DialogUpdateChapter>,
    @Inject(MAT_DIALOG_DATA) public data: Manga) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  model = { url: 'latest' }

  submitted = false;

  onSubmit() {
    this.dialogRef.close({ id: this.data.id, chapter: this.model.url })
  }

}