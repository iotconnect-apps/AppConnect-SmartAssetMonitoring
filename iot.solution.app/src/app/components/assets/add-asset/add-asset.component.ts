import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService, AssetService, LookupService, Notification, DeviceService } from '../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material';
import { AppConstant, MessageAlertDataModel, DeleteAlertDataModel } from '../../../app.constants';
import { MessageDialogComponent, DeleteDialogComponent } from '../..';
import { attributeObj } from './attribute-model';
import { element } from 'protractor';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css']
})
export class AddAssetComponent implements OnInit {

  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string
  @ViewChild('PageContent', { static: false }) PageContent: any;
  res: any;
  slideConfig = { "slidesToShow": 4, "slidesToScroll": 4 };
  @ViewChild('myFile', { static: false }) myFile: ElementRef;
  @ViewChild('mediaFile', { static: false }) mediaFile: ElementRef;
  MessageAlertDataModel: MessageAlertDataModel;
  deleteAlertDataModel: DeleteAlertDataModel;
  fileUrl: any;
  fileName: any = [];
  fileToUpload: any = [];
  templateGuid: any;
  mediaUrl: any;
  isEdit = false;
  isView = false;
  buttonName = "Submit"
  assetObject: any = {};
  currentImage: any;
  hasImage = false;
  handleImgInput = false;
  checkSubmitStatus = false;
  selectedFiles: any = [];
  selectedImages: any = [];
  selectedFilesObj: any = [];
  selectedImagesObj: any = [];
  locationList: any = [];
  zoneList: any = [];
  assetTypeList: any = [];
  sensorList: any = [];
  assetGuid: any;
  moduleName: any = "Add Asset";
  sensorConditionList: any[] = [
    {
      text: 'is equal to',
      value: '='
    },
    {
      text: 'is not equal to',
      value: '!='
    },
    {
      text: 'is greater than',
      value: '>'
    },
    {
      text: 'is greater than or equal to',
      value: '>='
    },
    {
      text: 'is less than',
      value: '<'
    },
    {
      text: 'is less than or equal to',
      value: '<='
    },
  ];
  companyId: any;
  assetForm: FormGroup;
  attrForm = new FormGroup({
    attrGuid: new FormArray([]),
    attrName: new FormArray([]),
    dispName: new FormArray([]),
  });

  get attrGuid(): FormArray {
    return this.attrForm.get('attrGuid') as FormArray;
  }

  get attrName(): FormArray {
    return this.attrForm.get('attrName') as FormArray;
  }

  get dispName(): FormArray {
    return this.attrForm.get('dispName') as FormArray;
  }

