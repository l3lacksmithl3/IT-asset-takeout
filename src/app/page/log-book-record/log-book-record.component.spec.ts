import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogBookRecordComponent } from './log-book-record.component';

describe('LogBookRecordComponent', () => {
  let component: LogBookRecordComponent;
  let fixture: ComponentFixture<LogBookRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogBookRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogBookRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
