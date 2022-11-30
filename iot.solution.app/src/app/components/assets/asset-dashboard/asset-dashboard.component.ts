import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService, AssetService, DeviceService, Notification, DashboardService, ApiConfigService } from '../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material';
import * as moment from 'moment-timezone';
import * as FileSaver from 'file-saver';
import { StompRService } from '@stomp/ng2-stompjs'
import { attributeObj } from '../add-asset/attribute-model';
import { Message } from '@stomp/stompjs';
import { Subscription, Observable } from 'rxjs';
import { Location } from '@angular/common';
import 'chartjs-plugin-streaming';
import * as _ from 'lodash';
import { AppConstant } from 'app/app.constants';
import * as signalR from '@microsoft/signalr';


@Component({
  selector: 'app-asset-dashboard',
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.css'],
  providers: [StompRService]
})
export class AssetDashboardComponent implements OnInit {
  attr = [new attributeObj];
  assetObject: any = {};
  activeListItem: number = 0;
  alerts: any = [];
  mediaFiles: any = [];
  imagesFiles: any = [];
  assetUtilization: any = [];
  maintenanceSchescheduled: any;
  maintenanceStartDate: any;
  sensdata: any = [];
  WidgetData = {};
  labelname: any;
  type: any;
  uniqueId: any;
  assetGuid: any;
  isChartLoaded = false;
  deviceIsConnected = false;
  isConnected = false;
  subscribed: any;
  message: any;
  cpId: any;
  mediaUrl: any = '';
  imgUrl: string;
  subscription: Subscription;
  messages: Observable<Message>;
  chartColors: any = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    cerise: 'rgb(255,0,255)',
    popati: 'rgb(0,255,0)',
    dark: 'rgb(5, 86, 98)',
    solid: 'rgb(98, 86, 98)'
  };
  datasets: any[] = [
    {
      label: 'Dataset 1 (linear interpolation)',
      backgroundColor: 'rgb(153, 102, 255)',
      borderColor: 'rgb(153, 102, 255)',
      fill: false,
      lineTension: 0,
      borderDash: [8, 4],
      data: []
    }
  ];
  optionsdata: any = {
    type: 'line',
    scales: {
      xAxes: [{
        type: 'realtime',
        time: {
          stepSize: 10
        },
        realtime: {
          duration: 90000,
          refresh: 6000,
          delay: 2000,
        }

      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'value'
        }
      }]

    },
		plugins: {
			zoom: {
				pan: {
					enabled: true,
					mode: 'xy',
					rangeMin: {
						// Format of min zoom range depends on scale type
						x: null,
						y: -200,
					},
					rangeMax: {
						// Format of max zoom range depends on scale type
						x: null,
						y: 200,
					},
				},
				zoom: {
					enabled: true,
					mode: 'x',
					drag: false,
					rangeMin: {
						// Format of min zoom range depends on scale type
						x: null,
						y: -200,
					},
					rangeMax: {
						// Format of max zoom range depends on scale type
						x: null,
						y: 200,
					},
					speed: 0.05,
				},
			},
			streaming: {
				ttl: 5 * 60 * 1000,
			},
		},
    tooltips: {
      mode: 'nearest',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: false
    }

  };
  stompConfiguration = {
    url: '',
    headers: {
      login: '',
      passcode: '',
      host: ''
    },
    heartbeat_in: 0,
    heartbeat_out: 2000,
    reconnect_delay: 5000,
    debug: true
  }
  chartDataList: any[] = [
    {
      parameter: 'Engine (RPM)',
      value: '5000'
    },
    {
      parameter: 'Current (A)',
      value: '24'
    },
    {
      parameter: 'Voltage (V)',
      value: '200'
    },
    {
      parameter: 'Fuel Level (Gal)',
      value: '18'
    },
    {
      parameter: 'Engine Coolant Temp. (C)',
      value: '70'
    },
    {
      parameter: 'Engine Oil Pressure (psl)',
      value: '30'
    }
  ];

  columnChart = {
    chartType: "ColumnChart",
    dataTable: [],
    options: {
      //title: "",
      //isStacked: 'percent',
      vAxis: {
        title: "KW",
        titleTextStyle: {
          bold: true
        },
        viewWindow: {
          min: 0
        }
      },
      hAxis: {
        titleTextStyle: {
          bold: true
        },
      },
      legend: 'none',
      height: "350",
      chartArea: { height: '75%', width: '85%' },
      seriesType: 'bars',
      bar: { groupWidth: "40%" },
      colors: ['#ed734c'],
    }
  };

  slideConfig = {
    // 'margin': 15,
    'centerMode': false,
    'infinite': true,
    'dots': false,
  };
  columnChartattribute: any;
  protected apiServer = ApiConfigService.settings.apiServer;
  connection;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));

  constructor(
    public location: Location,
    private router: Router,
    public _appConstant: AppConstant,
    private stompService: StompRService,
    private _notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public _service: AssetService,
    public dialog: MatDialog,
    public deviceService: DeviceService,
    public dashboardService: DashboardService,) {
    this.activatedRoute.params.subscribe(params => {
      this.assetGuid = params.assetGuid;
      this.getAssetDetails(params.assetGuid);
      this.getUpcomingMaintenancedate(params.assetGuid);
      this.getAlertList(params.assetGuid);

    });
  }

  ngOnInit() {
    this.imgUrl = this._notificationService.apiBaseUrl;
    this.getEnergyGraph(this.assetGuid, 'w');
    //this.getStompConfig();
  }

  /**
  * 
  * @param deivceGuid
  */
  getAssetDetails(assetGuid) {
    //this.assetForm.get('uniqueId').disable()
    //this.assetForm.get('name').disable()
    //this.attrForm.get('attrName').disable()
    //this.attrForm.get('dispName').disable()
    this.spinner.show();
    this.deviceService.getDeviceDetails(assetGuid).subscribe(response => {
      if (response.isSuccess === true) {
        this.assetObject = response.data;
        this.uniqueId = response.data.uniqueId;
        this.mediaUrl = this.imgUrl + this.assetObject.image;
        this.gettelemetryDetails(assetGuid);
        this.mediaFiles = response.data.deviceMediaFiles;
        this.imagesFiles = response.data.deviceImageFiles;
        this.attr = response.data.deviceAttributes;
        this.devicestatus();
      }
      else {
        this._notificationService.add(new Notification('error', response.message));
      }
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
  }


  /**
  * Get alert list by assetGuid
  * @param assetGuid
  */
  getAlertList(assetGuid) {
    let parameters = {
      pageNumber: 0,
      pageSize: 10,
      searchText: '',
      sortBy: 'eventDate desc',
      deviceGuid: assetGuid,
      entityGuid: '',
    };
    this.spinner.show();
    this.dashboardService.getAlertsList(parameters).subscribe(response => {
      this.spinner.hide();
      if (response.isSuccess === true && response.data.items) {
        this.alerts = response.data.items;

      }
      else {
        this.alerts = [];
        this._notificationService.add(new Notification('error', response.message));

      }
    }, error => {
      this.alerts = [];
      this._notificationService.add(new Notification('error', error));
    });
  }

  /**
 * Get upcoming maintenence by assetGuid
 * @param assetGuid
 */
  getTimeZone() {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }

  /**
   * Get upcoming maintenance by assetGuid
   * @param assetGuid
   */
  getUpcomingMaintenancedate(assetGuid) {
    let currentdatetime = moment().format('YYYY-MM-DD[T]HH:mm:ss');
    let timezone = moment().utcOffset();
    this.dashboardService.getUpcomingMaintenancedate(currentdatetime, timezone, assetGuid).subscribe(response => {
      if (response.isSuccess === true) {
        let msVal = (response.data['day']) ? response.data['day'] : 0;
        msVal += ' d ';
        msVal += (response.data['hour']) ? response.data['hour'] : 0;
        msVal += ' hrs ';
        msVal += (response.data['minute']) ? response.data['minute'] : 0;
        msVal += ' m';
        this.maintenanceSchescheduled = msVal;
        this.maintenanceStartDate = response.data['startDateTime'];
      }
    }, error => {
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
  }



  /**
   * Get attribute graph by assetId, type and attributename
   * @param assetId
   * @param type
   * @param attributename
   */
  getAttributeGraph(assetId, type, attributename) {
    this.isChartLoaded = false;
    var data = { deviceGuid: assetId, attribute: attributename, frequency: type }
    this.deviceService.getAttributeGraph(data).subscribe(response => {
      if (response.isSuccess === true) {
        let data = [];
        if (response.data.length) {
          data.push(['Months', 'Consumption'])

          response.data.forEach(element => {
            data.push([element.name, parseFloat(element.value)])
          });
        }
        this.columnChartattribute = {
          chartType: "ColumnChart",
          dataTable: data,
          options: {
            title: "",
            vAxis: {
              title: "KW",
              titleTextStyle: {
                bold: true
              },
              viewWindow: {
                min: 0
              }
            },
            hAxis: {
              titleTextStyle: {
                bold: true
              },
            },
            legend: 'none',
            height: "350",
            chartArea: { height: '75%', width: '85%' },
            seriesType: 'bars',
            bar: { groupWidth: "25%" },
            colors: ['#ed734c'],
          }
        };
        setTimeout(() => {
          this.isChartLoaded = true;
        }, 200);
      }

      else {
        this.columnChartattribute.dataTable = [];
        this._notificationService.add(new Notification('error', response.message));

      }
    }, error => {
      this.columnChartattribute.dataTable = [];
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
  }

  /**
   * Get local date
   * @param lDate
   */
  getLocalDate(lDate) {
    var utcDate = moment.utc(lDate, 'YYYY-MM-DDTHH:mm:ss.SSS');
    // Get the local version of that date
    var localDate = moment(utcDate).local();
    let res = moment(localDate).format('MMM DD, YYYY hh:mm:ss A');
    return res;

  }

  /**
   * Change graph filter
   * @param event
   */
  changeGraphFilter(event) {
    let type = 'w';
    if (event.value === 'Month') {
      type = 'm';
    } else if (event.value === 'Year') {
      type = 'y';
    }
    this.getEnergyGraph(this.assetGuid, type);

  }

  /**
  * Get energy graph by assetId and type
  * @param assetId
  * @param type
  */
  getEnergyGraph(assetId, type) {
    this.spinner.show();
    var data = { deviceGuid: assetId, frequency: type }
    this.deviceService.getAssetUsageChartData(data).subscribe(response => {
      this.spinner.hide();
      if (response.isSuccess === true) {
        let data = [];
        if (response.data && response.data.length) {
          data.push(['Months', 'Consumption in % '])

          response.data.forEach(element => {
            data.push([element.name, parseFloat(element.utilizationPer)])
          });
        }
        this.columnChart = {
          chartType: "ColumnChart",
          dataTable: data,
          options: {
            //title: "Asset Utilization",
            //isStacked: 'percent',
            vAxis: {
              title: "KW %",
              titleTextStyle: {
                bold: true
              },
              viewWindow: {
                min: 0
              }
            },
            hAxis: {
              titleTextStyle: {
                bold: true
              },
            },
            legend: 'none',
            height: "350",
            chartArea: { height: '75%', width: '85%' },
            seriesType: 'bars',
            bar: { groupWidth: "25%" },
            colors: ['#5496d0'],
          }
        };
      }
      else {
        this.columnChart.dataTable = [];
        this._notificationService.add(new Notification('error', response.message));

      }
    }, error => {
      this.columnChart.dataTable = [];
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
  }

  /**
   * downloadPdf
   * @param pdfUrls
   * @param pdfNames
   * @param documentExt
   */
  downloadPdf(pdfUrls: string, pdfNames: string, documentExt: string) {
    const pdfUrl = this._notificationService.apiBaseUrl + pdfUrls;
    const pdfName = pdfNames;

    if (documentExt && documentExt !== 'undefined') {
      FileSaver.saveAs(pdfUrl, pdfName + '.' + documentExt);
    }
    else {
      FileSaver.saveAs(pdfUrl, pdfName);
    }
  }

  toggleDataList(index: number, data) {

    this.activeListItem = index;
    if (data.attributeName != undefined && data.attributeName != '') {
      this.labelname = data.attributeName;
      let datalabel = this.labelname
      this.optionsdata = {
        type: 'line',
        scales: {

          xAxes: [{
            type: 'realtime',
            time: {
              stepSize: 10
            },
            realtime: {
              duration: 90000,
              refresh: 1000,
              delay: 2000,
              onRefresh: function (chart: any) {
                //if (obj.data.msgType !== 'device') {
                chart.data.datasets.forEach(function (dataset: any) {
                  if (dataset.label == datalabel) {
                    dataset.hidden = false
                  } else {
                    dataset.hidden = true
                  }
                });
                // }




              },

              // delay: 2000

            }

          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              //labelString: 'value'
            }
          }]

        },
        tooltips: {
          mode: 'nearest',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: false
        }

      }
      //this.getStompConfig();
      //console.log("tabsss",tab.tab.textLabel)
      /*let temp = [];
      var colorNames = Object.keys(this.chartColors);
      var colorName = colorNames[tab.index % colorNames.length];
      var newColor = this.chartColors[colorName];
      var graphLabel = {
        label: tab.tab.textLabel,
        backgroundColor: 'rgb(153, 102, 255)',
        borderColor: newColor,
        fill: false,
        cubicInterpolationMode: 'monotone',
        data: []
      }
      temp.push(graphLabel);
      this.datasets = temp;*/
    }
  }

  /**
  * 
  * */
  devicestatus() {
    this.dashboardService.connectionstatus(this.uniqueId).subscribe(response => {
      if (response.isSuccess === true && response.data != '') {
        this.deviceIsConnected = response.data.isConnected
      }
    })
  }

  /**
 * Change Filter Asset
 * @param event
 */
  changeFilterAsset(event) {
    let type = 'w';
    if (event.value === 'Weekly') {
      type = 'w';
    }
    else if (event.value === 'Monthly') {
      type = 'm';
    }
    else if (event.value === 'Yearly') {
      type = 'm';
    }

    this.type = type
    this.getCompanyUsageChartData(this.type)
  }


  /**
  * Get company asset usage chart data
  * */
  getCompanyUsageChartData(type) {
    this.spinner.show();
    var data = { frequency: type, deviceGuid: this.assetGuid }
    this.deviceService.getCompanyUsageChartData(data).subscribe(response => {
      this.spinner.hide();
      if (response.isSuccess === true) {
        this.assetUtilization = response.data;
        this.message = response.message
      }
      else {
        this._notificationService.add(new Notification('error', response.message));
      }
    }, error => {
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
  }

  getStompConfig() {

    this.deviceService.getStompConfig('LiveData').subscribe(response => {
      if (response.isSuccess) {
        this.stompConfiguration.url = response.data.url;
        this.stompConfiguration.headers.login = response.data.user;
        this.stompConfiguration.headers.passcode = response.data.password;
        this.stompConfiguration.headers.host = response.data.vhost;
        this.cpId = response.data.cpId;
        this.initStomp();
      }
    });
  }

  initStomp() {
    let config = this.stompConfiguration;
    this.stompService.config = config;
    this.stompService.initAndConnect();
    this.stompSubscribe();
  }

  /**
   * stomp subscriber
   * */
  public stompSubscribe() {
    if (this.subscribed) {
      return;
    }

    this.messages = this.stompService.subscribe('/topic/' + this.cpId + '-' + this.uniqueId);
    this.subscription = this.messages.subscribe(this.on_next);
    this.subscribed = true;
  }
  // For get TelemetryData
  gettelemetryDetails(assetGuid) {
    this.spinner.show();
    this.deviceService.gettelemetryDetails(assetGuid).subscribe(response => {
      if (response.isSuccess === true) {
        this.spinner.hide();
        this.sensdata = response.data
        this.chartDataList = response.data
        let data = { "attributeName": response.data[0].attributeName }
      //  this.toggleDataList(0, data)
        let temp = [];
        response.data.forEach((element, i) => {
          var colorNames = Object.keys(this.chartColors);
          var colorName = colorNames[i % colorNames.length];
          var newColor = this.chartColors[colorName];
          var graphLabel = {
            label: element.attributeName,
            backgroundColor: 'rgb(153, 102, 255)',
            borderColor: newColor,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
          }
          temp.push(graphLabel);
        });

        this.datasets = temp;


        // this.getStompConfig();

        if (this.connection) {
          this.connection.stop();
          this.connection = undefined;
        }

        this.getSignalRConfig();


        /*	let temp = [];
          response.data.forEach((element, i) => {
            var colorNames = Object.keys(this.chartColors);
            var colorName = colorNames[i % colorNames.length];
            var newColor = this.chartColors[colorName];
            var graphLabel = {
              label: element.text,
              backgroundColor: 'rgb(153, 102, 255)',
              borderColor: newColor,
              fill: false,
              cubicInterpolationMode: 'monotone',
              data: []
            }
            temp.push(graphLabel);
          });
          // response.data.forEach(element, i) => {
   
          // });
          this.datasets = temp;
          this.getStompConfig();*/
      } else {
        //this._notificationService.handleResponse(response,"error");
      }
    }, error => {
      this.spinner.hide();
      // this._notificationService.handleResponse(error,"error");
    });
  }
  /**
   * on_next call
   * */
  public on_next = (message: Message) => {
    let obj: any = JSON.parse(message.body);
    let reporting_data = obj.data.data.reporting
    this.isConnected = true;

    let dates = obj.data.data.time;
    let now = moment();
    if (obj.data.data.status == undefined && obj.data.msgType == 'telemetry' && obj.data.msgType != 'device' && obj.data.msgType != 'simulator') {
      this.deviceIsConnected = true;
      this.deviceService.gettelemetryDetails(this.assetGuid).subscribe(response => {
        if (response.isSuccess === true) {
          this.spinner.hide();
          this.chartDataList = response.data
        }
      })
      this.optionsdata = {
        type: 'line',
        scales: {

          xAxes: [{
            type: 'realtime',
            time: {
              stepSize: 5
            },
            realtime: {
              duration: 90000,
              refresh: 6000,
              delay: 2000,
              onRefresh: function (chart: any) {
                if (chart.height) {
                  if (obj.data.data.status != 'on') {

                    chart.data.datasets.forEach(function (dataset: any) {
                      dataset.data.push({

                        x: dates,

                        y: reporting_data[dataset.label]

                      });

                    });
                  }
                } else {

                }

              },

              // delay: 2000

            }

          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'value'
            }
          }]

        },
        tooltips: {
          mode: 'nearest',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: false
        }

      }
    } else if (obj.data.msgType === 'simulator' || obj.data.msgType === 'device') {
      if (obj.data.data.status === 'off') {
        this.deviceIsConnected = false;
        this.optionsdata = {
          type: 'line',
          scales: {

            xAxes: [{
              type: 'realtime',
              time: {
                stepSize: 10
              },
              realtime: {
                duration: 90000,
                refresh: 1000,
                delay: 2000,
                //onRefresh: '',

                // delay: 2000

              }

            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'value'
              }
            }]

          },
          tooltips: {
            mode: 'nearest',
            intersect: false
          },
          hover: {
            mode: 'nearest',
            intersect: false
          }

        };
      } else {
        this.deviceIsConnected = true;
      }
    }
    obj.data.data.time = now;

  }

  getSignalRConfig() {
    this.cpId = this.currentUser.userDetail.cpId;
    this.connection = new signalR.HubConnectionBuilder()
      //.withUrl(this._appConstant.signalRServer)
      .withUrl(this.apiServer.SignalRDataUrl + "notificationhub?groupName=" + this.cpId + '-' + this.uniqueId)
      .configureLogging(signalR.LogLevel.Trace)
      .withAutomaticReconnect()
      .build();

    this.start();
    this.getNotificationSignalRData();
  }
  //signalr connection start
  async start() {
    try {
      await this.connection.start();
      console.log("connected.");
      //this.registerUser();
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  };



  getNotificationSignalRData() {
    var self = this;
    if (self.connection) {

      self.connection.on("ReceiveMessage", function (message) {

        let obj: any = JSON.parse(message.message);
        let reporting_data = obj.data.data.reporting
        self.isConnected = true;

        let dates = obj.data.data.time;
        let now = moment();
        if (obj.data.data.status == undefined && obj.data.msgType == 'telemetry' && obj.data.msgType != 'device' && obj.data.msgType != 'simulator') {
          self.deviceIsConnected = true;
          self.deviceService.gettelemetryDetails(self.assetGuid).subscribe(response => {
            if (response.isSuccess === true) {
              self.spinner.hide();
              self.chartDataList = response.data
            }
          })
          // self.optionsdata = {
          //   type: 'line',
          //   scales: {
          //     xAxes: [{
          //       type: 'realtime',
          //       time: {
          //         stepSize: 10
          //       },
          //       realtime: {
          //         duration: 90000,
          //         refresh: 6000,
          //         delay: 2000,
          //         onRefresh: function (chart: any) {
          //           if (chart.height) {
          //             if (obj.data.data.status != 'on') {
          //               chart.data.datasets.forEach(function (dataset: any) {
          //                 dataset.data.push({
          //                   x: dates,
          //                   y: reporting_data[dataset.label]

          //                 });
          //               });
          //             }
          //           } else {
          //           }
          //         },
          //       }
          //     }],
          //     yAxes: [{
          //       scaleLabel: {
          //         display: true,
          //         labelString: 'value'
          //       }
          //     }]

          //   },
          //   plugins: {
          //     zoom: {
          //       pan: {
          //         enabled: true,
          //         mode: 'xy',
          //         rangeMin: {
          //           // Format of min zoom range depends on scale type
          //           x: null,
          //           y: -200,
          //         },
          //         rangeMax: {
          //           // Format of max zoom range depends on scale type
          //           x: null,
          //           y: 200,
          //         },
          //       },
          //       zoom: {
          //         enabled: true,
          //         mode: 'x',
          //         drag: false,
          //         rangeMin: {
          //           // Format of min zoom range depends on scale type
          //           x: null,
          //           y: -200,
          //         },
          //         rangeMax: {
          //           // Format of max zoom range depends on scale type
          //           x: null,
          //           y: 200,
          //         },
          //         speed: 0.05,
          //       },
          //     },
          //     streaming: {
          //       ttl: 5 * 60 * 1000,
          //     },
          //   },
          //   tooltips: {
          //     mode: 'nearest',
          //     intersect: false
          //   },
          //   hover: {
          //     mode: 'nearest',
          //     intersect: false
          //   }

          // }

          if (obj.data.data.status != 'on') {
						let now = moment();
						self.datasets.forEach((s, index) => {
							if (obj.data.data.reporting[s.label]) {
								let val = Number(parseFloat(obj.data.data.reporting[s.label]).toFixed(2));
								self.datasets[index].data.push({
									x: now,
									y: val
								})
							}
						});
					}
          
        } else if (obj.data.msgType === 'simulator' || obj.data.msgType === 'device') {
          if (obj.data.data.status === 'off') {
            self.deviceIsConnected = false;
            self.optionsdata = {
              type: 'line',
              scales: {

                xAxes: [{
                  type: 'realtime',
                  time: {
                    stepSize: 10
                  },
                  realtime: {
                    duration: 90000,
                    refresh: 1000,
                    delay: 2000,
                    //onRefresh: '',

                    // delay: 2000

                  }

                }],
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'value'
                  }
                }]

              },
              tooltips: {
                mode: 'nearest',
                intersect: false
              },
              hover: {
                mode: 'nearest',
                intersect: false
              }

            };
          } else {
            self.deviceIsConnected = true;
          }
        }
        obj.data.data.time = now;
      });
    }
  }


}
