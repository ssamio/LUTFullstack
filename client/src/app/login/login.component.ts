import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (res) => {
            localStorage.setItem('access_token', res.token); //Store token;
            this.router.navigate(['/dashboard']); //Navigate to dashboard
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 400) {
              this.errorMessage = 'Invalid username or password.';
            } else if (err.status === 403) {
              this.errorMessage =
                'You do not have permission to access this resource.';
            } else {
              this.errorMessage =
                'An unexpected error occurred. Please try again later.';
            }
          },
        });
    }
  }
}
