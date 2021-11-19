import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
declare var $:any;


@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css'],
  providers: [DatePipe,NgbRatingConfig]
})
export class DriversComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;
  selected = 0;
  hovered = 0;
  bsValue: Date = new Date();

  addDriver: FormGroup;
  driverList: any;
  imagePreview = null;
  fileUpload: any;
  driverId: number;
  updateFloating: FormGroup;
  submitted = false;

  isEdit = false;
  driverActive: number;
  show = false;
  buttonName = 'Enter Amount';
  hide: any;
  zoom: number = 5;
  // initial center position for the map
  lat: number = 24.774265;
  lng: number = 46.738586;
  id : number;
  markers: marker[] = []
  previous;
  showAccept = 'true';
  floatcash : any;
  latitude : any;
  longitude : any;
  fname : any;
  lname : any;
  test : boolean = true;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private config: NgbRatingConfig
  ) { config.max = 5;}

  ngOnInit(): void {
    
    this.addDriver   = this.formBuilder.group({
      firstName: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      profilePic: [''],
      dob: [this.bsValue,  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      lastName: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      email: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      IDNumber: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      gender: ['Male',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      mobileNumber: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      countryCode: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    })

    const obj = {driverActive:1 }

    this.getDriverList(obj)

    this.callRolePermission()

    this.test = false;

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = orderpermission[1].writeOpt
      // console.log(">>>", this.showAccept)
    }
  }

  clickedMarker(infowindow){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindow;
  }

  addNewDriver(){
    this.isEdit = false; 
    this.imagePreview = null;
    this.addDriver.reset();
  }
  
  ChangeStatus(value, active){
    if(value === true){
      var driverActive = '1' 
     } else {
       var driverActive = '0'
     }
     const object = { id: this.driverId,  driverActive: driverActive}
     
     var params = {
      url: 'admin/updateDriverActive',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_driv_btn').modal('hide');
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

  spotOnMap(data){
    this.latitude = data['latitude']
    this.longitude = data['longitude']
    this.fname = data['firstName']
    this.lname = data['lastName']
 
  }

  viewProfile(data){
    // console.log("ddd",data)
    $('#add_driv_btn').modal('show');
    this.imagePreview = data['profilePic']

    var dob = new Date(data['dob']);


    this.driverActive = data['driverActive']

    this.isEdit = true;
    this.driverId = data['id']
    this.addDriver   = this.formBuilder.group({
      firstName: [data['firstName'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      profilePic: [''],
      dob: [dob,  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      lastName: [data['lastName'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      email: [data['email'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      IDNumber: [data['IDNumber'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      gender: [data['gender'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      mobileNumber: [data['mobileNumber'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      countryCode: [data['countryCode'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    })
  }

  onchangeDriver(values:any,val){

    if(val){
      this.test = false;
    } else{
      this.test = true;
    }
    console.log(val);

    // console.log("changevalue",values)

    if(values.currentTarget.checked === true){
     var driverActive = '0' 
    } else {
      var driverActive = '1'
    }
    const object = { driverActive: driverActive }
    this.getDriverList(object)
  }

  driveStatus(val){
    const object = {}

    object['id'] = val
     object['isDelete'] = '1'
     
     let params ={
      url:"admin/updateDriverDeleStatus",
      data:object
    }
  // console.log(">>>",params)
    this.apiCall.commonPostService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == "false")
      {
        this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr');
        this.ngOnInit();
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr');
      }
      
    },(error)=>{
      console.error(error);
    });
  }

  uploadImageFile(event){
    var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = event.target.files[0]
  }

  searchSuggestion(searchValue){
    const object = { name: searchValue }
    this.getDriverList(object)
  }

  getDriverList(obj){
    var params = {
      url: 'admin/getDriverList',
      data: obj
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.driverList = response.body.data.driver
        //  console.log("fef",this.driverList)
          this.markers = response.body.data.driver
          this.floatcash = response.body.data.floatingCash

          this.updateFloating = this.formBuilder.group({
            amount: [this.driverList.amount, []],          
          });

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

  async onSubmit(){
    // console.log(this.addDriver.value)
    this.submitted = true;

    if(!this.addDriver.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    if(this.isEdit){
      this.driverEditService(this.addDriver.value)
      return;
    }

    const formData = new FormData();
    formData.append('uploaded_file', this.fileUpload); 
    const image = await this.apiCall.imageuploadFunctions(formData);

    const postData = this.addDriver.value
    postData['profilePic'] = image['uploadUrl']
    postData['dob'] = this.datePipe.transform(this.addDriver.value.dob, 'yyyy-MM-dd');

    var params = {
      url: 'admin/addDriver',
      data: postData
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.submitted = false;
          $('#add_driv_btn').modal('hide');
          this.imagePreview = null;
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


  async driverEditService(data){
    
    this.submitted = false;

    data['profilePic'] = this.imagePreview
    data['dob'] = this.datePipe.transform(data.dob, 'yyyy-MM-dd');

      const formData = new FormData();
      formData.append('uploaded_file', this.fileUpload); 
      const image = await this.apiCall.imageuploadFunctions(formData);
      data['profilePic'] = image['uploadUrl']

    data['id'] = this.driverId

    var params = {
      url: 'admin/editDriver',
      data: data
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_driv_btn').modal('hide');
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

  ngOnDestroy() {
    this.submitted = false;
    this.imagePreview = null;
    this.addDriver.reset();
    $('#add_driv_btn').modal('hide');
  }


  toggle() {
    this.show = !this.show
    if(this.show) {
    this.buttonName = 'Hide'
    }
    else {
    this.buttonName = 'Enter Amount'
    }
    }

  onlinks(item){
    var data=this.updateFloating.value;
    data['id']=item.id
    
    var params = {
      url: 'admin/updateFloatingCash',
      data: data,
    }
    console.log(params)
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

}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
