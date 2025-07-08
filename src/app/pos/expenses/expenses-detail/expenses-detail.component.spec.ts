import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesDetailComponent } from './expenses-detail.component';

describe('ExpensesDetailComponent', () => {
  let component: ExpensesDetailComponent;
  let fixture: ComponentFixture<ExpensesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
