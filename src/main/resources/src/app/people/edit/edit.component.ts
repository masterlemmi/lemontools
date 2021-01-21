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
  person: Person = history.state.data;

  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _location: Location,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    
  ) {

  }

  ngOnInit(): void {
    this.person = history.state.data;
    const id = this.route.snapshot.paramMap.get('personId');
    if (!this.person) { //no data to show as edit return to profile
      this.router.navigate([`/people/profile/${id}`]);
    } else {
      this.peopleService.getAllPeople(true).subscribe(data => {});
    }
  }



  back() {
    this._location.back();
  }

}