
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Character } from '../character';
import { CharactersDisplay } from '../characters-display/characters-display';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [CharactersDisplay],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.css',
})
export class CharactersList {
  @Input() characters: Character[] = []; 
  @Input() isLoading: boolean = false; 
  @Input() hasMoreCharacters: boolean = true;
  @Output() characterSelected = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<void>(); 

  onCharacterClicked(characterName: string) {
    this.characterSelected.emit(characterName);
  }

  onLoadMore() {
    this.loadMore.emit();
  }
}
