import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { Category } from '../../models/state-enum.model'

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

public category: Category;

  constructor(public state: StateService) { 
    this.category = state.getCategory();
  }

  ngOnInit(): void {
  }

  getCategoryName() {
    switch(this.category) {
      case Category.Demografie:
        return "Demografie";
      case Category.Geographie:
        return "Geographie";
      case Category.Geschichte:
        return "Geschichte";
      case Category.Kultur:
        return "Kultur";
    }
  }

}
