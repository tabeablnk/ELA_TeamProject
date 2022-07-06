import { Injectable } from '@angular/core';
import { CategoryQuestionsService } from './category-questions.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentQuizService {

  private currentQuestions : Array<any> = []; 
  private currentQuestion : any = {};

  constructor(public catQuestions: CategoryQuestionsService) { }

  setCurrentQuiz(categoryId : any){
    let allCategoryQuestions = this.catQuestions.getCategoryQuestions(categoryId)
    //eventuell hier noch fragen, die noch nicht beantwortet wurden priorisieren
    this.currentQuestions = this.getRandom(allCategoryQuestions, 4);
    localStorage.setItem("currentQuizSet", JSON.stringify(this.currentQuestions))
  }

  getCurrentQuiz(){
    return this.currentQuestions;
  }

  setCurrentQuestion(questionNumber:number){
    this.currentQuestion = this.currentQuestions[questionNumber]
  }

  getCurrentQuestion(){
    return this.currentQuestion; 
  }
  
  saveGivenAnswer(question : object){
    console.log(question)
    this.currentQuestion = question
    localStorage.setItem("currentQuizSet", JSON.stringify(this.currentQuestions))
  }


  //pics random elements from an array
  getRandom(arr:any, n:any) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

}
