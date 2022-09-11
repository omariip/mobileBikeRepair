import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Component({
  selector: 'app-profile-page-customer',
  templateUrl: './profile-page-customer.page.html',
  styleUrls: ['./profile-page-customer.page.scss'],
})
export class ProfilePageCustomerPage implements OnInit {


  constructor(
    private currentUser: CurrentUserService
  ) { }

  ngOnInit() {
  }

  getCustomerData(){
    console.log(this.currentUser.getCurrentUserDetails());
  }
}
