import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $:any;

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {
  storeList:any;
  storeForm: FormGroup;
  submitted = false;
  showMap = false;
  storecsvOptions: any;

  imagePreview:any;
  fileUpload: any;
  zoom: number = 5;
  
  // initial center position for the map
  lat: number = 24.774265;
  lng: number = 46.738586;

  markers: marker[] = []
  previous;
  pages: any;
  page : Number =1;
showAccept = 'true';
showExport = 'true';
  
  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  

  ngOnInit(): void {
    const activeMenu = document.getElementById('orders');
    activeMenu.classList.remove('active');
    const object = { pageNumber: 1 }
    this.getStoreList(object)

    this.storeForm   = this.formBuilder.group({
      storeName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      managerFname: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      managerLname: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      email: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      mobileNumber: ['',  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.minLength(6), Validators.maxLength(15)]],
      storeAddress: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      storeImage: [''],
      latitude: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      longitude: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      dueDay: ['',  [Validators.required, Validators.pattern(/\b(0?[1-9]|[12][0-9]|3[01])\b/)]],
      storeRadius: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      storePercentage: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]]
    });
    
    // To allow value within range between 1 to 31
    // $("#inputTxt").on("change", function() {
    //   // that = this
    //   var that = this
    //   var val = parseInt(this.value);
    //   if(val > 31 || val < 1)
    //   {
    //       alert('Please enter 1 to 31 dates');
    //       this.value ='';  
    //       $('#inputTxt').val("");

    //       that.funcCall()
    //       // this.storeForm.get('dueDay'). 
    //       // this.storeForm.reset();     
    //   }
    // })
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))

      this.showAccept = orderpermission[2].writeOpt
      this.showExport = orderpermission[2].exportOpt

    }
  }


  funcCall(){
    console.log('ll')
  }
  
  public restrictNumeric(e) {
    let input;
    // console.log(e.which)
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);    
   }

  

  uploadImageFile(event){
    
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = event.target.files[0]
    
  }

  nextPage(page){
    const object = { pageNumber: page}
    this.getStoreList(object)
  }

  searchStores(value : any ){
    const object = { pageNumber: this.page,text:value }
    this.getStoreList(object)
  }

  getStoreList(object){
    var params = {
      url: 'admin/storeList',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          // console.log(response.body)
        this.pages = response.body.pages * 10;
          this.storeList = response.body.storeList
          this.markers = response.body.storeList
          console.log("store",this.storeList)
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

  exportList(event: any){
    var  object = {pageNumber: this.page}
    var params = {
      url: 'admin/storeList',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          // console.log(response.body)
        this.pages = response.body.pages * 10;
          this.storeList = response.body.storeList
          this.markers = response.body.storeList
          // console.log(this.markers)
          if(response.body.storeList.length > 0){
            this.exportStoreData(response.body.storeList)
          }
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

  onchangeMap(values:any){
    this.showMap = values.currentTarget.checked;
  }
  clickedMarker(infowindow){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindow;
  }

  async onSubmit(){
    this.submitted = true;

    console.log(this.storeForm.value)
    if (!this.storeForm.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    console.log('final call')

    // console.log(this.storeForm.value)

    // return;

    // console.log(this.fileUpload)

    const formData = new FormData();
    formData.append('uploaded_file', this.fileUpload); 
    const image = await this.apiCall.imageuploadFunctions(formData);
    const object = this.storeForm.value

      object['storeImage'] = image['uploadUrl']
      var params = {
        url: 'admin/addNewStore',
        data: object
      }
      // console.log(object)
      // return;
    // this.storeForm.reset();
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          // console.log(response.body)
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          // this.router.navigateByUrl('/store');
          this.submitted = false;
          this.storeForm.reset();
          $('#add_store_btn').modal('hide');
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

  deleteStore(id){
    var params = {
      url: 'admin/deleteStore',
      data: { id: id }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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

  ChnageStoteStatus(status, id){
    const object = {}
    object['id'] = id
    if(status){
      object['status'] = 'active'
    } else {
      object['status'] = 'inactive'
    }
    var params = {
      url: 'admin/updateStoreActive',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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
    this.storeForm.reset();
    $('#add_store_btn').modal('hide');
  }

  openAddStore(){
    this.submitted = false;
    this.storeForm.reset();
  }

  exportStoreData(data){

    if(data.length > 0){
      var bulkArray = []
      data.forEach(element => {
        var obj = {}
        obj['createdDate'] = element.createdDate
        obj['time'] = element.time
        obj['storeID'] = element.storeID
        obj['storeName'] = element.storeName
        obj['managerFname'] = element.managerFname
        obj['mobileNumber'] = element.mobileNumber
        obj['storeAddress'] = element.storeAddress
        obj['email'] = element.email
        obj['status'] = element.status

        bulkArray.push(obj)
      })

      this.storecsvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Store Report',
        useBom: true,
        noDownload: false,
        headers: ["createdDate", "Time", "storeID", "storeName", "Managers", "Mobile Number", "Store Address", "Email", "Store Status"]
      };
      new  AngularCsv(bulkArray, "Store Report", this.storecsvOptions);

    }
  }

}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
