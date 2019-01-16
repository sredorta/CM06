import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsGeneralesVenteComponent } from './conditions-generales-vente.component';

describe('ConditionsGeneralesVenteComponent', () => {
  let component: ConditionsGeneralesVenteComponent;
  let fixture: ComponentFixture<ConditionsGeneralesVenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionsGeneralesVenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsGeneralesVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
