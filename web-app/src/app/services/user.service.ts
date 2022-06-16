import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  //checken, ob Nutzer eingeloggt ist  
  isLoggedIn() : boolean {
    console.log("ist hier rein")
    //hier noch die richtige Logik einbauen
    return true; 
  }
}
