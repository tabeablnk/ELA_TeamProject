import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleResponseComponent } from './multiple-response.component';

describe('MultipleResponseComponent', () => {
  let component: MultipleResponseComponent;
  let fixture: ComponentFixture<MultipleResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
