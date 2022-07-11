import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from './models/state-enum.model';
import { CategoryQuestionsService } from './services/category-questions.service';
import { LoginGuardService } from './services/login-guard.service';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'web-app';

  loggedIn:any; 

  constructor(private loginGuard: LoginGuardService, private router: Router, private state: StateService, private categoryQuestions: CategoryQuestionsService){
    this.loggedIn = loginGuard.canActivate(); 
  }

  ngOnInit(): void {
    //diese Methode wird am Anfang aufgerufen, am besten du sendest hier schon mal die SPARQUL Anfrage mit fetch
    //über den categoryQuestinoService kannst du dann Fragen zu den verschiedenen QuestionsSets hinzufügen, wie hier zum Beispiel eine Single-Choice Frage für die Kategorie Demografie z.B.

    //create new Question
    // let new_question = {
    //     questionId: 0,
    //     questionType: 1,
    //     questionTypeName: "SingleChoice",
    //     category: 1,
    //     questionText: "Wo liegt die Alte Mainbrücke?",
    //     imageUrl: "",
    //     tip: "Hier ein Tipp",
    //     answeredCorrect: false,
    //     givenAnswers: ["answer1", "answer2"],
    
    //     additionalInfos: {
    //       options: ["München", "Würzburg", "Nürnberg", "Erlangen", "Hof"],
    //       correctAnswer: "Würzburg"
    //     }
    // }
    // this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);

    let url = window.location.href;
    if(url.includes("category")) {
      let currentCategory: Number = +url.charAt(url.length - 1);
      switch (currentCategory) {
        case 1:  
          this.state.setCategory(Category.Demografie);
          break;
        case 2:
          this.state.setCategory(Category.Kultur);
          break;
        case 3:
          this.state.setCategory(Category.Geographie);
          break;
        case 4:
          this.state.setCategory(Category.Geschichte);
          break;          
      }
     
    }
    
  }

  // openDashboard() {

  // }

  // openHome() {
  //   this.router.navigate(['/home']);
  // }
}
