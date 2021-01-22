import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Person } from 'app/people/models/person';

@Component({
  selector: 'link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.css']
})
export class LinkFormComponent implements OnInit {
  @Input() myForm: FormGroup;
  @Input() person: Person;
  links = [];
  newLink = { name: '', url: '' }

  constructor() { }

  ngOnInit(): void {
    this.links = this.myForm.get("links").value;
  }

  deleteLink(link) {
    this.links = this.links.filter(ln => ln.name !== link.name && ln.url !== link.url);
    this.myForm.patchValue({
      links: this.links
    })
  }

  onSubmit() {
    this.links.push({ name: this.newLink.name, url: this.newLink.url });
    this.myForm.patchValue({
      links: this.links
    })

    this.newLink = { name: '', url: '' }
  }


}
