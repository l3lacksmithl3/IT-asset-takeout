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


  Applicant: any = []
  Executor: any = []
  ItExecutor: any = []
  comment: any = {}

  ShowComment: any = []

  constructor(
    private api: HttpService,
    private dialog: MatDialog,
    private route: Router
  ) { }


  async ngOnInit(): Promise<void> {
    let id = JSON.parse(`${localStorage.getItem("IT-asset-takeout-ViewApprove")}`)
    let res = await lastValueFrom(this.api.getDataApprove({ _id: id }))
    this.data = res[0]
    if (this.data) {
      let flow = await lastValueFrom(this.api.getSectionBySection({ section: this.data.section }))
      let flowIT = await lastValueFrom(this.api.getSectionITBySection({ section: "IT-SP" }))
      this.Applicant = this.data
      this.Executor = flow[0].value
      this.ItExecutor = flowIT[0].value
      var format = 'YYYY/MM/DD HH:mm:ss';
      this.Applicant.FromDate = moment(this.Applicant.FromDate).format(format)

    }
    for (const item of this.data.Executor) {
      if (item.status == "Reject") {
        this.comment.name = item.name
        this.comment.value = item.Comment
        this.comment.time = moment(item.lastUpdate).format("YYYY/MM/DD HH:mm:ss")
      }
    }
    for (const item of this.data.IT) {
      if (item.status == "Reject") {
        this.comment.name = item.name
        this.comment.value = item.Comment
        this.comment.time = moment(item.lastUpdate).format("YYYY/MM/DD HH:mm:ss")
      }
    }


    this.ShowCommentForHistory()
  }



  ShowCommentForHistory() {
    console.log(this.data);
    let Executor = this.data.Executor.filter((d:any) => d.status == "Approve")
    let IT = this.data.IT.filter((d:any) => d.status == "Approve")
    this.ShowComment = Executor.concat(IT)
    this.ShowComment = this.ShowComment.map((d:any)=>{

      return{
        ...d,
        name : d.name,
        value : d.Comment,
        time : moment(d.lastUpdate).format("YYYY/MM/DD HH:mm:ss")
      }
    })
    console.log(this.ShowComment);
  }

}
