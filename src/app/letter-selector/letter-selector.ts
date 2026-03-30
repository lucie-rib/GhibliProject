import { Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-letter-selector',
  imports: [],
  templateUrl: './letter-selector.html',
  styleUrl: './letter-selector.css',
})
export class LetterSelector {
  @Output() emitted_letter  = new EventEmitter<string>()
  
  current_letter : string = ""
  letter_array = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));




  letter_click(letter : string){
    this.current_letter = letter
    this.emitted_letter.emit(this.current_letter)
  }
}
