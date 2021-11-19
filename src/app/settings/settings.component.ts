import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { DatePipe } from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [DatePipe]
})
export class SettingsComponent implements OnInit {

  radiusForm: FormGroup;
  submitted = false;
  addUserSetting: FormGroup;
  bsValue: Date = new Date();
  userId: number;
  isEdit = false;

  userlist:any;
  showAccept = 'true';
 
  constructor(
    private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    // this.radiusForm = this.formBuilder.group({
    //   radius: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    // });
    this.getAdminList();

    this.addUserSetting   = this.formBuilder.group({
      firstName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      lastName: ['', [Validators.required,Validators.pattern(/^\S+(?: \S+)*$/)]],
      email: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      dob: [this.bsValue,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      mobileNumber: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // password: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      roleId: ['', [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      
    });

    // this.getSettings()
    this.callRolePermission();

  }

  getAdminList(){
    var params = {
      url: 'admin/getSubadmin',
    }
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let res = result.body;
      if(res.error=="false")
      {    
           this.userlist = res.data.admin;
  //  console.log("ad",this.userlist)
      }else{
        this.apiCall.showToast(res.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
    });
  }
  
  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let settingpermission = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = settingpermission[7].writeOpt
  
    }
  }

  getSettings(){
    var params = {
      url: 'admin/getSettings',
      data: { }
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.radiusForm = this.formBuilder.group({
            radius: [response.body.data.settings.radius,  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
          });
          // Success
          // this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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

  edituser(data){
// console.log("edit",data)
$('#edit_btn').modal('show');

    var dob = new Date(data['dob']);
    this.isEdit = true;

    this.userId = data['id']
    this.addUserSetting   = this.formBuilder.group({
      firstName: [data['firstName'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      lastName: [data['lastName'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      dob: [dob,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      email: [data['email'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      mobileNumber: [data['mobileNumber'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      roleId: [data['roleId'], [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    })

    // console.log("bind",this.addUserSetting.value)
  }

  onSubmit(){
    this.submitted = true;
    // if (!this.radiusForm.valid) {
    //   this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
    //   return false;
    // }

    if(this.isEdit){
      this.userEditService(this.addUserSetting.value)
      return;
    }

    var params = {
      url: 'admin/updateSettings',
      data: this.radiusForm.value
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

  async userEditService(data){
// console.log("sub",data)
    data['dob'] = this.datePipe.transform(data.dob, 'yyyy-MM-dd');

    data['id'] = this.userId

    var params = {
      url: 'admin/updateSubAdmin',
      data: data
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#edit_btn').modal('hide');
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

  deleteUser(id){
    const object = {}
    object['id'] = id
    object['isDelete'] = 1
    let params ={
      url:"admin/deleteAdmin",
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

}
