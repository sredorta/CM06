import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeSureDialogComponent } from './make-sure-dialog.component';

describe('MakeSureDialogComponent', () => {
  let component: MakeSureDialogComponent;
  let fixture: ComponentFixture<MakeSureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeSureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeSureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
