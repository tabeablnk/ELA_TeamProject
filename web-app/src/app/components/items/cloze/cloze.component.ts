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

  public currentQuestion: any; 
  // public currentQuestion = {
  //   "questionId": 3,
  //   "questionType": 4,
  //   "questionTypeName": "Cloze",
  //   "category": 1,
  //   "questionText": "Fülle die Lücken du Loser!",
  //   "imageUrl": "",
  //   "tip": "Hier ein Tipp",
  //   "tries": 3,
  //   "answeredCorrect": false,
  //   "givenAnswers": [{}],
  //   "additionalInfos": {
  //     "gapText": "Bayreuth ist eine fränkische kreisfreie Stadt im bayerischen Regierungsbezirk % Oberfranken %. Die Mittelstadt zählt zur Metropolregion % Nürnberg % und zur Planungsregion Oberfranken-Ost, sie ist Sitz der Regierung von Oberfranken sowie Verwaltungssitz des Bezirks Oberfranken und des Landkreises Bayreuth. Weltberühmt ist Bayreuth durch die alljährlich im Festspielhaus auf dem Grünen Hügel stattfindenden % Richard-Wagner-Festspiele %. Das % Markgräfliche Opernhaus % gehört seit 2012 zum UNESCO-Weltkulturerbe.",
  //     "correctAnswers": ["Oberfranken", "Nürnberg", "Richard-Wagner-Festspiele", "Markgräfliche Opernhaus"]
  //   }
  // }

  private timeOnPage = 0; 
  private interval :any;
  
  constructor(public quizService: CurrentQuizService) {
    this.currentQuestion = this.quizService.getCurrentQuestion(); 
    // console.log(this.currentQuestion)
  }

  ngOnInit(): void {
    this.setCloze(); 
    document.getElementById("finish_cloze_button")?.setAttribute("hidden", "true")
    
    this.interval = setInterval(()=>{
      this.timeOnPage++;
      console.log(this.timeOnPage)
    },1000)
  }

  ngAfterViewInit(): void{
    // setTimeout( function(){
    //   console.log(document.getElementById("finish_cloze_button"))
    //   document.getElementById("finish_cloze_button")!.style.display = 'none'
    // }, 1000
  }
  ngOnDestroy(){
    clearInterval(this.interval)
    this.currentQuestion.timeOnPage = this.timeOnPage;
    this.quizService.saveGivenAnswer(this.currentQuestion)

  }

  setCloze(): void {
    let that = this; 
    this.cloze = {
      type: jsPsychCloze,
      text: this.currentQuestion.additionalInfos.gapText,
      check_answers: true,
      mistake_fn: function(){},
      on_finish: function(){}
    }
    this.jsPsych.run([this.cloze])
  }


  validateButtonPressed(): void{

    let button = document.getElementById("finish_cloze_button") as any;
    button.style.display = 'none';

    let numberInputFields = (this.currentQuestion.additionalInfos.gapText.split("%").length -1)/2;

    let allInputs = [];
    for(let i=0; i < numberInputFields; i++ ){
      let input = document.getElementById("input"+i) as any;
      allInputs.push(input.value)
      this.onValidateAnswer(input, i)
    }



    if(this.currentTry < 3){
      this.currentQuestion.givenAnswers[this.currentTry] = allInputs
      this.quizService.saveGivenAnswer(this.currentQuestion)
    }
    if(JSON.stringify(this.currentQuestion.additionalInfos.correctAnswers) == JSON.stringify(allInputs)){
      console.log(this.currentQuestion)
      document.getElementById("tipps")!.innerHTML = "Richtig! Sehr gut gemacht :)"
      this.currentQuestion.answeredCorrect = true; 
      this.cloze.on_finish(); 
    } else{
      this.cloze.mistake_fn(); 
      console.log(this.currentQuestion)
    }

    this.currentTry += 1;
  }
  
  onValidateAnswer(input:any, currentNumber: number){
    let inputValue = input.value;
    let tipp = document.getElementById("tipps") as any;
    if(this.currentTry < 3){
      if(this.currentQuestion.additionalInfos.correctAnswers[currentNumber].toLowerCase() !== inputValue.toLowerCase()){
       input.style = "border-color: red"
       if(this.currentTry === 0){
        tipp.innerHTML = "Leider nicht richtig. Die falschen Antworten sind mit rot hinterlegt. Du hast noch 2 Versuche."
       }
       if(this.currentTry === 1){
        input.value = Array.from(this.currentQuestion.additionalInfos.correctAnswers[currentNumber])[0];
        tipp.innerHTML = "Leider immer noch nicht ganz richtig. Als Tipp stehen die Anfangsbuchstaben in den Feldern! \n Du hast noch 1 Versuch. "
       } 
       if(this.currentTry === 2){
        input.disabled = true; 
        input.value = this.currentQuestion.additionalInfos.correctAnswers[currentNumber];
        tipp.innerHTML = "Schade, leider hast du es nicht ganz richtig. Du hast leider keine Versuche mehr."
       }
      } else{
        input.style = "border-color: green"
      
      }
    }else{
      return;
    }

  }

  arrayEquals(a: Array<any>, b: Array<any>) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }
}
