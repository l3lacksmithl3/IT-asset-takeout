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
  selector: 'app-applied-list',
  templateUrl: './applied-list.component.html',
  styleUrls: ['./applied-list.component.scss']
})


export class AppliedListComponent {

  displayedColumns: string[] = ['1', '2', '3', '4', '5'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  moment: any = moment
  data: any
  inputFilter: any
  dataTable: any
  interval: any;
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
    this.runtime()

    let data_old = ""
    setInterval(async () => {
      let ck = await lastValueFrom(this.api.updateAt())
      if (data_old != ck?.toString()) {
        data_old = ck?.toString()
        this.runtime()
      }
    }, 5000)

  }

  ngOnDestroy(): void { clearInterval(this.interval) }

  async runtime() {
    let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    const condition = {
      "takeout.email": login.email
    };
    let res = await lastValueFrom(this.api.getDataApprove(condition))

    let list = []
    for (const item of res) {
      //return
      if (item.return) {
        for (let index = item.return.count_return; index >= 1; index--) {
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
      //extend
      if (item.extend) {
        for (let index = item.extend.count_extend; index >= 1; index--) {
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

      if (item.takeout) {
        list.push({
          id: item._id,
          ControlID: item.ControlID,
          "Business Model": "IT asset takeout application form",
          Value: item.takeout
        })
      };
    }


    // if (item.return) {
    //   if (item.return?.return_3) {
    //     list.push({
    //       id: item._id,
    //       ControlID: item.ControlID,
    //       "Business Model": "IT asset return",
    //       Value: item.return,
    //       type: 3,
    //       item: item.return?.return_3?.length
    //     })
    //   }
    //   if (item.return?.return_2) {
    //     list.push({
    //       id: item._id,
    //       ControlID: item.ControlID,
    //       "Business Model": "IT asset return",
    //       Value: item.return,
    //       type: 2,
    //       item: item.return?.return_2?.length
    //     })
    //   }
    //   if (item.return?.return_1) {
    //     list.push({
    //       id: item._id,
    //       ControlID: item.ControlID,
    //       "Business Model": "IT asset return",
    //       Value: item.return,
    //       type: 1,
    //       item: item.return?.return_1?.length
    //     })
    //   }
    // };



    this.data = list
    console.log(this.data);


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
        time: time
      }
    })

    // console.log(this.data);

    this.data = this.sort(this.data, "time")
    // element.Value?.Apply_Date






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

      return {
        ...d,
        ApplyStatus: ApplyStatus
      }
    })

    this.data = this.data.filter((d: any) => d.ApplyStatus != 'Reject ')
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


