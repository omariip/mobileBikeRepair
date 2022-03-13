import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignUpPage } from './sign-up.page';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SignUpPage', () => {
  let component: SignUpPage;
  let fixture: ComponentFixture<SignUpPage>;

  let registrationPageForm: SignUpPage;
  let form: FormGroup;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpPage],
      imports: [IonicModule.forRoot(), FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    registrationPageForm = new SignUpPage(new FormBuilder());
    form = registrationPageForm.getForm();
  });

  // The component should be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /********************
   * Name Field Tests
   ********************/

  it('Name field should be invalid when empty', () => {
    expect(form.get('name').valid).toBeFalsy();
  });

  it('Name field should not be longer than 100 characters', () => {
    // passing 101 characters to setValue function
    form.get('name').setValue('aslkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('name').valid).toBeFalsy();

    // passing 100 characters to setValue function
    form.get('name').setValue('alkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('name').valid).toBeTruthy();

    // passing 99 characters to setValue function
    form.get('name').setValue('akdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('name').valid).toBeTruthy();
  });

  /********************
   * Email Field Tests
   ********************/

  it('Email field should be invalid when empty', () => {
    expect(form.get('email').valid).toBeFalsy();
  });

  it('Email field should be invalid when provided with input not in email format', () => {
      form.get('email').setValue('aslkdaslkd');
      expect(form.get('email').valid).toBeFalsy();
      form.get('email').setValue('aslkdaslkd@saduad');
      expect(form.get('email').valid).toBeFalsy();
    });

  it('Email field should not be longer than 100 characters', () => {
    // passing 101 characters to setValue function
    form.get('email').setValue('aslkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('email').valid).toBeFalsy();
  });

  /********************
   * Phone Field Tests
   ********************/

  it('Phone field should be invalid when empty', () => {
    expect(form.get('phone').valid).toBeFalsy();
  });

  it('Phone field should be invalid when less or more than 10 numbers are given', () => {
    // setting value of phone to number less that 10 digits
    form.get('phone').setValue('123');
    expect(form.get('phone').valid).toBeFalsy();
    // setting value of phone to number more than 10 digits
    form.get('phone').setValue('11111111111');
    expect(form.get('phone').valid).toBeFalsy();
  });

  it('Phone field should be invalid when in wrong format (not 1111111111)', () => {
    // setting value of phone to number with format (111) 111 1111
    form.get('phone').setValue('(111) 111 1111');
    expect(form.get('phone').valid).toBeFalsy();

    // setting value of phone to string with character
    form.get('phone').setValue('a11111111');
    expect(form.get('phone').valid).toBeFalsy();

    // setting value of phone to string with special character
    form.get('phone').setValue('+1111111111');
    expect(form.get('phone').valid).toBeFalsy();
  });


  /********************
   * Address Fields Tests
   ********************/

  // Street

  it('Street field should be invalid when empty', () => {
    expect(form.get('address').get('street').valid).toBeFalsy();
  });

  it('Street field should not be longer than 100 characters', () => {
    // passing 101 characters to setValue function
    form.get('address').get('street').setValue('aslkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('address').get('street').valid).toBeFalsy();

    // passing 100 characters to setValue function
    form.get('address').get('street').setValue('slkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('address').get('street').valid).toBeTruthy();

    // passing 99 characters to setValue function
    form.get('address').get('street').setValue('lkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('address').get('street').valid).toBeTruthy();
  });

  // City

  it('City field should be invalid when empty', () => {
    expect(form.get('address').get('city').valid).toBeFalsy();
  });

  it('City field should not be longer than 100 characters', () => {
    // passing 101 characters to setValue function
    form.get('address').get('city').setValue('aslkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('address').get('city').valid).toBeFalsy();

    // passing 100 characters to setValue function
    form.get('address').get('city').setValue('slkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('address').get('city').valid).toBeTruthy();

    // passing 99 characters to setValue function
    form.get('address').get('city').setValue('lkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('address').get('city').valid).toBeTruthy();
  });

  // Province

  it('Province field should be invalid when empty', () => {
    expect(form.get('address').get('province').valid).toBeFalsy();
  });

  // Postal

  it('Postal field should be invalid when empty', () => {
    expect(form.get('address').get('postal').valid).toBeFalsy();
  });

  it('Postal field should be invalid when passed a string not formatted as a postal code', () =>{
    form.get('address').get('postal').setValue('2f4 4ff');
    expect(form.get('address').get('postal').valid).toBeFalsy();

    form.get('address').get('postal').setValue('alskda');
    expect(form.get('address').get('postal').valid).toBeFalsy();

    form.get('address').get('postal').setValue('l5a 333');
    expect(form.get('address').get('postal').valid).toBeFalsy();

    form.get('address').get('postal').setValue('l5a k33');
    expect(form.get('address').get('postal').valid).toBeFalsy();

    form.get('address').get('postal').setValue('ll3 3k4');
    expect(form.get('address').get('postal').valid).toBeFalsy();
  });

  /********************
   * Password Field Tests
   ********************/

  it('Password field should be invalid when empty', () => {
    expect(form.get('password').valid).toBeFalsy();
  })

  it('Password field should be invalid when less than 8 characters', () => {
    // setting value of password to a string of 7
    form.get('password').setValue('aaaaaaa')
    expect(form.get('password').valid).toBeFalsy();

    // setting value of password to a string of 9
    form.get('password').setValue('aaaaaaaa')
    expect(form.get('password').valid).toBeTruthy();
  })


});
