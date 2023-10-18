import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-black-list-alert',
  templateUrl: './black-list-alert.component.html',
  styleUrls: ['./black-list-alert.component.scss']
})
export class BlackListAlertComponent implements OnInit {

  constructor(
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.ngxService.stop();
  }

}
