import { Component, inject, Input } from '@angular/core';
import { CarouselCard } from '../carousel-card/carousel-card';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CardTierlist } from '../card-tierlist/card-tierlist';
import { Data } from '../data';

@Component({
  selector: 'app-tier-list',
  imports: [CarouselCard, CdkDropList, CardTierlist],
  templateUrl: './tier-list.html',
  styleUrl: './tier-list.css',
})
export class TierList {
  
  // Tier buckets managed by drag and drop interactions.
  @Input() S_line: any[] = [];
  @Input() A_line: any[] = [];
  @Input() B_line: any[] = [];
  @Input() C_line: any[] = [];
  @Input() D_line: any[] = [];

  // Movie pool feeding the bottom carousel area.
  movies: any[] = [];
  // IDs shared by all drop lists to allow cross-zone transfers.
  connectedDropLists = ['poolList', 'tierS', 'tierA', 'tierB', 'tierC', 'tierD'];
  dataService = inject(Data);

  ngOnInit() : void { 
    // Initial fetch for the source movie pool.
    if (this.movies.length === 0) {
      console.log('1 - ngOnInit called');
      this.dataService.getMovies().subscribe(movies => {
        console.log('2 - Movies received from service');
        this.movies = movies;
      })
      console.log('3 - ngOnInit finished');
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    // Main DnD router: handles pool -> tier, tier -> pool, reorder, and tier -> tier.
    const draggedMovie = event.item.data as any;

    // Moving from pool into a tier removes from pool and inserts into destination.
    if (event.previousContainer.id === 'poolList' && event.container.id !== 'poolList') {
      const sourceIndex = this.movies.findIndex((movie) => movie.id === draggedMovie?.id);
      if (sourceIndex < 0) return;
      this.movies.splice(sourceIndex, 1);
      event.container.data.splice(event.currentIndex, 0, draggedMovie);
      return;
    }

    // Moving back to pool returns the card to the carousel data source.
    if (event.previousContainer.id !== 'poolList' && event.container.id === 'poolList') {
      const sourceArray = event.previousContainer.data;
      const sourceIndex = sourceArray.findIndex((movie: any) => movie.id === draggedMovie?.id);
      if (sourceIndex < 0) return;
      sourceArray.splice(sourceIndex, 1);
      this.movies.push(draggedMovie);
      return;
    }

    // Reordering is enabled only inside tiers, not inside the pool carousel list.
    if (event.previousContainer === event.container) {
      if (event.container.id === 'poolList') {
        return;
      }
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    // Generic transfer between two distinct tier rows.
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
