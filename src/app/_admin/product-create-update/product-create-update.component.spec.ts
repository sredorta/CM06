import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreateUpdateComponent } from './product-create-update.component';

describe('ProductCreateUpdateComponent', () => {
  let component: ProductCreateUpdateComponent;
  let fixture: ComponentFixture<ProductCreateUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCreateUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
