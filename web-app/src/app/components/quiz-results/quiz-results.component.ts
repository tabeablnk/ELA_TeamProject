import { Component, OnInit } from '@angular/core';
import {Chart, ChartType, registerables} from 'chart.js'
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

  questionTypes = [
    {
      name: "SingleChoice",
      type: 1,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "MapQuestion",
      type: 2,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "DragDrop",
      type: 3,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "Cloze",
      type: 4,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "MultipleChoice",
      type: 5,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "SortOrder",
      type: 6,
      correctCounter: 0, 
      timeCounter: 0,
      triesCounter: 0
    },
    {
      name: "ShortAnswer",
      type: 7,
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
   }

  ngOnInit(): void {
    
    // this.setRadarData(); 

    this.calculateAnswerPercentage(); 
    this.setRadarCharts()
    // this.setPieChart(); 
  }

  calculateAnswerPercentage() {
    let quizLength = this.currentQuiz.length
    let rightCounter = this.currentQuiz.filter((element:any) => element.answeredCorrect === true).length;
    console.log(rightCounter)
    this.percentageRight = Math.round(rightCounter / quizLength * 100); 

    this.setPieChart();
  }

  // setRadarData():void{

  //   this.questionTypes.forEach((question:any, index) => {

  //     let questionTypeCounter = this.currentQuiz.filter((element:any) => element.questionType === question.type);
  //     let rightCounter = questionTypeCounter.filter((element:any) => element.answeredCorrect === true).length; 
  //     let percentage = Math.round(rightCounter/questionTypeCounter.length * 100);
  //     if(isNaN(percentage)){
  //       this.questionTypes.splice(index, 1)
  //     }else{
  //       question.correctCounter = percentage;
  //     }
  //   })
  //   console.log(this.questionTypes)
  // }

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
