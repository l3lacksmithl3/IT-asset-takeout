import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedHistoryComponent } from './approved-history.component';

describe('ApprovedHistoryComponent', () => {
  let component: ApprovedHistoryComponent;
  let fixture: ComponentFixture<ApprovedHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
