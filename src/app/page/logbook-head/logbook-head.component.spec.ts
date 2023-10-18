import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbookHeadComponent } from './logbook-head.component';

describe('LogbookHeadComponent', () => {
  let component: LogbookHeadComponent;
  let fixture: ComponentFixture<LogbookHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogbookHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogbookHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
