import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCounterCComponent } from './widget-counter-c.component';

describe('WidgetCounterCComponent', () => {
  let component: WidgetCounterCComponent;
  let fixture: ComponentFixture<WidgetCounterCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCounterCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCounterCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
