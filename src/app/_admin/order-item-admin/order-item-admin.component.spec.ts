import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemAdminComponent } from './order-item-admin.component';

describe('OrderItemAdminComponent', () => {
  let component: OrderItemAdminComponent;
  let fixture: ComponentFixture<OrderItemAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderItemAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
