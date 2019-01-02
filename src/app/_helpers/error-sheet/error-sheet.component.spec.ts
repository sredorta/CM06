import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSheetComponent } from './error-sheet.component';

describe('ErrorSheetComponent', () => {
  let component: ErrorSheetComponent;
  let fixture: ComponentFixture<ErrorSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
