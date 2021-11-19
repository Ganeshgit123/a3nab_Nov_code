import { browser } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print';
import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  providers: [NgbRatingConfig]
})
export class OrderDetailsComponent implements OnInit {
  popoverTitle = 'Are you sure?';
  popoverMessage = 'Are you really <b>sure</b> you want to delete this?';
  confirmText = 'Yes';
  cancelText = 'No';
  confirmClicked = false;
  cancelClicked = false;
  orderId : number;
  orderDetails: any;
  proDetails:any;
  orderOn: string;
  deliveryDate: string;
  orderIDs: any;
  userId: any;
  lastName: string;
  firstName: string;
  landmark : string;
  addressPinDetails: string;
  grandTotal: number;
  mobileNumber: string;
  orderProgress: string;
  acceptByStore:any;
  cancelledByUser:any;
  assignDriver:any;
  packedByStore:any;
  packedByDriver:any;
  onWayToDelivery:any;
  orderStatus: string;
  deliveryNotes: any;
  ordertax:any;
  drId:any;
  driverName:any;
  assignment_ID:any;
  totalAmount:any;
  discountAmount:any;
  driverImage:any;
  fromTime:any;
  toTime:any;
  ordertime:any;
  cancelReason: any;
  fastDelievryCharge : any;
  couponDiscountPer : any;
  deleteItems : any;
  pointsAmount : any;
  otherTotal : any;
  detectedPoint : any;
  couponDiscount : any;
  taxValue : any;
  subtot : any;
  distot :any;
  subtot1 : any;
  subtot2 : any;
  taxtot : any;
  finalTot : any;
  paidByWallet : any;
  assignId:any;
  driverId:any;
  drivRating:any;
  prodetail:any;
  customerID:any;
  offType:any;
  showMap = false;
  zoom: number = 5;
  // initial center position for the map
  lat: number = 24.774265;
  lng: number = 46.738586;
  storemarker: marker[] = []
  driverLatitude:any;
  driverLongitude:any;
  userLatitude:any;
  userLongitude:any; 
  public StoreiconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  public DrivericonUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
  public UsericonUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  
    
  previous;
  showAccept = 'true';

  payType: string;

  //For Thermal Printer
  status: boolean = false;
  usbPrintDriver: UsbDriver;
  printService: PrintService;
  webPrintDriver: WebPrintDriver;
  ip: string = '';
  //End Thermal Printer
  
  constructor(
    private apiCall: ApiCallService,
    private router: Router,
    private route: ActivatedRoute,
    private config: NgbRatingConfig
  ) {
    this.usbPrintDriver = new UsbDriver();
    this.printService = new PrintService();
    this.printService.isConnected.subscribe(result => {
        this.status = result;
        if (result) {
            console.log('Connected to printer!!!');
        } else {
        console.log('Not connected to printer.');
        }
    });
    config.max = 5;
   }

