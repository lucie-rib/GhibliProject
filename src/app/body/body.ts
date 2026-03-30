import { Component } from '@angular/core';
import { MoviesList } from '../movies-list/movies-list';

@Component({
  selector: 'app-body',
  imports: [MoviesList],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {}
