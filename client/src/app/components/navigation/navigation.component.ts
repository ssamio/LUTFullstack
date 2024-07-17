import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgbCollapseModule, RouterModule, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {
  public isCollapsed = true;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // User logout
  logout(): void {
    this.authService.logout();
    this.isCollapsed = !this.isCollapsed;
    this.router.navigate(['/login']);
  }
  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
