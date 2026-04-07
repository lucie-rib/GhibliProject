import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Data } from '../data';
import { Character } from '../character';
import { CharactersList } from '../characters-list/characters-list';
import { LetterSelector } from '../letter-selector/letter-selector';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [ReactiveFormsModule, CharactersList, LetterSelector],
  templateUrl: './characters.html',
  styleUrl: './characters.css',
})
export class Characters implements OnInit {
  selectedLetter: string = ''; // Tracks the currently selected letter for filtering characters by their starting letter
  dataService = inject(Data);// Service for fetching character data from the API

  allRawCharacters: any[] = []; // Stores the raw character data fetched from the API before hydration into Character objects
  originalCharacters: Character[] = [];// Stores the fully hydrated Character objects that have been fetched and processed, used as the source for filtering and display
  filteredCharacters: Character[] = [];// Stores the subset of originalCharacters that match the current search and letter filters, which is what gets displayed in the UI

  searchGroup: FormGroup; // Form group for managing the search input and its validation state
  limit = 20;// Number of characters to load in each batch when the user clicks "Load More"
  offset = 0;// Tracks how many characters have been loaded so far, used to determine the next batch of characters to load from allRawCharacters
  isLoading = false;// Indicates whether character data is currently being loaded, used to show loading indicators in the UI and prevent multiple simultaneous loads

  searchControl = new FormControl<string>('', { //form control for the search input, with validation rules to ensure the search term is at least 2 characters long and is required
    validators: [Validators.minLength(2), Validators.required],
    nonNullable: true,
  });

  constructor() { // Initialize the search form group with the search control
    this.searchGroup = new FormGroup({
      search: this.searchControl,
    });
  }

  get hasMoreCharacters(): boolean {// Computed property to determine if there are more characters to load based on the current offset and the total number of raw characters available
    return this.offset < this.allRawCharacters.length;
  }

  ngOnInit() { // On component initialization, start loading the character data from the API
    this.isLoading = true;
    this.dataService.getRawCharacters(250).subscribe({
      next: (data) => { // When the raw character data is successfully fetched, store it in allRawCharacters and load the first batch of characters to display
        this.allRawCharacters = data;
        this.loadMore();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  loadMore() { // This method is called when the user clicks the "Load More" button to load the next batch of characters. 
  // It checks if there are more characters to load, sets the loading state, 
  // and then processes the next batch of raw characters by hydrating them 
  // into Character objects and updating the displayed list.
    if (!this.hasMoreCharacters) return;

    this.isLoading = true;
    const nextBatch = this.allRawCharacters.slice(this.offset, this.offset + this.limit);

    this.dataService.hydrateCharacters(nextBatch).subscribe({// When the next batch of characters is successfully hydrated, 
    // update the originalCharacters list, apply the current filters, 
    // and update the offset and loading state.
      next: (hydratedBatch) => {
        this.originalCharacters = [...this.originalCharacters, ...hydratedBatch];
        this.applyFilter();
        this.offset += this.limit;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  submit() {// This method is called when the user submits the search form. 
  // It simply applies the current search and letter filters to update t
  // he displayed list of characters.
    this.applyFilter();
  }

  private applyFilter() {// This method applies the current search term and selected 
  // letter filters to the originalCharacters list to produce 
  // the filteredCharacters list that is displayed in the UI.
    const rawValue = this.searchControl.value.trim().toLowerCase();
    const searchTerms = rawValue.split(' ').filter(term => term.length > 0);

    this.filteredCharacters = this.originalCharacters.filter(character => {
      const characterName = character.name.toLowerCase();
      const matchesSearch =
        searchTerms.length === 0 ||
        searchTerms.every(term => characterName.includes(term));

      const matchesLetter =
        !this.selectedLetter ||
        this.selectedLetter === 'All' ||
        character.name.toUpperCase().startsWith(this.selectedLetter.toUpperCase());

      return matchesSearch && matchesLetter;
    });
  }

  reset() { // This method is called when the user clicks the "Reset" button 
  // to clear the search input and reset all filters.
    this.searchGroup.reset();
    this.selectedLetter = '';
    this.filteredCharacters = [...this.originalCharacters];
  }

  onLetterSelected(letter: string) {// This method is called when the user selects
  //  a letter from the LetterSelector component.
    this.selectedLetter = letter;
    this.applyFilter();
  }
}
