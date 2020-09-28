import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetService, NotificationService, Notification, DashboardService } from '../../../services';
import { ActivatedRoute } from '@angular/router';
import { DeleteAlertDataModel, AppConstant } from '../../../app.constants';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DeleteDialogComponent } from '../..';

@Component({
  selector: 'app-asset-types',
  templateUrl: './asset-types.component.html',
  styleUrls: ['./asset-types.component.css']
})
export class AssetTypesComponent implements OnInit {

  deleteAlertDataModel: DeleteAlertDataModel;
  displayedColumns: string[] = ['name', 'make', 'model', 'manufacturer', 'isActive', 'actions'];
  searchParameters = {
    parentEntityGuid:'',
    pageNo: 0,
    pageSize: 10,
    searchText: '',
    orderBy: 'name desc',
  };
  assetTypeList: any[] = [];
  totalRecords = 0;
  isSearch = false;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  deviceIsConnected = false;
  dataSource: MatTableDataSource<any>;
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public _service: AssetService,
    private _notificationService: NotificationService,
    private route: ActivatedRoute,
    public _appConstant: AppConstant,
    public dashboardService: DashboardService) { }

  ngOnInit() {
    this.getAssetTypeList();
  }

  /**
   * Search for test in the list
   * @param filterText
   */
  searchTextCallback(filterText) {
    this.searchParameters.parentEntityGuid = '';
    this.searchParameters.searchText = filterText;
    this.searchParameters.pageNo = 0;
    this.getAssetTypeList();
    this.isSearch = true;
  }

  /**
   * Get asset type list
   * */
  getAssetTypeList() {
    this.spinner.show();
    this._service.getAssetTypes(this.searchParameters).subscribe(response => {

      if (response.isSuccess === true) {
        if (response.data.count) {
          this.assetTypeList = response.data.items;
          this.totalRecords = response.data.count;
        }
      }
      else {
        this.assetTypeList = [];
        this._notificationService.add(new Notification('error', response.message));
        this.totalRecords = 0;
      }
      this.spinner.hide();
    }, error => {
      this.assetTypeList = [];
      this.totalRecords = 0;
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
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
   * Set order 
   * @param sort
   */
  setOrder(sort: any) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.searchParameters.orderBy = sort.active + ' ' + sort.direction;
    this.getAssetTypeList();
  }

  /**
   * On page size change event
   * @param pageSize
   */
  onPageSizeChangeCallback(pageSize) {
    this.searchParameters.parentEntityGuid = '';
    this.searchParameters.pageSize = pageSize + 1;
    this.searchParameters.pageNo = 1;
    this.isSearch = true;
    this.getAssetTypeList();
  }

  /**
   * Change pagination 
   * @param pagechangeresponse
   */
  ChangePaginationAsPageChange(pagechangeresponse) {
    this.searchParameters.parentEntityGuid = '';
    this.searchParameters.pageNo = pagechangeresponse.pageIndex;
    this.searchParameters.pageSize = pagechangeresponse.pageSize;
    this.isSearch = true;
    this.getAssetTypeList();
  }

  /**
  * Delete confirmation popup
  * @param assetTypeModel
  */
  deleteModel(assetTypeModel: any) {
    this.deleteAlertDataModel = {
      title: "Delete Asset Type",
      message: this._appConstant.msgConfirm.replace('modulename', "Asset Type"),
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
        this.deleteAssetType(assetTypeModel.guid);
      }
    });
  }

  /**
   * Delete asset type by user guid
   * @param guid
   */
  deleteAssetType(guid) {
    this.spinner.show();
    this._service.deleteAssetType(guid).subscribe(response => {
      this.spinner.hide();
      if (response.isSuccess === true) {
        this._notificationService.add(new Notification('success', this._appConstant.msgDeleted.replace("modulename", "Asset Type")));
        this.getAssetTypeList();

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
