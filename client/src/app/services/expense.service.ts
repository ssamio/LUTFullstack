import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Expense {
  _id: string;
  title: string;
  text: string;
  sum: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expenseUrl = `${environment.apiUrl}/expense`;
  private userUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  // Post a new expense
  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.expenseUrl, expense);
  }

  // Get expenses for the current month
  getMonthlyExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.expenseUrl}/month`);
  }

  // Get user username and budget
  getUserBudget(): Observable<{ username: string; budget: number }> {
    return this.http.get<{ username: string; budget: number }>(this.userUrl);
  }

  // Get all expenses
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.expenseUrl);
  }

  // Update an expense
  updateExpense(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.expenseUrl}/${expense._id}`, expense);
  }

  // Delete an expense
  deleteExpense(expense: Expense): Observable<void> {
    return this.http.delete<void>(`${this.expenseUrl}/${expense._id}`);
  }
}
