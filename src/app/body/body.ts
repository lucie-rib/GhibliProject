import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Data } from '../data';
import { MoviesList } from '../movies-list/movies-list';
import { LetterSelector } from '../letter-selector/letter-selector';

@Component({
  selector: 'app-body', 
  imports: [MoviesList, LetterSelector, ReactiveFormsModule],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {
  selectedLetter: string = '';

  dataService = inject(Data); // Injecting the Data service to fetch movies and character data
  originalMovies: any[] = []; // This array will hold the original list of movies fetched from the API
  filteredMovies: any[] = []; // This array will hold the filtered list of movies based on the search input or letter selection
  searchGroup: FormGroup;


  // Form control for the search input, with validators to ensure a minimum length of 2 characters and that the field is required.
  searchControl = new FormControl<string>('', { 
    validators: [Validators.minLength(2), Validators.required], 
    nonNullable: true 
  }); 

  // The constructor initializes the component by fetching the movies from the API and setting up the search form group.
  constructor() {
    this.dataService.getMovies().subscribe(movies => {
      this.originalMovies = movies;
      this.filteredMovies = movies;
    });

    this.searchGroup = new FormGroup({
      search: this.searchControl,
    });
  }

  // The submit method is called when the search form is submitted. It processes the search input, splits it into individual search terms, and filters the original list of movies to include only those that match all the search terms.
  submit() {
    const rawValue = this.searchControl.value.trim().toLowerCase();
    
  
    const searchTerms = rawValue.split(' ').filter(term => term.length > 0);

    if (searchTerms.length === 0) {
      this.filteredMovies = [...this.originalMovies];
      return;
    }

    // Filter the original movies based on the search terms. A movie is included in the filtered list if its title contains all the search terms.
    this.filteredMovies = this.originalMovies.filter(movie => {
      const movieTitle = movie.title.toLowerCase();
      return searchTerms.every(term => movieTitle.includes(term));
    });
  }

  // The reset method is called to clear the search input and reset the filtered movies list back to the original list of movies.
  reset() {
    this.searchGroup.reset();
    this.filteredMovies = [...this.originalMovies];
  }

  // The onLetterSelected method is called when a letter is selected from the LetterSelector component. It updates the selectedLetter property with the received letter and logs it to the console.
   onLetterSelected(letter: string) {
    this.selectedLetter = letter;
    console.log('Lettre reçue:', letter);
  }

}
