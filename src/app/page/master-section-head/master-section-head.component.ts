import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MasterSectionHeadEditComponent } from '../master-section-head-edit/master-section-head-edit.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-master-section-head',
  templateUrl: './master-section-head.component.html',
  styleUrls: ['./master-section-head.component.scss']
})
export class MasterSectionHeadComponent implements OnInit {

  //var
  displayedColumns: string[] = ['0', '1', '2', '3', '4'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  filterValue:any

  constructor(
    private api: HttpService,
    private dialog: MatDialog,
  ) { }

  //start code
  ngOnInit(): void {
    this.get_Section_Head()
  }



  async get_Section_Head() {
    let user = await lastValueFrom(this.api.MasterUserAll())
    let data = await lastValueFrom(this.api.section_head_Get_All())

    data = data.map((e: any) => {
      let data = user.filter((d: any) => d.employee == e.sec_head_employee)
      return {
        ...e,
        value: data[0]?.full_name
      }
    })
    this.dataSource = new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator;
    this.dataSource.filter = this.filterValue.trim().toLowerCase()
  }


  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }


  def_edit(e:any){
    let closeDialog = this.dialog.open(MasterSectionHeadEditComponent, {
      autoFocus: false,
      width: '300px',
      maxHeight: '90vh',
      data: e,
      disableClose: true
    });
    closeDialog.afterClosed().subscribe(async close => {
      if (close == "success") {
        this.get_Section_Head()
      }
    })

  }
}
