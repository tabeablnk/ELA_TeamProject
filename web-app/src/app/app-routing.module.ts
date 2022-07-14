import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LoginGuardService } from './services/login-guard.service';
import { CategoryViewComponent } from './components/category-view/category-view.component';
import { QuizResultsComponent } from './components/quiz-results/quiz-results.component';
import { AnalyticsViewComponent } from './components/analytics-view/analytics-view.component';

const routes: Routes = [
  { path: '', redirectTo:'/home', pathMatch:'full' },
  { path: 'home', canActivate: [LoginGuardService], component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'category/:id', component: CategoryViewComponent},
  { path: 'results', component: QuizResultsComponent},
  { path: 'analytics', component: AnalyticsViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
