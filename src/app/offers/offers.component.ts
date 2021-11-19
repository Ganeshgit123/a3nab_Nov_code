import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OffersService } from './offers.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiCallService } from '../services/api-call.service';
declare var $:any;


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
  providers: [DatePipe]
})
export class OffersComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;
  addOffers: FormGroup;
  pushNotify: FormGroup;
 
   bsValue: Date = new Date();
   bsValue1: Date = new Date();

   date: Date = new Date();
   date1: Date = new Date();
   settings = {
       bigBanner: true,
       timePicker: true,
       format: 'yyyy-MM-dd hh:mm:ss',
       defaultOpen: false,
       closeOnSelect: false
   };

   statustog = true;
   status: any = true;
   trustUser: any = false;
   trust:any;
   offerId: number;
   allcategory: any = [];
   productcategory: any = [];
   isEdit  = false;
   id : number;
   imagePreview = null;
   fileUpload: any;
   submitted = false;
   showAccept = 'true';
   stat : any;
   searchOffer;
   searchOrders;
   off_type = false;

  list_offers: any = [];
  constructor(
    private formBuilder:FormBuilder,
    private offersservice:OffersService,
    private router:Router,
    private datePipe : DatePipe,
    private apiCall: ApiCallService,
    ) { }

  
  ngOnInit(): void {

    const data = {status: "active"}
    this.getofferslist(data)

    this.addOffers   = this.formBuilder.group({
      title: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      couponCode: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      // trustUser:[this.trustUser],
      description: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      discount: [''],
      minimumValue: [''],
      count: [''],
      startDate: [this.bsValue,  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      endDate: [this.bsValue1, [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      status: [this.status],
      image: [''],
      uptoAmount: [''],
      off_types: [''],
      // offCategoryId: [''],
      // offProductId: [''],
      // StartTime: [''],
      // EndTime: ['']
  });

  this.pushNotify   = this.formBuilder.group({
    title: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    content: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    gender:['',[ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    age: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
});
  
  let allcate = {
    url: "admin/getAllCategory"
  }

  this.offersservice.getallcategory(allcate).subscribe((result:any)=>{
    let resu = result.body;
    if(!resu.error)
    {
         this.allcategory = resu.data;
    }else{
      this.offersservice.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
  });
  this.callRolePermission();
}

callRolePermission(){
  if(sessionStorage.getItem('adminRole') !== 'superadmin'){
    let orderpermission = JSON.parse(sessionStorage.getItem('permission'))
    this.showAccept = orderpermission[5].writeOpt

  }
}


uploadImageFile(event)
{
  var reader = new FileReader();
  reader.onload = (event: any) => {
    this.imagePreview = event.target.result;
  }
  reader.readAsDataURL(event.target.files[0]); 
  this.fileUpload = event.target.files[0]

}

add_off_click()
{
  this.isEdit = false; 
  this.addOffers.reset();

}

onChangeOfferTypes(det){
  if(det == '0'){
    this.off_type = true
  }else{
    this.off_type = false
  }
}

async onSubmit(){

  this.submitted = true;
  if(!this.addOffers.valid){
    this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
    return false;
  }

  if(this.isEdit){
    this.offerEditService(this.addOffers.value)
    return;
  }

  const formData = new FormData();
  formData.append('uploaded_file', this.fileUpload); 
    const image = await this.apiCall.imageuploadFunctions(formData);

    const postData = this.addOffers.value
    postData['image'] = image['uploadUrl']
    postData['startDate'] = this.datePipe.transform(this.addOffers.value.startDate, 'yyyy-MM-dd');
    postData['endDate'] = this.datePipe.transform(this.addOffers.value.endDate, 'yyyy-MM-dd');
    // postData['trustUser'] = this.addOffers.value.trustUser ? "true" : "false";
    postData['status'] = this.addOffers.value.status ? "active" : "inactive";
 
   
        var params = {
          url: 'admin/addNewOffers',
          data: postData
        }
        console.log("add",params)
  
    
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if(response.body.error == 'false')
        {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.submitted = false;
          this.addOffers.reset();
          $('#add_offer_btn').modal('hide');
          this.imagePreview = null;
          this.ngOnInit();
        }
        else
        {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      });
 
}

async offerEditService(data){
  this.submitted = false;
  console.log("edit",data)
    
  data['image'] = this.imagePreview
  data['startDate'] = this.datePipe.transform(data.startDate, 'yyyy-MM-dd');
  data['endDate'] = this.datePipe.transform(data.endDate, 'yyyy-MM-dd');
  // data['trustUser'] = this.addOffers.value.trustUser ? "true" : "false";
  data['status'] = this.addOffers.value.status ? "active" : "inactive";

    const formData = new FormData();
    formData.append('uploaded_file', this.fileUpload); 
    const image = await this.apiCall.imageuploadFunctions(formData);
    data['image'] = image['uploadUrl']

  data['id'] = this.id

  var params = {
    url: 'admin/editOffers',
    data: data
  }
     
  

  this.apiCall.commonPostService(params).subscribe(
    (response: any) => {
      if (response.body.error == 'false') {
        // Success
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        $('#add_offer_btn').modal('hide');
        this.imagePreview = null;
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


editoffers(offers){
$('#add_offer_btn').modal('show');
// console.log("Edit offer",offers)
this.imagePreview = offers['image']

this.isEdit = true;
this.id = offers['id']

//  this.trust = offers['trustUser'] 

//  console.log("tt",this.trust)
  
this.addOffers   = this.formBuilder.group({
  title: [offers['title'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
  image: [''],
  couponCode: [offers['couponCode'] , [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
  // trustUser: [offers['trustUser']],
  description: [offers['description'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
  discount: [offers['discount']],
  minimumValue: [offers['minimumValue']],
  count: [offers['count']],
  startDate: [offers['startDate'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
  endDate: [offers['endDate'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
  status: [offers['status'],[] ],
  uptoAmount: [offers['uptoAmount']],
  off_types: [offers['off_types']],

  // offCategoryId: [offers['offCategoryId'],  ],
  // offProductId: [offers['offProductId'],  ]
})
// console.log("efomrvav",this.addOffers.value)

}

getofferslist(data){
  var params = {
    url: "admin/getOfferList",
    data: data
  }
// console.log("stat",params)
  this.apiCall.commonPostService(params).subscribe(
    (response: any) => {
      if (response.body.error == 'false') {
        // Success
        this.list_offers = response.body.data.Offers;
// console.log("list",this.list_offers)

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

onchange(values:any){
  let stat = values.currentTarget.checked ? "active" : "inactive"; 
  // console.log("????",stat)
  const data = {status: stat}
  this.getofferslist(data);
}


cateclick(category_id){
  // console.log(category_id);

   let cateid ={
     url:"admin/categoryProduct",
     categoryId : category_id
   }

   this.offersservice.categoryproduct(cateid).subscribe((result:any)=>{
    //  console.log('product response', result.body);
     let resu = result.body;
     if(!resu.error)
     {
          this.productcategory = resu.data.products;
     }else{
       this.offersservice.showToast(resu.message, 'Error', 'errorToastr')
     }
     
   },(error)=>{
     console.error(error);
   });

}

statclick(status,type,id){
  const object = {}
  object['id'] = id
  if(status){
    object['status'] = 'active'
  } else {
    object['status'] = 'inactive'
  }
    object['type'] = type

  let statid ={
    url:"admin/updateOfferStatus",
    data:object
  }

  this.apiCall.commonPostService(statid).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == "false")
    {
      this.apiCall.showToast("Status updated Successfully", 'Success', 'successToastr');
      this.ngOnInit();
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr');
    }
    
  },(error)=>{
    console.error(error);
  });

}

onPushsubmit(){
  if(!this.pushNotify.valid){
    this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
    return false;
  }
  const postData = this.pushNotify.value
  var params = {
    url: 'admin/sendPush',
    data: postData
  }
// console.log(">>>",params)
  this.apiCall.commonPostService(params).subscribe(
    (response: any) => {
      if (response.body.error == 'false') {
        // Success
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        $('#notification_btn').modal('hide');
        this.ngOnInit();
        // this.router.navigateByUrl('/dashboard');
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