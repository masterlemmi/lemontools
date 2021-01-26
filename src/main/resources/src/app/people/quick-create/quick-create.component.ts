import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonSimple } from '../models/person-simple';
import { PeopleService } from '../services/people.service';

@Component({
  selector: 'quick-create',
  templateUrl: './quick-create.component.html',
  styleUrls: ['./quick-create.component.css']
})
export class QuickCreateComponent {
  genders = ['Male', 'Female'];
  model = new PersonSimple();
  model2 = { batchText: "" }
  submitted = false;
  batchMode = false;
  batchText = "";
  errorMsg2;
  errorMsg;


  constructor(
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<QuickCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


  onSubmit() {
    this.submitted = true;
    this.peopleService.createSimplePerson(this.model).subscribe(
      data => {
        this.peopleService.updateCache(data);
        this.dialogRef.close({ success: true, data: data, singleAdd: !this.batchMode });
      },
      err => {
        console.log(err);
        this.errorMsg = err;
        this.submitted = false;
      }
    )
  }

  onBatchSubmit() {
    this.submitted = true;
    this.peopleService.createPeopleFromList(this.model2.batchText).subscribe(
      data => {
        for (var p of data) {
          this.peopleService.updateCache(p);
        }
        this.dialogRef.close({ success: true, data: null });
      },
      err => {
        console.log("ERR:", err);
        this.errorMsg2 = err;
        this.submitted = false;
      }
    )
  }

}
