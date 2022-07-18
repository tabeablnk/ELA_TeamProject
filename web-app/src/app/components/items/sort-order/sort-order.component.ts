import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';

@Component({
  selector: 'app-sort-order',
  templateUrl: './sort-order.component.html',
  styleUrls: ['./sort-order.component.scss']
})
export class SortOrderComponent implements OnInit {
  answerList: any
  currentAnswer: any
  rightAnswer: any
  private leftTrys = 3;

  currentQuestion :any; 

  private timeOnPage = 0; 
  private interval :any;

  constructor(public quizService: CurrentQuizService) {
    this.currentQuestion = this.quizService.getCurrentQuestion()
    this.answerList=this.currentQuestion.additionalInfos.correctAnswer
  }

  ngOnInit(): void {
    this.randomizeList()
    this.calculateRightAnswer()
    
    this.interval = setInterval(()=>{
      this.timeOnPage++;
    },1000)
  }

  ngOnDestroy(){
    clearInterval(this.interval)
    this.currentQuestion.timeNeeded = this.timeOnPage;
    this.currentQuestion.alreadyAnsweredCount += 1; 
    this.currentQuestion.timeSummedUp += this.timeOnPage;
    this.currentQuestion.triesSummedUp += this.leftTrys; 
    this.quizService.saveGivenAnswer(this.currentQuestion)
  }

  validateButtonPressed()
  {
    let domItemTipps = document.getElementById('tipps') as any;
    this.leftTrys--

    if(this.leftTrys >= 0){
      this.currentQuestion.givenAnswers[2-this.leftTrys] = this.currentAnswer
      console.log(this.currentQuestion)
      this.quizService.saveGivenAnswer(this.currentQuestion)
    }


    switch(this.leftTrys){
      case 2:
        console.log("first Try")
        if(!this.checkAnswer()){
          domItemTipps.innerHTML="Leider nicht richtig. Probier es nochmal! Du hast noch 2 Versuche."
        } else{
          domItemTipps.innerHTML="Super, richtige Antwort!"
          this.currentQuestion.answeredCorrect = true;

        }
        break;
      case 1:
        console.log("Second Try")
        if(!this.checkAnswer()){
          domItemTipps.innerHTML="Leider immer noch nicht richtig. Du hast noch 1 Versuch."
        } else{
          domItemTipps.innerHTML="Super, richtige Antwort!"
          this.currentQuestion.answeredCorrect = true;
        }
        break;
      case 0:
        console.log("Third Try")
        if(!this.checkAnswer()){
          domItemTipps.innerHTML="Leider falsch, die richtige Antwort wird jetzt angezeigt."
          
          //Show right Answer
          this.currentAnswer = this.rightAnswer
          this.currentAnswer.forEach((element: any, currentIndex: any) => {
            let domItem = document.getElementById(element.name) as any;
            domItem.style = 'color : green';
          })
        } else{
          domItemTipps.innerHTML="Super, richtige Antwort!"
          this.currentQuestion.answeredCorrect = true;
        }
        break;
    }
  }
  


  checkAnswer() {
    let stillTrue: boolean = true

    this.currentAnswer.forEach((element: any, currentIndex: any) => {
      let domItem = document.getElementById(element.name) as any;
      domItem.style = 'color : green';
      if(element.name !== this.rightAnswer[currentIndex].name)
      {
        stillTrue = false
        domItem.style = 'color : red';
      }    
    });
    return stillTrue;
  }

  calculateRightAnswer() {
    this.rightAnswer = this.answerList.slice();
    this.rightAnswer.sort(function(a: any, b: any){return b.value-a.value});
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

  /* questiondata = {
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
  } */


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.currentAnswer, event.previousIndex, event.currentIndex);
  }

}
