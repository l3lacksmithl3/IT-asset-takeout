import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackListAlertComponent } from './black-list-alert.component';

describe('BlackListAlertComponent', () => {
  let component: BlackListAlertComponent;
  let fixture: ComponentFixture<BlackListAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlackListAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackListAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
