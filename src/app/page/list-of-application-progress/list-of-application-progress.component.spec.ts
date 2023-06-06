import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfApplicationProgressComponent } from './list-of-application-progress.component';

describe('ListOfApplicationProgressComponent', () => {
  let component: ListOfApplicationProgressComponent;
  let fixture: ComponentFixture<ListOfApplicationProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfApplicationProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfApplicationProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
