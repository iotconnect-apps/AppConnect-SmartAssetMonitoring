import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AssetService, Notification, NotificationService, DeviceService } from '../../../services';
import { ActivatedRoute } from '@angular/router';
import { AppConstant, DeleteAlertDataModel } from '../../../app.constants';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DeleteDialogComponent } from '../..';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.css']
})
export class AssetsListComponent implements OnInit {

  isFilterShow: boolean = false;
  deleteAlertDataModel: DeleteAlertDataModel;
  dataSource: MatTableDataSource<any>;
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  displayedColumns: string[] = ['uniqueId', 'name', 'deviceTypeName', 'entityName', 'subEntityName', 'isProvisioned', 'actions'];
  assetsList: any[] = [];
  filterForm: FormGroup;
  locations: any[] = [];
  zones: any[] = [];
  totalRecords = 0;
  isSearch = false;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchParameters = {
    parentEntityGuid:'',
    entityGuid: '',
    pageNo: 0,
    pageSize: 10,
    searchText: '',
    orderBy: 'name desc',
  };
  checkSubmitStatus: boolean;

  constructor(private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public _service: AssetService,
    private _notificationService: NotificationService,
    private route: ActivatedRoute,
    public deviceService: DeviceService,
    public _appConstant: AppConstant, ) { }

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getLocationLookup(currentUser.userDetail.companyId);
    this.getAssetList();
    this.createFilterForm();
  }


  /**
   * create Filter Form
   */
  createFilterForm() {
    this.filterForm = new FormGroup({
      locationGuid: new FormControl(''),
      zoneGuid: new FormControl('')
    });
  }

  /**
   * filter asset  list
   */
  filterAssetList() {
    this.checkSubmitStatus = true;
    if (this.filterForm.valid) {
      this.searchParameters.pageNo = 0;
      this.getAssetList();
    }
  }

  /**
  * Search for test in the list
  * @param filterText
  */
  searchTextCallback(filterText) {
    this.searchParameters.parentEntityGuid = '';
    this.searchParameters.entityGuid = '';
    this.searchParameters.searchText = filterText;
    this.searchParameters.pageNo = 0;
    this.getAssetList();
    this.isSearch = true;
  }

  /**
   * Show hide filter
   * */
  showHideFilter() {
    this.isFilterShow = !this.isFilterShow;
  }

  /**
   * On key filter
   * @param filterValue
   */
  onKey(filterValue: string) {
    this.applyFilter(filterValue);
  }

  /**
   * Filter the list
   * @param filterValue
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /**
  * Get Location Lookup by companyId
  * */
  getLocationLookup(companyId) {
    this.locations = [];
    this.deviceService.getLocationlookup(companyId).
      subscribe(response => {
        if (response.isSuccess === true) {
          this.locations = response['data'];
        } else {
          this._notificationService.add(new Notification('error', response.message));
        }
      }, error => {
        this.spinner.hide();
        this._notificationService.add(new Notification('error', error));
      })
  }

  /**
   * on location change
   * @param locationId 
   */
  onLocationChange(locationId) {
    this.checkSubmitStatus = false;
    this.filterForm.get("zoneGuid").setValue('');
    this.getZoneLookup(locationId)
  }

  /**
  * Get Zone Lookup by locationId
  * */
  getZoneLookup(locationId) {
    this.spinner.show();
    this.zones = [];
    this.deviceService.getZonelookup(locationId).
      subscribe(response => {
        this.spinner.hide();
        if (response.isSuccess === true) {
          this.zones = response['data'];
        } else {
          this._notificationService.add(new Notification('error', response.message));
        }
      }, error => {
        this.spinner.hide();
        this._notificationService.add(new Notification('error', error));
      })
  }


  resetForm() {
    this.filterForm.reset();
    this.checkSubmitStatus = false;
    this.searchParameters.parentEntityGuid = '';
    this.searchParameters.entityGuid = "";
    this.showHideFilter();
    this.getAssetList();
  }

  /**
   * Get asset list
   * */
  getAssetList() {
    this.spinner.show();
    this._service.getAssets(this.searchParameters).subscribe(response => {

      if (response.isSuccess === true) {
        if (response.data.count) {
          this.assetsList = response.data.items;
          this.totalRecords = response.data.count;
        } else{
        this.assetsList = [];
        this.totalRecords = 0;
        }
      }
      else {
        this.assetsList = [];
        this.totalRecords = 0;
      }
      this.spinner.hide();
    }, error => {
      this.assetsList = [];
      this.totalRecords = 0;
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
  }

  /**
   * Set sort order
   * @param sort
   */
  setOrder(sort: any) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.searchParameters.orderBy = sort.active + ' ' + sort.direction;
    this.getAssetList();
  }

  /**
   * On page size event
   * @param pageSize
   */
  onPageSizeChangeCallback(pageSize) {
    this.searchParameters.parentEntityGuid = '';
    this.searchParameters.entityGuid = '';
    this.searchParameters.pageSize = pageSize + 1;
    this.searchParameters.pageNo = 1;
    this.isSearch = true;
    this.getAssetList();
  }

  /**
   * Change pagination event
   * @param pagechangeresponse
   */
  ChangePaginationAsPageChange(pagechangeresponse) {
    this.searchParameters.parentEntityGuid = '';
    this.searchParameters.entityGuid = '';
    this.searchParameters.pageNo = pagechangeresponse.pageIndex;
    this.searchParameters.pageSize = pagechangeresponse.pageSize;
    this.isSearch = true;
    this.getAssetList();
  }

  /**
   * Delete model popup
   * @param DeviceModel
   */
  deleteModel(DeviceModel: any) {
    this.deleteAlertDataModel = {
      title: "Delete Device",
      message: this._appConstant.msgConfirm.replace('modulename', "device"),
      okButtonName: "Yes",
      cancelButtonName: "No",
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      height: 'auto',
      data: this.deleteAlertDataModel,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDevice(DeviceModel.guid);
      }
    });
  }

  /**
   * Delete device by guid
   * @param guid
   */
  deleteDevice(guid) {
    this.spinner.show();
    this.deviceService.deleteDevice(guid).subscribe(response => {
      this.spinner.hide();
      if (response.isSuccess === true) {
        this._notificationService.add(new Notification('success', this._appConstant.msgDeleted.replace("modulename", "Asset")));
        this.getAssetList();
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
