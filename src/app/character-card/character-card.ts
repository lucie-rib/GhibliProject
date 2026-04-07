import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../character';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-card.html',
  styleUrl: './character-card.css',
})
export class CharacterCard {
  @Input() character!: Character; // The character data passed from the parent component

  isDescriptionOpen: boolean = false; // Controls whether the character's description is currently expanded or collapsed

  toggleDescription() { // This method is called when the user clicks the button to toggle the character's description.
    this.isDescriptionOpen = !this.isDescriptionOpen;
  }
}