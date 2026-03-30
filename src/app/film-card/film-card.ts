import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-film-card',
  imports: [],
  templateUrl: './film-card.html',
  styleUrl: './film-card.css',
})
export class FilmCard {
  isDescriptionOpen : boolean = false
  @Input() film_title : string = ""
  @Input() film_description : string = ""
  @Input() film_image : string =""

  openDescription() {
    this.isDescriptionOpen = true
    console.log("description open : " + this.isDescriptionOpen)
  }

  closeDescription(){
    this.isDescriptionOpen = false
    console.log("description open : " + this.isDescriptionOpen)
  }

}
