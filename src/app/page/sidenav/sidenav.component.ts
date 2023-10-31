import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  interval: any;
  levelID: any[] = []
  apply: any
  page: any
  record: any
  user: any
  data: any = []
  logbook: any
  currentPage: any
  Inventory: any
  logbook_head:any

  blacklist: boolean = false
  inventory_count:any

  item_approve: any = []


  admin: any

  @Output() dataChange: EventEmitter<any> = new EventEmitter()

  constructor(
    private api: HttpService,
    private route: Router,
    private rou: ActivatedRoute
  ) { }


  async ngOnInit(): Promise<void> {


    let level = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)

    // console.log("🚀 ~ file: sidenav.component.ts:18 ~ SidenavComponent ~ ngOnInit ~ level:", level)
    if (level.access == "admin") {
      this.levelID = [1, 1]
      // this.levelID = [0, 1]

    }
    if (level.access == "employee") {
      this.levelID = [0, 1]
      // this.levelID = [1, 1]
    }



    //admin
    if (this.levelID[0] == 1 && this.levelID[1] == 1) {
      this.Inventory = [
        { path: '/Inventory', title: 'Inventory', icon: 'assets/inventory.png', class: '' },
      ]
      this.apply = [
        await this.check_blacklist(level) == false ?
          { path: '/ITAssetTakeout', title: 'Takeout application', icon: 'assets/Takeout.png', class: '' } :
          { path: '/Error', title: 'Takeout application', icon: 'assets/Takeout.png', class: '' },
        { path: '/ItAssetReturn', title: 'Return & Extend application', icon: 'assets/return.png', class: '' },
      ]
      this.record = [
        { path: '/AppliedList', title: 'Applied', icon: 'assets/applied.png', class: '' },
        { path: '/ApprovedHistory', title: 'Approved', icon: 'assets/approval.png', class: '' },
      ]
      this.page = [
        { path: '/Approve', title: 'Request approval', icon: 'assets/approved.png', class: '' },
      ]
      this.admin = [
        { path: '/LogBookRecord', title: 'Log book record', icon: 'assets/logbook.png', class: '' },
        { path: '/MasterITAsset', title: 'Master IT Asset', icon: 'assets/master.png', class: '' },
        // { path: '/MasterSection', title: 'Master Section Head.', icon: 'assets/Section Head.png', class: '' },
        { path: '/MasterOrganization', title: 'Master Organization', icon: 'assets/Section Head.png', class: '' },
        { path: '/EmailForm', title: 'Email', icon: 'assets/email.png', class: '' },
        { path: '/Blacklist', title: 'Black List', icon: 'assets/blacklist.png', class: '' },
      ]

      if (level.level > 1) {
        this.logbook_head = [
          { path: '/Logbook', title: 'Log book', icon: 'assets/logbook.png', class: '' },
        ]
      }

    }

    //employee
    if (this.levelID[0] == 0 && this.levelID[1] == 1) {
      this.Inventory = [
        { path: '/Inventory', title: 'Inventory', icon: 'assets/inventory.png', class: '' },
      ]
      this.apply = [
        await this.check_blacklist(level) == false ?
          { path: '/ITAssetTakeout', title: 'Takeout application', icon: 'assets/Takeout.png', class: '' } :
          { path: '/Error', title: 'Takeout application', icon: 'assets/Takeout.png', class: '' },

        { path: '/ItAssetReturn', title: 'Return & Extend application', icon: 'assets/return.png', class: '' },
      ]
      this.record = [
        { path: '/AppliedList', title: 'Applied', icon: 'assets/applied.png', class: '' },
        { path: '/ApprovedHistory', title: 'Approved', icon: 'assets/approval.png', class: '' },
      ]
      this.page = [
        { path: '/Approve', title: 'Request approval', icon: 'assets/approved.png', class: '' },
      ]
      if (level.level > 1) {
        this.logbook_head = [
          { path: '/Logbook', title: 'Log book', icon: 'assets/logbook.png', class: '' },
        ]
      }
    }


    this.CheckApprove()
    this.inventory_counts()

    //set update date in server
    let data_old = ""
    setInterval(async () => {
      let ck = await lastValueFrom(this.api.updateAt())
      if (ck != null) {
        if (data_old != ck.toString()) {
          data_old = ck.toString()
          this.CheckApprove()
          this.inventory_counts()
        }
      }
    }, 5000)



  }

  async check_blacklist(e: any) {
    let data = await lastValueFrom(this.api.Black_List_Get_ByCondition({ employee: e.employee }))
    if (data.length != 0) {
      this.blacklist = true
    } else {
      this.blacklist = false
    }
    return this.blacklist
  }



  ngOnDestroy(): void { clearInterval(this.interval) }

  onClick() {
    // this.dataChange.emit()
    // setTimeout(() => {
    //   window.location.reload()
    // }, 500);
  }


  async CheckApprove() {
    this.user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let data_organization = await lastValueFrom(this.api.MasterOrganization_ByCondition({ code: { $in: [`${this.user.position_code}`, Number(this.user.position_code)] } }))

    let NewFormate = data_organization.map((d: any) => {
      return d.code
    })
    let result
    let flattenedData
    let level = 1
    if (this.user.level == 4) {
      flattenedData = NewFormate.reduce((acc: any, row: any) => acc.concat(row.slice(level, 2)), []);
      result = [...new Set(flattenedData)];
    } else {
      if (this.user.level == 1) { level = 4 }
      if (this.user.level == 2) { level = 3 }
      if (this.user.level == 3) { level = 2 }
      flattenedData = NewFormate.reduce((acc: any, row: any) => acc.concat(row.slice(level, 4)), []);
      result = [...new Set(flattenedData)];
    }


    result = result.map((e: any) => {
      if (typeof e == 'string') {
        return e
      }else{
        return JSON.stringify(e)
      }
    })





    let filter = {
      $or: [
        { 'takeout.position_code': { $in: result }, "takeout.Approve_Step": 1 },
        { 'return.position_code': { $in: result }, "return.Approve_Step": 1 }
      ]
    }

    // this.item_approve
    let rew = await lastValueFrom(this.api.getDataApprove(filter))
    let list = []
    for (const item of rew) {

      if (item.return) {
        //return
        for (let index = item.return.count_return; index >= 1; index--) {
          if (item.return[`return_${index}`] && !item.return[`return_${index}`].some((e: any) => e.Approve_employee != undefined)) {
            list.push({
              id: item._id,
              ControlID: item.ControlID,
              "Business Model": "IT asset return",
              Value: item.return,
              type: index,
              item: item.return[`return_${index}`]?.length
            })
          }
        }
      }
      if (item.extend) {
        //extend
        for (let index = item.extend.count_extend; index >= 1; index--) {
          if (item.extend[`extend_${index}`] && !item.extend[`extend_${index}`].some((e: any) => e.Approve_employee != undefined)) {
            list.push({
              id: item._id,
              ControlID: item.ControlID,
              "Business Model": "IT asset extend",
              Value: item.extend,
              type: index,
              item: item.extend[`extend_${index}`]?.length
            })
          }
        }
      };
      if (item.takeout) {
        list.push({
          id: item._id,
          ControlID: item.ControlID,
          "Business Model": "IT asset takeout application form",
          Value: item.takeout
        })
      };


    }
    this.item_approve = list.filter((d: any) => d.Value.Approve_Step == 1)
    // console.log(this.item_approve);

  }

  refresh(){
    window.location.reload()
  }


  async inventory_counts(){
    let login = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    let filter = {
      'takeout.Approve_Step': {
        '$in': [
          2
        ]
      },
      'takeout.email': {
        '$in': [
          login.email
        ]
      },
      'return.Approve_Step': {
        '$in': [
          1
        ]
      },
    }

    let job = await lastValueFrom(this.api.getDataApprove(filter))

    let data = []
    for (const list of job) {
      if (list?.return) {
        for (const item of list?.return?.item) {
          item.requester = list?.return.name
          item.ControlID = list?.ControlID
          item.updatedAt = list?.updatedAt
          item.CorpDivDep = list?.return?.CorpDivDep
          item.reason = list?.return?.Reason
          data.push(item)
        }
      } else {
        for (const item of list?.takeout?.item) {
          item.requester = list?.takeout.name
          item.ControlID = list?.ControlID
          item.updatedAt = list?.updatedAt
          item.CorpDivDep = list?.takeout?.CorpDivDep
          item.reason = list?.takeout?.Reason
          data.push(item)
        }
      }
    }
    this.inventory_count = data.filter((d:any)=>d?.return_approve != true)
  }

}
