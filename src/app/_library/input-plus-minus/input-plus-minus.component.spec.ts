import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPlusMinusComponent } from './input-plus-minus.component';

describe('InputPlusMinusComponent', () => {
  let component: InputPlusMinusComponent;
  let fixture: ComponentFixture<InputPlusMinusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputPlusMinusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPlusMinusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
