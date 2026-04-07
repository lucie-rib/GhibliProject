import { Component, Input, inject } from '@angular/core'; 
import { MovieDisplay } from '../movie-display/movie-display';
import { Data } from '../data';

@Component({
  selector: 'app-movies-list',
  imports: [MovieDisplay], // Import the MovieDisplay component to be used within this component's template.
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css',
})
export class MoviesList {
  @Input() selected_letter : string = "" 
  @Input() movies: any[] = [];

  dataService = inject(Data);
  
  selectedMovie: string = '';

  // Called when the component is initialized
ngOnInit() : void { 
  // If no movies are provided, fetch them from the service
  if (this.movies.length === 0) {
    this.dataService.getMovies().subscribe(movies => {
      this.movies = movies; // Save the received movies
    })
  }
}

// Returns the list of movies filtered by the selected letter
selectedMovies(){
  // If no filter or "All", return all movies
  if (!this.selected_letter || this.selected_letter == 'All'){
    return this.movies;
  }

  // Otherwise, filter movies by first letter of title
  return this.movies.filter((movie) => {
    return movie.title?.toUpperCase().startsWith(this.selected_letter)
  })
}

// Updates the selected movie
onSelected(movieName: string) {
  this.selectedMovie = movieName;
}

// Called when a movie is clicked
onMovieClicked(movieName: string) {
  this.onSelected(movieName); // Set the selected movie
}
}