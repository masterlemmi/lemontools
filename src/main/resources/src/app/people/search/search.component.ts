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
  searching: boolean = false;

  constructor(private peopleService: PeopleService,
    private router: Router) { }

  ngOnInit(): void {
    this.peopleService.getProfileCache().subscribe(
      data=> this.people = data
    );
  }

  search() {
    this.searching=true;
    this.peopleService.searchPersones(this.searchTerm).subscribe(
      data => {
        this.people = data;
        this.searching=false;
      },
      err => {
        alert('Invalid Credentials');
        this.searching=false;
      }
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

  toProfile(p: PersonSimple) {
    const rt = `/people/profile/${p.id}`;
    this.router.navigateByUrl(rt);
    this.peopleService.addToHistory(p);
  }

  toFamilyTree(id){
    const rt = `/people/family-tree/${id}`;
    this.router.navigateByUrl(rt);
  }

  
}