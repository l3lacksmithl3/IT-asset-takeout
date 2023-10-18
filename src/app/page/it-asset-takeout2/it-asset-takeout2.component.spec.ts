import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItAssetTakeout2Component } from './it-asset-takeout2.component';

describe('ItAssetTakeout2Component', () => {
  let component: ItAssetTakeout2Component;
  let fixture: ComponentFixture<ItAssetTakeout2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItAssetTakeout2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItAssetTakeout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
