import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPersonalDataComponent } from './order-personal-data.component';

describe('OrderPersonalDataComponent', () => {
  let component: OrderPersonalDataComponent;
  let fixture: ComponentFixture<OrderPersonalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPersonalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
