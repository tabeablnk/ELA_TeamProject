import { Injectable } from '@angular/core';
import questionsCategory_1 from '../../assets/questions/1.json';
import questionsCategory_2 from '../../assets/questions/2.json';
import questionsCategory_3 from '../../assets/questions/3.json';
import questionsCategory_4 from '../../assets/questions/4.json';

@Injectable({
  providedIn: 'root'
})
export class CategoryQuestionsService {

  constructor() { }

  getCategoryQuestions(categoryId: Number){
    switch(categoryId){
      case 1:
        return questionsCategory_1
      case 2:
        return questionsCategory_2
      case 3: 
        return questionsCategory_3
      case 4: 
        return questionsCategory_4
      default: 
        return "You have to set a category!";
    }
  }


}
