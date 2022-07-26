import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';

@Component({
  selector: 'app-short-answer', 
  templateUrl: './short-answer.component.html',
  styleUrls: ['./short-answer.component.scss']
})
export class ShortAnswerComponent implements OnInit {
  inputValue = '';
  
  public currentQuestion: any; 

  private timeOnPage = 0; 
  private interval :any;

  private currentTry = 0; 

  constructor(public quizService: CurrentQuizService) { 
    this.currentQuestion = this.quizService.getCurrentQuestion(); 
    this.currentQuestion.answeredCorrect = false; 
  }

  ngOnInit(): void {
    this.interval = setInterval(()=>{
      this.timeOnPage++;
    },1000)
  }

  ngOnDestroy(){
    clearInterval(this.interval)
    this.currentQuestion.timeNeeded = this.timeOnPage;
    this.currentQuestion.alreadyAnsweredCount += 1; 
    this.currentQuestion.timeSummedUp += this.timeOnPage;
    this.currentQuestion.triesSummedUp += this.currentTry; 
    this.onSetStateNextBtn(false);
    this.quizService.saveGivenAnswer(this.currentQuestion)
  }


  @Output() enableNextBtn = new EventEmitter<boolean>();
  onSetStateNextBtn(value: boolean) {
    this.enableNextBtn.emit(value);
  }

  onValidateAnswer(){
    let tipp = document.getElementById("tipps") as any;
    if(this.currentTry < 3){
      this.currentQuestion.givenAnswers[this.currentTry] = this.inputValue.toLowerCase();
      let difference = this.findDiff(this.currentQuestion.additionalInfos.correctAnswer.toLowerCase(), this.inputValue.toLowerCase())
      let differenceReverse = this.findDiff(this.inputValue.toLowerCase(), this.currentQuestion.additionalInfos.correctAnswer.toLowerCase())
      
      // if(this.currentQuestion.additionalInfos.correctAnswers[currentNumber].toLowerCase() !== inputValue.toLowerCase()){
      if(difference > 3 || differenceReverse > 3){
      
       if(this.currentTry === 0){
        tipp.innerHTML = "Leider nicht richtig. Du hast noch 2 Versuche."
       }
       if(this.currentTry === 1){
        this.inputValue = this.currentQuestion.additionalInfos.correctAnswer[0];
        tipp.innerHTML = "Leider immer noch nicht ganz richtig. Als Tipp steht der Anfangsbuchstabe in den Feldern! \n Du hast noch 1 Versuch. "
       } 
       if(this.currentTry === 2){
        //inputValue.disabled = true; 
        this.inputValue = this.currentQuestion.additionalInfos.correctAnswer;
        this.onSetStateNextBtn(true);
        this.currentQuestion.answeredCorrect = false; 
        tipp.innerHTML = "Schade, leider hast du es nicht ganz richtig. Du hast leider keine Versuche mehr."
       }
       this.currentTry++
      } else{
        //inputValue.style = "border-color: green"
        this.inputValue = this.currentQuestion.additionalInfos.correctAnswer;
        this.currentQuestion.answeredCorrect = true; 
        this.onSetStateNextBtn(true);
        tipp.innerHTML = "Richtig! Sehr gut gemacht :)"
        let inputfield = document.getElementById("inputfield") as any;
        inputfield.style = 'color : green';
      }
    }else{
      // input.value = this.currentQuestion.additionalInfos.correctAnswers[currentNumber];
      return;
    }



  }

  findDiff(str1: string, str2: string){
    let diff = ""; 

    str1.split("").forEach(function(val:any, i:any) {
      if(val != str2.charAt(i)){
        diff += val
      }
    })
    return diff.length;
  }


}
