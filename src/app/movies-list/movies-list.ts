import { Component, Input } from '@angular/core'; 
import { MovieDisplay } from '../movie-display/movie-display';

@Component({
  selector: 'app-movies-list',
  imports: [MovieDisplay],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css',
})
export class MoviesList {
  @Input() movies: any[] = [];
  
  selectedMovie: string = '';

  onSelected(movieName: string) {
    this.selectedMovie = movieName;
  }

  onMovieClicked(movieName: string) {
    console.log('Movie clicked :' + movieName);
    this.onSelected(movieName);
  }
}