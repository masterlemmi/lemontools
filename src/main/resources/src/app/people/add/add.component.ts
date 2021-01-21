import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Person } from '../models/person';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  person: Person = new Person();

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }
  back() {
    this._location.back();
  }
}
