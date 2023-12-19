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

  displayedColumns1: string[] = [];
  displayedColumns2: string[] = [];
  displayedColumns3: string[] = [];

  dataSourcePC = new MatTableDataSource
  dataSourceMouse = new MatTableDataSource
  dataSourceKeyPad = new MatTableDataSource
  @ViewChild('paginator1') paginator1: any = MatPaginator;
  @ViewChild('paginator2') paginator2: any = MatPaginator;
  @ViewChild('paginator3') paginator3: any = MatPaginator;

  // @ViewChild(MatSort) sort1: any = MatSort;
  // @ViewChild(MatSort) sort2: any = MatSort;



  @ViewChild('sortCol1') sortCol1: any = MatSort;
  @ViewChild('sortCol2') sortCol2: any = MatSort;
  @ViewChild('sortCol3') sortCol3: any = MatSort;



  data: any
  table: any
  inputFilter: any
  row: any
  action: any
  dataExcel: any
  reload: boolean = false
  show: boolean = true
  H_Mouse: any
  H_KeyPad: any

  ITAsset: any

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
    this.H_Mouse = [
      { header: "No", value: "No" },
      { header: "Control Code", value: "Control Code" },
      { header: "Use with computer no", value: "Use with computer no" },
      { header: "PIC", value: "PIC" },
      { header: "Budget", value: "Budget" },
      { header: "Manufacturer", value: "Manufacturer" },
      { header: "Supplier", value: "Supplier" },
      { header: "Model", value: "Model" },
      { header: "S/N", value: "S/N" },
      { header: "PO No.", value: "PO No" },
      { header: "Receive Date", value: "Receive Date" },
      { header: "Warranty Expire", value: "Warranty Expire" },
      { header: "Cost", value: "Cost" },
      { header: "Install location", value: "Install location" },
      { header: "Type", value: "Type" },
      { header: "เพิ่มเติม", value: "เพิ่มเติม" },
      { header: "Record by", value: "Record by" },

    ]
    this.H_KeyPad = [
      { header: "No", value: "No" },
      { header: "Control Code", value: "Control Code" },
      { header: "Use with computer no", value: "Use with computer no" },
      { header: "PIC", value: "PIC" },
      { header: "Manufacturer", value: "Manufacturer" },
      { header: "Supplier", value: "Supplier" },
      { header: "Model", value: "Model" },
      { header: "S/N", value: "S/N" },
      { header: "PO No.", value: "PO No" },
      { header: "Receive Date", value: "Receive Date" },
      { header: "Warranty Expire", value: "Warranty Expire" },
      { header: "Price", value: "Price" },
      { header: "Record by", value: "Record by" },

    ]

    this.displayedColumns1 = this.row.map((d: any) => {
      return d.header
    })
    this.displayedColumns2 = this.H_Mouse.map((d: any) => {
      return d.header
    })
    this.displayedColumns3 = this.H_KeyPad.map((d: any) => {
      return d.header
    })



    this.displayedColumns1.splice(0, 0, "Action")
    this.displayedColumns2.splice(0, 0, "Action")
    this.displayedColumns3.splice(0, 0, "Action")



    let AssetPC = await lastValueFrom(this.api.AssetPCGetAll())
    let AssetMouse = await lastValueFrom(this.api.AssetMouseGetAll())
    let AssetKeypad = await lastValueFrom(this.api.AssetKeypadKeyboardGetAll())
    this.ITAsset = await lastValueFrom(this.api.getAssetIT())
    // this.table = AssetPC
    // console.log(AssetPC);

    this.dataSourcePC = new MatTableDataSource(AssetPC)
    this.dataSourcePC.paginator = this.paginator1;
    this.dataSourcePC.sort = this.sortCol1;

    this.dataSourceMouse = new MatTableDataSource(AssetMouse)
    this.dataSourceMouse.paginator = this.paginator2;
    this.dataSourceMouse.sort = this.sortCol2;

    this.dataSourceKeyPad = new MatTableDataSource(AssetKeypad)
    this.dataSourceKeyPad.paginator = this.paginator3;
    this.dataSourceKeyPad.sort = this.sortCol3;


    this.ngxService.stop()
    let asdasd = this.ITAsset.filter((d:any)=>d.status_return=="unavailable")

  }




  applyFilter1() {
    this.dataSourcePC.filter = this.inputFilter.trim().toLowerCase();
    if (this.dataSourcePC.paginator) {
      this.dataSourcePC.paginator.firstPage();
    }
  }
  applyFilter2() {
    this.dataSourceMouse.filter = this.inputFilter.trim().toLowerCase();
    if (this.dataSourceMouse.paginator) {
      this.dataSourceMouse.paginator.firstPage();
    }
  }
  applyFilter3() {
    this.dataSourceKeyPad.filter = this.inputFilter.trim().toLowerCase();
    if (this.dataSourceKeyPad.paginator) {
      this.dataSourceKeyPad.paginator.firstPage();
    }
  }

  // delAssetByID(data: any)

  def_view(item: any) {
    let closeDialog = this.dialog.open(MasterItAssetEditComponent, {
      autoFocus: false,
      width: '1200px',
      maxHeight: '90vh',
      data: item,
      disableClose: true
    });
    closeDialog.afterClosed().subscribe(async close => {
      if (close == "success") {

      }
    })
  }





  async def_black_true(item: any) {
    Swal.close()
    Swal.fire({
      title: `Do you want to blacklist (${item}) ?`,
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
            }).then(async () => {
              const reason = result.value;
              let id = await lastValueFrom(this.api.getAssetByID({ "Host Name": item }))
              id = id.map((d: any) => {
                return {
                  ...d,
                  blacklist: 'T',
                  reason: reason
                }
              })
              let update = await lastValueFrom(this.api.updateAsset(id[0]._id, id[0]))
              this.ITAsset = await lastValueFrom(this.api.getAssetIT())
            })
          }
        });
        //code end
      }
    })


  }

  async def_black_false(item: any) {
    Swal.fire({
      title: `Do you want to unlock (${item}) ?`,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let id = await lastValueFrom(this.api.getAssetByID({ "Host Name": item }))
        id = id.map((d: any) => {
          return {
            ...d,
            blacklist: 'F',
            reason: ""
          }
        })
        let update = await lastValueFrom(this.api.updateAsset(id[0]._id, id[0]))
        //code end
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500,
        }).then(async () => {
          this.ITAsset = await lastValueFrom(this.api.getAssetIT())
        })
      }
    })

  }


  //TODO Don't Remove
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
      // console.log(data);
      this.MasterData(wb, data)
      // this.ImportExcelList(evt, wb, data)

    };
    reader.readAsBinaryString(target.files[0]);
    let id_import = document.getElementById("files") as HTMLInputElement
    id_import.value = ""
  }

  def_import_mouse(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const data: any[] = []
      const files = evt.target.files
      data.push(...files)
      this.MasterAssetMouse(wb, data)
    };
    reader.readAsBinaryString(target.files[0]);
    let id_import = document.getElementById("files") as HTMLInputElement
    id_import.value = ""
  }

  def_import_keypadkeyboard(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const data: any[] = []
      const files = evt.target.files
      data.push(...files)
      this.MasterAssetKeypadKeyboard(wb, data)
    };
    reader.readAsBinaryString(target.files[0]);
    let id_import = document.getElementById("files") as HTMLInputElement
    id_import.value = ""
  }



  async MasterData(wb: any, data: any) {
    const ws: XLSX.WorkSheet = wb.Sheets['OfficePC'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      this.ngxService.start()
      let header
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

      let rawdata = []
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
        rawdata.push(data_raw)

      }

      let database_asset = await lastValueFrom(this.api.AssetPCGetAll())
      let group_A = []
      if (database_asset.length) { group_A = database_asset.map((d: any) => d["Host Name"]) }
      let group_B = rawdata.map((d: any) => d["Host Name"])
      let group_asset = group_A.concat(group_B)
      const unique = [...new Set(group_asset.map((item: any) => item))];

      for (const name of unique) {
        if (rawdata.filter((d: any) => d["Host Name"] == name).length != 0) {
          if (database_asset.filter((d: any) => d["Host Name"] == name).length != 0) {
            //upload
            let id = database_asset.filter((d: any) => d["Host Name"] == name)
            let data = rawdata.filter((d: any) => d["Host Name"] == name)
            let Update = await lastValueFrom(this.api.AssetPCUpdate(id[0]._id, data[0]))
          } else {
            //add
            let data = rawdata.filter((d: any) => d["Host Name"] == name)
            let Adddate = await lastValueFrom(this.api.AssetPCAdd(data[0]))
            // console.log(data[0]);
          }
        } else {
          // let data = rawdata.filter((d: any) => d["Host Name"] == name)
          let delDel = await lastValueFrom(this.api.AssetPCDelByID({ "Host Name": name }))

          //del
        }

      }
      this.CheckUpdateMaster()
    }
  }

  async MasterAssetMouse(wb: any, data: any) {
    const ws: XLSX.WorkSheet = wb.Sheets['Mouse'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      this.ngxService.start()
      let header
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let startRow = 3
      header = this.dataExcel[startRow - 1].map((d: any) => {
        let text = d.replaceAll('.', '')
        let text2 = text.replaceAll('\r\n', '')
        return text2.trim()
      })

      let data_raw: any = {}
      let max_row: any


      for (let index = startRow; index < this.dataExcel.length; index++) {
        max_row = this.dataExcel.length
        if (this.dataExcel[index].length == 0) {
          max_row = index
          break
        }
      }

      // console.log(max_row);
      let rawdata = []
      for (let index = startRow; index < max_row; index++) {
        data_raw = {}
        for (const [i, item] of this.dataExcel[index].entries()) {
          let datanew = item
          if (item == undefined || item == "") {
            datanew = "-"
          }
          data_raw[header[i]] = datanew
        }
        rawdata.push(data_raw)
      }

      let database_asset = await lastValueFrom(this.api.AssetMouseGetAll())
      // console.log("🚀 ~ file: master-it-asset.component.ts:576 ~ MasterAssetMouse ~ database_asset:", database_asset)
      let group_A = []
      if (database_asset.length) { group_A = database_asset.map((d: any) => d["Control Code"]) }
      let group_B = rawdata.map((d: any) => d["Control Code"])
      let group_asset = group_A.concat(group_B)
      const unique = [...new Set(group_asset.map((item: any) => item))];


      for (const name of unique) {
        if (rawdata.filter((d: any) => d["Control Code"] == name).length != 0) {
          if (database_asset.filter((d: any) => d["Control Code"] == name).length != 0) {
            //upload
            let id = database_asset.filter((d: any) => d["Control Code"] == name)
            let data = rawdata.filter((d: any) => d["Control Code"] == name)
            let Update = await lastValueFrom(this.api.AssetMouseUpdate(id[0]._id, data[0]))
          } else {
            //add
            let data = rawdata.filter((d: any) => d["Control Code"] == name)
            let Adddate = await lastValueFrom(this.api.AssetMouseAdd(data[0]))
            // console.log(data[0]);
          }
        } else {
          // let data = rawdata.filter((d: any) => d["Control Code"] == name)
          let delDel = await lastValueFrom(this.api.AssetMouseDelByID({ "Control Code": name }))

          //del
        }

      }
      this.CheckUpdateMaster()
    }
  }

  async MasterAssetKeypadKeyboard(wb: any, data: any) {

    const ws: XLSX.WorkSheet = wb.Sheets['Keypad-Keyboard'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      this.ngxService.start()
      let header
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let startRow = 3
      header = this.dataExcel[startRow - 1].map((d: any) => {
        let text = d.replaceAll('.', '')
        let text2 = text.replaceAll('\r\n', '')
        return text2.trim()
      })

      let data_raw: any = {}
      let max_row: any

      for (let index = startRow; index < this.dataExcel.length; index++) {
        max_row = this.dataExcel.length
        if (this.dataExcel[index][1] == undefined) {
          max_row = index
          break
        }
      }

      let rawdata = []
      for (let index = startRow; index < max_row; index++) {
        data_raw = {}
        for (const [i, item] of this.dataExcel[index].entries()) {
          let datanew = item
          if (item == undefined || item == "") {
            datanew = "-"
          }
          data_raw[header[i]] = datanew
        }
        rawdata.push(data_raw)
      }

      let database_asset = await lastValueFrom(this.api.AssetKeypadKeyboardGetAll())
      let group_A = []
      if (database_asset.length) { group_A = database_asset.map((d: any) => d["Control Code"]) }
      let group_B = rawdata.map((d: any) => d["Control Code"])
      let group_asset = group_A.concat(group_B)
      const unique = [...new Set(group_asset.map((item: any) => item))];

      for (const name of unique) {
        if (rawdata.filter((d: any) => d["Control Code"] == name ).length != 0) {
          if (database_asset.filter((d: any) => d["Control Code"] == name).length != 0) {
            let id = database_asset.filter((d: any) => d["Control Code"] == name)
            let data = rawdata.filter((d: any) => d["Control Code"] == name)
            let Update = await lastValueFrom(this.api.AssetKeypadKeyboardUpdate(id[0]._id, data[0]))
          } else {
            let data = rawdata.filter((d: any) => d["Control Code"] == name)
            let Adddate = await lastValueFrom(this.api.AssetKeypadKeyboardAdd(data[0]))
          }
        } else {
          let delDel = await lastValueFrom(this.api.AssetKeypadKeyboardDelByID({ "Control Code": name }))
        }
      }
      this.CheckUpdateMaster()
    }
  }




  return_force(d: any, e: any) {
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
              asset: d,
              reason: reason,
              asset_type: e
            }
            // let res = await lastValueFrom(this.api.Mail_Return_Force(data))
          }
        });
        //code end
      }
    })
  }

  async CheckUpdateMaster() {
    let database_PC = await lastValueFrom(this.api.AssetPCGetAll())
    let database_Mouse = await lastValueFrom(this.api.AssetMouseGetAll())
    let database_Keypad = await lastValueFrom(this.api.AssetKeypadKeyboardGetAll())
    let database_asset = await lastValueFrom(this.api.getAssetIT())
    let group_1: [] = database_PC.map((d: any) => {
      return {
        "Host Name": d["Host Name"],
        "Type": d["Type"],
      }
    })
    let group_2: [] = database_Mouse.map((d: any) => {
      return {
        "Host Name": d["Control Code"],
        "Type": "Mouse",
      }
    })
    let group_3: [] = database_Keypad.map((d: any) => {
      return {
        "Host Name": d["Control Code"],
        "Type": "Keypad Keyboard",
      }
    })

    let group_4: [] = database_asset.map((d: any) => {
      return {
        "Host Name": d["Host Name"],
        "Type": d["Type"],
      }
    })
    let ITassetList = group_1.concat(group_2).concat(group_3).concat(group_4)
    let ITassetNew = group_1.concat(group_2).concat(group_3)
    const unique = [...new Set(ITassetList.map((item: any) => item["Host Name"]))];
    let id = database_asset.filter((d: any) => d["Host Name"] == unique[0])


    for (const name of unique) {
      if (ITassetNew.filter((d: any) => d["Host Name"] == name).length != 0) {
        if (database_asset.filter((d: any) => d["Host Name"] == name).length != 0) {
          //upload
          // console.log("111");

          let id = database_asset.filter((d: any) => d["Host Name"] == name)
          let data = ITassetList.filter((d: any) => d["Host Name"] == name)
          let Update = await lastValueFrom(this.api.updateAsset(id[0]._id, data[0]))
        } else {
          // console.log("222");

          //add
          let data: any = ITassetList.filter((d: any) => d["Host Name"] == name)
          data[0].status_return = "available"
          data[0].status_latest_user = ""
          data[0].status_latest_period = ""
          data[0].status_latest_date = ""
          data[0].blacklist = "F"
          data[0].reason = ""
          let Adddate = await lastValueFrom(this.api.addAsset(data[0]))
          // console.log(data[0]);
        }
      } else {
        // console.log("333");

        let delDel = await lastValueFrom(this.api.delAssetByID({ "Host Name": name }))

        //del
      }

    }
    this.ngxService.stop()
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Success',
      showConfirmButton: false,
      timer: 1500,
    }).then(()=>{
      window.location.reload()
    })


  }

  select() {

  }

  Blacklist(e: any) {
    let data = this.ITAsset.filter((d: any) => d['Host Name'] == e)
    if (data[0]?.blacklist == "F") {
      return true
    } else {
      return false
    }
  }

  ReturnForce(e: any) {
    let data = this.ITAsset.filter((d: any) => d['Host Name'] == e)
    if (data[0]?.status_return == "unavailable") {
      return true
    } else {
      return false
    }
  }


}
