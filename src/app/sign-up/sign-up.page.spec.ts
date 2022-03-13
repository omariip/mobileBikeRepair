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
      declarations: [ SignUpPage ],
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

  // Test: The component should be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test: The name field should be invalid when empty
  it('Name field should be invalid when empty', () =>{
    expect(form.get('name').valid).toBeFalsy();
  })

  // Test: 

});
