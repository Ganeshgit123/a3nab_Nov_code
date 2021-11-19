import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sub-sub-category-form',
  templateUrl: './sub-sub-category-form.component.html',
  styleUrls: ['./sub-sub-category-form.component.css']
})
export class SubSubCategoryFormComponent implements OnInit {

  subCategoryForm: FormGroup;
  submitted = false;
  storeList:any;

  filesToUpload: any;
  imagePreview: any;
  subCategoryId = null;
  isEdit= false;

  editImage = null;
  categoryId = null;
  showAccept = 'true';

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.apiCall.subCateFn.subscribe(result => {
      if(result != '0'){
         this.subCategoryId = result
        }
      }, err => {
      console.log(err);
    });
    console.log('subCate', this.subCategoryId)
    // console.log(this.subCategoryId)
    this.subCategoryForm = this.formBuilder.group({
      productSubCategoryName: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      arabicName: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      productCategoryId: [this.subCategoryId,  [Validators.required, Validators.pattern(/\S+(?: \S+)*(?!\s).*$/)]],
      // minimumOrderValue: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // orderProcessing: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // storeId: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // productCategoryId: [this.subCategoryId,  [Validators.required, Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // categoryDescription: ['',  [,Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // minOrderTime: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // managerPrice: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // isComingSoon: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    });
    this.getStoreList();

    this.apiCall.categoryFn.subscribe(result => {
      if(result != '0'){
        if(result['isEdit'] === true){
          this.isEdit = true;
          // console.log(result)
          this.editSubSubCategory(result)
        } else {
          this.isEdit = false;
          this.subCategoryForm.reset();
          // this.subCategoryForm.get('managerPrice').setValue(false);
          // this.subCategoryForm.get('isComingSoon').setValue(false);
          this.subCategoryForm.get('productCategoryId').setValue(this.subCategoryId);
        }
        }
      }, err => {
      console.log(err);
    });
    this.callRolePermission();
  }


  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = orderpermission[2].writeOpt;
    }
  }

  editSubSubCategory(data){

    // console.log(data)

    // var managerPrice = false
    // var isComingSoon = false
    // if(data['managerPrice'] == 'true'){
    //   var managerPrice = true
    // }
    // if(data['isComingSoon'] == 'true'){
    //   var isComingSoon = true
    // }
    // this.editImage = data['productSubCategoryImage']
    this.categoryId = data['id']
    this.subCategoryForm = this.formBuilder.group({
      productSubCategoryName: [data['productSubCategoryName'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      arabicName: [data['arabicName'], [Validators.required, Validators.pattern(/^(?!\s*$).+/)] ],
      productCategoryId: [data['productCategoryId'],  [Validators.required, Validators.pattern(/\S+(?: \S+)*(?!\s).*$/)]],
    });
  }

  getStoreList(){
    var params = {
      url: 'admin/getAllStores',
      data: {}
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.storeList = response.body.data
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  onSelectFile(event){
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if(!valid) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.filesToUpload = file
      // console.log(this.filesToUpload)
    } else {
      // Not valild image
    }
  }

  checkFileFormat(checkFile){
    if(checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff'){
      return false;
    } else {
      return true;
    }
  }

  async onSubmit(){
    this.submitted = true;
    console.log(this.subCategoryForm.value)
    if (!this.subCategoryForm.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    if(this.isEdit === true) {
      this.updateSubSubCategory(this.subCategoryForm.value)
      return;
    }
    // const formData = new FormData();
    // console.log(this.subCategoryForm.value)
    // formData.append('uploaded_file', this.filesToUpload);
    // const image = await this.apiCall.imageuploadFunctions(formData);
    const object = this.subCategoryForm.value

    // if(!image['error']){
    //   object['productSubCategoryImage'] = image['uploadUrl']
      var params = {
        url: 'admin/addSubSubCategory',
        data: object
      }
      this.subCategoryForm.reset();
      this.spinner.show();
      this.subCategoryForm.get('productCategoryId').setValue(this.subCategoryId);
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          if (response.body.error == false) {
            // Success
            this.spinner.hide();
            this.submitted = false;
            this.apiCall.setProductValue('subSubCategory');
            this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          } else {
            this.spinner.hide();
            // Query Error
            this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
          }
        },
        (error) => {
          this.spinner.hide();
          this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
          console.log('Error', error)
        }
      )

    // } else {
    //   // Upload Error
    //   this.apiCall.showToast('Upload Error !!', 'Oops', 'errorToastr')
    // }
  }

  async updateSubSubCategory(object){
    const data = object 
    // data['productSubCategoryImage'] = this.editImage
    data['id'] = this.categoryId
    // if(this.filesToUpload){
    //   const formData = new FormData();
    //   formData.append('uploaded_file', this.filesToUpload);
    //   const image = await this.apiCall.imageuploadFunctions(formData);
    //   data['productSubCategoryImage'] = image['uploadUrl']
    // }

    var params = {
      url: 'admin/editSubSubCategory',
      data: data
    }
    this.spinner.show();
    this.subCategoryForm.reset();
    this.subCategoryForm.get('productCategoryId').setValue(this.subCategoryId);
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        console.log(response.body)
        if (response.body.error == 'false') {
          // Success
          this.spinner.hide();
          this.submitted = false;
          this.apiCall.setProductValue('subSubCategory');
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        } else {
          this.spinner.hide();
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.spinner.hide();
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }

}
