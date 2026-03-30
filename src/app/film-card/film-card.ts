import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-film-card',
  imports: [],
  templateUrl: './film-card.html',
  styleUrl: './film-card.css',
})
export class FilmCard {
  isDescriptionOpen : boolean = false
  @Input() film_title : string = "title"
  @Input() film_description : string = "this a despcrition blablabla"
  @Input() film_image : string ="/placeholder_film.png"

  openDescription() {
    this.isDescriptionOpen = true
    console.log("description open : " + this.isDescriptionOpen)
  }

  closeDescription(){
    this.isDescriptionOpen = false
    console.log("description open : " + this.isDescriptionOpen)
  }

}
