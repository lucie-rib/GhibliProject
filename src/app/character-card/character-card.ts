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
  @Input() character!: Character;

  isDescriptionOpen: boolean = false;

  toggleDescription() {
    this.isDescriptionOpen = !this.isDescriptionOpen;
  }
}