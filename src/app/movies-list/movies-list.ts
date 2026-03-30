import { Component, inject, Input } from '@angular/core';
import { MovieDisplay } from '../movie-display/movie-display';
import { Data } from '../data';

@Component({
  selector: 'app-movies-list',
  imports: [MovieDisplay],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css',
})
export class MoviesList {
  dataService = inject(Data);
  movies: any[] = [];
  selectedMovie: string = '';

  ngOnInit() : void { 
    if (this.movies.length === 0) {
      console.log('1 - ngOnInit called');
      this.dataService.getMovies().subscribe(movies => {
        console.log('2 - Movies received from service');
        this.movies = movies;
      })
      console.log('3 - ngOnInit finished');
    }
  }
  
  onSelected(movieName: string) {
    this.selectedMovie = movieName;
  }

  onMovieClicked(movieName: string) {
    console.log('Movie clicked :' + movieName);
    this.onSelected(movieName);
  }
}
