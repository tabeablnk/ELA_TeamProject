import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';

@Component({
  selector: 'app-short-answer',
  templateUrl: './short-answer.component.html',
  styleUrls: ['./short-answer.component.scss']
})
export class ShortAnswerComponent implements OnInit {
  
  public currentQuestion: any; 

  private timeOnPage = 0; 
  private interval :any;

  private currentTry = 0; 

  constructor(public quizService: CurrentQuizService) { 
    this.currentQuestion = this.quizService.getCurrentQuestion(); 
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
}
