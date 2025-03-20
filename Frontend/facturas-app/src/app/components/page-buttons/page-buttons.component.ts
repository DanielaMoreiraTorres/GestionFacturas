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

  @Input() titulo: string;
  @Input() elementos: PageButton[] = [];

  constructor() { }

  ngOnInit(): void {
    if (!this.elementos) this.elementos = [];
    this.elementos.forEach((it: any) => {
      it.visible = it.visible === undefined ? true : it.visible
    });
  }

  clickButton() { }
}
