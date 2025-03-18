import { Component, inject, OnInit } from '@angular/core';
import { TopbarComponent } from './topbar/topbar.component';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TopbarComponent,
    RouterOutlet,
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  private router = inject(Router);

  constructor() {
  }

  ngOnInit(): void {
  }

}
