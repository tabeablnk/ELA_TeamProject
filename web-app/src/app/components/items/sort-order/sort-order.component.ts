import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sort-order',
  templateUrl: './sort-order.component.html',
  styleUrls: ['./sort-order.component.scss']
})
export class SortOrderComponent implements OnInit {
  answerList: any
  currentAnswer: any
  rightAnswer: any
  constructor() {

  }

  ngOnInit(): void {
    this.answerList = this.questiondata.additonalInfos.correctAnswer
    this.randomizeList()
    this.calculateRightAnswer()
    

  }
  checkAnswer() {
    let flag: boolean = true
    this.currentAnswer.forEach((element: any, currentIndex: any) => {
      
      if(element.name !== this.rightAnswer[currentIndex].name)
      {
        flag = false
      }
      
    });
    console.log(flag)
    return flag;
  }


  checkAnswer2() {
    this.currentAnswer.forEach((element: any, currentIndex: any) => {
      if(element.name !== this.rightAnswer[currentIndex].name)
      {
        return false
      }
      return true
    });
    return true;
  }
  
  calculateRightAnswer() {
    this.rightAnswer = this.answerList.slice();
    this.rightAnswer.sort(function(a: any, b: any){return b.value-a.value});
    console.log(this.rightAnswer)
  }
  randomizeList() {
    this.currentAnswer = this.answerList.slice();

    let currentIndex = this.currentAnswer.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [this.currentAnswer[currentIndex], this.currentAnswer[randomIndex]] = [
        this.currentAnswer[randomIndex], this.currentAnswer[currentIndex]];
    }
  }

  questiondata = {
    "questionId": 0,
    "questionType": 1,
    "category": 0,
    "questionText": "",
    "imageUrl": "",
    "tip": "",
    "answeredCorrect": false,
    "givenAnswers": ["answer1", "answer2"],

    "additonalInfos": {
      "options": ["", ""],
      "correctAnswer": [
        {
          "name": "Nürnberg",
          "value": 500000
        },
        {
          "name": "München",
          "value": 1600000
        },
        {
          "name": "Augsburg",
          "value": 2000
        },
        {
          "name": "Ingolstadt",
          "value": 3000
        },
        {
          "name": "Lauf a. d. Pegnitz",
          "value": 100
        }
      ]
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.currentAnswer, event.previousIndex, event.currentIndex);
  }

}
