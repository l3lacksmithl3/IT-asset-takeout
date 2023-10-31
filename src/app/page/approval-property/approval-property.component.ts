import { HttpService } from 'src/app/service/http.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-approval-property',
  templateUrl: './approval-property.component.html',
  styleUrls: ['./approval-property.component.scss']
})



export class ApprovalPropertyComponent {
  Post: any[] = []
  Position: any[] = []
  input: any = {}
  dataNew: any = {}
  data22: any
  return: any
  DataBase :any

  constructor(
    private api: HttpService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private api : HttpService
  ) { }




  async ngOnInit(): Promise<void> {
    // this.AutoSetFlow()
    this.dataNew.name = this.data.name
    this.dataNew.section = this.data.section
    this.dataNew.position = this.data.user_tpye
    this.Post = [this.data.section]
    this.Position = [{ user_tpye: this.data.user_tpye }]

    this.DataBase = await lastValueFrom(this.api.MasterUserAll())
    this.DataBase = this.DataBase.filter((d:any) => d.user_tpye != "" && d.user_tpye != undefined && d.user_tpye != "Requester")
    let unique = [...new Set(this.DataBase.map((item: any) => item.section))]; // [ 'A', 'B']
    unique = unique.sort()
    this.Post = unique.filter((d:any)=>d != "Admin")

  }

  async debug() {

    let data = this.DataBase.filter((d:any) => d.section == this.dataNew.section)
    this.Position = data
    let name = data.filter((d:any) => d.user_tpye == this.dataNew.position)
    this.dataNew.name = name[0]?.name
    this.return = name
  }

  confirm() {
    this.dialog.close(this.return[0])
  }



  async getUserByDepartment(code: any) {
    let data = await lastValueFrom(this.api.MasterUserAll())
    //console.log(data);

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




  async AutoSetFlow() {
    const user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let checkUser = await lastValueFrom(this.api.getSectionBySection({ section: user.section }))
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
        //console.log("asdasdasdasd");

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
    this.Post = [user.section]
    this.Position = list



  }
}
