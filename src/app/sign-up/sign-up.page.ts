import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  
  registrationForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    address: this.formBuilder.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      postal: ['', [Validators.required, Validators.pattern(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i)]]
    }),
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  getForm(): FormGroup {
    return this.registrationForm;
  }
  // signUp = new FormGroup({
  //   name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  //   email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
  //   phone: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  //   password: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  //   confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  // })
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  submit(){
    console.log(this.registrationForm.value);
  }
}
