import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// ng g c
import { ProcessSettingComponent } from './page/process-setting/process-setting.component';
import { ApprovalPropertyComponent } from './page/approval-property/approval-property.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApprovalPropertyItComponent } from './page/approval-property-it/approval-property-it.component';
import { ITAssetTakeoutComponent } from './page/it-asset-takeout/it-asset-takeout.component';
import { AppliedListComponent } from './page/applied-list/applied-list.component';
import { SidenavComponent } from './page/sidenav/sidenav.component';
import { ListOfApplicationProgressComponent } from './page/list-of-application-progress/list-of-application-progress.component';
import { LoginComponent } from './page/login/login.component';
import { ApproveComponent } from './page/approve/approve.component';
import { ApproveFormComponent } from './page/approve-form/approve-form.component';
import { ApprovedHistoryComponent } from './page/approved-history/approved-history.component';
import { ItAssetReturnComponent } from './page/it-asset-return/it-asset-return.component';
import { LogBookRecordComponent } from './page/log-book-record/log-book-record.component';



// code
@NgModule({
  declarations: [
    AppComponent,
    ProcessSettingComponent,
    ApprovalPropertyComponent,
    ApprovalPropertyItComponent,
    ITAssetTakeoutComponent,
    AppliedListComponent,
    SidenavComponent,
    ListOfApplicationProgressComponent,
    LoginComponent,
    ApproveComponent,
    ApproveFormComponent,
    ApprovedHistoryComponent,
    ItAssetReturnComponent,
    LogBookRecordComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    NgbModule,
    ReactiveFormsModule, //!im
    FormsModule, //!im
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
