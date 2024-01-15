import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }
  Url: any = environment.UrlApi



  // //AMT master analog / digital
  // getMasterModel(): Observable<any> {
  //   return this.http.get(this.Url + "/master/")
  // }
  // addMasterModel(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master/", data)
  // }
  // CheckMaster(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master/getByCondition/", data)
  // }
  // DeleteMaster(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master/DelByCondition/", data)
  // }
  // updateMasterModel(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/master/insert/" + id, data)
  // }


  //User
  getUserBySection(data: any): Observable<any> {
    return this.http.post(this.Url + "/master_employee/getByCondition/", data)
  }


  getSectionBySection(data: any): Observable<any> {
    return this.http.post(this.Url + "/master_section/getByCondition/", data)
  }
  AddMasterSection(data: any): Observable<any> {
    return this.http.post(this.Url + "/master_section/", data)
  }
  updateSection(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/master_section/insert/" + id, data)
  }
  getSectionAll(): Observable<any> {
    return this.http.get(this.Url + "/master_section/")
  }




  getMasterIT(): Observable<any> {
    return this.http.get(this.Url + "/master_it/")
  }
  AddMasterIT(data: any): Observable<any> {
    return this.http.post(this.Url + "/master_it/", data)
  }
  getSectionITBySection(data: any): Observable<any> {
    return this.http.post(this.Url + "/master_it/getByCondition/", data)
  }
  updateSectionIT(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/master_it/insert/" + id, data)
  }


  //Approve_data
  Approve_data(data: any): Observable<any> {
    return this.http.post(this.Url + "/Approve_data/", data)
  }
  getDataApprove(data: any): Observable<any> {
    return this.http.post(this.Url + "/Approve_data/getByCondition/", data)
  }
  delDataApprove(data: any): Observable<any> {
    return this.http.post(this.Url + "/Approve_data/DelByCondition/", data)
  }
  getDataApproveAll(): Observable<any> {
    return this.http.get(this.Url + "/Approve_data/")
  }
  ApproveUpdate(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Approve_data/insert/" + id, data)
  }
  updateAt(): Observable<any> {
    return this.http.get(this.Url + "/Approve_data/lastData")
  }
  ApproveDelField(data: any): Observable<any> {
    return this.http.post(this.Url + "/Approve_data/delete/", data)
  }
  // getApprove(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Approve_data/getByAggregate/", data)
  // }



  // record
  RecordApprove(data: any): Observable<any> {
    return this.http.post(this.Url + "/RecordApprove/", data)
  }
  getRecordApprove(data: any): Observable<any> {
    return this.http.post(this.Url + "/RecordApprove/getByCondition/", data)
  }
  getRecord(): Observable<any> {
    return this.http.get(this.Url + "/RecordApprove/")
  }


  // ID
  getAllControlID(): Observable<any> {
    return this.http.get(this.Url + "/ControllD/")
  }
  ControlID(data: any): Observable<any> {
    return this.http.post(this.Url + "/ControllD/", data)
  }
  getControlID(data: any): Observable<any> {
    return this.http.post(this.Url + "/ControllD/getByCondition/", data)
  }
  UpdateControlID(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/ControllD/insert/" + id, data)
  }


  MasterUserAll(): Observable<any> {
    return this.http.get("http://10.200.90.152:4012/user_masterGet")
  }
  MasterCode(): Observable<any> {
    return this.http.get("http://10.200.90.152:4012/code_masterGet")
  }
  MasterHoliDay(): Observable<any> {
    return this.http.get("http://10.200.90.152:4012/date_masterGet")
  }
  CheckClass(data: any): Observable<any> {
    return this.http.post("http://10.200.90.152:4012/getByCondition/", data)
  }



  //ITasset
  updateAsset(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/ITasset/insert/" + id, data)
  }
  addAsset(data: any): Observable<any> {
    return this.http.post(this.Url + "/ITasset/", data)
  }
  getAssetIT(): Observable<any> {
    return this.http.get(this.Url + "/ITasset/")
  }
  getAssetByID(data: any): Observable<any> {
    return this.http.post(this.Url + "/ITasset/getByCondition/", data)
  }
  delAssetByID(data: any): Observable<any> {
    return this.http.post(this.Url + "/ITasset/delByCondition/", data)
  }


  //ITassetOfficePC
  AssetPCUpdate(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/AssetOfficePC/insert/" + id, data)
  }
  AssetPCAdd(data: any): Observable<any> {
    return this.http.post(this.Url + "/AssetOfficePC/", data)
  }
  AssetPCGetAll(): Observable<any> {
    return this.http.get(this.Url + "/AssetOfficePC/")
  }
  AssetPCGetByID(data: any): Observable<any> {
    return this.http.post(this.Url + "/AssetOfficePC/getByCondition/", data)
  }
  AssetPCDelByID(data: any): Observable<any> {
    return this.http.post(this.Url + "/AssetOfficePC/delByCondition/", data)
  }

  //ITassetMouse
  AssetMouseUpdate(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/AssetMouser/insert/" + id, data)
  }
  AssetMouseAdd(data: any): Observable<any> {
    return this.http.post(this.Url + "/AssetMouser/", data)
  }
  AssetMouseGetAll(): Observable<any> {
    return this.http.get(this.Url + "/AssetMouser/")
  }
  AssetMouseGetByID(data: any): Observable<any> {
    return this.http.post(this.Url + "/AssetMouser/getByCondition/", data)
  }
  AssetMouseDelByID(data: any): Observable<any> {
    return this.http.post(this.Url + "/AssetMouser/delByCondition/", data)
  }

  //ITassetKeypadKeyboard
  AssetKeypadKeyboardUpdate(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/AssetKeypadKeyboard/insert/" + id, data)
  }
  AssetKeypadKeyboardAdd(data: any): Observable<any> {
    return this.http.post(this.Url + "/AssetKeypadKeyboard/", data)
  }
  AssetKeypadKeyboardGetAll(): Observable<any> {
    return this.http.get(this.Url + "/AssetKeypadKeyboard/")
  }
  AssetKeypadKeyboardGetByID(data: any): Observable<any> {
    return this.http.post(this.Url + "/AssetKeypadKeyboard/getByCondition/", data)
  }
  AssetKeypadKeyboardDelByID(data: any): Observable<any> {
    return this.http.post(this.Url + "/AssetKeypadKeyboard/delByCondition/", data)
  }


  // mail
  Mail_Send(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/sendMail/", data)
  }

  //TODO mail reject takeout
  Mail_Reject(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/RejectM/", data)
  }

  //TODO mail reject extend
  Mail_Reject_Extend(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/Mail_Reject_Extend/", data)
  }

  //TODO mail extend approve
  Mail_Approve_Extends(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/Approve_Extend/", data)
  }

  //TODO mail takeout
  Mail_Approve_Request(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/Approve_request/", data)
  }

  //TODO mail return
  Mail_Approve_return(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/Approve_return/", data)
  }


  //TODO mail takeout success
  Takeout_success(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/Takeout_success/", data)
  }
  Return_success(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/Return_success/", data)
  }
  Extend_success(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/Extend_success/", data)
  }

  //TODO mail force return
  Mail_Return_Force(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/Return_Force/", data)
  }



  //TODO mail extend
  Mail_Extend(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/Extend/", data)
  }



  SSO_login(data: any): Observable<any> {
    return this.http.post(this.Url + "/AzureLogin/getByCondition/", data)
  }



  // Mail_Reserve_Approve(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Mailer/reserve_approve/", data)
  // }
  // Mail_Auto_Approve(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Mailer/AutoApprove/", data)
  // }
  // Mail_Approve_Success(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Mailer/Approve_Success/", data)
  // }



  TestMail(data: any): Observable<any> {
    return this.http.post(this.Url + "/Mailer/testmail/", data)
  }






  //set form mail
  Mail_Form_Get(): Observable<any> {
    return this.http.get(this.Url + "/email_form/")
  }
  Mail_Form_Update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/email_form/insert/" + id, data)
  }
  Mail_Form_Save(data: any): Observable<any> {
    return this.http.post(this.Url + "/email_form/", data)
  }
  Mail_Form_Get_ByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/email_form/getByCondition/", data)
  }



  Black_List_Add(data: any): Observable<any> {
    return this.http.post(this.Url + "/blacklist/", data)
  }
  Black_List_Get(): Observable<any> {
    return this.http.get(this.Url + "/blacklist/")
  }
  Black_List_Del(data: any): Observable<any> {
    return this.http.post(this.Url + "/blacklist/delByCondition/", data)
  }
  Black_List_Get_ByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/blacklist/getByCondition/", data)
  }
  testflow(data: any): Observable<any> {
    return this.http.post(this.Url + "/email_form/testdata", data)
  }




  section_head_Get_ByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/section_head/getByCondition/", data)
  }
  section_head_update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/section_head/insert/" + id, data)
  }

  section_head_Get_All(): Observable<any> {
    return this.http.get(this.Url + "/section_head/")
  }


  Master_reserve_getByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/master_reserve/getByCondition/", data)
  }


  //Master Organization
  MasterOrganization_getall(): Observable<any> {
    return this.http.get(this.Url + "/master_organization/")
  }
  MasterOrganization_update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/master_organization/insert/" + id, data)
  }
  MasterOrganization_ByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/master_organization/getByCondition/", data)
  }
  //Master_code
  Master_Code(): Observable<any> {
    return this.http.get(this.Url + "/master_code/")
  }
  Master_Code_ByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/master_code/getByCondition/", data)
  }
  Master_Code_update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/master_code/insert/" + id, data)
  }
  Master_Code_Add(data: any): Observable<any> {
    return this.http.post(this.Url + "/master_code/", data)
  }


  //TODO UserOutSSO
  GetUserOutSSO(data: any): Observable<any> {
    return this.http.post(this.Url + "/UserOutSSO/getByCondition", data)
  }
  addUserOutSSO(data: any): Observable<any> {
    return this.http.post(this.Url + "/UserOutSSO/", data)
  }




}

// getDataView
