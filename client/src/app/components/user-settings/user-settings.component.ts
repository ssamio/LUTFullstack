import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class UserSettingsComponent implements OnInit {
  settingsForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.settingsForm = this.fb.group({
      username: ['', Validators.required],
      budget: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }
  // Load current user details to be displayed in the form
  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.settingsForm.patchValue({
          username: user.username,
          budget: user.budget,
        });
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user data. Please try again later.';
      },
    });
  }
  // Update user username and/or budget
  updateUser(): void {
    if (this.settingsForm.valid) {
      const { username, budget } = this.settingsForm.value;
      this.authService.updateUser(username, budget).subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.errorMessage = null;
        },
        error: (err) => {
          if (
            err.status === 400 &&
            err.error &&
            err.error.error === 'Username is already taken'
          ) {
            this.errorMessage =
              'Username is already taken. Please choose a different one.';
          } else {
            this.errorMessage = 'Failed to update user.';
          }
          this.successMessage = null;
        },
      });
    }
  }
  // Delete user account, with all expense data along with it
  deleteUser(): void {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      this.authService.deleteUser().subscribe({
        next: (res) => {
          alert(res.message);
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete user.';
        },
      });
    }
  }
}
