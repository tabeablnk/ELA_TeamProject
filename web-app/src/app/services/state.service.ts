import { Injectable } from '@angular/core';
import { Category } from '../models/state-enum.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private category: Category = Category.Demografie;

  constructor() { }

  setCategory(category: Category) {
    this.category = category;
  }

  getCategory() {
    return this.category;
  }
}

