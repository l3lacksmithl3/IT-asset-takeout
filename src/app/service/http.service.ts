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




  //ITasset
  addAsset(data: any): Observable<any> {
    return this.http.post(this.Url + "/ITasset/", data)
  }
  getAssetIT(): Observable<any> {
    return this.http.get(this.Url + "/ITasset/")
  }
  getAssetByID(data: any): Observable<any> {
    return this.http.post(this.Url + "/ITasset/getByCondition/", data)
  }



  // // mail
  // sendMailFlow1(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master_it/sendMail/", data)
  // }
  // sendMailFlow2(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master_section/sendMail/", data)
  // }

}

// getDataView
