import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { lastValueFrom } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MasterItAssetEditComponent } from '../master-it-asset-edit/master-it-asset-edit.component';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import * as fs from 'file-saver';

import * as ExcelJS from 'ExcelJs';
import { Cell, Row, Workbook, Worksheet } from 'ExcelJs';
import { NgxUiLoaderService } from "ngx-ui-loader";


type AOA = any[][];

@Component({
  selector: 'app-master-it-asset',
  templateUrl: './master-it-asset.component.html',
  styleUrls: ['./master-it-asset.component.scss']
})
export class MasterITAssetComponent {

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;


  data: any
  table: any
  inputFilter: any
  row: any
  action: any
  dataExcel: any
  reload: boolean = false
  show: boolean = true


  constructor(
    private api: HttpService,
    private route: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private ngxService: NgxUiLoaderService

  ) { }


  async ngOnInit(): Promise<void> {
    this.ngxService.start()
    this.row = [
      { header: "No", value: "No" },
      { header: "Host Name", value: "Host Name" },
      { header: "IP Address", value: "IP Address" },
      { header: "User", value: "User" },
      { header: "E-Mail address", value: "E-Mail address" },
      { header: "AD User", value: "AD User" },
      { header: "AD", value: "AD" },
      { header: "VPN", value: "VPN" },
      { header: "INTERNET", value: "INTERNET" },
      { header: "MS365", value: "MS365" },
      { header: "LS Lot 606", value: "LSLot 606" },
      { header: "SEP Lot 624", value: "SEPLot 624" },
      { header: "CAL 2016 Lot 290", value: "CAL2016Lot 290" },
      { header: "CAL 2016 OLP", value: "CAL2016OLP" },
      { header: "CAL 2012 OLP", value: "CAL2012OLP" },
      { header: "EmpCD", value: "EmpCD" },
      { header: "Owner Position", value: "Owner Position" },
      { header: "ORG CD", value: "ORG CD" },
      { header: "Section", value: "Section" },
      { header: "Dept", value: "Dept" },
      { header: "Div", value: "Div" },
      { header: "Fixed Asset No or PO No", value: "Fixed Asset Noor PO No" },
      { header: "Manufacturer", value: "Manufacturer" },
      { header: "Model Name/Model No", value: "Model Name/Model No" },
      { header: "S/N", value: "S/N" },
      { header: "Setup Date", value: "Setup Date" },
      { header: "Age Year(s)", value: "Age Year(s)" },
      { header: "Age Ranking", value: "Age Ranking" },
      { header: "Type", value: "Type" },
      { header: "CPU Type", value: "CPU Type" },
      { header: "Memory Type", value: "Memory Type" },
      { header: "Memory Capacity", value: "Memory Capacity" },
      { header: "HDD", value: "HDD" },
      { header: "LCD/CRT Model", value: "LCD/CRT Model" },
      { header: "Monitor", value: "Monitor" },
      { header: "OS Installed", value: "OS Installed" },
      { header: "Office 1", value: "Office 1" },
      { header: "Office 1_1", value: "Office 1_1" },
      { header: "Office 2_1", value: "Office 2_1" },
      { header: "Office 365", value: "Office 365" },
      { header: "Office STD 2016 OLP", value: "Office STD 2016 OLP" },
      { header: "Windows 8 Pro OEM/Bundle", value: "Windows 8 Pro OEM/Bundle" },

    ]
    this.displayedColumns = this.row.map((d: any) => {
      return d.header
    })
    this.displayedColumns.splice(0, 0, "Action")
    // console.log(this.displayedColumns);









    let database = await lastValueFrom(this.api.getAssetIT())
    database = database.map((d: any, i: any) => {
      return {
        ...d,
        "No": i + 1
      }
    })
    this.table = database

    // console.log(this.table);


    // for (const key in this.table[0]) {
    //   this.displayedColumns.push(key)
    // }
    // console.log(this.displayedColumns);

    // console.log(this.displayedColumns);


    this.dataSource = new MatTableDataSource(this.table)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.table.length >= 0) {
      // setTimeout(() => {
      this.ngxService.stop()
      this.show = false
      // }, 1000);
    }
  }




  applyFilter() {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.inputFilter.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  // delAssetByID(data: any)

  def_edit(item: any) {
    let closeDialog = this.dialog.open(MasterItAssetEditComponent, {
      autoFocus: false,
      width: '1200px',
      maxHeight: '90vh',
      data: item,
      disableClose: true
    });
    closeDialog.afterClosed().subscribe(async close => {
      if (close == "success") {
        let database = await lastValueFrom(this.api.getAssetIT())
        database = database.map((d: any, i: any) => {
          return {
            ...d,
            "No": i + 1
          }
        })
        this.table = database
        this.dataSource = new MatTableDataSource(this.table)
        this.dataSource.paginator = this.paginator;
        this.applyFilter()
      }
    })
  }


  def_delete(item: any) {
    Swal.close()
    Swal.fire({
      title: `Do you want to delete data [${item["Host Name"]}] ?`,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let deleteByCondition = await lastValueFrom(this.api.delAssetByID({ _id: item._id }))
        if (deleteByCondition) {
          let database = await lastValueFrom(this.api.getAssetIT())
          database = database.map((d: any, i: any) => {
            return {
              ...d,
              "No": i + 1
            }
          })
          this.table = database
          this.dataSource = new MatTableDataSource(this.table)
          this.dataSource.paginator = this.paginator;
        }

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


  async def_black_true(item: any) {
    Swal.close()
    Swal.fire({
      title: `Do you want to blacklist (${item["Host Name"]}) ?`,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        Swal.close()
        Swal.fire({
          title: 'Please provide a reason.',
          input: 'textarea', // ให้มีกรอบกรอกข้อมูล reason
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          inputValidator: (value) => {
            return value ? null : 'Please provide a reason !';
          },
        }).then(async (result) => {
          if (result.isConfirmed && result.value) {
            Swal.close()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Success',
              showConfirmButton: false,
              timer: 1500,
            })
            const reason = result.value;
            let data = await lastValueFrom(this.api.getAssetByID({ _id: item._id }))
            data = data.map((d: any) => {
              return {
                ...d,
                blacklist: 'T',
                reason: reason
              }
            })

            let update = await lastValueFrom(this.api.updateAsset(item._id, data[0]))
            let database = await lastValueFrom(this.api.getAssetIT())
            database = database.map((d: any, i: any) => {
              return {
                ...d,
                "No": i + 1
              }
            })
            this.table = database
            this.dataSource = new MatTableDataSource(this.table)
            this.dataSource.paginator = this.paginator;
            this.applyFilter()

          }
        });
        //code end
      }
    })


  }

  async def_black_false(item: any) {
    let data = await lastValueFrom(this.api.getAssetByID({ _id: item._id }))
    data = data.map((d: any) => {
      return {
        ...d,
        blacklist: 'F',
        reason: ""
      }
    })

    let update = await lastValueFrom(this.api.updateAsset(item._id, data[0]))
    let database = await lastValueFrom(this.api.getAssetIT())
    database = database.map((d: any, i: any) => {
      return {
        ...d,
        "No": i + 1
      }
    })
    this.table = database
    this.dataSource = new MatTableDataSource(this.table)
    this.dataSource.paginator = this.paginator;
    this.applyFilter()

  }

  def_import(evt: any) {

    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */

      const data: any[] = []
      const files = evt.target.files
      data.push(...files)
      console.log(data);
      this.MasterData(wb, data)
      // this.ImportExcelList(evt, wb, data)

    };
    reader.readAsBinaryString(target.files[0]);
    let id_import = document.getElementById("files") as HTMLInputElement
    id_import.value = ""
  }

  // async setData() {
  //   let data = await lastValueFrom(this.api.getAssetIT())
  //   data = data.map((d: any) => {
  //     return {
  //       ...d,
  //       blacklist:"false"
  //     }
  //   })
  //   for (const item of data) {
  //     let update = await lastValueFrom(this.api.updateAsset(item._id, item))
  //   }
  //   console.log(data);
  // }

  def_export() {
    this.http.get('assets/file/IT-Asset.xlsx', { responseType: "arraybuffer" })
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
                  , "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ"
                  , "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ"]
                // console.log(ABC.split(""));
                const worksheet = workbook.getWorksheet("OfficePC");
                // if (this.dataTable == 4) {
                this.table = this.table.map((d: any) => {
                  delete d._id
                  delete d.createdAt
                  delete d.updatedAt
                  return {
                    ...d
                  }
                })

                for (const [index, item] of this.table.entries()) {
                  let i = 0
                  for (const key in item) {
                    worksheet.getCell(`${ABC[i]}${index + 2}`).value = { 'richText': [{ 'text': `${item[key]}`, 'font': { 'bold': false, 'size': 11, 'name': 'arial' } }] }
                    //  console.log(`${ABC[i]}${index + 2}`);

                    i++
                  }
                }



                workbook.xlsx.writeBuffer().then(async (data: any) => {
                  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                  // let loo = await this.api.sendExcelData({ test: data }).toPromise()

                  fs.saveAs(blob, `Report.xlsx`);



                });
              });
          });
        },
        error => {
          console.log(error);
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




  async MasterData(wb: any, data: any) {
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    let header
    // this.fullData = []
    let text = "OfficePC"
    if (wsname == text) {
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      header = this.dataExcel[0].map((d: any) => {
        let text = d.replaceAll('.', '')
        let text2 = text.replaceAll('\r\n', '')
        return text2
      })

      let data_raw: any = {}
      let max_row: any

      for (let index = 0; index < this.dataExcel.length; index++) {
        if (this.dataExcel[index].length == 0) {
          max_row = index
          break
        }
      }


      let database_asset = await lastValueFrom(this.api.getAssetIT())

      for (let index = 1; index < max_row; index++) {
        data_raw = {}
        for (const [i, item] of this.dataExcel[index].entries()) {
          let datanew = item
          if (item == undefined || item == "") {
            // console.log("aaaa");
            datanew = "-"
          }
          data_raw[header[i]] = datanew
        }

        database_asset = database_asset.filter((d: any) => d["Host Name"] != data_raw["Host Name"])

        let check_2 = this.table.filter((d: any) => d["Host Name"] == data_raw["Host Name"])


        if (check_2.length == 0) {
          //new
          let addnew = await lastValueFrom(this.api.addAsset(data_raw))

        }
        if (check_2.length > 0) {
          //update
          let update = await lastValueFrom(this.api.updateAsset(check_2[0]._id, data_raw))

        }
      }


      for (const item of database_asset) {
        let del = lastValueFrom(this.api.delAssetByID(item))
      }

      Swal.close()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Success',
        width: 300,
        showConfirmButton: false,
        timer: 1500,
      })

      let database = await lastValueFrom(this.api.getAssetIT())
      database = database.map((d: any, i: any) => {
        return {
          ...d,
          "No": i + 1
        }
      })
      this.table = database


      this.dataSource = new MatTableDataSource(this.table)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      Swal.close()
      Swal.fire('Invalid data', '', 'error')
    }
  }

  function1Active = false;

  toggleFunction() {
    this.function1Active = !this.function1Active;
    if (this.function1Active) {
      this.filter_blacklist();
    } else {
      this.filter_back();
    }
  }


  async filter_blacklist() {
    let database = await lastValueFrom(this.api.getAssetIT())
    database = database.filter((d: any) => d.blacklist == 'T')
    console.log(database);
    this.table = database
    this.dataSource = new MatTableDataSource(this.table)
    this.dataSource.paginator = this.paginator;
  }

  async filter_back() {
    let database = await lastValueFrom(this.api.getAssetIT())
    this.table = database
    this.dataSource = new MatTableDataSource(this.table)
    this.dataSource.paginator = this.paginator;
  }

  return_force(d:any){
    Swal.close()
    Swal.fire({
      title: `Force Return [${d["Host Name"]}] ?`,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        Swal.close()
        Swal.fire({
          title: 'Please provide a reason.',
          input: 'textarea', // ให้มีกรอบกรอกข้อมูล reason
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          inputValidator: (value) => {
            return value ? null : 'Please provide a reason !';
          },
        }).then(async (result) => {
          if (result.isConfirmed && result.value) {
            Swal.close()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Success',
              showConfirmButton: false,
              timer: 1500,
            })
            const reason = result.value;
            let data = {
              asset : d["Host Name"],
              reason : reason,
              asset_type : d["Type"]
            }
            let res = await lastValueFrom(this.api.Mail_Return_Force(data))
          }
        });
        //code end
      }
    })
  }


}
