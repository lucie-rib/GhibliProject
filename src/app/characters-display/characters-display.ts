import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../character';
import { CharacterCard } from '../character-card/character-card';

@Component({
  selector: 'app-characters-display',
  standalone: true,
  imports: [CharacterCard], 
  templateUrl: './characters-display.html',
  styleUrl: './characters-display.css',
})
export class CharactersDisplay {
  @Input() character!: Character; // The character data passed from the parent component
  @Output() characterClicked = new EventEmitter<string>();// Event emitter that emits 
  // the character's name when the character card is clicked

  onCharacterClicked() {// This method is called when the user clicks 
  // on the character card.
    console.log('Character clicked:', this.character.name);
    this.characterClicked.emit(this.character.name);
  }
}