import { Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-letter-selector',
  imports: [],
  templateUrl: './letter-selector.html',
  styleUrl: './letter-selector.css',
})
export class LetterSelector {
  // Emits the selected letter to parent containers.
  @Output() emitted_letter  = new EventEmitter<string>()
  
  // Letter currently highlighted in the selector.
  current_letter : string = ""
  // Static A-Z list used to render selector buttons.
  letter_array = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));




  letter_click(letter : string){
    // Update local selection and notify the parent component.
    this.current_letter = letter
    this.emitted_letter.emit(this.current_letter)
  }
}
