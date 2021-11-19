import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ChartOptions,  ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import {ChartType} from './data';
declare var $:any;

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.css'],
  providers: [DatePipe]
})
export class AddStoreComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;
  storeForm: FormGroup;
  storeManager: FormGroup;
  addVendor : FormGroup;
  storeStockUpdateFrom: FormGroup;
  bsValue: Date = new Date();

  submitted = false;
  vendorFormSubmit = false;
  storeSubmit = false;
  stockSubmit = false;
  billObject = {}

  storeManagerList: any;
  storeStock : any;

  storeId: number;
  storeID: string;
  imagePreview: string;
  storeOrder: any;
  storeproducts: any;

  storeDue: any;
  managerId: number;
  vendorList: any;
  sroreProductId: number;
  storeViewStock: any;
  storeDueDate: number;
  totalStoreOrder: number;
  overAllRevenue: number;
  fileUpload: any;
  storeImage: string;
  fileBillUpload: any;
  category: any;
  cancellation: any;
  fromDate = ''
  toDate = ''
  categoryId = ''

  graphFrom = ''
  graphTo = ''

  isEdit = false;

  paginat : any;
  pages: any;
  page : Number =1;
  pagno : Number =1;
  limitValue = 0;
  status = 'ALL';
  searchProduct;
  storeOrderGraph: ChartType;
  revenueGraph: ChartType;
  netRevenueGraph: ChartType;
  growthChart: ChartType;
  stoOrderXaxis = [];
  stoOrderData = [];
  stoRevenXaxis = [];
  stoRevenData = [];
  stoNetRevenXaxis = [];
  stoNetRevenData = [];
  lastMonthStroeGrowData = [];
  showAccept = 'true';
  showExport = 'true';
  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.storeId = params.id);
    this.storeForm   = this.formBuilder.group({
      storeName: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      managerFname: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      managerLname: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      email: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      mobileNumber: ['',  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.minLength(6), Validators.maxLength(15)]],
      storeAddress: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      storeImage: [''],
      latitude: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      longitude: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      dueDay: ['',  [Validators.required, Validators.pattern(/\b(0?[1-9]|[12][0-9]|3[01])\b/)]],
      storeRadius: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      storePercentage: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]]
      // storeImage: ['http://15.184.21.76/admin/assets/img/product1.png',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]]
    });

    this.storeManager   = this.formBuilder.group({
      firstName: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      lastName: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      storeId: [this.storeId,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      post: ['Store Manager',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      mobileNumber: ['',  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.minLength(6), Validators.maxLength(15)]]
    });

    this.storeStockUpdateFrom   = this.formBuilder.group({
      vendorId: ['ADD',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      productId: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      storeId: [this.storeId,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      stockType: ['',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      units: ['',  [ Validators.required, Validators.pattern(/^[0-9]*$/)]],
      StockReason: [''],
      expiryDate: [this.bsValue],
      currentStock : ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
     });

    this.addVendor   = this.formBuilder.group({
      vendorName: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });

    this.getStoreDetails({storeId:this.storeId, fromDate: this.graphFrom, toDate: this.graphTo, year: 2021})


    // this.getStoreDetails(this.storeId)
    this.storeStockList({storeId: this.storeId,pageNumber: 1})
    this.storeOrdersList({storeId:this.storeId, fromDate: this.fromDate, toDate: this.toDate,pageNumber: 1, limit: this.limitValue})
    this.storeProductList({storeId: this.storeId, categoryId: this.categoryId,pageNumber: 1, status: this.status,limit: this.limitValue })
    this.getVendorList(this.storeId)
    this.getCatgoryList();
    
    this.storeOrderGenGraph();
    this.storeRevenGraph();
    this.storeNetRevenGraph();
    this.storeGrowthGraph();
    this.lastClick('');
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 'superadmin'){
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))

      this.showAccept = orderpermission[2].writeOpt
      this.showExport = orderpermission[2].exportOpt

    }
  }

  lastClick(val){
    var object = {filter: val,storeId: this.storeId}

    var params = {
      url: 'admin/lastMonthBarChart',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe((result: any) => {
      if (result.body.error == "false") {
        this.lastMonthStroeGrowData = result.body.data.lastMonthBarChart;
      }


    this.growthChart = {
      chart: {
          height: 350,
          type: 'bar',
          toolbar: {
              show: false
          }
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  position: 'top',  // top, center, bottom
              },
          }
      },
      stroke: {
          show: true,
          width: 4,
          colors: ['transparent']
      },
      dataLabels: {
          enabled: true,
          formatter: (val) => {
              return val;
          },
          offsetY: -20,
          style: {
              fontSize: '12px',
              colors: ['#304758']
          }
      },
      colors: ['#62CA55'],
      series: [{
          name: 'Last',
          data: this.lastMonthStroeGrowData
      }
    ],
      
      xaxis: {
          categories: ['Orders', 'Customers', 'Revenue', 'Net Revenue'],
          position: 'bottom',
          axisBorder: {
              show: false
          },
          axisTicks: {
              show: false
          },
          crosshairs: {
              fill: {
                  type: 'gradient',
                  gradient: {
                      colorFrom: '#D8E3F0',
                      colorTo: '#BED1E6',
                      stops: [0, 100],
                      opacityFrom: 0.4,
                      opacityTo: 0.5,
                  }
              }
          },
          tooltip: {
              enabled: false,
              offsetY: -35,
          }
      },
      fill: {
          gradient: {
              shade: 'light',
              type: 'horizontal',
              shadeIntensity: 0.25,
              gradientToColors: undefined,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [50, 0, 100, 100]
          },
      },
      yaxis: {
          axisBorder: {
              show: false
          },
          axisTicks: {
              show: false,
          },
          labels: {
              show: true,
              formatter: (val) => {
                  return val;
              }
          }
      },
      title: {
          // text: 'Monthly Inflation in Argentina, 2002',
          // floating: true,
          offsetY: 320,
          align: 'center',
          style: {
              color: '#444'
          }
      },
      legend: {
          offsetY: 7
      }
    };
    });
  }

  storeOrderGenGraph(){
    var params = {
      url: 'admin/storeOrderGraph',
      data: { "storeId": this.storeId }
    }

    this.storeOrderGraph = {
      chart: {
          height: 380,
          type: 'line',
          zoom: {
              enabled: false
          },
          toolbar: {
              show: false,
          }
      },
      colors: ['#F14948'],
      dataLabels: {
          enabled: false
      },
      stroke: {
          width: [3],
          curve: 'straight',
          dashArray: [0]
      },
      series: [{
          name:'Orders',
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      }
      ],
      markers: {
          size: 0,
  
          hover: {
              sizeOffset: 6
          }
      },
      xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct',
              'Nov', 'Dec',
          ],
      },
      tooltip: {
          y: [{
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }, {
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }, {
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }]
      },
      grid: {
          borderColor: '#f1f1f1',
      }
  };

  this.apiCall.commonPostService(params).subscribe((result: any) => {
    if (result.body.error == "false") {

      this.stoOrderXaxis = result.body.data.x_arr;
      this.stoOrderData = result.body.data.store_order;
      this.storeOrderGraph = {
      chart: {
          height: 380,
          type: 'line',
          zoom: {
              enabled: false
          },
          toolbar: {
              show: false,
          }
      },
      colors: ['#F14948'],
      dataLabels: {
          enabled: false
      },
      stroke: {
          width: [3],
          curve: 'straight',
          dashArray: [0]
      },
      series: [{
          name:'Orders',
          data: this.stoOrderData
      }
      ],
      markers: {
          size: 0,
  
          hover: {
              sizeOffset: 6
          }
      },
      xaxis: {
          categories: this.stoOrderXaxis,
      },
      tooltip: {
          y: [{
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }, {
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }, {
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }]
      },
      grid: {
          borderColor: '#f1f1f1',
      }
  };
    }
  });
  }

  storeRevenGraph(){
    var params = {
      url: 'admin/storeRevenueGraph',
      data: { "storeId": this.storeId }
    }

    this.revenueGraph = {
  chart: {
      height: 380,
      type: 'line',
      zoom: {
          enabled: false
      },
      toolbar: {
          show: false,
      }
  },
  colors: ['#F14948'],
  dataLabels: {
      enabled: false
  },
  stroke: {
      width: [3],
      curve: 'straight',
      dashArray: [0]
  },
  series: [{
      name:'Revenue',
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
  }
  ],
  markers: {
      size: 0,

      hover: {
          sizeOffset: 6
      }
  },
  xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct',
          'Nov', 'Dec',
      ],
  },
  tooltip: {
      y: [{
          title: {
              formatter: (val) => {
                  return val;
              }
          }
      }, {
          title: {
              formatter: (val) => {
                  return val;
              }
          }
      }, {
          title: {
              formatter: (val) => {
                  return val;
              }
          }
      }]
  },
  grid: {
      borderColor: '#f1f1f1',
  }
};
this.apiCall.commonPostService(params).subscribe((result: any) => {
  if (result.body.error == "false") {

    this.stoRevenXaxis = result.body.data.x_arr;
    this.stoRevenData = result.body.data.store_revenue;
    this.revenueGraph = {
  chart: {
      height: 380,
      type: 'line',
      zoom: {
          enabled: false
      },
      toolbar: {
          show: false,
      }
  },
  colors: ['#F14948'],
  dataLabels: {
      enabled: false
  },
  stroke: {
      width: [3],
      curve: 'straight',
      dashArray: [0]
  },
  series: [{
      name:'Revenue',
      data: this.stoRevenData
  }
  ],
  markers: {
      size: 0,

      hover: {
          sizeOffset: 6
      }
  },
  xaxis: {
      categories: this.stoRevenXaxis,
  },
  tooltip: {
      y: [{
          title: {
              formatter: (val) => {
                  return val;
              }
          }
      }, {
          title: {
              formatter: (val) => {
                  return val;
              }
          }
      }, {
          title: {
              formatter: (val) => {
                  return val;
              }
          }
      }]
  },
  grid: {
      borderColor: '#f1f1f1',
  }
};
  }
});
  }

  storeNetRevenGraph(){
    var params = {
      url: 'admin/storeNetRevenueGraph',
      data: { "storeId": this.storeId }
    }

    this.netRevenueGraph = {
      chart: {
          height: 380,
          type: 'line',
          zoom: {
              enabled: false
          },
          toolbar: {
              show: false,
          }
      },
      colors: ['#F14948'],
      dataLabels: {
          enabled: false
      },
      stroke: {
          width: [3],
          curve: 'straight',
          dashArray: [0]
      },
      series: [{
          name:'Net Revenue',
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      }
      ],
      markers: {
          size: 0,
  
          hover: {
              sizeOffset: 6
          }
      },
      xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct',
              'Nov', 'Dec',
          ],
      },
      tooltip: {
          y: [{
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }, {
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }, {
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }]
      },
      grid: {
          borderColor: '#f1f1f1',
      }
  };

  this.apiCall.commonPostService(params).subscribe((result: any) => {
    if (result.body.error == "false") {

      this.stoNetRevenXaxis = result.body.data.x_arr;
      this.stoNetRevenData = result.body.data.store_Netrevenue;
    }
    this.netRevenueGraph = {
      chart: {
          height: 380,
          type: 'line',
          zoom: {
              enabled: false
          },
          toolbar: {
              show: false,
          }
      },
      colors: ['#F14948'],
      dataLabels: {
          enabled: false
      },
      stroke: {
          width: [3],
          curve: 'straight',
          dashArray: [0]
      },
      series: [{
          name:'Net Revenue',
          data: this.stoNetRevenData
      }
      ],
      markers: {
          size: 0,
  
          hover: {
              sizeOffset: 6
          }
      },
      xaxis: {
          categories: this.stoNetRevenXaxis,
      },
      tooltip: {
          y: [{
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }, {
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }, {
              title: {
                  formatter: (val) => {
                      return val;
                  }
              }
          }]
      },
      grid: {
          borderColor: '#f1f1f1',
      }
  };
  });
  }

  storeGrowthGraph(){

    this.growthChart = {
  chart: {
      height: 350,
      type: 'bar',
      toolbar: {
          show: false
      }
  },
  plotOptions: {
      bar: {
          dataLabels: {
              position: 'top',  // top, center, bottom
          },
      }
  },
  stroke: {
      show: true,
      width: 4,
      colors: ['transparent']
  },
  dataLabels: {
      enabled: true,
      formatter: (val) => {
          return val;
      },
      offsetY: -20,
      style: {
          fontSize: '12px',
          colors: ['#304758']
      }
  },
  colors: ['#62CA55'],
  series: [{
      name: 'Last',
      data: [2.5, 3.2, -5.0, 10.1]
  }
],
  
  xaxis: {
      categories: ['Orders', 'Customers', 'Revenue', 'Net Revenue'],
      position: 'bottom',
      axisBorder: {
          show: false
      },
      axisTicks: {
          show: false
      },
      crosshairs: {
          fill: {
              type: 'gradient',
              gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
              }
          }
      },
      tooltip: {
          enabled: false,
          offsetY: -35,
      }
  },
  fill: {
      gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
      },
  },
  yaxis: {
      axisBorder: {
          show: false
      },
      axisTicks: {
          show: false,
      },
      labels: {
          show: true,
          formatter: (val) => {
              return val;
          }
      }
  },
  title: {
      // text: 'Monthly Inflation in Argentina, 2002',
      // floating: true,
      offsetY: 320,
      align: 'center',
      style: {
          color: '#444'
      }
  },
  legend: {
      offsetY: 7
  }
};
  }

  graphvalueFrom(event: any){
    this.graphFrom= this.datePipe.transform(event, 'yyyy-MM-dd');

    this.getStoreDetails({storeId:this.storeId, fromDate: this.graphFrom, toDate: this.graphTo, year: 2021})
  }

  graphvalueTo(event: any){
    this.graphTo = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.getStoreDetails({storeId:this.storeId, fromDate: this.graphFrom, toDate: this.graphTo, year: 2021})
  }

  valuefrom(event: any) {
    this.fromDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.storeOrdersList({storeId:this.storeId, fromDate: this.fromDate, toDate: this.toDate,pageNumber: this.page, limit: this.limitValue})
  }

  valueTo(event: any) {
    this.toDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.storeOrdersList({storeId:this.storeId, fromDate: this.fromDate, toDate: this.toDate,pageNumber: this.page, limit: this.limitValue})
  }

  onChangeCategory(id){
    this.categoryId = id
    this.storeProductList({storeId: this.storeId, categoryId: this.categoryId,pageNumber: this.page, status: this.status,limit: this.limitValue })
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
        this.apiCall.showToast('Server Errors !!', 'Oops', 'errorToastr')
      }
    )
  }

  

  getVendorList(id){
    var params = {
      url: 'admin/storeVendorList',
      data: { storeId: id }
    }
    // console.log("-------",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // console.log(response.body.data.vendor)
          this.vendorList = response.body.data.vendor
          // console.log(this.storeStock)
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

  addManager(){
    this.submitted = false
    this.storeManager.reset();
    this.storeManager.get('storeId').setValue(this.storeId);
    this.storeManager.get('post').setValue('Store Manager');
    this.isEdit = false;
  }

  editManager(item){
    this.submitted = false
    this.isEdit = true;
    this.managerId = item.id
    this.storeManager   = this.formBuilder.group({
      firstName: [item.firstName,  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      lastName: [item.lastName,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      storeId: [this.storeId,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      post: ['Store Manager',  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      mobileNumber: [item.mobileNumber,  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.minLength(6), Validators.maxLength(15)]]
    });
  }

  DeleteManager(data){
    const object = { id: data.id }

    var params = {
      url: 'admin/deleteStoreManager',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
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

  nextPage(page){
    const object = {storeId:this.storeId, pageNumber: page, limit: this.limitValue,fromDate: this.fromDate, toDate: this.toDate}
    this.storeOrdersList(object)
  }
  stoProductPage(pagno){
    const object = {storeId:this.storeId,categoryId: this.categoryId, pageNumber: pagno,status: this.status, limit: this.limitValue}
    this.storeProductList(object)
  }

  onChangeLimit(value){
    this.limitValue = value
    this.pages = 0
    this.page = 0
    const object = {storeId:this.storeId, pageNumber: this.page, limit: this.limitValue,fromDate: this.fromDate, toDate: this.toDate}

    this.storeOrdersList(object)  
  }

  onChangeProdlimt(value){
    this.limitValue = value 
    const object = {storeId: this.storeId, categoryId: this.categoryId,pageNumber: 1, status: this.status,limit: this.limitValue }
    this.storeProductList(object)
  }
  

  storeOrdersList(object){
    var params = {
      url: 'admin/storeOrderList',
      data: object
    }
// console.log("->>>>>>>>>",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.pages = response.body.data.pages * 10;
          this.storeOrder = response.body.data.store
          // console.log("stt",this.storeOrder)
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

  onProdStatusFilter(status){
    this.status = status;
    const object = {storeId: this.storeId, categoryId: this.categoryId,pageNumber: 1, status: this.status,limit: this.limitValue }
    this.storeProductList(object)
  }
  searchStoreProduct(value : any ){
    const object = {storeId: this.storeId, categoryId: this.categoryId,pageNumber: this.page, status: this.status,limit: this.limitValue,text:value }
    this.storeProductList(object)
  }
  storeProductList(object){
    // console.log(object)
    var params = {
      url: 'admin/viewStoreProducts',
      data: object
    }
    // console.log("-----",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.paginat = response.body.data.page * 10;
          this.storeproducts = response.body.data.store
          // console.log("?????",this.pages)
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

  storeStockList(object){
    var params = {
      url: 'admin/viewStoreStock',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.storeStock = response.body.data.store
          // console.log("df",this.storeStock)
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

  uploadImageFile(event){
    
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]); 
    this.fileUpload = event.target.files[0]
  
}

uploadBillFile(event, item){
  this.billObject = {}
  var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]); 
    this.fileBillUpload = event.target.files[0]
    this.billObject = item


}

async upload_btn_file(){
  console.log("bill",this.billObject)
  console.log("fie",this.fileBillUpload)

  if(this.fileBillUpload){
    const formData = new FormData();
    formData.append('uploaded_file', this.fileBillUpload); 
    const image = await this.apiCall.imageuploadFunctions(formData);
    this.billObject['document'] = image['uploadUrl']
    // console.log("bbbb",this.billObject)

    const uploadObject = { id: this.billObject['id'],  document: this.billObject['document']}

    console.log(">>>>",uploadObject)

    var params = {
      url: 'admin/uploadStoreBillingCyle',
      data: uploadObject
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          // $('#add_mem').modal('hide');
          this.ngOnInit();
          // this.router.navigateByUrl('/dashboard');
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

  } else {
    this.apiCall.showToast('Please choose the file', 'Error', 'errorToastr')
    return false;
  }
}

  getStoreDetails(object){
    var params = {
      url: 'admin/viewStoreDetails',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == 'false') {
 
          this.storeDue = response.body.data.dueResult
          this.storeDue.map(data=> data.commissionAmt = parseInt(data.commissionAmt).toPrecision(4))
          console.log(this.storeDue)

          this.totalStoreOrder = response.body.data.totalOrders
          this.overAllRevenue = response.body.data.overAllRevenue.amount
          this.cancellation = response.body.data.cancellation

          this.storeManagerList = response.body.data.storeManager
          // console.log("manager",this.storeManagerList)
          this.storeID = response.body.data.storeDetails[0].storeID
          this.storeDueDate = response.body.data.storeDetails[0].dueDay

          this.imagePreview = response.body.data.storeDetails[0].storeImage

          this.storeImage = response.body.data.storeDetails[0].storeImage

          this.storeForm   = this.formBuilder.group({
            storeName: [response.body.data.storeDetails[0].storeName,  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
            managerFname: [response.body.data.storeDetails[0].managerFname,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
            managerLname: [response.body.data.storeDetails[0].managerLname,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
            email: [response.body.data.storeDetails[0].email,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
            mobileNumber: [response.body.data.storeDetails[0].mobileNumber,  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.minLength(6), Validators.maxLength(15)]],
            storeAddress: [response.body.data.storeDetails[0].storeAddress,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
            storeImage: [''],
            latitude: [response.body.data.storeDetails[0].latitude,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
            longitude: [response.body.data.storeDetails[0].longitude,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
            dueDay: [response.body.data.storeDetails[0].dueDay,  [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
            storeRadius: [response.body.data.storeDetails[0].storeRadius,  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
            storePercentage: [response.body.data.storeDetails[0].storePercentage,  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]]

            // storeImage: ['http://15.184.21.76/admin/assets/img/product1.png',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]]
          });
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

  async onSubmitStore(){
    this.storeSubmit = true;
    // console.log(this.storeForm.value)
    if(!this.storeForm.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    const storeData = this.storeForm.value
    storeData['storeImage'] = this.storeImage
    storeData['id'] = this.storeId

      const formData = new FormData();
      formData.append('uploaded_file', this.fileUpload); 
      const image = await this.apiCall.imageuploadFunctions(formData);
      storeData['storeImage'] = image['uploadUrl']

    var params = {
      url: 'admin/editNewStore',
      data: storeData
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          // $('#add_mem').modal('hide');
          this.ngOnInit();
          // this.router.navigateByUrl('/dashboard');
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

  onSubmit(){
    this.submitted = true;
    // console.log(this.storeManager.value)
    // console.log(this.storeManager.valid)
    if (!this.storeManager.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
     }

     if(this.isEdit === false){
      var params = {
        url: 'admin/addStoreManager',
        data: this.storeManager.value
      }
     } else {
       const updateData = this.storeManager.value
       updateData['id'] = this.managerId
      var params = {
        url: 'admin/editStoreManager',
        data: updateData
      }
     }
     
     this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_mem').modal('hide');
          this.ngOnInit();
          // this.router.navigateByUrl('/dashboard');
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

  vendorSubmit(){
    this.vendorFormSubmit = true;
    if (!this.addVendor.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
     }

     const vendorData = this.addVendor.value
     vendorData['storeId'] = this.storeId

     var params = {
      url: 'admin/adminAddVendor',
      data: vendorData
    }

     this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_vend_btn').modal('hide');
          this.addVendor.reset();
          this.ngOnInit();
          // this.router.navigateByUrl('/dashboard');
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

  getProductStockValue(data){
    // console.log(data.productId)
    this.sroreProductId = data.productId
    this.storeStockUpdateFrom.reset();
    this.storeStockUpdateFrom.get('productId').setValue(data.productId);
    this.storeStockUpdateFrom.get('currentStock').setValue(data.storeStock);
    this.storeStockUpdateFrom.get('storeId').setValue(this.storeId);

    this.getVendorViewStock(this.storeId, this.sroreProductId)
    // this.storeStockUpdateFrom   = this.formBuilder.group({
    //   vendorId: ['ADD',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   productId: [data.productId,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   storeId: [this.storeId,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   stockType: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   units: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   StockReason: [''],
    //   expiryDate: [''],
    //   currentStock : [data.storeStock,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //  });
  }

  getVendorViewStock(id, productId){
    var params = {
      url: 'admin/adminViewStockHistory',
      data: { storeId: id, productId: productId }
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // console.log(response.body.data.vendor)
          this.storeViewStock = response.body.data.product
          // console.log(this.storeViewStock)
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

  stockSubmitChange(){
    console.log("tet",this.storeStockUpdateFrom.value)
    this.submitted = true;
    this.stockSubmit = true;
    if (!this.storeStockUpdateFrom.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
     }

     const stockData = this.storeStockUpdateFrom.value

    //  console.log("data",stockData.currentStock)
    //  console.log("unit",stockData.units)
    //  console.log("type",stockData.stockType)

     if(stockData.stockType == "SUBTRACT"){
       if(stockData.currentStock < stockData.units){
        //  console.log("ganesj")
        this.apiCall.showToast('Please change unit less than current stock', 'Error', 'errorToastr')
        return false;
       }
     }
     stockData['expiryDate'] = this.datePipe.transform(this.storeStockUpdateFrom.value.expiryDate, 'yyyy-MM-dd');
     var params = {
      url: 'admin/adminUpdateStoreStock',
      data: this.storeStockUpdateFrom.value
    }
// console.log("stock",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.submitted = false;
          $('#view_det').modal('hide');
          this.ngOnInit();
          this.storeStockUpdateFrom.reset();
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

  ngOnDestroy() {
    $('#add_mem').modal('hide');
  }

}
