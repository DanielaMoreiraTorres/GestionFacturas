import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PageButton } from './pagebutton.model';

@Component({
  selector: 'app-page-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-buttons.component.html',
  styleUrl: './page-buttons.component.scss'
})
export class PageButtonsComponent {

  @Input() title: string;
  @Input() items: PageButton[] = [];

  constructor() { }

  ngOnInit(): void {
    if (!this.items) this.items = [];
    this.items.forEach((it: any) => {
      it.visible = it.visible === undefined ? true : it.visible
    });
  }

  clickButton() { }
}
