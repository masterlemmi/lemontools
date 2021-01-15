import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

export class Foo {
  constructor(
    public id: number,
    public name: string) { }
}

@Injectable()
export class AppService {

  constructor(
    private _http: HttpClient, private router: Router) { }

  getResource(resourceUrl): Observable<any> {
    return this._http.get(resourceUrl)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  checkCredentials() {
    return (Cookie.check('access_token'));
  }

}