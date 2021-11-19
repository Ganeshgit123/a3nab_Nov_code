import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
declare var $:any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  customernotlist: any;
  managernotlist: any;
  deliverynotlist: any;
  id : number;
  type: any = {};

  listnotify: FormGroup;
  addsms: FormGroup;
  addpush: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService) { }

  ngOnInit(): void {

    this.listnotify = this.formBuilder.group({
      title: [],
       description: [],
    });

    this.addsms = this.formBuilder.group({
      title: [],
      description: [],
  });

  this.addpush = this.formBuilder.group({
    title: [],
    description: [],
});

  var params = {
    url: 'admin/getNotificationList',
  }
  this.apiCall.commonGetService(params).subscribe((result:any)=>{
    let res = result.body;
    if(res.error=="false")
    {    
         this.customernotlist = res.data.customer;
        //  console.log("sfdew",this.customernotlist)
         this.managernotlist = res.data.manager;
         this.deliverynotlist = res.data.delivery;
        //  console.log("sfdew",this.deliverynotlist)

  
         this.listnotify = this.formBuilder.group({
          title: [],
           description: [],
           
        });
        this.addsms = this.formBuilder.group({
          title: [],
          description: [],
         
      });
      this.addpush = this.formBuilder.group({
        title: [],
        description: [],
       
    });
    }else{
      this.apiCall.showToast(res.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
  });
  }

  editcusemail(id)
  {
    this.id = id;
    this.type = "Customer"
    for(let item of this.customernotlist )
    {
      
   
      if(item.id == id)
      {
        this.listnotify = this.formBuilder.group({
          title: [item.emailTitle ],
          description: [item.emailDescription],
         
      });
      }
      
    }
 


  }

  editcussms(id)
  {
    this.id = id;
    this.type = "Customer"
    for(let item of this.customernotlist )
    {   
      if(item.id == id)
      {
        this.addsms = this.formBuilder.group({
          title: [item.smsTitle ],
          description: [item.smsDescription],
         
      });
      }

    }
    
    
  }

  editcuspush(id)
  {
    this.id = id;
    this.type = "Customer"
    for(let item of this.customernotlist )
    {
    
      if(item.id == id)
      {
        this.addpush = this.formBuilder.group({
          title: [item.pushTitle ],
          description: [item.pushDescription],
         
      });
      }
    }

   
    
  }

  editstoemail(id)
  {
    this.id = id;
    this.type = "Manager"
    for(let item of this.managernotlist )
    {
      
   
      if(item.id == id)
      {
        this.listnotify = this.formBuilder.group({
          title: [item.emailTitle ],
          description: [item.emailDescription],
         
      });
      }
    }


  }

  editstosms(id)
  {
    this.id = id;
    this.type = "Manager"
    for(let item of this.managernotlist )
    {   
      if(item.id == id)
      {
        this.addsms = this.formBuilder.group({
          title: [item.smsTitle ],
          description: [item.smsDescription],
         
      });
      }

    }

  }

  editstopush(id)
  {
    this.id = id;
    this.type = "Manager"
    for(let item of this.managernotlist )
    {
    
      if(item.id == id)
      {
        this.addpush = this.formBuilder.group({
          title: [item.pushTitle ],
          description: [item.pushDescription],
         
      });
      }
    }
   
  
  }

  editdeliemail(id)
  {
    this.id = id;
    this.type = "Delivery"
    for(let item of this.deliverynotlist )
    {
      
   
      if(item.id == id)
      {
        this.listnotify = this.formBuilder.group({
          title: [item.emailTitle ],
          description: [item.emailDescription],
         
      });
      }
    }
    
  }

  editdelisms(id)
  {
    this.id = id;
    this.type = "Delivery"
    for(let item of this.deliverynotlist )
    {   
      if(item.id == id)
      {
        this.addsms = this.formBuilder.group({
          title: [item.smsTitle ],
          description: [item.smsDescription],
         
      });
      }
    }
  
  }

  editdelipush(id)
  {
    this.id = id;
    this.type = "Delivery"
    for(let item of this.deliverynotlist )
    {
    
      if(item.id == id)
      {
        this.addpush = this.formBuilder.group({
          title: [item.pushTitle ],
          description: [item.pushDescription],
         
      });
      }
    }

  }

  

  onSubmit(){
    var data=this.listnotify.value;
    data['id']=this.id
    data['type'] = this.type
    data['sendType'] ="email"
      
    var params = 
    {
      url: 'admin/updateNotificationTitle',
      data: data,  
    }

    this.apiCall.commonPostService(params).subscribe((response:any)=>{

      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        $('#edit_email').modal('hide');
        this.ngOnInit();
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });

   
  }
  
  add_sms_cus()
  {
    var data=this.addsms.value;
    data['id']=this.id
    data['type'] =this.type
    data['sendType'] ="sms"
    var params = 
    {
      url: 'admin/updateNotificationTitle',
      data: data,  
    }
 
    this.apiCall.commonPostService(params).subscribe((response:any)=>{

      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        $('#edit_sms').modal('hide');
        this.ngOnInit();
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });

  }
  add_push_cus()
  {
    var data=this.addpush.value;
    data['id']=this.id
    data['type'] = this.type
    data['sendType'] ="push"
    var params = 
    {
      url: 'admin/updateNotificationTitle',
      data: data,  
    }
  
    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        $('#edit_push_notify').modal('hide');
        this.ngOnInit();
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }
  email_status_click(event, id)
  {
        let stat = event.target.checked ? "true" : "false"; 
        var data= {}
        data['id']=id
        data['status'] =stat
        data['type'] ="Customer"
        data['sendType'] ="email"
    
 
    var params = 
    {
      url: 'admin/updateNotificationStatus',
      data: data,  
    }

    this.apiCall.commonPostService(params).subscribe((response:any)=>{

      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }

  sms_status_click(event, id)
  {
    // console.log("number 1", event, id);
    let stat = event.target.checked ? "true" : "false"; 
        var data= {}
        data['id']=id
        data['status'] =stat
        data['type'] ="Customer"
        data['sendType'] ="sms"
    
 
    var params = 
    {
      url: 'admin/updateNotificationStatus',
      data: data,  
    }
    // console.log("number 2", params);
    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      // console.log("number 3", response.body);
      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }

  push_status_click(event, id)
  {
    let stat = event.target.checked ? "true" : "false"; 
        var data= {}
        data['id']=id
        data['status'] =stat
        data['type'] ="Customer"
        data['sendType'] ="push"
    
 
    var params = 
    {
      url: 'admin/updateNotificationStatus',
      data: data,  
    }

    this.apiCall.commonPostService(params).subscribe((response:any)=>{

      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }

  
  store_email_status_click(event, id)
  {
    let stat = event.target.checked ? "true" : "false"; 
    var data= {}
    data['id']=id
    data['status'] =stat
    data['type'] ="Manager"
    data['sendType'] ="email"
      
    var params = 
    {
      url: 'admin/updateNotificationStatus',
      data: data,  
    }
 
    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }
  store_push_status_click(event, id)
  {
    let stat = event.target.checked ? "true" : "false"; 
    var data= {}
    data['id']=id
    data['status'] =stat
    data['type'] ="Manager"
    data['sendType'] ="push"
      
    var params = 
    {
      url: 'admin/updateNotificationStatus',
      data: data,  
    }

    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }

  store_sms_status_click(event, id)
  {
    let stat = event.target.checked ? "true" : "false"; 
    var data= {}
    data['id']=id
    data['status'] =stat
    data['type'] ="Manager"
    data['sendType'] ="sms"
      
    var params = 
    {
      url: 'admin/updateNotificationStatus',
      data: data,  
    }

    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }

  deli_push_status_click(event, id)
  {
      
    let stat = event.target.checked ? "true" : "false"; 
    var data= {}
    data['id']=id
    data['status'] =stat
    data['type'] ="Delivery"
    data['sendType'] ="push"
      
    var params = 
    {
      url: 'admin/updateNotificationStatus',
      data: data,  
    }

    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }
  deli_sms_status_click(event, id)
  {
    let stat = event.target.checked ? "true" : "false"; 
    var data= {}
    data['id']=id
    data['status'] =stat
    data['type'] ="Delivery"
    data['sendType'] ="sms"
      
    var params = 
    {
      url: 'admin/updateNotificationStatus',
      data: data,  
    }

    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }

  deli_email_status_click(event, id)
  {
    let stat = event.target.checked ? "true" : "false"; 
    var data= {}
    data['id']=id
    data['status'] =stat
    data['type'] ="Delivery"
    data['sendType'] ="email"
      
    var params = 
    {
      url: 'admin/updateNotificationStatus',
      data: data,  
    }

    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      if(response.body.error=="false")
      {
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }

}
