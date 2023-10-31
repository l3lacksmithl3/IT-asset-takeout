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
import {MatSort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-logbook-head',
  templateUrl: './logbook-head.component.html',
  styleUrls: ['./logbook-head.component.scss'],
})
export class LogbookHeadComponent {

  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  inputFilter: any
  data: any
  user: any
  @ViewChild(MatSort) sort:any = MatSort;

  constructor(
    private api: HttpService,
    private route: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private ngxService: NgxUiLoaderService
  ) { }



  async ngOnInit(): Promise<void> {
    // let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    this.ngxService.start()

    // let filter = {
    //   'takeout.Approve_Step': {
    //     '$in': [
    //       2
    //     ]
    //   },
    // }

    this.user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ code: { $in: [`${this.user.position_code}`, Number(this.user.position_code)] } }))
    let NewFormate = data_organization.map((d: any) => {
      return d.code
    })

    let result
    let flattenedData
    let level = 1
    if (this.user.level == 4) {
      flattenedData = NewFormate.reduce((acc: any, row: any) => acc.concat(row.slice(level, 2)), []);
      result = [...new Set(flattenedData)];
    } else {
      if (this.user.level == 1) { level = 4 }
      if (this.user.level == 2) { level = 3 }
      if (this.user.level == 3) { level = 2 }
      flattenedData = NewFormate.reduce((acc: any, row: any) => acc.concat(row.slice(level, 4)), []);
      result = [...new Set(flattenedData)];
    }

    result = result.map((e: any) => {
      if (typeof e == 'string') {
        return e
      }else{
        return JSON.stringify(e)
      }
    })

    let filter = {
      $or: [
        { 'takeout.position_code': { $in: result }, "takeout.Approve_Step": 2 },
      ]
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
          item.section = list?.return?.section
          data.push(item)
        }
      } else {
        for (const item of list?.takeout?.item) {
          item.requester = list?.takeout.name
          item.ControlID = list?.ControlID
          item.updatedAt = list?.updatedAt
          item.CorpDivDep = list?.takeout?.CorpDivDep
          item.reason = list?.takeout?.Reason
          item.section = list?.takeout?.section
          data.push(item)
        }
      }
    }

    data = data.map((d: any) => {
      let loo = true
      if (!d.return_approve) { loo = false , delete d.time_return }
      return {
        ...d,
        return: loo
      }
    })

    // data = data.filter((d:any)=>d?.return_approve != true)
    this.data = data.map((d: any, i: any) => {
      let status = '', remain = ''
      if (d.return && d?.return_approve) { status = 'PASS' }
      if (!d.return && moment(d.period.split('-')[1]).diff(moment().format('ll'), "day") < 0) { status = 'OVER' }
      if (!d.return && moment(d.period.split('-')[1]).diff(moment().format('ll'), "day") >= 0) { status = 'Borrowing' }
      if (d.return) { remain = '-' }
      if (!d.return) { remain = `${moment(d.period.split('-')[1]).diff(moment().format('ll'), "day")}` }
      return {
        "Temp_RecordDate": moment(d.updatedAt).format('ll'),
        "Temp_Take out no.": d.ControlID,
        "Temp_Requester": d.requester,
        "Temp_Take out period": d.period,
        "Temp_Q'ty": moment(d.period.split('-')[1]).diff(d.period.split('-')[0], "day"),
        "Temp_Remain": remain,
        "Temp_ReturnDate": d?.time_return || '-',
        "Temp_Department": d?.CorpDivDep,
        "Temp_reason": d?.reason,
        "Temp_Item No.": d.value,
        "Temp_type": d.name,
        "Temp_Status": status,
        "Temp_section": d.section
      }
    })

    const customOrder = ['OVER', 'Borrowing', 'PASS'];
    this.data.sort((obj1: any, obj2: any) => {
      const b1Index = customOrder.indexOf(obj1.Temp_Status);
      const b2Index = customOrder.indexOf(obj2.Temp_Status);
      return b1Index - b2Index;
    });

    this.data = this.data.map((d: any, i: any) => {
      return {
        ...d,
        "Temp_No.": i + 1
      }
    })


    this.dataSource = new MatTableDataSource(this.data)
    // console.log("🚀 ~ file: inventory.component.ts:102 ~ InventoryComponent ~ ngOnInit ~ this.data:", this.data)
    this.dataSource.paginator = this.paginator;



    this.ngxService.stop()

  }


  check_item_empty() {
    if (this.data?.length > 0) {
      return true
    } else {
      return false
    }
  }



}

