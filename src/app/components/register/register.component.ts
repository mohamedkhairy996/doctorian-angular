import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Iregister } from '../../models/iregister';
import { ApiServiceService } from '../../services/api-service.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUser } from '../../models/iuser';

@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
registerForm : FormGroup
user : Iregister = {} as Iregister;
admin : IUser|null = null;
role:string="Patient"
constructor(private _apiService:ApiServiceService ,private _store:Store<any>, private _router:Router) {
  this.registerForm = new FormGroup({
    email:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    username:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    password:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]),
    dob:new FormControl('',[Validators.required]),
    name:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    phone:new FormControl('',[Validators.required,Validators.pattern("[0][1][0-9]{9}$")]),
    address:new FormControl('',[Validators.required,Validators.minLength(5),Validators.maxLength(100)]),
    role:new FormControl('Patient',[Validators.required]),
    specialization:new FormControl('',),
  });
}
  ngOnInit(): void {
    this._store.select('userId').subscribe({
      next: (data) => {
          this.admin = data;
  },
  error: (error) => {
          console.error('Error fetching user ', error);
      }
  });

  this.registerForm.get('role')?.valueChanges.subscribe(value => {
  this.role = value;
});

}




onSubmit() {
  if (this.registerForm.valid) {
    this.user = this.registerForm.value as Iregister;
    this._apiService.setUser(this.user).subscribe({
      next: () => {
        swal.fire({
          title: 'Success',
          text: 'User registered successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // this.registerForm.reset();
        this._apiService.setUserSiginIn(this.user.email,this.user.password).subscribe({
          next: () => {
            console.log('User signed in successfully');
          },
          error: (error) => {
            console.error('Error signing in user:', error);
          }
        });
        // Navigate to the login page after successful registration
        this._router.navigate(['/login']);
      },
      error: (error) => {
        swal.fire({
          title: 'Error',
          text: 'There was an error registering the user. Please try again.'+ error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
    // Here you can add the logic to send the form data to your server
  } else {
    console.log('Form is invalid');
  }
}

get email()
{
return this.registerForm.get('email');
}
get username()
{
return this.registerForm.get('username');
}
get password()
{
return this.registerForm.get('password');
}
get dob()
{
return this.registerForm.get('dob');
}
get name()
{
return this.registerForm.get('name');
}
get phone()
{
return this.registerForm.get('phone');
}
get address()
{
return this.registerForm.get('address');
}


}
