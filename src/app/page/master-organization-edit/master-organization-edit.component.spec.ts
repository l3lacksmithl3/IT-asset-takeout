import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterOrganizationEditComponent } from './master-organization-edit.component';

describe('MasterOrganizationEditComponent', () => {
  let component: MasterOrganizationEditComponent;
  let fixture: ComponentFixture<MasterOrganizationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterOrganizationEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterOrganizationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
