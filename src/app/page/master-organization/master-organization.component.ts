import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MasterOrganizationEditComponent } from '../master-organization-edit/master-organization-edit.component';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-master-organization',
  templateUrl: './master-organization.component.html',
  styleUrls: ['./master-organization.component.scss']
})
export class MasterOrganizationComponent implements OnInit {


  position: any
  code_employee: any
  code: any


  constructor(
    private api: HttpService,
    private dialog: MatDialog,
    private route: Router,
    private routers: ActivatedRoute,
  ) { }

  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5', '6', '7'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;


  ngOnInit(): void {
    this.MaterOr_Getall()
  }


  async MaterOr_Getall() {

    let user = await lastValueFrom(this.api.MasterUserAll())
    let asd = user.filter((e: any) => e.employee == 'TH0340/15')[0]?.name
    let all = await lastValueFrom(this.api.MasterOrganization_getall())
    let code = await lastValueFrom(this.api.Master_Code())

    // let aoo = code.filter((d: any) => d.code )

    let list = all.map((d: any) => {
      return {
        ...d,
        temp_corporate: convert(code.filter((e: any) => e.code == d.code[0])[0]?.code_employee),
        temp_division: convert(code.filter((e: any) => e.code == d.code[1])[0]?.code_employee),
        temp_department: convert(code.filter((e: any) => e.code == d.code[2])[0]?.code_employee),
        temp_section: convert(code.filter((e: any) => e.code == d.code[3])[0]?.code_employee)
      }
    })
    console.log(list);

    function convert(params: any) {
      if (params) {
        const data = params
        const codeToName = user.reduce((map: any, item: any) => {
          map[item.employee] = item.name;
          return map;
        }, {});
        return data.map((code:any) => codeToName[code])
      }
    }



    this.dataSource = new MatTableDataSource(list)
    this.dataSource.paginator = this.paginator;

  }

  // getData2() {
  //   const data = this.getData();
  //   const codeToName = this.rewdata.reduce((map, item) => {
  //     map[item.name] = item.value;
  //     return map;
  //   }, {});
  //   return data.map(code => codeToName[code]);
  // }




  def_edit(e: any) {
    console.log(e);
    let closeDialog = this.dialog.open(MasterOrganizationEditComponent, {
      autoFocus: false,
      width: '500px',
      maxHeight: '90vh',
      data: e,
      disableClose: true
    });
    closeDialog.afterClosed().subscribe(async close => {
      if (close == "success") {
        this.MaterOr_Getall()
      }
    })
  }

  push() {
    let position
    if (this.position == '1') {
      position = 'corporate'
    }
    if (this.position == '2') {
      position = 'division'
    }
    if (this.position == '3') {
      position = 'department'
    }
    if (this.position == '4') {
      position = 'section'
    }
    let list = {
      code: Number(this.code),
      position: position,
      code_employee: [this.code_employee]
    }
    console.log(list);
    let add = lastValueFrom(this.api.Master_Code_Add(list))
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Success',
      showConfirmButton: false,
      timer: 1500,
    })

  }

}
