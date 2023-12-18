import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinlockComponent } from './pinlock.component';

describe('PinlockComponent', () => {
  let component: PinlockComponent;
  let fixture: ComponentFixture<PinlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
