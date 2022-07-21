import { Injectable } from '@angular/core';
import { CategoryQuestionsService } from './category-questions.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentQuizService {

  private currentQuestions : Array<any> = []; 
  private currentQuestion : any = {};
  weightedCategoryQuestions: any = []; 

  constructor(public catQuestions: CategoryQuestionsService) { }

  setCurrentQuiz(categoryId : any){
    let allCategoryQuestions = this.catQuestions.getCategoryQuestions(categoryId)
    //eventuell hier noch fragen, die noch nicht beantwortet wurden priorisieren
    console.log(allCategoryQuestions)
    allCategoryQuestions.forEach((question:any) => {
      if(question.alreadyAnsweredCount === 0){
        let counter = 4; 
        for(let i = 1; i<=counter; i++){
          this.weightedCategoryQuestions.push(question)
        }
      } 
      if(question.alreadyAnsweredCount !== 0 && !question.answeredCorrect){
        let counter = 3; 
        for(let i = 1; i<=counter; i++){
          this.weightedCategoryQuestions.push(question)
        }
      }
      if(question.answeredCorrect){
        this.weightedCategoryQuestions.push(question)
      }
    })

    console.log(this.weightedCategoryQuestions)

    // this.currentQuestions = this.getRandom(allCategoryQuestions, 4);
    this.currentQuestions = this.getRandom(this.weightedCategoryQuestions, 8);
    // if(this.findDuplicates(this.currentQuestions) !== []){
    //   this.currentQuestions = this.getRandom(weightedCategoryQuestions, 4);
    // }
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
    localStorage.setItem("currentQuizSet", JSON.stringify(this.currentQuestions))
  }

  findDuplicates (data:any){
    const output:any = [];
    Object.values(data.reduce((res:any, obj:any) => {
      let key = obj.questionId;
      res[key] = [...(res[key] || []), {...obj}]
      return res;
    }, {})).forEach((arr:any) => {
      if(arr.length > 1) {
        output.push(...arr);
      }
    });
    return output;
  }

  //pics random elements from an array
  getRandom(arr:any, n:any) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    // console.log(result)
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        do{
          x = Math.floor(Math.random() * len);
        } while(result.filter((element:any) => element.questionId == this.weightedCategoryQuestions[x].questionId).length !== 0)
        // if(){
        // }
        if(this.weightedCategoryQuestions[x].questionType == 1){
          if(result.filter((element:any) => element.questionType == 1).length >= 2){
            do{
              x = Math.floor(Math.random() * len); 
            } while(this.weightedCategoryQuestions[x].questionType == 1)
          }
        }
        if(this.weightedCategoryQuestions[x].questionType == 2){
          if(result.filter((element:any) => element.questionType == 2).length >= 2){
            do{
              x = Math.floor(Math.random() * len); 
            } while(this.weightedCategoryQuestions[x].questionType == 2)
          }
        }
        if(this.weightedCategoryQuestions[x].questionType == 6){
          if(result.filter((element:any) => element.questionType == 6).length >= 2){
            do{
              x = Math.floor(Math.random() * len); 
            } while(this.weightedCategoryQuestions[x].questionType == 6)
          }
        }

        console.log(result)
        console.log(taken)
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

}
