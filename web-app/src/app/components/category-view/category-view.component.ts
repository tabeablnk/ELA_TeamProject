import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';
import { QuestiontemplatesService } from 'src/app/services/questiontemplates.service';
import { StateService } from 'src/app/services/state.service';
import { Category } from '../../models/state-enum.model';
import { ClozeComponent } from '../items/cloze/cloze.component';
import { MapSelectionComponent } from '../items/map-selection/map-selection.component';
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

  constructor(public state: StateService, public templates: QuestiontemplatesService, public currQuiz : CurrentQuizService, private router: Router) { 
    this.category = state.getCategory();
    this.questionTemplates = templates.getAllTemplates(); 
    localStorage.setItem("allQuestionTemplates", JSON.stringify(this.questionTemplates))
    console.log(this.category)
    this.currQuiz.setCurrentQuiz(this.category)
    this.currQuiz.setCurrentQuestion(0);
    
    this.currentQuizSet = this.currQuiz.getCurrentQuiz(); 

    console.log(this.currentQuizSet)
  }

  ngOnInit(): void {
    switch(this.category) {
      case 1:
        this.color = 'accent';
        break;
      case 2:
        this.color = 'accent';
        break;
      case 3:
        this.color = 'primary';
        break;
      case 4:
        this.color = 'primary';
        break;
    }
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
    this.router.navigate(["/results"])
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
          header?.setAttribute("style", "background-color: rgba(254, 181, 70, 0.2)");
          footer?.setAttribute("style", "background-color: rgba(254, 181, 70, 0.2)");
          return "Kultur";
      case 3:
        header?.setAttribute("style", "background-color: rgba(123, 197, 126, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(123, 197, 126, 0.2)");
        return "Geographie";  
      case 4:
        header?.setAttribute("style", "background-color: rgba(34, 150, 243, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(34, 150, 243, 0.2)");
        return "Geschichte";
      default:   
        return "select category!";
    }
  }

  onValidateButtonPressed():void{
    let question = this.currQuiz.getCurrentQuestion();
    console.log(question)
    
    switch(question.questionType){
      case 1:
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
        this.sortOrder?.checkAnswer();
        return; 
        //hier Funktion für Questiontyp 6 - Sort & Order, die aufgerufen werden soll zum validieren
      case 7:
        //hier Funktion für Questiontyp 7 - Short Answer, die aufgerufen werden soll zum validieren
      default:
        return;
    }
  }

  getProgress() {
    return (this.currentQuestionNum / this.currentQuizSet?.length) * 100
  }

}
