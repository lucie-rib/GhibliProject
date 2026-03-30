import { Injectable, inject } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin } from 'rxjs';
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
        return forkJoin(requests);
      })
    );
  }

  getCharacters(): Observable<Character[]> {
    return this.httpClient.get<any>("https://ghibliapi.vercel.app/people").pipe(
      map((peopleArray: any) => {
        const newArray = peopleArray.map((character: any) => {
          return {
            id: character.id, 
            name: character.name, 
            gender: character.gender, 
            age: character.age, 
            eye_color: character.eye_color, 
            hair_color: character.hair_color, 
            films: character.films, 
            species: character.species, 
            url: character.url
          };
        });
        return newArray;
      })
    );
  }

  getLocations(): Observable<Location[]> {
    return this.httpClient.get<any>("https://ghibliapi.vercel.app/locations").pipe(
      map((locationsArray: any) => {
        const newArray = locationsArray.map((location: any) => {
          return {
            id: location.id, 
            name: location.name, 
            climate: location.climate, 
            terrain: location.terrain, 
            surface_water: location.surface_water, 
            residents: location.residents, 
            films: location.films, 
            url: location.url
          };
        });
        return newArray;
      })
    );
  } 
}