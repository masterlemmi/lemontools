import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { SpinnerService } from 'app/shared/services/spinner.service';

@Component({
  selector: 'person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() person: Person ;

  @Output() submitFormEvent = new EventEmitter<FormGroup>();


  myForm: FormGroup;
  doneLoadingCache: boolean = false;

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
      email: ['',	Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      address: new FormControl(''),
      photo: new FormControl(''),
      deceased: new FormControl(false),
      dateOfBirth: new FormControl(''),
      dateOfDeath: new FormControl(''),
      parents: new FormControl([]),
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
    this.peopleService.getAllPeople(true).subscribe(data=>{this.doneLoadingCache=true})
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
      email: this.person.email,
      address: this.person.address,
      photo: this.person.photo,
      age: this.person.age,
      deceased: this.person.deceased,
      dateOfBirth: this.datePipe.transform(this.person.dateOfBirth, 'yyyy-MM-dd'),
      dateOfDeath: this.datePipe.transform(this.person.dateOfDeath, 'yyyy-MM-dd'),
      parents: this.person.parents,
      children: this.person.children,
      links: this.person.links,
      relationships: this.person.relationships,
      notes: this.person.notes
    });
  }

  submitForm() {
    this.submitFormEvent.emit(this.myForm);
  }

  
  back() {
    this._location.back();
  }

  handleEnterKeyPress(e){
    // console.log(e.target);
    // if (!(e.target).is('textarea'))
        e.preventDefault(); 
  }

}


