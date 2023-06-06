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

  constructor(
    private api: HttpService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private api : HttpService
  ) { }




  async ngOnInit(): Promise<void> {
    this.dataNew.section = this.data.section
    this.dataNew.position = this.data.user_tpye
    this.dataNew.name = this.data.name
    this.Post = await lastValueFrom(this.api.getSectionAll())
    let data = this.Post.filter((d) => d.section == this.dataNew.section)
    this.Position = data[0].value
  }

  async debug() {
    let data = this.Post.filter((d) => d.section == this.dataNew.section)
    this.Position = data[0].value
    let name = this.Position.filter((d) => d.user_tpye == this.dataNew.position)
    this.dataNew.name = name[0].name
    this.return = name
  }

  confirm() {
    this.dialog.close(this.return[0])
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




}
