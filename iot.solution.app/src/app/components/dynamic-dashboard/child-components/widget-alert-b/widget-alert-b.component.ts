import { ChangeDetectorRef, ViewRef , OnInit, Component, Input, ViewEncapsulation, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone'
import { NgxSpinnerService } from 'ngx-spinner'
import { Notification, NotificationService ,DeviceService } from 'app/services';
import {Subscription} from 'rxjs/Subscription';

@Component({
	selector: 'app-widget-alert-b',
	templateUrl: './widget-alert-b.component.html',
	styleUrls: ['./widget-alert-b.component.css']
})
export class WidgetAlertBComponent implements OnInit {
	@Input() widget;
	@Input() resizeEvent: EventEmitter<any>;
	@Input() alertLimitchangeEvent: EventEmitter<any>;
	resizeSub: Subscription;
	limitChangeSub: Subscription;
	maintenanceList: any = [];

	constructor(
		private spinner: NgxSpinnerService,
		private _notificationService: NotificationService,
		private changeDetector : ChangeDetectorRef,
		private deviceService : DeviceService
	){

	}

	ngOnInit() {
		this.resizeSub = this.resizeEvent.subscribe((widget) => {
		});
		this.limitChangeSub = this.alertLimitchangeEvent.subscribe((limit) => {
			this.getMaintenanceList();
		});
		this.getMaintenanceList();
	}

	getMaintenanceList() {
		let currentdatetime = moment().format('YYYY-MM-DD[T]HH:mm:ss');
    	let timezone = moment().utcOffset();
		this.spinner.show();
		this.deviceService.getdevicemaintenance(currentdatetime, timezone).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true && response.data) {
				this.maintenanceList = response.data;
			}
			else {
				this.maintenanceList = [];
			}
			if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
				this.changeDetector.detectChanges();
			}
		}, error => {
			this.spinner.hide();
			this.maintenanceList = [];
			this._notificationService.handleResponse(error,"error");
		});
	}

	ngOnDestroy() {
		this.resizeSub.unsubscribe();
		this.limitChangeSub.unsubscribe();
	}

}
