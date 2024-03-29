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
    this.weightedCategoryQuestions = [];
    this.currentQuestions = []; 
    let allCategoryQuestions = this.catQuestions.getCategoryQuestions(categoryId)
     
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

    // console.log(this.weightedCategoryQuestions)

    let totalQuestionsCount = 0;
    let singleChoiceQuestion_unweighted = allCategoryQuestions.filter((question:any) => question.questionType === 1);
    let mapQuestions_unweighted = allCategoryQuestions.filter((question:any)=> question.questionType === 2)
    // this.currentQuestions = this.getRandom(allCategoryQuestions, 4);
    let singleChoiceQuestions = this.weightedCategoryQuestions.filter((question:any) => question.questionType === 1)
    let mapQuestions = this.weightedCategoryQuestions.filter((question:any)=> question.questionType === 2)
    let otherQuestions = this.weightedCategoryQuestions.filter((question:any) => question.questionType !== 1 && question.questionType !== 2);
    let clozeQuestions = this.weightedCategoryQuestions.filter((question:any) => question.questionType === 4)
    let MultipleResponseQ = this.weightedCategoryQuestions.filter((question:any) => question.questionType === 5)
    let sortOrderQ = this.weightedCategoryQuestions.filter((question:any) => question.questionType === 6)
    let shortAnswerQ = this.weightedCategoryQuestions.filter((question:any) => question.questionType === 6)

    // console.log(otherQuestions)
    // console.log(totalQuestionsCount)
    // if(categoryId ==2 ){
    //   this.currentQuestions = this.catQuestions.getCategoryQuestions(2);
    // }else{
      if(singleChoiceQuestion_unweighted.length >= 2){
        totalQuestionsCount += 2; 
        this.currentQuestions.push(...this.getRandom(singleChoiceQuestions, 2))
      }else{
        totalQuestionsCount += singleChoiceQuestion_unweighted.length;
        this.currentQuestions.push(...this.getRandom(singleChoiceQuestions, singleChoiceQuestion_unweighted.length))
      }

      if(mapQuestions_unweighted.length >= 2){
        totalQuestionsCount += 2;
        this.currentQuestions.push(...this.getRandom(mapQuestions, 2))
      }else{ 
        totalQuestionsCount += mapQuestions_unweighted.length;
        this.currentQuestions.push(...this.getRandom(mapQuestions, mapQuestions_unweighted.length))
      }
      this.currentQuestions.push(...this.getRandom(otherQuestions, (8 - totalQuestionsCount)))
      // this.currentQuestions.push(...this.getRandom(singleChoiceQuestions, 2))
      // this.currentQuestions.push(...this.getRandom(mapQuestions, 2))
      // this.currentQuestions.push(...this.getRandom(otherQuestions, 4))
      this.currentQuestions = this.shuffleArray(this.currentQuestions)
    // }

    // this.currentQuestions.push(this.getRandom(clozeQuestions, 1))
    // this.currentQuestions.push(this.getRandom(MultipleResponseQ, 1))
    // this.currentQuestions.push(this.getRandom(sortOrderQ, 1))
    // this.currentQuestions.push(this.getRandom(shortAnswerQ, 1))
    

    // this.currentQuestions = this.getRandom(this.weightedCategoryQuestions, 2);
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
        let counter = 0; 
        do{
          // console.log(x)
          counter++; 
          x = Math.floor(Math.random() * len);
        } while(result.filter((element:any) => element.questionId == arr[x].questionId).length > 0 && counter < 15)



        // if(){
        // }
        // if(this.weightedCategoryQuestions[x].questionType == 2){
        //   if(result.filter((element:any) => element.questionType == 3).length >= 2){
        //     do{
        //       x = Math.floor(Math.random() * len); 
        //     } while(this.weightedCategoryQuestions[x].questionType == 2)
        //   }
        // }
        // if(this.weightedCategoryQuestions[x].questionType == 6){
        //   if(result.filter((element:any) => element.questionType == 6).length >= 2){
        //     do{
        //       x = Math.floor(Math.random() * len); 
        //     } while(this.weightedCategoryQuestions[x].questionType == 6)
        //   }
        // }
        // if(this.weightedCategoryQuestions[x].questionType == 1){
        //   if(result.filter((element:any) => element.questionType == 1).length >= 2){
        //     do{
        //       x = Math.floor(Math.random() * len); 
        //     } while(this.weightedCategoryQuestions[x].questionType == 1)
        //   }
        // }

        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  shuffleArray(array:any) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
}
