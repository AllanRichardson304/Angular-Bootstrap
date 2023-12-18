import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxgridComponent } from './fxgrid.component';

describe('FxgridComponent', () => {
  let component: FxgridComponent;
  let fixture: ComponentFixture<FxgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
