import { TestBed } from '@angular/core/testing';
import { ServicioAutenticacion } from './auth.service';

describe('ServicioAutenticacion', () => {
  let servicio: ServicioAutenticacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ServicioAutenticacion);
  });

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });
});
