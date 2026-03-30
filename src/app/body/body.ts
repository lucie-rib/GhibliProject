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

  dataService = inject(Data);
  originalMovies: any[] = [];
  filteredMovies: any[] = [];
  searchGroup: FormGroup;


  searchControl = new FormControl<string>('', { 
    validators: [Validators.minLength(2), Validators.required], 
    nonNullable: true 
  });

  constructor() {
    this.dataService.getMovies().subscribe(movies => {
      this.originalMovies = movies;
      this.filteredMovies = movies;
    });

    this.searchGroup = new FormGroup({
      search: this.searchControl,
    });
  }

  submit() {
    const rawValue = this.searchControl.value.trim().toLowerCase();
    
  
    const searchTerms = rawValue.split(' ').filter(term => term.length > 0);

    if (searchTerms.length === 0) {
      this.filteredMovies = [...this.originalMovies];
      return;
    }


    this.filteredMovies = this.originalMovies.filter(movie => {
      const movieTitle = movie.title.toLowerCase();
      return searchTerms.every(term => movieTitle.includes(term));
    });
  }

  reset() {
    this.searchGroup.reset();
    this.filteredMovies = [...this.originalMovies];
  }

   onLetterSelected(letter: string) {
    this.selectedLetter = letter;
    console.log('Lettre reçue:', letter);
  }

}
