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

    console.log(this.data);
    this.dataNew.section = this.data.code_abbname
    this.dataNew.name = this.data.name
    let data = await lastValueFrom(this.api.getMasterIT())
    this.user = data[0].value

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

