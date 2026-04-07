import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-film-card',
  imports: [],
  templateUrl: './film-card.html',
  styleUrl: './film-card.css',
})
export class FilmCard {
  // Controls modal visibility for film/location details.
  isDescriptionOpen : boolean = false
  // Movie-related inputs.
  @Input() film_title?: string
  @Input() film_description?: string
  @Input() film_image?: string
  @Input() film_title_jp?: string
  @Input() film_director?: string
  @Input() film_release_date?: string
  @Input() film_rate?: string

  // Location-related inputs (used when this card is in location mode).
  @Input() location_name?: string
  @Input() location_climate?: string
  @Input() location_terrain?: string
  @Input() location_surface_water?: string
  @Input() location_residents_count?: string
  @Input() location_films_count?: string

  openDescription() {
    // Opens the overlay modal from the card thumbnail click.
    this.isDescriptionOpen = true
    console.log("description open : " + this.isDescriptionOpen)
  }

  closeDescription(){
    // Closes the overlay modal from backdrop or close button.
    this.isDescriptionOpen = false
    console.log("description open : " + this.isDescriptionOpen)
  }

}
