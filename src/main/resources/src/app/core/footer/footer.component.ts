import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<footer class="footer">
  <div class="container">
  <div class="content has-text-centered">
    <p>
      Made with <3 by <a href="https://instagram.com/lemzki">Lemon Coder</a>
    </p>
  </div>
  </div>
  </footer>`
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
