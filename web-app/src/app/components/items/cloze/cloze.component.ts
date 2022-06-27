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
  private cloze :any;
  private currentTry = 0; 
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
    "tries": 3,
    "answeredCorrect": false,
    "givenAnswers": [{}],
    "additionalInfos": {
      "gapText": "Bayreuth ist eine fränkische kreisfreie Stadt im bayerischen Regierungsbezirk % Oberfranken %. Die Mittelstadt zählt zur Metropolregion % Nürnberg % und zur Planungsregion Oberfranken-Ost, sie ist Sitz der Regierung von Oberfranken sowie Verwaltungssitz des Bezirks Oberfranken und des Landkreises Bayreuth. Weltberühmt ist Bayreuth durch die alljährlich im Festspielhaus auf dem Grünen Hügel stattfindenden % Richard-Wagner-Festspiele %. Das % Markgräfliche Opernhaus % gehört seit 2012 zum UNESCO-Weltkulturerbe.",
      "correctAnswers": ["Oberfranken", "Nürnberg", "Richard-Wagner-Festspiele", "Markgräfliche Opernhaus"]
    }
  }
  
  constructor(public quizService: CurrentQuizService) {
    // this.currentQuestion = this.quizService.getCurrentQuestion(); 
    // console.log(this.currentQuestion)
  }

  ngOnInit(): void {
    this.setCloze(); 
    document.getElementById("finish_cloze_button")?.setAttribute("hidden", "true")
  }

  ngAfterViewInit(): void{
    // setTimeout( function(){
    //   console.log(document.getElementById("finish_cloze_button"))
    //   document.getElementById("finish_cloze_button")!.style.display = 'none'
    // }, 100)
    
  }

  setCloze(): void {
    let that = this; 
    this.cloze = {
      type: jsPsychCloze,
      text: this.currentQuestion.additionalInfos.gapText,
      check_answers: true,
      mistake_fn: function(){alert("Wrong answer. Please check again."); console.log(that.cloze); console.log(that.jsPsych.data)},
      on_finish: function(){console.log("war richtig")}
    }
    this.jsPsych.run([this.cloze])
    console.log(this.jsPsych.data)
  }


  validateButtonPressed(): void{

    let button = document.getElementById("finish_cloze_button") as any;
    console.log(button)
    button.style.display = 'none';

    let numberInputFields = (this.currentQuestion.additionalInfos.gapText.split("%").length -1)/2;

    let allInputs = [];
    for(let i=0; i < numberInputFields; i++ ){
      let input = document.getElementById("input"+i) as any;
      allInputs.push(input.value)
      this.onValidateAnswer(input, i)
    }
    console.log(allInputs)

    this.currentQuestion.givenAnswers[this.currentTry] = allInputs
    if(JSON.stringify(this.currentQuestion.additionalInfos.correctAnswers) == JSON.stringify(allInputs)){
      console.log("Alles richtig amigo");
      this.cloze.on_finish(); 
    } else{
      this.cloze.mistake_fn(); 
      console.log("Leider nochmal probieren brrt")
      this.currentTry += 1; 
    }

  }
  
  onValidateAnswer(input:any, currentNumber: number){
    let inputValue = input.value;
    if(this.currentQuestion.additionalInfos.correctAnswers[currentNumber].toLowerCase() !== inputValue.toLowerCase()){
     input.style = "border-color: red"
    } else{
      input.style = "border-color: none"
    }
  }

  arrayEquals(a: Array<any>, b: Array<any>) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }
}
