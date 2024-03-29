import {ChangeDetectorRef, ViewRef,  OnInit, OnDestroy, Component, Input, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { Notification, NotificationService, DashboardService, DynamicDashboardService } from 'app/services';
import {Subscription} from 'rxjs/Subscription'
import { Observable } from 'rxjs';

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

	/*All Observables*/
	@ViewChild('refrigeratorCarousel', { static: false }) slickModal;
	sideBarSubscription: Subscription;
	/*All Observables*/

	constructor(
		private spinner: NgxSpinnerService,
		private _notificationService: NotificationService,
		private dashboardService : DashboardService,
		private changeDetector : ChangeDetectorRef,
		public dynamicDashboardService: DynamicDashboardService,
		){
	}

	ngOnInit() {
		this.resizeSub = this.resizeEvent.subscribe((widget) => {
		});
		this.getDashboardoverviewByEntity();

		this.sideBarSubscription = this.dynamicDashboardService.isToggleSidebarObs.subscribe((toggle) => {
			let cond = false;
			Observable.interval(1200)
			.takeWhile(() => !cond)
			.subscribe(i => {
				this.slickModal.unslick();
				this.slickModal.initSlick(this.slickModal);
				cond = true;
				if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
					this.changeDetector.detectChanges();
				}
			});
		})
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
			if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
				this.changeDetector.detectChanges();
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
			this.slickModal.unslick();
			this.slickModal.initSlick(this.slickModal);
			if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
				this.changeDetector.detectChanges();
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