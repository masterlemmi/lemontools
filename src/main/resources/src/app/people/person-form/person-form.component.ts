import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../services/people.service';
import { DatePipe, Location } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { PersonSimple } from '../models/person-simple';
import { Name } from '../models/names';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuickCreateComponent } from '../quick-create/quick-create.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() person: Person ;
  myForm: FormGroup;

  genders = ['Male', 'Female'];
  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _location: Location,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = this.fb.group({
      id: new FormControl(''),
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      nickname: new FormControl(''),
      photoUrl: new FormControl(''),
      email: ['',	Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      address: new FormControl(''),
      deceased: new FormControl(false),
      dateOfBirth: new FormControl(''),
      dateOfDeath: new FormControl(''),
      children: new FormControl([]),
      links: new FormControl([]),
      relationships: new FormControl([]),
      notes: new FormControl(''),
    });
  }

  ngOnInit(): void {
    console.log("form state received state", this.person);
    this.setFormValues();
    //drop down list of names to chose from
    this.peopleService.getAllPeople().subscribe(data=>{})
  
  }

  setFormValues() {
    this.myForm.patchValue({
      id: this.person.id,
      firstName: this.person.firstName,
      lastName: this.person.lastName,
      nickname: this.person.nickname,
      gender: this.person.gender,
      fullName: this.person.fullName,
      initials: this.person.initials,
      photoUrl: this.person.photoUrl,
      email: this.person.email,
      address: this.person.address,
      age: this.person.age,
      deceased: this.person.deceased,
      dateOfBirth: this.datePipe.transform(this.person.dateOfBirth, 'yyyy-MM-dd'),
      dateOfDeath: this.datePipe.transform(this.person.dateOfDeath, 'yyyy-MM-dd'),
      children: this.person.children,
      links: this.person.links,
      relationships: this.person.relationships,
      notes: this.person.notes
    });

  }

  submitForm() {

    this.peopleService.createOrUpdatePerson(this.myForm.value).subscribe(
      data => {
        this._snackBar.open("Success", '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this._location.back();
      }, 
      err => {
        this._snackBar.open("Error "  + err, '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
       
      }
    )
  }

  back() {
    this._location.back();
  }





}


