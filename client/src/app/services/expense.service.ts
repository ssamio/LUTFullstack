import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Expense {
  title: string;
  text: string;
  sum: number;
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
}
