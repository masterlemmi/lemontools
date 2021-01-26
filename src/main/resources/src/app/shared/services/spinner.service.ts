import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerDialog } from '../spinner-dialog.component';


const RES_KEY: string = "RESOURCE_LIST";

@Injectable({ providedIn: 'root' })
export class SpinnerService {


  constructor(public dialog: MatDialog) { }

  public spin() {
    this.openDialog();
  }

  public stop(){
    this.closeDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(SpinnerDialog, { 
      width: '90%',
      disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  closeDialog(){
    this.dialog.closeAll();
  }
}


