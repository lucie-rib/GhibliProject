
//Ce composant est générer par Chagpt a des fin stylisitque, ne fait pas parti du projet

import { Component, Input } from '@angular/core';
import { CardTierlist } from '../card-tierlist/card-tierlist';

type FanCardStyle = {
  transform: string;
  zIndex: number;
  opacity: number;
};

type VisibleCard = {
  movie: any;
  index: number;
  offset: number;
  style: FanCardStyle;
};

@Component({
  selector: 'app-carousel-card',
  imports: [CardTierlist],
  templateUrl: './carousel-card.html',
  styleUrl: './carousel-card.css',
})
export class CarouselCard {
  // Incoming pool of movies displayed in the fan-style carousel.
  @Input() movies: any[] = [];

  // Index of the currently centered/active card.
  activeIndex = 0;
  // Card currently hovered to slightly boost its visual prominence.
  hoveredIndex: number | null = null;
  // Number of cards shown on each side around the active one.
  readonly visibleRadius = 4;
  // Wheel smoothing state to avoid jumping too fast on trackpads.
  private wheelDeltaBuffer = 0;
  private lastWheelStepAt = 0;
  private readonly wheelThreshold = 34;
  private readonly wheelCooldownMs = 190;

  prev(): void {
    // Move one card backward with circular wrap-around.
    if (this.movies.length === 0) return;
    this.activeIndex = (this.activeIndex - 1 + this.movies.length) % this.movies.length;
  }

  next(): void {
    // Move one card forward with circular wrap-around.
    if (this.movies.length === 0) return;
    this.activeIndex = (this.activeIndex + 1) % this.movies.length;
  }

  select(index: number): void {
    // Click-to-focus behavior on a specific visible card.
    this.activeIndex = index;
  }

  setHovered(index: number | null): void {
    // Tracks hover state for style emphasis.
    this.hoveredIndex = index;
  }

  onWheel(event: WheelEvent): void {
    // Converts wheel gestures into carousel navigation with threshold + cooldown.
    if (!this.movies.length) return;
    event.preventDefault();

    const dominantDelta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    this.wheelDeltaBuffer += dominantDelta;
    const now = performance.now();

    if (now - this.lastWheelStepAt < this.wheelCooldownMs) {
      return;
    }

    if (this.wheelDeltaBuffer >= this.wheelThreshold) {
      this.next();
      this.lastWheelStepAt = now;
      this.wheelDeltaBuffer = 0;
    } else if (this.wheelDeltaBuffer <= -this.wheelThreshold) {
      this.prev();
      this.lastWheelStepAt = now;
      this.wheelDeltaBuffer = 0;
    }
  }

  get visibleCards(): VisibleCard[] {
    // Computes style-ready card descriptors around the current active index.
    if (!this.movies.length) return [];

    const cards: VisibleCard[] = [];
    const length = this.movies.length;
    for (let index = 0; index < length; index++) {
      const offset = this.circularOffset(index, this.activeIndex, length);
      cards.push({
        movie: this.movies[index],
        index,
        offset,
        style: this.cardStyle(offset, index),
      });
    }
    return cards;
  }

  cardStyle(offset: number, index: number): FanCardStyle {
    // Builds fan layout transforms (position, rotation, scale, layering, opacity).
    const absOffset = Math.abs(offset);
    const maxVisible = this.visibleRadius + 1;
    const translateX = offset * 84;
    const isHovered = this.isCardHovered(index);
    const translateY = absOffset * 11 + (isHovered ? -18 : 0);
    const rotate = offset * 5.8;
    const baseScale = offset === 0 ? 1.1 : Math.max(0.8, 1 - absOffset * 0.055);
    const scale = isHovered ? baseScale + 0.08 : baseScale;
    const zIndex = (120 - Math.round(absOffset * 10)) + (isHovered ? 60 : 0);
    const opacity = absOffset > maxVisible ? 0 : (isHovered ? 1 : Math.max(0.1, 1 - absOffset * 0.14));

    return {
      transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`,
      zIndex,
      opacity,
    };
  }

  trackVisibleCard = (_: number, item: VisibleCard): string => {
    // Stable tracking key for Angular @for rendering.
    return String(item.movie?.id ?? item.index);
  };

  isCardHidden(offset: number): boolean {
    // Hide cards outside the extra buffer radius.
    return Math.abs(offset) > this.visibleRadius + 1;
  }

  isCardHovered(index: number): boolean {
    // Utility used by template class bindings.
    return this.hoveredIndex === index;
  }

  private wrapIndex(index: number): number {
    // Keeps an index inside movie array bounds.
    const length = this.movies.length;
    return ((index % length) + length) % length;
  }

  private circularOffset(index: number, active: number, length: number): number {
    // Returns the shortest signed distance between two indices in a circular list.
    let diff = index - active;
    if (diff > length / 2) diff -= length;
    if (diff < -length / 2) diff += length;
    return diff;
  }
}
