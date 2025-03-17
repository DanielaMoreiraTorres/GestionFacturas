import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
//import { AuthService } from 'src/app/account/services/auth.service';
//import { LanguageService } from 'src/app/core/services/language.service';
import { SimplebarAngularModule } from 'simplebar-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SimplebarAngularModule,
    BsDropdownModule
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})

export class TopbarComponent implements OnInit, OnDestroy {
  mode: any;
  element: any;
  cookieValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;
  theme: any;
  layout: string ="";
  //dataLayout$: Observable<string>;
  userNameCompleto = /*this.auth.currentUser()?.userName*/ "USERNAME";
  photo = 'assets/images/user.jpg';
  logoMain = 'assets/images/user.jpg';
  logoSmall = 'assets/images/user.jpg';
  isFullScreen: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    //private auth: AuthService,
    //public languageService: LanguageService,
    public translate: TranslateService,
    public _cookiesService: CookieService,
  ) { }

  //openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    window.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('fullscreenchange', () => {
      this.isFullScreen = !!document.fullscreenElement;
    });

    //this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get('lang');
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('fullscreenchange', () => {
      this.isFullScreen = !!document.fullscreenElement;
    });
  }

  handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'F11') {
      event.preventDefault();
      this.fullscreen();
    }
  };

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    //this.languageService.setLanguage(lang);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    /*this.auth.logout();
    this.router.navigate(['/auth/login']);*/
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  settingCompany() {
    this.router.navigate(['/settings/company']);
  }

  changeLayout(layoutMode: string) {

  }
}