  ngOnInit(): void {

    const activeMenu = document.getElementById('orders');
    activeMenu.classList.add('active');

    this.route.params.subscribe(params => this.orderId = params.id);
    // console.log(this.orderId)
    this.getOrderDetails(this.orderId)
    this.callRolePermission()
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))
      // console.log(orderpermission[0].read)
      this.showAccept = orderpermission[0].writeOpt
    }
  }


  getOrderDetails(id){
    var params = {
      url: 'admin/viewOrderDetails',
      data: { orderId: id }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error === 'false') {
          console.log("fe",response.body.data)
          // Success
          this.orderOn = response.body.data.orderInfo.orderOn
          this.orderIDs = response.body.data.orderInfo.orderIDs
          this.deliveryDate = response.body.data.orderInfo.deliveryDate
          this.userId = response.body.data.orderInfo.userId
          this.customerID = response.body.data.orderInfo.customerID
          this.firstName = response.body.data.orderInfo.firstName
          this.lastName = response.body.data.orderInfo.lastName
          this.landmark = response.body.data.orderInfo.landmark
          this.addressPinDetails = response.body.data.orderInfo.addressPinDetails
          this.mobileNumber = response.body.data.orderInfo.mobileNumber
          this.deliveryNotes = response.body.data.orderInfo.deliveryNotes
          this.ordertax = response.body.data.orderInfo.ordertax
          this.driverId = response.body.data.orderInfo.driverId
          this.drId = response.body.data.orderInfo.drId
          this.driverName = response.body.data.orderInfo.driverName
          this.drivRating = response.body.data.orderInfo.drivRating
          this.assignId = response.body.data.orderInfo.assignId
          this.assignment_ID = response.body.data.orderInfo.assignment_ID
          this.totalAmount = response.body.data.orderInfo.totalAmount
          this.discountAmount = response.body.data.orderInfo.discountAmount
          this.driverImage = response.body.data.orderInfo.driverImage
          this.fromTime = response.body.data.orderInfo.fromTime
          this.toTime = response.body.data.orderInfo.toTime
          this.ordertime = response.body.data.orderInfo.ordertime
          this.cancelReason = response.body.data.orderInfo.cancelReason
          this.fastDelievryCharge = response.body.data.orderInfo.fastDelievryCharge
          this.couponDiscountPer = response.body.data.orderInfo.couponDiscountPer
          this.deleteItems = response.body.data.orderInfo.deleteItems
          this.pointsAmount = response.body.data.orderInfo.pointsAmount
          this.detectedPoint = response.body.data.orderInfo.detectedPoint
          this.couponDiscount = response.body.data.orderInfo.couponDiscount
          this.taxValue = response.body.data.orderInfo.taxValue
          this.paidByWallet = response.body.data.orderInfo.paidByWallet
          
          this.payType = response.body.data.orderInfo.paytype
          // console.log(this.payType)

          this.orderStatus = response.body.data.orderInfo.orderStatus

          // console.log(this.orderStatus)

          this.grandTotal = response.body.data.orderInfo.grandTotal
          // console.log(response.body)
          this.orderDetails = response.body.data.orderDetails


          this.storemarker = response.body.data.orderDetails
          this.driverLatitude = response.body.data.orderInfo.driverLatitude
          this.driverLongitude = response.body.data.orderInfo.driverLongitude
          this.userLatitude = response.body.data.orderInfo.userLatitude
          this.userLongitude = response.body.data.orderInfo.userLongitude

          this.proDetails = response.body.data.orderDetails.products
          this.orderProgress = response.body.data.orderInfo.orderProgress
          this.acceptByStore = response.body.data.orderInfo.acceptByStore
          this.cancelledByUser = response.body.data.orderInfo.cancelledByUser
          this.assignDriver = response.body.data.orderInfo.assignDriver
          this.packedByStore = response.body.data.orderInfo.packedByStore
          this.packedByDriver = response.body.data.orderInfo.packedByDriver
          this.onWayToDelivery = response.body.data.orderInfo.onWayToDelivery
          this.orderStatus = response.body.data.orderInfo.orderStatus
          this.otherTotal = response.body.data.orderInfo.otherTotal
          this.offType = response.body.data.orderInfo.off_types
          // console.log("oth",this.offType)
          // console.log("tot",this.totalAmount)
          // console.log("othtot",this.otherTotal)


        this.subtot= ((this.totalAmount +  this.otherTotal) - this.discountAmount) 

          this.distot = this.subtot - this.couponDiscount 
          // console.log("dis",this.distot)
       
          this.subtot1 = this.distot - (this.pointsAmount + this.paidByWallet)
          // console.log("subtot1",this.subtot1)
          if(this.offType == '0'){
            this.fastDelievryCharge = this.couponDiscount
          }
  
          this.subtot2 = this.subtot1 + this.fastDelievryCharge
          // console.log("tot",this.subtot2)

          this.taxtot = (this.subtot2) * (this.taxValue) /100
          // console.log("fin",this.taxtot)

          this.finalTot = (this.subtot2) + (this.taxtot)
          // console.log("fin",this.finalTot)

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

  removeOrderItems(data){


    var params = {
      url: 'admin/adminDeleteItems',
      data: {
        orderId: data.orderId,
        productId: data.productId
      }
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error === 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.getOrderDetails(this.orderId)
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

  updateOrderStatus(status){
    var params = {
      url: 'admin/calcelledOrder',
      data: { orderId: this.orderId, status: status }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error === 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.getOrderDetails(this.orderId)
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

  clickedMarkerDriver(infowindowdriver){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindowdriver;
  }

  clickedMarkerUser(infowindowuser){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindowuser;
  }

  onchangeMap(values:any){
    this.showMap = values.currentTarget.checked;
  }


  onPrint(){
    const printContent = document.getElementById("print_portion");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  print(driver: PrintDriver) {
    const printContent = document.getElementById("print_portion");

    this.printService.init()
        .setBold(true)
        .writeLine("print_portion")
        .setBold(false)
        .feed(4)
        .cut('full')
        .flush();
}

}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}


