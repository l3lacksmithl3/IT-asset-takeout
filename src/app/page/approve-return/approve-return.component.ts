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
  selector: 'app-approve-return',
  templateUrl: './approve-return.component.html',
  styleUrls: ['./approve-return.component.scss']
})
export class ApproveReturnComponent {

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
  return_count: any

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
      // this.reject = res['reject']
      this.return_count = res['return']
      let approve = res['approve-return']


      //TODO ---------------------------------------------------------
      if (res['approve-return']) {
        let res = await lastValueFrom(this.api.getDataApprove({ _id: approve }))
        if (res[0].return) {
          this.data = res[0].return
          this.data.last_item = res[0].return[`return_${this.return_count}`]
          // console.log("🚀 ~ file: approve-return.component.ts:69 ~ ApproveReturnComponent ~ ngOnInit ~ this.data.last_item:", this.data.last_item)
          this.type = 2
        }
        this.id = approve
        this.ControlID = res[0].ControlID
      }

      this.data_status = { ...this.data }
      this.data_status.count = this.return_count
      this.data_status.type = "return"


      console.log(this.data);

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
        if (data[0].return[`return_${this.return_count}`].some((e: any) => e.Approve_employee)) {
          Swal.fire('Approved', '', 'error').then(() => {
            window.location.reload()
          })
        }


        if (!data[0].return[`return_${this.return_count}`].some((e: any) => e.Approve_employee)) {
          if (data.length > 0) {
            data[0].return[`return_${this.return_count}`] = data[0].return[`return_${this.return_count}`].map((d: any) => {
              return {
                ...d,
                Approve_by: this.user.name,
                Approve_employee: this.user.employee,
                Approve_time: moment().format()
              }
            })

            let UpdateItemInReturn = data[0].return[`return_${this.return_count}`].map((d: any) => {
              let item = data[0].return.item.filter((a: any) => a.value == d.value)
              item[0].return_approve = true
            })
          }

          //check  == <> item all and item return

          let item_count = data[0].return.item.filter((e: any) => e.return == true)
          let set_1 = data[0].return?.return_1?.filter((a: any) => a?.Approve_employee)
          let set_2 = data[0].return?.return_2?.filter((a: any) => a?.Approve_employee)
          let set_3 = data[0].return?.return_3?.filter((a: any) => a?.Approve_employee)
          let count = 0
          if (set_1 && set_1.length > 0) {
            count = count + set_1.length
          }
          if (set_2 && set_2.length > 0) {
            count = count + set_2.length
          }
          if (set_3 && set_3.length > 0) {
            count = count + set_3.length
          }


          if (count == data[0].return.item.length) {
            data[0].return.Approve_Step = 2
          }

          let update = await lastValueFrom(this.api.ApproveUpdate(this.id, data[0]))
          if (update) {
            this.sendMail_1(this.id, data[0])
            this.Success_alert()
            this.update_status_asset(this.data.last_item)
          }
        }




      }
    })
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
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Success',
              showConfirmButton: false,
              timer: 1500,
            }).then(async (result) => {
              this.router.navigate(['/AppliedList']).then((v: any) => { })
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



  async update_status_asset(asset: any) {
    let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
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
          status_return: "available",
          status_latest_period: asset[0].period,
          status_latest_date: moment().format('ll'),
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

  //TODO mail
  async sendMail_1(id: any, data: any) {
    let mail_data = {
      _id: id,
      requester: data?.takeout.name,
      ControlID: data?.ControlID,
      requester_mail: data?.takeout.email,
      asset: data.return[`return_${this.return_count}`],
      return_count: this.return_count
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
      asset: data?.takeout.item
    }
    let Mail_Reject = lastValueFrom(this.api.Mail_Reject(mail_data))
    console.log(mail_data);


    //TODO--------------------------------------------------------------------------------------------------------------------------------------------
    // Takeout_success_to_div
  }




  checkApprove() {
    if (this.data.last_item?.some((d: any) => d.Approve_employee)) {
      return true
    }
    return false
  }















}
