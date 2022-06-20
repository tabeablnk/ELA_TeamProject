import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { Category } from '../../models/state-enum.model'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private state: StateService) {
  }

  ngOnInit(): void {
  }

  onCardClicked(event:any):void{
    let selectedCard = event.currentTarget.id;
    switch (selectedCard) {
      case "1":
        this.state.setCategory(Category.Demografie)
        break;
      case "2":
        this.state.setCategory(Category.Kultur)
        break;
      case "3":
        this.state.setCategory(Category.Geographie)
        break;
      case "4":
        this.state.setCategory(Category.Geschichte)
        break;
    }
    this.router.navigate(["/category/" + selectedCard])
  
  }




}
