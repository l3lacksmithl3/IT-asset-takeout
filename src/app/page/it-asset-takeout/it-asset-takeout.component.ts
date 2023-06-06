import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-it-asset-takeout',
  templateUrl: './it-asset-takeout.component.html',
  styleUrls: ['./it-asset-takeout.component.scss']
})
export class ITAssetTakeoutComponent {

  data: any = {}
  checkRequired: boolean = false
  ControlID: any
  mode: any
  positionName: any
  device: any
  dataShow: any = {}

  BugList: boolean = false

  constructor(
    private api: HttpService,
    private route: Router,
    private routers: ActivatedRoute,
    // private dialog: MatDialogRef<any>,
    // @Inject(MAT_DIALOG_DATA) public data: any,s
    // private api : HttpService
  ) { }

  async ngOnInit(): Promise<void> {

    this.getPosition()
    let loo = await lastValueFrom(this.api.MasterUserAll())
    // console.log(loo);

    this.mode = "normal"
    this.routers.queryParams.subscribe(async res => {
      if (res['id']) {
        this.mode = "edit"
      }
    })






    let data = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let IT = await lastValueFrom(this.api.getSectionITBySection({ section: "IT-SP" }))
    let Executor = await lastValueFrom(this.api.getSectionBySection({ section: data.section }))

    if (this.mode == 'normal') {
      this.data = {
        name: data.name,
        CorpDivDep: this.positionName,
        Reason: null,
        ITassets_1: null,
        ITassetsNo_1: null,
        ITassets_2: null,
        ITassetsNo_2: null,
        ITassets_3: null,
        ITassetsNo_3: null,
        FromDate: moment().format(),
        ToDate: moment().endOf('month').format(),
        SpecialNote: "The maximum application period is 31 days.",
        BusinessModel: "IT asset takeout application form",
        section: data.section,
        IT: IT[0].value,
        Executor: Executor[0].value,
        Request: "Approve",
        Approve_Step: 1,
        Approve_Status: "standby",
        Apply_Status: "Incomplete",
        Apply_Date: moment().format(),
        Last_Apply_Date: moment().format()
      }
    }


    if (this.mode == 'edit') {
      let id = JSON.parse(`${localStorage.getItem("IT-asset-takeout-ViewApprove")}`)
      let res = await lastValueFrom(this.api.getDataApprove({ _id: id }))
      this.data = res[0]
      let data = await lastValueFrom(this.api.getAssetIT())
      this.dataShow.ITassets_1 = data.filter((d: any) => d["Host Name"].match(new RegExp(this.data.ITassetsNo_1, "i")))[0]._id
      this.dataShow.ITassets_2 = data.filter((d: any) => d["Host Name"].match(new RegExp(this.data.ITassetsNo_2, "i")))[0]._id
      this.dataShow.ITassets_3 = data.filter((d: any) => d["Host Name"].match(new RegExp(this.data.ITassetsNo_3, "i")))[0]._id
      delete this.data.createdAt
      delete this.data.updatedAt
    }

    this.updateInput()
    this.Device()



  }


  ChangeFlow() {
    this.route.navigate(['/Setting']).then((v: any) => {
      // window.location.reload()
    })
  }


  updateInput() {
    if (!this.data.name || !this.data.CorpDivDep || !this.data.Reason || !this.data.ITassets_1) {
      this.checkRequired = true
    } else {
      this.checkRequired = false
    }
  }


  apply() {

    for (let key in this.data) {
      if (this.data[key] == '' || this.data[key] == null) {
        delete this.data[key]
      }
    }

    Swal.fire({
      title: 'Do you want to Apply ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start


        let get = await lastValueFrom(this.api.getAllControlID())
        if (get.length == 0) {
          this.ControlID = `IT${moment().format("YYMM")}-0001`
          let setControlIDFirst = await lastValueFrom(this.api.ControlID({ ControlID: this.ControlID }))
        }
        else {
          let num = get[0].ControlID.split("-")[1]
          this.ControlID = `IT${moment().format("YYMM")}-${(Number(num) + 1).toString().padStart(4, '0')}`
          let updata = await lastValueFrom(this.api.UpdateControlID(get[0]._id, { ControlID: this.ControlID }))
        }


        this.data.ControlID = this.ControlID
        let res = lastValueFrom(this.api.Approve_data(this.data))
        // console.log(this.data);


        this.route.navigate(['/AppliedList']).then((v: any) => { })
        //code end
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })

  }


  update() {

    for (let key in this.data) {
      if (this.data[key] == '' || this.data[key] == null) {
        delete this.data[key]
      }
    }

    Swal.fire({
      title: 'Do you want to update ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start

        for (const item of this.data.Executor) {
          delete item.Last_Apply_Date
          delete item.status
          delete item.Comment
        }

        for (const item of this.data.IT) {
          delete item.Last_Apply_Date
          delete item.status
          delete item.Comment
        }

        this.data.ControlID = this.ControlID
        if (this.mode == 'edit') {
          this.data.Approve_Status = "standby"
          this.data.Apply_Status = "Incomplete"
          let res = lastValueFrom(this.api.ApproveUpdate(this.data._id, this.data))

        }
        this.route.navigate(['/AppliedList']).then((v: any) => { })

        //code end
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })

  }


  cancel() {
    this.route.navigate(['/AppliedList']).then((v: any) => {
      window.location.reload()
    })
  }


  async getPosition() {
    const user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let checkUser = await lastValueFrom(this.api.getSectionBySection({ section: user.section }))
    let fullName = ""
    for (const [index, item] of checkUser[0].value.reverse().entries()) {
      fullName += item.code_abbname
      if (index < checkUser[0].value.length - 1) {
        fullName += "-"
      }
    }
    this.positionName = fullName
  }

  async Device() {
    let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let asset = await lastValueFrom(this.api.getAssetIT())
    let MyDevice = asset.filter((d: any) => d.EmpCD == login.employee)
    let DeviceIT = asset.filter((d: any) => (d.Type != "Laptop") && (d.Type != "Desktop"))
    DeviceIT = sort(DeviceIT, "Type")

    this.device = MyDevice.concat(DeviceIT)


    function sort(array: any, key: any) {
      array = array.sort(function (a: any, b: any) {
        return a[key].localeCompare(b[key])
      })
      return array
    }
  }

  dataChange() {
    let data1 = this.device.filter((d: any) => d._id == this.dataShow.ITassets_1)
    if (data1.length > 0) {
      this.data.ITassets_1 = data1[0].Type
      this.data.ITassetsNo_1 = data1[0]["Host Name"].toUpperCase()
    }

    let data2 = this.device.filter((d: any) => d._id == this.dataShow.ITassets_2)
    if (data2.length > 0) {
      this.data.ITassets_2 = data2[0].Type
      this.data.ITassetsNo_2 = data2[0]["Host Name"].toUpperCase()
    }

    let data3 = this.device.filter((d: any) => d._id == this.dataShow.ITassets_3)
    if (data3.length > 0) {
      this.data.ITassets_3 = data3[0].Type
      this.data.ITassetsNo_3 = data3[0]["Host Name"].toUpperCase()
    }
    this.BugList = true
  }



}
