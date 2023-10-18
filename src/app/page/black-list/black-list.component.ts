import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.scss']
})


export class BlackListComponent implements OnInit {

  displayedColumns: string[] = ['1', '2', '3', '4', 'BAN'];

  dataSource = new MatTableDataSource
  dataSource_user = new MatTableDataSource
  @ViewChild('paginator') paginator: any = MatPaginator;
  @ViewChild('paginator_user') paginator_user: any = MatPaginator;

  data_blacklist: any
  key_employee:any


  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.getAllUserBlacklist()
    this.getAllUserEmployee()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter_user(event: Event) {
    const filterValue = this.key_employee;
    this.dataSource_user.filter = filterValue.trim().toLowerCase();
  }


  async getAllUserEmployee() {
    let data = await lastValueFrom(this.api.MasterUserAll())
    data = data.map((d: any) => {
      let data_blacklist = this.data_blacklist?.filter((e: any) => e.employee == d.employee)
      return {
        ...d,
        blacklist: data_blacklist?.length
      }
    })
    this.dataSource_user = new MatTableDataSource(data)
    this.dataSource_user.paginator = this.paginator_user;
    this.ngxService.stop()
    this.dataSource_user.filter = this.key_employee?.trim().toLowerCase();
  }

  async getAllUserBlacklist() {
    let data = await lastValueFrom(this.api.Black_List_Get())
    this.dataSource = new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator;
    this.data_blacklist = data
  }

  blacklist(e: any) {
    Swal.close()
    Swal.fire({
      title: `Do you want to blacklist (${e.full_name}) ?`,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        // let blacklist = lastValueFrom(this.api.Black_List_Add(e))
        // this.confirmAction()
        this.confirmAction(e)
        //code end
      }
    })
  }


  unlock(e: any) {
    Swal.close()
    Swal.fire({
      title: `Do you want to unblock (${e.full_name}) ?`,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let blacklist = lastValueFrom(this.api.Black_List_Del(e))
        //code end
        setTimeout(() => {
          Swal.close()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          })
          this.getAllUserBlacklist()
          this.getAllUserEmployee()
        }, 200);
      }
    })
  }



  confirmAction(e: any) {
    Swal.close()
    Swal.fire({
      title: 'Please provide a reason.',
      input: 'textarea', // ให้มีกรอบกรอกข้อมูล reason
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        // ตรวจสอบให้ไม่ใส่ reason ไม่ได้
        return value ? null : 'Please provide a reason !';
      },
    }).then((result) => {
      // ถ้ากดยืนยันแล้วใส่ reason ครบถ้วน
      if (result.isConfirmed && result.value) {
        const reason = result.value; // ดึงค่า reason ที่กรอก
        // เรียกฟังก์ชันหรือการดำเนินการอื่นๆ ที่คุณต้องการทำ
        this.handleConfirmation(reason, e);
      }
    });
  }

  // Function หรือการดำเนินการที่คุณต้องการทำหลังจากการคอนเฟริม
  handleConfirmation(reason: string, e: any) {
    // console.log(e);
    e.reason = reason
    let blacklist = lastValueFrom(this.api.Black_List_Add(e))
    Swal.close()
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Success',
      showConfirmButton: false,
      timer: 1500,
    }).then(()=>{
      this.getAllUserBlacklist()
      this.getAllUserEmployee()
    })
  }

 info(e:any){
  Swal.close()
   Swal.fire({
     title: 'The reason for being blacklisted',
     text: `( ${e.reason} )`,
    //  icon: 'info',
     confirmButtonText: 'close',
   });

 }

 active(){
  this.getAllUserBlacklist()
  // this.getAllUserEmployee()
 }


}
