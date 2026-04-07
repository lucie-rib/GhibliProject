import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Data } from '../data';
import { LocationsList } from '../locations-list/locations-list';
import { LetterSelector } from '../letter-selector/letter-selector';

@Component({
  selector: 'app-locations',
  imports: [LocationsList, LetterSelector, ReactiveFormsModule],
  templateUrl: './locations.html',
  styleUrl: './locations.css',
})
export class Locations {
  // Stores the currently selected letter from the alphabet selector.
  selectedLetter: string = '';

  // Service used to fetch locations data.
  dataService = inject(Data);
  // Source array as returned by the API.
  originalLocations: any[] = [];
  // Array currently displayed after search/filtering.
  filteredLocations: any[] = [];
  // Form group wrapper for the search UI.
  searchGroup: FormGroup;

  // Search input with minimal validation for basic UX.
  searchControl = new FormControl<string>('', {
    validators: [Validators.minLength(2), Validators.required],
    nonNullable: true,
  });

  constructor() {
    // Fetch locations once and initialize both source and visible lists.
    this.dataService.getLocations().subscribe(locations => {
      this.originalLocations = locations;
      this.filteredLocations = locations;
    });

    this.searchGroup = new FormGroup({
      search: this.searchControl,
    });
  }

  submit() {
    // Normalize search text and support multi-term matching.
    const rawValue = this.searchControl.value.trim().toLowerCase();

    const searchTerms = rawValue.split(' ').filter(term => term.length > 0);

    // If the query is empty, we show the full dataset again.
    if (searchTerms.length === 0) {
      this.filteredLocations = [...this.originalLocations];
      return;
    }

    // Keep locations that contain every typed term in the name.
    this.filteredLocations = this.originalLocations.filter(location => {
      const locationName = location.name.toLowerCase();
      return searchTerms.every(term => locationName.includes(term));
    });
  }

  reset() {
    // Reset form control and restore unfiltered results.
    this.searchGroup.reset();
    this.filteredLocations = [...this.originalLocations];
  }

  onLetterSelected(letter: string) {
    // Receives the selected letter from the child component output.
    this.selectedLetter = letter;
    console.log('Lettre reçue:', letter);
  }
}
