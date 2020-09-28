import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAlertBComponent } from './widget-alert-b.component';

describe('WidgetAlertBComponent', () => {
  let component: WidgetAlertBComponent;
  let fixture: ComponentFixture<WidgetAlertBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAlertBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAlertBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
