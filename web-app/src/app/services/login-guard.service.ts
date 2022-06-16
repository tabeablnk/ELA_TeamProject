import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private userService : UserService, private router: Router) { }

  canActivate() : boolean {
    console.log("ist hieeeeer")
    if(!this.userService.isLoggedIn()){
      this.router.navigate(['login']);
      return false;
    }
    return true
  }
}
