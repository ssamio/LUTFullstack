import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpenseService, Expense } from '../services/expense.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  editForm: FormGroup;
  currentEditingExpense: Expense | null = null;
  errorMessage: string | null = null;

  constructor(
    private expenseService: ExpenseService,
    private fb: FormBuilder,
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      sum: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      createdAt: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load expenses.';
      },
    });
  }

  editExpense(expense: Expense): void {
    this.currentEditingExpense = expense;
    this.editForm.patchValue(expense);
  }

  saveExpense(): void {
    if (this.editForm.valid && this.currentEditingExpense) {
      const updatedExpense: Expense = {
        ...this.currentEditingExpense,
        ...this.editForm.value,
      };
      this.expenseService.updateExpense(updatedExpense).subscribe({
        next: (updated) => {
          this.loadExpenses();
          this.currentEditingExpense = null;
        },
        error: () => {
          this.errorMessage = 'Failed to update expense.';
        },
      });
    }
  }

  deleteExpense(expense: Expense): void {
    this.expenseService.deleteExpense(expense).subscribe({
      next: (response) => {
        this.loadExpenses();
      },
      error: () => {
        this.errorMessage = 'Failed to delete expense.';
      },
    });
  }

  cancelEdit(): void {
    this.currentEditingExpense = null;
    this.editForm.reset();
  }
}
