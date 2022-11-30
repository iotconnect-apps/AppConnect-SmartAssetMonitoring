import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { NotificationService, Notification, AlertsService, LookupService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { transformRawEvents } from '@fullcalendar/core/structs/event-store';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alerts = [];
  displayedColumns: string[] = ['message', 'entityName', 'deviceName',  'eventDate', 'severity'];
  isFilterShow: boolean = false;
  locations: any[];
  zones: any[];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  order = true;
  isSearch = false;
  reverse = false;
  orderBy = 'name';
  searchParameters = {
    pageNo: 0,
    pageSize: 10,
    searchText: '',
    orderBy: 'eventDate desc',
    entityGuid: '',
    deviceGuid: '',
    parentEntityGuid:""
  };
  totalRecords = 0;
  filterForm: FormGroup;
  checkSubmitStatus: boolean;
  constructor(
    private spinner: NgxSpinnerService,
    public _service: AlertsService,
    public _lookupService: LookupService,
    private _notificationService: NotificationService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.assetGuid) {
        this.searchParameters.deviceGuid = params.assetGuid;
      }
      if (params.entityGuid) {
        this.searchParameters.parentEntityGuid = params.entityGuid;
      }
      this.getAlertList();
    });
    this.getLocationLookup();
    this.creaeFilterForm();
  }
  
  /**
   * to create a form for filter
   */
  creaeFilterForm() {
    this.filterForm= new FormGroup({
      locationGuid:new FormControl("",Validators.required)
    });
  }

  /**
   * get the list of location lookup's
   */
  getLocationLookup(){
    this.spinner.show();
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this._lookupService.getLocationlookup(currentUser.userDetail.companyId).subscribe(response=>{
      this.spinner.hide();
      if (response.isSuccess) {
        this.locations =response.data;
      } else {
        this._notificationService.add(new Notification("error",response.message));
      }
    },error=>{
      this.spinner.hide();
      this._notificationService.add(new Notification("error",error));
    });
  }
  

  /**
   * called on location change 
   */
  onLocationChange(event){
    this.searchParameters.parentEntityGuid=event.value;
  }


  /**
   * filter the data based on location and zone
   */
  filterAlerts(){
    this.checkSubmitStatus=true;
    if (this.filterForm.valid) {
      this.searchParameters.pageNo = 0;
      this.getAlertList();      
    }
  }

  /**
   * clear all filter's
   */
  clearFilter(){
    this.filterForm.reset();
    this.checkSubmitStatus=false;
    this.searchParameters.parentEntityGuid="";
    this.searchParameters.entityGuid="";
    this.searchParameters.pageNo = 0;
    this.getAlertList();
    this.showHideFilter();
  }

  /**
   * get alerts list
   */
  getAlertList() {
    this.spinner.show();
    this._service.getAlerts(this.searchParameters).subscribe(response => {
      this.spinner.hide();
      if (response.isSuccess === true) {
        if (response.data.count && response.data.count>0) {
          this.alerts = response.data.items;
          this.totalRecords = response.data.count;
        }else{
          this.alerts=[];
          this.totalRecords = 0;
        }
      }
      else {
        this.alerts = [];
        this._notificationService.add(new Notification('error', response.message));
        this.totalRecords = 0;
      }
    }, error => {
      this.spinner.hide();
      this.alerts = [];
      this.totalRecords = 0;
      this._notificationService.add(new Notification('error', error));
    });
  }


  /**
   * sort data 
   * @param sort 
   */
  setOrder(sort: any) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.searchParameters.orderBy = sort.active + ' ' + sort.direction;
    this.getAlertList();
  }


  /**
   * page size change Ex. 5->10
   * @param pageSize 
   */
  onPageSizeChangeCallback(pageSize) {
    this.searchParameters.pageSize = pageSize + 1;
    this.searchParameters.pageNo = 1;
    this.isSearch = true;
    this.getAlertList();
  }

  /**
   * page size and index change
   * @param pagechangeresponse 
   */
  ChangePaginationAsPageChange(pagechangeresponse) {
    this.searchParameters.pageNo = pagechangeresponse.pageIndex;
    this.searchParameters.pageSize = pagechangeresponse.pageSize;
    this.isSearch = true;
    this.getAlertList();
  }

  getLocalDate(lDate) {
    var utcDate = moment.utc(lDate, 'YYYY-MM-DDTHH:mm:ss.SSS');
    // Get the local version of that date
    var localDate = moment(utcDate).local();
    let res = moment(localDate).format('MMM DD, YYYY hh:mm:ss A');
    return res;

  }


  /**
   * Show hide filter
   * */
  showHideFilter() {
    this.isFilterShow = !this.isFilterShow;
  }

}
