import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from './models/state-enum.model';
import { CategoryQuestionsService } from './services/category-questions.service';
import { LoginGuardService } from './services/login-guard.service';
import { SpaqrqlServiceService } from './services/spaqrql-service.service';
import { StateService } from './services/state.service';
import questionsCategory_1 from '../assets/questions/1.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'web-app';

  loggedIn: any;

  constructor(private loginGuard: LoginGuardService, private router: Router, private state: StateService, private categoryQuestions: CategoryQuestionsService, private sparql: SpaqrqlServiceService) {
    this.loggedIn = loginGuard.canActivate();
  }

  ngOnInit(): void {
    //console.log(JSON.parse(localStorage.getItem("questionSet_Demografie")!).length);
    if(!localStorage.getItem("sparqlTriggered")){
      this.sparql.initGeneratedQuestions();
      localStorage.setItem("sparqlTriggered", "true");
      console.log("sparql is triggered");
    }else{
      if(JSON.parse(localStorage.getItem("questionSet_Demografie")!).length <= questionsCategory_1.length){
        this.sparql.initGeneratedQuestions();
        console.log("Triggerd SPARQL again, till we got no AIG questions yet.")
      }else{
        console.log("AIG-Questions are alredy available. No need to fetch again.")
      }
    }

    let url = window.location.href;
    if (url.includes("category")) {
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
