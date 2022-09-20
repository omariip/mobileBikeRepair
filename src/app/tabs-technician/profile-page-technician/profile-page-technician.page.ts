import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Component({
  selector: 'app-profile-page-technician',
  templateUrl: './profile-page-technician.page.html',
  styleUrls: ['./profile-page-technician.page.scss'],
})
export class ProfilePageTechnicianPage implements OnInit {

  technicianInfo = null;
  //temp = document.getElementById("editPh");
  constructor(
    private currentUser: CurrentUserService
    ) { 
      
    }

  ngOnInit() {
    this.currentUser.getCurrentUserDetails().then(data =>{

      this.technicianInfo = data;
  })}

  editPhoneNumber() {
    //this.temp.hidden=false;
  }
  }
