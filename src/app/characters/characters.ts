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
  selectedLetter: string = '';
  dataService = inject(Data);

  allRawCharacters: any[] = [];
  originalCharacters: Character[] = [];
  filteredCharacters: Character[] = [];

  searchGroup: FormGroup;
  limit = 20;
  offset = 0;
  isLoading = false;

  searchControl = new FormControl<string>('', {
    validators: [Validators.minLength(2), Validators.required],
    nonNullable: true,
  });

  constructor() {
    this.searchGroup = new FormGroup({
      search: this.searchControl,
    });
  }

  get hasMoreCharacters(): boolean {
    return this.offset < this.allRawCharacters.length;
  }

  ngOnInit() {
    this.isLoading = true;
    this.dataService.getRawCharacters(250).subscribe({
      next: (data) => {
        this.allRawCharacters = data;
        this.loadMore();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  loadMore() {
    if (!this.hasMoreCharacters) return;

    this.isLoading = true;
    const nextBatch = this.allRawCharacters.slice(this.offset, this.offset + this.limit);

    this.dataService.hydrateCharacters(nextBatch).subscribe({
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

  submit() {
    this.applyFilter();
  }

  private applyFilter() {
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

  reset() {
    this.searchGroup.reset();
    this.selectedLetter = '';
    this.filteredCharacters = [...this.originalCharacters];
  }

  onLetterSelected(letter: string) {
    this.selectedLetter = letter;
    this.applyFilter();
  }
}
