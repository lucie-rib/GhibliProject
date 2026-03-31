import { Component, Input } from '@angular/core';
import { Movie } from '../movie';

@Component({
  selector: 'app-card-tierlist',
  imports: [],
  templateUrl: './card-tierlist.html',
  styleUrl: './card-tierlist.css',
})
export class CardTierlist {
  @Input() imageUrl : string = "/placeholder_film.png"
  @Input() movie_name : string = ""
  @Input() movie_id : string = ""

  
}
