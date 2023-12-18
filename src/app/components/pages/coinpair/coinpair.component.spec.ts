import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinpairComponent } from './coinpair.component';

describe('CoinpairComponent', () => {
  let component: CoinpairComponent;
  let fixture: ComponentFixture<CoinpairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinpairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinpairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
