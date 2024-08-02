import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignosEdicionComponent } from './signos-edicion.component';

describe('SignosEdicionComponent', () => {
  let component: SignosEdicionComponent;
  let fixture: ComponentFixture<SignosEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignosEdicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignosEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
