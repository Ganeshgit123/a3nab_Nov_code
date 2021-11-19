import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { DatePipe } from '@angular/common';
declare var $:any;


@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css'],
  providers: [DatePipe]
})
export class UserSettingComponent implements OnInit {

  addUserSetting: FormGroup;
  bsValue: Date = new Date();
  account: any = true;
  level1: any = true;
  level2: any = true;
  level3: any = true;
  superAdmin: any = true;
  getroleslist: any = [];
  getpermission:any = [];
  userlist:any = [];
  id : number;
  data : any = {};
  object : number;
  rolesdd : number = 1;


  constructor(private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) 
    { }


  ngOnInit(): void {
    
    this.addUserSetting   = this.formBuilder.group({
      firstName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      lastName: ['', [Validators.required,Validators.pattern(/^\S+(?: \S+)*$/)]],
      email: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      dob: [this.bsValue,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      mobileNumber: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      password: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // gender: ['Male',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // account: [this.account, []],
      // level1: [this.level1, []],
      // level2: [this.level2, []],
      // level3: [this.level3, []],
      // superAdmin: [this.superAdmin, []],
      roleId: ['', [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      
    });

    let params = {
      url: "admin/getAdminRoles"
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == "false")
      {
           this.getroleslist = resu.data.roles;
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });

    const data = {roleId: 1}
    this.rolebypermission(data)
    
  }

  async onSubmit(){
    console.log(this.addUserSetting.value)
    if(!this.addUserSetting.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    const formData = new FormData();

    const postData = this.addUserSetting.value
    postData['dob'] = this.datePipe.transform(this.addUserSetting.value.dob, 'yyyy-MM-dd');

    var params = {
      url: 'admin/addSubAdmin',
      data: postData
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_adm_btn').modal('hide');
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

  onChangeFilter(object){

  this.rolesdd = object
    const data = {roleId: object}
    this.rolebypermission(data)
  }

  rolebypermission(data){

    var params = {
      url: 'admin/roleByPermission',
      data: data 
    }
    // console.log(",,,,,,,",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {

          this.getpermission = response.body.data.permission;

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

  read_update_change(event, id){
    let stat = event.target.checked ? "true" : "false"; 
    
    var data= {}
    data['id']=id
    data['roleId']=this.rolesdd
    data['writeOpt'] = ""
    data['readOpt'] = stat
    data['exportOpt'] = ""

    var params = 
    {
      url: 'admin/updatePermission',
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

  write_update_change(event, id){
    let stat = event.target.checked ? "true" : "false"; 
    var data= {}
    data['id']=id
    data['roleId'] =this.rolesdd
    data['writeOpt'] = stat
    data['readOpt'] = ""
    data['exportOpt'] = ""
    var params = 
    {
      url: 'admin/updatePermission',
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

  export_update_change(event, id){
    let stat = event.target.checked ? "true" : "false"; 
    var data= {}
    data['id']=id
    data['roleId'] =this.rolesdd
    data['writeOpt'] = ""
    data['readOpt'] = ""
    data['exportOpt'] = stat
    var params = 
    {
      url: 'admin/updatePermission',
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
  
 

  del_user_set(id)
  {
    this.data.id = id
    this.data.isDelete =1
    
    var params = {
      url: 'admin/deleteAdmin',
      data: this.data
      
    }
  
    this.apiCall.commonPostService(params).subscribe((result:any)=>{
      if(result.body.error=="false")
      {
     
        this.apiCall.showToast(result.body.message, 'Success', 'successToastr')
        this.ngOnInit();
       }
       else{
        this.apiCall.showToast(result.body.message, 'Error', '')
       }
   });
  }

}
