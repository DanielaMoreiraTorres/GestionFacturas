import { TestBed } from '@angular/core/testing';
import { ServicioDeCookiesSeguras  } from './secure-cookie.service';

describe('ServicioDeCookiesSeguras ', () => {
  let servicio: ServicioDeCookiesSeguras ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ServicioDeCookiesSeguras );
  });

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });
});
