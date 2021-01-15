import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  p: Person = new Person();
  myForm: FormGroup;
  namesListControl = new FormControl();
  filteredOptions: Observable<Name[]>;

  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _location: Location,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    this.myForm = this.fb.group({
      id: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nickname: ['', Validators.required],
      fullName: ['', Validators.required],
      initials: ['', Validators.required],
      photoUrl: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      age: ['', Validators.required],
      deceased: new FormControl(true),
      dateOfBirth: ['', Validators.required],
      dateOfDeath: ['', Validators.required],
      children: ['', Validators.required],
      links: ['', Validators.required],
      relationships: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.p = history.state.data;
    //remove after code changes
    this.mockData();
    this.filteredOptions = this.namesListControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '')
        })
      );
  }

  // filter and return the values
  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.peopleService.getAllPeople()
      .pipe(
        map(response => response.filter(person => {
          let arr = this.myForm.get("children").value;
          const isInArray = arr.find(x => x.firstName === person.firstName && x.lastName === person.lastName);
          return !isInArray && (person.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0
            || person.lastName.toLowerCase().indexOf(val.toLowerCase()) === 0
            || person.nickname.toLowerCase().indexOf(val.toLowerCase()) === 0)
        }))
      )
  }


  setFormValues() {
    this.myForm.patchValue({
      id: this.p.id,
      firstName: this.p.firstName,
      lastName: this.p.lastName,
      nickname: this.p.nickname,
      fullName: this.p.fullName,
      initials: this.p.initials,
      photoUrl: this.p.photoUrl,
      email: this.p.email,
      address: this.p.address,
      age: this.p.age,
      deceased: this.p.deceased,
      dateOfBirth: this.datePipe.transform(this.p.dateOfBirth, 'yyyy-MM-dd'),
      dateOfDeath: this.datePipe.transform(this.p.dateOfDeath, 'yyyy-MM-dd'),
      children: this.p.children,
      links: this.p.links,
      relationships: this.p.relationships,
      notes: this.p.notes
    });

  }

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    console.log('Form', form);
  }
  mockData() {
    this.peopleService.getPerson(2).subscribe(data => {
      console.log("received", data);
      this.p = data;
      this.setFormValues();
    });
  }

  back() {
    this._location.back();
  }

  deleteChild(s: PersonSimple) {
    let arr = this.myForm.get("children").value;

    let index = arr.findIndex(d => { d.firstName === s.firstName && d.lastName === s.lastName }); //find index in your array
    arr.splice(index, 1);//remove element from array

    this.myForm.patchValue({
      children: arr
    });
  }

  addChild(s: PersonSimple) {
    let arr = this.myForm.get("children").value;
    arr.push(s);

    this.myForm.patchValue({
      children: arr
    });
    this.namesListControl.setValue('')
  }

  createNewPerson() {
    const dialogRef = this.dialog.open(DialogCreatePerson, {
      width: '75%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("result", result);
      if (result != null){
        this.addChild(result);
      }
    });
  }

}


@Component({
  selector: 'dialog-create-person',
  templateUrl: 'dialog-create-person.html',
  styleUrls: ['./dialog-create-person.css']
})
export class DialogCreatePerson {
  genders = ['Male', 'Female'];
  model = new PersonSimple();
  submitted = false;

  constructor(
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<DialogCreatePerson>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

 
  onSubmit() { 
    this.submitted = true;
    this.peopleService.createSimplePerson(this.model).subscribe(
      data=>{
        this.peopleService.updateCache(data);
        this.dialogRef.close(data);
      },
      err=> {
        console.log(err);
        this.submitted=false;
      }
    )


    
  }


}

export class Hero {

  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public gender: string
  ) { }

}