import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilmCard } from '../film-card/film-card';

@Component({
  selector: 'app-locations-display',
  imports: [FilmCard],
  templateUrl: './locations-display.html',
  styleUrl: './locations-display.css',
})
export class LocationsDisplay {
  @Input() location: any;
  @Output() locationClicked = new EventEmitter<string>();

  onLocationClicked() {
    console.log('Location clicked:', this.location.name);
    this.locationClicked.emit(this.location.name);
  }
}
