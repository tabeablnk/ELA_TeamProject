import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements OnInit {
  answers = []

  constructor() { }

  ngOnInit(): void {
  }


  questiondata = {
    "questionId": 0,
    "questionType": 1,
    "category": 0,
    "questionText": "",
    "imageUrl": "",
    "tip":"",
    "answeredCorrect":false,
    "givenAnswers":["answer1","answer2"],
    
    "additonalInfos":{
        "options": ["", ""],
        "correctAnswer": [
            {
                "name": "",
                "value": ""
            },
            {
                "name": "",
                "value": ""
            }
        ]
    }
}

 

  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker',
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }


}
