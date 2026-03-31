
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
  @Input() movies: any[] = [];

  activeIndex = 0;
  hoveredIndex: number | null = null;
  readonly visibleRadius = 4;
  private wheelDeltaBuffer = 0;
  private lastWheelStepAt = 0;
  private readonly wheelThreshold = 34;
  private readonly wheelCooldownMs = 190;

  prev(): void {
    if (this.movies.length === 0) return;
    this.activeIndex = (this.activeIndex - 1 + this.movies.length) % this.movies.length;
  }

  next(): void {
    if (this.movies.length === 0) return;
    this.activeIndex = (this.activeIndex + 1) % this.movies.length;
  }

  select(index: number): void {
    this.activeIndex = index;
  }

  setHovered(index: number | null): void {
    this.hoveredIndex = index;
  }

  onWheel(event: WheelEvent): void {
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
    return String(item.movie?.id ?? item.index);
  };

  isCardHidden(offset: number): boolean {
    return Math.abs(offset) > this.visibleRadius + 1;
  }

  isCardHovered(index: number): boolean {
    return this.hoveredIndex === index;
  }

  private wrapIndex(index: number): number {
    const length = this.movies.length;
    return ((index % length) + length) % length;
  }

  private circularOffset(index: number, active: number, length: number): number {
    let diff = index - active;
    if (diff > length / 2) diff -= length;
    if (diff < -length / 2) diff += length;
    return diff;
  }
}
