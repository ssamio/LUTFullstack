import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService, Expense } from '../services/expense.service';
import { ExpenseFormComponent } from '../components/expense-form/expense-form.component';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  standalone: true,
  imports: [CommonModule, ExpenseFormComponent],
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  errorMessage: string | null = null;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    // Implent a method to load all expense and budget related data and pass them to sub-component
    console.log('Load works!');
  }

  onExpensePosted(): void {
    this.load();
  }
}
