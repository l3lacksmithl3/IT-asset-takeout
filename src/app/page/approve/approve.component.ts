import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from "ngx-ui-loader";


@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent {
  moment: any = moment;
  interval: any;
  displayedColumns: string[] = ['1', '2', '3', '4', '5'];
  dataSource = new MatTableDataSource
  user: any
  data: any[] = []
  show: boolean = true
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  constructor(
    private api: HttpService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute,
    // private dialog: MatDialogRef<any>,
    // @Inject(MAT_DIALOG_DATA) public data: any,s

  ) { }


  async ngOnInit(): Promise<void> {

    this.ngxService.start()
    // this.loading()
    this.run()
    let data_old = ""
    setInterval(async () => {
      let ck = await lastValueFrom(this.api.updateAt())
      if (data_old != ck.toString()) {
        data_old = ck.toString()
        this.run()
      }
    }, 5000)

  }

  ngOnDestroy(): void { clearInterval(this.interval) }

  async run() {
    this.data = []
    let job_req = []
    let listApprove = []

    this.user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ code: { $in: [`${this.user.position_code}`, Number(this.user.position_code)] } }))
    let NewFormate = data_organization.map((d: any) => {
      return d.code
    })

    let result
    let flattenedData
    let level = 1
    if (this.user.level == 4) {
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
      if (typeof e == 'string') {
        return e
      }else{
        return JSON.stringify(e)
      }
    })

    //console.log(result);

    let filter = {
      $or: [
        { 'takeout.position_code': { $in: result }, "takeout.Approve_Step": 1 },
        { 'return.position_code': { $in: result }, "return.Approve_Step": 1 }
      ]
    }

    let rew = await lastValueFrom(this.api.getDataApprove(filter))
    //console.log(rew);



    let list = []
    for (const item of rew) {
      if (item.return) {

        //return
        if (item.return) {
          for (let index = item.return.count_return; index >= 1; index--) {
            if (item.return[`return_${index}`] && !item.return[`return_${index}`]?.some((e: any) => e.Approve_employee != undefined)) {
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

        //extend
        if (item.extend) {
          for (let index = item.extend.count_extend; index >= 1; index--) {
            if (item.extend[`extend_${index}`] && !item.extend[`extend_${index}`]?.some((e: any) => e.Approve_employee != undefined)) {
              list.push({
                id: item._id,
                ControlID: item.ControlID,
                "Business Model": "IT asset extend",
                Value: item.extend,
                type: index,
                item: item.extend[`return_${index}`]?.length
              })
            }
          }
        }



        // if (item.return?.return_3 && !item.return?.return_3?.some((e:any)=>e.Approve_employee != undefined)) {
        //   list.push({
        //     id: item._id,
        //     ControlID: item.ControlID,
        //     "Business Model": "IT asset return",
        //     Value: item.return,
        //     type: 3,
        //     item: item.return?.return_3?.length
        //   })
        // }
        // if (item.return?.return_2 && !item.return?.return_2?.some((e:any)=>e.Approve_employee != undefined)) {
        //   list.push({
        //     id: item._id,
        //     ControlID: item.ControlID,
        //     "Business Model": "IT asset return",
        //     Value: item.return,
        //     type: 2,
        //     item: item.return?.return_2?.length
        //   })
        // }
        // if (item.return?.return_1 && !item.return?.return_1?.some((e:any)=>e.Approve_employee != undefined)) {
        //   list.push({
        //     id: item._id,
        //     ControlID: item.ControlID,
        //     "Business Model": "IT asset return",
        //     Value: item.return,
        //     type: 1,
        //     item: item.return?.return_1?.length
        //   })
        // }




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
    // console.log(list);
    list = list.filter((d: any) => d.Value.Approve_Step == 1)
    rew = list.map((e: any) => {
      return {
        ...e,
        Request: "Approve",
        Applicant: e.Value.name
      }
    })


    // rew = rew.map((e: any) => {
    //   console.log(e);
    //   let label
    //   if (e.takeout.Approve_Step == 1 || e.takeout.Approve_Step == 2) { label = "IT asset takeout application form" }
    //   if (e.return.Approve_Step == 1 || e.return.Approve_Step == 2) { label = "IT asset return" }
    //   return {
    //     ...e,
    //     BusinessModel: label,
    //     Request: "Approve",
    //     Applicant: e.takeout.name
    //   }
    // })



    // console.log(rew);
    this.data = rew
    //console.log(this.data);

    this.data = this.sort(this.data, "ControlID")
    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.paginator = this.paginator;
    this.ngxService.stop()
    this.show = false
  }

  view(item: any) {
    //console.log(item);

    let params
    if (item.BusinessModel == "IT asset takeout application form") {
      params = { mode: item.Approve_Step };
    }
    if (item.BusinessModel == "IT asset return") {
      params = { mode: item.Approve_Step };
    }

    // this.route.navigate(['/ApproveFormConfirm']).then((v: any) => {
    //   // window.location.reload()
    // })
    let set1 = localStorage.setItem("IT-asset-takeout-ViewApprove", JSON.stringify(item.id))
    //console.log(item.BusinessModel);
    //console.log();

    if (item["Business Model"] == "IT asset takeout application form") {
      this.router.navigate(['/ApproveFormConfirm'], {
        relativeTo: this.route,
        queryParams: { approve: item.id }
      });
    }

    if (item["Business Model"] == "IT asset return") {
      this.router.navigate(['/ApproveReturn'], {
        relativeTo: this.route,
        queryParams: { "approve-return": item.id, "return": item.type }
      });
    }

    if (item["Business Model"] == "IT asset extend") {
      this.router.navigate(['/ApproveExtend'], {
        relativeTo: this.route,
        queryParams: { "approve-extend": item.id, "extend": item.type }
      });
    }
  }

  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return b[key].localeCompare(a[key])
    })
    return array
  }



}
