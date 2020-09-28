import { Component, OnInit } from '@angular/core';
import { DeleteAlertDataModel, AppConstant } from '../../../app.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DeviceService, NotificationService, Notification, DashboardService, LocationService } from '../../../services';
import { DeleteDialogComponent } from '../..';
import { ApiConfigService } from "../../../services/api-config/api-config.service";
@Component({
	selector: 'app-location-list',
	templateUrl: './location-list.component.html',
	styleUrls: ['./location-list.component.css']
})
export class LocationListComponent implements OnInit {

	searchParameters = {
		pageNo: 0,
		pageSize: 10,
		searchText: '',
		orderBy: 'name asc'
	};
	locationList = [];
	deleteAlertDataModel: DeleteAlertDataModel;
	isSearch = false;
	imageBaseUrl: string;
	mediaUrl: any;


	/**
	 * VARIABLES WHICH ARE USED IN NON-WORKING METHOD'S   
	 */
	isCollapsed = false;
	viewMoreValues: any;
	

	constructor(
		private spinner: NgxSpinnerService,
		private router: Router,
		public dialog: MatDialog,
		private deviceService: DeviceService,
		private _notificationService: NotificationService,
		public _appConstant: AppConstant,
		public _service: LocationService
		) {
			this.mediaUrl = this._notificationService.apiBaseUrl;
	}

	ngOnInit() {
		this.getLocationlist();
		this.imageBaseUrl = this._notificationService.apiBaseUrl;
		
	}

	/**
	 * This method is used to get the list of all the location
	 */
	getLocationlist() {
		this.locationList = [];
		this.spinner.show();
		this._service.getLocationlist(this.searchParameters).subscribe(response => {
			
			if (response.isSuccess === true) {
				this.locationList = response.data.items;
			}
			else {
				this.locationList = [];
				response.message ? response.message : response.message = "No results found";
				this._notificationService.add(new Notification('error', response.message));
			}
			this.spinner.hide();
		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}

	/**
	 * This method is used to filter the Location list
	 * @param filterText the value by which user want's to filter 
	 */
	searchTextCallback(filterText) {
		this.searchParameters.searchText = filterText;
		this.searchParameters.pageNo = 0;
		this.getLocationlist();
		this.isSearch = true;
	}

	/**
	 * This method will open a confirmation pop-up for the removal of the location. 
	 * @param entityModel model with location data which user want to remove 
	 */
	deleteModel(entityModel: any) {
		this.deleteAlertDataModel = {
			title: "Delete Location",
			message: this._appConstant.msgConfirm.replace('modulename', "Location"),
			okButtonName: "Confirm",
			cancelButtonName: "Cancel",
		};
		const dialogRef = this.dialog.open(DeleteDialogComponent, {
			width: '400px',
			height: 'auto',
			data: this.deleteAlertDataModel,
			disableClose: false
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.deleteLocation(entityModel.guid);
			}
		});
	}
	
	/**
	 * METHOD NOT IS USE AT THIS MOMENT
	 * @param index 
	 */
	viewMoreClick(index) {
		this.isCollapsed = !this.isCollapsed
		this.viewMoreValues = index;
	}

	/**
	 * This method is used to remove the location from the DB called from deleteModel()
	 * @param guid uniqueId of the location
	 */
	deleteLocation(guid) {
		this.spinner.show();
		this._service.deleteLocation(guid).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				this._notificationService.add(new Notification('success', this._appConstant.msgDeleted.replace("modulename", "Location")));
				this.getLocationlist();

			}
			else {
				this._notificationService.add(new Notification('error', response.message));
			}

		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}

	/**
	 * This method is used to open a confirmation pop-up to alter the status of the location
	 * @param id Unique guid of the location
	 * @param isActive Current status of the location
	 * @param name Name of the location
	 */
	activeInactiveLocation(id: string, isActive: boolean, name: string) {
		var status = isActive == false ? this._appConstant.activeStatus : this._appConstant.inactiveStatus;
		var mapObj = {
			statusname: status,
			fieldname: name,
			modulename: "Location"
		};
		this.deleteAlertDataModel = {
			title: "Status",
			message: this._appConstant.msgStatusConfirm.replace(/statusname|fieldname/gi, function (matched) {
				return mapObj[matched];
			}),
			okButtonName: "Confirm",
			cancelButtonName: "Cancel",
		};
		const dialogRef = this.dialog.open(DeleteDialogComponent, {
			width: '400px',
			height: 'auto',
			data: this.deleteAlertDataModel,
			disableClose: false
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.changeLocationStatus(id, isActive);

			}
		});
	}

	/**
	 * This method is used to alter the location status called from activeInactiveLocation
	 * @param id Unique guid of the location
	 * @param isActive Current State of the location
	 */
	changeLocationStatus(id, isActive) {
		this.spinner.show();
		this._service.changeLocationStatus(id, isActive).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				this._notificationService.add(new Notification('success', this._appConstant.msgStatusChange.replace("modulename", "Location")));
				this.getLocationlist();
			}
			else {
				this._notificationService.add(new Notification('error', response.message));
			}

		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}
}