  view(item: any, type: any) {
    // let set1 = localStorage.setItem("IT-asset-takeout-ViewApprove", JSON.stringify(item))
    // let set2 = localStorage.setItem("IT-asset-takeout-ViewApprove-type", JSON.stringify(type))



    if (type["Business Model"] == "IT asset return") {
      this.route.navigate(['/ApproveReturn'], {
        relativeTo: this.router,
        queryParams: { "approve-return": item, "return": type.type }
      });
    }


    if (type["Business Model"] == "IT asset extend") {
      this.route.navigate(['/ApproveExtend'], {
        relativeTo: this.router,
        queryParams: { "approve-extend": item, "extend": type.type }
      });
    }


    if (type["Business Model"] == "IT asset takeout application form") {
      this.route.navigate(['/ApplicationProgress'], {
        relativeTo: this.router,
        queryParams: { view_takeout: item }
      });
      //   this.route.navigate(['/ApplicationProgress']).then((v: any) => {
      // })
    }


    if (type.ApplyStatus == "Reject") {
      this.route.navigate(['/ApplicationProgress'], {
        relativeTo: this.router,
        queryParams: { reject: item }
      });
    }


    // ApplicationProgress
  }


  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return b[key]?.localeCompare(a[key])
    })
    return array
  }



  async getUserIT_SP(sec: any) {
    let data = await lastValueFrom(this.api.MasterUserAll())
    return data.filter((d: any) => d.section == sec)
  }


  async getUserByDepartment(code: any) {
    let data = await lastValueFrom(this.api.MasterUserAll())
    return data.filter((d: any) => d.department == code)
  }


  async getUser(user: any) {
    let data = await lastValueFrom(this.api.MasterUserAll())
    return data.filter((d: any) => d.employee == user)
  }


  async getCode(code: any) {
    let data = await lastValueFrom(this.api.MasterCode())
    return data.filter((d: any) => d.code == code)
  }


  async setITasset() {
    let rew = await lastValueFrom(this.api.getRecord())
    let data = rew[0].Sheet1
    data = data.map((d: any) => {
      for (const key in d) {
        let Old = key
        let New = Old.replaceAll(".", "");
        d[New] = d[Old];
        if (Old != New) {
          delete d[Old];
        }
      }
      return {
        ...d
      }
    })

    let now = {
      "Host Name": "CR19002",
      "IP Address": null,
      "User": null,
      "E-Mail address": null,
      "IN\r\nTER\r\nNET": null,
      "MS365": null,
      "Owner \r\nPosition": null,
      "ORG CD": null,
      "Section": "IT-SP",
      "Div": null,
      "Manufacturer": null,
      "S/N": null,
      "Setup Date": null,
      "Age Year(s)": null,
      "Age Ranking": null,
      "Type": "Camera",
      "CPU Type": null,
      "Memory Type": null,
      "Memory Capacity": null,
      "HDD": null,
      "Office 365": null,
      "Office 1": null,
      "OS Installed": null,
      "No": null,
      "EmpCD": null,
      "Dept": null,
      "Fixed Asset No\r\nor PO No": null,
      "Model Name/Model No": "Canon",
      "searial": null
    }


  }


  filter() {
    // console.log(this.inputFilter);
    let res1 = this.data.filter((d: any) => d["ControlID"].match(new RegExp(this.inputFilter, "i")));
    let res2 = this.data.filter((d: any) => d["Business Model"].match(new RegExp(this.inputFilter, "i")));
    let res3 = this.data.filter((d: any) => d["ApplyStatus"].match(new RegExp(this.inputFilter, "i")));
    let res4 = this.data.filter((d: any) => d["time"].match(new RegExp(this.inputFilter, "i")));

    // ApplyStatus
    // let res3 = this.data.filter((d: any) => d["name"].match(new RegExp(this.inputFilter, "i")));
    // const res3 = this.data.filter((item: any) => {
    //   const regex = new RegExp(this.inputFilter, "i");
    //   return regex.test(item.Value.name);
    // })
    let res = res1.concat(res2).concat(res3).concat(res4);
    this.dataTable = removeDuplicates(res)

    // console.log(this.data);



    // this.dataTable

    function removeDuplicates(arr: any) {
      return arr.filter((item: any,
        index: any) => arr.indexOf(item) === index);
    }


    this.dataSource = new MatTableDataSource(this.dataTable)
    this.dataSource.paginator = this.paginator;
  }

  NavigatorApply() {
    this.route.navigate(['/ITAssetTakeout']).then((v: any) => {
    })
  }



  return(e: any) {
    Swal.close()
    Swal.fire({
      title: `No.${e.ControlID} <br>Do you want to return  ?`,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        await this.recordData(e)

        //code end
        setTimeout(() => {
          Swal.close()
          Swal.fire({
            position: 'center',
            width: 300,
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          })
        }, 200);
      }
    })

  }



  async recordData(e: any) {
    let data = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let IT = await lastValueFrom(this.api.getSectionITBySection({ section: "IT-SP" }))
    let Executor = await lastValueFrom(this.api.getSectionBySection({ section: data.section }))
    let update: any = {}

    update = e
    update.BusinessModel = "IT asset return confirmation"
    update.IT = IT[0].value
    update.Executor = Executor[0].value
    update.Apply_Date = moment().format()
    update.Apply_Status = "Incomplete"
    update.Approve_Step = 1
    update.Approve_Status = "standby"
    update.FromDate = moment().format()
    update.return_date = moment().format()
    let edit = await lastValueFrom(this.api.ApproveUpdate(update._id, { Approve_Step: 4, return_date: moment().format() }))
    if (edit) {
      delete update._id
      delete update.updatedAt
      delete update.createdAt
      let record = await lastValueFrom(this.api.Approve_data(update))
      if (record) {
        // this.sendMail(e, record[0]._id)
        await this.ngOnInit()
      }
    }


  }




  return_asset(i: any, j: any, data: any) {
    let count = i.filter((d: any) => d.return == true)
    if (data == `IT asset return`) {
      return `${j} / ${i.length}`
    } else if (data == `IT asset extend`) {
      return `${j}`
    } else if (data == `IT asset takeout application form`) {
      return `${i.length}`
    } else {
      return ``
    }
  }




}

