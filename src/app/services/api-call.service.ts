import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  baseUrl = environment.baseUrl;
  accToken = sessionStorage.getItem('access_token');

  constructor(private http: HttpClient, public toastr: ToastrManager) { }

  private callProduct = new BehaviorSubject<string>('0');
  productFn = this.callProduct.asObservable();

  setProductValue(value: string) {
    this.callProduct.next(value)
  }

  private callSubCate = new BehaviorSubject<string>('0');
  subCateFn = this.callSubCate.asObservable();

  setSubCategoryValue(value: string) {
    this.callSubCate.next(value)
  }

  private callCate = new BehaviorSubject<string>('0');
  CateFn = this.callCate.asObservable();

  setCategoryValue(value: string) {
    this.callCate.next(value)
  }

  private callCateSub = new BehaviorSubject<string>('0');
  subSubCateFn = this.callCateSub.asObservable();

  setSubSubCategoryValue(value: string) {
    this.callCateSub.next(value)
  }

  private cateData = new BehaviorSubject<string>('0');
  categoryFn = this.cateData.asObservable();

  categoryValue(value) {
    this.cateData.next(value)
  }

  private subcateData = new BehaviorSubject<string>('0');
  subcategoryFn = this.subcateData.asObservable();

  subCategoryValue(value) {
    this.subcateData.next(value)
  }

  adminLogin(apiData) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'

    });
    return this.http.post(this.baseUrl + 'admin/login', apiData, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  commonGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.accToken,
      'Access-Control-Allow-Origin': '*',
      'role': 'admin',
      'lang': 'en'
    });
    return this.http.get(this.baseUrl + params.url, {
      headers: httpHeaders,
      observe: 'response'
    });
  }



  commonPostService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.accToken,
      'Access-Control-Allow-Origin': '*',
      'role': 'admin',
      'lang': 'en'
    });
    return this.http.post(this.baseUrl + params.url, params.data , {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  imageuploadFunctions(data) {
    return new Promise(resolve => {
      var response = {}
      this.fileUploadService(data).subscribe(
        res => {
          if(res.body['error'] == false){
            response['error'] = false
            response['uploadUrl'] = res.body['imageURL']
          } else {
            response['error'] = true
          }
          resolve(response)
        },
        err => {
          response['error'] = true
          resolve(response)
        }
      );
    });
  }

  fileUploadService(apiData) {
    const httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      // 'Content-Type': [''],
      // 'Accept': 'application/json',
      // 'Authorization': this.accToken
    });
    return this.http.post(this.baseUrl + 'admin/ImageUpload', apiData, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  showToast(message, title, key) {
    // successToastr
    // errorToastr
    // warningToastr
    // infoToastr
    var option = {
      position: 'top-right',
      showCloseButton: true,
      maxShown: 2,
      toastTimeout: 2000,
      newestOnTop: true,
      animate: 'slideFromRight'
    }
    this.toastr[key](message, title, option);

  }

}
