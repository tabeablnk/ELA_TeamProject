import { Component, OnInit } from '@angular/core';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements OnInit {

  public currentQuestion: any; 
  
  constructor(public quizService: CurrentQuizService) {
    this.currentQuestion = this.quizService.getCurrentQuestion(); 
  }

  ngOnInit(): void {
  }

}
