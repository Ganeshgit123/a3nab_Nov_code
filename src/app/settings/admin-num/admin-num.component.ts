import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { request } from 'http';
import { ApiCallService } from '../../services/api-call.service';


@Component({
  selector: 'app-admin-num',
  templateUrl: './admin-num.component.html',
  styleUrls: ['./admin-num.component.css']
})
export class AdminNumComponent implements OnInit {
  showAccept = 'true';
  adminNum: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService) { }

  ngOnInit(): void {
    this.callRolePermission();

    this.adminNum = this.formBuilder.group({
      customerAdminNum: ['',  []],
      driverAdminNum: ['',  []],
      storeAdminNum: ['',  []],
    });

    var params = {
      url: 'admin/getAppSettings',
    }
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let res = result.body;
      if(res.error=="false")
      {    

            this.adminNum = this.formBuilder.group({
              customerAdminNum: [res.data.socialLinks.customerAdminNum, []],
              driverAdminNum: [res.data.socialLinks.driverAdminNum, []],
              storeAdminNum: [ res.data.socialLinks.storeAdminNum,[]],         
          });

        
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


changeAdminNum(){
  var params = {
    url: 'admin/updateAdminNumber',
    data: this.adminNum.value
    
  }
  
  // return;
  this.apiCall.commonPostService(params).subscribe(
    (response: any) => {
              console.log("hi",response.body)

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
