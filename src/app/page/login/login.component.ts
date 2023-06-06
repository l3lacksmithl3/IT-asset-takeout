import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  data: any = {}
  employee: any

  constructor(
    private api: HttpService,
    private dialog: MatDialog,
    private route: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.employee = await lastValueFrom(this.api.MasterUserAll())
  }

  async submit() {
    let data = {
      employee: this.data.username || "-",
      password: this.data.password || "-"
    }

    let login = this.employee.filter((d: any) =>
      d.employee == data.employee &&
      d.password == data.employee
    )
    let code = await this.getCode(login[0].department)
    login[0].code_abbname = code[0].code_abbname
    login[0].code_fullname = code[0].code_fullname


    if (login.length > 0) {
      if (login[0].employee == "Admin") {
        login[0].access = "admin"
      } else {
        login[0].access = "employee"
      }
      setTimeout(() => {
        this.route.navigate(['/AppliedList']).then((v: any) => {
          window.location.reload()
          let res = localStorage.setItem("IT-asset-takeout-login", JSON.stringify(login[0]))
        })
      }, 1500);
    }

  }


  async getUserByDepartment(code: any) {
    let data = await lastValueFrom(this.api.MasterUserAll())
    return data.filter((d: any) => d.department == code)
  }

  async getUser(user: any) {
    let data = await lastValueFrom(this.api.MasterUserAll())
    return data.filter((d: any) => d.employee == user)
  }

  async getCode(code: any) {
    let data = await lastValueFrom(this.api.MasterCode())
    return data.filter((d: any) => d.code == code)
  }


}

