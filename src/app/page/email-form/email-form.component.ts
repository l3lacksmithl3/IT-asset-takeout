import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Editor, Toolbar } from 'ngx-editor';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';
import { toHTML } from 'ngx-editor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})
export class EmailFormComponent {
  htmlContent: any
  htmlContent_alert: any
  htmlContent_Requester: any

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    // uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        // 'undo',
        // 'redo',
        // 'bold',
        // 'italic',
        // 'underline',
        // 'strikeThrough',
        // 'subscript',
        // 'superscript',
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
        // 'indent',
        // 'outdent',
        // 'insertUnorderedList',
        // 'insertOrderedList',
        // 'heading',
        // 'fontName'
      ],
      [
        // 'fontSize',
        // 'textColor',
        // 'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        // 'toggleEditorMode'
      ]
    ]
  };


  editor: any = Editor;
  editor_alert: any = Editor;
  editor_Requester: any = Editor;


  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  show: boolean = true
  data: any = {}
  user: any


  constructor(
    private api: HttpService,
    private route: Router,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.ngxService.start()
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.htmlContent = `<b>Dear test</b><div><br></div><div>asdajsdajsdkasldasd</div><div>asdaksdkaskdasd</div><div>asdasdasda</div><div>asdasdasd</div><div><br></div><div></div><div>&#127838;&#127838;&#127838;</div>s`
    this.editor = new Editor();
    this.editor_alert = new Editor();
    this.editor_Requester = new Editor();
    this.setData()

    this.htmlContent = ``
    this.htmlContent_alert = ``
    this.htmlContent_Requester = ``

    this.user = JSON.parse(`${localStorage.getItem("IT-asset-takeout-login")}`)
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  async setData() {
    let data = await lastValueFrom(this.api.Mail_Form_Get_ByCondition({name : "Mail_Approve"}))
    if (data.length != 0) {
      this.data.subject = data[0].value.subject
      this.htmlContent = data[0].value.content
    }


    let data_alert = await lastValueFrom(this.api.Mail_Form_Get_ByCondition({name : "Mail_Remain"}))
    if (data_alert.length != 0) {
      this.data.subject_alert = data_alert[0].value.subject
      this.htmlContent_alert = data_alert[0].value.content
    }


    let data_Requester = await lastValueFrom(this.api.Mail_Form_Get_ByCondition({name : "Mail_Requester"}))
    if (data_Requester.length != 0) {
      this.data.subject_Requester = data_Requester[0].value.subject
      this.htmlContent_Requester = data_Requester[0].value.content
    }


    if (data_alert.length >= 0) {
      // setTimeout(() => {
        this.ngxService.stop()
        this.show = false
      // }, 1000);
    }

    // console.log("🚀 ~ file: email-form.component.ts:76 ~ EmailFormComponent ~ setData ~ data:", data)
  }



  async save() {
    Swal.close()
    Swal.fire({
      title: 'Do you want to update data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let data = {
          name: "Mail_Approve",
          value:
          {
            subject: this.data.subject,
            content: this.htmlContent
          }
        }
        let dateOld = await lastValueFrom(this.api.Mail_Form_Get_ByCondition({name : "Mail_Approve"}))
        if (dateOld.length == 0) {
          let save = await lastValueFrom(this.api.Mail_Form_Save(data))
        } else {
          let update = await lastValueFrom(this.api.Mail_Form_Update(dateOld[0]._id, data))
        }

        //code end
        setTimeout(() => {
          Swal.close()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          })
        }, 200);
      }
    })



  }


  async testmail() {
    this.loading_email()
    let data = {
      name: this.user.full_name,
      email: this.user.email,
      value:
      {
        subject: this.data.subject,
        content: this.htmlContent
      }

    }
    let res = await lastValueFrom(this.api.TestMail(data))
    if (res == "Email sent successfully OK") {
      Swal.close()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Success',
        showConfirmButton: false,
        timer: 1500,
      }).then(()=>{
        Swal.close()
      })
    }
  }


  async save_alert() {
    Swal.close()
    Swal.fire({
      title: 'Do you want to update data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let data = {
          name: "Mail_Remain",
          value:
          {
            subject: this.data.subject_alert,
            content: this.htmlContent_alert
          }
        }
        let dateOld = await lastValueFrom(this.api.Mail_Form_Get_ByCondition({name : "Mail_Remain"}))
        if (dateOld.length == 0) {
          let save = await lastValueFrom(this.api.Mail_Form_Save(data))
        } else {
          let update = await lastValueFrom(this.api.Mail_Form_Update(dateOld[0]._id, data))
        }

        //code end
        setTimeout(() => {
          Swal.close()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          })
        }, 200);
      }
    })



  }


  async testmail_alert() {
    this.loading_email()
    let data = {
      name: this.user.full_name,
      email: this.user.email,
      value:
      {
        subject: this.data.subject_alert,
        content: this.htmlContent_alert
      }

    }
    let res = await lastValueFrom(this.api.TestMail(data))

    if (res == "Email sent successfully OK") {
      Swal.close()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Success',
        showConfirmButton: false,
        timer: 1500,
      }).then(()=>{
        Swal.close()
      })
    }
  }

  async save_Requester() {
    Swal.close()
    Swal.fire({
      title: 'Do you want to update data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let data = {
          name: "Mail_Requester",
          value:
          {
            subject: this.data.subject_Requester,
            content: this.htmlContent_Requester
          }
        }
        let dateOld = await lastValueFrom(this.api.Mail_Form_Get_ByCondition({name : "Mail_Requester"}))
        if (dateOld.length == 0) {
          let save = await lastValueFrom(this.api.Mail_Form_Save(data))
        } else {
          let update = await lastValueFrom(this.api.Mail_Form_Update(dateOld[0]._id, data))
        }

        //code end
        setTimeout(() => {
          Swal.close()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          })
        }, 200);
      }
    })



  }


  async testmail_Requester() {
    this.loading_email()
    let data = {
      name: this.user.full_name,
      email: this.user.email,
      value:
      {
        subject: this.data.subject_Requester,
        content: this.htmlContent_Requester
      }

    }
    let res = await lastValueFrom(this.api.TestMail(data))

    if (res == "Email sent successfully OK") {
      Swal.close()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Success',
        showConfirmButton: false,
        timer: 1500,
      }).then(()=>{
        Swal.close()
      })
    }
  }

  // loading() {
  //   Swal.fire({
  //     allowOutsideClick: false,
  //     width: 200,
  //     title: 'Loading...',
  //     didOpen: () => {
  //       Swal.showLoading()
  //     },
  //   })


  //   setTimeout(() => {
  //     Swal.close()
  //     this.show = false
  //   }, 1000);
  // }


  loading_email() {
    Swal.close()
    Swal.fire({
      allowOutsideClick: false,
      width: 200,
      title: 'Loading...',
      didOpen: () => {
        Swal.showLoading()
      },
    })
  }

}
