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
  @Input() location: any;
  @Output() locationClicked = new EventEmitter<string>();

  //une histoire de style, genere avec chatgpt pour avoir des image pour les locations,
  //parceque l'api choisi n'en fourni pas malheuresement, n'a rien à voir avec le projet
  //start
  locationImageUrl: string = '/placeholder_film.png';

  private readonly locationImagesData = inject(LocationImagesData);

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['location']) {
      return;
    }

    const locationName = changes['location'].currentValue?.name;
    this.locationImagesData.getLocationImage(locationName).subscribe((imageUrl) => {
      this.locationImageUrl = imageUrl;
    });
  }
  //end


  onLocationClicked() {
    console.log('Location clicked:', this.location.name);
    this.locationClicked.emit(this.location.name);
  }
}
