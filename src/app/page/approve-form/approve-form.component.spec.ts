import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveFormComponent } from './approve-form.component';

describe('ApproveFormComponent', () => {
  let component: ApproveFormComponent;
  let fixture: ComponentFixture<ApproveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
