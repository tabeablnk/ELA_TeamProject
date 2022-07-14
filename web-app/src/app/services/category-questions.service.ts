import { Injectable } from '@angular/core';
import questionsCategory_1 from '../../assets/questions/1.json';
import questionsCategory_2 from '../../assets/questions/2.json';
import questionsCategory_3 from '../../assets/questions/3.json';
import questionsCategory_4 from '../../assets/questions/4.json';
import { Category } from '../models/state-enum.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryQuestionsService {

  questionSet_Kultur: any;
  questionSet_Demografie: any;
  questionSet_Geographie: any;
  questionSet_Geschichte: any;

  constructor() {

    if(!localStorage.getItem("questionSet_Demografie")){
      console.log("HI")
      this.questionSet_Demografie = questionsCategory_1;
      this.questionSet_Kultur = questionsCategory_2;
      this.questionSet_Geographie = questionsCategory_3
      this.questionSet_Geschichte = questionsCategory_4;

      localStorage.setItem("questionSet_Demografie", JSON.stringify(this.questionSet_Demografie))
      localStorage.setItem("questionSet_Kultur", JSON.stringify(this.questionSet_Kultur))
      localStorage.setItem("questionSet_Geographie", JSON.stringify(this.questionSet_Geographie))
      localStorage.setItem("questionSet_Geschichte", JSON.stringify(this.questionSet_Geschichte))

      // localStorage.setItem("initialQuestionSetsStored", "true")
    } else{
      this.questionSet_Demografie = JSON.parse(localStorage.getItem("questionSet_Demografie")!)
      this.questionSet_Kultur = JSON.parse(localStorage.getItem("questionSet_Kultur")!)
      this.questionSet_Geographie = JSON.parse(localStorage.getItem("questionSet_Geographie")!)
      this.questionSet_Geschichte = JSON.parse(localStorage.getItem("questionSet_Geschichte")!)
    }

    //for the quizHistories => set empty variables in localStorage if there isnt already one
    if(!localStorage.getItem("quizHistory_Demografie")){
      localStorage.setItem("quizHistory_Demografie", JSON.stringify([]))
    }
    if(!localStorage.getItem("quizHistory_Kultur")){
      localStorage.setItem("quizHistory_Kultur", JSON.stringify([]))
    }
    if(!localStorage.getItem("quizHistory_Geographie")){
      localStorage.setItem("quizHistory_Geographie", JSON.stringify([]))
    }
    if(!localStorage.getItem("quizHistory_Geschichte")){
      localStorage.setItem("quizHistory_Geschichte", JSON.stringify([]))
    }
  }

  getCategoryQuestions(categoryId: Number){
    console.log(this.questionSet_Demografie);
    switch(categoryId){
      case 1:
        return this.questionSet_Demografie
      case 2:
        return this.questionSet_Kultur
      case 3: 
        return this.questionSet_Geographie
      case 4: 
        return this.questionSet_Geschichte
      default: 
        return "You have to set a category!";
    }
  }

  addCategoryQuestion(category: Category, question: any) {
    switch(category){
      case Category.Demografie:
        this.questionSet_Demografie.push(question);
        localStorage.setItem("questionSet_Demografie", JSON.stringify(this.questionSet_Demografie))
        break;
      case 2:
        this.questionSet_Kultur.push(question);
        localStorage.setItem("questionSet_Kultur", JSON.stringify(this.questionSet_Kultur))
        break;
      case 3: 
        this.questionSet_Geographie.push(question);
        localStorage.setItem("questionSet_Geographie", JSON.stringify(this.questionSet_Geographie))
        break;
      case 4: 
        this.questionSet_Geschichte.push(question);
        localStorage.setItem("questionSet_Geschichte", JSON.stringify(this.questionSet_Geschichte))
        break 
    }
  }

  updateQuestionSet(category: Category, questionSet: any) {
    switch(category){
      case Category.Demografie:
        this.questionSet_Demografie = questionSet;
        localStorage.setItem("questionSet_Demografie", JSON.stringify(this.questionSet_Demografie))
        break;
      case 2:
        this.questionSet_Kultur = questionSet
        localStorage.setItem("questionSet_Kultur", JSON.stringify(this.questionSet_Kultur))
        break;
      case 3: 
        this.questionSet_Geographie = questionSet
        localStorage.setItem("questionSet_Geographie", JSON.stringify(this.questionSet_Geographie))
        break;
      case 4: 
        this.questionSet_Geschichte = questionSet;
        localStorage.setItem("questionSet_Geschichte", JSON.stringify(this.questionSet_Geschichte))
        break 
    }
  }


}
