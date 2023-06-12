import * as moment from 'moment';
import { HttpService } from 'src/app/service/http.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-log-book-detail',
  templateUrl: './log-book-detail.component.html',
  styleUrls: ['./log-book-detail.component.scss']
})
export class LogBookDetailComponent {

  assetItem: any = []
  show : boolean = false


  constructor(
    private api: HttpService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private api : HttpService
  ) { }


  async ngOnInit(): Promise<void> {
    let item = await lastValueFrom(this.api.getAssetIT())
    let item_1 = item.filter((d: any) => d["Host Name"] == (this.data.ITassetsNo_1?.toUpperCase() && this.data.ITassetsNo_1?.toLowerCase()) );
    let item_2 = item.filter((d: any) => d["Host Name"] == (this.data.ITassetsNo_2?.toUpperCase() && this.data.ITassetsNo_2?.toLowerCase()) );
    let item_3 = item.filter((d: any) => d["Host Name"] == (this.data.ITassetsNo_3?.toUpperCase() && this.data.ITassetsNo_3?.toLowerCase()) );
    this.assetItem = item_1.concat(item_2).concat(item_3)

  }


}
