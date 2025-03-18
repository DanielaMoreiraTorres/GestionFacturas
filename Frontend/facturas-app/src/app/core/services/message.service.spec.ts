import { TestBed } from '@angular/core/testing';
import { ServicioMensaje } from './message.service';

describe('ServicioMensaje', () => {
  let servicio: ServicioMensaje;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ServicioMensaje);
  });

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });
});
