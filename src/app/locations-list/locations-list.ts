import { Component, Input } from '@angular/core';
import { LocationsDisplay } from '../locations-display/locations-display';

@Component({
  selector: 'app-locations-list',
  imports: [LocationsDisplay],
  templateUrl: './locations-list.html',
  styleUrl: './locations-list.css',
})
export class LocationsList {
  @Input() selected_letter: string = '';
  @Input() locations: any[] = [];

  selectedLocation: string = '';

  selectedLocations() {
    if (!this.selected_letter) {
      return this.locations;
    }

    if (this.selected_letter == 'All') {
      return this.locations;
    }

    return this.locations.filter((location) => {
      return location.name?.toUpperCase().startsWith(this.selected_letter);
    });
  }

  onSelected(locationName: string) {
    this.selectedLocation = locationName;
  }

  onLocationClicked(locationName: string) {
    console.log('Location clicked :' + locationName);
    this.onSelected(locationName);
  }
}
