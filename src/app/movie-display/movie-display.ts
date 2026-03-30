import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilmCard } from '../film-card/film-card';

@Component({
  selector: 'app-movie-display',
  imports: [FilmCard],
  templateUrl: './movie-display.html',
  styleUrl: './movie-display.css',
})
export class MovieDisplay {
  @Input() movie: any;
  @Output() movieClicked = new EventEmitter<string>();

  onMovieClicked() {
    console.log('Movie clicked:', this.movie.title);
    this.movieClicked.emit(this.movie.title);
  }
}
