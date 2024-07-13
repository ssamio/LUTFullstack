import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../../login/login.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgbCollapseModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {
  public isCollapsed = true;
}
