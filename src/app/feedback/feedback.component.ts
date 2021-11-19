import { Component, OnInit } from '@angular/core';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { ApiCallService } from '../services/api-call.service';
// import { AnyMxRecord } from 'dns';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  providers: [NgbRatingConfig]
})
export class FeedbackComponent implements OnInit {
  selected = 0;
  hovered = 0;
  appFeedbackList: any;
  appUserFeedbackList: any;
  appdriverFeedbackList: any;
  pages: any;
  page : Number =1;
  paginat: any;
  searchpage : Number =1;
  driverpage:any;
  driverfeedpage:Number = 1;
  grand:any = [];
  subtot : any;
  subtot1 : any;
  subtot2 : any;
  taxtot : any;
  finalTot : any;
  constructor(
    private apiCall: ApiCallService,
    private config: NgbRatingConfig
  ) { config.max = 5;}

  ngOnInit(): void {
    const data = { pageNumber: 1 }
    this.appFeedback(data)
    this.ratingList(data)
    this.driverFeedbackList(data)
  }

  nextPage(page){
    const object = { pageNumber: page}
    this.ratingList(object)
  }

  searchUserFeedback(value :any){
    const object = { pageNumber: this.page,text: value}
    this.ratingList(object)
    this.appFeedback(object)
    this.driverFeedbackList(object)

  }

  pagination(searchpage){
    const object = { pageNumber: searchpage}
    this.appFeedback(object)
  }

  driverPagination(driverfeedpage){
    const object = { pageNumber: driverfeedpage}
    this.driverFeedbackList(object)
  }
  
  ratingList(object){
    var params = {
      url: 'admin/getUserFeedbackList',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          // console.log(response.body.data.support)
          this.appUserFeedbackList = response.body.data.support
          this.pages = response.body.data.page * 10;

          this.appUserFeedbackList.forEach(function (ord,index) {
            var tt =  (ord.totalAmount + ord.otherTotal) - ord.discountAmount    
    
                 var subtot = tt - ord.couponDiscount
                var subtot1 = subtot -(ord.pointsAmount + ord.paidByWallet)
                if(ord.off_types == '0'){
                  ord.fastDelievryCharge = ord.couponDiscount
                  // console.log("off",ord.fastDelievryCharge)
                }
                var subtot2 = subtot1 + ord.fastDelievryCharge

                var subtot3 = subtot2 * (ord.taxValue / 100) 
                var grandtot = subtot2 + subtot3
      
              ord.grand = grandtot
              // console.log("grand",grandtot);
          })
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }


  appFeedback(object){
    var params = {
      url: 'admin/getAppFeedbackList',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          // console.log(response.body)
          this.appFeedbackList = response.body.data.support
          this.paginat = response.body.data.page * 10;
          
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }

  driverFeedbackList(object){
    var params = {
      url: 'admin/getDriverFeedbackList',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          console.log(response.body.data.feedback)
          this.appdriverFeedbackList = response.body.data.feedback
          this.driverpage = response.body.data.page * 10;
          this.appdriverFeedbackList.forEach(function (ord,index) {
            var tt =  (ord.totalAmount + ord.otherTotal) - ord.discountAmount    
    
                 var subtot = tt - ord.couponDiscount
                var subtot1 = subtot -(ord.pointsAmount + ord.paidByWallet)
                if(ord.off_types == '0'){
                  ord.fastDelievryCharge = ord.couponDiscount
                  // console.log("off",ord.fastDelievryCharge)
                }
                var subtot2 = subtot1 + ord.fastDelievryCharge

                var subtot3 = subtot2 * (ord.taxValue / 100) 
                var grandtot = subtot2 + subtot3
      
              ord.grand = grandtot
              // console.log("grand",grandtot);
          })
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }


  pageReload() {
    this.ngOnInit();
    window.location.reload();
  }
  
}
