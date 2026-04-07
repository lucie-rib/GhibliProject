import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilmCard } from '../film-card/film-card';


@Component({
  selector: 'app-movie-display',
  imports: [FilmCard], // Import the FilmCard component to be used within this component's template.
  templateUrl: './movie-display.html',
  styleUrl: './movie-display.css',
})
export class MovieDisplay {
  @Input() movie: any; // Input property to receive the movie data from the parent component.
  @Output() movieClicked = new EventEmitter<string>(); // Output event emitter to notify the parent component when a movie is clicked, emitting the movie title as a string.

  // Called when the movie item is clicked. 
  // It logs the clicked movie's title to the console and emits the movie title through the movieClicked event emitter to notify the parent component of the click event.
  onMovieClicked() {
    console.log('Movie clicked:', this.movie.title);
    this.movieClicked.emit(this.movie.title);
  }
}
