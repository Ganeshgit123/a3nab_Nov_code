import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {
  assignmentList: any;
  status = '0';
  pages: any;
  page : Number =1;
  
  constructor(
    private apiCall: ApiCallService,
  ) { }

  ngOnInit(): void {
    const data = { pageNumber: 1,status: 0 }
    this.getAssignment(data)
  }

  onChangeFilter(status){
    const data = {pageNumber: 1, status: status }
    this.getAssignment(data)
  }


  getAssignment(data){
    // console.log(data)
    var params = {  
      url: 'admin/getAssignmentList',
      data: data
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        console.log(response.body)
        if (response.body.error == 'false') {
          // Success
     
          this.pages = response.body.data.page * 10;
          this.assignmentList = response.body.data.assign
          console.log("ass",this.assignmentList)
          // this.markers = response.body.data.orders
          // this.supportForm.reset();
          // this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
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



  nextPage(page){
    const object = { pageNumber: page,status: 0 }
    this.getAssignment(object)
  }

  searchAssignment(value : any ){
    const object = { pageNumber: this.page,status: 0,text:value}
    this.getAssignment(object)
  }

  pageReload() {
    this.ngOnInit();
    window.location.reload();
  }
}
