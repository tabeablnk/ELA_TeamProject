import { Output, Component, OnInit, EventEmitter } from '@angular/core';
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

  private timeOnPage = 0; 
  private interval :any;
  
  constructor(public quizService: CurrentQuizService) {
    this.currentQuestion = this.quizService.getCurrentQuestion(); 
    this.currentQuestion.givenAnswers = [];
    this.currentQuestion.answeredCorrect = false; 
    // console.log(this.currentQuestion)
  }

  ngOnInit(): void {
    this.setCloze(); 
    document.getElementById("finish_cloze_button")?.setAttribute("hidden", "true")
    
    this.interval = setInterval(()=>{
      this.timeOnPage++;
    },1000)
  }

  ngAfterViewInit(): void{
    // setTimeout( function(){
    //   console.log(document.getElementById("finish_cloze_button"))
    //   document.getElementById("finish_cloze_button")!.style.display = 'none'
    // }, 1000
  }

  ngOnDestroy(){
    let destroyCloze = document.getElementById("display_gaze");
    destroyCloze?.remove()
    clearInterval(this.interval)
    this.currentQuestion.timeNeeded = this.timeOnPage;
    this.currentQuestion.timeSummedUp += this.timeOnPage;
    this.currentQuestion.triesSummedUp += this.currentTry; 
    this.currentQuestion.alreadyAnsweredCount += 1; 
    this.onSetStateNextBtn(false);
    this.quizService.saveGivenAnswer(this.currentQuestion)
  }

  @Output() enableNextBtn = new EventEmitter<boolean>();
  onSetStateNextBtn(value: boolean) {
    this.enableNextBtn.emit(value);
  } 
  
  setCloze(): void {
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
      // this.quizService.saveGivenAnswer(this.currentQuestion)
    }
    if(JSON.stringify(this.currentQuestion.additionalInfos.correctAnswers) == JSON.stringify(allInputs)){
      document.getElementById("tipps")!.innerHTML = "Richtig! Sehr gut gemacht :)"
      this.onSetStateNextBtn(true);
      this.currentQuestion.answeredCorrect = true; 
      this.cloze.on_finish(); 
    } else{
      this.cloze.mistake_fn(); 
    }

    this.currentTry += 1;
  }
  
  onValidateAnswer(input:any, currentNumber: number){
    let inputValue = input.value;
    let tipp = document.getElementById("tipps") as any;
    if(this.currentTry < 3){
      let difference = this.findDiff(this.currentQuestion.additionalInfos.correctAnswers[currentNumber].toLowerCase(), inputValue.toLowerCase())
      let differenceReverse = this.findDiff(inputValue.toLowerCase(), this.currentQuestion.additionalInfos.correctAnswers[currentNumber].toLowerCase())
      
      // if(this.currentQuestion.additionalInfos.correctAnswers[currentNumber].toLowerCase() !== inputValue.toLowerCase()){
      if(difference > 3 || differenceReverse > 3){
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
        this.onSetStateNextBtn(true);
        tipp.innerHTML = "Schade, leider hast du es nicht ganz richtig. Du hast leider keine Versuche mehr."
       }
      } else{
        input.style = "border-color: green"
        input.value = this.currentQuestion.additionalInfos.correctAnswers[currentNumber];
        this.onSetStateNextBtn(true);
        tipp.innerHTML = "Richtig! Sehr gut gemacht :)"
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
