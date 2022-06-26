import { Component, OnInit } from '@angular/core';
import { initJsPsych, JsPsych } from 'jspsych';
import jsPsychCloze from '@jspsych/plugin-cloze';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';

@Component({
  selector: 'app-cloze',
  templateUrl: './cloze.component.html',
  styleUrls: ['./cloze.component.scss']
})
export class ClozeComponent implements OnInit {
  
  private jsPsych = initJsPsych({
    display_element: 'display_gaze'
  });     

  // public currentQuestion: any; 
  public currentQuestion = {
    "questionId": 3,
    "questionType": 4,
    "questionTypeName": "Cloze",
    "category": 1,
    "questionText": "Fülle die Lücken du Loser!",
    "imageUrl": "",
    "tip": "Hier ein Tipp",
    "answeredCorrect": false,
    "givenAnswers": ["answer1", "answer2"],
    "additionalInfos": {
      "gapText": "Bayreuth ist eine fränkische kreisfreie Stadt im bayerischen Regierungsbezirk % Oberfranken %. Die Mittelstadt zählt zur Metropolregion % Nürnberg % und zur Planungsregion Oberfranken-Ost, sie ist Sitz der Regierung von Oberfranken sowie Verwaltungssitz des Bezirks Oberfranken und des Landkreises Bayreuth. Weltberühmt ist Bayreuth durch die alljährlich im Festspielhaus auf dem Grünen Hügel stattfindenden % Richard-Wagner-Festspiele %. Das % Markgräfliche Opernhaus % gehört seit 2012 zum UNESCO-Weltkulturerbe.",
      "correctAnswer": "???? noch offen"
    }
  }
  
  constructor(public quizService: CurrentQuizService) {
    // this.currentQuestion = this.quizService.getCurrentQuestion(); 
    // console.log(this.currentQuestion)
  }

  ngOnInit(): void {
    this.setCloze(); 
  }

  setCloze(): void {
    let that = this; 
    let cloze = {
      type: jsPsychCloze,
      text: this.currentQuestion.additionalInfos.gapText,
      check_answers: true,
      button_text: 'Next',
      mistake_fn: function(){alert("Wrong answer. Please check again."); console.log(cloze); console.log(that.jsPsych.data)},
      on_finish: function(){alert("Alles richtig bro, gut gemacht"), console.log(that.jsPsych.data)}
    }

    this.jsPsych.run([cloze])
    console.log(this.jsPsych.data)
  }

}
