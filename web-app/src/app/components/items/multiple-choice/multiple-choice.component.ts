import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit {
  form: FormGroup;

  currentQuestion: any; 
  private currentTry = 0;

  constructor(private fb: FormBuilder, private quizService: CurrentQuizService) {
    this.currentQuestion = this.quizService.getCurrentQuestion();
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    })
  }

  ngOnInit(): void {
      
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

    if(this.form.value.checkArray.length === this.currentQuestion.additionalInfos.correctAnswer.length){
      let checker = this.currentQuestion.additionalInfos.correctAnswer.every((v:any) => this.form.value.checkArray.includes(v))
      if(checker){
        //HIER ALLES RICHTIG!
        this.questionFinished();
        this.currentTry = 3; 
        tipp.innerHTML = "Alles richtig! Sehr gut :)"
      }
    }

    if(this.currentTry < 3){
      this.currentQuestion.givenAnswers[this.currentTry] = this.form.value.checkArray; 
      let somethingWrong = false; 
      this.form.value.checkArray.forEach((givenAnswer:any) => {
        
        if(this.currentQuestion.additionalInfos.correctAnswer.includes(givenAnswer)){
          console.log("hi")
          console.log(givenAnswer)
          let rightValue = document.getElementById(givenAnswer) as any; 
          rightValue.style = 'color: green';

        }else{
          somethingWrong = true;
          let wrongValue = document.getElementById(givenAnswer) as any; 
          wrongValue.style = 'color: red';
          if(this.currentTry === 0){
            tipp.innerHTML = "Leider nicht richtig. Probier es nochmal! Du hast noch 2 Versuche."
          }

          if(this.currentTry === 1){
            //hier noch der nächste tipp
            tipp.innerHTML = "Hier fehlt noch der 2. Tipp"
          }
          if(this.currentTry === 2){
            this.questionFinished();
            tipp.innerHTML = "Leider nicht richtig. Die richtige Antwort ist mit grün hinterlegt. Du hast leider keinen Versuch mehr";
          }
        }
      })

      if(somethingWrong === false){
        tipp.innerHTML = "Fast richtig. Hast du alle richtigen Optionen ausgewählt?"
      }
      console.log(this.currentQuestion)
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
