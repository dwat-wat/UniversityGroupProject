import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonScreenComponent } from './comparison-screen.component';

describe('ComparisonScreenComponent', () => {
  let component: ComparisonScreenComponent;
  let fixture: ComponentFixture<ComparisonScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
