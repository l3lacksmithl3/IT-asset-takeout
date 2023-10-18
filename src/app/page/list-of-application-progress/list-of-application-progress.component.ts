import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-list-of-application-progress',
  templateUrl: './list-of-application-progress.component.html',
  styleUrls: ['./list-of-application-progress.component.scss']
})
export class ListOfApplicationProgressComponent {

  head: any = []
  data: any = []
  user: any

  Applicant: any = []
  Executor: any = []
  ItExecutor: any = []
  comment: any = {}

  ShowComment: any = []
  show:boolean = true

  constructor(
    private api: HttpService,
    private dialog: MatDialog,
    private route: Router
  ) { }


  async ngOnInit(): Promise<void> {

  }



  ShowCommentForHistory() {
    let Executor = this.data.Executor.filter((d: any) => d.status == "Approve")
    let IT = this.data.IT.filter((d: any) => d.status == "Approve")
    this.ShowComment = Executor.concat(IT)
    this.ShowComment = this.ShowComment.map((d: any) => {

      return {
        ...d,
        name: d.name,
        value: d.Comment,
        time: moment(d.lastUpdate).format("YYYY/MM/DD HH:mm:ss")
      }
    })
    setTimeout(() => {
      this.show = false
    }, 1000);

    // console.log(this.ShowComment);
  }

}
