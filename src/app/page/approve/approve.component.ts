import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent {

  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6'];
  dataSource = new MatTableDataSource
  data: any[] = []
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  constructor(
    private api: HttpService,
    private route: Router,
    // private dialog: MatDialogRef<any>,
    // @Inject(MAT_DIALOG_DATA) public data: any,s

  ) { }


  async ngOnInit(): Promise<void> {

    let dateRaw = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let listApprove = await lastValueFrom(this.api.getDataApproveAll())

    for (const list of listApprove) {
      // console.log(list);
      // YYYY/MM/DD HH:mm:ss
      list.Apply_Date = moment(list.Apply_Date).format("YYYY/MM/DD")
      list.Last_Apply_Date = moment(list.Last_Apply_Date).format("YYYY/MM/DD HH:mm:ss")
      if (list.Approve_Step == 1 && list.Approve_Status == "standby") {
        for (const item of list.Executor) {
          if (item.name == dateRaw.name) {
            this.data.push(list)
            continue
          }
        }
      }
      if (list.Approve_Step == 2 && list.Approve_Status == "Approve" ) {
        for (const item of list.IT) {
          if (item.name == dateRaw.name) {
            this.data.push(list)
            continue
          }
        }
        console.log(list);

      }

    }
    this.data = this.sort(this.data, "createdAt")
    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.paginator = this.paginator;

  }


  view(item: any) {
    // console.log(item);
    let set1 = localStorage.setItem("IT-asset-takeout-ViewApprove", JSON.stringify(item))
    this.route.navigate(['/ApproveFormConfirm']).then((v: any) => {
    })
    // ApplicationProgress
  }

  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return b[key].localeCompare(a[key])
    })
    return array
  }

}
