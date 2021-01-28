import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PersonSimple } from '../models/person-simple';
import { ResourceService } from 'app/shared/services/resource.service';
import { environment } from 'environments/environment';
import { Connection } from '../models/connections';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class RelationsService {

  private relationsUrl: string = `${environment.server}/api/relations`;

  constructor(
    private http: HttpClient,) { }



  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-type': 'application/json'
    });
  }

  getConnections(sourceId: number, targetId: number): Observable<Connection> {
    const url = `${this.relationsUrl}/${sourceId}/${targetId}`;
    return this.http.get<Connection>(url, { headers: this.getHeaders() }).pipe(
      tap(_ => this.log(`fetched Connection id=${sourceId} tgtid=${targetId}`)),
      catchError(this.handleError<Connection>(`getConnection id=${sourceId} tgtid=${targetId}`))
    );
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