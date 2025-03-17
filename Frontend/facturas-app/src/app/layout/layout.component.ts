import { Component, inject, OnInit } from '@angular/core';
import { TopbarComponent } from './topbar/topbar.component';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
//import { SidebarComponent } from "./sidebar/sidebar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TopbarComponent,
    RouterOutlet,
    //SidebarComponent
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  private router = inject(Router);

  constructor() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        //document.body.classList.remove('sidebar-enable');
      }
    });
  }

  ngOnInit(): void {

    document.body.setAttribute('data-layout', 'vertical');

    document.body.setAttribute('data-sidebar', 'dark');
    document.body.removeAttribute('data-topbar');
    document.body.removeAttribute('data-layout-size');
    document.body.removeAttribute('data-keep-enlarged');
    document.body.removeAttribute('data-sidebar-size');
    document.body.classList.remove('sidebar-enable');
    document.body.classList.remove('vertical-collpsed');
    document.body.removeAttribute('data-layout-scrollable');

    document.body.setAttribute('data-layout-size', 'fluid');
    document.body.classList.remove('vertical-collpsed');
    document.body.removeAttribute('data-layout-scrollable');
  }

  onSettingsButtonClicked(){}

  onToggleMobileMenu(){
    document.body.classList.toggle('sidebar-enable');
    document.body.classList.toggle('vertical-collpsed');

    if (window.screen.width <= 768) {
      document.body.classList.remove('vertical-collpsed');
    }
  }

}
