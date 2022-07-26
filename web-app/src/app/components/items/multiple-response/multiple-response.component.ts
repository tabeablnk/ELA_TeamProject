
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';

@Component({
  selector: 'app-multiple-response',
  templateUrl: './multiple-response.component.html',
  styleUrls: ['./multiple-response.component.scss']
})
export class MultipleResponseComponent implements OnInit {
  form: FormGroup;
  
  public currentQuestion: any; 

  private timeOnPage = 0; 
  private interval :any;
  
  private currentTry = 0; 

  constructor(private fb: FormBuilder, public quizService: CurrentQuizService) { 
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    })
    this.currentQuestion = this.quizService.getCurrentQuestion();
    this.currentQuestion.givenAnswers = [];
    this.currentQuestion.answeredCorrect = false; 
  }

  ngOnInit(): void {  
    this.onSetStateNextBtn(false);
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
    this.onSetStateNextBtn(false)
  }

  @Output() enableNextBtn = new EventEmitter<boolean>();
  onSetStateNextBtn(value: boolean) {
    this.enableNextBtn.emit(value);
  } 


  onCheckboxChange(e:any) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
  
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  validateButtonPressed() {
    console.log(this.form.value.checkArray)
    let tipp = document.getElementById("tipps") as any; 


    if(this.currentTry < 3){
      this.currentQuestion.givenAnswers[this.currentTry] = this.form.value.checkArray; 
      let somethingWrong = false; 


      if(this.form.value.checkArray.length === this.currentQuestion.additionalInfos.correctAnswer.length){
        let checker = this.currentQuestion.additionalInfos.correctAnswer.every((v:any) => this.form.value.checkArray.includes(v))
        if(checker){
          //HIER ALLES RICHTIG!
          this.questionFinished();
          this.currentTry = 3; 
          this.onSetStateNextBtn(true);
          tipp.innerHTML = "Alles richtig! Sehr gut :)"
          this.currentQuestion.answeredCorrect = true; 
        }
      }

      this.form.value.checkArray.forEach((givenAnswer:any) => {
        
        if(this.currentQuestion.additionalInfos.correctAnswer.includes(givenAnswer)){
          let rightValue = document.getElementById(givenAnswer) as any; 
          rightValue.style = 'color: green';
          if(this.form.value.checkArray.length < this.currentQuestion.additionalInfos.correctAnswer.length){
            tipp.innerHTML = "Fast richtig. Hast du alle richtigen Optionen ausgewählt?"
          }

        }else{
          somethingWrong = true;
          let wrongValue = document.getElementById(givenAnswer) as any; 
          wrongValue.style = 'color: red';
          if(this.currentTry === 0){
            tipp.innerHTML = "Leider nicht richtig. Probier es nochmal! Du hast noch 2 Versuche."
          }

          if(this.currentTry === 1){
            //hier noch der nächste tipp
            tipp.innerHTML = "Immer noch nicht richtig. Probier es nochmal! Du hast noch 1 Versuch."
          }
          if(this.currentTry === 2){
            this.questionFinished();
            tipp.innerHTML = "Leider nicht richtig. Die richtige Antwort ist mit grün hinterlegt. Du hast leider keinen Versuch mehr";
            this.currentQuestion.answeredCorrect = false; 
            this.onSetStateNextBtn(true);
          }
        }

      })
      this.currentTry +=1; 
    }
  }
 
  questionFinished():void{
    this.currentQuestion.additionalInfos.correctAnswer.forEach((rightAnser:any) => {
      let rightValue = document.getElementById(rightAnser) as any; 
      rightValue.style = 'color: green';
    })
    this.currentQuestion.additionalInfos.options.forEach((option:any) => {
      let box = document.getElementById('box-'+option) as any; 
      box.disabled = true;
    })
      
  }
}
