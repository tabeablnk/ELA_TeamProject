import { Component, OnInit } from '@angular/core';
import {Chart, ChartType, registerables} from 'chart.js';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';
Chart.register(...registerables)

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit {
  public radarChartType: ChartType = "radar";
  public pieChartType: ChartType = "pie";

  currentQuiz : any;

  percentageRight: any = 0;
  averageAnswerTime: any = 0;
  averageTries: any = 0; 

  quizLength : any; 

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

  generalTypeData: any = []; 
  dataCorrectAnswerRadar: any = [];
  dataTimePerQuestion: any = [];
  dataTriesPerQuestion: any = [];

  constructor(private quizService: CurrentQuizService) {
    this.currentQuiz = this.quizService.getCurrentQuiz();
    console.log(this.currentQuiz)
    this.quizLength = this.currentQuiz.length; 
   }

  ngOnInit(): void {
    
    
    this.initRadarData(); 

    this.calculateAnswerPercentage(); 
    this.calculateTime(); 
    this.calculateTries(); 
    // this.setRadarCharts()
    // this.setPieChart(); 
  }

  calculateAnswerPercentage() {
    let rightCounter = this.currentQuiz.filter((element:any) => element.answeredCorrect === true).length;
    this.percentageRight = Math.round(rightCounter / this.quizLength * 100); 

    this.setPieChart();
  }

  calculateTime(){
    let generalTime = this.currentQuiz.reduce((sum:any, object:any) => {
      return sum + object.timeNeeded; 
    }, 0)
    this.averageAnswerTime = (generalTime / this.quizLength).toFixed(2);

  }
  
  calculateTries(){
    let sumTries = this.currentQuiz.reduce((sum:any, object:any) => {
      return sum + object.givenAnswers.length; 
    }, 0)
    this.averageTries = (sumTries / this.quizLength).toFixed(2)


  }


  initRadarData():void{
    this.currentQuiz.forEach((currentQuestion:any) => {
      let currentType = this.questionTypes.find((e:any) => e.type === currentQuestion.questionType)

      currentType!.amount += 1; 
      currentType!.timeCounter += currentQuestion.timeNeeded;
      currentType!.triesCounter += currentQuestion.givenAnswers.length;
      
      if(currentQuestion.answeredCorrect){
        currentType!.correctCounter +=1;
      }
    })

    //cut out category types which are not represented in the quiz
    this.questionTypes = this.questionTypes.filter(function(e) { return e.amount != 0})

    this.setRadarChart(); 
    
  }

  setRadarChart():void{
    let allLabels: any = [];
    //for the radarCharts the labels at the agenda
    this.questionTypes.forEach((category:any) => {
      allLabels.push(category.name)
      this.dataCorrectAnswerRadar.push(category.correctCounter);
      this.dataTimePerQuestion.push(category.timeCounter);
      this.dataTriesPerQuestion.push(category.triesCounter);
    })

    console.log(this.dataTimePerQuestion);


    //set the data for the radar charts

    /**
     * radar chart for the correct answers
     */
    let radar_answerCorrect = {
      labels: allLabels,
      datasets:[{
        label: 'Correct Answers',
        data: this.dataCorrectAnswerRadar,
        fill: true,
        backgroundColor: 'rgb(240, 170, 67, 0.4)',
        borderColor: 'rgb(240, 170, 67)',
        pointBackgroundColor: 'rgb(240, 170, 67)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(240, 170, 67)'
      }]
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
     * radar chart for the time
     */    
    let radar_timePerQuestion = {
      labels: allLabels,
      datasets:[{
        label: 'Correct Answers',
        data: this.dataTimePerQuestion,
        fill: true,
        backgroundColor: 'rgb(240, 170, 67, 0.4)',
        borderColor: 'rgb(240, 170, 67)',
        pointBackgroundColor: 'rgb(240, 170, 67)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(240, 170, 67)'
      }]
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
     * radar chart for tries
     */
     let radar_triesPerQuestion = {
      labels: allLabels,
      datasets:[{
        label: 'Correct Answers',
        data: this.dataTriesPerQuestion,
        fill: true,
        backgroundColor: 'rgb(240, 170, 67, 0.4)',
        borderColor: 'rgb(240, 170, 67)',
        pointBackgroundColor: 'rgb(240, 170, 67)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(240, 170, 67)'
      }]
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

  setPieChart():void {
    const data = {
      labels:[
        'Richtig',
        'Falsch'
      ],
      datasets:[
        {
          label: 'Anteil korrekter Antworten',
          data: [this.percentageRight, (100 - this.percentageRight)],
          backgroudColor: [
            'rgb(255,99,132)',
            'rgb(54, 162, 235)'
          ]
        }
      ]
    }

    const config = {
      type: this.pieChartType,
      data: data
    }

    let pieChart = document.getElementById('correctAnswerPieChart') as any; 
    new Chart(pieChart, config);

  }
  
  data = {
    labels: [
      'Short Answer',
      'Multiple-Choice',
      'Single-Choice',
      'Reihenfolge',
      'Drag & Drop',
      'Lückentext',
      'Karten'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 100, 81, 56, 55, 40],
      fill: true,
      backgroundColor: 'rgb(240, 170, 67, 0.4)',
      borderColor: 'rgb(240, 170, 67)',
      pointBackgroundColor: 'rgb(240, 170, 67)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(240, 170, 67)'
    }]
  };

  setRadarCharts():void { 
    const config = {
      type: this.radarChartType,
      data: this.data,
      options: {
        elements: {
          legend: { display: false },
          line: {
            borderWidth: 3
          }
        }
      },
    };
    const config2 = {
      type: this.radarChartType,
      data: this.data,
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        }
      },
    };
    const config3 = {
      type: this.radarChartType,
      data: this.data,
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        }
      },
    };
    let test = document.getElementById('myChart') as any; 
    new Chart(test, config);

    let test2 = document.getElementById('myChart2') as any; 
    new Chart(test2, config2);

    let test3 = document.getElementById('myChart3') as any;
    new Chart(test3, config3); 
  }

}
