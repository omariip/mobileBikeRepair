import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivate, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private currentUserService: CurrentUserService,
    private auth: Auth) { }
  currentUser;

  async canActivate() : Promise<boolean> {
    
    // await this.currentUserService.getCurrentUserType().then(x=>{
    //    this.currentUser = x;
    // });
    //return this.currentUser === "technician";

    return true;
  }
}
