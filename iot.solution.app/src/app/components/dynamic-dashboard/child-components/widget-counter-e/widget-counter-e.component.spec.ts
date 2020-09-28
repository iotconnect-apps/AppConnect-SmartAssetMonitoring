import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCounterEComponent } from './widget-counter-e.component';

describe('WidgetCounterEComponent', () => {
  let component: WidgetCounterEComponent;
  let fixture: ComponentFixture<WidgetCounterEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCounterEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCounterEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
