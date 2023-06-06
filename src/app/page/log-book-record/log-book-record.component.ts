import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { LogBookDetailComponent } from '../log-book-detail/log-book-detail.component';


@Component({
  selector: 'app-log-book-record',
  templateUrl: './log-book-record.component.html',
  styleUrls: ['./log-book-record.component.scss']
})
export class LogBookRecordComponent {

  data: any = []

  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;


  constructor(
    private api: HttpService,
    private route: Router,
    private dialog: MatDialog

  ) { }


  async ngOnInit(): Promise<void> {

    let filter = {
      Approve_Step: 3
    }
    let dataRew = await lastValueFrom(this.api.getDataApprove(filter))
    this.data = dataRew.map((d: any) => {
      return {
        ...d,
        "Temp_No.": "1",
        "Temp_RecordDate": moment(d.Apply_Date).format("DD-MMM-YY"),
        "Temp_Take out no.": d.ControlID,
        "Temp_Requester": d.name,
        "Temp_Item No.": d.ITassetsNo_1,
      }
    })
    console.log("🚀 ~ file: log-book-record.component.ts:64 ~ LogBookRecordComponent ~ ngOnInit ~ dataRew:", dataRew)

    let text1 = "2023-01-15T16:43:24+07:00"
    moment.locale('en', {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: '1s',
        ss: '%ss',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1M',
        MM: '%dM',
        y: '1Y',
        yy: '%dY'
      }
    })

    console.log(moment(text1).fromNow());

    // this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource(this.data)
//
  }



  lop(d: any) {
    console.log(d);

  }


  view(item: any) {
    let closeDialog = this.dialog.open(LogBookDetailComponent, {
      width: '100%',
      data: item,
    });
    closeDialog.afterClosed().subscribe(close => {

    })
  }

}
