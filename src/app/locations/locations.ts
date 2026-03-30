import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Data } from '../data';
import { LocationsList } from '../locations-list/locations-list';

@Component({
  selector: 'app-locations',
  imports: [LocationsList, ReactiveFormsModule],
  templateUrl: './locations.html',
  styleUrl: './locations.css',
})
export class Locations {
  dataService = inject(Data);
  originalLocations: any[] = [];
  filteredLocations: any[] = [];
  searchGroup: FormGroup;


  searchControl = new FormControl<string>('', { 
    validators: [Validators.minLength(2), Validators.required], 
    nonNullable: true 
  });

  constructor() {
    this.dataService.getLocations().subscribe(locations => {
      this.originalLocations = locations;
      this.filteredLocations = locations;
    });

    this.searchGroup = new FormGroup({
      search: this.searchControl,
    });
  }

  submit() {
    const rawValue = this.searchControl.value.trim().toLowerCase();
    
  
    const searchTerms = rawValue.split(' ').filter(term => term.length > 0);

    if (searchTerms.length === 0) {
      this.filteredLocations = [...this.originalLocations];
      return;
    }


    this.filteredLocations = this.originalLocations.filter(location => {
      const locationName = location.name.toLowerCase();
      return searchTerms.every(term => locationName.includes(term));
    });
  }

  reset() {
    this.searchGroup.reset();
    this.filteredLocations = [...this.originalLocations];
  }
}



