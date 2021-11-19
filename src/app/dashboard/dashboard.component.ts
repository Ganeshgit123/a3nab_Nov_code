import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { } from '@agm/core/services/google-maps-types';
import { MapsAPILoader } from '@agm/core';
import {ChartType} from './data';

declare var $: any;
declare var google: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [NgbRatingConfig, DatePipe],
})

export class DashboardComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;

  datePickerConfig: Partial<BsDatepickerConfig>;
  bsValue: Date = new Date();
  customer: any = [];
  driver: any = [];
  store: any = [];
  product: any = [];
  maps: any = [];
  heatcoords: any = [];
  pr_name: any = [];
  pr_qty: any = [];
  data_lat_lan: any = [];
  statCount: any;
  storesList: any[];
  driversList: any[];
  dashOrdersList: any[];
  feedback: any[];
  appFeedback: any[];
  notification: any[];
  pages: any;
  page: Number = 1;
  selected = 0;
  hovered = 0;
  doughnutChart: any[];
  genderChart: any[];
  orderChart: any[];
  ageChart: any[];
  cclabel: any = [];
  genderlabel: any = [];
  agelabel: any = [];
  agelabe2: any = [];
  ordlabel: any = [];
  ordlabel1: any = [];
  revlabel: any = [];
  revdata: any = [];
  delivered: any;
  assigned: any;
  cancelled: any;
  pending: any;
  totalOrders: any;
  totalProducts: any;
  totalOffers: any;
  orderId: number;
  graphFrom = ''
  graphTo = ''

  heatFrom = ''
  heatTo = ''

  graphlinefromDate = '';
  graphlinetoDate = '';

  graphCustomFrom = '';
  graphCustomTo = '';

  notibtn: any;
  showAccept = 'true';
  searchDriver;
  searchStore;
  hhhcoords = [];

  title = 'My first AGM project';
  lat: number;
  lng: number;
  hlat: any = [];
  hlng: any = [];
  heatlat: any = [];
  heatlng: any = [];
  markers = [];
  grand: any = [];
  subtot: any;
  subtot1: any;
  subtot2: any;
  taxtot: any;
  finalTot: any;
  userFeedback: any;
  applicafeedbacklist: any;
  driverFeedback: any;
  iosappRating: any;
  iosversion: any;
  iosReviews: any;
  androidinstalls; any;
  androidratings: any;
  androidreviews: any;
  androidversion: any;
  regIos: any;
  regAndroid: any;
  map: google.maps.Map;
  heatmapping: google.maps.visualization.HeatmapLayer;

  columnlabelChart: ChartType;
  OrdersGraph: ChartType;
  genderDonutChart: ChartType;
  ageDonutChart: ChartType;
  payDonutChart: ChartType;
  grossRevGraph: ChartType;
  netRevGraph: ChartType;
  registerUsers: ChartType;
  genderData = [];
  ageData = [];
  cardData: any;
  cashData: any;
  orderXaxis = [];
  completeOrderData = [];
  cancelledOrderData = [];
  grossRevXaxis = [];
  grossStoreOne = [];
  grossStoreTwo = [];
  grossStoreThree = [];
  grossStoreDelivey = [];
  grossTotalGross = [];
  regUserXaxis = [];
  regUserIos = [];
  regUserAndroid = [];
  regUserDriver = [];
  netRevXaxis = [];
  netRevStore = [];
  netRevDeliv = [];
 netRevTotal = [];
 lastMonthData = [];
 curreMonthData = [];
 customGraData = [];
  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService, private route: ActivatedRoute,
    private config: NgbRatingConfig,
    private datePipe: DatePipe,
    private mapsApiLoader: MapsAPILoader,
  ) { config.max = 5; }

  public ChartType = 'bar';

  chartOptions = {
    responsive: true
  };

  public barChartOptions =
    {
      scaleShowVerticalLines: false,
      responsive: true,
    };

  public barChartLabels = this.pr_name;
  public barChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartData = [
    { data: this.pr_qty, label: 'Series A' }
  ];

  ngOnInit(): void {

    const activeMenu = document.getElementById('orders');
    activeMenu.classList.remove('active');
   
    this.topStats();

    this.topDashBoardData();
    
    // this.route.params.subscribe(params => this.page = parseInt(params['total']));
    const object = { pageNumber: this.page }
    this.getOrderList(object)

    this.topselling({ fromDate: this.graphFrom, toDate: this.graphTo })
    this.heatmap({ fromDate: this.heatFrom, toDate: this.heatTo })
    this.callRolePermission()
    this.userappfeedbacklist()
    this.applicationfeedbacklist()
    this.driverfeedbacklist()

    var params1 = {
      url: 'admin/heatMap',
      data: ({ fromDate: "", toDate: "" })
    }

    this.apiCall.commonPostService(params1).subscribe((result: any) => {

      if (result.body.error == "false") {
        this.heatcoords = result.body.data.map;

        this.heatcoords.forEach((val, index) => {

          delete val.id
          delete val.addressType
          delete val.addressPinDetails
          delete val.landmark
          delete val.orders

          this.hhhcoords.push(val)

        })
        this.hhhcoords.filter((item) => {
          item.lat = item.latitude
          item.lng = item.longitude
          delete item.latitude
          delete item.longitude

        })
      }

      this.mapsApiLoader.load().then(() => {
        this.initMap();
      });
    });
    this.genderChartGraph();
    this.ageChartGraph();
    this.paymentChartGraph();
    this.orderChartGraph();
    this.grossRevenueGraph();
    this.registeredUserGraph();
    this.netRevenueGraph();
    this.columnlabelDiffChart();
    this.lastClick('');
    this.currentClick('');
  }

  lastClick(val){
    var object = {filter: val}

    var params = {
      url: 'admin/lastMonthBarChart',
      data: object
   
    }
  this.apiCall.commonPostService(params).subscribe((result: any) => {
    if (result.body.error == "false") {
      this.lastMonthData = result.body.data.lastMonthBarChart;
      this.columnlabelChart = {
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
        colors: ['#C4CBCE', '#62CA55'],
        series: [{
            name: 'Last',
            data: this.lastMonthData
        },
        {
            name: 'Current',
            data: this.curreMonthData
        }],
        
        xaxis: {
            categories: ['Orders', 'Customers', 'Gross R.', 'Net R.'],
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
  });
  }

  currentClick(val){
    var object = {filter: val}

    var params = {
      url: 'admin/currentMonthBarChart',
      data: object
   
    }
  this.apiCall.commonPostService(params).subscribe((result: any) => {
    if (result.body.error == "false") {
      this.curreMonthData = result.body.data.curentMonthBarChart;
      this.columnlabelChart = {
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
        colors: ['#C4CBCE', '#62CA55'],
        series: [{
            name: 'Last',
            data: this.lastMonthData
        },
        {
            name: 'Current',
            data: this.curreMonthData
        }],
        
        xaxis: {
            categories: ['Orders', 'Customers', 'Gross R.', 'Net R.'],
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
  });
  }

  graphvalueFrom(event: any) {
    this.graphCustomFrom = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.dateColumnGraph();

  }

  graphvalueTo(event: any) {
    this.graphCustomTo = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.dateColumnGraph();
  }

  dateColumnGraph(){
    var object = {st_date:this.graphCustomFrom,ed_date:this.graphCustomTo}

    var params = {
      url: 'admin/customMonthBarChart',
      data: object
   
    }
  this.apiCall.commonPostService(params).subscribe((result: any) => {
    if (result.body.error == "false") {
      this.customGraData = result.body.data.custom;
      this.columnlabelChart = {
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
            name: 'Custom',
            data: this.customGraData
        }],
        
        xaxis: {
            categories: ['Orders', 'Customers', 'Gross R.', 'Net R.'],
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
  });
  }
  columnlabelDiffChart(){
    this.columnlabelChart = {
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
              return val + '%';
          },
          offsetY: -20,
          style: {
              fontSize: '12px',
              colors: ['#304758']
          }
      },
      colors: ['#C4CBCE', '#62CA55'],
      series: [{
          name: 'Last',
          data: [2.5, 3.2, 10.1, 4.2]
      },
      {
          name: 'Current',
          data: [2.5, 3.2, 20, -4.2]
      }],
      
      xaxis: {
          categories: ['Orders', 'Customers', 'Gross R.', 'Net R.'],
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
                  return val + '%';
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

  genderChartGraph() {
    var params = {
      url: 'admin/genderGraphChart',
      data: ""
    }
    this.genderDonutChart = {
      labels: [
        'Male', 'Female'
      ],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: [
            '#F14948', '#F38DA3'
          ],
          hoverBackgroundColor: ['#F14948', '#F38DA3'],
          hoverBorderColor: '#fff',
        }],
      options: {
        cutoutPercentage: 30,
        maintainAspectRatio: false,
        legend: {
          position: 'top',
        }
      }
    };
    this.apiCall.commonPostService(params).subscribe((result: any) => {
      if (result.body.error == "false") {

        this.genderData = result.body.data.gender;
        this.genderDonutChart = {
          labels: [
            'Male', 'Female'
          ],
          datasets: [
            {
              data: this.genderData,
              backgroundColor: [
                '#F14948', '#F38DA3'
              ],
              hoverBackgroundColor: ['#F14948', '#F38DA3'],
              hoverBorderColor: '#fff',
            }],
          options: {
            cutoutPercentage: 30,
            maintainAspectRatio: false,
            legend: {
              position: 'top',
            }
          }
        };
      }
    });
  }

  ageChartGraph() {
    var params = {
      url: 'admin/ageGraph',
      data: ""
    }
    this.ageDonutChart = {
      labels: [
        '12-18', '19-25', '26-40', '41+'
      ],
      datasets: [
        {
          data: [0, 0, 0, 0],
          backgroundColor: [
            '#2196F3', '#E4F2FE', '#C8E5FC', '#90CBF9'
          ],
          hoverBackgroundColor: ['#2196F3', '#E4F2FE', '#C8E5FC', '#90CBF9'],
          hoverBorderColor: '#fff',
        }],
      options: {
        cutoutPercentage: 30,
        maintainAspectRatio: false,
        legend: {
          position: 'top',
        }
      }
    };
    this.apiCall.commonPostService(params).subscribe((result: any) => {
      if (result.body.error == "false") {

        this.ageData = result.body.data.ages;
        this.ageDonutChart = {
          labels: [
            '12-18', '19-25', '26-40', '41+'
          ],
          datasets: [
            {
              data: this.ageData,
              backgroundColor: [
                '#2196F3', '#E4F2FE', '#C8E5FC', '#90CBF9'
              ],
              hoverBackgroundColor: ['#2196F3', '#E4F2FE', '#C8E5FC', '#90CBF9'],
              hoverBorderColor: '#fff',
            }],
          options: {
            cutoutPercentage: 30,
            maintainAspectRatio: false,
            legend: {
              position: 'top',
            }
          }
        };
      }
    });
  }

  paymentChartGraph() {
    var params = {
      url: 'admin/paymentGraph',
      data: ""
    }
    this.payDonutChart = {
      labels: [
        'CARD', 'CASH'
      ],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: [
            '#62CA55', '#80E4A9'
          ],
          hoverBackgroundColor: ['#62CA55', '#80E4A9'],
          hoverBorderColor: '#fff',
        }],
      options: {
        cutoutPercentage: 30,
        maintainAspectRatio: false,
        legend: {
          position: 'top',
        }
      }
    };
    this.apiCall.commonPostService(params).subscribe((result: any) => {
      if (result.body.error == "false") {

        this.cardData = result.body.data.card;
        this.cashData = result.body.data.cash;
        this.payDonutChart = {
          labels: [
            'CARD', 'CASH'
          ],
          datasets: [
            {
              data: [this.cardData, this.cashData],
              backgroundColor: [
                '#62CA55', '#80E4A9'
              ],
              hoverBackgroundColor: ['#62CA55', '#80E4A9'],
              hoverBorderColor: '#fff',
            }],
          options: {
            cutoutPercentage: 30,
            maintainAspectRatio: false,
            legend: {
              position: 'top',
            }
          }
        };
      }
    });
  }

  orderChartGraph() {
    var params = {
      url: 'admin/orderGraph',
      data: ""
    }
    this.OrdersGraph = {
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
      colors: ['#2196F3', '#F14948'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [3, 4],
        curve: 'straight',
        dashArray: [8, 8]
      },
      series: [{
        name: 'Total Orders',
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      },
      {
        name: 'Cancelled Orders',
        data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35]
      }
      ],
      markers: {
        size: 0,

        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
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

        this.orderXaxis = result.body.data.x_arr;
        this.completeOrderData = result.body.data.complete_order;
        this.cancelledOrderData = result.body.data.cancelled_order;
        this.OrdersGraph = {
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
          colors: ['#2196F3', '#F14948'],
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [3, 4],
            curve: 'straight',
            dashArray: [8, 8]
          },
          series: [{
            name: 'Total Orders',
            data: this.completeOrderData
          },
          {
            name: 'Cancelled Orders',
            data: this.cancelledOrderData
          }
          ],
          markers: {
            size: 0,

            hover: {
              sizeOffset: 6
            }
          },
          xaxis: {
            categories: this.orderXaxis,
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

  grossRevenueGraph() {
    var params = {
      url: 'admin/grossRevenue',
      data: ""
    }
    this.grossRevGraph = {
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
      colors: ['#2196F3', '#F14948', '#FFFF00', '#800080', '#62CA55'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [2, 2, 2, 2, 2],
        curve: 'straight',
        dashArray: [0, 0, 0, 0, 0]
      },
      series: [{
        name: 'Store A',
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      },
      {
        name: 'Store B',
        data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35]
      },
      {
        name: 'Store C',
        data: [0, 10, 20, 50, 90, 45, 67, 89, 90, 10, 11, 25]
      },
      {
        name: 'Delivery',
        data: [10, 20, 30, 40, 50, 65, 77, 89, 90, 60, 81, 95]
      },
      {
        name: 'Total',
        data: [20, 30, 40, 60, 70, 0, 7, 9, 26, 15, 10, 45]
      }
      ],
      markers: {
        size: 0,

        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
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

        this.grossRevXaxis = result.body.data.x_arr;
        this.grossStoreOne = result.body.data.storeOne;
        this.grossStoreTwo = result.body.data.storeTwo;
        this.grossStoreThree = result.body.data.storeThree;
        this.grossStoreDelivey = result.body.data.storeDelivery;
        this.grossTotalGross = result.body.data.totalGross;
        this.grossRevGraph = {
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
          colors: ['#2196F3', '#F14948', '#FFFF00', '#800080', '#62CA55'],
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [2, 2, 2, 2, 2],
            curve: 'straight',
            dashArray: [0, 0, 0, 0, 0]
          },
          series: [{
            name: 'Store A',
            data: this.grossStoreOne
          },
          {
            name: 'Store B',
            data: this.grossStoreTwo
          },
          {
            name: 'Store C',
            data: this.grossStoreThree
          },
          {
            name: 'Delivery',
            data: this.grossStoreDelivey
          },
          {
            name: 'Total',
            data: this.grossTotalGross
          }
          ],
          markers: {
            size: 0,

            hover: {
              sizeOffset: 6
            }
          },
          xaxis: {
            categories: this.grossRevXaxis,
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

  registeredUserGraph() {
    var params = {
      url: 'admin/registeredUser',
      data: ""
    }
    this.registerUsers = {
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
      colors: ['#2196F3', '#F14948', '#62CA55'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [2, 2, 2],
        curve: 'straight',
        dashArray: [0, 0, 0]
      },
      series: [{
        name: 'iOS',
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      },
      {
        name: 'Android',
        data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35]
      },
      {
        name: 'Driver Android',
        data: [10, 20, 30, 40, 50, 65, 77, 89, 90, 60, 81, 95]
      }
      ],
      markers: {
        size: 0,

        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
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

        this.regUserXaxis = result.body.data.x_arr;
        this.regUserIos = result.body.data.ios;
        this.regUserAndroid = result.body.data.android;
        this.regUserDriver = result.body.data.driver;
        this.registerUsers = {
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
          colors: ['#2196F3', '#F14948', '#62CA55'],
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [2, 2, 2],
            curve: 'straight',
            dashArray: [0, 0, 0]
          },
          series: [{
            name: 'iOS',
            data: this.regUserIos
          },
          {
            name: 'Android',
            data: this.regUserAndroid
          },
          {
            name: 'Driver Android',
            data: this.regUserDriver
          }
          ],
          markers: {
            size: 0,
    
            hover: {
              sizeOffset: 6
            }
          },
          xaxis: {
            categories: this.regUserXaxis,
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

  netRevenueGraph(){
    var params = {
      url: 'admin/netRevenue',
      data: ""
    }

    this.netRevGraph = {
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
  colors: ['#2196F3', '#F14948','#62CA55'],
  dataLabels: {
      enabled: false
  },
  stroke: {
      width: [3, 3, 3],
      curve: 'straight',
      dashArray: [8,8,8]
  },
  series: [{
      name: 'Delivery',
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
  },
  {
      name: 'Stores',
      data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35]
  },
  {
      name: 'Total',
      data: [10,20,30,40,50,65,77,89,90,60,81,95]
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

    this.netRevXaxis = result.body.data.x_arr;
    this.netRevStore = result.body.data.store;
    this.netRevDeliv = result.body.data.delivery;
    this.netRevTotal = result.body.data.total;
    this.netRevGraph = {
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
      colors: ['#2196F3', '#F14948','#62CA55'],
      dataLabels: {
          enabled: false
      },
      stroke: {
          width: [3, 3, 3],
          curve: 'straight',
          dashArray: [8,8,8]
      },
      series: [{
          name: 'Delivery',
          data: this.netRevDeliv
      },
      {
          name: 'Stores',
          data: this.netRevStore
      },
      {
          name: 'Total',
          data: this.netRevTotal
      }
      ],
      markers: {
          size: 0,
    
          hover: {
              sizeOffset: 6
          }
      },
      xaxis: {
          categories: this.netRevXaxis,
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

  callRolePermission() {
    if (sessionStorage.getItem('adminRole') !== 'superadmin') {
      let orderpermission = JSON.parse(sessionStorage.getItem('permission'))
      // console.log(orderpermission[0].read)
      this.showAccept = orderpermission[0].writeOpt
    }
  }

  topDashBoardData(){
    let cu_yr = new Date().getFullYear();
    let statuscount = {
      url: "admin/dashboard",
      data: { "year": cu_yr }
    }

    this.apiCall.commonPostService(statuscount).subscribe((result: any) => {
      let resu = result.body;

      if (resu.error == "false") {

        this.regIos = resu.data.registeredCountIos;
        this.regAndroid = resu.data.registeredCountAndroid;
        this.statCount = resu.data.orderStatusCount;
        this.delivered = resu.data.orderStatusCount.delivered;
        this.assigned = resu.data.orderStatusCount.assigned;
        this.cancelled = resu.data.orderStatusCount.cancelled;
        this.pending = resu.data.orderStatusCount.pending;
        this.totalOrders = resu.data.orderStatusCount.totalOrders;
        this.totalProducts = resu.data.orderStatusCount.totalProducts;
        this.totalOffers = resu.data.orderStatusCount.totalOffers;
        this.storesList = resu.data.stores;
        this.driversList = resu.data.driver;
        this.feedback = resu.data.feedback;
        this.appFeedback = resu.data.appFeedback;
        this.notification = resu.data.notification;
        this.iosappRating = resu.data.app_st.contentRating;
        this.iosversion = resu.data.app_st.version;
        this.iosReviews = resu.data.app_st.reviews;
        this.androidinstalls = resu.data.google_st.installs;
        this.androidratings = resu.data.google_st.ratings;
        this.androidreviews = resu.data.google_st.reviews;
        this.androidversion = resu.data.app_st.version;
      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);
    });
  }

  topStats(){
    var params = {
      url: 'admin/topStats',
      data: ""
    }
    this.apiCall.commonPostService(params).subscribe((result: any) => {
      if (result.body.error == "false") {

        this.customer = result.body.data.customer;
        this.driver = result.body.data.driver;
        this.store = result.body.data.store;
      }
    });
  }


  valuefrom(event: any) {
    this.graphlinefromDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    // console.log("valuefrom",this.fromDate)
  }

  valueTo(event: any) {
    this.graphlinetoDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    // console.log("valueTo",this.toDate)
  }

  userappfeedbacklist() {
    var params = {
      url: 'admin/userappfeedbacklist',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          // console.log(response.body)
          this.userFeedback = response.body.data.userFeedback

          this.userFeedback.forEach(function (ord, index) {
            var tt = ord.totalAmount - ord.discountAmount

            var subtot = tt - ord.couponDiscount
            var subtot1 = subtot - (ord.pointsAmount + ord.paidByWallet)
            if (ord.off_types == '0') {
              ord.fastDelievryCharge = ord.couponDiscount
              // console.log("off",ord.fastDelievryCharge)
            }
            var subtot2 = subtot1 + ord.fastDelievryCharge

            var subtot3 = subtot2 * (ord.taxValue / 100)
            var grandtot = subtot2 + subtot3

            ord.grand = grandtot
            // console.log("grand",grandtot);
          })

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

  applicationfeedbacklist() {
    var params = {
      url: 'admin/appfeedbacklist',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          // console.log(response.body)
          this.applicafeedbacklist = response.body.data.appFeedback

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

  driverfeedbacklist() {
    var params = {
      url: 'admin/driverfeedbacklist',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          // console.log(response.body)
          this.driverFeedback = response.body.data.driverFeedback
          this.driverFeedback.forEach(function (ord, index) {
            var tt = ord.totalAmount - ord.discountAmount

            var subtot = tt - ord.couponDiscount
            var subtot1 = subtot - (ord.pointsAmount + ord.paidByWallet)
            if (ord.off_types == '0') {
              ord.fastDelievryCharge = ord.couponDiscount
              // console.log("off",ord.fastDelievryCharge)
            }
            var subtot2 = subtot1 + ord.fastDelievryCharge

            var subtot3 = subtot2 * (ord.taxValue / 100)
            var grandtot = subtot2 + subtot3

            ord.grand = grandtot
            // console.log("grand",grandtot);
          })

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

  updateOrderStatus(id, status) {
    var params = {
      url: 'admin/calcelledOrder',
      data: { orderId: id, status: status }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error === 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
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

  topselling(object) {
    var params = {
      url: 'admin/topSellingItems',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe((result: any) => {

      if (result.body.error == "false") {
        this.product = result.body.data.product;
        for (let abc of this.product) {
          this.pr_name.push(abc.productName);
          this.pr_qty.push(abc.qty);
        }
      }
    });
  }

  heatmap(object) {
    var params = {
      url: 'admin/heatMap',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe((result: any) => {

      if (result.body.error == "false") {
        this.maps = result.body.data.map;
      }
    });
  }

  initMap() {
    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 4,
      center: new google.maps.LatLng(24.774265, 46.738586),
      // mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoomControl: true,
      streetViewControl: false,
      disableDefaultUI: true,
    });

    this.heatmapping = new google.maps.visualization.HeatmapLayer({
      data: this.getPoints(),
      map: this.map,
    });
  }

  getPoints() {


    let markers: marker[] = this.hhhcoords;

    // console.log("lolo",markers)

    // transforming points
    return markers.map(point =>
      new google.maps.LatLng(point.lat, point.lng));

  }


  salesvalueFrom(event: any) {
    this.graphFrom = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.topselling({ fromDate: this.graphFrom, toDate: this.graphTo })
  }

  salesvalueTo(event: any) {
    this.graphTo = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.topselling({ fromDate: this.graphFrom, toDate: this.graphTo })
  }

  heatvalueFrom(event: any) {
    this.heatFrom = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.heatmap({ fromDate: this.heatFrom, toDate: this.heatTo })
  }

  heatvalueTo(event: any) {
    this.heatTo = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.heatmap({ fromDate: this.heatFrom, toDate: this.heatTo })
  }


  nextPage(page) {
    const object = { pageNumber: page }
    this.getOrderList(object)
  }



  getOrderList(object) {
    let dashOrders = {
      url: "admin/dashboardOrder",
      data: object
    }

    this.apiCall.commonPostService(dashOrders).subscribe((result: any) => {
      let resu = result.body;

      if (resu.error == "false") {
        // console.log("resssss", resu);
        this.pages = resu.data.total * 10;
        this.dashOrdersList = resu.data.orders;

        this.dashOrdersList.forEach(function (ord, index) {
          var tt = (ord.totalAmount + ord.otherTotal) - ord.discountAmount

          var subtot = tt - ord.couponDiscount
          var subtot1 = subtot - (ord.pointsAmount + ord.paidByWallet)
          if (ord.off_types == '0') {
            ord.fastDelievryCharge = ord.couponDiscount
            // console.log("off",ord.fastDelievryCharge)
          }
          var subtot2 = subtot1 + ord.fastDelievryCharge

          var subtot3 = subtot2 * (ord.taxValue / 100)
          var grandtot = subtot2 + subtot3

          ord.grand = grandtot
          // console.log("grand",grandtot);
        })

      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);
    });
  }

  // searchDrivers(value){
  //   this.driversList
  //   // console.log("li",this.driversList)
  //   console.log("val",value)
  //   var driverIDs = value
  //   console.log("->>>>>>>>>",driverIDs)

  //   var sortOrder = this.driversList.filter(function(item) {
  //     return item.firstName.toLowerCase().indexOf(driverIDs.toLowerCase()) >= 0
  //    })
  //    console.log("ss",sortOrder)
  //    this.driversList = sortOrder

  // }
  // searchStores(value){
  //   this.storesList
  //   // console.log(this.storesList)
  //   // console.log("val",value)
  //   var storeIDs = value

  //   var sortOrder = this.storesList.filter(function(item) {
  //     return item.storeName.toLowerCase().indexOf(storeIDs.toLowerCase()) >= 0
  //    })
  //    this.storesList = sortOrder
  //   //  console.log(this.selection)
  // }

  notify(driverid, type, id) {
    let notificat = {
      url: "admin/dashboardPush",
      data: { driverIds: driverid, type: type, id: id }
    }
    // console.log(notificat)
    this.apiCall.commonPostService(notificat).subscribe((result: any) => {
      let resu = result.body;

      if (resu.error == "false") {
        this.apiCall.showToast(resu.message, 'Success', 'successToastr')
        this.notibtn = resu.error;
        this.ngOnInit();
      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);
    });
  }

}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  // draggable: boolean;
}