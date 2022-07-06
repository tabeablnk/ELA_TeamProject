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
    this.questionSet_Demografie = questionsCategory_1;
    this.questionSet_Kultur = questionsCategory_2;
    this.questionSet_Geographie = questionsCategory_3
    this.questionSet_Geschichte = questionsCategory_4;
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
        break;
      case 2:
        this.questionSet_Kultur.push(question);
        break;
      case 3: 
        this.questionSet_Geographie.push(question);
        break;
      case 4: 
        this.questionSet_Geschichte.push(question);
        break 
    }
  }

  updateQuestionSet(category: Category, questionSet: any) {
    switch(category){
      case Category.Demografie:
        this.questionSet_Demografie = questionSet;
        break;
      case 2:
        this.questionSet_Kultur = questionSet
        break;
      case 3: 
        this.questionSet_Geographie = questionSet
        break;
      case 4: 
        this.questionSet_Geschichte = questionSet;
        break 
    }
  }


}
