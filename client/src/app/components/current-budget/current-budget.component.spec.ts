import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBudgetComponent } from './current-budget.component';

describe('CurrentBudgetComponent', () => {
  let component: CurrentBudgetComponent;
  let fixture: ComponentFixture<CurrentBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentBudgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