  addAttributes() {

    if (this.isView) {
      this.attrGuid.push(new FormControl({ value: "", disabled: true }));
      this.attrName.push(new FormControl({ value: "", disabled: true }));
      this.dispName.push(new FormControl({ value: "", disabled: true }));
    } else {
      this.attrGuid.push(new FormControl(''));
      this.attrName.push(new FormControl(''));
      this.dispName.push(new FormControl('', Validators.required));
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public _service: AssetService,
    public dialog: MatDialog,
    public lookupService: LookupService,
    public _appConstant: AppConstant,
    public deviceService: DeviceService) {
    this.createFormGroup();
    this.activatedRoute.params.subscribe(params => {
      if (params.assetGuid != 'add') {

        this.activatedRoute.queryParams.subscribe(queryParams => {
          if (queryParams.operationType == "edit") {
            this.isEdit = true;
            this.buttonName = "Update"
            this.moduleName = "Update Asset";
            this.disableFormOnEdit();
          }
          if (queryParams.operationType == "view") {
            this.moduleName = "Asset";
            this.isView = true;
            this.attrForm.disable();
          }
        })


        this.assetGuid = params.assetGuid;
        this.assetObject = {
          uniqueId: null, specification: '', name: '', deviceTypeName: '', entityGuid: '', parentEntityGuid: '', sensorGuid: '', sensorValue: '', sensorCondition: '',
          templateGuid: '', typeGuid: '', deviceImageFiles: '', deviceMediaFiles: '', deviceAttributes: [new attributeObj()]
        }

        setTimeout(() => {
          this.getAssetDetails(params.assetGuid);
        }, 2500);
      }
      else {
        this.assetObject = {
          uniqueId: null, specification: '', name: '', deviceTypeName: '', entityGuid: '', parentEntityGuid: '', sensorGuid: '', sensorValue: '', sensorCondition: '',
          templateGuid: '', typeGuid: '', deviceImageFiles: '', deviceMediaFiles: '', deviceAttributes: [new attributeObj()]
        }
      }
    });
  }

  private disableFormOnEdit() {
    this.assetForm.get('uniqueId').disable();
    this.assetForm.get('locationGuid').disable();
    this.assetForm.get('entityGuid').disable();
    this.assetForm.get('typeGuid').disable();
    this.assetForm.get('sensorGuid').disable();
    this.assetForm.get('sensorCondition').disable();
    this.assetForm.get('sensorValue').disable();
  }

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      height: 200,
      // extraPlugins: 'divarea',    
      forcePasteAsPlainText: true,
      removeButtons: '',
      readOnly: this.isView
    };
    this.mediaUrl = this._notificationService.apiBaseUrl;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.companyId = currentUser.userDetail.companyId;
    this.getLocationLookup(this.companyId);
  }

  createFormGroup() {
    this.assetForm = new FormGroup({
      guid: new FormControl(null),
      companyGuid: new FormControl(null),
      parentEntityGuid: new FormControl(null),
      imageFiles: new FormControl(''),
      mediaFiles: new FormControl(''),
      uniqueId: new FormControl({ value: null, disabled: this.isEdit }, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]),
      name: new FormControl('', Validators.required),
      locationGuid: new FormControl({ value: '', disabled: this.isEdit }, Validators.required),
      entityGuid: new FormControl({ value: '', disabled: this.isEdit }, Validators.required),
      description: new FormControl({ value: '', disabled: this.isEdit }),
      specification: new FormControl({ value: '', disabled: this.isView }, Validators.required),
      sensorValue: new FormControl({ value: '', disabled: this.isEdit }, Validators.required),
      sensorCondition: new FormControl({ value: '', disabled: this.isEdit }, Validators.required),
      sensorGuid: new FormControl({ value: '', disabled: this.isEdit }, Validators.required),
      templateGuid: new FormControl(''),
      typeGuid: new FormControl({ value: '', disabled: this.isEdit }, Validators.required),
      attrbs: new FormArray([]),
    });
  }

  /**
  *
  * @param deivceGuid
  */
  getAssetDetails(assetGuid) {

    this.spinner.show();
    this.deviceService.getDeviceDetails(assetGuid).subscribe(response => {
      if (response.isSuccess === true) {
        this.assetObject = response.data;
        this.selectedFilesObj = this.assetObject.deviceMediaFiles;
        this.selectedImagesObj = this.assetObject.deviceImageFiles;

        if (this.assetObject.parentEntityGuid) {
          this.getZoneLookup(this.assetObject.parentEntityGuid);
          this.getAssetTypeLookup(this.assetObject.parentEntityGuid);
        }
        if (this.assetObject.templateGuid) {
          this.getTemplateAttributeLookup(this.assetObject.templateGuid);
        }
        if (this.isView)
          this.assetForm.disable();
      }
      else {
        this._notificationService.add(new Notification('error', response.message));
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
  }

  /**
  * Get Location Lookup
  * */
  getLocationLookup(companyId) {
    this.locationList = [];
    this.spinner.show();
    this.lookupService.getLocationlookup(companyId).
      subscribe(response => {
        if (response.isSuccess === true) {
          this.locationList = response['data'];
        } else {
          this._notificationService.add(new Notification('error', response.message));
        }
        if (!this.isView && !this.isEdit) {
          this.spinner.hide();
        }
      }, error => {
        this.spinner.hide();
        this._notificationService.add(new Notification('error', error));
      })
  }

  /**
 * Get Zone Lookup
 * */
  getZoneLookup(parentEntityId) {
    this.zoneList = [];
    this.spinner.show();
    this.lookupService.getZonelookup(parentEntityId).
      subscribe(response => {
        if (response.isSuccess === true) {
          this.zoneList = response['data'];

        } else {
          this._notificationService.add(new Notification('error', response.message));
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this._notificationService.add(new Notification('error', error));
      })
  }

  /**
  * Get Asset Type Lookup
  * */
  getAssetTypeLookup(entityId) {
    this.assetTypeList = [];
    this.spinner.show();
    this.lookupService.getAssetTypelookup(entityId).
      subscribe(response => {
        if (response.isSuccess === true) {
          this.assetTypeList = response['data'];
        } else {
          this._notificationService.add(new Notification('error', response.message));
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this._notificationService.add(new Notification('error', error));
      })
  }

  /**
   * Get Template Attribute Lookup for Device Type
   * */
  getTemplateAttributeLookup(templateValue) {
    this.attrForm = new FormGroup({
      attrGuid: new FormArray([]),
      attrName: new FormArray([]),
      dispName: new FormArray([]),
    });

    this.sensorList = [];
    if (!this.isView && !this.isEdit) {
      this.sensorList = [];
      //      this.spinner.show();
      this.assetTypeList.filter((x) => {
        if (x.value.toLowerCase() == templateValue) {
          this.templateGuid = x.templateGuid;
        }
      });
    } else {
      this.templateGuid = templateValue;
    }
    this.deviceService.getallAttribute(this.templateGuid).
      subscribe(response => {
        if (response.isSuccess === true) {
          this.spinner.hide();
          this.sensorList = response['data'];
          for (let i = 0; i < this.sensorList.length; i++) {
            this.addAttributes();
          }
          if (this.assetObject && this.assetObject.deviceAttributes) {
            let sorteddeviceAttributes = [];
            for (let i = 0; i < this.sensorList.length; i++) {
              let deviceAttribute = this.assetObject.deviceAttributes.find(element => element.attrName == this.sensorList[i].localName);
              sorteddeviceAttributes.push(deviceAttribute);
            }
            this.assetObject.deviceAttributes = sorteddeviceAttributes;
          }
        } else {
          this._notificationService.add(new Notification('error', response.message));
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this._notificationService.add(new Notification('error', error));
      })
  }

  /**
   * Manage asset
   * */
  manageAsset() {
    let message = "Asset created successfully.";
    this.checkSubmitStatus = true;
    this.assetForm.value.attrbs = [];

    if (this.assetForm.status === "VALID" && this.attrForm.status === "VALID") {
      if (this.fileToUpload) {
        this.assetForm.get('imageFiles').setValue(this.fileToUpload);
      }
      if (this.selectedFiles) {
        this.assetForm.get('mediaFiles').setValue(this.selectedFiles);
      }
      this.assetForm.value.templateGuid = this.templateGuid;
      if (this.isEdit) {
        message = "Asset updated successfully.";
        this.setAllGuid();
      }

      for (let i = 0; i < this.sensorList.length; i++) {
        this.assetForm.value.attrbs.push({ attrGuid: this.sensorList[i].guid, attrName: this.sensorList[i].localName, dispName: this.dispName.at(i).value });
      }
      this.spinner.show();
      this.deviceService.manageAsset(this.assetForm.value).subscribe(response => {
        if (response.isSuccess === true) {
          this.spinner.hide();
          this._notificationService.add(new Notification('success', message));
          this.router.navigate(['/assets']);
        } else {
          this._notificationService.add(new Notification('error', response.message));
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this._notificationService.add(new Notification('error', error));
      });

    }
  }

  /**
   * set all guid
   */
  private setAllGuid() {
    this.assetForm.get('entityGuid').enable();
    this.assetForm.get('typeGuid').enable();
    this.assetForm.get('sensorGuid').enable();
    this.assetForm.get("guid").setValue(this.assetObject["guid"]);
    this.assetForm.get("templateGuid").setValue(this.assetObject["templateGuid"]);
    this.assetForm.get("companyGuid").setValue(this.assetObject["companyGuid"]);
    this.assetForm.get("entityGuid").setValue(this.assetObject["entityGuid"]);
    this.assetForm.get("parentEntityGuid").setValue(this.assetObject["parentEntityGuid"]);
    this.assetForm.get("typeGuid").setValue(this.assetObject["typeGuid"]);

    // this.assetForm.get('typeGuid').setValue(this.assetObject.typeGuid);
    //     this.assetForm.get('sensorGuid').setValue(this.assetObject.sensorGuid);
    //     this.assetForm.get('entityGuid').setValue(this.assetObject.entityGuid);
  }

  /**
   * Validate image
   * @param event
   */
  handleImageInput(event) {
    this.handleImgInput = true;
    let files = event.target.files;
    for (let x = 0; x < files.length; x++) {
      let fileType = files.item(x).name.split('.');
      let imagesTypes = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG'];
      if (imagesTypes.indexOf(fileType[fileType.length - 1]) !== -1) {

        if (event.target.files && event.target.files[x]) {
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[x]);
          reader.onload = (innerEvent: any) => {


            this.fileUrl = innerEvent.target.result;
            // this.selectedImages.push({ url: this.fileUrl, name: files.item(x).name });


            let img = new Image();
            img.src = window.URL.createObjectURL(event.target.files[x]);
            img.onload = () => {

              const width = img.naturalWidth;
              const height = img.naturalHeight;
              var stype = event.target.files[x].type.toString();
              window.URL.revokeObjectURL(img.src);

              if (this.fileToUpload.size > 2000000) {
                this._notificationService.add(new Notification('info', "Maximum Supported Size: 2 MBs."));
                this.assetForm.patchValue({
                  imageFiles: null,
                });
                this.myFile.nativeElement.value = "";
                this.spinner.hide();
                return;
              }
              if (((width * height) > 1048576)) {
                this._notificationService.add(new Notification('info', "Image dimensions should be min 240*240 and Max 1024*1024."));
                this.assetForm.patchValue({
                  imageFiles: null,
                });
                this.myFile.nativeElement.value = "";
                this.spinner.hide();
                return;
              }
              else if ((width * height) < 57600) {
                this._notificationService.add(new Notification('info', "Image dimensions should be min 240*240 and Max 1024*1024."));
                this.assetForm.patchValue({
                  imageFiles: null,
                });
                this.myFile.nativeElement.value = "";
                this.spinner.hide();
                return;
              }
              else {
                var data = [];
                data.push("image/jpg");
                data.push("image/jpeg");
                data.push("image/png");
                if (data.includes(stype)) {

                  this.fileName.push({ name: files.item(x).name });
                  this.fileToUpload.push(files.item(x));

                  // this.assetForm.patchValue({
                  //   imageFiles: this.fileToUpload,
                  // });
                  this.selectedImages.push({ url: this.fileUrl, name: files.item(x).name });
                }
                else {
                  this.assetForm.patchValue({
                    imageFile: null,
                  });
                  this.myFile.nativeElement.value = "";
                  this.spinner.hide();
                  return;
                }
              }

            }


          }
        }
      } else {
        this.MessageAlertDataModel = {
          title: "Asset Image",
          message: "Invalid Image Type.",
          message2: "Upload .jpg, .jpeg, .png Image Only.",
          okButtonName: "OK",
        };
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          width: '400px',
          height: 'auto',
          data: this.MessageAlertDataModel,
          disableClose: false
        });
      }
    }
  }

  /**
   * Handle media files
   * @param event
   */
  handleMediaFileInput(event) {
    const fileList: FileList = event.target.files;
    for (let x = 0; x < fileList.length; x++) {
      if (event.target.files[x]) {
        let fileType = fileList.item(x).name.split('.');
        let fileTypes = ['doc', 'DOC', 'docx', 'DOCX', 'pdf', 'PDF'];
        if (fileTypes.indexOf(fileType[fileType.length - 1]) !== -1) {
          this.selectedFiles.push(event.target.files[x]);
        } else {
          this.checkSubmitStatus = false;
          this.MessageAlertDataModel = {
            title: "Media Files",
            message: "Invalid File Type.",
            message2: "Upload .doc, .docx, .pdf file Only.",
            okButtonName: "OK",
          };
          const dialogRef = this.dialog.open(MessageDialogComponent, {
            width: '400px',
            height: 'auto',
            data: this.MessageAlertDataModel,
            disableClose: false
          });
          return;
        }
      }

    }
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (innerEvent: any) => {
      }
    }
  }

  /**
   * Remove file from selectedFiles list
   * @param fileName
   */
  fileRemove(fileName): void {
    this.mediaFile.nativeElement.value = "";
    this.selectedFiles = this.selectedFiles.filter(({ name }) => name !== fileName);
  }

  /**
   * Images remove
   * @param imageName
   */
  imagesRemove(imageName): void {
    this.myFile.nativeElement.value = "";
    this.fileName = this.fileName.filter(({ name }) => name !== imageName);
    this.fileToUpload = this.fileToUpload.filter(({ name }) => name !== imageName);
    this.selectedImages = this.selectedImages.filter(({ name }) => name !== imageName);
  }


  /**
   * remove media image pop up model
   * @param object 
   */
  removeMediaFile(object: any) {

    this.deleteAlertDataModel = {
      title: "Delete Image",
      message: this._appConstant.msgConfirm.replace('modulename', "Asset File"),
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
        this.deleteAssetFile(object);
      }
    });
  }

  /**
   * Delete image confirmation popup
   * */
  deleteImgModel(object: any) {
    this.deleteAlertDataModel = {
      title: "Delete Image",
      message: this._appConstant.msgConfirm.replace('modulename', "Asset Image"),
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
        this.deleteAssetImg(object);
      }
    });
  }

  /**
  * Delete location file
  * */
  deleteAssetFile(file) {
    this.spinner.show();
    this.deviceService.deleteFiles(this.assetObject.guid, 'false', file.guid).subscribe(response => {
      this.spinner.hide();
      if (response.isSuccess == true) {
        // this.selectedFilesObj=this.selectedFilesObj.filter(({ fil }) => fil.guid !== file.guid);
        for (let index = 0; index < this.selectedFilesObj.length; index++) {
          if (this.selectedFilesObj[index].guid == file.guid) {
            this.selectedFilesObj.splice(index, 1)
          }
        }
        this._notificationService.add(new Notification('success', this._appConstant.msgDeleted.replace("modulename", "Asset File")));
      } else {
        this._notificationService.add(new Notification('error', response.message));
      }
    }, error => {
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
  }

  /**
   * Delete location image
   * */
  deleteAssetImg(image) {
    this.spinner.show();
    this.deviceService.deleteFiles(this.assetObject.guid, 'true', image.guid).subscribe(response => {
      this.spinner.hide();
      if (response.isSuccess == true) {
        // this.selectedImagesObj=this.selectedImagesObj.filter(({ img }) => img.guid !== image.guid);
        for (let index = 0; index < this.selectedImagesObj.length; index++) {
          if (this.selectedImagesObj[index].guid == image.guid) {
            this.selectedImagesObj.splice(index, 1)
          }
        }
        this._notificationService.add(new Notification('success', this._appConstant.msgDeleted.replace("modulename", "Asset Image")));
      } else {
        this._notificationService.add(new Notification('error', response.message));
      }
    }, error => {
      this.spinner.hide();
      this._notificationService.add(new Notification('error', error));
    });
  }

  clickCancel() {
    this.router.navigate(['assets']);
  }
}
