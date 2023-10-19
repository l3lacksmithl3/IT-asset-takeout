import { Component, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxUiLoaderService } from "ngx-ui-loader";


@Component({
  selector: 'app-approve-form',
  templateUrl: './approve-form.component.html',
  styleUrls: ['./approve-form.component.scss']
})
export class ApproveFormComponent {
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

  mode: any
  check_approve: boolean = false


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
      this.reject = res['reject']
      let view_takeout = res['view_takeout']
      let view_return = res['view_return']



      let approve = res['approve']


      if (res['view_takeout']) {
        this.mode = null
        let res = await lastValueFrom(this.api.getDataApprove({ _id: view_takeout }))
        this.data = res[0].takeout
        this.type = 1
        this.mode = 2
        this.ControlID = res[0].ControlID
      }

      if (res['view_return']) {
        this.mode = null
        let res = await lastValueFrom(this.api.getDataApprove({ _id: view_return }))
        this.data = res[0].return
        this.type = 2
        this.mode = 2
        this.ControlID = res[0].ControlID
      }


      if (res['approve']) {
        let res = await lastValueFrom(this.api.getDataApprove({ _id: approve }))
        this.user.level == 3 ? this.mode = 1 : this.mode = 1
        if (res[0].return) {
          this.data = res[0].return
          this.type = 2
        } else {
          this.data = res[0].takeout
          this.type = 1
        }
        this.id = approve
        this.ControlID = res[0].ControlID
      }



      if (res['reject']) {
        this.mode = 0
        let res = await lastValueFrom(this.api.getDataApprove({ _id: this.reject }))
        console.log(res);

        if (res[0].return) {
          this.data = res[0].return
          this.type = 2
        } else {
          this.data = res[0].takeout
          this.type = 1
        }
        this.data.reason = res[0].reason
        console.log(this.data.comment);
        this.ControlID = res[0].ControlID
      }


      if (Object.keys(res).length === 0) {
        let id = JSON.parse(`${localStorage.getItem("IT-asset-takeout-ViewApprove")}`)
        this.mode = 2
        let res = await lastValueFrom(this.api.getDataApprove({ _id: id }))
        if (res[0].return) {
          this.data = res[0].return
          this.type = 2
        } else {
          this.data = res[0].takeout
          this.type = 1
        }
        this.ControlID = res[0].ControlID
        let reject = JSON.parse(`${localStorage.getItem("IT-asset-takeout-ViewApprove-type")}`)
        if (reject?.ApplyStatus == 'Reject') {
          this.mode = 0
        }
        this.data.reason = res[0].reason
      }

      this.data_status = { ...this.data }
      this.data_status.type = 'takeout'
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
        if (data[0].return) {
          if (data[0].return.Approve_Step == 2) {
            Swal.fire(`Approved`, '', 'info').then(async (result) => {
              window.location.reload()
            })
          }
          if (data[0].return.Approve_Step == 0) {
            Swal.fire(`Reject`, '', 'info').then(async (result) => {
              window.location.reload()
            })
          }
          if (data[0].return.Approve_Step == 1) {
            let aoo = data[0].return.item.filter((d: any) => d.return)
            aoo = aoo.map((e: any) => {
              return {
                ...e,
                Approve_by: this.user.name,
                Approve_employee: this.user.employee,
                Approve_time: moment().format()
              }
            })
            console.log(aoo);

            data[0].return.item = data[0].return.item.map((d: any) => {
              const foo = aoo.find((a: any) => a.value == d.value)
              if (foo) {
                return {
                  ...foo
                }
              } else {
                return {
                  ...d
                }
              }

            })

            let update = await lastValueFrom(this.api.ApproveUpdate(this.id, data[0]))
            this.update_status_asset()
          }

        } else {
          if (data[0].takeout.Approve_Step == 2) {
            Swal.fire(`Approved`, '', 'info').then(async (result) => {
              window.location.reload()
            })
          }
          if (data[0].takeout.Approve_Step == 0) {
            Swal.fire(`Reject`, '', 'info').then(async (result) => {
              window.location.reload()
            })
          }
          if (data[0].takeout.Approve_Step == 1) {
            data[0].takeout.Approve_Step = data[0].takeout.Approve_Step + 1
            data[0].takeout.Approve_by = this.user.name
            data[0].takeout.Approve_employee = this.user.employee
            data[0].takeout.Approve_time = moment().format()
            data[0].takeout.Apply_Date_Latest = moment().format()
            this.sendMail_2(this.id, data[0])

            let update = await lastValueFrom(this.api.ApproveUpdate(this.id, data[0]))
            this.set_return()
            this.Success_alert()
          }
        }
      }
    })
  }

  async set_return() {
    let data = await lastValueFrom(this.api.getDataApprove({ _id: this.id }))
    data[0].takeout.Approve_Step = 1
    let update = await lastValueFrom(this.api.ApproveUpdate(this.id, { return: data[0].takeout }))
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
        let res = await lastValueFrom(this.api.getDataApprove({ _id: this.id }))
        res[0].reject = true
        res[0].reason = {
          name: this.user.name,
          comment: reason,
          date: moment().format()
        }
        if (res[0].return) {


          res[0].return.Approve_Step = 0

        } else {
          if (res[0].takeout.Approve_Step == 2) {
            Swal.fire(`Approved`, '', 'info').then(async (result) => {
              window.location.reload()
            })
          }
          if (res[0].takeout.Approve_Step == 0) {
            Swal.fire(`Reject`, '', 'info').then(async (result) => {
              window.location.reload()
            })
          }
          if (res[0].takeout.Approve_Step == 1) {
            res[0].takeout.Approve_Step = 0
            this.reject_mail(this.id, res[0])
            let update = await lastValueFrom(this.api.ApproveUpdate(this.id, res[0]))
            this.update_status_asset()
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
        }

        //

      }
    });


  }


  async ShowFlowApplied() {
    this.Applicant = this.data
    this.Applicant.code_abbname = this.user.code_abbname
    this.Applicant.code_fullname = this.user.code_fullname
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
    console.log(this.id);
    console.log("askdkaskdk");


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



  async update_status_asset() {
    for (const item of this.data.item) {
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
          status_return: "available",
          status_latest_user: " "
        }
      })
      let update_asset_item = lastValueFrom(this.api.updateAsset(data[0]._id, data[0]))
    }
  }




  async sendMail_2(id: any, data: any) {
    let mail_data = {
      _id: id,
      requester: data?.takeout.name,
      ControlID: data?.ControlID,
      requester_mail: data?.takeout.email,
      asset: data?.takeout.item
    }
    let Mail_Takeout_success = lastValueFrom(this.api.Takeout_success(mail_data))
    console.log(mail_data);
  }

  async sendMail_1(id: any, data: any) {
    let mail_data = {
      _id: id,
      requester: data?.takeout.name,
      ControlID: data?.ControlID,
      requester_mail: data?.takeout.email,
      asset: data?.takeout.item
    }
    let Mail_Return_success = lastValueFrom(this.api.Return_success(mail_data))
    console.log(mail_data);
  }



  async reject_mail(id: any, data: any) {
    let mail_data = {
      _id: id,
      requester: data?.takeout.name,
      ControlID: data?.ControlID,
      requester_mail: data?.takeout.email,
      asset: data?.takeout.item,
      reason: data?.reason,
    }

    let Mail_Reject = lastValueFrom(this.api.Mail_Reject(mail_data))



    //TODO--------------------------------------------------------------------------------------------------------------------------------------------
    // Takeout_success_to_div
  }


  PreviousPage() {
    this.router.navigate(['..'])
  }







}
