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
  selector: 'app-approved-history',
  templateUrl: './approved-history.component.html',
  styleUrls: ['./approved-history.component.scss']
})
export class ApprovedHistoryComponent {

  moment: any = moment
  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  data: any = []
  user: any
  inputFilter: any
  dataTable: any
  show: boolean = true
  constructor(
    private api: HttpService,
    private route: Router,
    private ngxService: NgxUiLoaderService,
    private router: ActivatedRoute
    // private dialog: MatDialogRef<any>,
    // @Inject(MAT_DIALOG_DATA) public data: any,s
  ) { }



  async ngOnInit(): Promise<void> {

    this.ngxService.start()
    this.user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ code: `${this.user.position_code}` }))
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

    // console.log(NewFormate);
    // console.log(result);
    // console.log(this.user);


    let filter = {
      $or: [
        { "takeout.Approve_employee": this.user.employee, "takeout.Approve_Step": 2 },
        { "return.return_1.Approve_employee": this.user.employee },
        { "return.return_2.Approve_employee": this.user.employee },
        { "return.return_3.Approve_employee": this.user.employee },
      ]
    }

    for (let i = 1; i <= 50; i++) {
      const extendKey = `extend.extend_${i}.Approve_employee`;
      const extendCondition: any = { [extendKey]: this.user.employee };
      filter.$or.push(extendCondition);
    }

    let rew = await lastValueFrom(this.api.getDataApprove(filter))
    // console.log(rew);



    // console.log(rew);



    let list = []
    for (const item of rew) {
      if (item.return) {


        //return
        if (item.return) {
          for (let index = item.return.count_return; index >= 1; index--) {
            if (item.return[`return_${index}`]?.some((d: any) => d.Approve_employee == this.user.employee)) {
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

        //return
        if (item.extend) {
          for (let index = item.extend.count_extend; index >= 1; index--) {
            if (item.extend[`extend_${index}`]?.some((d: any) => d.Approve_employee == this.user.employee)) {
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
        }


      };
      if (item.takeout && item.takeout.Approve_employee == this.user.employee && item.takeout.Approve_Step == 2) {
        list.push({
          id: item._id,
          ControlID: item.ControlID,
          "Business Model": "IT asset takeout application form",
          Value: item.takeout,
          item: item.takeout?.item?.length
        })
      };
    }

    // console.log(list);

    this.data = list
    this.data = this.data.map((d: any) => {
      let time
      if (d.type) {
        if (d['Business Model'] == 'IT asset return') {
          time = d.Value[`return_${d.type}`][0].time
        }
        if (d['Business Model'] == 'IT asset extend') {
          time = d.Value[`extend_${d.type}`][0].time
        }
      } else {
        time = d.Value.Apply_Date_Start
      }
      return {
        ...d,
        Apply_Date: time,
        Request: "Approve",
      }
    })

    //bypass
    this.data = this.data.map((d: any) => {

      let ApplyStatus = "Incomplete"
      if (d.Value.Approve_Step >= 2) {
        ApplyStatus = "Complete"
      }
      if (d.Value.Approve_Step == 0) {
        ApplyStatus = "Reject"
      }

      if (d.type) {
        let item_return = d?.Value[`return_${d.type}`]?.filter((d: any) => d?.Approve_employee != undefined)
        if (item_return?.length > 0) {
          ApplyStatus = "Complete"
        }

        let item_extend = d?.Value[`extend_${d.type}`]?.filter((d: any) => d?.Approve_employee != undefined)
        if (item_extend?.length > 0) {
          ApplyStatus = "Complete"
        }

        if (d?.Value[`extend_${d.type}`]?.some((e: any) => e.reason)) {
          ApplyStatus = "Reject "
        }
      }
      let Approve_status = "Approve"
      if (ApplyStatus == "Reject ") { Approve_status = ApplyStatus }
      return {
        ...d,
        Request: Approve_status
      }
    })

    //time sort
    // console.log(this.data);



    this.data = this.sort(this.data, "Apply_Date")
    this.dataTable = this.data
    this.dataSource = new MatTableDataSource(this.dataTable)

    this.dataSource.paginator = this.paginator;
    if (this.dataTable.length >= 0) {
      // setTimeout(() => {
      this.show = false
      this.ngxService.stop()
      // }, 1000);
    }
  }


  view(item: any) {
    // console.log(item);


    if (item["Business Model"] == "IT asset return") {
      this.route.navigate(['/ApproveReturn'], {
        relativeTo: this.router,
        queryParams: { "approve-return": item.id, "return": item.type }
      });
    }


    if (item["Business Model"] == "IT asset extend") {
      this.route.navigate(['/ApproveExtend'], {
        relativeTo: this.router,
        queryParams: { "approve-extend": item.id, "extend": item.type }
      });
    }


    if (item["Business Model"] == "IT asset takeout application form") {
      this.route.navigate(['/ApplicationProgress'], {
        relativeTo: this.router,
        queryParams: { view_takeout: item.id }
      });
    }
  }


  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return b[key]?.localeCompare(a[key])
    })
    return array
  }



  filter() {
    // console.log(this.inputFilter);
    let res1 = this.data.filter((d: any) => d["ControlID"].match(new RegExp(this.inputFilter, "i")));
    let res2 = this.data.filter((d: any) => d["Business Model"].match(new RegExp(this.inputFilter, "i")));
    // let res3 = this.data.filter((d: any) => d["Business Model"].match(new RegExp(this.inputFilter, "i")));
    const res3 = this.data.filter((item: any) => {
      const regex = new RegExp(this.inputFilter, "i");
      return regex.test(item.Value.name);
    });
    let res4 = this.data.filter((d: any) => d["Request"].match(new RegExp(this.inputFilter, "i")));


    let res = res1.concat(res2).concat(res3).concat(res4)
    this.dataTable = removeDuplicates(res)


    function removeDuplicates(arr: any) {
      return arr.filter((item: any,
        index: any) => arr.indexOf(item) === index);
    }
    this.dataSource = new MatTableDataSource(this.dataTable)
    this.dataSource.paginator = this.paginator;
  }

  // loading() {
  //   Swal.fire({
  //     allowOutsideClick: false,
  //     width: 200,
  //     title: 'Loading...',
  //     didOpen: () => {
  //       Swal.showLoading()
  //     },
  //   })

  //   setTimeout(() => {

  //       Swal.close()
  //       this.show = false

  //   }, 500);
  // }

}
