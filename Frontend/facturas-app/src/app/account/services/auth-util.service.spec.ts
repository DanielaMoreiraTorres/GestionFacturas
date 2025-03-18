import { TestBed } from '@angular/core/testing';
import { ServicioUtilidadesAutenticacion  } from './auth-util.service';

describe('ServicioUtilidadesAutenticacion ', () => {
  let servicio: ServicioUtilidadesAutenticacion ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ServicioUtilidadesAutenticacion );
  });

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });
});
