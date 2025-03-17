import { Component, effect, ElementRef, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'facturas-app';
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  public authStatusChangeEffect = effect(() => {
    this.router.navigateByUrl('/auth/login');
    return;
  });

  ngOnInit(): void {
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }
}
