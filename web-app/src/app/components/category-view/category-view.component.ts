import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';
import { QuestiontemplatesService } from 'src/app/services/questiontemplates.service';
import { StateService } from 'src/app/services/state.service';
import { Category } from '../../models/state-enum.model';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

  public currentQuestion : any; 
  public currentQuestionNum : number = 1; 
    
  public category: Category;
  public questionTemplates : Array<Object> | undefined;  
  public allCategoryQuestions : any; 

  public currentQuizSet : Array<any>  = []; 


  /*
  * Hier Variablen für Styling
  */
  arrivedLastQuestion = false; 

  constructor(public state: StateService, public templates: QuestiontemplatesService, public currQuiz : CurrentQuizService, private router: Router) { 
    this.category = state.getCategory();
    this.questionTemplates = templates.getAllTemplates(); 
    localStorage.setItem("allQuestionTemplates", JSON.stringify(this.questionTemplates))
    this.currQuiz.setCurrentQuiz(this.category)
    this.currQuiz.setCurrentQuestion(0);
    
    this.currentQuizSet = this.currQuiz.getCurrentQuiz(); 

    console.log(this.currentQuizSet)
  }

  ngOnInit(): void {
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
        header?.setAttribute("style", "background-color: rgba(91, 12, 38, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(91, 12, 38, 0.2)");
        return "Demografie";
      case 2:
        header?.setAttribute("style", "background-color: rgba(123, 197, 126, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(123, 197, 126, 0.2)");
        return "Geographie";
      case 3:
        header?.setAttribute("style", "background-color: rgba(34, 150, 243, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(34, 150, 243, 0.2)");
        return "Geschichte";
      case 4:
        header?.setAttribute("style", "background-color: rgba(254, 181, 70, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(254, 181, 70, 0.2)");
        return "Kultur";
      default:   
        return "select category!";
    }
  }

}
