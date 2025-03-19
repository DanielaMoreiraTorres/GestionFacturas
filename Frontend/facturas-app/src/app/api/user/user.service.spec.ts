import { TestBed } from '@angular/core/testing';
import { UsuarioServicio } from './user.service';

describe('UsuarioServicio', () => {
  let servicio: UsuarioServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(UsuarioServicio);
  });

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });
});
