import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-film-card',
  imports: [],
  templateUrl: './film-card.html',
  styleUrl: './film-card.css',
})
export class FilmCard {
  isDescriptionOpen : boolean = false
  @Input() film_title?: string
  @Input() film_description?: string
  @Input() film_image?: string
  @Input() film_title_jp?: string
  @Input() film_director?: string
  @Input() film_release_date?: string
  @Input() film_rate?: string

  @Input() location_name?: string
  @Input() location_climate?: string
  @Input() location_terrain?: string
  @Input() location_surface_water?: string
  @Input() location_residents_count?: string
  @Input() location_films_count?: string

  openDescription() {
    this.isDescriptionOpen = true
    console.log("description open : " + this.isDescriptionOpen)
  }

  closeDescription(){
    this.isDescriptionOpen = false
    console.log("description open : " + this.isDescriptionOpen)
  }

}
