import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
  providers: [DatePipe,NgbRatingConfig]
})
export class CarsComponent implements OnInit {
datePickerConfig:Partial<BsDatepickerConfig>;

bsValue: Date = new Date();
addCar: FormGroup;
carList: any;
fileUpload: any;
driverList: any;
carMainList: any;
carMaintainList:any;
carDamageList:any;
assigCar: number;
id : number;
carFname:any;
carLname:any;
carlastOilChange:any;
carlastGasRefill:any;
startingMileage:any;
licenseNumber:any;
expirationListDate:any;
imagePreview = null;
carModel:any;
carImage:any;
isEdit = false;
carId: number;
submitted = false;
searchValue : any;
status :any;
searchDriverAssign;


originalArray: any;

zoom: number = 5;
// initial center position for the map
lat: number = 24.774265;
  lng: number = 46.738586;
markers: marker[] = []
previous;
valueFrom = ''
valueTo = ''
filtID : number;
showAccept = 'true';
searchCar;
searchMaintainList;
searchAssign;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private config: NgbRatingConfig
  ) {config.max = 5; }

  ngOnInit(): void {

    this.addCar   = this.formBuilder.group({
      licenseNumber: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      carImage: [''],
      expirationDate: [this.bsValue,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      startingMileage: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      carModel: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    })  

    const data = {status: "ALL"}
    this.getCars(data)
    this.assignDriverList();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))

      this.showAccept = orderpermission[1].writeOpt

    }
  }

  assignDriverList(){
    var params = {
      url: 'admin/assignDriverList',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          // console.log(response.body)
          this.driverList = response.body.data.driver
          this.originalArray = response.body.data.driver
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

  searchDriver(value){
    var filterProducts = this.originalArray.filter(function(item) {
      return item.drId.toLowerCase().indexOf(value.toLowerCase()) >= 0
     })
     this.driverList = filterProducts;
  }

  clickedMarker(infowindow){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindow;
  }

  onChangeFilter(status){
    this.status = status;
    const data = {status: this.status}
    this.getCars(data)
  }

  searchSuggestion(searchValue){
    this.searchValue = searchValue;
    const data = {status: 'ALL',name: this.searchValue }
    this.getCars(data)

  }

  getCars(data){

    var params = {
      url: 'admin/getAllCarList',
      data: data
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          // console.log(response.body)
          this.carList = response.body.data.cars
          this.markers = response.body.data.cars
        
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

  assigndri(data){
    this.assignDriverList();
    this.assigCar = data.id
    console.log(this.assigCar)
  }

  handleChange(value){
    const obj = { carId: this.assigCar, driverId: value }

    var params = {
      url: 'admin/assignDriver',
      data: obj
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#assign_dri_btn').modal('hide');
          this.assigCar = null;
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

  uploadImageFile(event){
    var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = event.target.files[0]
  }

  async onSubmit(){
    // console.log(this.addCar.value)
    this.submitted = true;

    if(!this.addCar.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    if(this.isEdit){
      this.carEditService(this.addCar.value)
      return;
    }

    const formData = new FormData();
    formData.append('uploaded_file', this.fileUpload); 
    const image = await this.apiCall.imageuploadFunctions(formData);

    const postData = this.addCar.value
    postData['expirationDate'] = this.datePipe.transform(this.addCar.value.expirationDate, 'yyyy-MM-dd');
    postData['carImage'] = image['uploadUrl']
       
    
    var params = {
      url: 'admin/addCar',
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

  rangevalueFrom(event: any){
    this.valueFrom= this.datePipe.transform(event, 'yyyy-MM-dd');
    this.drivStat(this.filtID,this.valueFrom,this.valueTo)
  }

  rangevalueTo(event: any){
    this.valueTo = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.drivStat(this.filtID,this.valueFrom,this.valueTo)
  }

  drivStat(id,valueFrom,valueTo){
     this.filtID = id;
     this.valueFrom = valueFrom;
     this.valueTo = valueTo;
  var params = 
        {
          url: 'admin/viewCarrDetails',
          data: {id : this.filtID,fromDate: this.valueFrom, toDate: this.valueTo}
        }
        // console.log("????",params)
        this.apiCall.commonPostService(params).subscribe(
          (response: any) => {
            if (response.body.error == 'false') {
              // Success
              this.carMainList = response.body.data.car
              this.carFname = response.body.data.car.firstName
              this.carLname = response.body.data.car.lastName
              this.carlastOilChange = response.body.data.car.lastDateOilChange
              this.carlastGasRefill = response.body.data.car.lastDateGasRefill
              this.startingMileage = response.body.data.car.startingMileage
              this.licenseNumber = response.body.data.car.licenseNumber
              this.expirationListDate = response.body.data.car.expirationDate
              this.carModel = response.body.data.car.carModel
              this.carImage = response.body.data.car.carImage
            
              this.carDamageList = response.body.data.damages

              this.carMaintainList = response.body.data.maintenance
            } else {
              // Query Error
              this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
            }
          },
          (error) => {
            this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
            console.log('Error', error)
          });
}

editCars(data){
  console.log("edit",data)
  $('#add_driv_btn').modal('show');
    this.imagePreview = data['carImage']
    var expiryDate = new Date(data['expirationDate']);
    this.isEdit = true;
    this.carId = data['id']
    this.addCar   = this.formBuilder.group({
      licenseNumber: [data['licenseNumber'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      carImage: [''],
      expirationDate: [expiryDate,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      startingMileage: [data['startingMileage'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      carModel: [data['carModel'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    })
}

async carEditService(data){
  console.log("ddd",data)
  this.submitted = false;
  data['carImage'] = this.imagePreview


  data['expirationDate'] = this.datePipe.transform(data.expirationDate, 'yyyy-MM-dd');

    const formData = new FormData();
    formData.append('uploaded_file', this.fileUpload); 
    const image = await this.apiCall.imageuploadFunctions(formData);
    data['carImage'] = image['uploadUrl']

  data['id'] = this.carId

  var params = {
    url: 'admin/editCar',
    data: data
  }
console.log("efefe",params)
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

deleteCars(id){
  const object = {}
  object['id'] = id

  let params ={
    url:"admin/deleteCar",
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

ngOnDestroy(){
  this.submitted = false;
  this.imagePreview = null;
  this.addCar.reset();
  $('#add_driv_btn').modal('hide');
}
add_car_click(){
  this.isEdit = false;
  this.addCar.reset();
  this.imagePreview = null;
}

}
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
