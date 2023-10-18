import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveExtendComponent } from './approve-extend.component';

describe('ApproveExtendComponent', () => {
  let component: ApproveExtendComponent;
  let fixture: ComponentFixture<ApproveExtendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveExtendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
