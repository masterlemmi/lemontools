import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { QuickCreateComponent } from '../quick-create/quick-create.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router,        private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }
    addInProgress: boolean = false;

  ngOnInit(): void {
    
  }

  goToAddPage(){
    const rt = `/people/add`;
    this.router.navigateByUrl(rt);
  }

  quickAdd(){
      this.addInProgress = true;
      const dialogRef = this.dialog.open(QuickCreateComponent, {
        width: '75%',
        data: {}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.addInProgress = false;
        console.log('The dialog was closed');
        console.log("result", result);
        if (result && result.success){
          this._snackBar.open("Success", '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } 
      });
    }

}


