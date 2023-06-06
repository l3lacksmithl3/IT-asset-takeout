import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from './service/http.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  open: boolean = false
  title = 'IS-asset-takeout';
  showFiller = false;

  name: any
  CheckLogin: any
  data:any = []

  constructor(
    private api: HttpService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.CheckLogin = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    this.name = this.CheckLogin?.name
    this.CheckApprove()
  }


  logout() {
    let data = localStorage.removeItem("IT-asset-takeout-login");
    window.location.reload()
  }



  async CheckApprove() {
    let dateRaw = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let listApprove = await lastValueFrom(this.api.getDataApproveAll())

    for (const list of listApprove) {
      if (list.Approve_Step == 1 && list.Approve_Status == "standby") {
        for (const item of list.Executor) {
          if (item.name == dateRaw.name) {
            this.data.push(list)
            continue
          }
        }
      }
      if (list.Approve_Step == 2 && list.Approve_Status == "Approve" ) {
        for (const item of list.IT) {
          if (item.name == dateRaw.name) {
            this.data.push(list)
            continue
          }
        }
        // console.log(list);
      }
    }
    // console.log(this.data);

  }

}
