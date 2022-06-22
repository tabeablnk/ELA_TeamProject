import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  //checken, ob Nutzer eingeloggt ist  
  isLoggedIn() : boolean {
    //hier noch die richtige Logik einbauen
    return true; 
  }
}
