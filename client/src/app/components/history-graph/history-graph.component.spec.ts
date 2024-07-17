import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryGraphComponent } from './history-graph.component';

describe('HistoryGraphComponent', () => {
  let component: HistoryGraphComponent;
  let fixture: ComponentFixture<HistoryGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
