import { TestBed } from '@angular/core/testing';
import { ClienteServicio } from './client.service';

describe('ClienteServicio', () => {
  let servicio: ClienteServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ClienteServicio);
  });

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });
});
