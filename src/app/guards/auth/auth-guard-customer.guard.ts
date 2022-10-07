import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardCustomerGuard implements CanActivate {
  
  constructor(
    private currentUserService: CurrentUserService,
    private auth: Auth,
    private router: Router
  ) { }
  currentUser;

  async canActivate(): Promise<boolean> {

    await this.currentUserService.getCurrentUserType().then(x => {
      this.currentUser = x;
    }).catch(x => {
      this.currentUser = x;
    });

    if (this.currentUser === "customer") {
      return true;
    } else {
      this.router.navigateByUrl("/sign-in", {replaceUrl: true});
      return false;
    }
  }
  
}
