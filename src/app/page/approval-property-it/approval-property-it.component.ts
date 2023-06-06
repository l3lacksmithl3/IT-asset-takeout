import { HttpService } from 'src/app/service/http.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';



@Component({
  selector: 'app-approval-property-it',
  templateUrl: './approval-property-it.component.html',
  styleUrls: ['./approval-property-it.component.scss']
})
export class ApprovalPropertyItComponent {
  Post: any[] = []
  Position: any[] = []
  input: any = {}

  dataNew: any = {}

  user: any
  constructor(
    private api: HttpService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private api : HttpService
  ) { }




  async ngOnInit(): Promise<void> {

    this.dataNew.section = this.data.code_abbname
    this.dataNew.name = this.data.name
    let data = await lastValueFrom(this.api.getMasterIT())
    let dataBaseUser = await lastValueFrom(this.api.MasterUserAll())
    dataBaseUser  = dataBaseUser.filter((d:any)=>d.section == "IT-SP")
    this.user = dataBaseUser


    if (this.data.section == "IT-SP" ) {
      this.dataNew.section = this.data.section
    }


  }

  confirm() {
    if (this.dataNew.position != "Open this select") {
      let list = this.user.filter((d: any) => d.name == this.dataNew.name)
      this.dialog.close(list[0])
    }
  }
}

