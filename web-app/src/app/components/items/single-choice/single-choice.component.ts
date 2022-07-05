import { Component, OnInit } from '@angular/core';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';

@Component({
  selector: 'app-single-choice',
  templateUrl: './single-choice.component.html',
  styleUrls: ['./single-choice.component.scss'],
})
export class SingleChoiceComponent implements OnInit {
  private currentTry = 0;
  public selectedSolution: string = '';

  currentQuestion :any; 

  constructor(public quizService: CurrentQuizService) {
      this.currentQuestion = this.quizService.getCurrentQuestion();
    //   // console.log(this.currentQuestion)
  }

  // currentQuestion = {
  //   questionId: 0,
  //   questionType: 1,
  //   questionTypeName: 'SingleChoice',
  //   category: 1,
  //   questionText: 'Wer ist der/die Coolste?',
  //   imageUrl: '',
  //   tip: 'Hier ein Tipp',
  //   answeredCorrect: false,
  //   givenAnswers: ['answer1', 'answer2'],

  //   additionalInfos: {
  //     options: ['Tim', 'Jonas', 'Tabea', 'Narjes', 'Franzi'],
  //     correctAnswer: 'Tim',
  //   },
  // };

  ngOnInit(): void {}

  validateButtonPressed(): void {
    let selected = document.getElementById(this.selectedSolution) as any;
    let tipp = document.getElementById("tipps") as any;
    let wrongOptions = this.currentQuestion.additionalInfos.options.filter((e:any) => e !== this.currentQuestion.additionalInfos.correctAnswer);

    if (
      this.selectedSolution === this.currentQuestion.additionalInfos.correctAnswer) {
      selected.style = 'color : green';
      tipp.innerHTML = "Richtig! Sehr gut gemacht :)"
      this.currentQuestion.answeredCorrect = true; 
      wrongOptions.forEach((wrongOption:any) => {
        let wo = document.getElementById(wrongOption) as any; 
        wo.style = 'color : red; text-decoration: line-through';

      })
    } else {
      selected.style = 'color : red; text-decoration: line-through';
      selected.disabled = true;
      if (this.currentTry < 3) {
        if (this.currentTry === 0) {
          tipp.innerHTML = "Leider nicht richtig. Probier es nochmal! Du hast noch 2 Versuche."
       
        }
        if (this.currentTry === 1) {
          let halfOptions = Math.floor(this.currentQuestion.additionalInfos.options.length / 2);
          console.log(halfOptions);

          console.log(wrongOptions) 
          let cuttedOptions = this.getRandom(wrongOptions, halfOptions);
          
          cuttedOptions.forEach((wrongOption:any) => {
            let wo = document.getElementById(wrongOption) as any; 
            wo.style = 'color : red; text-decoration: line-through'
          })
          tipp.innerHTML = "Leider immer noch nicht richtig. Du hast noch 1 Versuch."
        }
        if(this.currentTry === 2){
          let rightAnswer = document.getElementById(this.currentQuestion.additionalInfos.correctAnswer) as any; 
          this.selectedSolution = rightAnswer;
          rightAnswer.checked = true; 
          rightAnswer.style = 'color : green'

          wrongOptions.forEach((wrongOption:any) => {
            let wo = document.getElementById(wrongOption) as any; 
            wo.style = 'color : red; text-decoration: line-through';
          })
          var x = document.getElementsByClassName("radio-group") as any;
          var i;
          for (i = 0; i < x.length; i++) {
              x[i].disabled = true;
          }
          tipp.innerHTML = "Leider nicht richtig. Die richtige Antwort ist mit grün hinterlegt. Du hast leider keinen Versuch mehr"
        }
      }
    }    
    
    if(this.currentTry < 3){
      this.currentQuestion.givenAnswers[this.currentTry] = this.selectedSolution
      console.log(this.currentQuestion)
      this.quizService.saveGivenAnswer(this.currentQuestion)
    }
    
    this.currentTry += 1;
  }

  getRandom(arr: any, n: any) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
}
