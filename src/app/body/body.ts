import { Component } from '@angular/core';
import { MoviesList } from '../movies-list/movies-list';
import { LetterSelector } from '../letter-selector/letter-selector';

@Component({
  selector: 'app-body',
  imports: [MoviesList, LetterSelector],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {
  selectedLetter: string = '';

  onLetterSelected(letter: string) {
    this.selectedLetter = letter;
    console.log('Lettre reçue:', letter);
  }
}
