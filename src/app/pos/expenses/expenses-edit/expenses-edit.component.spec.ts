import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesEditComponent } from './expenses-edit.component';

describe('ExpensesEditComponent', () => {
  let component: ExpensesEditComponent;
  let fixture: ComponentFixture<ExpensesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
