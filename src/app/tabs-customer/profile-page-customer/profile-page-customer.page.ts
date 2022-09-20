import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Component({
  selector: 'app-profile-page-customer',
  templateUrl: './profile-page-customer.page.html',
  styleUrls: ['./profile-page-customer.page.scss'],
})
export class ProfilePageCustomerPage implements OnInit {

  customerInfo = null;
  //temp = document.getElementById("editPh");
  constructor(
    private currentUser: CurrentUserService 
  ) {  }

  ngOnInit() {
    this.currentUser.getCurrentUserDetails().then(data =>{
    console.log(data);
    this.customerInfo = data;
    
  })}
 
}
