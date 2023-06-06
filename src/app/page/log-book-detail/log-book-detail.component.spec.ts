import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogBookDetailComponent } from './log-book-detail.component';

describe('LogBookDetailComponent', () => {
  let component: LogBookDetailComponent;
  let fixture: ComponentFixture<LogBookDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogBookDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogBookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
