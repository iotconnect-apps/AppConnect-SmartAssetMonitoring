import {  OnInit, OnDestroy, Component, Input, ViewEncapsulation, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { Notification, NotificationService, DashboardService } from 'app/services';
import {Subscription} from 'rxjs/Subscription'

@Component({
	selector: 'app-widget-counter-h',
	templateUrl: './widget-counter-h.component.html',
	styleUrls: ['./widget-counter-h.component.css']
})
export class WidgetCounterHComponent implements OnInit {
	@Input() widget;
	@Input() resizeEvent: EventEmitter<any>;
	resizeSub: Subscription;
	entitySelected: number;
	entityDetails: any = {};
	overviewstatics: any = {}
	overviewStaticsByEntity: any = [];
	slideConfig = {
		'slidesToShow': 4,
		'slidesToScroll': 1,
		'arrows': true,
		'margin': '30px',
		'centerMode': false,
		'infinite': false
	};

	constructor(
		private spinner: NgxSpinnerService,
		private _notificationService: NotificationService,
		private dashboardService : DashboardService
		){
	}

	ngOnInit() {
		this.resizeSub = this.resizeEvent.subscribe((widget) => {
		});
		this.getDashboardoverviewByEntity();
	}

	getEntityDetails(entityId, entityIndex: number) {
		this.spinner.show();
		this.dashboardService.getEntityDetails(entityId).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				this.entityDetails = response.data;
				this.entitySelected = entityIndex;
			}
			else {
				this._notificationService.add(new Notification('error', response.message));
			}
		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}

	getDashboardoverviewByEntity() {
		this.spinner.show();
		this.dashboardService.getDashboardoverviewByEntity().subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				this.overviewStaticsByEntity = response.data;
				let entity = this.overviewStaticsByEntity[0]
				if (entity.guid) {
					this.getEntityDetails(entity.guid,0);
				}
			}
		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}

	ngOnDestroy() {
		this.resizeSub.unsubscribe();
	}
}