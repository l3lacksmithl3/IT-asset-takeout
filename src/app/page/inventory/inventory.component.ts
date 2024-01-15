import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { LogBookDetailComponent } from '../log-book-detail/log-book-detail.component';
import { HttpClient } from '@angular/common/http';
import { Cell, Row, Workbook, Worksheet } from 'ExcelJs';
import * as fs from 'file-saver';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent{

  displayedColumns: string[] = ['1','2','3','4','5','6','7'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  inputFilter: any
  data :any

  constructor(
    private api: HttpService,
    private route: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private ngxService: NgxUiLoaderService
  ) { }

  async ngOnInit(): Promise<void> {
    let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    this.ngxService.start()

    let filter = {
      'takeout.Approve_Step': {
        '$in': [
          2
        ]
      },
      'takeout.email': {
        '$in': [
          login.email
        ]
      },
      'return.Approve_Step': {
        '$in': [
          1
        ]
      },
    }

    let job = await lastValueFrom(this.api.getDataApprove(filter))
    // console.log(job);

    let data = []
    for (const list of job) {
      if (list?.return) {
        for (const item of list?.return?.item) {
          item.requester = list?.return.name
          item.ControlID = list?.ControlID
          item.updatedAt = list?.updatedAt
          item.CorpDivDep = list?.return?.CorpDivDep
          item.reason = list?.return?.Reason
          data.push(item)
        }
      } else {
        for (const item of list?.takeout?.item) {
          item.requester = list?.takeout.name
          item.ControlID = list?.ControlID
          item.updatedAt = list?.updatedAt
          item.CorpDivDep = list?.takeout?.CorpDivDep
          item.reason = list?.takeout?.Reason
          data.push(item)
        }
      }
    }
    data = data.filter((d:any)=>d?.return_approve != true)
    this.data = data.map((d: any,i:any) => {
      return {
        "Temp_No.": i+1,
        "Temp_RecordDate": moment(d.updatedAt).format('ll'),
        "Temp_Take out no.": d.ControlID,
        "Temp_Requester": d.requester,
        "Temp_Take out period": d.period,
        "Temp_Q'ty": moment(d.period.split('-')[1]).diff(d.period.split('-')[0], "day"),
        "Temp_Remain": moment(d.period.split('-')[1]).diff(moment().format('ll'), "day"),
        "Temp_Department": d?.CorpDivDep,
        "Temp_reason": d?.reason,
        "Temp_Item No.": d.value,
        "Temp_type": d.name,
      }
    })

    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.paginator = this.paginator;
    this.ngxService.stop()

  }


  check_item_empty(){
    if (this.data?.length > 0) {
      return true
    }else{
      return false
    }
  }



}
