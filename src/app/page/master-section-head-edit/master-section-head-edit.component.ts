import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-master-section-head-edit',
  templateUrl: './master-section-head-edit.component.html',
  styleUrls: ['./master-section-head-edit.component.scss']
})
export class MasterSectionHeadEditComponent implements OnInit {

  data_department: any
  user: any
  constructor(
    private api: HttpService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  async ngOnInit(): Promise<void> {
    this.data.name = ''
    this.user = await lastValueFrom(this.api.MasterUserAll())
    this.getUser()
    if (this.user.length > 0) {
      this.data_department = this.data.sec_head_employee
      let data = this.user?.filter((d: any) => d.employee == this.data_department)
      data[0] ? this.data.name = data[0]?.full_name : this.data.name = ''
    }

  }



  getUser() {
    let filter = this.user.filter((d: any) => d.department == this.data.department)
    this.data.user = filter
  }



  dataChange() {
    let data = this.user?.filter((d: any) => d.employee == this.data_department)
    this.data.name = data[0].full_name
    // console.log(data);
  }



  close() {
    this.dialog.close()
  }



  async confirm() {
    Swal.fire({
      title: 'Do you want to update data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let update = await lastValueFrom(this.api.section_head_update(this.data._id, { sec_head_employee: this.data_department }))
        this.dialog.close("success")
        //code end
        setTimeout(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          })
        }, 200);
      }
    })
  }

}
