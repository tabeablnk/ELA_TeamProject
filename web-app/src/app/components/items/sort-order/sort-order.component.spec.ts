import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortOrderComponent } from './sort-order.component';

describe('SortOrderComponent', () => {
  let component: SortOrderComponent;
  let fixture: ComponentFixture<SortOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
