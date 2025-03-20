import { TestBed } from '@angular/core/testing';
import { ProductoServicio } from './product.service';

describe('ProductoServicio', () => {
  let servicio: ProductoServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ProductoServicio);
  });

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });
});
