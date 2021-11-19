import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallService } from '../services/api-call.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  errorMessge: string;
  isShow = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiCall: ApiCallService
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
    if (sessionStorage.getItem('access_token')) {
      console.log(sessionStorage.getItem('access_token'))
      this.router.navigateByUrl(this.returnUrl);
    }
    this.loginForm = this.formBuilder.group({
      email: ['',  [Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)]],
      password: ['',  [Validators.required, Validators.minLength(6),Validators.maxLength(15)]]
    });
  }

  changeText(){
    this.isShow = false;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      return false;
     }
     this.isShow = false;
     this.apiCall.adminLogin(this.loginForm.value).subscribe(
      res => {
        if(res.body['error'] == "false"){
          sessionStorage.setItem('access_token', (res.body['data'].token));
          sessionStorage.setItem('adminRole', (res.body['data'].info.role))
          sessionStorage.setItem('permission', (JSON.stringify(res.body['data'].permission)))
          this.router.navigateByUrl('/dashboard');
        } else {
          this.isShow = true;
          this.errorMessge = res.body['message'];
        }
        
      })
    }

}
