import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { NgxSpinnerService } from 'ngx-spinner';
declare var $:any;


@Component({
  selector: 'app-product-stats',
  templateUrl: './product-stats.component.html',
  styleUrls: ['./product-stats.component.css'],
  providers: [DatePipe]
})
export class ProductStatsComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;

  productsList:any;
  category: any;
  subCategory: any;

  productList: any;

  subSubCategory: any;
  isSubsubcategory = false;

  categoryId = '';
  subCategoryId = '';
  subSubCategoryId = '';
  productId = '';
  fromDate = '';
  toDate = '';
  pages: number;
  page =1;

  statusobject = {}
  bsValue: Date = new Date();
  productcsvOption : any;
showExport = 'true';
searchProduct;

  
  constructor(
    private apiCall: ApiCallService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    const activeMenu = document.getElementById('orders');
    activeMenu.classList.remove('active');

    this.getCatgoryList();

    const object = { pageNumber: 1}
    this.getProductList(object)
    // this.onChangeCategory("", "Category", true)
    // this.callProductFilter(this.statusobject)

    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))
      this.showExport = orderpermission[2].exportOpt

    }
  }

  nextPage(page){
    const object = { pageNumber: page,category: this.categoryId,productCategory:this.subCategoryId,subSubCategory:this.subSubCategoryId,fromDate: this.fromDate, toDate: this.toDate}
    this.getProductList(object)
  }

  valuefrom(event: any) {
    this.fromDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.getProductList({pageNumber: this.page, fromDate: this.fromDate, toDate: this.toDate,category: this.categoryId,productCategory:this.subCategoryId,subSubCategory:this.subSubCategoryId})
    // this.callProductFilter({pageNumber: this.page,fromDate: this.fromDate, toDate: this.toDate})
  }

  valueTo(event: any) {
    this.toDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.getProductList({pageNumber: this.page, fromDate: this.fromDate, toDate: this.toDate,category: this.categoryId,productCategory:this.subCategoryId,subSubCategory:this.subSubCategoryId})
    // this.callProductFilter({pageNumber: this.page,fromDate: this.fromDate, toDate: this.toDate})
  }


  pageReload(){
    location.reload()
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
            this.ngOnInit();
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

    getCatgoryList(){
    var params = {
      url: 'admin/getAllCategory',
      data: {
      }
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.category = response.body.data
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  onChangeCategory(id, value, status){
    if(!status){
      if(value === 'Category'){
        this.categoryId = id
        this.productCategoryList(id)
        this.statusobject['category'] = this.categoryId;
        this.statusobject['productCategory'] = ""
        this.statusobject['subSubCategory'] = ""
        this.statusobject['productId'] = ""
        this.statusobject['pageNumber'] = this.page
        this.statusobject['fromDate'] = this.fromDate
        this.statusobject['toDate'] = this.toDate
      } else {
        this.subSubCategoryId = id
        const object = { type: 'SUBCATEGORY', id: id, isActive: 'active' }
        this.getCategoryProductList(object)
        this.statusobject['subSubCategory'] = this.subSubCategoryId
        this.statusobject['productId'] = ""
        this.statusobject['pageNumber'] = this.page
        this.statusobject['fromDate'] = this.fromDate
        this.statusobject['toDate'] = this.toDate
      }
    }
    
   
    if(id != "Empty"){
      this.getProductList(this.statusobject)
    }else{
      console.log("ddd")
    // this.getProductList({pageNumber: this.page, fromDate: this.fromDate, toDate: this.toDate})
    }
     
      console.log("stat",this.statusobject)

  }

  onChangeSubCategory(value){
    // console.log(value)
    this.subCategoryId = value

    // this.statusobject['category'] = this.categoryId;
    this.statusobject['productCategory'] = this.subCategoryId;
    this.statusobject['subSubCategory'] = ""
    this.statusobject['productId'] = ""
    this.statusobject['pageNumber'] = this.page
    this.statusobject['fromDate'] = this.fromDate
    this.statusobject['toDate'] = this.toDate
    this.getProductList(this.statusobject)

    // this.getProductList(this.statusobject)
    console.log("subcat",this.statusobject)
    var params = {
      url: 'admin/findSubCategory',
      data: {
        id: value
      }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // console.log(response.body)
          if(response.body.isSubcate == 1) {
            this.isSubsubcategory = true;
            this.subSubCategory = response.body.data
            this.productList = []
          } else {
            this.isSubsubcategory = false;
            this.subSubCategory = []
            this.productList = response.body.data
          }
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


  getCategoryProductList(object){
    var params = {
      url: 'admin/getProductList',
      data: object
    }
    // console.log(params)
    this.apiCall.commonPostService(params).subscribe(

      (response: any) => {
        if (response.body.error == 'false') {
          // console.log(response.body)
          this.productList = response.body.data.products
          // this.subCategory = response.body.data
          // console.log("prdd",this.pdproductList)
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
  

  productCategoryList(id){
    var params = {
      url: 'admin/getProductCategory',
      data: {
        categoryId: id
      }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == false) {
          this.subCategory = response.body.data
          // console.log(this.subCategory)
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

  searchStoreProduct(value : any ){
    const object = { pageNumber: this.page,text:value,category: this.categoryId,productCategory:this.subCategoryId,subSubCategory:this.subSubCategoryId,fromDate: this.fromDate, toDate: this.toDate}
    this.getProductList(object)
  }


  getProductList(object){
    var params = {
      url: 'admin/adminProducts',
      data: object
    }
    // console.log("<<<<<",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.pages = response.body.pages * 10;

          this.productsList = response.body.products
          // console.log(response.body)
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

  onChangeProducts(id){
    this.productId = id
    // this.statusobject['category'] = this.categoryId;
    // this.statusobject['productCategory'] = this.subCategoryId;
    // this.statusobject['subSubCategory'] = this.subSubCategoryId
    this.statusobject['productId'] = this.productId
    this.statusobject['pageNumber'] = this.page
    this.statusobject['fromDate'] = this.fromDate
    this.statusobject['toDate'] = this.toDate
    this.getProductList(this.statusobject)
    console.log("kok",this.statusobject)
  }

  // callProductFilter(object){
  //   console.log("apicall",object)
  //     var params = {
  //       url: 'admin/adminProductFilter',
  //       data: object
  //     }
  //     // console.log(params)
  //     this.apiCall.commonPostService(params).subscribe(
  //       (response: any) => {
  //         // console.log(response.body)
  //         if (response.body.error == 'false') {
  //           this.productsList = response.body.products
  //           // console.log(this.productList)
  //         } else {
  //           this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
  //         }
  //       },
  //       (error) => {
  //         console.log('Error', error)
  //         this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
  //       }
  //     )
    
  // }

  exportList(event : any){
    var  object = {pageNumber: this.page, fromDate: this.fromDate, toDate: this.toDate,category:this.categoryId,productCategory: this.subCategoryId,productId:this.productId,subSubCategory:this.subSubCategoryId}
    var params = {
      url: 'admin/adminProducts',
      data: object
    }
    // console.log("exp",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.productsList = response.body.products
          // console.log(response.body)
          if(response.body.products.length > 0){
            this.exportProductsData(response.body.products)
          }

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

  exportProductsData(data){
    if(data.length > 0){
      var bulkArray = []
      data.forEach(element => {
        var obj = {}
        obj['categoryName'] = element.categoryName
        obj['productCategoryName'] = element.productCategoryName
        obj['productSubCategoryName'] = element.productSubCategoryName
        obj['productName'] = element.productName
        obj['storeName'] = element.storeName
        obj['storeStock'] = element.storeStock
        obj['sellCount'] = element.sellCount
        obj['qty'] = element.qty
        obj['maxQty'] = element.maxQty
        obj['productPrice'] = element.productPrice
        obj['productDiscount'] = element.productDiscount
        bulkArray.push(obj)
      })
      this.productcsvOption = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Product Report',
        useBom: true,
        noDownload: false,
        headers: ["Category",  "Sub Category", "Sub Sub-Category", "Product Name", "Assigned Store Name","Stock Count","Sell Count", "Quantity", "Maximum Quantity", "Product Price", "Product Discount"]
      };
      new  AngularCsv(bulkArray, "Product Report", this.productcsvOption);
    }
  }


}
