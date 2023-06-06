import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//ng g c
import { ProcessSettingComponent } from './page/process-setting/process-setting.component';
import { ITAssetTakeoutComponent } from './page/it-asset-takeout/it-asset-takeout.component';
import { AppliedListComponent } from './page/applied-list/applied-list.component';
import { ListOfApplicationProgressComponent } from './page/list-of-application-progress/list-of-application-progress.component';
import { LoginComponent } from './page/login/login.component';
import { ApproveComponent } from './page/approve/approve.component';
import { ApproveFormComponent } from './page/approve-form/approve-form.component';
import { ApprovedHistoryComponent } from './page/approved-history/approved-history.component';

const routes: Routes = [


  {
    path: 'Setting', component: ProcessSettingComponent,
  },
  {
    path: 'ITAssetTakeout', component: ITAssetTakeoutComponent,
  },
  {
    path: 'AppliedList', component: AppliedListComponent,
  },
  {
    path: 'ApplicationProgress', component: ListOfApplicationProgressComponent,
  },
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'Approve', component: ApproveComponent,
  },
  {
    path: 'ApproveFormConfirm', component: ApproveFormComponent,
  },
  {
    path: 'ApprovedHistory', component: ApprovedHistoryComponent,
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
