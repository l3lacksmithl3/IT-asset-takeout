import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSectionHeadEditComponent } from './master-section-head-edit.component';

describe('MasterSectionHeadEditComponent', () => {
  let component: MasterSectionHeadEditComponent;
  let fixture: ComponentFixture<MasterSectionHeadEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSectionHeadEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSectionHeadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
