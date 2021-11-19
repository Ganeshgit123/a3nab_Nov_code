import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OffersService {

  baseUrl = environment.baseUrl;
  accToken = sessionStorage.getItem('access_token');
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.accToken,
    'role': 'admin',
    'lang': 'en'
  });

  constructor(private http: HttpClient, public toastr: ToastrManager) { }

  // add offers
  addofferservice(params) {
    
    return this.http.post(this.baseUrl + params.url, params.data , {
      headers: this.httpHeaders,
      observe: 'response'
    });
  }

  // editofferservice(params) {
    
  //   return this.http.post(this.baseUrl + params.url, params.data , {
  //     headers: this.httpHeaders,
  //     observe: 'response'
  //   });
  // }

  // get the offers list

  getoffservice(params){
    return this.http.post(this.baseUrl + params.url,{status:params.status},{
      headers: this.httpHeaders,
      observe: 'response'
    });
  }

  getallcategory(params){
    return this.http.get(this.baseUrl + params.url,{
      headers: this.httpHeaders,
      observe: 'response'
    });
  }

  categoryproduct(params){
    return this.http.post(this.baseUrl + params.url,{categoryId:params.categoryId},{
      headers: this.httpHeaders,
      observe: 'response'
    });
  }
 
  // Offers Status delete Api
  offerstatusdelete(params){
    return this.http.post(this.baseUrl + params.url,{id:params.id,type:params.type},{
      headers: this.httpHeaders,
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