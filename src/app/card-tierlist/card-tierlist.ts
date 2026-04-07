import { Component, Input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-card-tierlist',
  imports: [CdkDrag],
  templateUrl: './card-tierlist.html',
  styleUrl: './card-tierlist.css',
})
export class CardTierlist {
  // Inputs displayable on the draggable movie card.
  @Input() imageUrl: string = '/placeholder_film.png';
  @Input() movie_name: string = '';
  @Input() movie_id: string = '';
  @Input() dragData: any = null;
}
