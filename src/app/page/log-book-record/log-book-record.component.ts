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
  mode: any = 3
  show: boolean = true

  constructor(
    private api: HttpService,
    private route: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private ngxService: NgxUiLoaderService
  ) { }

  @ViewChild('monthPicker') monthPicker!: any
  monthPickerValue: any = new Date()

  async ngOnInit(): Promise<void> {
    this.ngxService.start()
    // this.loading()
    let filter = {
      'takeout.Approve_Step': {
        '$in': [
          2
        ]
      },
    }

    let dataRew = await lastValueFrom(this.api.getDataApprove(filter))


    let data = []
    for (const job of dataRew) {
      if (job?.return) {
        for (const item of job?.return?.item) {
          item.requester = job?.return.name
          item.ControlID = job?.ControlID
          item.updatedAt = job?.updatedAt
          item.CorpDivDep = job?.return?.CorpDivDep
          item.reason = job?.return?.Reason
          data.push(item)
        }
      } else {
        for (const item of job?.takeout?.item) {
          item.requester = job?.takeout.name
          item.ControlID = job?.ControlID
          item.updatedAt = job?.updatedAt
          item.CorpDivDep = job?.takeout?.CorpDivDep
          item.reason = job?.takeout?.Reason
          data.push(item)
        }
      }
    }

    // console.log(data);



    // console.log(dataRew);

    this.data = data.map((d: any) => {
      let status = '', remain = ''
      if (d.return && d?.return_approve) { status = 'PASS' }
      if (!d.return && moment(d.period.split('-')[1]).diff(moment().format('ll'), "day") < 0) { status = 'OVER' }
      if (!d.return && moment(d.period.split('-')[1]).diff(moment().format('ll'), "day") >= 0) { status = 'Borrowing' }
      if (d.return) { remain = '-' }
      if (!d.return) { remain = `${moment(d.period.split('-')[1]).diff(moment().format('ll'), "day")}` }
      return {
        // "Temp_No.": "1",
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
      }
    })

    // console.log(this.data);



    this.data = this.sort(this.data, "Temp_RecordDate")
    this.dataTable = this.data
    this.dataSource = new MatTableDataSource(this.dataTable)
    this.showFilter(this.mode)
    if (this.dataTable.length >= 0) {
      // setTimeout(() => {
      this.show = false
      this.ngxService.stop()
      // }, 1000);
    }
  }




  lop(d: any) {
    // console.log(d);
  }


  view(item: any) {
    let closeDialog = this.dialog.open(LogBookDetailComponent, {
      autoFocus: false,
      width: '800px',
      maxHeight: '90vh',
      data: item,
    });
    closeDialog.afterClosed().subscribe(close => {

    })
  }



  filter() {
    // console.log(this.inputFilter);
    let res1 = this.data.filter((d: any) => d["Temp_Take out no."].match(new RegExp(this.inputFilter, "i")));
    let res2 = this.data.filter((d: any) => d["Temp_Requester"].match(new RegExp(this.inputFilter, "i")));
    let res3 = this.data.filter((d: any) => d["Temp_Item No"].match(new RegExp(this.inputFilter, "i")));
    let res4 = this.data.filter((d: any) => d["Temp_RecordDate"].match(new RegExp(this.inputFilter, "i")));
    let res = res1.concat(res2).concat(res3).concat(res4);
    // console.log(this.data);



    this.dataTable = removeDuplicates(res)
    this.dataTable = this.setNo(this.dataTable)

    function removeDuplicates(arr: any) {
      return arr.filter((item: any,
        index: any) => arr.indexOf(item) === index);
    }
    this.dataSource = new MatTableDataSource(this.dataTable)
    this.dataSource.paginator = this.paginator;
    this.mode = 1

  }



  // this.temp = sort(this.temp, "BoxNo")
  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return b[key].localeCompare(a[key])
    })
    return array
  }


  showFilter(mode: any) {
    this.mode = mode
    if (this.mode == 1) {
      this.dataTable = this.data.filter((d: any) => d.Temp_Status == "PASS" || d.Temp_Status == "OVER" || d.Temp_Status == "Borrowing")
    }
    if (this.mode == 2) {
      this.dataTable = this.data.filter((d: any) => d.Temp_Status == "PASS")
    }
    if (this.mode == 3) {
      this.dataTable = this.data.filter((d: any) => d.Temp_Status == "OVER")
    }
    this.dataTable = this.setNo(this.dataTable)
    this.dataSource = new MatTableDataSource(this.dataTable)
    this.dataSource.paginator = this.paginator;
  }




  async onMonthPicker(e: any) {
    // console.log(e);
    this.monthPickerValue = e
    this.monthPicker.close()
    let data_select = this.dataTable.filter((d: any) =>
      moment(d.Temp_RecordDate).format() >= moment(e).startOf('month').format() &&
      moment(d.Temp_RecordDate).format() <= moment(e).endOf('month').format()
    )

    data_select = this.setNo(data_select)
    if (data_select.length == 0) {
      Swal.close()
      Swal.fire('No information', '', 'error')
    } else {
      this.def_export(data_select, e)
    }
    // console.log(data_select);
  }



  def_export(data_select: any, date: any) {
    // console.log(data_select);
    // console.log(date);

    this.http.get('assets/file/report.xlsx', { responseType: "arraybuffer" })
      // this.http.get('http://localhost:4200/mastereletrical/report product electrical space.xlsx', { responseType: "arraybuffer" })
      .subscribe(
        data => {
          // console.log(data);
          const workbook = new Workbook();
          const arrayBuffer = new Response(data).arrayBuffer();
          let firstRow = 2
          arrayBuffer.then((data) => {
            workbook.xlsx.load(data)
              .then(() => {
                let ABC = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
                  "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ"
                  , "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ"]
                // console.log(ABC.split(""));
                const worksheet = workbook.getWorksheet("report");

                // console.log(data_select);
                for (const [index, item] of data_select.entries()) {

                  if (moment(item["Temp_Take out period"].split('-')[1]).diff(moment(item["Temp_ReturnOver"]), "day") < 0 && item["Temp_Status"] == 'PASS' && item["Temp_ReturnDate"]) {
                    item["Temp_ReturnOver"] = moment(item["Temp_Take out period"].split('-')[1]).diff(moment(item["Temp_ReturnOver"]), "day")
                  } else{
                    item["Temp_ReturnOver"] = '-'
                  }


                  worksheet.getCell(`${ABC[0]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_No"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[1]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_RecordDate"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[2]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Take out no."]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[3]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Requester"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[4]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Department"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[5]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_reason"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[6]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_type"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[7]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Item No."]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[8]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Take out period"].split("-")[0]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[9]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Take out period"].split("-")[1]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[10]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Q'ty"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[11]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Remain"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[12]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_ReturnDate"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[13]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Take out no."]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[14]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_ReturnOver"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                  worksheet.getCell(`${ABC[15]}${index + 3}`).value = { 'richText': [{ 'text': `${item["Temp_Status"]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }

                  alignment(worksheet, `${ABC[0]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[1]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[4]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[6]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[8]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[9]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[10]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[11]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[12]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[13]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[14]}${index + 3}`, 'center', 'center')
                  alignment(worksheet, `${ABC[15]}${index + 3}`, 'center', 'center')

                  if (item["Temp_Status"] == 'OVER') {
                    fill(worksheet, `${ABC[15]}${index + 3}`, `ff0000`)
                  }
                  if (item["Temp_Status"] == 'PASS') {
                    fill(worksheet, `${ABC[15]}${index + 3}`, `00ff00`)
                  }
                  if (item["Temp_Status"] == 'Borrowing') {
                    fill(worksheet, `${ABC[15]}${index + 3}`, `ffff00`)
                  }

                }
                // `${moment(d.FromDate).format("DD-MMM-YY")} - ${moment(d.ToDate).format("DD-MMM-YY")}`

                workbook.xlsx.writeBuffer().then(async (data: any) => {
                  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                  // let loo = await this.api.sendExcelData({ test: data }).toPromise()

                  fs.saveAs(blob, `Report IT asset takeout & return (${moment(date).format("MMM-YYYY")}).xlsx`);




                });
              });
          });
        },
        error => {
          // console.log(error);
        }
      );


    function Bold(str: string) {
      return { 'richText': [{ 'text': str, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] };
    }

    function fill(worksheet: any, cell: string, color: string) {
      worksheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };
    }

    function border(ws: any, cells: string, colors: string, styles: string, tops: any, lefts: any, bottoms: any, rights: any) {
      ws.getCell(cells).border = {
        top: tops ? { style: styles, color: { argb: colors } } : null,
        left: lefts ? { style: styles, color: { argb: colors } } : null,
        bottom: bottoms ? { style: styles, color: { argb: colors } } : null,
        right: rights ? { style: styles, color: { argb: colors } } : null
      };
    }

    function alignment(ws: any, cells: string, verticals: string, horizontals: string) {
      ws.getCell(cells).alignment = { vertical: verticals, horizontal: horizontals };
    }
    function generateToken(n: number) {
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var token = '';
      for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
      }
      return token;
    }
  }



  setNo(d: any) {
    return d.map((e: any, index: any) => {
      return {
        ...e,
        Temp_No: index + 1
      }
    })
  }


  CheckStatus(d: any) {

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataTable = this.dataSource.filteredData
      // console.log(this.dataSource.filteredData);

    }
  }


}
