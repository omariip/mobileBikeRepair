import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CurrentUserService } from '../services/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class RememberSignInGuard implements CanActivate {

  currentUser;

  constructor(
    private currentUserService: CurrentUserService,
    private auth: Auth,
    private router: Router
  ) {
  }


  async canActivate(): Promise<boolean> {

    await this.currentUserService.getCurrentUserType().then(x => {
      this.currentUser = x;
    }).catch(x => {
      this.currentUser = x;
    });

    if (this.currentUser === "technician") {

      this.router.navigateByUrl('/technician', { replaceUrl: true });
    } else if (this.currentUser === "customer") {

      this.router.navigateByUrl('/customer', { replaceUrl: true });
      return false;
    } else {
      return true;
    }
  }

}
