import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClusterNode, Edge, Node } from '@swimlane/ngx-graph';
import { SpinnerService } from 'app/shared/services/spinner.service';
import { of } from 'rxjs/internal/observable/of';

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
  selector: 'app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.css']
})
export class FamilyTreeComponent implements OnInit {
  namesListControl = new FormControl();
  namesListControl2 = new FormControl();
  filteredOptions: Observable<Name[]>;
  filteredOptions2: Observable<Name[]>;
  doneLoadingCache = false;
  chartLoaded = false;
  person1: PersonSimple;
  person2: PersonSimple;
  relationsLabel: string;
  links: Edge[] = []
  nodes: Node[] = []
  clusters: ClusterNode[] = []

  constructor(private router: Router,
    private _location: Location,
    private spinner: SpinnerService,
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private relService: RelationsService) { }

  ngOnInit(): void {
    this.chartLoaded = false;
    this.spinner.spin();
    let result$ = this.route.paramMap.map(paramMap => +paramMap.get('personId'))
      .switchMap(id => this.relService.getConnectionsTree(id)).share();

    result$.subscribe(
      data => {
        this.spinner.stop();
        this.chartLoaded = true;
        this.links = data.links;
        this.nodes = data.nodes;
        this.clusters = data.clusters;
        this.relationsLabel = data.relationLabel;
      },
      err => {
        this.spinner.stop();
      }
    )

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

  // findConnection(personId){


}

