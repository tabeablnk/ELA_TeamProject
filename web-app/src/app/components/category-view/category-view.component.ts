import { Component, OnInit } from '@angular/core';
import { QuestiontemplatesService } from 'src/app/services/questiontemplates.service';
import { StateService } from 'src/app/services/state.service';
import { Category } from '../../models/state-enum.model'

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

public category: Category;
public questionTemplates : Array<Object> | undefined;  

  constructor(public state: StateService, public templates: QuestiontemplatesService) { 
    this.category = state.getCategory();
    this.questionTemplates = templates.getAllTemplates(); 
    console.log(this.questionTemplates)
  }

  ngOnInit(): void {

  }

  getCategoryName() {
    let header = document.getElementById("header"); 
    let footer = document.getElementById("footer"); 
    switch(this.category) {
      case Category.Demografie:
        header?.setAttribute("style", "background-color: rgba(91, 12, 38, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(91, 12, 38, 0.2)");
        return "Demografie";
      case Category.Geographie:
        header?.setAttribute("style", "background-color: rgba(123, 197, 126, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(123, 197, 126, 0.2)");
        return "Geographie";
      case Category.Geschichte:
        header?.setAttribute("style", "background-color: rgba(34, 150, 243, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(34, 150, 243, 0.2)");
        return "Geschichte";
      case Category.Kultur:
        header?.setAttribute("style", "background-color: rgba(254, 181, 70, 0.2)");
        footer?.setAttribute("style", "background-color: rgba(254, 181, 70, 0.2)");
        console.log(footer)
        return "Kultur";
    }
  }

}
