import { Component, Input } from '@angular/core';
import { LocationsDisplay } from '../locations-display/locations-display';

@Component({
  selector: 'app-locations-list',
  imports: [LocationsDisplay],
  templateUrl: './locations-list.html',
  styleUrl: './locations-list.css',
})
export class LocationsList {
  // Letter selected in the parent page (A-Z or "All").
  @Input() selected_letter: string = '';
  // Input list already filtered by the search box.
  @Input() locations: any[] = [];

  // Stores the last clicked location name.
  selectedLocation: string = '';

  selectedLocations() {
    // No letter selected: keep the current incoming list untouched.
    if (!this.selected_letter) {
      return this.locations;
    }

    // "All" bypasses alphabetical filtering.
    if (this.selected_letter == 'All') {
      return this.locations;
    }

    // Keep only names starting with the selected uppercase letter.
    return this.locations.filter((location) => {
      return location.name?.toUpperCase().startsWith(this.selected_letter);
    });
  }

  onSelected(locationName: string) {
    // Small local state update used as a selection memory.
    this.selectedLocation = locationName;
  }

  onLocationClicked(locationName: string) {
    // Bubble click intent from card to list-level handler.
    console.log('Location clicked :' + locationName);
    this.onSelected(locationName);
  }
}
