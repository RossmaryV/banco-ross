import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajeroFormComponent } from './cajero-form.component';

describe('CajeroFormComponent', () => {
  let component: CajeroFormComponent;
  let fixture: ComponentFixture<CajeroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajeroFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CajeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
