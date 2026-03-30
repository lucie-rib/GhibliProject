import { Component, Input } from '@angular/core'; // 👈 Plus besoin de 'inject'
import { MovieDisplay } from '../movie-display/movie-display';
// 👈 Plus besoin d'importer 'Data'

@Component({
  selector: 'app-movies-list',
  imports: [MovieDisplay],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css',
})
export class MoviesList {
  // C'est tout ce dont on a besoin : on attend la liste venant de Body
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