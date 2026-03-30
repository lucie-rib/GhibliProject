import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Data } from '../data';
import { CharactersList } from '../characters-list/characters-list';

@Component({
  selector: 'app-characters',
  imports: [CharactersList, ReactiveFormsModule],
  templateUrl: './characters.html',
  styleUrl: './characters.css',
})
export class Characters {
  dataService = inject(Data);
  originalCharacters: any[] = [];
  filteredCharacters: any[] = [];
  searchGroup: FormGroup;


  searchControl = new FormControl<string>('', { 
    validators: [Validators.minLength(2), Validators.required], 
    nonNullable: true 
  });

  constructor() {
    this.dataService.getCharacters().subscribe(characters => {
      this.originalCharacters = characters;
      this.filteredCharacters = characters;
    });

    this.searchGroup = new FormGroup({
      search: this.searchControl,
    });
  }

  submit() {
    const rawValue = this.searchControl.value.trim().toLowerCase();
    
  
    const searchTerms = rawValue.split(' ').filter(term => term.length > 0);

    if (searchTerms.length === 0) {
      this.filteredCharacters = [...this.originalCharacters];
      return;
    }


    this.filteredCharacters = this.originalCharacters.filter(character => {
      const characterName = character.name.toLowerCase();
      return searchTerms.every(term => characterName.includes(term));
    });
  }

  reset() {
    this.searchGroup.reset();
    this.filteredCharacters = [...this.originalCharacters];
  }
}

