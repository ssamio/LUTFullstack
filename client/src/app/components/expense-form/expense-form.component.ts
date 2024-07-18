import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ExpenseFormComponent {
  expenseForm: FormGroup;
  errorMessage: string | null = null;
  @Output() expensePosted = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
    private location: Location,
  ) {
    this.expenseForm = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      sum: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const newExpense: Expense = this.expenseForm.value;
      this.expenseService.addExpense(newExpense).subscribe({
        next: () => {
          this.expensePosted.emit(); // Notify the parent component
          this.expenseForm.reset(); // Reset the form
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.errorMessage = 'Invalid content.';
          } else if (err.status === 401) {
            this.errorMessage = 'Session expired, please login again.';
          } else {
            this.errorMessage =
              'An unexpected error occurred. Please try again later.';
          }
        },
      });
    }
  }
}
