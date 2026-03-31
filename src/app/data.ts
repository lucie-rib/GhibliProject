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
          const validResidentUrls = (location.residents ?? []).filter(
            (residentUrl: string) =>
              typeof residentUrl === 'string' && residentUrl.startsWith('http')
          );

          const residentRequests = validResidentUrls.map((residentUrl: string) => {
            return this.httpClient.get<any>(residentUrl).pipe(
              map((residentDetails: any) => residentDetails.name)
            );
          });

          const validFilmUrls = (location.films ?? []).filter(
            (filmUrl: string) =>
              typeof filmUrl === 'string' && filmUrl.startsWith('http')
          );

          const filmRequests = validFilmUrls.map((filmUrl: string) => {
            return this.httpClient.get<any>(filmUrl).pipe(
              map((filmDetails: any) => filmDetails.title)
            );
          });

   
          const residents$ = residentRequests.length > 0 ? combineLatest(residentRequests) : of([]);
          const films$ = filmRequests.length > 0 ? combineLatest(filmRequests) : of([]);

          return combineLatest({ residents: residents$, films: films$ }).pipe(
            map(({ residents, films }) => ({ ...location, residents, films } as Location))
          );
        });
        return combineLatest(locationRequests) as Observable<Location[]>;
      })
    );
  } 
}
