import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-it-asset-return',
  templateUrl: './it-asset-return.component.html',
  styleUrls: ['./it-asset-return.component.scss']
})
export class ItAssetReturnComponent {
  monthPickerValue: any = new Date()
  moment: any = moment;

  data: any = {}
  dataList: any
  show: boolean = true
  take_out_no: any
  check_action: boolean = false
  mode: any = 0
  holiday: any
  item_extend: any = []
  employee: any

  date_select: any = {}

  last_item: any = []
  extend_item: any = []
  positionName:any
  temp_extend : any

  constructor(
    private api: HttpService,
    private route: Router,
    private routers: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) { }

  async ngOnInit(): Promise<void> {
    this.ngxService.start();
    this.getPosition()
    this.employee = await lastValueFrom(this.api.MasterUserAll())
    this.setData()
    this.holiday = await lastValueFrom(this.api.MasterHoliDay())
  }


  //set data
  async setData() {
    let data = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)

    this.data = {
      name: data.full_name,
      CorpDivDep: this.positionName,
    }
    console.log(this.positionName);


    let list = {
      "takeout.name": data.name,
      "takeout.Approve_Step": 2,
      "return.Approve_Step": 1
    }


    this.dataList = await lastValueFrom(this.api.getDataApprove(list))
    // console.log("🚀 ~ file: it-asset-return.component.ts:70 ~ ItAssetReturnComponent ~ setData ~  this.dataList:",  this.dataList)


    this.dataList = this.sort(this.dataList, "ControlID")


