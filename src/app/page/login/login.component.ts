import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { lastValueFrom, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, PopupRequest, RedirectRequest, EventMessage, EventType } from '@azure/msal-browser';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  data: any = {}
  employee: any
  isIframe = false;
  loginDisplay = false;
  profile: any
  appRoles: any
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private api: HttpService,
    private dialog: MatDialog,
    private route: Router,
    private router: ActivatedRoute,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) { }





  async ngOnInit(): Promise<void> {
    this.employee = await lastValueFrom(this.api.MasterUserAll())



    // let profile = await this.getProfile()
    // this.submit(profile)
  }


  async login_sso(){
    let list = {
      username: this.data.username || "-",
      password: this.data.password || "-"
    }
    let login = await lastValueFrom(this.api.SSO_login(list))
    login = this.employee.filter((d: any) => d.employee == login.description )


    let code = await this.getCode(login[0]?.department)
    if (code.length != 0) {
      login[0].code_abbname = code[0]?.code_abbname
      login[0].code_fullname = code[0]?.code_fullname
      switch (login[0].employee) {
        case "TH0688/22":
        case "TH0512/17":
        case "TH0695/23":
        case "TH0145/03":
        case "TH0511/17":
          this.showRoleSelection(login);
          break;

        default:
          login[0].access = "employee";
          this.login_select(login);
          break;
      }
    }else{
      this.loginFail()
    }
  }


  async submit() {
    let data = {
      employee: this.data.username || "-",
      password: this.data.password || "-"
    }


    let login = this.employee.filter((d: any) =>
      d.employee == data.employee &&
      d.password == data.password
    )


    let code = await this.getCode(login[0]?.department)

    if (code.length != 0) {
      login[0].code_abbname = code[0]?.code_abbname
      login[0].code_fullname = code[0]?.code_fullname

      // console.log(login[0].employee);

      switch (login[0].employee) {

        case "TH0688/22":
          this.showRoleSelection(login)
          break;//thaksin

        case "TH0512/17":
          this.showRoleSelection(login)
          break;//chon

        case "TH0695/23":
          this.showRoleSelection(login)
          break;//natthapong

        case "TH0145/03":
          this.showRoleSelection(login)
          break;//wichit p

        case "TH0511/17":
          this.showRoleSelection(login)
          break;//Aekasit  I.

        default:
          login[0].access = "employee"
          this.login_select(login)
          break;
      }
    }else{
      this.loginFail()
    }

  }


  showRoleSelection(login: any) {
    Swal.close()
    Swal.fire({
      // title: 'เลือกบทบาทของคุณ',
      // icon: 'question',
      showCancelButton: true,
      confirmButtonText: `ADMIN`,
      cancelButtonText: `  USER  `,
      reverseButtons: true,
      width: 200
    }).then(async (result) => {
      if (result.isConfirmed) {
        login[0].access = "admin"
        this.login_select(login)
      } else {
        login[0].access = "employee"
        this.login_select(login)
      }
    });
  }



  login_select(login: any) {
    if (login.length > 0) {
      this.loginSuccess()
      setTimeout(() => {
        this.router.queryParams.subscribe(async res => {


          let Check = await lastValueFrom(this.api.Master_Code_ByCondition({ "code_employee": login[0].employee }))
          console.log(Check);


          if (Check.length > 0) {
            if (Check[0].position == "corporate") { login[0].level = 4, login[0].position_code = `${Check[0].code}` }
            if (Check[0].position == "division") { login[0].level = 3, login[0].position_code = `${Check[0].code}` }
            if (Check[0].position == "department") { login[0].level = 2, login[0].position_code = `${Check[0].code}` }
            if (Check[0].position == "section") { login[0].level = 1, login[0].position_code = `${Check[0].code}` }
          } else {
            login[0].level = 1, login[0].position_code = login[0].department
          }

    
          if (res) {
            this.route.navigate(['/AppliedList'], { queryParamsHandling: 'preserve' }).then((v: any) => {
              window.location.reload()
              let res = localStorage.setItem("IT-asset-takeout-login", JSON.stringify(login[0]))
            })
          }
          if (res["id"] != null) {
            this.route.navigate(['/ApproveFormConfirm'], { queryParamsHandling: 'preserve' }).then((v: any) => {
              // window.location.reload()
              let res = localStorage.setItem("IT-asset-takeout-login", JSON.stringify(login[0]))
            })
          }
          if (res["id_1"] != null) {
            this.route.navigate(['/ApplicationProgress'], { queryParamsHandling: 'preserve' }).then((v: any) => {
              // window.location.reload()
              let res = localStorage.setItem("IT-asset-takeout-login", JSON.stringify(login[0]))
            })
          }
          if (res["mode"] != null) {
            this.route.navigate(['/ApproveFormConfirm'], { queryParamsHandling: 'preserve' }).then((v: any) => {
              // window.location.reload()
              let res = localStorage.setItem("IT-asset-takeout-login", JSON.stringify(login[0]))
            })
          }
          if (res["approve"] != null) {
            this.route.navigate(['/ApproveFormConfirm'], { queryParamsHandling: 'preserve' }).then((v: any) => {
              // window.location.reload()
              let res = localStorage.setItem("IT-asset-takeout-login", JSON.stringify(login[0]))
            })
          }
          if (res["approve-return"] != null) {
            this.route.navigate(['/ApproveReturn'], { queryParamsHandling: 'preserve' }).then((v: any) => {
              // window.location.reload()
              let res = localStorage.setItem("IT-asset-takeout-login", JSON.stringify(login[0]))
            })
          }
          if (res["approve-extend"] != null) {
            this.route.navigate(['/ApproveExtend'], { queryParamsHandling: 'preserve' }).then((v: any) => {
              // window.location.reload()
              let res = localStorage.setItem("IT-asset-takeout-login", JSON.stringify(login[0]))
            })
          }



        })
      }, 1000);
    }
  }


  loginSuccess() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully'
    })
  }

  loginFail() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'error',
      title: 'UserID &Password incorrect!'
    })
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



  // ----------------------------------------------------------------------------------------------------------------------------------------------------------//

  // start() {
  //   this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
  //   this.setLoginDisplay();

  //   this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
  //   this.msalBroadcastService.msalSubject$
  //     .pipe(
  //       filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
  //     )
  //     .subscribe((result: EventMessage) => {
  //       if (this.authService.instance.getAllAccounts().length === 0) {
  //         window.location.pathname = "/";
  //       } else {
  //         this.setLoginDisplay();
  //       }
  //     });

  //   this.msalBroadcastService.inProgress$
  //     .pipe(
  //       filter((status: InteractionStatus) => status === InteractionStatus.None),
  //       takeUntil(this._destroying$)
  //     )
  //     .subscribe(() => {
  //       this.setLoginDisplay();
  //       this.checkAndSetActiveAccount();
  //     })
  // }

  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  // checkAndSetActiveAccount() {
  //   /**
  //    * If no active account set but there are accounts signed in, sets first account to active account
  //    * To use active account set here, subscribe to inProgress$ first in your component
  //    * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
  //    */
  //   let activeAccount = this.authService.instance.getActiveAccount();

  //   if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
  //     let accounts = this.authService.instance.getAllAccounts();
  //     this.authService.instance.setActiveAccount(accounts[0]);
  //   }
  // }


  // loginRedirect() {
  //   if (this.msalGuardConfig.authRequest) {
  //     this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
  //   } else {
  //     this.authService.loginRedirect();
  //   }
  // }

  // loginPopup() {
  //   if (this.msalGuardConfig.authRequest) {
  //     this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
  //       .subscribe(async (response: AuthenticationResult) => {
  //         this.authService.instance.setActiveAccount(response.account);
  //         // console.log("1sss");

  //         let profile = await this.getProfile()
  //         this.submit(profile)



  //       });
  //   } else {
  //     this.authService.loginPopup()
  //       .subscribe((response: AuthenticationResult) => {
  //         this.authService.instance.setActiveAccount(response.account);
  //       });
  //   }
  // }

  // logout(popup?: boolean) {
  //   if (popup) {
  //     this.authService.logoutPopup({
  //       mainWindowRedirectUri: "/"
  //     });
  //   } else {
  //     this.authService.logoutRedirect();
  //   }
  // }

  // ngOnDestroy(): void {
  //   this._destroying$.next(undefined);
  //   this._destroying$.complete();
  // }


  // async getProfile() {
  //   this.profile = await lastValueFrom(this.getRole())
  //   if (this.authService.instance.getActiveAccount()) {
  //     // ดึง Token ในการเข้าถึง (access token)
  //     let accessToken = this.authService.instance.getActiveAccount()?.idTokenClaims?.roles;
  //     // ใช้งาน role ที่ได้รับมา
  //     this.profile.role = accessToken
  //   }

  //   return this.profile
  // }


  // getRole(): Observable<any> {
  //   const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
  //   return this.http.get(GRAPH_ENDPOINT)
  // }

}

