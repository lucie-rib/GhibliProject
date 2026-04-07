
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
export class CharactersList { // This component is responsible for displaying a list 
// of character cards. 
  // It receives the list of characters to display, the loading state, 
  // and whether there are more characters to load as inputs. 
  // It also emits events when a character is clicked 
  // or when the user requests to load more characters.
  @Input() characters: Character[] = []; 
  @Input() isLoading: boolean = false; 
  @Input() hasMoreCharacters: boolean = true;
  @Output() characterSelected = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<void>(); 

  onCharacterClicked(characterName: string) {// This method is called when a character card is clicked. 
  // It emits the character's name to the parent component 
  // through the characterSelected event emitter.
    this.characterSelected.emit(characterName);
  }

  onLoadMore() {// This method is called when the user clicks the "Load More" button. 
  // It emits an event to the parent component to load more characters.
    this.loadMore.emit();
  }
}
