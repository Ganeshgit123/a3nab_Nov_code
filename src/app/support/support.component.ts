import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
declare var $:any;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  supportForm: FormGroup;
  addcatName: FormGroup;

  supportTotal: number;
  supportPending: number;
  supportEscalate: number;
  resolved: number;
  supportList: any;
  pages: any;
  orderIdList: any;
  page : Number =1;
  cateList = 'ALL';
  supportStatus = 'NONE';
  supportcsvOption : any;
  catList : any;
  showExport = 'true';
  showAccept = 'true';

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.supportForm   = this.formBuilder.group({
      // orderIds: [''],
      appUser: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      orderId: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      category: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      userId: [''],
      store_id: [''],
      driver_id: [''],
      notes: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    });

    this.addcatName   = this.formBuilder.group({
      categoryName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    });

    const  data = { pageNumber: 1, category: 'ALL', status: this.supportStatus }

    this.getSupportList(data)
    let params = {
      url: "admin/getSupportCategoryList"
    }  

    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
           this.catList = resu.data;
      
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });

    let params1 = {
      url: "admin/getOrderIdList"
    }  

    this.apiCall.commonGetService(params1).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
           this.orderIdList = resu.data;
          
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });

    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = orderpermission[4].writeOpt
      this.showExport = orderpermission[4].exportOpt
    }
  }

  addNewTicket(){
    this.supportForm.reset();
  }

  addTicketCategory(){
    this.addcatName.reset();
  }

  getSupportList(object){
    var params = {
      url: 'admin/getSupportList',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.pages = response.body.data.page * 10;
          this.supportTotal = response.body.data.supportCount.total
          this.supportPending = response.body.data.supportCount.pending
          this.supportEscalate = response.body.data.supportCount.escalate
          this.resolved = response.body.data.supportCount.resolved

          this.supportList = response.body.data.support
          // console.log(response.body)
          
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

  searchSuggestion(value){
  
      const object = { orderId: value }
      var params = {
        url: 'admin/searchOrderId',
        data: object
      }
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          if (response.body.error == 'false') {
            // Success
            // console.log(response.body.data.orders)
            if(response.body.data.orders.length >= 0){
              this.supportForm   = this.formBuilder.group({
                // orderIds: [response.body.data.orders[0].id,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
                appUser: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
                category: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
                userId: [response.body.data.orders[0].userId],
                orderId: [response.body.data.orders[0].id,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
                store_id: [response.body.data.orders[0].storeId],
                driver_id: [response.body.data.orders[0].as_driverId],
                notes: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
              })
            } else {
              this.apiCall.showToast('Invalid Order ID', 'Error', 'errorToastr')
            }
            // console.log(response.body)
          } else {
            // Query Error
            // this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
          }
        },
        (error) => {
          this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
          console.log('Error', error)
        }
      )
  }

  onFilterChange(id, type){
    const object = { pageNumber: 1, category: this.cateList, status: this.supportStatus}
    if(type === 'Category'){
      this.cateList = id
      this.cateList = this.cateList
    } else if(type === 'Status') {
      this.supportStatus = id
      this.supportStatus = this.supportStatus
    } 
    object.category = this.cateList
    object.status = this.supportStatus
    this.getSupportList(object)
    // this.onChangeStoreFilterAPICall(object)
  }

  onSubmit(){

    if(!this.supportForm.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    var params = {
      url: 'admin/addSupportNew ',
      data: this.supportForm.value
    }
    // console.log(">>>",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error === 'false') {
          // Success
          // console.log(response.body)
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.supportForm.reset();
          $('#add_driv_btn').modal('hide');
          this.ngOnInit();
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

  onSubmit1(){
    if (!this.addcatName.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }
    var params = {
      url: 'admin/addSupportCategory ',
      data: this.addcatName.value
    }


    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error === 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.addcatName.reset();
          $('#add_tick_btn').modal('hide');
          this.ngOnInit();
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
    const object = { pageNumber: page,category: this.cateList,status: this.supportStatus }
    this.getSupportList(object)
  }

  searchSupport(value :any){
    const object = { pageNumber: this.page,category: this.cateList,status: this.supportStatus,text:value }
    this.getSupportList(object)
  }

  onChangeFilter(id,status){
    const data = {id: id, status: status }

    var params = 
    {
      url: 'admin/updateSupportStatus',
      data: data,  
    }
 
    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        this.ngOnInit();
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }


  exportList(event : any){
    const object = { pageNumber: this.page,category: this.cateList,status: this.supportStatus}

    var params = {
      url: 'admin/getSupportList',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.pages = response.body.data.page * 10;
          this.supportTotal = response.body.data.supportCount.total
          this.supportPending = response.body.data.supportCount.pending
          this.supportEscalate = response.body.data.supportCount.escalate
          this.resolved = response.body.data.supportCount.resolved

          this.supportList = response.body.data.support

          if(response.body.data.support.length > 0){
            this.exportSupportData(response.body.data.support)
          }
          // console.log(response.body)
          
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

    exportSupportData(data){
      if(data.length > 0){
        var bulkArray = []
        data.forEach(element => {
          var obj = {}
          obj['createdDate'] = element.createdDate
          obj['supportID'] = element.supportID
          obj['orderIDs'] = element.orderIDs
          obj['customerID'] = element.customerID
          obj['firstName'] = element.firstName
          obj['driverName'] = element.driverName
          obj['status'] = element.status
          obj['notes'] = element.notes
          bulkArray.push(obj)
        })
  
        this.supportcsvOption = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          title: 'Support Report',
          useBom: true,
          noDownload: false,
          headers: ["Created Date", "Support ID",  "Order ID", "Customer ID", "Customer Name", "Driver Name", 'status', "Notes"]
        };
        new  AngularCsv(bulkArray, "Support Report", this.supportcsvOption);
  
      }
    }

    

}
