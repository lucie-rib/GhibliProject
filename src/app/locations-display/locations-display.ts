import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FilmCard } from '../film-card/film-card';
import { LocationImagesData } from '../location-images-data/location-images-data';

@Component({
  selector: 'app-locations-display',
  imports: [FilmCard],
  templateUrl: './locations-display.html',
  styleUrl: './locations-display.css',
})
export class LocationsDisplay implements OnChanges {
  // Single location object provided by the list component.
  @Input() location: any;
  // Event emitted when the card is clicked.
  @Output() locationClicked = new EventEmitter<string>();

  //une histoire de style, genere avec chatgpt pour avoir des image pour les locations,
  //parceque l'api choisi n'en fourni pas malheuresement, n'a rien à voir avec le projet
  //start
  locationImageUrl: string = '/placeholder_film.png';

  // Local image mapping service used to enrich location cards.
  private readonly locationImagesData = inject(LocationImagesData);

  ngOnChanges(changes: SimpleChanges): void {
    // Refresh image whenever the incoming location changes.
    if (!changes['location']) {
      return;
    }

    const locationName = changes['location'].currentValue?.name;
    this.locationImagesData.getLocationImage(locationName).subscribe((imageUrl) => {
      this.locationImageUrl = imageUrl;
    });
  }
  //end

  sanitizeLocationField(value: unknown): string {
    // Normalize nullable/TODO-like values to a safe display fallback.
    if (typeof value !== 'string') {
      return 'unknown';
    }
    const trimmed = value.trim();
    if (!trimmed || /\btodo\b/i.test(trimmed)) {
      return 'unknown';
    }
    return trimmed;
  }


  onLocationClicked() {
    // Emits the clicked location name to parent components.
    console.log('Location clicked:', this.location.name);
    this.locationClicked.emit(this.location.name);
  }
}
