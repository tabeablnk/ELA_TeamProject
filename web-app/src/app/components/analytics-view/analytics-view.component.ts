import { Component, OnInit } from '@angular/core';
import {Chart, ChartType, registerables} from 'chart.js';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';
Chart.register(...registerables)

@Component({
  selector: 'app-analytics-view',
  templateUrl: './analytics-view.component.html',
  styleUrls: ['./analytics-view.component.scss']
})
export class AnalyticsViewComponent implements OnInit {

  public radarChartType: ChartType = "radar";
  public lineChartType: ChartType = "line";


  /**
   * the following variables are used in the radar chart
   */
  questionsDemografie = JSON.parse(localStorage.getItem("questionSet_Demografie")!);
  questionsGeographie = JSON.parse(localStorage.getItem("questionSet_Geographie")!);
  questionsKultur = JSON.parse(localStorage.getItem("questionSet_Kultur")!);
  questionsGeschichte = JSON.parse(localStorage.getItem("questionSet_Geschichte")!);

  questionTypes = [
    {
      name: "SingleChoice",
      type: 1,
      amount: 0,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "MapQuestion",
      type: 2,
      amount: 0,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "DragDrop",
      type: 3,
      amount: 0,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "Cloze",
      type: 4,
      amount: 0,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "MultipleChoice",
      type: 5,
      amount: 0,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "SortOrder",
      type: 6,
      amount: 0,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "ShortAnswer",
      type: 7,
      amount: 0,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    }
  ]


  resultsDemografie = JSON.parse(JSON.stringify(this.questionTypes));
  resultsGeopgrahie = JSON.parse(JSON.stringify(this.questionTypes));
  resultsKultur = JSON.parse(JSON.stringify(this.questionTypes));
  resultsGeschichte = JSON.parse(JSON.stringify(this.questionTypes));


  quizHistory_Demografie = JSON.parse(localStorage.getItem("quizHistory_Demografie")!);
  quizHistory_Kultur = JSON.parse(localStorage.getItem("quizHistory_Kultur")!);
  quizHistory_Geografie = JSON.parse(localStorage.getItem("quizHistory_Geografie")!);
  quizHistory_Geschichte = JSON.parse(localStorage.getItem("quizHistory_Geschichte")!);

  constructor() { }

  ngOnInit(): void {
    this.initRadarData(); 
    this.initLineChart();
  }


  initRadarData():void{
    console.log(this.resultsKultur) 
    

    /**
     * set Dataset for the Kultur-Questions
     */
    this.questionsKultur.forEach((currentQuestion:any) => {
      let currentType = this.resultsKultur.find((e:any) => e.type === currentQuestion.questionType)

      currentType!.amount += 1; 
      currentType!.timeCounter += currentQuestion.timeSummedUp;
      currentType!.triesCounter += currentQuestion.triesSummedUp;
      
      if(currentQuestion.answeredCorrect){
        currentType!.correctCounter +=1;
      }
    })

    //cut out category types which are not represented in the quiz
    // this.resultsKultur = this.resultsKultur.filter(function(e:any) { return e.amount != 0})


    /**
     * set Dataset for the Geographie-Questions
     */
     this.questionsGeographie.forEach((currentQuestion:any) => {
      let currentType = this.resultsGeopgrahie.find((e:any) => e.type === currentQuestion.questionType)

      currentType!.amount += 1; 
      currentType!.timeCounter += currentQuestion.timeSummedUp;
      currentType!.triesCounter += currentQuestion.triesSummedUp;
      
      if(currentQuestion.answeredCorrect){
        currentType!.correctCounter +=1;
      }
    })

    /**
     * set Dataset for the Demografie-Questions
     */
     this.questionsDemografie.forEach((currentQuestion:any) => {
      let currentType = this.resultsDemografie.find((e:any) => e.type === currentQuestion.questionType)

      currentType!.amount += 1; 
      currentType!.timeCounter += currentQuestion.timeSummedUp;
      currentType!.triesCounter += currentQuestion.triesSummedUp;
      
      if(currentQuestion.answeredCorrect){
        currentType!.correctCounter +=1;
      }
    })

    /**
     * set Dataset for the Geschichte-Questions
     */
     this.questionsGeschichte.forEach((currentQuestion:any) => {
      let currentType = this.resultsGeschichte.find((e:any) => e.type === currentQuestion.questionType)

      currentType!.amount += 1; 
      currentType!.timeCounter += currentQuestion.timeSummedUp;
      currentType!.triesCounter += currentQuestion.triesSummedUp;
      
      if(currentQuestion.answeredCorrect){
        currentType!.correctCounter +=1;
      }
    })


    this.setRadarChart(); 
    
  }

