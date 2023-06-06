import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItAssetReturnComponent } from './it-asset-return.component';

describe('ItAssetReturnComponent', () => {
  let component: ItAssetReturnComponent;
  let fixture: ComponentFixture<ItAssetReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItAssetReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItAssetReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
