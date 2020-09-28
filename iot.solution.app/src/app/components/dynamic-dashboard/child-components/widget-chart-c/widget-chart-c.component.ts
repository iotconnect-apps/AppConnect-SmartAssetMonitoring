import { ChangeDetectorRef, ViewRef , OnInit, Component, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { DeviceService } from 'app/services/device/device.service';
import { Notification, NotificationService } from 'app/services';
import {Subscription} from 'rxjs/Subscription';
import { ChartReadyEvent, GoogleChartComponent } from 'ng2-google-charts'

@Component({
	selector: 'app-widget-chart-c',
	templateUrl: './widget-chart-c.component.html',
	styleUrls: ['./widget-chart-c.component.css']
})
export class WidgetChartCComponent implements OnInit,OnDestroy {
	@Input() widget;
	@Input() gridster;
	@Input() count;
	@Input() resizeEvent: EventEmitter<any>;
	resizeSub: Subscription;
	@Input() chartTypeChangeEvent: EventEmitter<any>;
	chartTypeChangeSub: Subscription;
	

	@ViewChild('cchart', { static: false }) cchart: GoogleChartComponent;
	currentUser = JSON.parse(localStorage.getItem("currentUser"));
	pieChart = {
		chartType: 'PieChart',
		dataTable: [],
		options: {
			title: '',
			height: 350,
			width: 420,
			chartArea: {
				height: '90%',
				width: '90%',
				legend: {
					alignment: 'middle',
					position: 'right'
				}
			}
		}
	};
	type: string = 'Weekly';
	greenhouse= [];
	message: any;
	noRecordFoundInUsageByAssetType=true;
	selectedValue = 'Weekly';
	filterType: any[] = [
	{ name: 'Weekly', value: 'Weekly' },
	{ name: 'Monthly', value: 'Monthly' },
	{ name: 'Yearly', value: 'Yearly' }
	];

	constructor(
		public deviceService: DeviceService,
		private spinner: NgxSpinnerService,
		private _notificationService: NotificationService,
		private changeDetector : ChangeDetectorRef,
		){
	}

	ngOnInit() {
		this.pieChart.options.width = (this.widget.properties.w > 0 ? parseInt((this.widget.properties.w - 40).toString()) : 200);
		this.pieChart.options.height = (this.widget.properties.h > 0 ? parseInt((this.widget.properties.h - 100).toString()) : 200);
		this.resizeSub = this.resizeEvent.subscribe((widget) => {
			if(widget.id == this.widget.id){
				this.widget = widget;
				this.changeChartType();
			}
		});

		this.chartTypeChangeSub = this.chartTypeChangeEvent.subscribe((widget) => {
			if(widget.id == this.widget.id){
				this.changeChartType();
			}
		});
		this.changeChartType();
		this.getDeviceTypeUsageChartData('w');
	}

	changeChartType(){
		this.pieChart.options.width = (this.widget.properties.w > 0 ? parseInt((this.widget.properties.w - 40).toString()) : 200);
		this.pieChart.options.height = (this.widget.properties.h > 0 ? parseInt((this.widget.properties.h - 100).toString()) : 200);
		if(this.pieChart.dataTable.length > 1 && this.cchart){
			let ccWrapper = this.cchart.wrapper;
			this.cchart.draw();
			ccWrapper.draw();
		}
		if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
			this.changeDetector.detectChanges();
		}
	}

	changeFilterAssetType(event) {
		let type = 'w';
		if (event.value === 'Weekly') {
			type = 'w';
		}
		else if (event.value === 'Monthly') {
			type = 'm';
		}
		else if (event.value === 'Yearly') {
			type = 'y';
		}

		this.type = type
		this.getDeviceTypeUsageChartData(this.type)
	}

	checkForZeroUtilization(array){
		if(array.filter(e => Number(e.utilizationPer) > 0).length>0){
			return false;
		}else{
			return true;
		}
	}

	getDeviceTypeUsageChartData(type) {
		this.spinner.show();
		var data = { frequency: type }
		this.pieChart.dataTable = []
		this.noRecordFoundInUsageByAssetType=true;
		this.deviceService.getDeviceTypeUsageChartData(data).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				if (response && response.data && this.checkForZeroUtilization(response.data)) {
					this.noRecordFoundInUsageByAssetType=true;
				}else{
					this.noRecordFoundInUsageByAssetType=false;
					let data = [];
					response.data = [
						{
							color: "yellow",
							name: "testType",
							utilizationPer: "23"
						},
						{
							color: "red",
							name: "testType1",
							utilizationPer: "50"
						},
						{
							color: "gray",
							name: "testType2",
							utilizationPer: "7"
						},
						{
							color: "green",
							name: "testType3",
							utilizationPer: "20"
						}
					]
					if (response.data.length) {
						data.push(['Task', 'Hours per Day']);
						response.data.forEach(element => {
							data.push([element.name, Number(element.utilizationPer)])
						});
					}
					this.pieChart.dataTable = data;
					this.message = response.message;
				}
				this.changeChartType();
				if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
					this.changeDetector.detectChanges();
				}
			}
			else {
				this.noRecordFoundInUsageByAssetType=true;
			}
		}, error => {
			this.noRecordFoundInUsageByAssetType=true;
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}

	ngOnDestroy() {
		this.resizeSub.unsubscribe();
		this.chartTypeChangeSub.unsubscribe();
	}
}
