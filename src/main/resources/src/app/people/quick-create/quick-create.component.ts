import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonSimple } from '../models/person-simple';
import { PeopleService } from '../services/people.service';

@Component({
  selector: 'quick-create',
  templateUrl: './quick-create.component.html',
  styleUrls: ['./quick-create.component.css']
})
export class QuickCreateComponent  {
  genders = ['Male', 'Female'];
  model = new PersonSimple();
  submitted = false;

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
      data=>{
        this.peopleService.updateCache(data);
        this.dialogRef.close({success: true, data: data});
      },
      err=> {
        console.log(err);
        this.submitted=false;
      }
    )


    
  }


}
