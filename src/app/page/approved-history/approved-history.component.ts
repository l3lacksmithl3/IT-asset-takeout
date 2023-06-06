import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-approved-history',
  templateUrl: './approved-history.component.html',
  styleUrls: ['./approved-history.component.scss']
})
export class ApprovedHistoryComponent {


  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  data: any = []
  user: any

  constructor(
    private api: HttpService,
    private route: Router,
    // private dialog: MatDialogRef<any>,
    // @Inject(MAT_DIALOG_DATA) public data: any,s
  ) { }



  async ngOnInit(): Promise<void> {
    this.user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let rew = await lastValueFrom(this.api.getDataApprove({ Approve_Step: 3 }))
    for (const item of rew) {
      let record = item.Executor.concat(item.IT)
      let user = record.filter((d: any) => d.employee == this.user.employee)
      if (user.length > 0) {
        this.data.push(item)
      }
    }
    this.data = this.data.map((d: any) =>{
      return{
        ...d,
        Apply_Date : moment(d.Apply_Date).format('YYYY/MM/DD HH:mm:ss')

      }
    });

    this.data = this.sort(this.data, "Apply_Date")

    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.paginator = this.paginator;

  }


  view(item: any) {
    let set1 = localStorage.setItem("IT-asset-takeout-ViewApprove", JSON.stringify(item))
    this.route.navigate(['/ApplicationProgress']).then((v: any) => {
    })

  }


  sort(array: any, key: any) {
    array = array.sort(function (a: any, b: any) {
      return b[key].localeCompare(a[key])
    })
    return array
  }

}
