import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSectionHeadComponent } from './master-section-head.component';

describe('MasterSectionHeadComponent', () => {
  let component: MasterSectionHeadComponent;
  let fixture: ComponentFixture<MasterSectionHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSectionHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSectionHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
