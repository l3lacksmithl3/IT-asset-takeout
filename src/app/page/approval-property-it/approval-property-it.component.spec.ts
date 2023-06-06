import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPropertyItComponent } from './approval-property-it.component';

describe('ApprovalPropertyItComponent', () => {
  let component: ApprovalPropertyItComponent;
  let fixture: ComponentFixture<ApprovalPropertyItComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalPropertyItComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalPropertyItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
