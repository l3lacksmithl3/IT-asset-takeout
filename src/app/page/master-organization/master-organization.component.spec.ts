import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterOrganizationComponent } from './master-organization.component';

describe('MasterOrganizationComponent', () => {
  let component: MasterOrganizationComponent;
  let fixture: ComponentFixture<MasterOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterOrganizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
