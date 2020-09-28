import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypesComponent } from './asset-types.component';

describe('AssetTypesComponent', () => {
  let component: AssetTypesComponent;
  let fixture: ComponentFixture<AssetTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
