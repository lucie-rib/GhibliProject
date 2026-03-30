import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true, 
  templateUrl: './about.html',
  styleUrl: './about.css', 
})
export class About implements OnInit {
  

  patCount: number = 0; 
  isTotoroReacting: boolean = false; 
  reactionMessage: string = ''; 

  constructor() {}

  ngOnInit(): void {}


  patTotoro() {
    this.patCount++; 
    this.isTotoroReacting = true; 
    this.reactionMessage = '*Happy Totoro Noises*';

    if (this.patCount === 1) this.reactionMessage += ' <3';
    if (this.patCount === 10) this.reactionMessage = 'He loves you!';
    if (this.patCount === 50) this.reactionMessage = 'Totoro is purring!';


    setTimeout(() => {
      this.isTotoroReacting = false;
    }, 500);
  }
}