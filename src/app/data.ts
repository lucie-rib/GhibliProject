import { Injectable, inject } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, combineLatest, of, catchError, shareReplay } from 'rxjs';
import { Character } from './character';
import { Location } from './location';
import { Movie } from './movie';
import { CharacterImagesData } from './character-images-data';

@Injectable({
  providedIn: 'root',
})
export class Data {
  
  httpClient = inject(HttpClient); // Injecting the HttpClient service to make 
  // HTTP requests to the API
  characterImagesData = inject(CharacterImagesData);

  private allFilms$ = this.httpClient.get<any[]>('https://ghibliapi.vercel.app/films').pipe(shareReplay(1));
  private allSpecies$ = this.httpClient.get<any[]>('https://ghibliapi.vercel.app/species').pipe(shareReplay(1));

  constructor() {}

  getMovies(): Observable<Movie[]> {// This method fetches the list of movies from the Ghibli API and then makes additional requests to get the details of each movie, 
  // including the image URL. It returns an observable that emits an array of Movie objects.
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
        return combineLatest(requests) as Observable<Movie[]>;// Combine all the individual movie detail requests into a single observable 
        // that emits an array of Movie objects.
      })
    );
  }

  getRawCharacters(limit: number = 250): Observable<any[]> {// This method fetches the raw character data from the Ghibli API.
    return this.httpClient.get<any[]>(`https://ghibliapi.vercel.app/people?limit=${limit}`);
  }

  hydrateCharacters(peopleArray: any[]): Observable<Character[]> {// This method takes an array of raw character data and transforms 
  // it into an array of Character objects.
    if (!peopleArray || peopleArray.length === 0) return of([]);

    return combineLatest({
      films: this.allFilms$,
      species: this.allSpecies$
    }).pipe(
      switchMap(({ films, species }) => {
        
        const characterRequests = peopleArray.map(character => {
          let speciesName = 'Unknown';
          if (character.species && character.species.startsWith('http')) {
            const foundSpecies = species.find(s => character.species.includes(s.id));
            if (foundSpecies) speciesName = foundSpecies.name;
          }

          const charFilms = character.films || [];
          const matchedFilms = films.filter(f => charFilms.some((url: string) => url.includes(f.id)));
          
          return this.characterImagesData.getCharacterImage(character.name).pipe(
            map((fandomImageUrl: string | null) => {
              
              // We fetch movie images for the character as a fallback in case the fandom search doesn't return any image
              const movieImages = matchedFilms.map(f => f.image).filter(img => !!img);
              
              // if the fandom search returns an image, we use it. Otherwise, we use the movie images as a fallback.
              const finalImages = fandomImageUrl ? [fandomImageUrl] : movieImages;

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
                images: finalImages
              } as Character;
            })
          );
        });

        return combineLatest(characterRequests);// Combine all the individual character hydration requests into a single observable that emits an array of Character objects.
      })
    );
  }

  getLocations(): Observable<Location[]> {// This method fetches the list of locations from the Ghibli API
  //  and then makes additional requests to get the details of each location,
    const sanitizeLocationValue = (value: unknown): string => {
      // This helper function is used to sanitize the values for location properties.
      if (typeof value !== 'string') return 'unknown';
      const trimmed = value.trim();
      if (!trimmed || /\btodo\b/i.test(trimmed)) return 'unknown';
      return trimmed;
    };
//
    return this.httpClient.get<any[]>("https://ghibliapi.vercel.app/locations").pipe(
      switchMap((locationsArray: any[]) => {
        const locationRequests = locationsArray.map((location: any) => {
          const rawResidents = Array.isArray(location.residents) ? location.residents : [];
          const rawFilms = Array.isArray(location.films) ? location.films : [];
// We filter out any invalid URLs from the residents and films arrays before making requests 
// to fetch their details.
          const validResidentUrls = rawResidents.filter(
            (residentUrl: string) =>
              typeof residentUrl === 'string' && residentUrl.startsWith('http')
          );
// We create an array of observables for fetching the details of each resident 
// and film associated with the location.
          const residentRequests: Observable<string>[] = validResidentUrls.map((residentUrl: string) => {
            return this.httpClient.get<any>(residentUrl).pipe(
              map((residentDetails: any) => sanitizeLocationValue(residentDetails?.name))
            );
          });

          const validFilmUrls = rawFilms.filter(// We filter out any invalid URLs from 
          // the films array before making requests to fetch their details.
            (filmUrl: string) =>
              typeof filmUrl === 'string' && filmUrl.startsWith('http')
          );

          const filmRequests: Observable<string>[] = validFilmUrls.map((filmUrl: string) => {
            // We create an array of observables for fetching the details of each film 
            // associated with the location.
            return this.httpClient.get<any>(filmUrl).pipe(
              map((filmDetails: any) => sanitizeLocationValue(filmDetails?.title))
            );
          });

          const residents$: Observable<string[]> =// We combine the resident detail requests 
          // into a single observable that emits an array of resident names.
            residentRequests.length > 0 ? combineLatest(residentRequests) : of<string[]>([]);
          const films$: Observable<string[]> =
            filmRequests.length > 0 ? combineLatest(filmRequests) : of<string[]>([]);

          return combineLatest({ residents: residents$, films: films$ }).pipe(
            // Once we have the details of the residents and films, we can construct the 
            // Location object for each location.
            map(({ residents, films }: { residents: string[]; films: string[] }) => {
              const resolvedResidents =
                residents.length > 0
                  ? residents
                  : rawResidents.some(
                      (resident: unknown) =>
                        typeof resident === 'string' && resident.trim().toUpperCase() === 'TODO'
                    )
                  ? ['unknown']
                  : [];

              const resolvedFilms =// We determine the final list of films for the 
              // location, using the resolved film titles if available,
                films.length > 0
                  ? films
                  : rawFilms.some(
                      (film: unknown) =>
                        typeof film === 'string' && film.trim().toUpperCase() === 'TODO'
                    )
                  ? ['unknown']
                  : [];

              return {// Finally, we construct the Location object for each location, 
              // using the sanitized values and the resolved residents and films.
                id: sanitizeLocationValue(location.id),
                name: sanitizeLocationValue(location.name),
                climate: sanitizeLocationValue(location.climate),
                terrain: sanitizeLocationValue(location.terrain),
                surface_water: sanitizeLocationValue(location.surface_water),
                residents: resolvedResidents,
                films: resolvedFilms,
                url: sanitizeLocationValue(location.url),
              } as Location;
            })
          );
        });
        return combineLatest(locationRequests) as Observable<Location[]>;// Combine all the 
        // individual location hydration requests into a single observable 
        // that emits an array of Location objects.
      })
    );
  } 
}
