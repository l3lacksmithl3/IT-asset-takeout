import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  levelID: any[] = []
  apply:any
  page:any
  record:any

  @Output() dataChange : EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
    let level = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    // console.log("🚀 ~ file: sidenav.component.ts:18 ~ SidenavComponent ~ ngOnInit ~ level:", level)
    if (level.access == "admin") {
      this.levelID = [1, 1]
    }
    if (level.access == "employee") {
      this.levelID = [0, 1]
    }



    if (this.levelID[0] == 1 && this.levelID[1] == 1) {
      this.page = [
        { path: '/ITAssetTakeout', title: 'Apply', icon: 'assets/user.png', class: '' },
        { path: '/AppliedList', title: 'Applied', icon: 'assets/user.png', class: '' },
        { path: '/Approve', title: 'Approved', icon: 'assets/user.png', class: '' },
      ]
      this.record = [
        { path: '/Approve', title: 'Approved', icon: 'assets/user.png', class: '' },
        { path: '/Approve', title: 'Approved', icon: 'assets/user.png', class: '' },
      ]
    }

    if (this.levelID[0] == 0 && this.levelID[1] == 1) {
      this.apply = [
        { path: '/ITAssetTakeout', title: 'Takeout application form', icon: 'assets/user.png', class: '' },
        { path: '/', title: 'Return confirmation', icon: 'assets/user.png', class: '' },
      ]
      this.record = [
        { path: '/AppliedList', title: 'Applied', icon: 'assets/user.png', class: '' },
        { path: '/ApprovedHistory', title: 'Approved', icon: 'assets/user.png', class: '' },
      ]
      this.page = [
        { path: '/Approve', title: 'Approved', icon: 'assets/user.png', class: '' },
      ]
    }

  }

  onClick(){
    this.dataChange.emit()
    // setTimeout(() => {
    //   window.location.reload()
    // }, 100);
  }



}
