import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


//ng g c
import { ProcessSettingComponent } from './page/process-setting/process-setting.component';
import { AppliedListComponent } from './page/applied-list/applied-list.component';
import { ListOfApplicationProgressComponent } from './page/list-of-application-progress/list-of-application-progress.component';
import { LoginComponent } from './page/login/login.component';
import { ApproveComponent } from './page/approve/approve.component';
import { ApproveFormComponent } from './page/approve-form/approve-form.component';
import { ApprovedHistoryComponent } from './page/approved-history/approved-history.component';
import { ItAssetReturnComponent } from './page/it-asset-return/it-asset-return.component';
import { LogBookRecordComponent } from './page/log-book-record/log-book-record.component';
import { MasterITAssetComponent } from './page/master-it-asset/master-it-asset.component';
import { EmailFormComponent } from './page/email-form/email-form.component';
import { BlackListComponent } from './page/black-list/black-list.component';
import { AdminGuard } from './routeguard/admin.guard';
import { BlackListAlertComponent } from './page/black-list-alert/black-list-alert.component';
import { MasterSectionHeadComponent } from './page/master-section-head/master-section-head.component';
import { MasterOrganizationComponent } from './page/master-organization/master-organization.component';
import { ApproveReturnComponent } from './page/approve-return/approve-return.component';
import { ApproveExtendComponent } from './page/approve-extend/approve-extend.component';
import { StatusMonitorComponent } from './page/status-monitor/status-monitor.component';
import { InventoryComponent } from './page/inventory/inventory.component';
import { LogbookHeadComponent } from './page/logbook-head/logbook-head.component';
import { ItAssetTakeout2Component } from './page/it-asset-takeout2/it-asset-takeout2.component';

const routes: Routes = [


  {
    path: 'Setting', component: ProcessSettingComponent,canActivate:[AdminGuard]
  },
  {
    path: 'ITAssetTakeout', component: ItAssetTakeout2Component,canActivate:[AdminGuard]
  },
  {
    path: 'AppliedList', component: AppliedListComponent,canActivate:[AdminGuard]
  },
  {
    path: 'ApplicationProgress', component: ListOfApplicationProgressComponent,canActivate:[AdminGuard]
  },
  {
    path: 'login', component: LoginComponent,canActivate:[AdminGuard]
  },
  {
    path: 'Approve', component: ApproveComponent,canActivate:[AdminGuard]
  },
  {
    path: 'ApproveFormConfirm', component: ApproveFormComponent,canActivate:[AdminGuard]
  },
  {
    path: 'ApprovedHistory', component: ApprovedHistoryComponent,canActivate:[AdminGuard]
  },
  {
    path: 'ItAssetReturn', component: ItAssetReturnComponent,canActivate:[AdminGuard]
  },
  {
    path: 'LogBookRecord', component: LogBookRecordComponent,canActivate:[AdminGuard]
  },
  {
    path: 'MasterITAsset', component: MasterITAssetComponent,canActivate:[AdminGuard]
  },
  {
    path: 'EmailForm', component: EmailFormComponent,canActivate:[AdminGuard]
  },
  {
    path: 'Blacklist', component: BlackListComponent,canActivate:[AdminGuard]
  },
  {
    path: 'Error', component: BlackListAlertComponent,canActivate:[AdminGuard]
  },
  {
    path: 'MasterSection', component: MasterSectionHeadComponent,canActivate:[AdminGuard]
  },
  {
    path: 'MasterOrganization', component: MasterOrganizationComponent,canActivate:[AdminGuard]
  },
  {
    path: 'ApproveReturn', component: ApproveReturnComponent,canActivate:[AdminGuard]
  },
  {
    path: 'ApproveExtend', component: ApproveExtendComponent,canActivate:[AdminGuard]
  },
  {
    path: 'zzzzzzzzzzzzzz', component: StatusMonitorComponent,canActivate:[AdminGuard]
  },
  {
    path: 'Inventory', component: InventoryComponent,canActivate:[AdminGuard]
  },
  {
    path: 'Logbook', component: LogbookHeadComponent,canActivate:[AdminGuard]
  },



  {
    path: '**',
    redirectTo: 'AppliedList'
    // redirectTo: 'dashboard'
  },


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
