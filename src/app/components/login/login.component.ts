import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm : FormGroup
  constructor(private _apiService: ApiServiceService , private _router: Router) {
    // Initialization logic can go here if needed
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { usernameOrEmail, password } = this.loginForm.value;
      this._apiService.setUserSiginIn(usernameOrEmail, password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          swal.fire({
                    title: 'Success',
                    text: 'User signed in successfully!',
                    icon: 'success',
                    showConfirmButton:false
                  });
          // Handle successful login logic here
          this._router.navigateByUrl('/home').finally(() => {
  const my = setInterval(() => {
    location.reload();
    clearInterval(my); // ✅ دي الصح
  }, 250);
});

        },
        error: (error) => {
          console.error('Login failed:', error);
          swal.fire({
                    title: 'Error',
                    text: 'There was an error Sign in the user. Please try again.'+ error.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                  });
          // Handle login failure logic here
        }
      });
    } else {
      console.error('Login form is invalid');
    }
  }

  get usernameOrEmail() {
    return this.loginForm.get('usernameOrEmail');
  }
  get password() {
    return this.loginForm.get('password');
  }


}
