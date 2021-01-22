import { Person } from './../models/person';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PersonSimple } from '../models/person-simple';
import { Name } from '../models/names';
import { Cookie } from 'ng2-cookies';
import { ResourceService } from 'app/shared/services/resource.service';
import { environment } from 'environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class PeopleService {

  private personesUrl: string = `${environment.server}/api/people`;
 // private personesUrl: string = `http://localhost:8081/api/people`;
  public allPeopleCache: PersonSimple[] = [];
  clickHistory: PersonSimple[] = [];



  constructor(private resService: ResourceService,
    private http: HttpClient,) {     }

  updateCache(p: PersonSimple) {
    this.allPeopleCache.push(p);
  }

  searchCache(val: string, exclude: PersonSimple[]) : Observable<PersonSimple[]> {

    let filtered: PersonSimple[] = this.allPeopleCache.filter( person => {
      const isInArray = exclude.find(x => x.firstName === person.firstName && x.lastName === person.lastName);
      const firstNameMatch = person.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0;
      const lastNameMatch = person.lastName.toLowerCase().indexOf(val.toLowerCase()) === 0;
      const nickNameMatch = person.nickname.toLowerCase().indexOf(val.toLowerCase()) === 0;
      console.log(`${person.firstName} ---> isInArray: ${isInArray} firstNameMatch: ${firstNameMatch} lastNameMtach: ${lastNameMatch}: nickNameMatch : ${nickNameMatch}`)
      
      return !isInArray && (firstNameMatch
                || lastNameMatch
                || nickNameMatch )
    })

    return of(filtered);

      //       let childrenArray = this.myForm.get("children").value;
  
      //       let filtered: PersonSimple[] =  peepsArray.filter(person => {
  
      //         let arr = childrenArray ? childrenArray : [];
      //         //don't show already added
      //         const isInArray = arr.find(x => x.firstName === person.firstName && x.lastName === person.lastName);
      //         //don't show the person being edited
      //         const notSelf: boolean = this.person.firstName !== person.firstName && this.person.lastName !== person.lastName;
              
      //         return !isInArray && notSelf && (person.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0
      //           || person.lastName.toLowerCase().indexOf(val.toLowerCase()) === 0
      //           || person.nickname.toLowerCase().indexOf(val.toLowerCase()) === 0)
      //       })
  
      //       console.log("filtered", filtered)
  
      //       return filtered;
      //     })

  }

  addToHistory(p: PersonSimple){
    if (this.clickHistory.length == 20){
      this.clickHistory.pop();
    }

    const alreadyAdded = this.clickHistory.some( r => r.id == p.id)
    if (!alreadyAdded){
      this.clickHistory.unshift(p);
    }
  }

  getHistory(){
    return this.clickHistory;
  }


  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-type': 'application/json'
    });
  }

  createOrUpdatePerson(p: any){
    return this.http.post<any>(`${this.personesUrl}`, p, {headers: this.getHeaders()}).pipe(
      tap(_ => this.log(`creating person`)),
      catchError(this.handleError<any>('searchPersones', []))
    );
  }

  /* GET persones whose name contains search term */
  searchPersones(term: String): Observable<PersonSimple[]> {
    console.log("FINDING.. " + term)
    if (!term.trim()) {
      // if not search term, return empty person array.
      return of([]);
    } ``
    return this.http.get<PersonSimple[]>(`${this.personesUrl}/?q=${term}`, { headers: this.getHeaders() }).pipe(
      tap(_ => this.log(`found persones matching "${term}"`)),
      catchError(this.handleError<PersonSimple[]>('searchPersones', []))
    );
  }


  getRecent(): Observable<PersonSimple[]> {
    return this.http.get<PersonSimple[]>(`${this.personesUrl}/recent`, { headers: this.getHeaders() }).pipe(
      tap(_ => this.log(`found recently serach people`)),
      catchError(this.handleError<PersonSimple[]>('getRecent', []))
    );
  }


  getPerson(id: number): Observable<Person> {
    const url = `${this.personesUrl}/${id}`;
    return this.http.get<Person>(url, { headers: this.getHeaders() }).pipe(
      tap(_ => this.log(`fetched person id=${id}`)),
      catchError(this.handleError<Person>(`getPerson id=${id}`))
    );
  }

  getPeopleNames(): Observable<Name[]> {
    const url = `${this.personesUrl}/cache`;
    return this.http.get<Name[]>(url, { headers: this.getHeaders() }).pipe(
      tap(_ => this.log(`fetched person names`)),
      catchError(this.handleError<Person[]>(`fetchPersonNames`))
    );
  }

  getAllPeople(force ?: boolean): Observable<PersonSimple[]> {
    if (force){
      this.allPeopleCache.length = 0;
    }
    return this.allPeopleCache.length ?
      of(this.allPeopleCache) :
      this.http.get<PersonSimple[]>(this.personesUrl, { headers: this.getHeaders() }).pipe(
        tap(data => this.allPeopleCache = data))
  }

  createSimplePerson(person: PersonSimple): Observable<PersonSimple> {
    console.log("received person", person);
    return this.http.post<PersonSimple>(`${this.personesUrl}/simple`, person, { headers: this.getHeaders() }).pipe(
      tap((person: PersonSimple) => this.log(`added simple person w/ id=${person.id}`)),
      catchError(this.handleError<PersonSimple>('add simplePerson'))
    );
  }


  // getPerson(personID: number): Observable<Person> {
  //   return this.http.get<Person(`${this.personesUrl}/${personID}`).pipe(
  //     tap(_ => this.log(`found person {$personID}`));
  // }


  //   /** GET persones from the server */
  // getAll(): Observable<Person[]> {
  //   return this.http.get<Person[]>(`${this.personesUrl}/everyone`)
  //     .pipe(
  //       tap(_ => this.log('fetched persones')),
  //       catchError(this.handleError('getPersones', []))
  //     );
  // }

  // /** GET person by id. Return `undefined` when id not found */
  // getPersonNo404<Data>(id: number): Observable<Person> {
  //   console.log("passed id", id);
  //   const url = `${this.personesUrl}/${id}`;
  //   return this.http.get<Person[]>(url)
  //     .pipe(
  //       map(persones => persones[0]), // returns a {0|1} element array
  //       tap(h => {
  //         const outcome = h ? `fetched` : `did not find`;
  //         this.log(`${outcome} person id=${id}`);
  //       }),
  //       catchError(this.handleError<Person>(`getPerson id=${id}`))
  //     );
  // }




  // //////// Save methods //////////

  // /** POST: add a new person to the server */
  // addPerson(person: Person): Observable<Person> {
  //   return this.http.post<Person>(this.personesUrl, person, httpOptions).pipe(
  //     tap((person: Person) => this.log(`added person w/ id=${person.id}`)),
  //     catchError(this.handleError<Person>('addPerson'))
  //   );
  // }

  // /** DELETE: delete the person from the server */
  // deletePerson(person: Person | number): Observable<Person> {
  //   const id = typeof person === 'number' ? person : person.id;
  //   const url = `${this.personesUrl}/${id}`;

  //   return this.http.delete<Person>(url, httpOptions).pipe(
  //     tap(_ => this.log(`deleted person id=${id}`)),
  //     catchError(this.handleError<Person>('deletePerson'))
  //   );
  // }

  // /** PUT: update the person on the server */
  // updatePerson(person: Person): Observable<any> {
  //   return this.http.put(this.personesUrl, person, httpOptions).pipe(
  //     tap(_ => this.log(`updated person id=${person.id}`)),
  //     catchError(this.handleError<any>('updatePerson'))
  //   );
  // }

  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
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