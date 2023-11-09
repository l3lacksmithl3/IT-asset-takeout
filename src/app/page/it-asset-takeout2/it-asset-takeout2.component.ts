import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';
import { lastValueFrom, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-it-asset-takeout2',
  templateUrl: './it-asset-takeout2.component.html',
  styleUrls: ['./it-asset-takeout2.component.scss']
})
export class ItAssetTakeout2Component implements OnInit {


  data: any = {}
  checkRequired: boolean = false
  ControlID: any
  mode: any
  positionName: any
  device: any
  dataShow: any = {}
  dataApply: any
  BugList: boolean = false

  minDate: any
  minDate_fromDate: any
  maxDate: any
  UniqueDevice: any
  show: boolean = true
  text: any
  asset_full: any
  CheckData: any
  employee: any
  asset: any
  parentElement: any
  dataValue: any
  holiday: any
  id: any

  stateForm_1 = new FormGroup({
    stateGroup_1: new FormControl(''),
    stateGroup_2: new FormControl(''),
    stateGroup_3: new FormControl(''),
  })



  stateGroups_1: any[] = []
  stateGroups_2: any[] = []
  stateGroups_3: any[] = []
  stateGroupOptions_1!: Observable<any[]>;
  stateGroupOptions_2!: Observable<any[]>;
  stateGroupOptions_3!: Observable<any[]>;


  constructor(
    private api: HttpService,
    private route: Router,
    private routers: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) { }


  async ngOnInit(): Promise<void> {
    this.asset = await lastValueFrom(this.api.getAssetIT())
    this.holiday = await lastValueFrom(this.api.MasterHoliDay())
    this.ngxService.start()
    this.getPosition()
    this.employee = await lastValueFrom(this.api.MasterUserAll())

    this.minDate = moment().format()
    this.minDate_fromDate = moment().format()
    this.maxDate = moment(this.data.FromDate).add(31, 'days').format()

    this.mode = "normal"
    this.routers.queryParams.subscribe(async res => {
      if (res['id']) {
        this.mode = "edit"
        this.id = res['id']
      }
    })



    let data = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    if (this.mode == 'normal') {
      this.data = {
        full_name: data.full_name,
        name: data.name,
        CorpDivDep: this.positionName,
        email: data.email,
        Reason: null,
        ITassets_1: null,
        ITassetsNo_1: null,
        ITassets_2: null,
        ITassetsNo_2: null,
        ITassets_3: null,
        ITassetsNo_3: null,
        FromDate: moment().format(),
        ToDate: this.setLastDay(moment().endOf('month').format()),
        SpecialNote: "The maximum application period is 31 days.",
        section: data.section,
        Approve_Step: 1,
        level: data.level,
        position_code: data.position_code,
        Apply_Date_Start: moment().format(),
        Apply_Date_Latest: moment().format()
      }
      this.dataValue = {
        takeout: this.data
      }

      // console.log(this.data);

    }


    if (this.mode == 'edit') {
      let dataOld = await lastValueFrom(this.api.getDataApprove({ _id: this.id }))
      if (dataOld[0].takeout) {
        this.data = {
          full_name: data.full_name,
          name: data.name,
          CorpDivDep: this.positionName,
          email: data.email,
          Reason: dataOld[0].takeout.Reason,
          ITassets_1: null,
          ITassetsNo_1: null,
          ITassets_2: null,
          ITassetsNo_2: null,
          ITassets_3: null,
          ITassetsNo_3: null,
          FromDate: moment().format(),
          ToDate: this.setLastDay(moment().endOf('month').format()),
          SpecialNote: "The maximum application period is 31 days.",
          section: data.section,
          Approve_Step: 1,
          level: data.level,
          position_code: data.position_code,
          Apply_Date_Start: moment(dataOld[0].takeout.Apply_Date_Start).format(),
          Apply_Date_Latest: moment().format()
        }
        this.stateForm_1 = new FormGroup({
          stateGroup_1: new FormControl(dataOld[0]?.takeout?.item[0]?.value),
          stateGroup_2: new FormControl(dataOld[0]?.takeout?.item[1]?.value),
          stateGroup_3: new FormControl(dataOld[0]?.takeout?.item[2]?.value),
        })
        this.data.ITassetsNo_1 = dataOld[0]?.takeout?.item[0]?.name
        this.data.ITassetsNo_2 = dataOld[0]?.takeout?.item[1]?.name
        this.data.ITassetsNo_3 = dataOld[0]?.takeout?.item[2]?.name

        this.data.ITassets_1 = dataOld[0]?.takeout?.item[0]?.value
        this.data.ITassets_2 = dataOld[0]?.takeout?.item[1]?.value
        this.data.ITassets_3 = dataOld[0]?.takeout?.item[2]?.value
        this.dataValue = {
          takeout: this.data,
          ControlID: dataOld[0].ControlID
        }
      }


    }



    this.updateInput()
    this.Device()
    // this.check_unavailable("")
  }

