import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [DatePipe]
})
export class OrdersComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;
  orderList: any;
  orderStatus = 'ALL';
  deliveryTime = '0';
  timeList: any
  orderDate = null;

  pages: any;
  page : Number =1;
  showMap = false;
  storeStatus = 'NONE';
  fastDelievryCharge:any = [];
  paidByWallet:any = [];
  taxValue:any = [];
  pointsAmount:any = [];
  detectedPoint:any = [];
  discountAmount:any = [];
  couponDiscount:any = [];
  grand:any = [];
  subtot : any;
  subtot1 : any;
  subtot2 : any;
  taxtot : any;
  finalTot : any;
  // bsValue: Date = new Date();
  bsValue = null;
  searchOrders;

  minDate:any;


  zoom: number = 5;
  showAccept = 'true';
  
  // initial center position for the map
  lat: number = 24.774265;
  lng: number = 46.738586;
  public StoreiconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

  markers: marker[] = []
  previous;

  constructor(
    private apiCall: ApiCallService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.bsValue = null;
    const today =  new Date();
    // this.minDate =  new Date(today.setDate(today.getDate()));

    const object = { pageNumber: 1, orderStatus: 'ALL', deliveryTime: 0, storeStatus: this.storeStatus,orderDate: this.orderDate }
    this.getOrderList(object)
    this.getTime();
    this.callRolePermission()
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))
      // console.log(orderpermission[0].read)
      this.showAccept = orderpermission[0].read
    }
  }

  onchangeMap(values:any){
    this.showMap = values.currentTarget.checked;
  }

  value(event: any) {
    this.orderDate = this.datePipe.transform(event, 'yyyy-MM-dd');

    const object = { pageNumber: 1, orderStatus: this.orderStatus, deliveryTime: this.deliveryTime, storeStatus: this.storeStatus, orderDate: this.orderDate }
    this.getOrderList(object)
}

  getTime(){
    var params = {
      url: 'admin/getDeliveryTime',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error === 'false') {
          // Success
          // console.log(response.body)
          this.timeList = response.body.data.list
          // console.log(this.timeList)
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

  nextPage(page){
    const object = { pageNumber: page, orderStatus: this.orderStatus, deliveryTime: this.deliveryTime, storeStatus: this.storeStatus, orderDate: this.orderDate }
    this.getOrderList(object)
  }

  searchOrder(value : any ){
    const object = { pageNumber: this.page,text:value, orderStatus: this.orderStatus, deliveryTime: this.deliveryTime, storeStatus: this.storeStatus, orderDate: this.orderDate }
    this.getOrderList(object)
  }

  onChangeFilter(id, type){
    const object = { pageNumber: this.page, storeStatus: this.storeStatus, orderStatus: this.orderStatus, deliveryTime: this.deliveryTime, orderDate: this.orderDate }
    if(type === 'Delivery'){
      this.deliveryTime = id
      this.orderStatus = this.orderStatus
    } else if(type === 'Status') {
      this.orderStatus = id
      this.deliveryTime = this.deliveryTime
    } else {
      console.log(id)
      this.storeStatus = id
      this.storeStatus = this.storeStatus
    }
    object.deliveryTime = this.deliveryTime
    object.orderStatus = this.orderStatus
    object.storeStatus = this.storeStatus
    this.getOrderList(object)
    // this.onChangeStoreFilterAPICall(object)
    // console.log("cef",object)
  }

  onChangeStoreFilter(value){
    var object = {orderStatus: this.orderStatus, storeStatus: value, deliveryTime: this.deliveryTime, orderDate: this.orderDate }
    this.onChangeStoreFilterAPICall(object)
  }


  onChangeStoreFilterAPICall(value){
    var params = {
      url: 'admin/orderListStoreStatus',
      data: value
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error === 'false') {
          // Success
          // console.log(response.body)
          this.orderList = response.body.data.orders
          this.markers = response.body.data.orders
          // console.log(this.markers)
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

  clickedMarker(infowindow){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindow;
  }

  storeclickedMarker(infowindow1){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindow1;
  }

  pageReload() {
    this.ngOnInit();
    window.location.reload();
  }



  getOrderList(object){
    var params = {
      url: 'admin/orderList',
      data: object
    }
    // console.log("with filt",params)

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error === 'false') {
          // Success
          // console.log(response.body)
          this.pages = response.body.data.pages * 10;
          this.orderList = response.body.data.orders
          // console.log("vdv",this.orderList)
          this.markers = response.body.data.orders

          this.orderList.forEach(function (ord,index) {
            var tt =  (ord.totalAmount + ord.otherTotal) - ord.discountAmount    
                    // console.log("tot",ord.otherTotal)
                    // console.log("sdf",tt)
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
}


interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
