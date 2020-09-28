import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCounterGComponent } from './widget-counter-g.component';

describe('WidgetCounterGComponent', () => {
  let component: WidgetCounterGComponent;
  let fixture: ComponentFixture<WidgetCounterGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCounterGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCounterGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
