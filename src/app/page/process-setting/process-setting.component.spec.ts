import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessSettingComponent } from './process-setting.component';

describe('ProcessSettingComponent', () => {
  let component: ProcessSettingComponent;
  let fixture: ComponentFixture<ProcessSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
