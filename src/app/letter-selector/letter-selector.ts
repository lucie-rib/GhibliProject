import { Component } from '@angular/core';

@Component({
  selector: 'app-letter-selector',
  imports: [],
  templateUrl: './letter-selector.html',
  styleUrl: './letter-selector.css',
})
export class LetterSelector {
  current_letter : string = ""
  letter_array : Array<string> = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

  letter_click(letter : string){
    this.current_letter = letter
    console.log(this.current_letter)
  }
}