  /**
   *********************
   *********************
   *********************
   *********************
   *********************
   * FOR THE RADAR CHARTS - START 
   *********************
   *********************
   *********************
   *********************
   */
  setRadarChart(): void{
    console.log(this.resultsKultur)
    console.log(this.resultsDemografie)
    console.log(this.resultsGeopgrahie)
    console.log(this.resultsGeschichte)

    let allLabels = this.questionTypes.map((x:any) => x.name); 
    console.log(allLabels)

    let correctAnswer_Kultur = this.resultsKultur.map((x:any) => x.correctCounter); 
    console.log(correctAnswer_Kultur)
    let correctAnswer_Demografie = this.resultsDemografie.map((x:any) => x.correctCounter); 
    let correctAnswer_Geographie = this.resultsGeopgrahie.map((x:any) => x.correctCounter); 
    let correctAnswer_Geschichte = this.resultsGeschichte.map((x:any) => x.correctCounter); 

    /**
     * radar chart for the correct answers
     */
    let radar_answerCorrect = {
      labels: allLabels,
      datasets:[
        {
          label: 'Kultur',
          data: correctAnswer_Kultur,
          fill: true,
          backgroundColor: 'rgb(255, 181, 71, 0.4)',
          borderColor: 'rgb(255, 181, 71)',
          pointBackgroundColor: 'rgb(255, 181, 71)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 181, 71)'
        },{
          label: 'Demografie',
          data: correctAnswer_Demografie,
          fill: true,
          backgroundColor: 'rgb(233, 30, 99, 0.4)',
          borderColor: 'rgb(233, 30, 99)',
          pointBackgroundColor: 'rgb(233, 30, 99)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(233, 30, 99)'
        },
        {
          label: 'Geographie',
          data: correctAnswer_Geographie,
          fill: true,
          backgroundColor: 'rgb(76, 175, 80, 0.4)',
          borderColor: 'rgb(76, 175, 80)',
          pointBackgroundColor: 'rgb(76, 175, 80)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(76, 175, 80)'
        },
        {
          label: 'Geschichte',
          data: correctAnswer_Geschichte,
          fill: true,
          backgroundColor: 'rgb(33, 150, 243, 0.4)',
          borderColor: 'rgb(33, 150, 243)',
          pointBackgroundColor: 'rgb(33, 150, 243)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(33, 150, 243)'
        },
      ]
    }

    const config_correctAnswers = {
      type: this.radarChartType,
      data: radar_answerCorrect,
      options: {
        elements: {
          legend: { display: false },
          line: {
            borderWidth: 3
          }
        }
      },
    };

    let finalChart_correctAnswer = document.getElementById('myChart') as any; 
    new Chart(finalChart_correctAnswer, config_correctAnswers);





    /**
     * radar chart for time per question
     */
    let timePerQuestion_Kultur = this.resultsKultur.map((x:any) => x.timeCounter); 
    let timePerQuestion_Demografie = this.resultsDemografie.map((x:any) => x.timeCounter); 
    let timePerQuestion_Geographie = this.resultsGeopgrahie.map((x:any) => x.timeCounter); 
    let timePerQuestion_Geschichte = this.resultsGeschichte.map((x:any) => x.timeCounter); 

    let radar_timePerQuestion = {
      labels: allLabels,
      datasets:[
        {
          label: 'Kultur',
          data: timePerQuestion_Kultur,
          fill: true,
          backgroundColor: 'rgb(240, 170, 67, 0.4)',
          borderColor: 'rgb(240, 170, 67)',
          pointBackgroundColor: 'rgb(240, 170, 67)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(240, 170, 67)'
        },
        {
          label: 'Demografie',
          data: timePerQuestion_Demografie,
          fill: true,
          backgroundColor: 'rgb(233, 30, 99, 0.4)',
          borderColor: 'rgb(233, 30, 99)',
          pointBackgroundColor: 'rgb(233, 30, 99)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(233, 30, 99)'
        },
        {
          label: 'Geopgraphie',
          data: timePerQuestion_Geographie,
          fill: true,
          backgroundColor: 'rgb(76, 175, 80, 0.4)',
          borderColor: 'rgb(76, 175, 80)',
          pointBackgroundColor: 'rgb(76, 175, 80)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(76, 175, 80)'
        },
        {
          label: 'Geschichte',
          data: timePerQuestion_Geschichte,
          fill: true,
          backgroundColor: 'rgb(33, 150, 243, 0.4)',
          borderColor: 'rgb(33, 150, 243)',
          pointBackgroundColor: 'rgb(33, 150, 243)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(33, 150, 243)'
        }
      ]
    }

    const config_timePerQuestion = {
      type: this.radarChartType,
      data: radar_timePerQuestion,
      options: {
        elements: {
          legend: { display: false },
          line: {
            borderWidth: 3
          }
        }
      },
    };

    let finalChart_timePerQuestion = document.getElementById('myChart2') as any; 
    new Chart(finalChart_timePerQuestion, config_timePerQuestion);




    /**
     * radar charts for the tries
     */
    let triesPerQuestion_Kultur = this.resultsKultur.map((x:any) => x.triesCounter); 
    let triesPerQuestion_Demografie = this.resultsDemografie.map((x:any) => x.triesCounter); 
    let triesPerQuestion_Geographie = this.resultsGeopgrahie.map((x:any) => x.triesCounter); 
    let triesPerQuestion_Geschichte = this.resultsGeschichte.map((x:any) => x.triesCounter); 

    let radar_triesPerQuestion = {
      labels: allLabels,
      datasets:[
        {
          label: 'Kultur',
          data: triesPerQuestion_Kultur,
          fill: true,
          backgroundColor: 'rgb(240, 170, 67, 0.4)',
          borderColor: 'rgb(240, 170, 67)',
          pointBackgroundColor: 'rgb(240, 170, 67)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(240, 170, 67)'
        },
        {
          label: 'Demographie',
          data: triesPerQuestion_Demografie,
          fill: true,
          backgroundColor: 'rgb(233, 30, 99, 0.4)',
          borderColor: 'rgb(233, 30, 99)',
          pointBackgroundColor: 'rgb(233, 30, 99)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(233, 30, 99)'
        },
        {
          label: 'Geographie',
          data: triesPerQuestion_Geographie,
          fill: true,
          backgroundColor: 'rgb(76, 175, 80, 0.4)',
          borderColor: 'rgb(76, 175, 80)',
          pointBackgroundColor: 'rgb(76, 175, 80)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(76, 175, 80)'
        },
        {
          label: 'Geschichte',
          data: triesPerQuestion_Geschichte,
          fill: true,
          backgroundColor: 'rgb(33, 150, 243, 0.4)',
          borderColor: 'rgb(33, 150, 243)',
          pointBackgroundColor: 'rgb(33, 150, 243)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(33, 150, 243)'
        }
      ]
    }

    const config_triesPerQuestion = {
      type: this.radarChartType,
      data: radar_triesPerQuestion,
      options: {
        elements: {
          legend: { display: false },
          line: {
            borderWidth: 3
          }
        }
      },
    };

    let finalChart_triesPerQuestion = document.getElementById('myChart3') as any; 
    new Chart(finalChart_triesPerQuestion, config_triesPerQuestion);
  }

  /**
   *********************
   *********************
   *********************
   *********************
   *********************
   * FOR THE RADAR CHARTS - END  
   *********************
   *********************
   *********************
   *********************
   */


  /**
   *********************
   *********************
   *********************
   *********************
   *********************
   * FOR THE LINE CHART - START 
   *********************
   *********************
   *********************
   *********************
   */
  initLineChart():void{
    console.log(this.quizHistory_Demografie)
  }

  setLineChart():void{

  }


}
