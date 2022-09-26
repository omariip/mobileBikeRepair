import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-page-customer',
  templateUrl: './settings-page-customer.page.html',
  styleUrls: ['./settings-page-customer.page.scss'],
})
export class SettingsPageCustomerPage implements OnInit {

  constructor(
    private auth: Auth,
    private router: Router,) { }

  ngOnInit() {
  }

  /**
   * Signs out the customer
   */
   signOut() {
    this.auth.signOut();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

}
