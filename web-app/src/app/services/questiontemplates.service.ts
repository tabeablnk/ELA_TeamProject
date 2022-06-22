import { Injectable } from '@angular/core';
import templates from '../models/question-structure.json';

@Injectable({
  providedIn: 'root'
})
export class QuestiontemplatesService {

  // private allTemplates : Array<Object> = [];  

  constructor() {

   }

  // setAllTemplates() {
  //   this.allTemplates = templates;
  // }


  getAllTemplates() {
    return templates; 
  }


}
