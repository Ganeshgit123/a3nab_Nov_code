import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  propData: any = {}
  showSubCate = false;
  showSubsubCategory = false;
  showProducts = false;
  category: any;
  subCategory: any;
  showSubsubCategoryList: any;
  productList: any;

  showCategoryTab = false;
  showSubCategoryTab = false;
  showSubSubCategoryTab = false;
  showProductsTab = false;


  mainCategoryId  = '';
  subCategoryId  = '';
  subSubCategoryId = '';
  isSubcatepass = ''
  isSubcate: number;
  productId: number;
showAccept = 'true';
searchCategory;
searchSubcategory;
searchSubSubcategory;
searchproduct;
togstatus: any;
besttog:any;
imagePreview= null;

  constructor(
    private apiCall: ApiCallService
  ) { }

  ngOnInit(): void {
    this.apiCall.setProductValue('0')
    const activeMenu = document.getElementById('orders');
    activeMenu.classList.remove('active');
    this.getCatgoryList();

    this.togstatus = 'inactive';
    this.besttog = '';

    this.apiCall.productFn.subscribe(result => {
      if(result != '0'){
        if(result == 'Category'){
          this.getCatgoryList();
          } else if(result == 'subCategory') {
            this.categoryService(this.mainCategoryId)
          } else if(result == 'subSubCategory'){
            const object = { id: this.subCategoryId }
            this.callSubCategory(object);
          } else if(result == 'products'){
            if(this.isSubcate === 1){
              const object = { id: this.subSubCategoryId, type: 'SUBCATEGORY', isActive: 'none'  }
              this.callProductList(object);
            } else {
              if(this.subCategoryId) {
                const object = { id: this.subCategoryId, type: 'CATEGORY', isActive: 'none'}
                // console.log( object)
                this.callProductList(object);
              }
            }
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
  
  getCatgoryList(){
    var params = {
      url: 'admin/getAllCategory',
      data: {
        ...this.propData
      }
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.category = response.body.data
        } else {
          // this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  categoryClick(item, value){
    this.openCategoryTab(value)
    item.isEdit = true
    this.apiCall.categoryValue(item)
    this.mainCategoryId = item.id
    this.apiCall.setCategoryValue(item.id)
    // this.showCategoryTab = false;
      // this.showSubCategoryTab = false;
    this.categoryService(item.id)
  }

  categoryService(id){
    var params = {
      url: 'admin/getProductCategory',
      data: {
        categoryId: id
      }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.showSubCate = true;
          this.showSubsubCategory = false;
          this.showProducts = false;
          this.subCategory = response.body.data
          // console.log(response.body)
        } else {
          // this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  subCategoryClick(item, value){
    this.openCategoryTab(value)
    item.isEdit = true
    this.apiCall.categoryValue(item)
    this.subCategoryId = item.id
    this.apiCall.setSubCategoryValue(item.id)
    this.isSubcate = item.isSubcate;
    this.isSubcatepass = item.isSubcate;

    if(item.isSubcate == 1){
      this.showProducts = false;
      const object = { id: item.id }
      this.callSubCategory(object);
    } else {
      this.showSubsubCategory = false;
      const object = { id: item.id, type: 'CATEGORY', isActive: this.togstatus, isBest:this.besttog }
      this.callProductList(object) 
    }
  }

  callProductList(object){
    var params = {
      url: 'admin/getProductList',
      data: object
    }
    // console.log("pddsdf",object)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error === 'false') {
          this.showProducts = true;
          this.productList = response.body.data.products
          // console.log("prod",response.body)
        } else {
          // this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  callSubCategory(object){
    var params = {
      url: 'admin/getProductSubCategory',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == 'false') {
          this.showSubsubCategory = true;
          this.showSubsubCategoryList = response.body.productCategory
        } else {
          // this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  showSubsubCategoryClick(item, value){
    this.openCategoryTab(value)
    this.subSubCategoryId = item.id
    item.isEdit = true
    this.apiCall.categoryValue(item)
    this.apiCall.setSubSubCategoryValue(item.id)
    const object = { id: item.id, type: 'SUBCATEGORY', isActive: 'none'  }
    this.callProductList(object)
  }

  clickProduct(item, value){
    // console.log(item)
    this.openCategoryTab(value)
    this.productId = item.id
    item.isEdit = true
    this.apiCall.categoryValue(item)
  }

  openCategoryTab(data){

    const item = {}
    item['isEdit'] = false
    this.imagePreview = null;
    this.apiCall.categoryValue(item)

    if(data == 'category'){
      this.showCategoryTab = true;
      this.showSubCategoryTab = false;
      this.showSubSubCategoryTab = false;
      this.showProductsTab = false;

    } else if(data == 'subCategory') {
      // this.apiCall.subCategoryValue(item)
      this.showCategoryTab = false;
      this.showSubCategoryTab = true;
      this.showSubSubCategoryTab = false;
      this.showProductsTab = false;
      this.imagePreview = null;

    } else if(data == 'subSubCategory'){
      this.showSubSubCategoryTab = true;
      this.showProductsTab = false;
      this.showCategoryTab = false;
      this.showSubCategoryTab = false;
      this.imagePreview = null;

    } else if(data == 'products'){

      this.showProductsTab = true;
      this.showCategoryTab = false;
      this.showSubCategoryTab = false;
      this.showSubSubCategoryTab = false;

    }
  }

  clickBestProduct(data){
    var star 
    if(data.isBestProduct === 1){
      star = 0
    } else {
      star = 1
    }
    const object = { productId: data.id, star: star }
    var params = {
      url: 'admin/adminStarProduct',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == 'false') {
          if(this.isSubcate === 1){
            const object = { id: this.subSubCategoryId, type: 'SUBCATEGORY', isActive: 'none'  }
            this.callProductList(object);
          } else {
            const object = { id: this.subCategoryId, type: 'CATEGORY', isActive: 'none'}
            this.callProductList(object);
          }
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        } else {
          // this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )

  }

  ChnageCategoryStatus(statusVal, value, id){
    const object = {}
    if(statusVal == true){
      object['status'] = 'active'
    } else {
      object['status'] = 'inactive'
    }
      object['type'] = value
      object['id'] = id
      var params = {
        url: 'admin/categoeyStatusChange',
        data: object
      }
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          // console.log(response.body)
          if (response.body.error == false) {
            this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          } else {
            this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
          }
        },
        (error) => {
          console.log('Error', error)
          this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        }
      )
  }

  searchPoductSuggestion(searchValue, type){
    const dataObject = {}
    dataObject['type'] = type
    dataObject['text'] = searchValue
    dataObject['mainCategoryId'] = this.mainCategoryId
    dataObject['subCategoryId'] = this.subCategoryId
    dataObject['isSubCate'] = this.isSubcate
    // console.log(dataObject)

    var params = {
      url: 'admin/searchProductName',
      data: dataObject
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        console.log(response.body)
        if (response.body.error == 'false') {
            this.productList = response.body.data.products
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        // this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  searchSuggestion(searchValue, type ) {
    const dataObject = {}
    if(type === 'Category') {
      dataObject['type'] = type
      dataObject['text'] = searchValue
    } else if (type === 'ProductCategory') {
      dataObject['type'] = type
      dataObject['text'] = searchValue
      dataObject['mainCategoryId'] = this.mainCategoryId
    } else if(type === 'SubSubCategory'){
      dataObject['type'] = type
      dataObject['text'] = searchValue
      dataObject['mainCategoryId'] = this.mainCategoryId
      dataObject['subCategoryId'] = this.subCategoryId
    } else {
      dataObject['type'] = type
      dataObject['text'] = searchValue
      dataObject['mainCategoryId'] = this.mainCategoryId
      dataObject['subCategoryId'] = this.subCategoryId
      dataObject['isSubCate'] = this.isSubcate
    }

    var params = {
      url: 'admin/searchCategory',
      data: dataObject
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == 'false') {
          if(response.body.data.type == 'Category'){
            this.category = response.body.data.data
          } else if(response.body.data.type == 'ProductCategory') {
            this.subCategory = response.body.data.data
          } else if(response.body.data.type == 'SubSubCategory'){
            this.showSubsubCategoryList = response.body.data.data
          } else if(response.body.data.type == 'Products'){
            this.productList = response.body.data.data
          }
        } else {
          // this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
    // console.log(this.mainCategoryId, 'mainCategoryId')
    // console.log(this.subCategoryId, 'subCategoryId')
    // console.log(this.subSubCategoryId, 'subSubCategoryId')
    // console.log(this.isSubcate, 'isSubcate')
  }

  deleteCategory(item, value){
    
    var object = { id: item.id, type: value }
    var params = {
      url: 'admin/deleteCategory',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == 'false') {
          if(value == 'Category') {
            this.apiCall.setProductValue('Category')
          } else if(value == 'ProductCategory') {
            this.apiCall.setProductValue('subCategory')
          } else if(value == 'SubSubCategory') {
            this.apiCall.setProductValue('subSubCategory');
          } if(value == 'Products') {
            if(this.isSubcate === 1){
              const object = { id: this.subCategoryId }
              this.callSubCategory(object);
            } else {
              const object = { id: this.subCategoryId, type: 'CATEGORY', isActive: 'none'}
              this.callProductList(object);
            }
            // this.apiCall.setProductValue('Products');
          }
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  onchangeActiveCategory(status){

    if(status){
      var active = 'active'
    } else {
      var active = 'inactive'
    }

    this.togstatus = active;
    const object = { status: this.togstatus, categoryId:  this.mainCategoryId, productCatgory: this.subCategoryId, subsubCategory: this.subSubCategoryId, isSubCate: this.isSubcatepass,isBest:this.besttog  }
    var params = {
      url: 'admin/showActiveCategory',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == 'false') {
          // console.log(response.body.data)

          this.category = response.body.data.category
          this.subCategory = response.body.data.subcategory
          // console.log("cat",this.category)
          // console.log("subcat",this.subCategory)

          if(this.isSubcatepass == '1'){
            this.showSubsubCategoryList = response.body.data.subsubCate
            if(this.subSubCategoryId){
              const object = { id: this.subSubCategoryId, type: 'SUBCATEGORY', isActive: this.togstatus,isBest:this.besttog  }
              this.callProductList(object);
            }
            
          } else {
            if(this.subCategoryId){
              const object = { id: this.subCategoryId, type: 'CATEGORY', isActive: this.togstatus,isBest:this.besttog }
              this.callProductList(object);
            }
            
          }
          
          // if(this.isSubcatepass == '1'){

          //   this.showSubsubCategoryList = response.body.data.subsubCate
          // } else {
            
          // }
          // this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  onchangeBestProducts(status){
    console.log(status)

    if(status){
      var isBest = 'YES'
    } else {
      var isBest = ''
    }
    this.besttog = isBest
    if(this.isSubcatepass == '1'){
      if(this.subSubCategoryId){
        const object = { id: this.subSubCategoryId, type: 'SUBCATEGORY', isActive: this.togstatus, isBest:  this.besttog  }
        this.callProductList(object);
      }
      
    } else {
      if(this.subCategoryId){
        const object = { id: this.subCategoryId, type: 'CATEGORY', isActive: this.togstatus, isBest:  this.besttog }
        this.callProductList(object);
      }
      
    }
  }

  

}
