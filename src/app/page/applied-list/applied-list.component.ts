import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-applied-list',
  templateUrl: './applied-list.component.html',
  styleUrls: ['./applied-list.component.scss']
})


export class AppliedListComponent {

  displayedColumns: string[] = ['1', '2', '3', '4', '5'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  data: any

  constructor(
    private api: HttpService,
    private route: Router,
    // private dialog: MatDialogRef<any>,
    // @Inject(MAT_DIALOG_DATA) public data: any,s

  ) { }

  async ngOnInit(): Promise<void> {
    this.AutoSetFlow()
    this.AutoSetITFlow()
    let dateRaw = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let res = await lastValueFrom(this.api.getDataApprove({ name: dateRaw.name }))
    this.data = res

    this.data = this.data.map((d: any) => {
      var format = 'YYYY/MM/DD';
      let NewDate = moment(d.Apply_Date).format(format)
      return {
        ...d,
        Apply_Date: NewDate
      }
    })

    this.data = this.sort(this.data, "createdAt")
    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.paginator = this.paginator;
    // this.setITasset()
  }


  view(item: any) {
    // console.log(item);
    console.log(item);
    let set1 = localStorage.setItem("IT-asset-takeout-ViewApprove", JSON.stringify(item))
    // let set2 = localStorage.setItem("IT-asset-takeout-ApproveConfirm", JSON.stringify(item))

    this.route.navigate(['/ApplicationProgress']).then((v: any) => {
    })
    // ApplicationProgress
  }


  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return b[key].localeCompare(a[key])
    })
    return array
  }


  async AutoSetFlow() {
    const user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let checkUser = await lastValueFrom(this.api.getSectionBySection({ section: user.section }))
    if (checkUser.length == 0) {
      let j = 5
      let degree = "000000"
      let list = []
      for (let i = 3; i > 1; i--) {
        let name = await this.getUser(user.employee)
        let code = name[0].department.slice(0, i) + degree.slice(0, 5 - i)
        let Department = await this.getUserByDepartment(code)
        let status = await this.getCode(code)
        for (const item of Department) {
          item.code_abbname = status[0].code_abbname
          item.code_fullname = status[0].code_fullname
          list.push(item)
        }
      }

      let lastSection = list[list.length - 1].code_abbname
      console.log(lastSection);

      switch (lastSection) {
        case "GA":
          Corporate("Takashi Okunosono", "takashi-okunosono@kyocera.co.th", "ADT")
          break;
        case "BS":
          Corporate("Takashi Okunosono", "takashi-okunosono@kyocera.co.th", "ADT")
          break;
        case "PU":
          Corporate("Takashi Okunosono", "takashi-okunosono@kyocera.co.th", "ADT")
          break;
        case "DS PD":
          Corporate("Yoshio Miyazaki", "yoshio-miyazaki@kyocera.co.th", "DST")
          break;
        case "TE":
          Corporate("Yoshio Miyazaki", "yoshio-miyazaki@kyocera.co.th", "DST")
          break;
        case "DS QA":
          Corporate("Yoshio Miyazaki", "yoshio-miyazaki@kyocera.co.th", "AMT")
          break;
        case "AMT PD":
          Corporate("Yuji Sakakibara", "yuji-sakakibara@kyocera.co.th", "AMT")
          break;
        case "AMT QA":
          console.log("asdasdasdasd");

          Corporate("Yuji Sakakibara", "yuji-sakakibara@kyocera.co.th", "AMT")
          break;

        default:
          break;
      }
      //

      function Corporate(name: any, email: any, section: any) {
        let data = {
          "_id": "",
          "code_abbname": section,
          "code_fullname": "Corporate Business Administration DivCorp. Div Head",
          "user_id": "",
          "password": "",
          "name": name,
          "email": email,
          "employee": "",
          "section": section,
          "department": "",
          "user_tpye": "Corp. Div Head",
          "subdivision": [],
          "confirmationType": 0,
          "__v": 0
        }
        list.push(data)
      }


      let data = {
        section: user.section,
        value: list
      }
      let MasterSection = lastValueFrom(this.api.AddMasterSection(data))
      // AddMasterSection()
    }

  }


  async AutoSetITFlow() {
    let ch = await lastValueFrom(this.api.getSectionITBySection({ section: "IT-SP" }))
    if (ch.length == 0) {
      let code = await this.getCode("13410")
      let data = await this.getUserIT_SP("IT-SP")
      console.log(data);

      data = data.map((d: any) => {
        return {
          ...d,
          code_abbname: code[0].code_abbname,
          code_fullname: code[0].code_fullname,
        }
      })
      let res = {
        section: "IT-SP",
        value: data
      }
      let add = lastValueFrom(this.api.AddMasterIT(res))
    }

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
      "searial":null
    }

    // let res = lastValueFrom(this.api.addAsset(now))
    // for (const iterator of data) {
      // let res = lastValueFrom(this.api.addAsset(iterator))

    // }

    // console.log("🚀 ~ file: applied-list.component.ts:215 ~ AppliedListComponent ~ setITasset ~ data[0]:", data)

    // console.log(data);



  }
}
