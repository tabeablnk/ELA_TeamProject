import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';
import { QuestiontemplatesService } from 'src/app/services/questiontemplates.service';
import { StateService } from 'src/app/services/state.service';
import { Category } from '../../models/state-enum.model';
import { ClozeComponent } from '../items/cloze/cloze.component';
import { MapSelectionComponent } from '../items/map-selection/map-selection.component';
import { SingleChoiceComponent } from '../items/single-choice/single-choice.component';
import { SortOrderComponent } from '../items/sort-order/sort-order.component';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit, OnDestroy {

  /**
   * VIEW CHILDS FOR THE ITEM TYPES
   * => needed to call the functions of the child-component when pressing the "Eingabe Überprüfen"-Button
   */
  @ViewChild(ClozeComponent) cloze: ClozeComponent | undefined; 
  @ViewChild(SortOrderComponent) sortOrder: SortOrderComponent | undefined;
  @ViewChild(MapSelectionComponent) mapSelection: MapSelectionComponent | undefined;
  @ViewChild(SingleChoiceComponent) singleChoice: SingleChoiceComponent | undefined;


  public currentQuestion : any; 
  public currentQuestionNum : number = 1; 
    
  public category: Category;
  public questionTemplates : Array<Object> | undefined;  
  public allCategoryQuestions : any; 

  public currentQuizSet : Array<any>  = []; 

  public color:ThemePalette


  /*
  * Hier Variablen für Styling
  */
  arrivedLastQuestion = false; 
  quizFinished = false; 

  public showResultScreen = false; 

  constructor(public state: StateService, public templates: QuestiontemplatesService, public currQuiz : CurrentQuizService, private router: Router) { 
    this.category = state.getCategory();
    this.questionTemplates = templates.getAllTemplates(); 
    // localStorage.setItem("allQuestionTemplates", JSON.stringify(this.questionTemplates))
    console.log(this.category)
    this.currQuiz.setCurrentQuiz(this.category)
    this.currQuiz.setCurrentQuestion(0);
    
    this.currentQuizSet = this.currQuiz.getCurrentQuiz(); 

    console.log(this.currentQuizSet)
  }

  ngOnInit(): void {
    // switch(this.category) {
    //   case 1:
    //     this.color = 'warn';
    //     break;
    //   case 2:
    //     this.color = 'warn';
    //     break;
    //   case 3:
    //     this.color = 'primary';
    //     break;
    //   case 4:
    //     this.color = 'accent';
    //     break;
    // }
  }

  ngOnDestroy(): void {
    document.body.setAttribute("style", "background-color: transparent");
  }


  onNextButtonPressed(): void{

    this.currQuiz.setCurrentQuestion(this.currentQuestionNum)

    this.currentQuestionNum +=1; 
    if(this.currentQuestionNum == this.currentQuizSet.length){
      this.arrivedLastQuestion = true; 
    }
  }

  onFinishQuizPressed(): void{
    // this.router.navigate(["/results"])
    this.quizFinished = true; 
    let history = [];
    let currentHistory = localStorage.getItem("quizHistory")

        //store currentQuiz in the quiz history of the right category
    switch(this.category){
      case 1: 
        if(localStorage.getItem("quizHistory_Demografie")){
          history = JSON.parse(localStorage.getItem("quizHistory_Demografie")!)
          history.push(this.currentQuizSet)
          console.log(history)
          localStorage.setItem("quizHistory_Demografie", JSON.stringify(history))
        }else{
          history.push(this.currentQuizSet)
          localStorage.setItem("quizHistory_Demografie", JSON.stringify(history))
        }
        break;
      case 2: 
        if(localStorage.getItem("quizHistory_Kultur")){
          history = JSON.parse(localStorage.getItem("quizHistory_Kultur")!)
          history.push(this.currentQuizSet)
          console.log(history)
          localStorage.setItem("quizHistory_Kultur", JSON.stringify(history))
        }else{
          history.push(this.currentQuizSet)
          localStorage.setItem("quizHistory_Kultur", JSON.stringify(history))
        }
        break;
      case 3: 
        if(localStorage.getItem("quizHistory_Geografie")){
          history = JSON.parse(localStorage.getItem("quizHistory_Geografie")!)
          history.push(this.currentQuizSet)
          console.log(history)
          localStorage.setItem("quizHistory_Geografie", JSON.stringify(history))
        }else{
          history.push(this.currentQuizSet)
          localStorage.setItem("quizHistory_Geografie", JSON.stringify(history))
        }
        break;
      case 4: 
        if(localStorage.getItem("quizHistory_Geschichte")){
          history = JSON.parse(localStorage.getItem("quizHistory_Geschichte")!)
          history.push(this.currentQuizSet)
          console.log(history)
          localStorage.setItem("quizHistory_Geschichte", JSON.stringify(history))
        }else{
          history.push(this.currentQuizSet)
          localStorage.setItem("quizHistory_Geschichte", JSON.stringify(history))
        }
        break;

    
    }

    // if(currentHistory){
    //   history = JSON.parse(currentHistory)
    //   history.push(this.currentQuizSet)
    //   console.log(history)
    //   localStorage.setItem("quizHistory", JSON.stringify(history))
    // } else{
    //   history.push(this.currentQuizSet)
    //   localStorage.setItem("quizHistory", JSON.stringify(history))
    // }

    document.getElementById("finishButton")?.setAttribute("disabled", "true")
    this.showResultScreen = true; 
  }

  getCategoryName() {
    let header = document.getElementById("header"); 
    let footer = document.getElementById("footer"); 
    switch(this.category) {
      case 1:
        // header?.setAttribute("style", "background-color: rgba(91, 12, 38, 0.2)");
        // footer?.setAttribute("style", "background-color: rgba(91, 12, 38, 0.2)");
        document.body.setAttribute("style", "background-color: rgba(91, 12, 38, 0.2)");
        return "Demografie";
      case 2:
        document.body.setAttribute("style", "background-color: rgba(254, 181, 70, 0.2)");
          return "Kultur";
      case 3:
        document.body.setAttribute("style", "background-color: rgba(123, 197, 126, 0.2)");
        return "Geographie";  
      case 4:
        document.body.setAttribute("style", "background-color: rgba(34, 150, 243, 0.2)");

        return "Geschichte";
      default:   
        return "select category!";
    }
  }

  onValidateButtonPressed():void{
    let question = this.currQuiz.getCurrentQuestion();
    
    switch(question.questionType){
      case 1:
        this.singleChoice?.validateButtonPressed();
        return;
        //hier Funktion für Questiontyp 1 - Single Choice, die aufgerufen werden soll zum validieren
      case 2: 
        this.mapSelection?.validateAnswer();
        return;
      case 3:
        //hier Funktion für Questiontyp 3 - Drag & Drop, die aufgerufen werden soll zum validieren
      case 4:
        //hier Funktion für Questiontyp 4 - Cloze, die aufgerufen werden soll zum validieren
        this.cloze?.validateButtonPressed(); 
        return;
      case 5:
        //hier Funktion für Questiontyp 5 - Multiple Choice, die aufgerufen werden soll zum validieren
      case 6: 
        this.sortOrder?.validateButtonPressed();
        return; 
        //hier Funktion für Questiontyp 6 - Sort & Order, die aufgerufen werden soll zum validieren
      case 7:
        //hier Funktion für Questiontyp 7 - Short Answer, die aufgerufen werden soll zum validieren
      default:
        return;
    }
  }

  getProgress() {
    return ((this.currentQuestionNum - 1) / this.currentQuizSet?.length) * 100
  }

}
