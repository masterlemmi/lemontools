import { Component, Input, OnInit } from '@angular/core';
import { Person } from 'app/people/models/person';

import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Name } from 'app/people/models/names';

import { PersonSimple } from 'app/people/models/person-simple';
import { QuickCreateComponent } from 'app/people/quick-create/quick-create.component';
import { PeopleService } from 'app/people/services/people.service';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Relation } from 'app/people/models/relation';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'relations-form',
  templateUrl: './relations-form.component.html',
  styleUrls: ['./relations-form.component.css']
})
export class RelationsFormComponent implements OnInit {

  @Input() myForm: FormGroup;
  @Input() person: Person;
  namesListControl = new FormControl();
  labelsListControl = new FormControl();
  labels: string[] = [];
  relationships: Relation[] = [];
  filteredOptions: Observable<Name[]>;
  labelfilteredOptions: Observable<string[]>;
  constructor(public dialog: MatDialog, private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.relationships = this.myForm.get("relationships").value;
    this.labels = this.relationships.map(r => r.label);

    this.filteredOptions = this.namesListControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '')
        })
      );

    this.labelfilteredOptions = this.labelsListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.labels.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  // filter and return the values
  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    let relArray: PersonSimple[] = this.myForm.get("relationships").value;
    let excludeList: PersonSimple[] = Object.assign([], relArray);
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
      if (result != null) {
        //this.addChild(result);
      }
    });
  }

  deleteRelation(selectedLabel: string, p: PersonSimple) {

    let relationships: Relation[] = this.myForm.get("relationships").value;
    let rel: Relation = relationships.find(x => x.label === selectedLabel);
    if (rel) {
      let people: PersonSimple[] = rel.people;
      let index = people.findIndex(d => { return d.firstName === p.firstName && d.lastName === p.lastName; }); //find index in your array  
      people.splice(index, 1);//remove element from array

      if (people.length === 0) {
        console.log("empty");
        let relIndex = relationships.findIndex(d => { return d.label === rel.label }); //find index in your array  
        relationships.splice(relIndex, 1);//remove element from array
      }

      this.myForm.patchValue({
        relationships: relationships
      });

    }
  }

  addRelation(s: PersonSimple) {
    let relationships: Relation[] = this.myForm.get("relationships").value;
    let selectedLabel = this.labelsListControl.value;
    let rel: Relation = relationships.find(x => x.label === selectedLabel);
    if (rel) {
      let people: PersonSimple[] = rel.people;
      people.push(s);

    } else {
      let newRel = new Relation(selectedLabel);
      newRel.people.push(s);
      relationships.push(newRel);
    }

    this.labelsListControl.setValue('');
    this.namesListControl.setValue('');
    console.log("rels", relationships);
    console.log("form val", this.myForm.get("relationships").value)
    this.labels = this.relationships.map(r => r.label);

    this.myForm.patchValue({
      relationships: relationships
    });
  }

}
