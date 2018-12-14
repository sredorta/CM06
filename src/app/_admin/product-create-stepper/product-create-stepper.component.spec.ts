import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreateStepperComponent } from './product-create-stepper.component';

describe('ProductCreateStepperComponent', () => {
  let component: ProductCreateStepperComponent;
  let fixture: ComponentFixture<ProductCreateStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCreateStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCreateStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
