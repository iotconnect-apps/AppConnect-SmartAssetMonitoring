import * as moment from 'moment-timezone'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { Router } from '@angular/router'
import { AppConstant, DeleteAlertDataModel } from "../../app.constants";
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material'
import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';
import { locationobj } from './dashboard-model';
import { DashboardService, Notification, NotificationService, DeviceService, AlertsService } from '../../services';

/*Dynamic Dashboard Code*/
import {ChangeDetectorRef , EventEmitter, ViewChild} from '@angular/core';
import { DynamicDashboardService } from 'app/services';
import {DisplayGrid, CompactType, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterPush, GridType, GridsterComponentInterface, GridsterItemComponentInterface} from 'angular-gridster2';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
/*Dynamic Dashboard Code*/

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit,OnDestroy {

	selected = 'Weekly';
	selectedValue = 'Weekly';

	slideConfig = {
		'slidesToShow': 4,
		'slidesToScroll': 1,
		'arrows': true,
		'margin': '30px',
		'centerMode': false,
		'infinite': false
	};
	public alerts: any = [];
	upcomingMaintenance: any = [];
	noRecordFoundInUsageByAssetType=true;

	filterType: any[] = [
	{ name: 'Weekly', value: 'Weekly' },
	{ name: 'Monthly', value: 'Monthly' },
	{ name: 'Yearly', value: 'Yearly' }
	];
	assetUtilization: any = [];
	assetTypeUtilization: any = [];
	public pieChart = {
		chartType: 'PieChart',
		dataTable: null,
		//firstRowIsData: true,
		options: {
			'title': '',
			height: '350',
			width: '100%',
			chartArea: {
				height: '90%',
				width: '90%',
				legend: {
					alignment: 'middle',
					position: 'right'
				}
			}
		},
	};

	overviewstatics: any = {}
	overviewStaticsByEntity: any = [];
	entityDetails: any = {};
	locationobj = new locationobj();
	lat = 32.897480;
	lng = -97.040443;
	mediaUrl = "";
	locationList: any = [];
	isShowLeftMenu = true;
	isSearch = false;
	mapview = true;
	totalAlerts: any;
	totalFacilities: any;
	totalZones: any;
	totalIndoorZones: any;
	totalOutdoorZones: any;

	deleteAlertDataModel: DeleteAlertDataModel;
	searchParameters = {
		pageNumber: 0,
		pageNo: 0,
		pageSize: 10,
		searchText: '',
		sortBy: 'uniqueId asc'
	};
	ChartHead = ['Date/Time'];
	chartData = [];
	datadevice: any = [];
	columnArray: any = [];
	headFormate: any = {
		columns: this.columnArray,
		type: 'NumberFormat'
	};
	bgColor = '#fff';
	chartHeight = 320;
	chartWidth = '100%';
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	message: any;
	type: any;

	entitySelected: number;

	/*Dynamic Dashboard Code*/
	@ViewChild('gridster',{static:false}) gridster;
	isDynamicDashboard : boolean = true;
	options: GridsterConfig;
	dashboardWidgets: Array<any> = [];
	dashboardList = [];
	dashboardData = {
		id : '',
		index : 0,
		dashboardName : '',
		isDefault : false,
		widgets : []
	};
	resizeEvent: EventEmitter<any> = new EventEmitter<any>();
	alertLimitchangeEvent: EventEmitter<any> = new EventEmitter<any>();
	chartTypeChangeEvent: EventEmitter<any> = new EventEmitter<any>();
	zoomChangeEvent: EventEmitter<any> = new EventEmitter<any>();
	telemetryDeviceChangeEvent: EventEmitter<any> = new EventEmitter<any>();
	telemetryAttributeChangeEvent: EventEmitter<any> = new EventEmitter<any>();
	sideBarSubscription : Subscription;
	deviceData: any = [];
	/*Dynamic Dashboard Code*/

	constructor(
		private router: Router,
		private spinner: NgxSpinnerService,
		private dashboardService: DashboardService,
		private _notificationService: NotificationService,
		public _appConstant: AppConstant,
		public dialog: MatDialog,
		public _service: AlertsService,
		private deviceService: DeviceService,
		public dynamicDashboardService: DynamicDashboardService,
		private changeDetector: ChangeDetectorRef,

		) {
		this.mediaUrl = this._notificationService.apiBaseUrl;
		/*Dynamic Dashboard Code*/
		this.sideBarSubscription = this.dynamicDashboardService.isToggleSidebarObs.subscribe((toggle) => {
			console.log("Sidebar clicked");
			if(this.isDynamicDashboard && this.dashboardList.length > 0){
	            /*this.spinner.show();
	            this.changedOptions();
				let cond = false;
				Observable.interval(700)
	            .takeWhile(() => !cond)
	            .subscribe(i => {
					console.log("Grid Responsive");
					cond = true;
					this.checkResponsiveness();
					this.spinner.hide();
				});*/
			}
		})
		/*Dynamic Dashboard Code*/
	}

	ngOnInit() {
		this.getDashbourdCount();
		this.getAssetsList();
	    this.options = {
	    	gridType: GridType.Fixed,
	    	displayGrid: DisplayGrid.Always,
	    	initCallback: this.gridInit.bind(this),
	    	itemResizeCallback: this.itemResize.bind(this),
	    	fixedColWidth: 20,
	    	fixedRowHeight: 20,
	    	keepFixedHeightInMobile: false,
	    	keepFixedWidthInMobile: false,
	    	mobileBreakpoint: 640,
	    	pushItems: false,
	    	draggable: {
	    		enabled: false
	    	},
	    	resizable: {
	    		enabled: false
	    	},
	    	enableEmptyCellClick: false,
	    	enableEmptyCellContextMenu: false,
	    	enableEmptyCellDrop: false,
	    	enableEmptyCellDrag: false,
	    	enableOccupiedCellDrop: false,
	    	emptyCellDragMaxCols: 50,
	    	emptyCellDragMaxRows: 50,

	    	minCols: 60,
	    	maxCols: 192,
	    	minRows: 60,
	    	maxRows: 375,
	    	setGridSize: true,
	    	swap: true,
	    	swapWhileDragging: false,
	    	compactType: CompactType.None,
	    	margin : 0,
	    	outerMargin : true,
	    	outerMarginTop : null,
	    	outerMarginRight : null,
	    	outerMarginBottom : null,
	    	outerMarginLeft : null,
	    };
	    /*Dynamic Dashboard Code*/
	}

	ngOnDestroy(): void {
		this.sideBarSubscription.unsubscribe();
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
		this.getCompanyUsageChartData(this.type)
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
		this.getDeviceTypeUsageChartData(this.type)
  	}

	/**
	* Get company asset usage chart data
	* */
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

	/**
	* Get device type usage chart data
	* */
	getDeviceTypeUsageChartData(type) {
	   	this.spinner.show();
	   	var data = { frequency: type }
	   	this.deviceService.getDeviceTypeUsageChartData(data).subscribe(response => {
	   		this.spinner.hide();
	   		if (response.isSuccess === true) {
	   			if (response && response.data && this.checkForZeroUtilization(response.data)) {
	   				this.noRecordFoundInUsageByAssetType=true;
	   			}else{
	   				this.noRecordFoundInUsageByAssetType=false;

	   				let data = [];
	   				if (response.data.length) {
	   					data.push(['Task', 'Hours per Day']);
	   					response.data.forEach(element => {
	   						data.push([element.name, Number(element.utilizationPer)])
	   					});
	   				}
	   				this.pieChart = {
	   					chartType: 'PieChart',
	   					dataTable: data,
	   					//firstRowIsData: true,
	   					options: {
	   						'title': '',
	   						height: '350',
	   						width: '100%',
	   						chartArea: {
	   							height: '90%',
	   							width: '90%',
	   							legend: {
	   								alignment: 'middle',
	   								position: 'right'
	   							}
	   						}
	   					},
	   				};
	   				this.message = response.message;
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

	/**
	* check for utilzion
	*/
	checkForZeroUtilization(array){
	   	if(array.filter(e => Number(e.utilizationPer) > 0).length>0)
	   	{
	   		return false;
	   	}else{
	   		return true;
	   	}
   	}

	/**
	* Get Alert List
	* */
	getAlertList() {
	  	let parameters = {
	  		pageNo: 0,
	  		pageSize: 10,
	  		searchText: '',
	  		orderBy: 'eventDate desc',
	  		deviceGuid: '',
	  		entityGuid: '',
	  		parentEntityGuid: ""
	  	};
	  	this.spinner.show();
	  	this._service.getAlerts(parameters).subscribe(response => {
	  		this.spinner.hide();
	  		if (response.isSuccess === true) {
	  			if (response.data.count) {
	  				this.alerts = response.data.items;
	  			}

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
	* Convert To float
	* @param value
	* */
	convertToFloat(value) {
  		return parseFloat(value)
  	}
  	
	/**
	* Get Timezone
	* */
	getTimeZone() {
		return /\((.*)\)/.exec(new Date().toString())[1];
	}

	/**
	* Get count of variables for Dashboard
	* */
	getDashbourdCount() {
    	this.spinner.show();
    	this.dashboardService.getDashboardoverview().subscribe(response => {
    		if (response.isSuccess === true) {
    			this.overviewstatics = response.data;
    		}
    		else {
    			this._notificationService.add(new Notification('error', response.message));
    		}
    		this.changeDetector.detectChanges();
    	}, error => {
    		this.spinner.hide();
    		this._notificationService.add(new Notification('error', error));
    	});
    }

	/**
	* Get count of variables for Dashboard
	* */
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

  	/**
    * get Location List
    */
    getLocationList() {
    	this.locationList = [];
    	this.spinner.show();
    	this.dashboardService.geLocationlist(this.searchParameters).subscribe(response => {
    		this.spinner.hide();
    		if (response.isSuccess === true) {
    			//this.lat = response.data.items[0].latitude;
    			// this.lng = response.data.items[0].longitude;
    			this.locationList = response.data.items

    		}
    		else {
    			// response.message ? response.message : response.message = "No results found";
    			this._notificationService.add(new Notification('error', response.message));
    		}
    	}, error => {
    		this.spinner.hide();
    		this._notificationService.add(new Notification('error', error));
    	});
    }

  	/**
    * Get LocalDate by lDate
    * @param lDate
    */
    getLocalDate(lDate) {
    	var utcDate = moment.utc(lDate, 'YYYY-MM-DDTHH:mm:ss.SSS');
    	var localDate = moment(utcDate).local();
    	let res = moment(localDate).format('MMM DD, YYYY hh:mm:ss A');
    	return res;
    }

	/**
	* Get device maintenance
	* */
	getDeviceMaintenance() {
	   	let currentdatetime = moment().format('YYYY-MM-DD[T]HH:mm:ss');
	   	let timezone = moment().utcOffset();
	   	this.spinner.show();
	   	this.deviceService.getdevicemaintenance(currentdatetime, timezone).subscribe(response => {
	   		this.spinner.hide();
	   		if (response.isSuccess === true) {
	   			if (response.data) {
	   				this.upcomingMaintenance = response.data;
	   			}
	   		}
	   		else {
	   			this.upcomingMaintenance = [];
	   			this._notificationService.add(new Notification('error', response.message));
	   		}
	   	}, error => {
	   		this.spinner.hide();
	   		this.upcomingMaintenance = [];
	   		this._notificationService.add(new Notification('error', error));
	   	});
	}

	/**
	* Get entity details by entityId
	* */
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

	/*Dynamic Dashboard Code*/
	getDashboards(){
		this.spinner.show();
		this.dashboardList = [];
		let isAnyDefault = false;
		let systemDefaultIndex = 0;
		this.dynamicDashboardService.getUserWidget().subscribe(response => {
			this.isDynamicDashboard = false;
			for (var i = 0; i <= (response.data.length - 1); i++) {
				response.data[i].id = response.data[i].guid;
				response.data[i].widgets = JSON.parse(response.data[i].widgets);
				this.dashboardList.push(response.data[i]);
				if(response.data[i].isDefault === true){
					isAnyDefault = true;
					this.dashboardData.index = i;
					this.isDynamicDashboard = true;
				}
				if(response.data[i].isSystemDefault === true){
					systemDefaultIndex = i;
				}
			}
			/*Display Default Dashboard if no data*/
			if(!isAnyDefault){
				this.dashboardData.index = systemDefaultIndex;
				this.isDynamicDashboard = true;
				this.dashboardList[systemDefaultIndex].isDefault = true;
			}
			/*Display Default Dashboard if no data*/
			this.spinner.hide();
			if(this.isDynamicDashboard){
				this.editDashboard('view','n');
			}
			else{
				this.getDashboardoverviewByEntity();
			    this.getLocationList();
			    this.getAlertList();
			    this.getDeviceMaintenance();
			    this.getCompanyUsageChartData('w');
			    this.getDeviceTypeUsageChartData('w');
			}
		}, error => {
			this.spinner.hide();
			/*Load Old Dashboard*/
			this.isDynamicDashboard = false;
			this.getDashboardoverviewByEntity();
		    this.getLocationList();
		    this.getAlertList();
		    this.getDeviceMaintenance();
		    this.getCompanyUsageChartData('w');
		    this.getDeviceTypeUsageChartData('w');
			/*Load Old Dashboard*/
			this._notificationService.handleResponse(error,"error");
		});
	}

	editDashboard(type : string = 'view',is_cancel_btn : string = 'n'){
		this.spinner.show();
		this.dashboardWidgets = [];

		this.dashboardData.id = '';
		this.dashboardData.dashboardName = '';
		this.dashboardData.isDefault = false;
		for (var i = 0; i <= (this.dashboardList[this.dashboardData.index].widgets.length - 1); i++) {
			this.dashboardWidgets.push(this.dashboardList[this.dashboardData.index].widgets[i]);
		}

		if (this.options.api && this.options.api.optionsChanged) {
			this.options.api.optionsChanged();
		}
		this.spinner.hide();
	}

	gridInit(grid: GridsterComponentInterface) {
		if (this.options.api && this.options.api.optionsChanged) {
			this.options.api.optionsChanged();
		}
		/*let cond = false;
    	Observable.interval(500)
		.takeWhile(() => !cond)
		.subscribe(i => {
			cond = true;
			this.checkResponsiveness();
		});*/
	}

	checkResponsiveness(){
		if(this.gridster){
			let tempWidth = 20;
			if(this.gridster.curWidth >= 640 && this.gridster.curWidth <= 1200){
				/*tempWidth = Math.floor((this.gridster.curWidth / 60));
				this.options.fixedColWidth = tempWidth;*/
			}
			else{
				this.options.fixedColWidth = tempWidth;
			}
			for (var i = 0; i <= (this.dashboardWidgets.length - 1); i++) {
				if(this.gridster.curWidth < 640){
					for (var g = 0; g <= (this.gridster.grid.length - 1); g++) {
						if(this.gridster.grid[g].item.id == this.dashboardWidgets[i].id){
							this.dashboardWidgets[i].properties.w = this.gridster.grid[g].el.clientWidth;
						}
					}
				}
				else{
					this.dashboardWidgets[i].properties.w = (tempWidth * this.dashboardWidgets[i].cols);
				}
				this.resizeEvent.emit(this.dashboardWidgets[i]);
			}
			this.changedOptions();
		}
	}

	changedOptions() {
		if (this.options.api && this.options.api.optionsChanged) {
			this.options.api.optionsChanged();
		}
	}

	itemResize(item: any, itemComponent: GridsterItemComponentInterface) {
		this.resizeEvent.emit(item);
	}

	deviceSizeChange(size){
		this.checkResponsiveness();
	}

	getAssetsList(){
		this.spinner.show();
		this.deviceData = [];
		this.dynamicDashboardService.getAssetsList().subscribe(response => {
			if (response.isSuccess === true && response.data.length > 0){
				this.deviceData = response.data;
			}
			else
				this._notificationService.handleResponse(response,"error");
			this.changeDetector.detectChanges();
			this.getDashboards();
		}, error => {
			this.spinner.hide();
			this._notificationService.handleResponse(error,"error");
			this.changeDetector.detectChanges();
		});
	}
	/*Dynamic Dashboard Code*/
}
