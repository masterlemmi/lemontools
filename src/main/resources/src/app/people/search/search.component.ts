import { Component, OnInit } from '@angular/core';
import { PersonSimple } from '../models/person-simple';
import { PeopleService } from '../services/people.service';
import { Router } from '@angular/router';


@Component({
  selector: 'people-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchTerm: String = "";
  people: PersonSimple[] = [];

  constructor(private peopleService: PeopleService,
    private router: Router) { }

  ngOnInit(): void {
    this.getRecent();
  }

  search() {
    console.log("searching");
    this.peopleService.searchPersones(this.searchTerm).subscribe(
      data => {
        this.people = data;
      },
      err => alert('Invalid Credentials')
    );
  }

  getRecent() {
    this.peopleService.getRecent().subscribe(
      data => {
        this.people = data;
      },
      err => alert('Invalid Credentials')
    );
  }

  toRoute(id: number) {
    const rt = `/people/profile/${id}`;
    this.router.navigateByUrl(rt);
  }
}