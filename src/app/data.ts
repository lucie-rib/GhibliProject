import { Injectable, inject } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, combineLatest, of, catchError, shareReplay } from 'rxjs';
import { Character } from './character';
import { Location } from './location';
import { Movie } from './movie';

@Injectable({
  providedIn: 'root',
})
export class Data {
  
  httpClient = inject(HttpClient);

  private allFilms$ = this.httpClient.get<any[]>('https://ghibliapi.vercel.app/films').pipe(shareReplay(1));
  private allSpecies$ = this.httpClient.get<any[]>('https://ghibliapi.vercel.app/species').pipe(shareReplay(1));

  constructor() {}

  getMovies(): Observable<Movie[]> {
    return this.httpClient.get<any[]>("https://ghibliapi.vercel.app/films").pipe(
      switchMap((moviesArray: any[]) => {
        const requests = moviesArray.map((movie: any) => {
          return this.httpClient.get<any>(movie.url).pipe(
            map((movieDetails: any) => ({
              ...movie,
              image: movieDetails.image 
            } as Movie))
          );
        });
        return combineLatest(requests) as Observable<Movie[]>; 
      })
    );
  }

  getRawCharacters(limit: number = 250): Observable<any[]> {
    return this.httpClient.get<any[]>(`https://ghibliapi.vercel.app/people?limit=${limit}`);
  }

  hydrateCharacters(peopleArray: any[]): Observable<Character[]> {
    if (!peopleArray || peopleArray.length === 0) return of([]);

    return combineLatest({
      films: this.allFilms$,
      species: this.allSpecies$
    }).pipe(
      map(({ films, species }) => {
        return peopleArray.map(character => {
          let speciesName = 'Unknown';
          if (character.species && character.species.startsWith('http')) {
            const foundSpecies = species.find(s => character.species.includes(s.id));
            if (foundSpecies) speciesName = foundSpecies.name;
          }

          const charFilms = character.films || [];
          const matchedFilms = films.filter(f => charFilms.some((url: string) => url.includes(f.id)));
          
          return {
            id: character.id,
            name: character.name,
            gender: character.gender,
            age: character.age,
            eye_color: character.eye_color,
            hair_color: character.hair_color,
            species: speciesName, 
            url: character.url,
            films: matchedFilms.map(f => f.title),
            images: matchedFilms.map(f => f.image).filter(img => !!img)
          } as Character;
        });
      })
    );
  }

  getLocations(): Observable<Location[]> {
    return this.httpClient.get<any[]>("https://ghibliapi.vercel.app/locations").pipe(
      switchMap((locationsArray: any[]) => {
        const locationRequests = locationsArray.map((location: any) => {
          const residents$ = location.residents.length > 0 
            ? combineLatest(location.residents.map((url: string) => this.httpClient.get<any>(url).pipe(map((r: any) => r.name), catchError(() => of('Unknown')))))
            : of([]);
          const films$ = location.films.length > 0 
            ? combineLatest(location.films.map((url: string) => this.httpClient.get<any>(url).pipe(map((f: any) => f.title), catchError(() => of('Unknown')))))
            : of([]);

          return combineLatest({ residents: residents$, films: films$ }).pipe(
            map(({ residents, films }) => ({ ...location, residents, films } as Location))
          );
        });
        return combineLatest(locationRequests) as Observable<Location[]>;
      })
    );
  } 
}