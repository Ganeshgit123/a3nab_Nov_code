import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  radiusForm: FormGroup;
  addLink: FormGroup;
  addextras: FormGroup;
  submitted = false;
  getlinks: any = {};
  instaurl: any = {};
  fburl: any = {};
  linkedurl: any = {};
  twitterurl: any = {};
  quickDelivery: any  = 'false';
  showAccept = 'true';

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService
    ) { }

  ngOnInit(): void {
    this.radiusForm = this.formBuilder.group({
      radius: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    });

    this.addLink = this.formBuilder.group({
      instagramURL: ['',  []],
      facebookURL: ['',  []],
      linkedURL: ['',  []],
      twitterURL: ['',  []],
    });

    this.addextras = this.formBuilder.group({
      minimumOrderValue: ['',[]],
      walletAmount: ['',[]],
      expiryDate: ['',[]],
      taxAmount: ['',[]],
      walletSAR: ['',[]],
      walletPoints: ['',[]],
      });

    var params = {
      url: 'admin/getAppSettings',
    }
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let res = result.body;
      if(res.error=="false")
      {    
           this.getlinks = res.data.socialLinks;
           this.quickDelivery = res.data.socialLinks.quickDelivery;

            this.addLink = this.formBuilder.group({
            instagramURL: [res.data.socialLinks.instagramURL, []],
            facebookURL: [res.data.socialLinks.facebookURL, []],
            linkedURL: [ res.data.socialLinks.linkedURL,[]],
            twitterURL: [ res.data.socialLinks.twitterURL,[]],            
          });

          this.addextras = this.formBuilder.group({
            minimumOrderValue: [res.data.socialLinks.minimumOrderValue,[]],
            walletAmount: [res.data.socialLinks.walletAmount,[]],
            expiryDate: [res.data.socialLinks.expiryDate,[]],
            taxAmount: [res.data.socialLinks.taxAmount,[]],
            walletSAR: [res.data.socialLinks.walletSAR,[]],
            walletPoints: [res.data.socialLinks.walletPoints,[]],
            });
        
      }else{
        this.apiCall.showToast(res.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
    });
    this.callRolePermission();

  }


  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let settingpermission = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = settingpermission[7].writeOpt
  
    }
  }
onlinks()
  {
    if(!this.addLink.valid)
    {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }
    else{
      var params = {
        url: 'admin/updateSocialLinks',
        data: this.addLink.value
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
  }

  changeWallet()
  {

      var params = {
        url: 'admin/updateWalletSetting',
        data: this.addextras.value
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

  changeOrder()
  {
  this.addextras.value['quickDelivery'] = this.addextras.value['quickDelivery'] ? "true" : "false";
// console.log("kdmfkewf",this.addextras.value)
      var params = {
        url: 'admin/updateOrderSettings',
        data: this.addextras.value
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

  statclick(quickDelivery){
    // console.log("dsfwef",quickDelivery)
    const object = {}
    if(quickDelivery){
      object['quickDelivery'] = 'true'
    } else {
      object['quickDelivery'] = 'false'
    }

    let statid ={
      url:"admin/updateQuickDelivery",
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


  onSubmit(){
    this.submitted = true;
    if (!this.radiusForm.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    var params = {
      url: 'admin/updateSettings',
      data: this.radiusForm.value
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

}

