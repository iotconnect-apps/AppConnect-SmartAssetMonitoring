import { ChangeDetectorRef, ViewRef , OnInit, Component, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { Notification, NotificationService, DeviceService } from 'app/services';
import {Subscription} from 'rxjs/Subscription';

@Component({
	selector: 'app-widget-chart-a',
	templateUrl: './widget-chart-a.component.html',
	styleUrls: ['./widget-chart-a.component.css']
})
export class WidgetChartAComponent implements OnInit,OnDestroy {
	@Input() widget;
	@Input() gridster;
	@Input() resizeEvent: EventEmitter<any>;
	resizeSub: Subscription;
	@Input() chartTypeChangeEvent: EventEmitter<any>;
	chartTypeChangeSub: Subscription;
	assetUtilization: any = [];
	assetTypeUtilization: any = [];
	message: any;
	filterType: any[] = [
	{ name: 'Weekly', value: 'Weekly' },
	{ name: 'Monthly', value: 'Monthly' },
	{ name: 'Yearly', value: 'Yearly' }
	];
	type: string = 'Weekly';
	chartHeight : number = 220;
	selected = 'Weekly';
	selectedValue = 'Weekly';
	colors = [];

	currentUser = JSON.parse(localStorage.getItem("currentUser"));
	constructor(
		public deviceService: DeviceService,
		private spinner: NgxSpinnerService,
		private _notificationService: NotificationService,
		private changeDetector : ChangeDetectorRef,
		){
	}

	ngOnInit() {
		this.resizeSub = this.resizeEvent.subscribe((widget) => {
			if(widget.id == this.widget.id){
				this.widget = widget;
				this.chartHeight = parseInt((this.widget.properties.h - 87).toString());
				this.changeChartType();
			}
		});

		this.chartTypeChangeSub = this.chartTypeChangeEvent.subscribe((widget) => {
			if(widget.id == this.widget.id){
				this.changeChartType();
				this.chartHeight = parseInt((this.widget.properties.h - 87).toString());
			}
		});
		this.chartHeight = parseInt((this.widget.properties.h - 87).toString());
		this.changeChartType();
		this.getCompanyUsageChartData('w');
	}

	changeChartType(){
		if(this.widget.widgetProperty.chartColor.length > 0){
			this.colors = [];
			for (var i = 0; i <= (this.widget.widgetProperty.chartColor.length - 1); i++) {
				this.colors.push(this.widget.widgetProperty.chartColor[i].color);
			}
		}
		if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
			this.changeDetector.detectChanges();
		}
	}

	getCompanyUsageChartData(type) {
		this.spinner.show();
		var data = { frequency: type }
		this.deviceService.getCompanyUsageChartData(data).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				this.assetUtilization = response.data[0].utilizationPer;
				this.message = response.message
			}

		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}

	changeFilterAsset(event) {
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
		this.getCompanyUsageChartData(this.type)
	}

	ngOnDestroy() {
		this.resizeSub.unsubscribe();
		this.chartTypeChangeSub.unsubscribe();
	}
}
