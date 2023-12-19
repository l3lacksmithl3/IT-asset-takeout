import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-status-monitor',
  templateUrl: './status-monitor.component.html',
  styleUrls: ['./status-monitor.component.scss']
})
export class StatusMonitorComponent implements OnInit {


  @Input() data_status: any
  @Output() data_statusChange: EventEmitter<any> = new EventEmitter()



  currentStep = 2; // กำหนดขั้นตอนปัจจุบันที่คุณต้องการแสดง
  username: any = []
  time_approve: any

  moment: any = moment

  constructor(
    private api: HttpService,
  ) { }


  ngOnInit(): void {

    this.username = []
    if (this.data_status.type == 'takeout') {
      if (this.data_status.Approve_Step == 1) {
        this.getApprove(this.data_status)
      }
      if (this.data_status.Approve_Step == 2) {
        this.username[0] =  this.data_status.Approve_by
        this.time_approve = this.data_status.Approve_time
        this.currentStep = 3
      }
    }
    if (this.data_status.type == 'extend') {
      this.username[0] = this.data_status[`extend_${Number(this.data_status?.count)}`][0].Approve_by
      if (this.username[0] == undefined) {
        this.getApprove(this.data_status)
      }
      if (this.username[0] != undefined) {
        this.time_approve = this.data_status[`extend_${Number(this.data_status?.count)}`][0].Approve_time
        this.currentStep = 3
      }
    }
    if (this.data_status.type == 'return') {
      this.username[0] = this.data_status[`return_${Number(this.data_status?.count)}`][0].Approve_by
      if (this.username[0] == undefined) {
        this.getApprove(this.data_status)
      }
      if (this.username[0] != undefined) {
        this.time_approve = this.data_status[`return_${Number(this.data_status?.count)}`][0].Approve_time
        this.currentStep = 3
      }
    }

    // console.log(this.username);
    // console.log(this.time_approve);

    // console.log(this.data_status);

  }





  async getApprove(data: any) {

    let employee = await lastValueFrom(this.api.MasterUserAll())

    let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ organization: `${data.section}` }))
    let approver: any = []

    if (Number(data.level) == 3) {
      let Organ = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [data_organization[0].code[0], Number(data_organization[0].code[0])] } }))
      approver.push(...Organ[0].code_employee)
    }

    if (Number(data.level) == 2) {
      let Organ = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [data_organization[0].code[1], Number(data_organization[0].code[1])] } }))
      approver.push(...Organ[0].code_employee)
    }

    if (Number(data.level) == 1) {
      for (let index = 1; index <= 2; index++) { // 1
        let Organ = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [data_organization[0].code[index], Number(data_organization[0].code[index])] } }))
        approver.push(...Organ[0].code_employee)
      }
    }


    let user = employee.filter((d: any) => approver.includes(d.employee));
    let user_name = user.map((d: any) => {
      return d.name
    })
    user_name = [...new Set(user_name.map((item:any) => item))]; // [ 'A', 'B']

    this.username = user_name

  }
}
