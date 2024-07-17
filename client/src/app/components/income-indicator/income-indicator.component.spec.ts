import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeIndicatorComponent } from './income-indicator.component';

describe('IncomeIndicatorComponent', () => {
  let component: IncomeIndicatorComponent;
  let fixture: ComponentFixture<IncomeIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncomeIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
