import { ChangeDetectorRef, ViewRef, OnInit, OnDestroy, Component, Input, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { DashboardService } from 'app/services/dashboard/dashboard.service';
import { Notification, NotificationService, DeviceService, ApiConfigService } from 'app/services';
import { Subscription } from 'rxjs/Subscription';

import * as moment from 'moment-timezone'
import { Observable, forkJoin } from 'rxjs';
import { Message } from '@stomp/stompjs'
import { StompRService } from '@stomp/ng2-stompjs'
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-plugin-streaming';
import * as signalR from '@microsoft/signalr';
import 'chartjs-plugin-zoom';

@Component({
	selector: 'app-widget-chart-b',
	templateUrl: './widget-chart-b.component.html',
	styleUrls: ['./widget-chart-b.component.css'],
	providers: [StompRService]
})
export class WidgetChartBComponent implements OnInit, OnDestroy {
	@Input() widget;
	@Input() deviceData;
	@Input() count;
	@Input() resizeEvent: EventEmitter<any>;
	resizeSub: Subscription;
	@Input() chartTypeChangeEvent: EventEmitter<any>;
	@Input() telemetryDeviceChangeEvent: EventEmitter<any>;
	@Input() telemetryAttributeChangeEvent: EventEmitter<any>;
	chartTypeChangeSub: Subscription;
	telemetryDeviceChangeSub: Subscription;
	telemetryAttributeChangeSub: Subscription;
	@ViewChild('BaseChartDirective', { static: false }) cchart: BaseChartDirective;
	currentUser = JSON.parse(localStorage.getItem("currentUser"));

	isConnected = false;
	isDeviceExists = false;
	devicedUniqueId: string = '';
	attributesData = [];
	subscription: Subscription;
	messages: Observable<Message>;
	cpId = '';
	protected apiServer = ApiConfigService.settings.apiServer;
	connection;

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
	datadevice: any = [];
	elevatorData = {
		index: 0
	}
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
	chartType = 'line';
	options: any = {
		width: 500,
		height: 500,
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			xAxes: [{
				type: 'realtime',
				barThickness: 10,
				maxBarThickness: 15,
				time: {
					stepSize: 10
				},
				realtime: {
					duration: 90000,
					refresh: 1000,
					delay: 2000
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

	constructor(
		public dashboardService: DashboardService,
		private spinner: NgxSpinnerService,
		private _notificationService: NotificationService,
		private changeDetector: ChangeDetectorRef,
		private stompService: StompRService,
		private deviceService: DeviceService
	) {
	}

	ngOnInit() {
		this.options.width = (this.widget.properties.w > 0 ? parseInt((this.widget.properties.w - 100).toString()) : 200);
		this.options.height = (this.widget.properties.h > 0 ? parseInt((this.widget.properties.h - 200).toString()) : 200);
		this.resizeSub = this.resizeEvent.subscribe((widget) => {
			if (widget.id == this.widget.id) {
				this.widget = widget;
				this.changeChartType();
			}
		});

		this.chartTypeChangeSub = this.chartTypeChangeEvent.subscribe((widget) => {
			if (widget.id == this.widget.id) {
				this.changeChartType();
			}
		});

		this.telemetryDeviceChangeSub = this.telemetryDeviceChangeEvent.subscribe((widget) => {
			if (widget.id == this.widget.id) {
				this.widget = widget;
				this.deviceChange();
			}
		});
		this.telemetryAttributeChangeSub = this.telemetryAttributeChangeEvent.subscribe((widget) => {
			if (widget.id == this.widget.id) {
				this.widget = widget;
				this.attributesChange();
			}
		});
		this.deviceChange();
		this.changeChartType();

		//	this.getStompConfig();
	}

	onRefresh(chart: any) {
		let now = moment();
		this.datasets.forEach((val, index) => {
			this.datasets[index].data.push({
				x: now,
				y: Math.floor(Math.random() * (100 - 1 + 1) + 1)
			})
		});
	}

	changeChartType() {
		this.options.width = (this.widget.properties.w > 0 ? parseInt((this.widget.properties.w - 100).toString()) : 200);
		this.options.height = (this.widget.properties.h > 0 ? parseInt((this.widget.properties.h - 200).toString()) : 200);
		this.chartType = 'bar';
		if (this.widget.widgetProperty.chartType && this.widget.widgetProperty.chartType != '') {
			this.chartType = (this.widget.widgetProperty.chartType == 'bar' ? 'bar' : 'line');
			if (this.cchart && this.cchart.chart && this.cchart.chart.config) {
				this.cchart.chart.update();
			}
			if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
				this.changeDetector.detectChanges();
			}
		}
	}

	deviceChange() {
		if (this.widget.widgetProperty.telemetryUniqueId != '') {
			this.isDeviceExists = false;
			this.elevatorData.index = 0;
			/*Check Parent Device Exists*/
			for (var i = 0; i <= this.deviceData.length - 1; i++) {
				if (this.deviceData[i].uniqueId == this.widget.widgetProperty.telemetryUniqueId) {
					this.isDeviceExists = true;
					this.elevatorData.index = i;
				}
			}
			/*Check Device Exists*/
			if (this.isDeviceExists) {
				this.getElevatorTelemetryData();
			}
		}
	}

	attributesChange() {
		if (this.widget.widgetProperty.telemetryAttributes.length == 0) {
			this.datasets = [];
			this.changeChartType();
		}
		else {
			let temp = [];
			this.attributesData.forEach((element, i) => {
				var colorNames = Object.keys(this.chartColors);
				var colorName = colorNames[i % colorNames.length];
				var newColor = this.chartColors[colorName];
				var graphLabel = {
					label: element.attributeName,
					backgroundColor: newColor,
					borderColor: newColor,
					fill: false,
					cubicInterpolationMode: 'monotone',
					data: []
				}
				if (this.widget.widgetProperty.telemetryAttributes.includes(element.attributeName)) {
					temp.push(graphLabel);
				}
			});
			this.datasets = temp;
			this.changeChartType();
		}
	}

	/**
	* For Get Stomp Config
	**/
	getStompConfig() {
		this.spinner.show();
		this.deviceService.getStompConfig('LiveData').subscribe(response => {
			if (response.isSuccess) {
				this.stompConfiguration.url = response.data.url;
				this.stompConfiguration.headers.login = response.data.user;
				this.stompConfiguration.headers.passcode = response.data.password;
				this.stompConfiguration.headers.host = response.data.vhost;
				this.cpId = response.data.cpId;
				this.initStomp();
			}
			this.spinner.hide();
		}, error => {
			this.spinner.hide();
			this._notificationService.handleResponse(error, "error");
		});
	}

	/**
	* For Init Stomp
	**/
	initStomp() {
		let config = this.stompConfiguration;
		this.stompService.config = config;
		this.stompService.initAndConnect();
	}

	on_next = (message: Message) => {
		let obj: any = JSON.parse(message.body);
		if (obj.data.msgType === 'telemetry' && obj.data.msgType != 'device' && obj.data.msgType != 'simulator') {
			let reporting_data = obj.data.data.reporting
			this.isConnected = true;
			let dates = obj.data.data.time;
			if (obj.data.data.status != 'off' && obj.data.data.status != 'on') {
				let now = moment();
				this.datasets.forEach((s, index) => {
					if (obj.data.data.reporting[s.label]) {
						let val = Number(parseFloat(obj.data.data.reporting[s.label]).toFixed(2));
						this.datasets[index].data.push({
							x: now,
							y: val
						})
					}
				});
			}
		}
		else if (obj.data.msgType === 'simulator' || obj.data.msgType === 'device') {
			if (obj.data.data.status === 'off') {
				this.isConnected = false;
			} else {
				this.isConnected = true;
			}
		}
	}

	/**
	* For get single child device
	*/
	getElevatorTelemetryData() {
		let device = [];
		let deviceIndex = 0;
		for (var i = 0; i <= this.deviceData.length - 1; i++) {
			if (this.deviceData[i].uniqueId == this.widget.widgetProperty.telemetryUniqueId) {
				device.push(this.deviceData[i]);
				deviceIndex = i;
			}
		}
		if (device && device.length > 0 && device[0].guid) {
			this.spinner.show();
			this.deviceService.gettelemetryDetails(device[0].guid).subscribe(response => {
				if (response.isSuccess === true) {
					this.spinner.hide();
					this.attributesData = response.data;
					let temp = [];
					response.data.forEach((element, i) => {
						var colorNames = Object.keys(this.chartColors);
						var colorName = colorNames[i % colorNames.length];
						var newColor = this.chartColors[colorName];
						var graphLabel = {
							label: element.attributeName,
							backgroundColor: newColor,
							borderColor: newColor,
							fill: false,
							cubicInterpolationMode: 'monotone',
							data: []
						}
						if (this.widget.widgetProperty.telemetryAttributes.includes(element.attributeName))
							temp.push(graphLabel);
					});

					debugger
					this.datasets = temp;
					this.changeChartType();

					if (this.connection) {
						this.connection.stop();
						this.connection = undefined;
					}

					this.getSignalRConfig();

					// if(this.subscription){
					// 	this.subscription.unsubscribe();
					// }
					// this.messages = this.stompService.subscribe('/topic/' + this.cpId + '-' + this.widget.widgetProperty.telemetryUniqueId);
					// this.subscription = this.messages.subscribe(this.on_next);
				} else {
					this._notificationService.handleResponse(response, "error");
				}
			}, error => {
				this.spinner.hide();
				this._notificationService.handleResponse(error, "error");
			});
		}
	}

	ngOnDestroy() {
		this.resizeSub.unsubscribe();
		this.chartTypeChangeSub.unsubscribe();
		this.telemetryDeviceChangeSub.unsubscribe();
		this.telemetryAttributeChangeSub.unsubscribe();
		if (this.subscription)
			this.subscription.unsubscribe();
	}

	getSignalRConfig() {
		this.cpId = this.currentUser.userDetail.cpId;
		this.connection = new signalR.HubConnectionBuilder()
			//.withUrl(this._appConstant.signalRServer)
			.withUrl(this.apiServer.SignalRDataUrl + "notificationhub?groupName=" + this.cpId + '-' + this.widget.widgetProperty.telemetryUniqueId)
			.configureLogging(signalR.LogLevel.Trace)
			.withAutomaticReconnect()
			.build();

		this.start();
		this.getNotificationSignalRData();
	}
	//signalr connection start
	private async start() {
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


				var obj: any;
				obj = $.parseJSON(message.message);

				if (obj.data.msgType === 'telemetry' && obj.data.msgType != 'device' && obj.data.msgType != 'simulator') {
					let reporting_data = obj.data.data.reporting
					self.isConnected = true;
					let dates = obj.data.data.time;
					if (obj.data.data.status != 'off' && obj.data.data.status != 'on') {
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
				}
				else if (obj.data.msgType === 'simulator' || obj.data.msgType === 'device') {
					if (obj.data.data.status === 'off') {
						self.isConnected = false;
					} else {
						self.isConnected = true;
					}
				}

			});
		}
	}

}
