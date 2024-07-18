import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService, Expense } from '../services/expense.service';
import { ExpenseFormComponent } from '../components/expense-form/expense-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ExpenseFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  budget: number = 0;
  totalExpenses: number = 0;
  errorMessage: string | null = null;
  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.errorMessage = null;
    this.loadExpenses();
    this.loadBudget();
  }

  loadExpenses(): void {
    this.expenseService.getMonthlyExpenses().subscribe({
      next: (data) => {
        this.totalExpenses = data.reduce(
          (sum, expense) => sum + expense.sum,
          0,
        );
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.errorMessage = 'No expenses.';
        } else {
          this.errorMessage = 'Failed to load expenses.';
        }
      },
    });
  }

  loadBudget(): void {
    this.expenseService.getUserBudget().subscribe({
      next: (data) => {
        this.budget = data.budget;
      },
      error: () => {
        this.errorMessage = 'Failed to load budget.';
      },
    });
  }

  onExpensePosted(): void {
    this.load();
  }
}
