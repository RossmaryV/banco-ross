import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajerosListComponent } from './cajeros-list.component';

describe('CajerosListComponent', () => {
  let component: CajerosListComponent;
  let fixture: ComponentFixture<CajerosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajerosListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CajerosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
