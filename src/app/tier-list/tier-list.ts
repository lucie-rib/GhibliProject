import { Component, inject, Input } from '@angular/core';
import { CardTierlist } from '../card-tierlist/card-tierlist';
import { Data } from '../data';

@Component({
  selector: 'app-tier-list',
  imports: [CardTierlist],
  templateUrl: './tier-list.html',
  styleUrl: './tier-list.css',
})
export class TierList {
  
  @Input() S_line: any[] = [];
  @Input() A_line: any[] = [];
  @Input() B_line: any[] = [];
  @Input() C_line: any[] = [];
  @Input() D_line: any[] = [];
  
  movies: any[] = [];
  dataService = inject(Data);

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
}
