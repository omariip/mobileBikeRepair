import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-page-technician',
  templateUrl: './settings-page-technician.page.html',
  styleUrls: ['./settings-page-technician.page.scss'],
})
export class SettingsPageTechnicianPage implements OnInit {

  constructor(
    private auth: Auth,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  /**
   * Signs out the technician
   */
  signOut() {
    this.auth.signOut();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
