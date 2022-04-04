import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { IonInput, ToastController } from '@ionic/angular';
import { findAddressComponent, findAddressNumber, findCity, findState, findStateShortName, findStreet, findZipCode } from 'src/utils/address-utils';

declare var google;

@Component({
  selector: 'app-sign-up-technician',
  templateUrl: './sign-up-technician.page.html',
  styleUrls: ['./sign-up-technician.page.scss'],
})
export class SignUpTechnicianPage implements OnInit {

  @ViewChild('autocomplete') autocomplete: IonInput; 

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  /**
   * Building the form and setting the field with validators
   */
  registrationForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    address: this.formBuilder.group({
      street: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      province: ['', [Validators.required]],
      postal: ['', [Validators.required, Validators.pattern(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i)]]
    }),
    insurance: this.formBuilder.group({
      insuranceCompany: ['', [Validators.required, Validators.maxLength(100)]],
      insuranceNumber: ['', [Validators.required, Validators.maxLength(100)]]
    }),
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  /**
   * A function that is called when the user selects google autocomplete
   * it will set all the address fields in the form
   * @param place 
   */
   setAddress(place) {
    const addressForm = this.registrationForm.get('address');

    addressForm.get('street').setValue(findAddressNumber(place.address_components) + " " + findStreet(place.address_components));
    addressForm.get('city').setValue(findCity(place.address_components));
    addressForm.get('province').setValue(findState(place.address_components));
    addressForm.get('postal').setValue(findZipCode(place.address_components));
  }

 /**
   * A function that will return created form
   * @returns the form created
   */
  getForm(): FormGroup {
    return this.registrationForm;
  }

  /**
   * A function that will implement google's autocomplete on the street field
   * in the form
   */
  ionViewDidEnter() {
    var options = {
      componentRestrictions: {country: "ca"}
     };
    this.autocomplete.getInputElement().then((ref: any) => {
      const autocomplete = new google.maps.places.Autocomplete(ref, options);
      
      autocomplete.addListener('place_changed', () => {
        this.setAddress(autocomplete.getPlace());
      })
    })
  }

  /**
   * Submit button function
   */
   submit(){
    this.authService.technichianRegistration(this.registrationForm.value);
  }

  ngOnInit() {
  }
}