import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService, NotificationService } from '..';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  protected apiServer = ApiConfigService.settings.apiServer;
  cookieName = 'FM';
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private _notificationService: NotificationService) {
    this._notificationService.apiBaseUrl = this.apiServer.baseUrl;
  }

  /**
   * Get asset type list
   * @param parameters
   */
  getAssetTypes(parameters) {
    const reqParameter = {
      params: {
        parentEntityGuid: parameters.parentEntityGuid,
        pageNo: parameters.pageNo + 1,
        pageSize: parameters.pageSize,
        searchText: parameters.searchText,
        orderBy: parameters.orderBy,
      },
      timestamp: Date.now()
    };

    return this.httpClient.get<any>(this.apiServer.baseUrl + 'api/devicetype/search', reqParameter).map(response => {
      return response;
    });
  }

  /**
	 * Delete Asset Type by guid
	 * @param guid
	 */
  deleteAssetType(guid) {

    return this.httpClient.put<any>(this.apiServer.baseUrl + 'api/devicetype/delete?id='+guid,{}).map(response => {
      return response;
    });
  }

  getAssetTypeDetails(guid) {

    return this.httpClient.get<any>(this.apiServer.baseUrl + 'api/devicetype/' + guid).map(response => {
      return response;
    });
  }

  addAssetType(data) {
    var configHeader = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookieService.get(this.cookieName + 'access_token'),
        'company-id': this.cookieService.get(this.cookieName + 'company_id')
      }
    };
    return this.httpClient.post<any>(this.apiServer.baseUrl + 'api/devicetype/manage', data, configHeader).map(response => {
      return response;
    });
  }

  /**
   * Get asset type list
   * @param parameters
   */
  getAssets(parameters) {
    const reqParameter = {
        entityGuid: parameters.entityGuid,
        pageNo: parameters.pageNo + 1,
        pageSize: parameters.pageSize,
        searchText: parameters.searchText,
        orderBy: parameters.orderBy,
        timestamp: Date.now()
    };

    return this.httpClient.post<any>(this.apiServer.baseUrl + 'api/device/search', reqParameter).map(response => {
      return response;
    });
  }
}
