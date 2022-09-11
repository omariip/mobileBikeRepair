import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/services/current-user.service';
@Component({
  selector: 'app-home-page-customer',
  templateUrl: './home-page-customer.page.html',
  styleUrls: ['./home-page-customer.page.scss'],
})
export class HomePagePage implements OnInit {

  constructor(
    private auth: Auth,
    private router: Router,
    private service: CurrentUserService
    ) { }

  ngOnInit() {
  }

  signOut(){
    this.auth.signOut();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  id(){
    console.log(this.auth.currentUser.uid);
    console.log(this.service.getCurrentUserDetails());
  }
}
