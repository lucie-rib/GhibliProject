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
  
  httpClient = inject(HttpClient);
  characterImagesData = inject(CharacterImagesData);

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
              
              // On récupère les images des films au cas où
              const movieImages = matchedFilms.map(f => f.image).filter(img => !!img);
              
              // Si Fandom a trouvé une image, on la met dans un tableau, sinon on utilise les images des films
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

        return combineLatest(characterRequests);
      })
    );
  }

  getLocations(): Observable<Location[]> {
    const sanitizeLocationValue = (value: unknown): string => {
      if (typeof value !== 'string') return 'unknown';
      const trimmed = value.trim();
      if (!trimmed || /\btodo\b/i.test(trimmed)) return 'unknown';
      return trimmed;
    };

    return this.httpClient.get<any[]>("https://ghibliapi.vercel.app/locations").pipe(
      switchMap((locationsArray: any[]) => {
        const locationRequests = locationsArray.map((location: any) => {
          const rawResidents = Array.isArray(location.residents) ? location.residents : [];
          const rawFilms = Array.isArray(location.films) ? location.films : [];

          const validResidentUrls = rawResidents.filter(
            (residentUrl: string) =>
              typeof residentUrl === 'string' && residentUrl.startsWith('http')
          );

          const residentRequests: Observable<string>[] = validResidentUrls.map((residentUrl: string) => {
            return this.httpClient.get<any>(residentUrl).pipe(
              map((residentDetails: any) => sanitizeLocationValue(residentDetails?.name))
            );
          });

          const validFilmUrls = rawFilms.filter(
            (filmUrl: string) =>
              typeof filmUrl === 'string' && filmUrl.startsWith('http')
          );

          const filmRequests: Observable<string>[] = validFilmUrls.map((filmUrl: string) => {
            return this.httpClient.get<any>(filmUrl).pipe(
              map((filmDetails: any) => sanitizeLocationValue(filmDetails?.title))
            );
          });

          const residents$: Observable<string[]> =
            residentRequests.length > 0 ? combineLatest(residentRequests) : of<string[]>([]);
          const films$: Observable<string[]> =
            filmRequests.length > 0 ? combineLatest(filmRequests) : of<string[]>([]);

          return combineLatest({ residents: residents$, films: films$ }).pipe(
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

              const resolvedFilms =
                films.length > 0
                  ? films
                  : rawFilms.some(
                      (film: unknown) =>
                        typeof film === 'string' && film.trim().toUpperCase() === 'TODO'
                    )
                  ? ['unknown']
                  : [];

              return {
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
        return combineLatest(locationRequests) as Observable<Location[]>;
      })
    );
  } 
}