  setLastDay(d: any) {
    let day_count: any
    for (let index = 0; index < 10; index++) {
      day_count = moment(d).subtract(index, 'days').format()
      let date = moment(day_count).format().split("T")[0].toString()
      let holiday = this.holiday?.filter((e: any) => e["date"].match(new RegExp(date, "i")));
      let day = moment(day_count).format('dddd')
      if (day != 'Sunday' && holiday.length == 0) {
        break
      }
    }
    return day_count
  }








  ChangeFlow() {
    this.route.navigate(['/Setting']).then((v: any) => {
      // window.location.reload()
    })
  }


  updateInput() {
    setTimeout(async () => {

      if (!this.data.name || !this.data.CorpDivDep || !this.data.Reason || !this.data.ITassets_1) {
        this.checkRequired = true
      } else {
        this.checkRequired = false
      }
      let max = moment(this.data.FromDate).add(31, 'days').format()
      this.minDate = this.data.FromDate
      this.maxDate = moment(max).format()
    }, 200);
    // console.log(this.data.ITassets_1);

  }




  async update_status_asset() {
    let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
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
          status_return: "unavailable",
          status_latest_user: login.name
        }
      })
      let update_asset_item = lastValueFrom(this.api.updateAsset(data[0]?._id, data[0]))
    }


  }

  async update() {
    Swal.fire({
      title: 'Do you want to update data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        this.data.item = []
        if (this.data.ITassets_1 != null) {
          this.data.item.push({
            name: this.data.ITassets_1,
            value: this.data.ITassetsNo_1,
            period: `${moment(this.data.FromDate).format('ll')} - ${moment(this.data.ToDate).format('ll')}`,
            return: false,
            time: moment().format()
          })
        }
        if (this.data.ITassets_2 != null) {
          this.data.item.push({
            name: this.data.ITassets_2,
            value: this.data.ITassetsNo_2,
            period: `${moment(this.data.FromDate).format('ll')} - ${moment(this.data.ToDate).format('ll')}`,
            return: false,
            time: moment().format()
          })
        }
        if (this.data.ITassets_3 != null) {
          this.data.item.push({
            name: this.data.ITassets_3,
            value: this.data.ITassetsNo_3,
            period: `${moment(this.data.FromDate).format('ll')} - ${moment(this.data.ToDate).format('ll')}`,
            return: false,
            time: moment().format()
          })
        }
        delete this.data.ITassets_1
        delete this.data.ITassets_2
        delete this.data.ITassets_3
        delete this.data.ITassetsNo_1
        delete this.data.ITassetsNo_2
        delete this.data.ITassetsNo_3
        delete this.data.ITassetsNo_3

        this.update_status_asset()


        let update = await lastValueFrom(this.api.ApproveUpdate(this.id, this.dataValue))

        let delete_field = await lastValueFrom(this.api.ApproveDelField({}));


        const user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
        let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ organization: `${user.section}` }))
        let approver: any = []
        for (let index = 1 + Number(user.level); index <= 3; index++) {
          let Organ = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [data_organization[0].code[index - 1], Number(data_organization[0].code[index - 1])] } }))
          approver.push(...Organ[0].code_employee)
        }
        if (Number(user.level) == 3) {
          let Organ = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [data_organization[0].code[0], Number(data_organization[0].code[0])] } }))
          approver.push(...Organ[0].code_employee)
        }




        //TODO mail ---------------------------------------------------------------------------------------------------------------------------------------------
        if (update) {
          let mail = this.employee.filter((d: any) => approver.includes(d.employee));
          mail = mail.map((d: any) => {
            return d.email
          })
          let mail_data = {
            _id: this.id,
            requester: this.dataValue?.takeout.name,
            ControlID: this.dataValue?.ControlID,
            asset: this.dataValue?.takeout.item,
            approver: mail
          }
          let Mail_Approve = lastValueFrom(this.api.Mail_Approve_Request(mail_data))
          // console.log(mail_data);

          // let Mail_Approve = lastValueFrom(this.api.Mail_Approve_Request(mail_data))
          // let Mail_Received = lastValueFrom(this.api.Mail_Received_mail(mail_data))
        }

        //code end
        setTimeout(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          }).then(d => {
            this.route.navigate(['/AppliedList']).then((v: any) => { })
          })
        }, 200);
      }
    })



    // console.log(this.dataValue);

    //TODO update and sendmail
  }


  cancel() {
    this.route.navigate(['/AppliedList']).then((v: any) => {
      // window.location.reload()
    })
  }


  async getPosition() {
    const user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ organization: `${user.section}` }))
    this.positionName = `${data_organization[0].organization[0]} / ${data_organization[0].organization[1]} / ${data_organization[0].organization[2]}`
  }






  async Device() {
    let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let asset = await lastValueFrom(this.api.getAssetIT())
    this.CheckData = asset

    let asset_login = await lastValueFrom(this.api.AssetPCGetByID({ "EmpCD": login.employee }))
    let MyDevice = await lastValueFrom(this.api.getAssetByID({ "Host Name": asset_login[0]['Host Name']}))
    // console.log("🚀 ~ file: it-asset-takeout2.component.ts:381 ~ ItAssetTakeout2Component ~ Device ~ MyDevice:", MyDevice)

    let DeviceIT = asset.filter((d: any) => (d.Type != "Laptop") && (d.Type != "Desktop") && (d.Type != "Workstation"))
    DeviceIT = sort(DeviceIT, "Type")
    this.device = MyDevice.concat(DeviceIT)
    // this.device = DeviceIT
    // console.log(DeviceIT);

    this.device = this.device.map((d: any) => { return { ...d, "Host Name": d["Host Name"].toLowerCase() } })

    this.asset_full = asset.filter((d: any) => (d.EmpCD != login.employee) && ((d.Type == "Laptop") || (d.Type == "Desktop") || (d.Type == "Workstation")))
    const unique = [...new Set(this.device.map((item: any) => item.Type))]; // [ 'A', 'B']

    this.UniqueDevice = unique.map((d: any) => {
      let filter = this.device.filter((e: any) => e.Type == d)
      let NewData = filter.map((d: any) => {
        return d["Host Name"]
      })
      let reason = filter.map((d: any) => {
        return d["reason"]
      })
      let blacklist = filter.map((d: any) => {
        return d["blacklist"]
      })
      let status_return = filter.map((d: any) => {
        return d["status_return"]
      })
      return {
        letter: d,
        names: NewData,
        reason: reason,
        blacklist: blacklist,
        status_return: status_return
      }
    })


    const unique_2 = [...new Set(this.asset_full.map((item: any) => item.Type))]; // [ 'A', 'B']
    ;

    this.asset_full = unique_2.map((d: any) => {
      let filter = this.asset_full.filter((e: any) => e.Type == d)
      let NewData = filter.map((d: any) => {
        return d["Host Name"]
      })
      let reason = filter.map((d: any) => {
        return d["reason"]
      })
      let blacklist = filter.map((d: any) => {
        return d["blacklist"]
      })
      let status_return = filter.map((d: any) => {
        return d["status_return"]
      })
      return {
        letter: d,
        names: NewData,
        reason: reason,
        blacklist: blacklist,
        status_return: status_return
      }
    })


    this.stateGroups_1 = this.UniqueDevice.concat(this.asset_full)



    this.stateGroupOptions_1 = this.stateForm_1.get('stateGroup_1')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup_1(value || '')),
    );

    this.stateGroupOptions_2 = this.stateForm_1.get('stateGroup_2')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup_1(value || '')),
    );

    this.stateGroupOptions_3 = this.stateForm_1.get('stateGroup_3')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup_1(value || '')),
    );



    // }


    function sort(array: any, key: any) {
      array = array.sort(function (a: any, b: any) {
        return a[key].localeCompare(b[key])
      })
      return array
    }

    if (asset.length != 0) {
      // Swal.close()
      // setTimeout(() => {
      this.show = false
      this.ngxService.stop()
      // }, 500);
    }
  }


  private _filterGroup_1(value: string): StateGroup_1[] {
    // // console.log(this.data.ITassetsNo_1 );
    // console.log(this.stateForm_1.get('stateGroup_1')?.value);
    // console.log(this.stateForm_1.get('stateGroup_2')?.value);

    if (this.data.ITassetsNo_1 != this.stateForm_1.get('stateGroup_1')?.value) {
      for (let group of this.stateGroups_1) {
        const index = group.names.indexOf(this.data.ITassetsNo_1?.toLowerCase());
        if (index !== -1) {
          group.blacklist[index] = 'F';
        }
      }
      this.data.ITassets_1 = null
      this.data.ITassetsNo_1 = null
    }

    if (this.data.ITassetsNo_2 != this.stateForm_1.get('stateGroup_2')?.value) {
      for (let group of this.stateGroups_1) {
        const index = group.names.indexOf(this.data.ITassetsNo_2?.toLowerCase());
        if (index !== -1) {
          group.blacklist[index] = 'F';
        }
      }
      this.data.ITassets_2 = null
      this.data.ITassetsNo_2 = null
    }

    if (this.data.ITassetsNo_3 != this.stateForm_1.get('stateGroup_3')?.value) {
      for (let group of this.stateGroups_1) {
        const index = group.names.indexOf(this.data.ITassetsNo_3?.toLowerCase());
        if (index !== -1) {
          group.blacklist[index] = 'F';
        }
      }
      this.data.ITassets_3 = null
      this.data.ITassetsNo_3 = null
    }

    if (value) {
      // console.log(value);
      // console.log(this.stateGroups_1
      //   .map(group => ({
      //     ...group,
      //     letter: group.letter,
      //     names: _filter_1(group.names, value.toLowerCase()),
      //     status_return: converse(value.toLowerCase(), group.names,group.status_return),
      //     reason: converse(value.toLowerCase(), group.names,group.reason),
      //     blacklist: converse(value.toLowerCase(), group.names,group.blacklist),
      //   }))
      //   .filter(group => group.names.length > 0));
      return this.stateGroups_1
        .map(group => ({
          ...group,
          letter: group.letter,
          names: _filter_1(group.names, value.toLowerCase()),
          status_return: converse(value.toLowerCase(), group.names,group.status_return),
          reason: converse(value.toLowerCase(), group.names,group.reason),
          blacklist: converse(value.toLowerCase(), group.names,group.blacklist),
        }))
        .filter(group => group.names.length > 0);
    }
    return this.stateGroups_1;

    function converse(value: any, group: any ,list:any) {
      const filteredIndices = group.map((name:any, index:any) => name.includes(value) ? index.toString() : null).filter((index:any) => index !== null)
      let index = filteredIndices.map((d: any) => list[+d])
      return index
    }
  }





  dataChange() {
    setTimeout(() => {
      let data1 = this.CheckData.filter((d: any) => d["Host Name"] == this.stateForm_1.value.stateGroup_1?.toLowerCase() || d["Host Name"] == this.stateForm_1.value.stateGroup_1?.toUpperCase())
      if (data1.length > 0) {
        this.data.ITassets_1 = data1[0].Type.toUpperCase()
        this.data.ITassetsNo_1 = data1[0]["Host Name"].toUpperCase()
      }

      let data2 = this.CheckData.filter((d: any) => d["Host Name"] == this.stateForm_1.value.stateGroup_2?.toLowerCase() || d["Host Name"] == this.stateForm_1.value.stateGroup_2?.toUpperCase())
      if (data2.length > 0) {
        this.data.ITassets_2 = data2[0].Type.toUpperCase()
        this.data.ITassetsNo_2 = data2[0]["Host Name"].toUpperCase()
      }

      let data3 = this.CheckData.filter((d: any) => d["Host Name"] == this.stateForm_1.value.stateGroup_3?.toLowerCase() || d["Host Name"] == this.stateForm_1.value.stateGroup_3?.toUpperCase())
      if (data3.length > 0) {
        this.data.ITassets_3 = data3[0].Type.toUpperCase()
        this.data.ITassetsNo_3 = data3[0]["Host Name"].toUpperCase()
      }

    }, 200);

    this.BugList = true
  }


  check_empty() {

    if (this.data.ITassetsNo_1 != this.stateForm_1.value.stateGroup_1) {
      for (let group of this.stateGroups_1) {
        const index = group.names.indexOf(this.data.ITassetsNo_1?.toLowerCase());
        if (index !== -1) {
          group.blacklist[index] = 'F';
        }
      }
      this.data.ITassets_1 = null
      this.data.ITassetsNo_1 = null
    }

    if (this.data.ITassetsNo_2 != this.stateForm_1.value.stateGroup_2) {
      for (let group of this.stateGroups_1) {
        const index = group.names.indexOf(this.data.ITassetsNo_2?.toLowerCase());
        if (index !== -1) {
          group.blacklist[index] = 'F';
        }
      }
      this.data.ITassets_2 = null
      this.data.ITassetsNo_2 = null
    }

    if (this.data.ITassetsNo_3 != this.stateForm_1.value.stateGroup_3) {
      for (let group of this.stateGroups_1) {
        const index = group.names.indexOf(this.data.ITassetsNo_3?.toLowerCase());
        if (index !== -1) {
          group.blacklist[index] = 'F';
        }
      }
      this.data.ITassets_3 = null
      this.data.ITassetsNo_3 = null
    }


    if (this.stateForm_1.value.stateGroup_1 == "") {
      for (let group of this.stateGroups_1) {
        const index = group.names.indexOf(this.data.ITassetsNo_1?.toLowerCase());
        if (index !== -1) {
          group.blacklist[index] = 'F';
        }
      }
      this.data.ITassets_1 = null
      this.data.ITassetsNo_1 = null
      this.updateInput()
      this.stateGroups_1 = this.UniqueDevice.concat(this.asset_full)
    }

    if (this.stateForm_1.value.stateGroup_2 == "") {
      for (let group of this.stateGroups_1) {
        const index = group.names.indexOf(this.data.ITassetsNo_2?.toLowerCase());
        if (index !== -1) {
          group.blacklist[index] = 'F';
        }
      }
      this.data.ITassets_2 = null
      this.data.ITassetsNo_2 = null
      this.updateInput()
    }

    if (this.stateForm_1.value.stateGroup_3 == "") {
      for (let group of this.stateGroups_1) {
        const index = group.names.indexOf(this.data.ITassetsNo_3?.toLowerCase());
        if (index !== -1) {
          group.blacklist[index] = 'F';
        }
      }
      this.data.ITassets_3 = null
      this.data.ITassetsNo_3 = null
      this.updateInput()
    }

  }


  selected(e: any) {
    for (let group of this.stateGroups_1) {
      const index = group.names.indexOf(e);
      if (index !== -1) {
        group.blacklist[index] = 'Z';
      }
    }
  }


  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    let date = moment(d).format().split("T")[0].toString()
    let holiday = this.holiday?.filter((e: any) => e["date"].match(new RegExp(date, "i")));
    return holiday?.length == 0 && day !== 0
  };


  apply() {
    Swal.close()
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

        this.dataValue.ControlID = this.ControlID
        this.data.item = []
        if (this.data.ITassets_1 != null) {
          this.data.item.push({
            name: this.data.ITassets_1,
            value: this.data.ITassetsNo_1,
            period: `${moment(this.data.FromDate).format('ll')} - ${moment(this.data.ToDate).format('ll')}`,
            return: false,
            time: moment().format()
          })
        }
        if (this.data.ITassets_2 != null) {
          this.data.item.push({
            name: this.data.ITassets_2,
            value: this.data.ITassetsNo_2,
            period: `${moment(this.data.FromDate).format('ll')} - ${moment(this.data.ToDate).format('ll')}`,
            return: false,
            time: moment().format()
          })
        }
        if (this.data.ITassets_3 != null) {
          this.data.item.push({
            name: this.data.ITassets_3,
            value: this.data.ITassetsNo_3,
            period: `${moment(this.data.FromDate).format('ll')} - ${moment(this.data.ToDate).format('ll')}`,
            return: false,
            time: moment().format()
          })
        }
        delete this.data.ITassets_1
        delete this.data.ITassets_2
        delete this.data.ITassets_3
        delete this.data.ITassetsNo_1
        delete this.data.ITassetsNo_2
        delete this.data.ITassetsNo_3
        //TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO
        this.update_status_asset()
        // console.log(this.dataValue);

        const user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
        let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ organization: `${user.section}` }))
        let approver: any = []

        if (Number(user.level) == 1) {
          for (let index = 2; index >= 1; index--) { // 1
            let Organ = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [data_organization[0].code[index], Number(data_organization[0].code[index])] } }))
            approver.push(...Organ[0].code_employee)
          }
        }


        if (Number(user.level) == 2) {
          let Organ = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [data_organization[0].code[1], Number(data_organization[0].code[1])] } }))
          approver.push(...Organ[0].code_employee)
        }


        if (Number(user.level) == 3) {
          let Organ = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [data_organization[0].code[0], Number(data_organization[0].code[0])] } }))
          approver.push(...Organ[0].code_employee)
        }

        if (Number(user.level) == 4) {
          const takeoutCopy = { ...this.dataValue.takeout };
          takeoutCopy.Approve_Step = 1
          this.dataValue.return = takeoutCopy;
          this.dataValue.takeout.Approve_Step = 2
        }

        // console.log(approver);


        //TODO sand data and mail -----------------------------------------------------------------------------------------------------------------------------//
        this.dataApply = await lastValueFrom(this.api.Approve_data(this.dataValue))
        if (Number(user.level) == 4) {
          this.sendMail(this.dataApply[0]._id, this.dataValue)
        }
        if (this.dataApply && user.level < 4) {
          let mail = this.employee.filter((d: any) => approver.includes(d.employee));
          mail = mail.map((d: any) => {
            return d.email
          })
          let mail_data = {
            _id: this.dataApply[0]?._id,
            requester: this.dataApply[0]?.takeout.name,
            ControlID: this.dataApply[0]?.ControlID,
            User: user,
            approver: mail,
            asset: this.dataApply[0]?.takeout.item,
          }
          let Mail_Approve = lastValueFrom(this.api.Mail_Approve_Request(mail_data))
        }

        //code end
        setTimeout(() => {
          Swal.close()
          Swal.fire({
            title: 'Success',
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          }).then(v => {
            this.route.navigate(['/AppliedList']).then((v: any) => { })
          })
        }, 200);
      }
    })

  }


  async sendMail(id: any, data: any) {
    let mail_data = {
      _id: id,
      requester: data?.takeout.name,
      ControlID: data?.ControlID,
      requester_mail: data?.takeout.email,
      asset: data?.takeout.item
    }
    let Mail_Takeout_success = lastValueFrom(this.api.Takeout_success(mail_data))
  }



  // check_unavailable(e:any){
  //   let item = this.asset.filter((d: any) => d["Host Name"].match(new RegExp(e, "i")));
  //   if (item.length && item[0].status_return == "unavailable") {
  //     return true
  //   }else{
  //     return false
  //   }
  // }




  // removesadsad(){
  //   console.log(this.data);
  //   console.log(this.stateForm_1.value.stateGroup_1);
  //   console.log(this.stateForm_1.value.stateGroup_2);
  //   console.log(this.stateForm_1.value.stateGroup_3);

  // }
}


//end code --------------------------------------------------------------------------------------------------------------------------------------------------- end code//































export interface StateGroup_1 {
  letter: string;
  names: string[];
}
export interface StateGroup_2 {
  letter: string;
  names: string[];
}

export interface StateGroup_3 {
  letter: string;
  names: string[];
}

export const _filter_1 = (opt: string[], value: string): string[] => {
  const filterValue = value?.toLowerCase();
  return opt.filter(item => item?.toLowerCase().includes(filterValue));
};


export const _filter_2 = (opt: string[], value: string): string[] => {
  const filterValue = value?.toLowerCase();
  return opt.filter(item => item?.toLowerCase().includes(filterValue));
};



