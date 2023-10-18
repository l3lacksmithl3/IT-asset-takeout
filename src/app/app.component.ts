import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, lastValueFrom } from 'rxjs';
import { HttpService } from './service/http.service';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, PopupRequest, RedirectRequest, EventMessage, EventType } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  interval: any;
  open: boolean = false
  title = 'II-asset-takeout';
  showFiller = false;
  name: any
  CheckLogin: any
  data: any = []
  icons: boolean = true
  number: any
  item_approve: any = []
  user: any

  constructor(
    private api: HttpService,
    private route: Router,
    private http: HttpClient,
    private authService: MsalService,
  ) { }




  // updateAt
  async ngOnInit(): Promise<void> {
    this.CheckLogin = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    this.name = this.CheckLogin?.name
    this.CheckApprove()


    // console.log(this.name);
    // this.interval$ = interval(1000).subscribe(res => this.checkUpdate)


    //set update date in server
    let data_old = ""
    setInterval(async () => {
      let ck = await lastValueFrom(this.api.updateAt())

      if (ck != null) {
        if (data_old != ck.toString()) {
          data_old = ck.toString()
          this.CheckApprove()
        }
      }
    }, 5000)



  }


  ngOnDestroy(): void { clearInterval(this.interval) }



  logout() {
    let data = localStorage.removeItem("IT-asset-takeout-login");
    window.location.reload()
  }



  async CheckApprove() {
    this.user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ code: { $in: [`${this.user?.position_code}`, Number(this.user?.position_code)] } }))
    if (data_organization.length > 0) {
      let NewFormate = data_organization.map((d: any) => {
        return d.code
      })
      let result
      let flattenedData
      let level = 1
      if (this.user?.level == 4) {
        flattenedData = NewFormate.reduce((acc: any, row: any) => acc.concat(row.slice(level, 2)), []);
        result = [...new Set(flattenedData)];
      } else {
        if (this.user.level == 1) { level = 4 }
        if (this.user.level == 2) { level = 3 }
        if (this.user.level == 3) { level = 2 }
        flattenedData = NewFormate.reduce((acc: any, row: any) => acc.concat(row.slice(level, 4)), []);
        result = [...new Set(flattenedData)];
      }

      result = result.map((e: any) => {
        return JSON.stringify(e)
      })

      let filter = {
        $or: [
          { 'takeout.position_code': { $in: result }, "takeout.Approve_Step": 1 },
          { 'return.position_code': { $in: result }, "return.Approve_Step": 1 }
        ]
      }
      // this.item_approve
      let rew = await lastValueFrom(this.api.getDataApprove(filter))



      let list = []
      for (const item of rew) {

        if (item.return) {
          //return
          for (let index = item.return.count_return; index >= 1; index--) {
            if (item.return[`return_${index}`] && !item.return[`return_${index}`].some((e: any) => e.Approve_employee != undefined)) {
              list.push({
                id: item._id,
                ControlID: item.ControlID,
                "Business Model": "IT asset return",
                Value: item.return,
                type: index,
                item: item.return[`return_${index}`]?.length
              })
            }
          }
        }
        if (item.extend) {
          //extend
          for (let index = item.extend.count_extend; index >= 1; index--) {
            if (item.extend[`extend_${index}`] && !item.extend[`extend_${index}`].some((e: any) => e.Approve_employee != undefined)) {
              list.push({
                id: item._id,
                ControlID: item.ControlID,
                "Business Model": "IT asset extend",
                Value: item.extend,
                type: index,
                item: item.extend[`extend_${index}`]?.length
              })
            }
          }

        };
        if (item.takeout) {
          list.push({
            id: item._id,
            ControlID: item.ControlID,
            "Business Model": "IT asset takeout application form",
            Value: item.takeout
          })
        };


      }
      this.item_approve = list.filter((d: any) => d.Value.Approve_Step == 1)


      if (this.item_approve.length == 0) {
        this.number = `IT asset takeout`
      } else {
        this.number = `(${this.item_approve.length}) IT asset takeout`
      }
    }


  }


  onShow() {
    this.icons = false
  }
  offShow() {
    this.icons = true
  }


  async getProfile() {
    let data: any = await lastValueFrom(this.getRole())
    if (this.authService.instance.getActiveAccount()) {
      // ดึง Token ในการเข้าถึง (access token)
      let accessToken = this.authService.instance.getActiveAccount()?.idTokenClaims?.roles;
      // ใช้งาน role ที่ได้รับมา
      data.role = accessToken
    }

    return data
  }


  getRole(): Observable<any> {
    const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
    return this.http.get(GRAPH_ENDPOINT)
  }

  loo :boolean = false
  test(){
    this.loo = true
  }


}
