import { TestBed } from '@angular/core/testing';
import { CatalogoServicio } from './catalog.service';

describe('CatalogoServicio', () => {
  let servicio: CatalogoServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(CatalogoServicio);
  });

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });
});