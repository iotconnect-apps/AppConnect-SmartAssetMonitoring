import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCounterDComponent } from './widget-counter-d.component';

describe('WidgetCounterDComponent', () => {
  let component: WidgetCounterDComponent;
  let fixture: ComponentFixture<WidgetCounterDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCounterDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCounterDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
