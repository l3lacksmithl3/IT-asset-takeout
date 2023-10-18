import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-master-it-asset-edit',
  templateUrl: './master-it-asset-edit.component.html',
  styleUrls: ['./master-it-asset-edit.component.scss']
})
export class MasterItAssetEditComponent {

  id:any

  constructor(
    private api: HttpService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private api : HttpService
  ) { }

  ngOnInit(): void {
    // this.data["z"] = "asd"
    this.id = this.data._id
    delete this.data._id
    delete this.data.createdAt
    delete this.data.updatedAt
    // console.log(this.data);

  }


  update() {
    Swal.close()
    console.log(this.data);
    console.log(this.id);
    Swal.close()
    Swal.fire({
      title: 'Do you want to update data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let update = lastValueFrom(this.api.updateAsset(this.id,this.data))
        this.dialog.close("success")
        //code end
        Swal.close()
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500,
        })
      }
    })
  }



  event(key: any, item: any, e: any) {
    let data = e.target.value
    this.data[key] = data

  }

  close(){
    this.dialog.close()
  }

}
