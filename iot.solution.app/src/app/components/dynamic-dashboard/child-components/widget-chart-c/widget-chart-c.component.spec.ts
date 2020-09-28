import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetChartCComponent } from './widget-chart-c.component';

describe('WidgetChartCComponent', () => {
  let component: WidgetChartCComponent;
  let fixture: ComponentFixture<WidgetChartCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetChartCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetChartCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
