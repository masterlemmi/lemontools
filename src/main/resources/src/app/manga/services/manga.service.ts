import { Manga } from './../model/manga';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { ResourceService } from 'app/shared/services/resource.service';
import { environment } from 'environments/environment';
import { MangaUpdateResult } from '../model/manga-update-result';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class MangaService {
  

  private mangaUrl: string;


  constructor(private resService: ResourceService,
    private http: HttpClient,) {
      this.mangaUrl = `${environment.server}/api/manga`;
    //this.mangaUrl = "http://localhost:8081/api/manga";
  }


  getHeaders(method: string): HttpHeaders {
    return new HttpHeaders({
      'Content-type': 'application/json', 
      'Access-Control-Request-Method': method
    });
  }

  getAllManga(): Observable<Manga[]> {
    return this.http.get<Manga[]>(this.mangaUrl, httpOptions);
  }

  getDoneManga(): Observable<Manga[]> {
    return this.http.get<Manga[]>(`${this.mangaUrl}/ended`, httpOptions);
  }
  

  getAllOngoingManga(): Observable<Manga[]> {
    return this.http.get<Manga[]>(`${this.mangaUrl}/ongoing`, httpOptions);
  }

  markDone(id: number): Observable<Manga> {
    let body = { id: id, done: true };
    return this.http.put<Manga>(`${this.mangaUrl}/done`, body, httpOptions);
  }

  updateChapter(body): Observable<Manga> {
    return this.http.put<Manga>(`${this.mangaUrl}/chapter`, body, httpOptions);
  }

  fetchUpdates(): Observable<{}> {
    return this.http.post<{}>(`${this.mangaUrl}/fetch/updates-async`, {}, httpOptions);
  }

  addManga(body): Observable<Manga> {
      return this.http.post<Manga>(`${this.mangaUrl}`, body, httpOptions);
  }

  getUpdateStatus(): Observable<MangaUpdateResult> {
    return this.http.get<MangaUpdateResult>(`${this.mangaUrl}/updates-status`, httpOptions);
  }

  
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