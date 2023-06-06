import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-approve-form',
  templateUrl: './approve-form.component.html',
  styleUrls: ['./approve-form.component.scss']
})
export class ApproveFormComponent {
  data: any = {}
  user: any

  @Input() isShow: any
  Applicant: any = []
  Executor: any = []
  ItExecutor: any = []
  id: any
  lastApprove: any
  reject: any
  comment: any
  DataComment: any = []

  lastTime: any

  constructor(
    private api: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async res => {
      this.user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
      this.id = res['id']


      if (this.id) {
        let data = await lastValueFrom(this.api.getDataApprove({ _id: this.id }))
        if (data.length > 0) {
          this.data = data[0]
          this.ShowFlowApplied()
          this.checkApproveSuccess()
          this.isShow = true
          this.ShowComment()
        }
      }


      if (!this.id) {
        let id = JSON.parse(`${localStorage.getItem("IT-asset-takeout-ViewApprove")}`)
        console.log(id);

        let res = await lastValueFrom(this.api.getDataApprove({ _id: id }))
        console.log(res);

        this.data = res[0]
        console.log(this.data);

        if (this.isShow == undefined) {
          this.isShow = true
        }
        this.ShowFlowApplied()
        this.checkApproveSuccess()
        if (!this.id && this.user.name != this.data.name) {
          this.read()
        }
        this.ShowComment()
      }
    })

  }


  Approve_yes() {
    Swal.fire({
      title: 'Do you want to approve ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {

        if (this.data.Approve_Step == 1) {
          this.data.Executor = this.data.Executor.map((d: any) => {
            if (d.name == this.user.name) {
              return {
                ...d,
                status: "Approve",
                Comment: this.comment,
                Last_Apply_Date: moment().format('YYYY/MM/DD HH:mm:ss')
              }
            }
            if (d.name != this.user.name) {
              return {
                ...d,
                Last_Apply_Date: moment().format('YYYY/MM/DD HH:mm:ss')
              }
            }

          })
          this.data.Approve_Status = "Approve"
        }

        if (this.data.Approve_Step == 2) {
          this.data.IT = this.data.IT.map((d: any) => {
            if (d.name == this.user.name) {
              return {
                ...d,
                status: "Approve",
                Comment: this.comment,
                Last_Apply_Date: moment().format('YYYY/MM/DD HH:mm:ss')
              }
            }
            if (d.name != this.user.name) {
              return {
                ...d,
                Last_Apply_Date: moment().format('YYYY/MM/DD HH:mm:ss')
              }
            }
          })
          this.data.Approve_Status = "Approve"
        }

        this.data.Approve_Step++
        this.data.Last_Apply_Date = moment().format('YYYY/MM/DD HH:mm:ss')
        if (this.data.Approve_Step == 3) {
          this.data.Apply_Status = "Complete"
        }
        let update = lastValueFrom(this.api.ApproveUpdate(this.data._id, this.data))

        this.router.navigate(['/Approve']).then((v: any) => {
          window.location.reload()
        })
        //code end
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })

  }


  Approve_no() {
    Swal.fire({
      title: 'Do you want to reject ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start

        console.log(this.data);

        if (this.data.Approve_Step == 1) {
          this.data.Executor = this.data.Executor.map((d: any) => {
            if (d.name == this.user.name) {
              return {
                ...d,
                Comment: this.comment,
                status: "Reject",
                lastUpdate: moment().format()
              }
            }
            if (d.name != this.user.name) {
              return {
                ...d,
              }
            }
          })
          this.data.IT = this.data.IT.map((d: any) => {
            delete d.status
            return {
              ...d,
            }
          })
          this.data.Approve_Status = "reject"
          this.data.Approve_Step = 1
          this.data.Apply_Status = "Reject"
        }

        if (this.data.Approve_Step == 2) {
          this.data.IT = this.data.IT.map((d: any) => {
            if (d.name == this.user.name) {
              return {
                ...d,
                Comment: this.comment,
                status: "Reject",
                lastUpdate: moment().format()
              }
            }
            if (d.name != this.user.name) {
              return {
                ...d,
              }
            }
          })
          this.data.Approve_Status = "reject"
          this.data.Approve_Step = 1
          this.data.Apply_Status = "Reject"
        }
        console.log(this.data);


        let update = lastValueFrom(this.api.ApproveUpdate(this.data._id, this.data))
        this.router.navigate(['/Approve']).then((v: any) => {
          window.location.reload()
        })
        //code end
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })

  }


  async ShowFlowApplied() {
    this.Applicant = this.data
    this.Applicant.code_abbname = this.user.code_abbname
    this.Applicant.code_fullname = this.user.code_fullname
    var format = 'YYYY/MM/DD HH:mm:ss';
    this.Applicant.FromDateNew = moment(this.Applicant.FromDate).format(format)
    this.lastTime = this.data.IT[0]
  }


  checkApproveSuccess() {
    let lastName
    if (this.data.Approve_Status == "reject") {
      lastName = "2"
      this.reject = "reject"
    }

    if (this.data.Approve_Step == 2) {
      let CheckHaveName = this.data.Executor.filter((d: any) => d.name == this.user.name)
      if (CheckHaveName.length > 0) {
        for (const item of this.data.Executor) {
          if (item.status == "Approve") {
            lastName = item.name
          }
        }
      }
    }

    if (this.data.Approve_Step == 3) {
      let CheckHaveName = this.data.IT.filter((d: any) => d.name == this.user.name)
      if (CheckHaveName.length > 0) {
        for (const item of this.data.IT) {
          if (item.status == "Approve") {
            lastName = item.name
          }
        }
      }
    }
    // console.log(lastName);

    if (this.id) {
      this.lastApprove = lastName
    }
    // console.log(this.reject);

    // console.log(this.lastApprove);

    // console.log("🚀 ~ file: approve-form.component.ts:172 ~ ApproveFormComponent ~ oop ~  this.lastApprove:", this.lastApprove)

  }


  async cancel() {
    Swal.fire({
      title: 'Do you want to cancel data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code startAppliedList
        let data = await lastValueFrom(this.api.delDataApprove({ _id: this.data._id }))
        this.router.navigate(['/AppliedList']).then((v: any) => {
        })
        //code end
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })
  }

  edit() {
    this.router.navigate(['/ITAssetTakeout'], {
      relativeTo: this.route,
      queryParams: { id: this.data._id },
      queryParamsHandling: 'merge'
    });
  }



  read() {
    if (this.data.Approve_Step == 1) {
      this.data.Executor = this.data.Executor.map((d: any) => {
        let Read
        if (d.name == this.user.name) {
          Read = "Read"
          return {
            ...d,
            status: Read,
          }
        }
        if (d.name != this.user.name) {
          return {
            ...d,
          }
        }

      })
    }
    if (this.data.Approve_Step == 2) {
      this.data.IT = this.data.IT.map((d: any) => {
        let Read

        if (d.name == this.user.name) {
          Read = "Read"
          return {
            ...d,
            status: Read,
          }
        }
        if (d.name != this.user.name) {
          return {
            ...d,
          }
        }
      })
    }

    let update = lastValueFrom(this.api.ApproveUpdate(this.data._id, this.data))

  }




  ShowComment() {
    if (this.data) {
      for (const item of this.data.Executor) {
        if (item.Comment) {
          this.DataComment.push(item)
        }
      }
      for (const item of this.data.IT) {
        if (item.Comment) {
          this.DataComment.push(item)
        }
      }
    }


  }


  // this.lastApprove && !this.reject"
}
