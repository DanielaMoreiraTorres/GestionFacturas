import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageButtonsComponent } from './page-buttons.component';

describe('PageButtonsComponent', () => {
  let component: PageButtonsComponent;
  let fixture: ComponentFixture<PageButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageButtonsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
