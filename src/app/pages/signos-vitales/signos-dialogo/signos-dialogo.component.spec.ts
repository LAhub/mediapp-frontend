import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignosDialogoComponent } from './signos-dialogo.component';

describe('SignosDialogoComponent', () => {
  let component: SignosDialogoComponent;
  let fixture: ComponentFixture<SignosDialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignosDialogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignosDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
