import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Name } from 'app/people/models/names';
import { Person } from 'app/people/models/person';
import { PersonSimple } from 'app/people/models/person-simple';
import { QuickCreateComponent } from 'app/people/quick-create/quick-create.component';
import { PeopleService } from 'app/people/services/people.service';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'children-form',
  templateUrl: './children-form.component.html',
  styleUrls: ['./children-form.component.css']
})
export class ChildrenFormComponent implements OnInit {

  @Input() myForm: FormGroup;
  @Input() person: Person;
  namesListControl = new FormControl();

  filteredOptions: Observable<Name[]>;
  constructor(public dialog: MatDialog, private peopleService: PeopleService) { }

  ngOnInit(): void {
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
    let childrenArray: PersonSimple[] = this.myForm.get("children").value;
    let excludeList: PersonSimple[]  = Object.assign([], childrenArray);
    excludeList.push(this.person);
    return this.peopleService.searchCache(val, excludeList);
  }

  createNewPerson() {
    const dialogRef = this.dialog.open(QuickCreateComponent, {
      width: '75%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("result", result);
      if (result != null && result.singleAdd) {
        this.addChild(result.data);
      }
    });
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

}
