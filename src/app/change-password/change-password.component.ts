import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm:FormGroup;
  submitted = false;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.passwordForm   = this.formBuilder.group({
      pass: ['',  [Validators.required, Validators.minLength(6),Validators.maxLength(15)]],
      con_pass: ['',  [Validators.required, Validators.minLength(6),Validators.maxLength(15)]],
    });
  }

  

  onSubmitPassword(){
    this.submitted = true;
    if (!this.passwordForm.valid) {
      return false;
     }
    const formData = new FormData();

    const postData = this.passwordForm.value

    var params = {
      url: 'admin/changeAdminPass',
      data: postData
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
          sessionStorage.clear();
    this.router.navigateByUrl('/');
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

}
