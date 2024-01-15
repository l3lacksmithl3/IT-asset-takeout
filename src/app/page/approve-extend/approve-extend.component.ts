import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-approve-extend',
  templateUrl: './approve-extend.component.html',
  styleUrls: ['./approve-extend.component.scss']
})
export class ApproveExtendComponent {

  data: any = {}
  user: any
  moment: any = moment
  @Input() isShow: any
  @Input() data_status: any
  Applicant: any = []
  Executor: any = []
  ItExecutor: any = []
  id: any
  lastApprove: any
  reject: any
  comment: any
  DataComment: any = []
  show: boolean = true
  lastTime: any
  compare: any
  ShowComments: any = []
  CommentReject: any = {}
  reserve: any
  ControlID: any
  type: any
  extend_count: any

  mode: any
  check_approve: boolean = false
  Need_OT: any = false

  constructor(
    private api: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) { }


  async ngOnInit(): Promise<void> {
    this.ngxService.start()

    // this.loading()
    this.route.queryParams.subscribe(async res => {
      this.user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)

      // this.reject = res['reject']
      this.extend_count = res['extend']
      let approve = res['approve-extend']

      //TODO ---------------------------------------------------------
      if (res['approve-extend']) {
        let res = await lastValueFrom(this.api.getDataApprove({ _id: approve }))

        if (res[0].extend) {
          this.data = res[0].extend

          this.data.last_item = res[0].extend[`extend_${this.extend_count}`]
          // http://localhost:4200/ApproveExtend?approve-extend=64f6f0d0b89eb3a3bae480d1&extend=1
          this.type = 2
        }
        this.id = approve
        this.ControlID = res[0].ControlID
      }
      this.data_status = { ...this.data }
      this.data_status.count = this.extend_count
      this.data_status.type = 'extend'
      this.CheckClass()
      this.ngxService.stop()
    })



  }




  Approve_yes() {
    Swal.close()
    Swal.fire({
      title: 'Do you want to approve ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        let data = await lastValueFrom(this.api.getDataApprove({ _id: this.id }))
        // if (data[0].extend[`extend_${this.extend_count}`].some((e: any) => e.Approve_employee)) {
        //   Swal.fire('Approved', '', 'error').then(() => {
        //     window.location.reload()
        //   })
        // }


        if (!data[0].extend[`extend_${this.extend_count}`].some((e: any) => e.Approve_employee)) {
          if (data.length > 0) {
            data[0].extend[`extend_${this.extend_count}`] = data[0].extend[`extend_${this.extend_count}`].map((d: any) => {
              const items = data[0].return.item
              const indexItem = items.findIndex((a: any) => a.value == d.value)
              if (indexItem !== -1) {
                let period = items[indexItem].period.split("-")[0]
                items[indexItem].period = `${period}- ${moment(d.title).format('ll')}`
                items[indexItem].extend = false
                items[indexItem].extend_success = false
              }
              return {
                ...d,
                Approve_by: this.user.name,
                Approve_employee: this.user.employee,
                Approve_time: moment().format(),
                time: moment().format()
              }
            })
          }



          let update = await lastValueFrom(this.api.ApproveUpdate(this.id, data[0]))
          if (update) {
            this.sendMail_1(this.id, data[0])
            this.Success_alert()
          }
        } else {
          Swal.fire(`Approved`, '', 'info').then(async (result) => {
            window.location.reload()
          })
        }



      }
    })
  }




  Approve_no() {
    Swal.fire({
      title: 'Do you want to reject ?',
      input: 'textarea', // ให้มีกรอบกรอกข้อมูล reason
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        return value ? null : 'Please provide a reason !';
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        Swal.close()
        const reason = result.value;
        let data = await lastValueFrom(this.api.getDataApprove({ _id: this.id }))

        if (!data[0].extend[`extend_${this.extend_count}`].some((e: any) => e.Approve_employee)) {
          if (data.length > 0) {
            data[0].extend[`extend_${this.extend_count}`] = data[0].extend[`extend_${this.extend_count}`].map((d: any) => {
              const items = data[0].return.item
              const indexItem = items.findIndex((a: any) => a.value == d.value)
              if (indexItem !== -1) {
                items[indexItem].extend = false
                items[indexItem].extend_success = false
              }
              return {
                ...d,
                Approve_by: this.user.name,
                Approve_employee: this.user.employee,
                Approve_time: moment().format(),
                reason: reason
              }
            })
          }

          let update = await lastValueFrom(this.api.ApproveUpdate(this.id, data[0]))
          if (update) {
            this.reject_mail(this.id, data[0], reason)
            this.Success_alert()
          }
        } else {
          Swal.fire(`Approved`, '', 'info').then(async (result) => {
            window.location.reload()
          })
        }

      }
    });


  }


  Success_alert() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Success',
      showConfirmButton: false,
      timer: 1500,
    }).then(async (result) => {
      this.router.navigate(['/Approve']).then((v: any) => { })
    })
  }

  async ShowFlowApplied() {
    this.Applicant = this.data
    this.Applicant.code_abbname = this.user.code_abbname
    // this.Applicant.code_fullname = this.user.code_fullname
    var format = 'YYYY/MM/DD HH:mm:ss';
    this.Applicant.FromDateNew = moment(this.Applicant.Apply_Date).format(format)


    // this.lastTime = this.data.IT[0]
    setTimeout(() => {
      Swal.close()
      this.show = false
      this.ngxService.stop()
    }, 1000);

  }




  edit() {
    let id = JSON.parse(`${localStorage.getItem("IT-asset-takeout-ViewApprove")}`)
    if (this.reject?.length > 0) {
      id = this.reject
    }


    this.router.navigate(['/ITAssetTakeout'], {
      relativeTo: this.route,
      queryParams: { id: id }
    });

  }

  async cancel() {
    Swal.close()
    Swal.fire({
      title: 'Do you want to cancel data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let id = JSON.parse(`${localStorage.getItem("IT-asset-takeout-ViewApprove")}`)
        let data = await lastValueFrom(this.api.delDataApprove({ _id: id }))
        this.router.navigate(['/AppliedList']).then((v: any) => {
        })
        //code end
        setTimeout(() => {
          Swal.close()
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })
  }



  async update_status_asset(asset: any) {
    for (const item of asset) {
      let data = await lastValueFrom(this.api.getAssetByID({
        'Host Name': {
          '$in': [
            item.value.toUpperCase(), item.value.toLowerCase()
          ]
        }
      }))
      data = data.map((e: any) => {
        return {
          ...e,
          status_return: "available"
        }
      })
      let update_asset_item = lastValueFrom(this.api.updateAsset(data[0]._id, data[0]))
    }
  }






  //TODO mail
  async sendMail_1(id: any, data: any) {
    data.extend[`extend_${this.extend_count}`] = data.extend[`extend_${this.extend_count}`].map((d: any) => {
      return {
        ...d,
        title: moment(d.title).format('ll')
      }
    })
    let mail_data = {
      _id: id,
      requester: data?.takeout.name,
      ControlID: data?.ControlID,
      requester_mail: data?.takeout.email,
      asset: data.extend[`extend_${this.extend_count}`],
      extend_count: this.extend_count
    }

    let Mail_Extend_success = lastValueFrom(this.api.Extend_success(mail_data))
  }



  async reject_mail(id: any, data: any, reason: any) {
    data.extend[`extend_${this.extend_count}`] = data.extend[`extend_${this.extend_count}`].map((d: any) => {
      return {
        ...d,
        title: moment(d.title).format('ll')
      }
    })
    let mail_data = {
      _id: id,
      requester: data?.takeout.name,
      ControlID: data?.ControlID,
      requester_mail: data?.takeout.email,
      asset: data.extend[`extend_${this.extend_count}`],
      reason: reason,
      extend_count: this.extend_count
    }
    let Mail_Reject = lastValueFrom(this.api.Mail_Reject_Extend(mail_data))
    //TODO--------------------------------------------------------------------------------------------------------------------------------------------
    // Takeout_success_to_div
  }




  checkApprove() {
    if (this.data.last_item?.some((d: any) => d.Approve_employee && !d?.reason)) {
      return true
    }
    return false
  }
  check_reject() {
    if (this.data.last_item?.some((d: any) => d.Approve_employee && d?.reason)) {
      return true
    }
    return false
  }


  PreviousPage() {
    this.router.navigate(['..'])
  }



  async CheckClass() {
    if (this.data.StatusOT) {
      this.Need_OT = true
    } else {
      let data = await lastValueFrom(this.api.CheckClass({ 'email': this.data.email }))
      if (data.length != 0) {
        let Check = data[0].grade.split('').filter((d: any) => d == 'M')
        let Japan = data[0].user_id.split('').filter((d: any) => d == 'J')
        Check.length != 0 || Japan.length != 0 ? this.Need_OT = false : this.Need_OT = true
      }
    }
  }







}

