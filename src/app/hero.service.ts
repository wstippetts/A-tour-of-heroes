import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { Hero } from "./hero";
import { HEROES } from "./mock-heroes";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  private heroesUrl = 'api/heroes';// web API URL

  getHeroes(): Observable<Hero[]> {
    // const heroes = of(HEROES);
    // this.messageService.add('HeroService: fetched heroes')
    return this.http.get<Hero[]>(this.heroesUrl).pipe(tap(_ => this.log('fetched heroes')), catchError(this.handleError<Hero[]>('getHeroes', [])));
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(tap(_ => this.log(`fetched hero id=${id}`)), catchError(this.handleError<Hero>(`getHeroid=${id}`)));
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`)
    return of(hero);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO send error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO better job of transforming error for user
      this.log(`${operation} failed: ${error.message}`);
      // let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
