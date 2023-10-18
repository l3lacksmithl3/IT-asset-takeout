import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveReturnComponent } from './approve-return.component';

describe('ApproveReturnComponent', () => {
  let component: ApproveReturnComponent;
  let fixture: ComponentFixture<ApproveReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
