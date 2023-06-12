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

  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  inputFilter: any
  dataTable: any
  item: any = []


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
      let Temp_ReturnOver
      moment(d.ToDate).diff(moment(), "day") < 0 ? Temp_ReturnOver = moment(d.ToDate).diff(moment(), "day") : Temp_ReturnOver = "-"
      if (d.ITassets_1 && d.ITassets_1 != "") {
        this.item.push(d.ITassetsNo_1)
      }
      if (d.ITassets_2 && d.ITassets_2 != "") {
        this.item.push(d.ITassetsNo_2)
      }
      if (d.ITassets_3 && d.ITassets_3 != "") {
        this.item.push(d.ITassetsNo_3)
      }
      return {
        ...d,
        "Temp_No.": "1",
        "Temp_RecordDate": moment(d.Apply_Date).format("DD-MMM-YY"),
        "Temp_Take out no.": d.ControlID,
        "Temp_Requester": d.name,
        "Temp_Take out period": `${moment(d.FromDate).format("DD-MMM-YY")} - ${moment(d.ToDate).format("DD-MMM-YY")}`,
        "Temp_Q'ty": moment(moment(d.ToDate)).diff(d.FromDate, "day"),
        "Temp_Remain": moment(d.ToDate).diff(moment(), "day"),
        "Temp_ReturnDate": "-",
        "Temp_ReturnNo": "-",
        "Temp_ReturnOver": Temp_ReturnOver,
        "Temp_Item No.": this.item,
        "Temp_Status": "-",
      }
    })


    // console.log("🚀 ~ file: log-book-record.component.ts:64 ~ LogBookRecordComponent ~ ngOnInit ~ dataRew:", dataRew)

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

    this.data = this.sort(this.data, "Apply_Date")

    // console.log(moment(text1).fromNow());
    this.dataTable = this.data
    // this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource(this.dataTable)
    console.log(this.data);

    //
  }



  lop(d: any) {
    console.log(d);

  }


  view(item: any) {
    let closeDialog = this.dialog.open(LogBookDetailComponent, {
      width: '800px',
      data: item,
    });
    closeDialog.afterClosed().subscribe(close => {

    })
  }



  filter() {
    // console.log(this.inputFilter);
    let res1 = this.data.filter((d: any) => d["ControlID"].match(new RegExp(this.inputFilter, "i")));
    let res2 = this.data.filter((d: any) => d["BusinessModel"].match(new RegExp(this.inputFilter, "i")));
    let res3 = this.data.filter((d: any) => d["name"].match(new RegExp(this.inputFilter, "i")));
    let res = res1.concat(res2).concat(res3);
    this.dataTable = removeDuplicates(res)


    function removeDuplicates(arr: any) {
      return arr.filter((item: any,
        index: any) => arr.indexOf(item) === index);
    }
    this.dataSource = new MatTableDataSource(this.dataTable)
    this.dataSource.paginator = this.paginator;
  }



  // this.temp = sort(this.temp, "BoxNo")
  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return b[key].localeCompare(a[key])
    })
    return array
  }

}