    if (data) {
      // setTimeout(() => {
      this.ngxService.stop()
      this.show = false
      // }, 1000);
    }

  }


  update() {
    let data = this.dataList.filter((e: any) => e.ControlID == this.take_out_no)
    if (data[0]?.return) {
      for (const items of data[0]?.return?.item) {
        if (items.return_success_1) {
          items.return_success_2 = true
        } else {
          items.return_success_2 = false
        }
      }
    }


  }


  async dataChange() {
    // this.setData()
    setTimeout(() => {
      let data: any = this.dataList.filter((e: any) => e.ControlID == this.take_out_no)

      this.mode = 0
      if (data[0]?.return) { this.mode = 1 }
      this.data.id = data[0]?._id
      this.data.old_data = data[0]
      this.data.old_data.return.item = this.data.old_data.return.item.map((a: any, i: number) => {
        if (a.extend == true) {
          return {
            ...a,
            extend: false,
          }
        }
        if (a.return == true) {
          return {
            ...a,
            return_success_1: false,
          }
        } else {
          return {
            ...a,
          }
        }

      })
      console.log(this.data.old_data.return.item);


      this.data.period = `${moment(this.data.old_data.takeout.FromDate).format("ll")} - ${moment(this.data.old_data.takeout.ToDate).format("ll")}`
      this.check_action = false
    }, 200);




  }





  async getPosition() {
    const user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ organization: `${user.section}` }))
    this.positionName = `${data_organization[0].organization[0]} / ${data_organization[0].organization[1]} / ${data_organization[0].organization[2]}`
  }


  apply() {
    Swal.close()
    Swal.fire({
      title: `[Take-out request No. ${this.take_out_no}] <br>Do you want to apply  ?`,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        // check == ?
        let data_have = await lastValueFrom(this.api.getDataApprove({ ControlID: this.data.old_data.ControlID }))
        if (this.last_item.length > 0) {
          this.recordData()
        }


        if (this.extend_item.length > 0) {
          this.def_set_extend()
        }


        // code end
        setTimeout(() => {
          Swal.close()
          Swal.fire({
            position: 'center',
            width: 300,
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          }).then((result) => {
            this.route.navigate(['/Inventory']).then((v: any) => {
              // window.location.reload()
            })
          });
        }, 200);
      }
    })


  }



  async recordData() {
    let get_byCondition = await lastValueFrom(this.api.getDataApprove({ ControlID: this.data.old_data.ControlID }))
    let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    if (login.level == 4) {
      this.last_item = this.last_item.map((e: any) => {
        return {
          ...e,
          Approve_by: "Admin",
          Approve_employee: "Admin",
          Approve_time: moment().format(),
          time: moment().format()
        }
      })
      let UpdateItemInReturn = this.last_item.map((d: any) => {
        let item = this.data.old_data.return.item.filter((a: any) => a.value == d.value)
        item[0].return_approve = true
      })
      this.update_status_asset(this.last_item)
    }
    //TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO


    if (get_byCondition.length > 0) {
      if (this.data.old_data?.return) {
        this.data.old_data.return.Apply_Date = moment().format()
        this.data.old_data.return.Approve_Step = 1
        if (!this.data.old_data.return.count_return) {
          this.data.old_data.return.count_return = 0
        }
        this.data.old_data.return.count_return = this.data.old_data.return.count_return + 1
        this.last_item = this.last_item.map((e: any) => {
          return {
            ...e,
            time: moment().format()
          }
        })

        this.data.old_data.return[`return_${this.data.old_data.return.count_return}`] = this.last_item
        if (login.level == 4 && this.item_return(this.data.old_data.return)) {
          this.data.old_data.return.Approve_Step = 2
        }

        let update = await lastValueFrom(this.api.ApproveUpdate(this.data.id, { return: this.data.old_data.return }))
        if (login.level == 4) {
          this.return_success_mail(this.last_item, this.data.old_data.return.count_return)
        } else {
          this.Mail_Approve_Request(this.last_item, this.data.old_data.return.count_return)
        }
      }
    }

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
        }
      })
      let update_asset_item = lastValueFrom(this.api.updateAsset(data[0]._id, data[0]))
    }
  }



  item_return(data: any) {
    let set_1 = data?.return_1?.filter((a: any) => a?.Approve_employee)
    let set_2 = data?.return_2?.filter((a: any) => a?.Approve_employee)
    let set_3 = data?.return_3?.filter((a: any) => a?.Approve_employee)
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
    if (count == data.item.length) {
      return true
    } else {
      return false
    }
  }


  cancel() {
    this.route.navigate(['/AppliedList']).then((v: any) => { })
  }


  def_return(i: any) {
    this.data.old_data.takeout.item[i].return = true
    this.data.old_data.takeout.item[i].return_success_1 = true
    this.data.old_data.takeout.item[i].time_return = moment().format('ll')
    this.last_item.push(this.data.old_data.takeout.item[i])
    this.def_check_action_mode()
  }


  def_cancel(i: any) {
    this.data.old_data.takeout.item[i].return = false
    this.data.old_data.takeout.item[i].return_success_1 = false
    delete this.data.old_data.takeout.item[i].time
    this.last_item.splice(this.last_item.findIndex((element: any) => element == this.data.old_data.takeout.item[i]), 1)
    this.def_check_action_mode()
  }


  def_cancel_extend(e: any, i: any) {
    e.extend_success = false
    e.extend = false
    this.extend_item.splice(this.extend_item.findIndex((element: any) => element == this.data.old_data.return.item[i]), 1)
    this.def_check_action_mode()
  }


  def_return_mode(i: any) {
    console.log("aaa");

    this.data.old_data.return.item[i].return = true
    this.data.old_data.return.item[i].return_success_1 = true
    this.data.old_data.return.item[i].time_return = moment().format('ll')
    this.last_item.push(this.data.old_data.takeout.item[i])
    this.def_check_action_mode()
  }


  def_cancel_mode(i: any) {
    this.data.old_data.return.item[i].return = false
    this.data.old_data.return.item[i].return_success_1 = false
    delete this.data.old_data.return.item[i].time_return
    delete this.data.old_data.return.item[i].time
    this.last_item.splice(this.last_item.findIndex((element: any) => element == this.data.old_data.takeout.item[i]), 1)
    this.def_check_action_mode()
  }


  def_check_action_mode() {
    this.check_action = false
    let data_takeout = this.data.old_data?.return?.item.filter((e: any) => e?.return == true)
    let data_takeout_extend = this.data.old_data?.return?.item.filter((e: any) => e?.extend_success == true)
    let data_return = this.data.old_data?.return?.item.filter((e: any) => e?.return == true && e?.return_success_2 == false)
    let data_return_extend = this.data.old_data?.return?.item.filter((e: any) => e?.extend_success == true)
    if (!data_takeout) { data_takeout = [] }
    if (!data_return) { data_return = [] }
    if (!data_takeout_extend) { data_takeout_extend = [] }
    if (!data_return_extend) { data_return_extend = [] }
    if (data_takeout?.length + data_return?.length + data_takeout_extend?.length + data_return_extend?.length > 0) {
      this.check_action = true
    }

  }


  //TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO
  async Mail_Approve_Request(data: any, count: any) {
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
      // this.dataValue.takeout.Approve_Step = 2
    }
    let mail = this.employee.filter((d: any) => approver.includes(d.employee));
    mail = mail.map((d: any) => {
      return d.email
    })
    console.log(mail);

    let mail_data = {
      _id: this.data?.id,
      requester: this.data?.name,
      ControlID: this.data?.old_data?.ControlID,
      approver: mail,
      asset: data,
      return_count: count
    }

    let Mail_Approve = await lastValueFrom(this.api.Mail_Approve_return(mail_data))
  }


  async Mail_Approve_Extend(data: any, count: any) {
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
      // this.dataValue.takeout.Approve_Step = 2
    }
    let mail = this.employee.filter((d: any) => approver.includes(d.employee));
    mail = mail.map((d: any) => {
      return d.email
    })
    // console.log(mail);

    data = data.map((d: any) => {
      return {
        ...d,
        title: moment(d.title).format('ll')
      }
    })

    let mail_data = {
      _id: this.data?.id,
      requester: this.data?.name,
      ControlID: this.data?.old_data?.ControlID,
      approver: mail,
      asset: data,
      extend_count: count
    }
    console.log(mail_data);

    // Mail_Approve_return
    let Mail_Approve_Extend = await lastValueFrom(this.api.Mail_Approve_Extends(mail_data))
  }



  // this.temp = sort(this.temp, "BoxNo")
  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return b[key].localeCompare(a[key])
    })
    return array
  }


  //TODO
  def_On_Extend(e: any) {
    if (moment(e.period.split("-")[1]).diff(moment().format('ll'), "days") <= 99) {
      return true
    } else {
      return false
    }

  }


  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    let date = moment(d).format().split("T")[0].toString()
    let holiday = this.holiday?.filter((e: any) => e["date"].match(new RegExp(date, "i")));
    return holiday?.length == 0 && day !== 0
  };


  extend_data(e: any) {
    this.date_select = []
    this.date_select.min = moment(e.period.split("-")[1]).add(1, 'days').format()
    this.date_select.max = moment(e.period.split("-")[0]).add(31, 'days').format()
    this.date_select.data = e
  }


  remain(item: any) {
    let min = moment(item.period.split("-")[1]).add(1, 'days').format()
    let max = moment(item.period.split("-")[0]).add(31, 'days').format()
    if (moment(max).diff(min, 'days') > 0) {
      return true
    } else {
      return false
    }
  }


  async extend(e: any, i: any) {
    console.log(e);
    console.log(i);
    e = e[i]
    if (this.date_select.date) {
      e.title = `${this.date_select.date}`
      e.extend_success = true
      e.extend = true
      this.def_check_action_mode()
    }else{
      this.extend_btn = false
    }
    if (e.extend) {
      this.extend_item.push(this.data.old_data.return.item[i])
    }
  }


  //TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO
  async def_set_extend() {

    let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let list = {
      "takeout.item.value": this.extend_item[0].value
    }

    let update = await lastValueFrom(this.api.ApproveUpdate(this.data.id, { return: this.data.old_data.return }))
    let data = await lastValueFrom(this.api.getDataApprove(list))
    if (login.level == 4) {

      this.extend_item = this.extend_item.map((e: any) => {
        return {
          ...e,
          Approve_by: "Admin",
          Approve_employee: "Admin",
          Approve_time: moment().format()
        }
      })

      let loo = this.extend_item.map((d: any) => {
        const items = data[0].return.item
        const indexItem = items.findIndex((a: any) => a.value == d.value)
        if (indexItem !== -1) {
          let period = items[indexItem].period.split("-")[0]
          items[indexItem].period = `${period}- ${moment(d.title).format('ll')}`
          items[indexItem].extend = false
          items[indexItem].extend_success = false
        }
      })
      let update = await lastValueFrom(this.api.ApproveUpdate(this.data.id, { return: data[0].return }))
    }



    if (data.length > 0) {
      if (this.data.old_data?.extend) {
        this.data.old_data.extend.Apply_Date = moment().format()
        this.data.old_data.extend.Approve_Step = 1
        this.data.old_data.extend.count_extend = this.data.old_data.extend.count_extend + 1
        this.extend_item = this.extend_item.map((e: any) => {
          return {
            ...e,
            time: moment().format()
          }
        })
        this.data.old_data.extend[`extend_${this.data.old_data.extend.count_extend}`] = this.extend_item
        let update = await lastValueFrom(this.api.ApproveUpdate(this.data.id, { extend: this.data.old_data.extend }))
        if (login.level == 4) {
          this.extend_success_mail(this.extend_item, this.data.old_data.extend.count_extend)
        } else {
          this.Mail_Approve_Extend(this.extend_item, this.data.old_data.extend.count_extend)
        }

      } else {
        this.data.old_data.takeout.Apply_Date = moment().format()
        this.data.old_data.takeout.Approve_Step = 1
        this.data.old_data.takeout.count_extend = 1
        this.data.old_data.takeout[`extend_${1}`] = this.extend_item
        delete this.data.old_data.takeout.Approve_by
        delete this.data.old_data.takeout.Approve_employee
        delete this.data.old_data.takeout.Approve_time
        let update = await lastValueFrom(this.api.ApproveUpdate(this.data.id, { extend: this.data.old_data.takeout }))
        if (login.level == 4) {
          this.extend_success_mail(this.extend_item, 1)
        } else {
          this.Mail_Approve_Extend(this.extend_item, this.data.old_data.takeout.count_extend)
        }
      }
    }
  }


  async update_after_extend() {
    let data = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let get_data_list = {
      "takeout.name": data.full_name,
      "takeout.BusinessModel": "IT asset takeout application form",
      "takeout.Approve_Step": 1
    }
    this.dataList = await lastValueFrom(this.api.getDataApprove(get_data_list))
    let res = this.dataList.filter((e: any) => e.ControlID == this.take_out_no)
    this.data.old_data = res[0]
  }


  //this.return_success_mail(this.last_item, this.data.old_data.return.count_return)
  async return_success_mail(item: any, data: any) {
    let mail_data = {
      _id: this.data?.id,
      requester: this.data?.name,
      ControlID: this.data?.old_data?.ControlID,
      requester_mail: this.data.old_data.takeout.email,
      asset: item,
      return_count: data
    }
    let Mail_Return_success = lastValueFrom(this.api.Return_success(mail_data))
  }


  async extend_success_mail(item: any, data: any) {
    item = item.map((d: any) => {
      return {
        ...d,
        title: moment(d.title).format('ll')
      }
    })

    let mail_data = {
      _id: this.data?.id,
      requester: this.data?.name,
      ControlID: this.data?.old_data?.ControlID,
      requester_mail: this.data.old_data.takeout.email,
      asset: item,
      extend_count: data
    }


    let Mail_Extend_success = lastValueFrom(this.api.Extend_success(mail_data))
    // console.log(mail_data);
  }



  return_btn = false;
  Return_function(i:any) {
    this.return_btn = !this.return_btn;
    if (this.return_btn) {
      this.def_return_mode(i)
    } else {
      this.def_cancel_mode(i)
    }
  }

  extend_btn = false;
  @ViewChild('def_extend_return') defExtendReturn!: MatDatepicker<any>;
  Extend_function(item: any, i: any) {
    this.extend_btn = !this.extend_btn;
    if (this.extend_btn) {
      this.defExtendReturn.open()
      this.temp_extend = i
      this.extend_data(item)
    } else {
      this.def_cancel_extend(item,i)
    }
  }

}

