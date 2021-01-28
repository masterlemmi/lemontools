import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Edge, Node } from '@swimlane/ngx-graph';
import { SpinnerService } from 'app/shared/services/spinner.service';
import { Observable } from 'rxjs/Observable';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Connection } from '../models/connections';
import { Name } from '../models/names';
import { Person } from '../models/person';
import { PersonSimple } from '../models/person-simple';
import { PeopleService } from '../services/people.service';
import { RelationsService } from '../services/relations.service';
//import { nodes, clusters, links } from './relation-chart/data';

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css']
})
export class RelationsComponent implements OnInit {
  namesListControl = new FormControl();
  namesListControl2 = new FormControl();
  filteredOptions: Observable<Name[]>;
  filteredOptions2: Observable<Name[]>;
  doneLoadingCache = false;
  chartLoaded = false;
  person1: PersonSimple;
  person2: PersonSimple;
  relationsLabel: string;
  links : Edge[] = []
  nodes: Node[] = []

  constructor(private router: Router,
    private _location: Location,
    private spinner: SpinnerService,
    private peopleService: PeopleService,
    private relService: RelationsService) { }

  ngOnInit(): void {

    //drop down list of names to chose from
    this.peopleService.getAllPeople(true).subscribe(data => {
      this.doneLoadingCache = true
      this.filteredOptions = this.namesListControl.valueChanges
        .pipe(
          startWith(''),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(val => {
            return this.filter(val || '', this.person2)
          })
        );

      this.filteredOptions2 = this.namesListControl2.valueChanges
        .pipe(
          startWith(''),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(val => {
            return this.filter(val || '', this.person1)
          })
        );
    })


  }
  // filter and return the values
  filter(val: string, exclude: PersonSimple): Observable<any[]> {
    // call the service which makes the http-request
    let excludeList: PersonSimple[] = []
    if (exclude){
      excludeList.push(exclude);
    }
    return this.peopleService.searchCache(val, excludeList);
  }
  toRoute(id: number) {
    const rt = `/people/profile/${id}`;
    this.router.navigateByUrl(rt);
  }

  toHome() {
    this.router.navigateByUrl('/people');
  }

  edit(p: Person) {
    const rt = `/people/edit/${p.id}`;
    // this.router.navigateByUrl(rt);
    this.router.navigate([rt], { state: { data: p } });
  }

  back() {
    this._location.back();
  }

  setPerson1(val) {
    this.person1 = val;
  }
  setPerson2(val) {
    this.person2 = val;
  }

  findConnection(){
    this.chartLoaded = false;   
    this.spinner.spin();
    this.relService.getConnections(this.person1.id, this.person2.id).subscribe(
      data =>{
        this.spinner.stop();
        this.chartLoaded = true; 
        this.links = data.links;
        this.nodes = data.nodes;
       this.relationsLabel = data.relationLabel;
      },
      err => {
        this.spinner.stop();
      }
    )
  }

}
