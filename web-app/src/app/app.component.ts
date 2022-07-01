import { Component } from '@angular/core';
import { LoginGuardService } from './services/login-guard.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web-app';

  loggedIn:any; 

  constructor(private loginGuard: LoginGuardService, ){
    this.loggedIn = loginGuard.canActivate(); 
  }
}
