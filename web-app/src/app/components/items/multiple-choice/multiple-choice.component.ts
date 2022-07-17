import { Component, OnInit } from '@angular/core';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit {

  public currentQuestion: any; 

  private timeOnPage = 0; 
  private interval :any;
  
  private currentTry = 0; 

  constructor(public quizService: CurrentQuizService) { 
    this.currentQuestion = this.quizService.getCurrentQuestion();
    this.currentQuestion.givenAnswers = [];  
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
    this.quizService.saveGivenAnswer(this.currentQuestion)
  }

}
