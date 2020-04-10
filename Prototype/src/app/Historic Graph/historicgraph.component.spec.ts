import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricGraphComponent } from './historicgraph.component';

describe('GraphComponent', () => {
  let component: HistoricGraphComponent;
  let fixture: ComponentFixture<HistoricGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
