import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService, Notification, AssetService, DeviceService, LookupService } from '../../../services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})
export class AddTypeComponent implements OnInit {

  assetTypeGuid: any;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  moduleName = 'Add Asset Type';
  isEdit = false;
  buttonName = 'Submit';
  assetTypeObject: any = {};
  assetTypeForm: FormGroup;
  checkSubmitStatus = false;
  templateList: any = [];
  locationList: any = [];
  companyId: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public _service: AssetService,
    public deviceService: DeviceService,
    public lookupService: LookupService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      if (params.assetTypeGuid != 'add') {
        this.getAssetTypeDetails(params.assetTypeGuid);
        this.assetTypeGuid = params.assetTypeGuid;
        this.moduleName = "Edit Asset Type";
        this.isEdit = true;
        this.buttonName = 'Update'
      } else {
        this.assetTypeObject = { name: '', lastName: '', email: '', contactNo: '', password: '' }
      }
    });
    this.createFormGroup();
  }

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.companyId = currentUser.userDetail.companyId;
    this.getLocationLookup(this.companyId);
    this.getTemplateLookup();
  }

  createFormGroup() {
    this.assetTypeForm = this.formBuilder.group({
      name: [{value: '', disabled: this.isEdit}, [Validators.required, this._notificationService.ValidatorFn]],
      description: ['', [Validators.required, this._notificationService.ValidatorFn]],
      make: ['', [Validators.required, this._notificationService.ValidatorFn]],
      model: ['', [Validators.required, this._notificationService.ValidatorFn]],
      manufacturer: ['', [Validators.required, this._notificationService.ValidatorFn]],
      entityGuid: ['', Validators.required],
      templateGuid: ['', Validators.required],
    });
  }

  /**
  * Get Location Lookup by companyId
  * @param companyId
  */
  getLocationLookup(companyId) {
    this.lookupService.getLocationlookup(companyId).
      subscribe(response => {
        if (response.isSuccess === true) {
          this.locationList = response.data;
          this.locationList = this.locationList.filter(word => word.isActive == true);

        } else {
          this._notificationService.add(new Notification('error', response.message));
        }
      }, error => {
        this.spinner.hide();
        this._notificationService.add(new Notification('error', error));
      })
  }

  /**
  * Get Template Lookup for Device Type
  * */
  getTemplateLookup() {
    this.deviceService.getalltemplate().subscribe(response => {
      this.templateList = response['data'];
    });
  }

  /**
   * Get asset type details by guid
   * @param guid
   */
  getAssetTypeDetails(guid) {
    this.spinner.show();
    this._service.getAssetTypeDetails(guid).subscribe(response => {
      this.spinner.hide();
      if (response.isSuccess === true) {
        this.assetTypeObject = response.data;
        //this.assetTypeForm.get('name').disable();
      }
    });
  }

  manageAssetType() {
    this.checkSubmitStatus = true;
  
    if (this.assetTypeForm.status === "VALID") {
      if (this.isEdit) {
        this.assetTypeForm.registerControl("guid", new FormControl(''));
        this.assetTypeForm.patchValue({ "guid": this.assetTypeGuid });
        // this.assetTypeForm.patchValue({ "name": this.assetTypeObject.name });
        this.assetTypeForm.get('name').enable();
        this.assetTypeForm.get('name').setValue(this.assetTypeObject.name);
        
      }
      this.spinner.show();
      this._service.addAssetType(this.assetTypeForm.value).subscribe(response => {
        if (response.isSuccess === true) {
          this.spinner.hide();
          if (response.data.updatedBy != null || this.isEdit) {
            this._notificationService.add(new Notification('success', "Asset type has been updated successfully."));
          } else {
            this._notificationService.add(new Notification('success', "Asset type has been added successfully."));
          }
          this.router.navigate(['/assets-types']);
        } else {
          this.spinner.hide();
          this._notificationService.add(new Notification('error', response.message));
        }
      })
    }
  }


}
