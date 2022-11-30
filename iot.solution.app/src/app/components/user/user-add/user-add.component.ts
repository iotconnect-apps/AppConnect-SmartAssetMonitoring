import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { UserService, NotificationService, Notification, LocationService, LookupService } from '../../../services';
import { CustomValidators } from '../../../helpers/custom.validators';

@Component({
	selector: 'app-user-add',
	templateUrl: './user-add.component.html',
	styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
	public contactNoError: boolean = false;
	public mask = {
		guide: true,
		showMask: false,
		keepCharPositions: true,
		mask: ['(', /[0-9]/, /\d/, ')', '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
	};
	locationList = [];
	currentUser = JSON.parse(localStorage.getItem("currentUser"));
	zoneList = [];
	moduleName = "Add User";
	userObject = {};
	userGuid = '';
	isEdit = false;
	userForm: FormGroup;
	checkSubmitStatus = false;
	roleList = [];
	buttonName = 'Submit'
	timeZoneList = [];
	zoneListParameters = { pageNo: 0, pageSize: -1, searchText: "", orderBy: "", parentEntityGuid: "" };


	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private _notificationService: NotificationService,
		private activatedRoute: ActivatedRoute,
		private spinner: NgxSpinnerService,
		public userService: UserService,
		public lookupServices: LookupService,
		public locationService: LocationService,
	) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			if (params.userGuid != 'add') {
				this.getUserDetails(params.userGuid);
				this.userGuid = params.userGuid;
				this.moduleName = "Edit User";
				this.isEdit = true;
				this.buttonName = 'Update';
			} else {
				this.userObject = { firstName: '', entityGuid: null, roleGuid: null, lastName: '', email: '', contactNo: '', timezoneGuid: null, isActive: '', isDeleted: "" };
			}
			this.createFormGroup();
			this.getLocation();
		});
	}

	/**
	 * This method is used to get the list of Location's
	 */
	getLocation() {
		this.spinner.show();

		this.lookupServices.getLocationlookup(this.currentUser.userDetail.companyId).subscribe(response => {
			this.spinner.hide();
			if (response.isSuccess) {
				this.locationList = response.data;

			} else {
				this._notificationService.add(new Notification('error', response.message));
			}
			this.getTimezoneList();
			this.getRoleList();
		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification('error', error));
			this.getRoleList();
			this.getTimezoneList();
		});
	}

	/**
	 * This method is being used to create the form to create/update user's data. 
	 */
	createFormGroup() {
		this.userForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
			contactNo: ['', Validators.required],
			entityGuid: [null, Validators.required],
			// locationGuid: [''],
			isActive: ['', Validators.required],
			isDeleted: ['',],
			roleGuid: [null, Validators.required],
			timeZoneGuid: [null, Validators.required]
		}, {
			validators: CustomValidators.checkPhoneValue('contactNo')
		});
	}

	/**
	 * This method will get the list of roles that can be used to assign to a particular user.
	 */
	getRoleList() {
		this.spinner.show();
		this.lookupServices.getsensor
		this.userService.getroleList().subscribe(response => {
			this.spinner.hide();
			response.data = response.data.filter(x => x.isAdminRole != true);
			this.roleList = response.data;
		});
	}

	/**
	 * This will get the list of timeZone 
	 */
	getTimezoneList() {
		this.spinner.show();
		this.userService.getTimezoneList().subscribe(response => {
			this.spinner.hide();
			this.timeZoneList = response.data;
		});
	}

	/**
	 * The method creates as well as update the data value of any user.
	 */
	manageUser() {
		this.checkSubmitStatus = true;
		let contactNo = this.userForm.value.contactNo.replace("(", "")
		let contactno = contactNo.replace(")", "")
		let finalcontactno = contactno.replace("-", "")
		if (finalcontactno.match(/^0+$/)) {
			this.contactNoError = true;
			return
		} else {
			this.contactNoError = false;
		}
		if (this.isEdit) {
			this.userForm.registerControl("id", new FormControl(''));
			this.userForm.patchValue({ "id": this.userGuid });
			this.userForm.get('isActive').setValue(this.userObject['isActive']);
			this.userForm.get('isDeleted').setValue(this.userObject['isDeleted']);
		}
		else {
			this.userForm.get('isActive').setValue(true);
			this.userForm.get('isDeleted').setValue(false);
		}
		if (this.userForm.status === "VALID") {
			this.spinner.show();

			let currentUser = JSON.parse(localStorage.getItem('currentUser'));
			// this.userForm.get('entityGuid').setValue(currentUser.userDetail.entityGuid);
			this.userForm.get('contactNo').setValue(contactno);
			let submitData = this.userForm.value;
			// delete submitData.locationGuid;
			this.userService.manageUser(submitData).subscribe(response => {
				if (response.isSuccess === true) {
					this.spinner.hide();
					if (response.data.updatedBy != null) {
						this._notificationService.add(new Notification('success', "User updated successfully."));
					} else {
						this._notificationService.add(new Notification('success', "User created successfully."));
					}
					this.router.navigate(['/users']);
				} else {
					this.spinner.hide();
					this._notificationService.add(new Notification('error', response.message));
				}
			})
		}
	}

	/**
	 * Get the user's information to update
	 * @param userGuid Unique GUID of user
	 */
	getUserDetails(userGuid) {
		this.spinner.show();
		this.userService.getUserDetails(userGuid).subscribe(response => {
			if (response.isSuccess === true) {
				this.userObject = response.data;
				this.userObject['entityGuid'] = response.data.entityGuid.toUpperCase();
				this.userForm.get("entityGuid").setValue(this.userObject['entityGuid']);
				this.userObject['timezoneGuid'] = response.data.timezoneGuid.toUpperCase();
				this.userForm.get("timeZoneGuid").setValue(this.userObject['timezoneGuid']);
			} else {
				this.spinner.hide();
				this._notificationService.add(new Notification("error", response.message));
			}
		}, error => {
			this.spinner.hide();
			this._notificationService.add(new Notification("error", error));
		});
	}

	/**
	 * MRTHOD NOT IN USE
	 * @param val 
	 */
	getdata(val) {
		return val = val.toLowerCase();
	}
}
