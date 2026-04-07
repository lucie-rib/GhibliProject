import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true, 
  templateUrl: './about.html',
  styleUrl: './about.css', 
})
export class About implements OnInit {
  

  patCount: number = 0;  // Counts how many times Totoro has been patted
  isTotoroReacting: boolean = false; // Controls whether Totoro is currently reacting to a pat
  reactionMessage: string = ''; // Message to display based on the number of pats

  constructor() {}

  ngOnInit(): void {}


  patTotoro() {// This method is called when the user clicks on Totoro's image to "pat" him. 
  // It increments the pat count, triggers a reaction, and updates the reaction 
  // message based on how many times Totoro has been patted.
    this.patCount++; 
    this.isTotoroReacting = true; 
    this.reactionMessage = '*Happy Totoro Noises*';

    if (this.patCount === 1) this.reactionMessage += ' <3';
    if (this.patCount === 10) this.reactionMessage = 'He loves you!';
    if (this.patCount === 50) this.reactionMessage = 'Totoro is purring!';


    setTimeout(() => {// After a short delay, reset Totoro's reaction state 
    // so he can react to the next pat.
      this.isTotoroReacting = false;
    }, 500);
  }
}