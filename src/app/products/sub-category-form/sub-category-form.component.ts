import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sub-category-form',
  templateUrl: './sub-category-form.component.html',
  styleUrls: ['./sub-category-form.component.css']
})
export class SubCategoryFormComponent implements OnInit {
  @Input() mainCategory: number;

  subCategoryForm: FormGroup;
  submitted = false;
  storeList:any;

  filesToUpload: any;
  imagePreview= null;
  isEdit = false;
  editImage = null;
  categoryId = null;
  showAccept = 'true';

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.subCategoryForm = this.formBuilder.group({
      productCategoryName: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      productCategoryImage: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      minimumOrderValue: ['',  [ Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      orderProcessing: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      storeId: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      categoryId: [this.mainCategory,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      arabicName: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      minOrderTime: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      managerPrice: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      isComingSoon: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      isSubcate: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    });
    
    this.getStoreList();

    this.apiCall.categoryFn.subscribe(result => {
      if(result != '0'){
        if(result['isEdit'] === true){
          this.isEdit = true;
          this.editSubCategory(result)
        } else {
          this.isEdit = false;
          this.subCategoryForm.reset();
          this.imagePreview= null;
          this.subCategoryForm.get('managerPrice').setValue(false);
          this.subCategoryForm.get('isComingSoon').setValue(false);
          this.subCategoryForm.get('isSubcate').setValue(false);
          this.subCategoryForm.get('categoryId').setValue(this.mainCategory);
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

  editSubCategory(data){
    var managerPrice = false
    var isComingSoon = false
    var isSubcate = false
    if(data['managerPrice'] == 'true'){
      var managerPrice = true
    }
    if(data['isComingSoon'] == 'true'){
      var isComingSoon = true
    }
    if(data['isSubcate'] === 1){
      var isSubcate = true
    }

    this.imagePreview = data['productCategoryImage']
    this.categoryId = data['id']
    this.subCategoryForm = this.formBuilder.group({
      productCategoryName: [data['productCategoryName'],  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      productCategoryImage: [''],
      minimumOrderValue: [data['minimumOrderValue'],  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      orderProcessing: [data['orderProcessing'],  [Validators.required, Validators.pattern(/\S+(?: \S+)*(?!\s).*$/)]],
      storeId: [data['storeId'],  [Validators.required, Validators.pattern(/\S+(?: \S+)*(?!\s).*$/)]],
      categoryId: [data['categoryId'],  [Validators.required, Validators.pattern(/\S+(?: \S+)*(?!\s).*$/)]],
      arabicName: [data['arabicName'],  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      minOrderTime: [data['minOrderTime'],  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      managerPrice: [managerPrice,  [Validators.required, Validators.pattern(/\S+(?: \S+)*(?!\s).*$/)]],
      isComingSoon: [isComingSoon,  [Validators.required, Validators.pattern(/\S+(?: \S+)*(?!\s).*$/)]],
      isSubcate: [isSubcate,  [Validators.required, Validators.pattern(/\S+(?: \S+)*(?!\s).*$/)]],
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
    // console.log(this.subCategoryForm.value)
    if (!this.subCategoryForm.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    if(this.isEdit){
      this.updateSubcategory(this.subCategoryForm.value)
      return
    }
    

    const formData = new FormData();
    console.log(this.filesToUpload)
    formData.append('uploaded_file', this.filesToUpload); 

    const image = await this.apiCall.imageuploadFunctions(formData);
    const object = this.subCategoryForm.value

    if(!image['error']){
      object['productCategoryImage'] = image['uploadUrl']
      var params = {
        url: 'admin/addProductCategory',
        data: object
      }
      this.spinner.show();
      this.subCategoryForm.reset();
      this.subCategoryForm.get('managerPrice').setValue(false);
      this.subCategoryForm.get('isComingSoon').setValue(false);
      this.subCategoryForm.get('isSubcate').setValue(false);
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          if (response.body.error == false) {
            // Success
            this.spinner.hide();
            this.submitted = false;
            this.imagePreview = null;
            this.apiCall.setProductValue('subCategory')
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

    } else {
      // Upload Error
      this.apiCall.showToast('Upload Error !!', 'Oops', 'errorToastr')
    }
  }

  async updateSubcategory(object){

    const data = object 
    data['productCategoryImage'] = this.imagePreview
    data['id'] = this.categoryId
    if(this.filesToUpload){
      const formData = new FormData();
      formData.append('uploaded_file', this.filesToUpload);
      const image = await this.apiCall.imageuploadFunctions(formData);
      data['productCategoryImage'] = image['uploadUrl']
    }
    var params = {
      url: 'admin/editProductCategory',
      data: data
    }
    this.spinner.show();
    this.subCategoryForm.reset();
    this.subCategoryForm.get('managerPrice').setValue(false);
    this.subCategoryForm.get('isComingSoon').setValue(false);
    this.subCategoryForm.get('isSubcate').setValue(false);
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.spinner.hide();
          this.submitted = false;
          this.imagePreview = null;
          this.apiCall.setProductValue('subCategory')
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
