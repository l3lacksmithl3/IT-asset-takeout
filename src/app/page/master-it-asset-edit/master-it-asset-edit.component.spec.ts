import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterItAssetEditComponent } from './master-it-asset-edit.component';

describe('MasterItAssetEditComponent', () => {
  let component: MasterItAssetEditComponent;
  let fixture: ComponentFixture<MasterItAssetEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterItAssetEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterItAssetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
