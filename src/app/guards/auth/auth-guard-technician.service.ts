import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardTechnician implements CanActivate {

  constructor(
    private currentUserService: CurrentUserService,
    private auth: Auth,
    private router: Router
  ) { }
  currentUser;

  /**
   * This function checks if the currently logged in user is a technician
   * @returns boolean of current user type
   */
  async canActivate(): Promise<boolean> {

    await this.currentUserService.getCurrentUserType().then(x => {
      this.currentUser = x;
    }).catch(x => {
      this.currentUser = x;
    });

    if (this.currentUser === "technician") {
      return true;
    } else {
      this.router.navigateByUrl("/sign-in", { replaceUrl: true });
      return false;
    }
  }
}
