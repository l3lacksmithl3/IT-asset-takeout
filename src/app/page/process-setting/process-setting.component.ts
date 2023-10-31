import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/service/http.service';
import { ApprovalPropertyComponent } from '../approval-property/approval-property.component';
import { lastValueFrom } from 'rxjs';
import { ApprovalPropertyItComponent } from '../approval-property-it/approval-property-it.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-process-setting',
  templateUrl: './process-setting.component.html',
  styleUrls: ['./process-setting.component.scss']
})
export class ProcessSettingComponent {
  todo: any
  done: any
  IT: any
  bin: any

  idSection: any
  idSectionIT: any
  approvalData: any = {}
  approvalDataIT: any = {}

  section: any

  constructor(
    private api: HttpService,
    private dialog: MatDialog,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.bin = []
    this.todo = [
      {
        name: "",
        position: "Dep. Head",
        permission: "Approve",
        level: 0
      },
    ];
    let getDataUser = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
    this.section = getDataUser.section
    this.done = [];
    this.IT = [];
    this.getApprove()
    this.getApproveIT()
  }



  async getApprove() {
    let data = {
      section: this.section
    }
    let res = await lastValueFrom(this.api.getSectionBySection(data))
    if (res.length > 0) {
      this.idSection = res[0]?._id
      this.done = []
      for (const item of res[0]?.value) {
        this.done.push(item)
      }
    }
  } //set this.done user


  async getApproveIT() {
    let data = {
      section: "IT-SP"
    }
    let res = await lastValueFrom(this.api.getSectionITBySection(data))
    if (res.length > 0) {
      this.idSectionIT = res[0]?._id
      this.IT = []
      for (const item of res[0]?.value) {
        this.IT.push(item)
      }

    }
  } //set this.done user



  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.todo = [
      {
        name: "",
        position: "Dep. Head",
        permission: "Approve",
        level: 0
      },
    ];
  }

  // setting(d:any){
  //   alert(d.name)
  // }

  setting(item: any, index: any, type: string) {
    item.section = this.section
    item.type = type
    let closeDialog = this.dialog.open(ApprovalPropertyComponent, {
      width: '300px',
      data: item,
    });
    closeDialog.afterClosed().subscribe(close => {
      // console.log(close);
      if (type == 'user') {
        // this.approvalData.data = close
        // this.approvalData.index = index
        if (close) {
          this.done[index] = close
        }
      }
    })
  }

  settingIt(item: any, index: any, type: string) {
    item.section = 'IT-SP'
    item.type = type
    let closeDialog = this.dialog.open(ApprovalPropertyItComponent, {
      width: '300px',
      data: item,
    });
    closeDialog.afterClosed().subscribe(close => {
      // console.log(close);
      if (type == 'it') {
        // this.approvalDataIT = close
        if (close) {
          this.IT[index] = close
        }
      }
    })
  }



  apple() {
    Swal.close()
    Swal.fire({
      title: 'Do you want to update data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start


        let data = {
          section: this.section,
          value: this.done
        }
        let update = lastValueFrom(this.api.updateSection(this.idSection, data))

        //;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

        let dataIT = {
          section: 'IT-SP',
          value: this.IT
        }
        let updateIT = lastValueFrom(this.api.updateSectionIT(this.idSectionIT, dataIT))

        //code end
        setTimeout(() => {
          Swal.close()
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })


  }


  back() {
    this.route.navigate(['/ITAssetTakeout']).then((v: any) => {
    })
  }





}

//
