import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPropertyComponent } from './approval-property.component';

describe('ApprovalPropertyComponent', () => {
  let component: ApprovalPropertyComponent;
  let fixture: ComponentFixture<ApprovalPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
