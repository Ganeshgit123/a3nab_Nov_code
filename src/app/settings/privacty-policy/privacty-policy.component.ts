import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
declare var $:any;

@Component({
  selector: 'app-privacty-policy',
  templateUrl: './privacty-policy.component.html',
  styleUrls: ['./privacty-policy.component.css']
})
export class PrivactyPolicyComponent implements OnInit {

  privacys : FormGroup;
  termsN : FormGroup;

  constructor( 
    private formBuilder:FormBuilder,
    private apiCall: ApiCallService,) { }

  ngOnInit(): void {

    this.privacys = this.formBuilder.group({
      text:  ["Privacy Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet",[]]
    });

    this.termsN = this.formBuilder.group({
      text:  ["Terms Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet",[]]
    });

  }

  pri_sub()
  {

    if(!this.privacys.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }else{
      var data = this.privacys.value;
      data['type'] = "POLICY"
     
      var params = {
        url : 'admin/addPolicyNcondition',
        data : data
      }
     

      this.apiCall.commonPostService(params).subscribe((result: any)=>{
        result = result.body;
        if(result.error =="false")
        {
          this.apiCall.showToast(result.message, 'Success', 'successToastr');
          $('#private').modal('hide');
          this.ngOnInit();
        }else{
          this.apiCall.showToast(result.message, 'Error', '')
        }
      });
    }
  }
  termsand()
  {
    if(!this.termsN.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }else{
      var data = this.termsN.value;
      data['type'] = "CONDITION"
     
      var params = {
        url : 'admin/addPolicyNcondition',
        data : data
      }
     

      this.apiCall.commonPostService(params).subscribe((result: any)=>{
        result = result.body;
        // console.log("-----", result);
        if(result.error =="false")
        {
          this.apiCall.showToast(result.message, 'Success', 'successToastr');
          $('#Terms').modal('hide');
          this.ngOnInit();
        }else{
          this.apiCall.showToast(result.message, 'Error', '')
        }
      });
    }
  }

}
