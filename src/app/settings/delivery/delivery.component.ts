import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
declare var $:any;

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

     addtimeslot : FormGroup;
     flatRatebykm : FormGroup;
     timeSlotMon: any;
     timeSlotTues: any;
     timeSlotWed: any;
     timeSlotThurs: any;
     timeSlotFri: any;
     timeSlotSat: any;
     timeSlotSun: any;
     dayslot:any[];
     submitted = false;
     isEdit  = false;
     id : number;
     mon: any;
     tues: any;
     wed: any;
     thur: any;
     fri: any;
     sat: any;
     sun: any;
     getRatebykm: any = {};
     zoom: number = 5;
     showMap = false;
     previous;
     showAccept = 'true';
  
     // initial center position for the map
     lat: number = 10.616698;
     lng: number = 76.936195;
     markers: marker[] = []

  constructor(private formBuilder:FormBuilder,
    private apiCall: ApiCallService,) { }

  ngOnInit(): void {
    this.addtimeslot   = this.formBuilder.group({
      fromTime: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      toTime: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      maxOrder: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      dayId: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]]
    });

    this.flatRatebykm = this.formBuilder.group({
      flatRate: ['', []],
      perKM: ['', []],
      QuickDeliveryPerKM: ['',[]],  
    });

    var params1 = {
      url: 'admin/getTimeSlot',
      data: {
      }
    }
  
    this.apiCall.commonGetService(params1).subscribe((result:any)=>{
      // console.log('offers response', result.body);
      let resu = result.body;
      if(resu.error == "false")
      {

        this.dayslot = resu.data.timeSlot;
        // console.log("time",this.dayslot)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
    });

    var params = {
      url: 'admin/getAppSettings',
    }
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let res = result.body;
      if(res.error=="false")
      {    
           this.getRatebykm = res.data.socialLinks;
             
           this.flatRatebykm = this.formBuilder.group({
            flatRate: [this.getRatebykm.flatRate, []],
            perKM: [this.getRatebykm.perKM, []],
            QuickDeliveryPerKM: [this.getRatebykm.QuickDeliveryPerKM,[]],  
          });
        
      }else{
        this.apiCall.showToast(res.message, 'Error', 'errorToastr')
      }
    });
    this.callRolePermission();
  }


  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let settingpermission = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = settingpermission[7].writeOpt
  
    }
  }

  openAddTimeslot(){
    this.isEdit = false; 
    this.addtimeslot.reset();
  }

  editTimeSlot(items){
    $('#add_time_slot_btn').modal('show');
    // console.log("Edit offer",item)
    
    this.isEdit = true;
    this.id = items['id']
    this.addtimeslot   = this.formBuilder.group({
      fromTime: [items['fromTime'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    toTime: [items['toTime'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    maxOrder: [items['maxOrder'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    dayId: [items['dayId'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]]
    
      
    })
    // console.log("vev",item['dayId']);
    }

    async onSubmit(){
    this.submitted = true;

    if (!this.addtimeslot.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    if(this.isEdit){
      this.timeSlotEdit(this.addtimeslot.value)
      return;
    }

    const object = this.addtimeslot.value;

   
    var params = {
      url: 'admin/addTimeSlot',
      data: object
    }

// console.log("add",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == "false") {
          // Success
          // console.log(response.body)
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.submitted = false;
          this.addtimeslot.reset();
          $('#add_time_slot_btn').modal('hide');
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

    async timeSlotEdit(data){

    data['id'] = this.id

    var params = {
      url: 'admin/editTimeSlot',
      data: data
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_time_slot_btn').modal('hide');
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

    ngOnDestroy() {
      this.submitted = false;
      this.addtimeslot.reset();
      $('#add_time_slot_btn').modal('hide');
    }

      deleteTimeSlot(items,item){
        var object = { id: items.id,dayId: item}

        // console.log(object);
        let params ={
          url:"admin/deleteTimeSlot",
          data : object
        }
      
        this.apiCall.commonPostService(params).subscribe((result:any)=>{
          let resu = result.body;
          // console.log('delete responce', resu);
          if(resu.error == "false")
          {
            this.apiCall.showToast("Deleted", 'Success', 'successToastr');
          this.ngOnInit();
          }else{
            this.apiCall.showToast(resu.message, 'Error', 'errorToastr');
          }
          
        },(error)=>{
          console.error(error);
        });
      
      }


  changeRate(){
     
    var params = {
      url: 'admin/distanceRate',
      data: this.flatRatebykm.value
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
        } else {
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
  onchangeMap(values:any){
    this.showMap = values.currentTarget.checked;
  }

  }

  interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
  }
  