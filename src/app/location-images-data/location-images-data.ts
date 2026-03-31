  /*une histoire de style, genere avec chatgpt pour avoir des image pour les locations,
  parceque l'api choisi n'en fourni pas malheuresement, n'a rien à voir avec le projet
  start*/

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, shareReplay, switchMap } from 'rxjs';

interface FandomQueryResponse {
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        original?: {
          source?: string;
        };
        thumbnail?: {
          source?: string;
        };
      }
    >;
  };
}

@Injectable({
  providedIn: 'root',
})
export class LocationImagesData {
  private readonly httpClient = inject(HttpClient);
  private readonly placeholderImage = '/placeholder_film.png';
  private readonly cache = new Map<string, Observable<string>>();

  getLocationImage(locationName?: string): Observable<string> {
    const normalizedName = (locationName ?? '').trim();
    const key = this.normalizeForMatch(normalizedName);

    if (!key) {
      return of(this.placeholderImage);
    }

    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const searchFallback$ = this.httpClient
      .get<FandomQueryResponse>(this.buildFandomSearchUrl(normalizedName))
      .pipe(
        map((response) => {
          const pages = Object.values(response.query?.pages ?? {});
          const bestPage = this.pickBestPageByName(pages, normalizedName);
          return this.extractImage(bestPage) || this.placeholderImage;
        }),
        catchError(() => of(this.placeholderImage))
      );

    const request$ = this.httpClient
      .get<FandomQueryResponse>(this.buildFandomLocationUrl(normalizedName))
      .pipe(
        map((response) => {
          const pages = Object.values(response.query?.pages ?? {});
          const bestExactPage = this.pickBestPageByName(pages, normalizedName);
          return this.extractImage(bestExactPage);
        }),
        switchMap((imageUrl) => {
          return imageUrl ? of(imageUrl) : searchFallback$;
        }),
        catchError(() => searchFallback$),
        shareReplay(1)
      );

    this.cache.set(key, request$);
    return request$;
  }

  private buildFandomLocationUrl(locationName: string): string {
    const title = encodeURIComponent(locationName);
    return `https://ghibli.fandom.com/api.php?action=query&format=json&origin=*&titles=${title}&prop=pageimages&piprop=thumbnail|original&pithumbsize=700`;
  }

  private buildFandomSearchUrl(locationName: string): string {
    const query = encodeURIComponent(locationName);
    return `https://ghibli.fandom.com/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${query}&gsrlimit=8&prop=pageimages&piprop=thumbnail|original&pithumbsize=700`;
  }

  private extractImage(page?: {
    original?: { source?: string };
    thumbnail?: { source?: string };
  }): string | undefined {
    return page?.original?.source || page?.thumbnail?.source;
  }

  private pickBestPageByName(
    pages: Array<{ title?: string; original?: { source?: string }; thumbnail?: { source?: string } }>,
    targetName: string
  ) {
    if (pages.length === 0) {
      return undefined;
    }

    const normalizedTarget = this.normalizeForMatch(targetName);
    let bestPage = pages[0];
    let bestScore = -1;

    for (const page of pages) {
      const pageTitle = page.title ?? '';
      const normalizedTitle = this.normalizeForMatch(pageTitle);
      const score = this.computeSimilarityScore(normalizedTarget, normalizedTitle);

      if (score > bestScore) {
        bestScore = score;
        bestPage = page;
      }
    }

    return bestPage;
  }

  private normalizeForMatch(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private computeSimilarityScore(target: string, candidate: string): number {
    if (!target || !candidate) {
      return 0;
    }

    if (target === candidate) {
      return 100;
    }

    let score = 0;
    if (candidate.includes(target) || target.includes(candidate)) {
      score += 40;
    }

    const targetTokens = target.split(' ').filter(Boolean);
    const candidateTokens = new Set(candidate.split(' ').filter(Boolean));
    let overlap = 0;
    for (const token of targetTokens) {
      if (candidateTokens.has(token)) {
        overlap++;
      }
    }
    score += overlap * 8;

    return score;
  }
}

/*end*/
