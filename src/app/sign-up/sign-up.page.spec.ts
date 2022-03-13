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
  })

  // The component should be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /********************
   * Name Field Tests
   ********************/

  it('Name field should be invalid when empty', () => {
    expect(form.get('name').valid).toBeFalsy();
  })

  it('Name field should not be longer than 100 characters', () => {
    // passing 101 characters
    form.get('name').setValue('aslkdnaslkdnasldknaskdnasldknsalkdnalskdnalskndalskndalskdnalskdnaskldnaslkdnalksdnalsndalskdnalsdnad');
    expect(form.get('name').valid).toBeFalsy();
  })

  /********************
   * Email Field Tests
   ********************/

  it('Email field should be invalid when empty', () => {
    expect(form.get('email').valid).toBeFalsy();
  })

  it('Email field should be invalid when provided with input not' 
  + 'formatted as email', () =>{
    form.get('email').setValue('aslkdaslkd');
    expect(form.get('email').valid).toBeFalsy();
  })

  /********************
   * Phone Field Tests
   ********************/

  it('Phone field should be invalid when empty', () => {
    expect(form.get('phone').valid).toBeFalsy();
  })

  it('Phone field should be invalid when less or more than 10 numbers are given', () => {
    form.get('phone').setValue('123');
    expect(form.get('phone').valid).toBeFalsy();
    form.get('phone').setValue('11111111111');
    expect(form.get('phone').valid).toBeFalsy();
  })

  /********************
   * Address Fields Tests
   ********************/

  // Street
  // Street field should be invalid when empty
  it('Street field should be invalid when empty', () => {
    expect(form.get('address').get('street').valid).toBeFalsy();
  })
  // City
  // City field should be invalid when empty
  it('City field should be invalid when empty', () => {
    expect(form.get('address').get('city').valid).toBeFalsy();
    })
  // Province
  // Province field should be invalid when empty
  it('Province field should be invalid when empty', () => {
    expect(form.get('address').get('province').valid).toBeFalsy();
  })
  // Postal
  // Postal field should be invalid when empty
  it('Postal field should be invalid when empty', () => {
    expect(form.get('address').get('postal').valid).toBeFalsy();
  })

  /********************
   * Password Field Tests
   ********************/
  // Test: The email field should be invalid when empty
  it('Password field should be invalid when empty', () => {
    expect(form.get('password').valid).toBeFalsy();
  })

});
