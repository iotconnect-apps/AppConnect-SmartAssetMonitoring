import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCounterHComponent } from './widget-counter-h.component';

describe('WidgetCounterHComponent', () => {
  let component: WidgetCounterHComponent;
  let fixture: ComponentFixture<WidgetCounterHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCounterHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCounterHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
