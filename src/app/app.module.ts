import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { HttpClientModule, HttpClient ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// ng g c
import { ProcessSettingComponent } from './page/process-setting/process-setting.component';
import { ApprovalPropertyComponent } from './page/approval-property/approval-property.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApprovalPropertyItComponent } from './page/approval-property-it/approval-property-it.component';
import { AppliedListComponent } from './page/applied-list/applied-list.component';
import { SidenavComponent } from './page/sidenav/sidenav.component';
import { ListOfApplicationProgressComponent } from './page/list-of-application-progress/list-of-application-progress.component';
import { LoginComponent } from './page/login/login.component';
import { ApproveComponent } from './page/approve/approve.component';
import { ApproveFormComponent } from './page/approve-form/approve-form.component';
import { ApprovedHistoryComponent } from './page/approved-history/approved-history.component';
import { ItAssetReturnComponent } from './page/it-asset-return/it-asset-return.component';
import { LogBookRecordComponent } from './page/log-book-record/log-book-record.component';
import { LogBookDetailComponent } from './page/log-book-detail/log-book-detail.component';
import { MasterITAssetComponent } from './page/master-it-asset/master-it-asset.component';
import { MasterItAssetEditComponent } from './page/master-it-asset-edit/master-it-asset-edit.component';
import { EmailFormComponent } from './page/email-form/email-form.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxEditorModule } from 'ngx-editor';
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import {  MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalRedirectComponent } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import {ScrollingModule} from '@angular/cdk/scrolling';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";
import { BlackListComponent } from './page/black-list/black-list.component';
import { BlackListAlertComponent } from './page/black-list-alert/black-list-alert.component';
import { MasterSectionHeadComponent } from './page/master-section-head/master-section-head.component';
import { MasterSectionHeadEditComponent } from './page/master-section-head-edit/master-section-head-edit.component';
import { MasterOrganizationComponent } from './page/master-organization/master-organization.component';
import { MasterOrganizationEditComponent } from './page/master-organization-edit/master-organization-edit.component';
import { ApproveReturnComponent } from './page/approve-return/approve-return.component';
import { ApproveExtendComponent } from './page/approve-extend/approve-extend.component';
import { StatusMonitorComponent } from './page/status-monitor/status-monitor.component';
import { InventoryComponent } from './page/inventory/inventory.component';
import { LogbookHeadComponent } from './page/logbook-head/logbook-head.component';
import { ItAssetTakeout2Component } from './page/it-asset-takeout2/it-asset-takeout2.component';
import { ManualComponent } from './page/manual/manual.component';
import { ReportComponent } from './report/report.component';
import { ReportedComponent } from './page/reported/reported.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "red",
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.threeStrings, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
  // "text": "Loading . . .",
};

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1; // Remove this line to use Angular Universal

export function loggerCallback(logLevel: LogLevel, message: string) {
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      // clientId: "b5c2e510-4a17-4feb-b219-e55aa5b74144",
      clientId: "18f5263e-e85a-4a75-9a44-88b0f2acc026",
      // clientId: '3fba556e-5d4a-48e3-8e1a-fd57c12cb82e', // PPE testing environment
      authority: "https://login.microsoftonline.com/17c419df-66aa-405a-bf9e-9ce76f23048e",
      // authority: "https://login.microsoftonline.com/common",
      // authority: 'https://login.windows-ppe.net/common', // PPE testing environment
      redirectUri: '/',
      postLogoutRedirectUri: '/'
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11. Remove this line to use Angular Universal
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  // protectedResourceMap.set('https://graph.microsoft-ppe.com/v1.0/me', ['user.read']); // PPE testing environment

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    },
    loginFailedRoute: '/login-failed'
  };
}

// code
@NgModule({
  declarations: [
    AppComponent,
    ProcessSettingComponent,
    ApprovalPropertyComponent,
    ApprovalPropertyItComponent,
    AppliedListComponent,
    SidenavComponent,
    ListOfApplicationProgressComponent,
    LoginComponent,
    ApproveComponent,
    ApproveFormComponent,
    ApprovedHistoryComponent,
    ItAssetReturnComponent,
    LogBookRecordComponent,
    LogBookDetailComponent,
    MasterITAssetComponent,
    MasterItAssetEditComponent,
    EmailFormComponent,
    BlackListComponent,
    BlackListAlertComponent,
    MasterSectionHeadComponent,
    MasterSectionHeadEditComponent,
    MasterOrganizationComponent,
    MasterOrganizationEditComponent,
    ApproveReturnComponent,
    ApproveExtendComponent,
    StatusMonitorComponent,
    InventoryComponent,
    LogbookHeadComponent,
    ItAssetTakeout2Component,
    ManualComponent,
    ReportComponent,
    ReportedComponent

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    NgbModule,
    ReactiveFormsModule, //!im
    FormsModule, //!im
    HttpClientModule,
    AngularEditorModule,
    NgxEditorModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MsalModule,
    ScrollingModule



  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent ,MsalRedirectComponent],
})
export class AppModule { }
