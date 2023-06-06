import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITAssetTakeoutComponent } from './it-asset-takeout.component';

describe('ITAssetTakeoutComponent', () => {
  let component: ITAssetTakeoutComponent;
  let fixture: ComponentFixture<ITAssetTakeoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ITAssetTakeoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITAssetTakeoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
