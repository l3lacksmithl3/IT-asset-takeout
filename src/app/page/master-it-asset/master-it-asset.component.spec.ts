import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterITAssetComponent } from './master-it-asset.component';

describe('MasterITAssetComponent', () => {
  let component: MasterITAssetComponent;
  let fixture: ComponentFixture<MasterITAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterITAssetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterITAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
