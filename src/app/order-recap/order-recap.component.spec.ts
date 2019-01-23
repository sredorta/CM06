import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRecapComponent } from './order-recap.component';

describe('OrderRecapComponent', () => {
  let component: OrderRecapComponent;
  let fixture: ComponentFixture<OrderRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
