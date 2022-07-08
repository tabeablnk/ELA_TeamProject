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
    this.quizService.saveGivenAnswer(this.currentQuestion)
  }

}
