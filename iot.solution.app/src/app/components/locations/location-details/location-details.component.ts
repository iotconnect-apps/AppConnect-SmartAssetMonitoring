import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DeleteDialogComponent, MessageDialogComponent } from '../..';
import * as moment from 'moment-timezone'
import { MessageAlertDataModel, DeleteAlertDataModel, AppConstant } from '../../../app.constants';
import { DeviceService, DashboardService, AlertsService, Notification, NotificationService, LocationService } from '../../../services';

@Component({
	selector: 'app-location-details',
	templateUrl: './location-details.component.html',
	styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

	@ViewChild('myFile', { static: false }) myFile: ElementRef;

	/**
	 * for general and zone
	 */
	zoneList = [];
	isEdit: boolean = false;
	editZoneGuid: string = "";
	searchParameters = {
		parentEntityGuid: '',
		pageNo: 0,
		pageSize: -1,
		searchText: '',
		orderBy: 'name asc'
	};
	respondShow: boolean = false;
	zoneModuleName: String;
	zoneObj: any = {};
	zoneForm: FormGroup;
	buttonName: String;
	handleImgInput: boolean = false;
	fileName: String;
	fileToUpload: any;
	currentImage: any;
	fileUrl: String;
	locationGuid: any;
	private messageAlertDataModel: MessageAlertDataModel;
	private deleteAlertDataModel: DeleteAlertDataModel;
	locationObj: any = {};
	type: string;
	typeinven: string;
	checkSubmitStatus: boolean;



	/**
	 * FOR Statistcs TAB
	 */
	defaultFilter = "Weekly";
	defaultFilterValue = "Weekly";
	assetUtilization: any = [];
	assetUtilizationNoDataFound = true;
	filterType: any[] = [
		{ name: 'Weekly', value: 'Weekly' },
		{ name: 'Monthly', value: 'Monthly' },
		{ name: 'Yearly', value: 'Yearly' }
	];

	/**
	 * FOR Assets TAB
	 */
	assetList = [];

	/**
	 * FOR Alerts TAB
	 */
	displayedColumns: string[] = ['message', 'deviceName', 'entityName', 'subEntityName', 'severity', 'eventDate'];

	/**
	 * chart value for company usage chart data
	 */
	columnArray: any = [];
	headFormate: any = {
		columns: this.columnArray,
		type: 'NumberFormat'
	};
	bgColor = '#fff';
	chartHeight = 400;
	chartWidth = '200%';

	companyUsageChartData = [];

	/**
	 * VARIABLES WHICH ARE USED IN NON-WORKING METHOD'S   
	 */
	topproduct = [];
	alerts = [];
	columnChartinvent = {
		chartType: "ColumnChart",
		dataTable: [],
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
			height: "400",
			chartArea: { height: '75%', width: '85%' },
			seriesType: 'bars',
			bar: { groupWidth: "25%" },
			colors: ['#5496d0'],
		}
	};
	columnChart = {
		chartType: "ColumnChart",
		dataTable: [],
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
			colors: ['#5496d0'],
		}
	};
	statisticObj: any = {}
	message: any;
	imgUrl: string;


	constructor(public location: Location, private spinner: NgxSpinnerService,
		private deviceService: DeviceService,
		private dashboardService: DashboardService,
		private alertsService: AlertsService,
		public dialog: MatDialog,
		private _notificationService: NotificationService,
		private activatedRoute: ActivatedRoute,
		public _appConstant: AppConstant,
		public _service: LocationService,

	) {
		this.createFormGroup();

		this.activatedRoute.params.subscribe(params => {
			if (params.locationGuid != null) {
				this.locationGuid = params.locationGuid;
				this.zoneForm.get("parentEntityGuid").setValue(this.locationGuid);
				this.getLocationDetails(params.locationGuid);

			}
		});
	}

	ngOnInit() {
		this.locationObj = { guid: '' };
		let type = 'w';
		this.type = type
		let typeinven = 'w';
		this.typeinven = typeinven
		let currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.imgUrl = this._notificationService.apiBaseUrl;
	}

	/**
	* sort data 
	* @param sort 
	*/
	setOrder(sort: any) {
		if (!sort.active || sort.direction === '') {
			return;
		}
		let orderBy = sort.active + ' ' + sort.direction;
		this.getAlertList(this.locationGuid, orderBy);
	}

	/**
   * Get device type usage chart data
   * */
	getDeviceTypeUsageChartData(type, shoSpinner) {
		if (shoSpinner) {
			this.spinner.show();
		}
		var data = { frequency: type, entityGuid: this.locationGuid }
		this.deviceService.getDeviceTypeUsageChartData(data).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				let data = [];

				this.companyUsageChartData = response.data;

				this.message = response.message;
			}
			else {
				if (response.message != "No usage found" && response.message != "No data found") {
					this._notificationService.add(new Notification('error', response.message));
				}
			}
		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}

	/**
	* Change Filter Asset Type
	* @param event
	*/
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
		this.getDeviceTypeUsageChartData(this.type, true)
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
			type = 'y';
		}

		this.type = type
		this.getCompanyUsageChartData(this.type, true)
	}

	/**
	 * Get company asset usage chart data
	 * */
	getCompanyUsageChartData(type, showSpinner) {
		if (showSpinner) {
			this.spinner.show();
		}
		var data = { frequency: type, entityGuid: this.locationGuid }
		this.deviceService.getCompanyUsageChartData(data).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				this.assetUtilization = response.data[0].utilizationPer;
				if (this.assetUtilization == 0) {
					this.assetUtilizationNoDataFound = true;
				} else {
					this.assetUtilizationNoDataFound = false;
				}
				// this.companyUsageChartData=response.data
				this.message = response.message
			}
			else {
				this.assetUtilizationNoDataFound = true;
			}
		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}
	/**
	 * to get the list of assets
	 */
	getAssetList(locationGuid: any, responseMessage?) {

		let parameters = {
			pageNumber: 0,
			pageSize: -1,
			searchText: '',
			sortBy: 'name desc',
			deviceGuid: '',
			entityGuid: '',
			parentEntityGuid: locationGuid,
		};
		this.deviceService.getDeviceList(parameters).subscribe(response => {
			if (responseMessage) {
				this.spinner.hide();
				this._notificationService.add(new Notification("success", responseMessage));
			}
			if (response.isSuccess) {
				this.assetList = response.data.items;
			} else {
				this._notificationService.add(new Notification('error', response.message));
			}
			if (!responseMessage)
				this.getAlertList(locationGuid);

		}, error => {
			this.getAlertList(locationGuid);
			this._notificationService.add(new Notification('error', error));
		});
	}


	/**
	 * create's a form for adding a new zone or updating the previous one
	 */
	createFormGroup() {
		this.zoneForm = new FormGroup({
			parentEntityGuid: new FormControl(null),
			name: new FormControl('', [Validators.required]),
			description: new FormControl(''),
			isactive: new FormControl(''),
			imageFile: new FormControl(''),
		});
	}

	/**
	 * The following method is used to call the pop-up confirmation model for the deletion of the zone. 
	 * @param zoneModel model of the Zone 
	 */
	deleteModel(zoneModel: any) {
		this.deleteAlertDataModel = {
			title: "Delete Zone",
			message: this._appConstant.msgConfirm.replace('modulename', "Zone"),
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
				this.deleteZone(zoneModel.guid);
			}
		});
	}

	/**
	 *  This method is used to remove the zone from the database
	 * @param guid The guid of the corresponding zone
	 */
	deleteZone(guid) {
		this.spinner.show();
		this._service.deleteLocation(guid).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				this._notificationService.add(new Notification('success', this._appConstant.msgDeleted.replace("modulename", "Zone")));

				this.getZoneList(this.locationGuid, true);

			}
			else {
				if (response.message) {
					this._notificationService.add(new Notification('error', response.message));
				}
			}

		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}

	/**
	 * This method is used to create a new zone as well as to update the previous zone.
	 */
	manageZone() {
		this.checkSubmitStatus = true;
		var data = {
			"parentEntityGuid": this.locationGuid,
			"name": this.zoneForm.value.name,
			"description": this.zoneForm.value.description,
			"isactive": true,
			"countryGuid": this.locationObj['countryGuid'],
			"stateGuid": this.locationObj['stateGuid'],
			"city": this.locationObj['city'],
			"zipcode": this.locationObj['zipcode'],
			"address": this.locationObj['address'],
			"latitude": this.locationObj['latitude'],
			"longitude": this.locationObj['longitude'],
		}
		if (this.fileToUpload) {
			data["imageFile"] = this.fileToUpload;
		}

		if (this.isEdit) {
			data['guid'] = this.editZoneGuid;
		}

		this.zoneForm.get('isactive').setValue(true);

		if (this.zoneForm.status === "VALID") {
			this.spinner.show();
			this._service.addLocation(data).subscribe(response => {
				this.spinner.hide();
				this.getZoneList(this.locationGuid, true);

				if (response.isSuccess === true) {
					this.respondShow = false;
					this.handleImgInput = false;
					if (this.isEdit) {
						this._notificationService.add(new Notification('success', "Zone updated successfully."));

					} else {
						this._notificationService.add(new Notification('success', "Zone created successfully."));
					}
				} else {
					this._notificationService.add(new Notification('error', response.message));

				}
				this.checkSubmitStatus = false;

			}, error => {
				this._notificationService.add(new Notification('error', error));

			});
		}

	}

	/**
	 * This method is used to open the side model to add a new zone.  
	 */
	respond() {

		this.zoneForm.reset();
		this.zoneForm.get("parentEntityGuid").setValue(this.locationGuid);
		this.zoneObj['name'] = "";
		this.zoneObj['description'] = "";
		this.zoneObj['guid'] = "";
		this.zoneObj['image'] = "";
		this.currentImage = "";
		this.fileName = "";
		this.fileToUpload = null;
		this.respondShow = true;
		this.isEdit = false;
		this.editZoneGuid = "";
		this.clearZoneObject();
		this.zoneForm.reset();
		this.zoneForm.get("parentEntityGuid").setValue(this.locationGuid);
		this.zoneModuleName = "Add Zone";
		this.buttonName = "Add";
	}

	/**
	 * This method is use to close the side model
	 */
	closeRepond() {
		this.respondShow = false;
		this.checkSubmitStatus = false;
	}

	/**
	 * METHOD NOT IS USE AT THIS MOMENT
	 * @param entityId 
	 * @param type 
	 */

	/**
	 * This method can be use to get the information of the location
	 * @param locationGuid guid for the location itself
	 */
	getLocationDetails(locationGuid) {
		this.locationObj = {};
		this.spinner.show();
		this._service.getLocatinDetails(locationGuid).subscribe(response => {

			this.getZoneList(locationGuid, false);

			if (response.isSuccess === true) {
				this.locationObj = response.data;
				this.locationObj.guid = this.locationObj.guid.toUpperCase()
			} else {
				this._notificationService.add(new Notification("error", response.message));
			}
			this.getAssetList(locationGuid);
		}, error => {
			this.getZoneList(locationGuid, false);
			this.getAssetList(locationGuid);
			this._notificationService.add(new Notification("error", error));
		});
	}

	/**
	 * to  get the Statistcs based on location
	 * @param locationGuid 
	 */
	getEntityStatistics(locationGuid) {
		this.spinner.show();
		this._service.getentitydetail(locationGuid).subscribe(response => {

			if (response.isSuccess === true) {
				this.statisticObj = response.data;
			}
			this.getCompanyUsageChartData('w', false);
			this.getDeviceTypeUsageChartData('w', false);
		}, error => {
			this.getCompanyUsageChartData('w', false);
			this.getDeviceTypeUsageChartData('w', false);
		});
	}


	/**
	 * to get the list of alerts
	 * @param locationGuid 
	 */
	getAlertList(locationGuid: any, orderBy?: any) {
		this.alerts = [];
		let parameters = {
			pageNo: 0,
			pageSize: 10,
			searchText: '',
			orderBy: orderBy ? orderBy : 'eventDate desc',
			deviceGuid: '',
			entityGuid: '',
			parentEntityGuid: locationGuid
		};
		this.spinner.show();
		this.alertsService.getAlerts(parameters).subscribe(response => {
			if (response.isSuccess === true) {
				if (response.data.count) {
					this.alerts = response.data.items;
				}
			}
			else {
				this.alerts = [];
				this._notificationService.add(new Notification('error', response.message));
			}
			this.getEntityStatistics(locationGuid);

		}, error => {
			this.alerts = [];
			this.getEntityStatistics(locationGuid);
			this._notificationService.add(new Notification('error', error));
		});
	}


	/**
	 * This method can be used to get the information of the zone and fil the side model to edit that information.
	 * @param zoneId The Guid of the zone
	 */
	getZoneDetails(zoneId) {
		this.zoneModuleName = "Edit Zone";
		this.buttonName = "Update";
		this.isEdit = true;
		this.editZoneGuid = zoneId;
		this.clearZoneObject();
		this.spinner.show();
		this._service.getLocatinDetails(zoneId).subscribe(response => {
			if (response.isSuccess) {
				let zoneDetail = response.data;
				this.zoneObj['name'] = zoneDetail.name;
				this.zoneObj['description'] = zoneDetail.description;
				this.zoneObj['guid'] = zoneDetail.guid;
				if (zoneDetail.image) {
					this.zoneObj['image'] = zoneDetail.image;
					this.currentImage = zoneDetail.image;
				}

				this.respondShow = true;
			} else {
				this._notificationService.add(new Notification('error', response.message));
			}
			this.spinner.hide();

		})
	}

	clearZoneObject() {
		this.zoneObj = {};
	}

	/**
	 * This method can be used to get the list of the zone.
	 * @param locationGuid The guid of the Location 
	 */
	getZoneList(locationGuid, useSpinner) {
		if (useSpinner) {
			this.spinner.show();
		}
		this.searchParameters['parentEntityGuid'] = locationGuid;
		this._service.getZoneList(this.searchParameters).subscribe(response => {
			if (response.isSuccess === true) {
				this.zoneList = response.data.items;
				if (useSpinner) {
					this.spinner.hide();
				}
			}
			else {
				if (response.message) {
					if (useSpinner) {
						this.spinner.hide();
					}
					this._notificationService.add(new Notification('error', response.message));
				}
				this.zoneList = [];
			}

		}, error => {
			if (useSpinner) {
				this.spinner.hide();
			}
			this._notificationService.add(new Notification('error', error));
		});
	}

	/**
	 * This method can be used to remove the image of the zone called from deleteImgModel()
	 */
	deleteZoneImg() {
		this.spinner.show();
		this.alertsService.removeImage(this.zoneObj.guid).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess === true) {
				this.zoneObj['image'] = null;
				this.zoneForm.get('imageFile').setValue(null);
				this.fileToUpload = false;
				this.currentImage = '';
				this.fileName = '';
				this.getZoneList(this.locationGuid, true);
				this._notificationService.add(new Notification('success', this._appConstant.msgDeleted.replace("modulename", "Zone Image")));
			} else {
				this._notificationService.add(new Notification('error', response.message));
			}
		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
		});
	}

	/**
	 * This method is the confirmation model to remove the zone image called from the imageRemove().  
	 */
	deleteImgModel() {
		this.deleteAlertDataModel = {
			title: "Delete Image",
			message: this._appConstant.msgConfirm.replace('modulename', "Zone Image"),
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
				this.deleteZoneImg();
			}
		});
	}

	/**
	 * This method is used to remove the image.
		 If the image is saved in the backend it will remove from backend else it will remove from the variable.
	 */
	imageRemove() {
		this.myFile.nativeElement.value = "";
		if (this.zoneObj['image'] == this.currentImage) {
			this.zoneForm.get('imageFile').setValue('');
			if (!this.handleImgInput) {
				this.handleImgInput = false;
				this.deleteImgModel();
			}
			else {
				this.handleImgInput = false;
			}
		}
		else {
			if (this.currentImage) {
				this.spinner.hide();
				this.zoneObj['image'] = this.currentImage;
				this.fileToUpload = false;
				this.fileName = '';
				this.handleImgInput = false;
			}
			else {
				this.spinner.hide();
				this.zoneObj['image'] = null;
				this.zoneForm.get('imageFile').setValue('');
				this.fileToUpload = false;
				this.fileName = '';
				this.handleImgInput = false;
			}
		}
	}


	/**
	 * This method call upon when the user wants's to upload the image or change the existing image. 
	 * @param event it's the event object having image data
	 */
	handleImageInput(event) {
		debugger
		this.handleImgInput = true;
		let files = event.target.files;
		var that = this;
		if (files.length) {
			let fileType = files.item(0).name.split('.');
			let imagesTypes = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG'];
			if (imagesTypes.indexOf(fileType[fileType.length - 1]) !== -1) {
				this.fileName = files.item(0).name;
				this.fileToUpload = files.item(0);
			} else {
				this.imageRemove();
				this.messageAlertDataModel = {
					title: "Zone Image",
					message: "Invalid Image Type.",
					message2: "Upload .jpg, .jpeg, .png Image Only.",
					okButtonName: "OK",
				};
				const dialogRef = this.dialog.open(MessageDialogComponent, {
					width: '400px',
					height: 'auto',
					data: this.messageAlertDataModel,
					disableClose: false
				});

			}
		}

		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.onload = (innerEvent: any) => {
				this.fileUrl = innerEvent.target.result;
				that.zoneObj.image = this.fileUrl;

				let img = new Image();
				img.src = window.URL.createObjectURL(event.target.files[0]);
				img.onload = () => {

					const width = img.naturalWidth;
					const height = img.naturalHeight;
					var stype = event.target.files[0].type.toString();
					window.URL.revokeObjectURL(img.src);

					if (this.fileToUpload.size > 2000000) {
						this._notificationService.add(new Notification('info', "Maximum Supported Size: 2 MBs."));
						this.fileToUpload = null;
						this.zoneForm.patchValue({
							imageFile: null,
						});
						this.fileName = "";
						this.myFile.nativeElement.value = "";
						that.zoneObj.image = null;
						this.spinner.hide();
						return;
					}
					if (((width * height) > 1048576)) {
						this._notificationService.add(new Notification('info', "Image dimensions should be min 240*240 and Max 1024*1024."));
						this.fileToUpload = null;
						this.zoneForm.patchValue({
							imageFile: null,
						});
						this.fileName = "";
						this.myFile.nativeElement.value = "";
						that.zoneObj.image = null;
						this.spinner.hide();
						return;
					}
					else if ((width * height) < 57600) {
						this._notificationService.add(new Notification('info', "Image dimensions should be min 240*240 and Max 1024*1024."));
						this.fileToUpload = null;
						this.zoneForm.patchValue({
							imageFile: null,
						});
						this.fileName = "";
						this.myFile.nativeElement.value = "";
						that.zoneObj.image = null;
						this.spinner.hide();
						return;
					}
					else {
						var data = [];
						data.push("image/jpg");
						data.push("image/jpeg");
						data.push("image/png");
						if (data.includes(stype)) {
							this.zoneForm.patchValue({
								imageFile: this.fileToUpload,
							});
						}
						else {
							this.zoneForm.patchValue({
								imageFile: null,
							});
							this.fileName = "";
							this.myFile.nativeElement.value = "";
							that.zoneObj.image = null;
							this.spinner.hide();
							return;
						}
					}

				}


			}
		}
	}


	/**
	 * to open the confirmation poup for status chnage
	 * @param asset 
	 */
	changeAssetStatusModel(asset: any) {
		this.deleteAlertDataModel = {
			title: "Change Status",
			message: this._appConstant.msgStatusConfirm.replace('statusname', "change status of").replace('fieldname', asset.name),
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
				this.changeAssetStatus(asset);
			}
		});
	}

	/**
	 * to change the status of asset
	 * @param asset 
	 */
	changeAssetStatus(asset: any) {
		this.spinner.show();
		this.deviceService.changedeviceStatus(asset.guid, asset.isActive).subscribe(response => {

			if (response.isSuccess) {

				this.getAssetList(this.locationGuid, "Asset's status change");
			} else {
				this.spinner.hide();
				this._notificationService.add(new Notification("error", response.message));
			}
		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification("error", error));

		})
	}
}
