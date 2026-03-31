import { Injectable, inject } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, combineLatest, of } from 'rxjs'; // 👈 On importe combineLatest
import { Character } from './character';
import { Location } from './location';
import { Movie } from './movie';

@Injectable({
  providedIn: 'root',
})
export class Data {
  
  httpClient = inject(HttpClient);

  constructor() {}

  getMovies(): Observable<Movie[]> {
    return this.httpClient.get<any[]>("https://ghibliapi.vercel.app/films").pipe(
      switchMap((moviesArray: any[]) => {
        const requests = moviesArray.map((movie: any) => {
          return this.httpClient.get<any>(movie.url).pipe(
            map((movieDetails: any) => {
              return {
                id: movie.id, 
                title: movie.title, 
                original_title: movie.original_title, 
                original_title_romanised: movie.original_title_romanised, 
                description: movie.description, 
                director: movie.director, 
                producer: movie.producer, 
                release_date: movie.release_date, 
                rt_score: movie.rt_score, 
                people: movie.people, 
                species: movie.species, 
                locations: movie.locations, 
                vehicles: movie.vehicles, 
                url: movie.url,
                image: movieDetails.image 
              } as Movie; 
            })
          );
        });
        
 
        return combineLatest(requests); 
      })
    );
  }

  getCharacters(): Observable<Character[]> {
    return this.httpClient.get<any[]>("https://ghibliapi.vercel.app/people").pipe(
      switchMap((peopleArray: any[]) => {
        const characterRequests = peopleArray.map((character: any) => {
          
          const filmRequests = character.films.map((filmUrl: string) => {
            return this.httpClient.get<any>(filmUrl).pipe(
              map((filmDetails: any) => filmDetails.title) 
            );
          });
          const films$ = filmRequests.length > 0 ? combineLatest(filmRequests) : of([]);

          return films$.pipe(
            map((filmTitles: any) => {
              return {
                id: character.id, 
                name: character.name, 
                gender: character.gender, 
                age: character.age, 
                eye_color: character.eye_color, 
                hair_color: character.hair_color, 
                species: character.species, 
                url: character.url,
                films: filmTitles 
              } as Character;
            })
          );
        });
        
        return combineLatest(characterRequests);
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

          return combineLatest({
            resolvedResidents: residents$,
            resolvedFilms: films$
          }).pipe(
            map(({ resolvedResidents, resolvedFilms }: any) => {
              return {
                id: location.id, 
                name: location.name, 
                climate: location.climate, 
                terrain: location.terrain, 
                surface_water: location.surface_water, 
                residents: resolvedResidents, 
                films: resolvedFilms,         
                url: location.url
              } as Location;
            })
          );
        });
        
        return combineLatest(locationRequests);
      })
    );
  } 
}
