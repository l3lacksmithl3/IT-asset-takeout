import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/service/http.service';
import { lastValueFrom } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-master-organization-edit',
  templateUrl: './master-organization-edit.component.html',
  styleUrls: ['./master-organization-edit.component.scss'],
})
export class MasterOrganizationEditComponent implements OnInit {

  title: any

  selectedValue_1: any
  myControl_1 = new FormControl('');
  filteredOptions_1: any

  list_employee: any
  list_value: any
  list_value_2: any
  options: string[] = [];
  list_name: any

  constructor(
    private api: HttpService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }



  async ngOnInit(): Promise<void> {
    this.title = this.data.section
    this.MasterUserAll(this.data)

  }


  async MasterUserAll(d: any) {

    let key = d.code[1].toString().slice(0, 2)
    let user = await lastValueFrom(this.api.MasterUserAll())
    // console.log("🚀 ~ file: master-organization-edit.component.ts:48 ~ MasterOrganizationEditComponent ~ MasterUserAll ~ user:", user)

    let res = user.filter((d: any) => d["department"].match(new RegExp(`^${key}.*`, "i")));
    res = this.sort(res, "name")
    if (res.length > 0) {
      this.list_employee = res
      // console.log("🚀 ~ file: master-organization-edit.component.ts:51 ~ MasterOrganizationEditComponent ~ MasterUserAll ~ res:", res)
    }

  }


  async submit() {
    let data = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [Number(this.data.code[this.list_name - 1]), this.data.code[this.list_name - 1]] } }))

    let code = []
    if (this.list_value) code[0] = this.list_value
    if (this.list_value_2) code[1] = this.list_value_2
    data[0].code_employee = code
    // console.log(this.data._id);
    // console.log(data[0]);

    let update = await lastValueFrom(this.api.Master_Code_update(data[0]._id, data[0]))
    // console.log("🚀 ~ file: master-organization-edit.component.ts:63 ~ MasterOrganizationEditComponent ~ submit ~ update:", update)
    this.dialog.close("success")
  }

  close() {
    this.dialog.close()
  }


  async select() {
    let data = await lastValueFrom(this.api.Master_Code_ByCondition({ code: { $in: [Number(this.data.code[this.list_name - 1]), this.data.code[this.list_name - 1]] } }))
    // console.log(data);

    this.list_value = data[0]?.code_employee[0]
    this.list_value_2 = data[0]?.code_employee[1]
    // console.log(data);
  }

  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return a[key].localeCompare(b[key])
    })
    return array
  }

  del() {
    this.list_value_2 = null
  }

}
