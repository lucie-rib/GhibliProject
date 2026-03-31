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
  @Input() character!: Character;
  @Output() characterClicked = new EventEmitter<string>();

  onCharacterClicked() {
    console.log('Character clicked:', this.character.name);
    this.characterClicked.emit(this.character.name);
  }
}