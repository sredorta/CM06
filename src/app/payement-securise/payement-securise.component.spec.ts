import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementSecuriseComponent } from './payement-securise.component';

describe('PayementSecuriseComponent', () => {
  let component: PayementSecuriseComponent;
  let fixture: ComponentFixture<PayementSecuriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayementSecuriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayementSecuriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
