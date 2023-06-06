import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  open: boolean = false
  title = 'IS-asset-takeout';
  showFiller = false;

  name: any
  CheckLogin: any

  ngOnInit(): void {
    this.CheckLogin = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    this.name = this.CheckLogin?.name

  }


  logout() {
    let data = localStorage.removeItem("IT-asset-takeout-login");
    window.location.reload()
  }




}
