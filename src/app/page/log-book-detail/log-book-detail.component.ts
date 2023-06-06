
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


  constructor(
    private api: HttpService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private api : HttpService
  ) { }


  async ngOnInit(): Promise<void> {
    console.log(this.data);

  }


}
