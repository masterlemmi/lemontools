import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class Resource {
  name: string;
  server: string;
  health: string;
  route: string;
  alias: string;
}

const RES_KEY: string = "RESOURCE_LIST";

@Injectable({ providedIn: 'root' })
export class ResourceService {

  allResources: Resource[] = [];
  private apiUrl = `${environment.server}/resources`;

  constructor(private http: HttpClient) { }

  refreshResource(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl, httpOptions).pipe(
      tap(data => {
        localStorage.removeItem(RES_KEY);
        localStorage.setItem(RES_KEY, JSON.stringify(data));
      })
    );
  }


  //called on app init
  getResources(): Observable<Resource[]> {
    if (localStorage.getItem(RES_KEY)){
      return of(JSON.parse(localStorage.getItem(RES_KEY)));
    } else {
      return this.refreshResource();
    }
  }

  getServer(name: string): string {
    let resources: Resource[] = JSON.parse(localStorage.getItem(RES_KEY));
    let r: Resource = resources.filter(r => r.alias.toLowerCase() === name.toLowerCase())[0];
    return r.server;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a PersonService message with the MessageService */
  private log(message: string) {
    //this.messageService.add(`PersonService: ${message}`);
    console.log(`PersonService: ${message}`);
  }
}
