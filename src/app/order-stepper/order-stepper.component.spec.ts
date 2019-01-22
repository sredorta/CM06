import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStepperComponent } from './order-stepper.component';

describe('OrderStepperComponent', () => {
  let component: OrderStepperComponent;
  let fixture: ComponentFixture<OrderStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
