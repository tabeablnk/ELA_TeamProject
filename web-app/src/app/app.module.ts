import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from './material.module';
import { MultipleChoiceComponent } from './components/items/multiple-choice/multiple-choice.component';
import { CategoryViewComponent } from './components/category-view/category-view.component';
import { SingleChoiceComponent } from './components/items/single-choice/single-choice.component';
import { SortOrderComponent } from './components/items/sort-order/sort-order.component';
import { MapSelectionComponent } from './components/items/map-selection/map-selection.component';
import { ShortAnswerComponent } from './components/items/short-answer/short-answer.component';
import { DragDropComponent } from './components/items/drag-drop/drag-drop.component';
import { ClozeComponent } from './components/items/cloze/cloze.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MultipleChoiceComponent,
    CategoryViewComponent,
    SingleChoiceComponent,
    SortOrderComponent,
    MapSelectionComponent,
    ShortAnswerComponent,
    DragDropComponent,
    ClozeComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LeafletModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
