using component.helper;
using component.logger;
using iot.solution.common;
using iot.solution.model.Repository.Interface;
using iot.solution.service.AppSetting;
using iot.solution.service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Entity = iot.solution.entity;
using IOT = IoTConnect.Model;
using Model = iot.solution.model.Models;
using Response = iot.solution.entity.Response;

namespace iot.solution.service.Implementation
{
    public class EntityService : IEntityService
    {
        private readonly IEntityRepository _entityRepository;
        private readonly IotConnectClient _iotConnectClient;
        private readonly ILogger _logger;
        private readonly IDeviceRepository _deviceRepository;
        private readonly IDeviceTypeRepository _deviceTypeRepository;
        private readonly IDeviceService _deviceService;
        private readonly IMediaService _mediaService;

        public EntityService(IEntityRepository entityRepository, ILogger logger, IDeviceRepository deviceRepository,
            IDeviceService deviceService, IDeviceTypeRepository deviceTypeRepository, IMediaService mediaService)
        {
            _logger = logger;
            _entityRepository = entityRepository;
            _deviceRepository = deviceRepository;
            _deviceService = deviceService;
            _deviceTypeRepository = deviceTypeRepository;
            _mediaService = mediaService;
            _iotConnectClient = new IotConnectClient(SolutionConfiguration.BearerToken, ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.EnvironmentCode.ToString()), ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SolutionKey.ToString()));
        }
        public List<Entity.EntityWithCounts> Get()
        {
            try
            {
                return _entityRepository.GetAll().Where(e => !e.IsDeleted).Select(p => Mapper.Configuration.Mapper.Map<Entity.EntityWithCounts>(p)).ToList();
            }
            catch (Exception ex)
            {

                _logger.Error(Constants.ACTION_EXCEPTION, "EntityService.GetAll " + ex);
                return new List<Entity.EntityWithCounts>();
            }
        }
        public Entity.EntityDetail Get(Guid id)
        {
            try
            {
                Entity.EntityDetail response = _entityRepository.FindBy(r => r.Guid == id).Select(p => Mapper.Configuration.Mapper.Map<Entity.EntityDetail>(p)).FirstOrDefault();
                if (response != null)
                {
                    int size = MediaSize.Default.GetHashCode() + MediaSize.Small.GetHashCode();

                    if (response.ParentEntityGuid == null)
                        response.Image = _mediaService.GetImage(EntityTypeEnum.Location.GetHashCode(), response.Guid.ToString(), 1,
                                        size, "SmartAssetMonitoringLocation", "media");
                    else
                        response.Image = _mediaService.GetImage(EntityTypeEnum.Zone.GetHashCode(), response.Guid.ToString(), 1,
                                    size, "SmartAssetMonitoringZone", "media");

                    var deviceResult = _deviceService.GetDeviceCountersByEntity(id);
                    if (deviceResult.IsSuccess && deviceResult.Data != null)
                    {
                        response.TotalDevices = deviceResult.Data.counters.total;
                        response.TotalConnected = deviceResult.Data.counters.connected;
                        response.TotalDisconnected = deviceResult.Data.counters.disConnected;
                    }
                }
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(Constants.ACTION_EXCEPTION, "EntityService.Get " + ex);
                return null;
            }
        }
        public Entity.ActionStatus Manage(Entity.EntityModel request)
        {
            Entity.ActionStatus actionStatus = new Entity.ActionStatus(true);
            try
            {
                if (request.Guid == null || request.Guid == Guid.Empty)
                {
                    var checkExisting = _entityRepository.FindBy(x => x.Name.Equals(request.Name) && x.CompanyGuid.Equals(SolutionConfiguration.CompanyId) && x.IsActive == true && !x.IsDeleted).FirstOrDefault();
                    if (checkExisting == null)
                    {
                        Entity.Entity ghEntity = Mapper.Configuration.Mapper.Map<Entity.EntityModel, Entity.Entity>(request);
                        var addEntityResult = AsyncHelpers.RunSync<IOT.DataResponse<IOT.AddEntityResult>>(() =>
                     _iotConnectClient.Entity.Add(Mapper.Configuration.Mapper.Map<IOT.AddEntityModel>(ghEntity)));

                        if (addEntityResult != null && addEntityResult.status && addEntityResult.data != null)
                        {
                            request.Guid = Guid.Parse(addEntityResult.data.EntityGuid.ToUpper());
                            var dbEntity = Mapper.Configuration.Mapper.Map<Entity.EntityModel, Model.Entity>(request);
                            if (request.ImageFile != null)
                            {
                                // upload image                                     
                                //  dbEntity.Image = SaveEntityImage(request.Guid, request.ImageFile);

                                if (request.ParentEntityGuid == SolutionConfiguration.EntityGuid)
                                {
                                    int size = MediaSize.Default.GetHashCode() + MediaSize.Small.GetHashCode();
                                    var response = _mediaService.AddImage(request.Guid, request.ImageFile, "SmartAssetMonitoringLocation", EntityTypeEnum.Location.GetHashCode(),
                                        1, size, "media");

                                    if (!response.isSuccess)
                                    {
                                        actionStatus.Success = false;
                                        actionStatus.Message = response.response;
                                        return actionStatus;
                                    }

                                }
                                else
                                {
                                    int size = MediaSize.Default.GetHashCode() + MediaSize.Small.GetHashCode();
                                    var response = _mediaService.AddImage(request.Guid, request.ImageFile, "SmartAssetMonitoringZone", EntityTypeEnum.Zone.GetHashCode(),
                                        1, size, "media");

                                    if (!response.isSuccess)
                                    {
                                        actionStatus.Success = false;
                                        actionStatus.Message = response.response;
                                        return actionStatus;
                                    }

                                }

                            }

                            dbEntity.Guid = request.Guid;
                            dbEntity.CompanyGuid = SolutionConfiguration.CompanyId;
                            dbEntity.CreatedDate = DateTime.Now;
                            dbEntity.CreatedBy = SolutionConfiguration.CurrentUserId;
                            if (request.ParentEntityGuid == SolutionConfiguration.EntityGuid)
                            {
                                dbEntity.ParentEntityGuid = null;
                            }
                            actionStatus = _entityRepository.Manage(dbEntity);
                            actionStatus.Data = Mapper.Configuration.Mapper.Map<Model.Entity, Entity.Entity>(actionStatus.Data);
                            if (!actionStatus.Success)
                            {
                                _logger.Error($"Location is not added in solution database, Error: {actionStatus.Message}");
                                var deleteEntityResult = _iotConnectClient.Entity.Delete(request.Guid.ToString()).Result;
                                if (deleteEntityResult != null && deleteEntityResult.status)
                                {
                                    _logger.Error($"Location is not deleted from iotconnect, Error: {deleteEntityResult.message}");
                                    actionStatus.Success = false;
                                    actionStatus.Message = new UtilityHelper().IOTResultMessage(deleteEntityResult.errorMessages);
                                }
                            }
                        }
                        else
                        {
                            _logger.Error($"Location is not added in iotconnect, Error: {addEntityResult.message}");
                            actionStatus.Success = false;
                            actionStatus.Message = new UtilityHelper().IOTResultMessage(addEntityResult.errorMessages);
                        }
                    }
                    else
                    {
                        _logger.Error($"Location Already Exist !!");
                        actionStatus.Success = false;
                        actionStatus.Message = "Name Already Exists";
                    }
                }
                else
                {
                    var olddbEntity = _entityRepository.FindBy(x => x.Guid.Equals(request.Guid)).FirstOrDefault();
                    if (olddbEntity == null)
                    {
                        throw new NotFoundCustomException($"{CommonException.Name.NoRecordsFound} : Location");
                    }

                    var updateEntityResult = _iotConnectClient.Entity.Update(request.Guid.ToString(), Mapper.Configuration.Mapper.Map<IOT.UpdateEntityModel>(request)).Result;
                    if (updateEntityResult != null && updateEntityResult.status && updateEntityResult.data != null)
                    {

                        string existingImage = olddbEntity.Image;
                        var dbEntity = Mapper.Configuration.Mapper.Map(request, olddbEntity);
                        if (request.ImageFile != null)
                        {
                            string mediaUrl = string.Empty;
                            int size = MediaSize.Default.GetHashCode() + MediaSize.Small.GetHashCode();

                            if (request.ParentEntityGuid == SolutionConfiguration.EntityGuid)
                                mediaUrl = _mediaService.GetImage(EntityTypeEnum.Location.GetHashCode(), request.Guid.ToString(), 1,
                                    size, "SmartAssetMonitoringLocation", "media");
                            else
                                mediaUrl = _mediaService.GetImage(EntityTypeEnum.Zone.GetHashCode(), request.Guid.ToString(), 1,
                                        size, "SmartAssetMonitoringZone", "media");

                            string image = string.Empty;

                            if (!string.IsNullOrEmpty(mediaUrl))
                            {
                                if (request.ParentEntityGuid == SolutionConfiguration.EntityGuid)
                                {
                                    string mediaId = string.Empty;
                                    mediaId = _mediaService.GetImageMediaId(EntityTypeEnum.Location.GetHashCode(), request.Guid.ToString(), 1,
                                    size, "SmartAssetMonitoringLocation", "media");

                                    if (!string.IsNullOrEmpty(mediaId))
                                    {
                                        var response = _mediaService.UpdateImage(request.Guid, request.ImageFile, "SmartAssetMonitoringLocation", EntityTypeEnum.Location.GetHashCode(),
                                           1, size, "media", mediaId);

                                        if (!response.isSuccess)
                                        {
                                            actionStatus.Success = false;
                                            actionStatus.Message = response.response;
                                            return actionStatus;
                                        }

                                    }

                                }
                                else
                                {
                                    string mediaId = string.Empty;
                                    mediaId = _mediaService.GetImageMediaId(EntityTypeEnum.Zone.GetHashCode(), request.Guid.ToString(), 1,
                                        size, "SmartAssetMonitoringZone", "media");

                                    if (!string.IsNullOrEmpty(mediaId))
                                    {
                                        var response = _mediaService.UpdateImage(request.Guid, request.ImageFile, "SmartAssetMonitoringZone", EntityTypeEnum.Zone.GetHashCode(),
                                       1, size, "media", mediaId);

                                        if (!response.isSuccess)
                                        {
                                            actionStatus.Success = false;
                                            actionStatus.Message = response.response;
                                            return actionStatus;
                                        }
                                    }

                                }
                            }
                            else
                            {
                                if (request.ParentEntityGuid == SolutionConfiguration.EntityGuid)
                                {

                                    var response = _mediaService.AddImage(request.Guid, request.ImageFile, "SmartAssetMonitoringLocation", EntityTypeEnum.Location.GetHashCode(),
                                        1, size, "mediadel");

                                    if (!response.isSuccess)
                                    {
                                        actionStatus.Success = false;
                                        actionStatus.Message = response.response;
                                        return actionStatus;
                                    }

                                }
                                else
                                {

                                    var response = _mediaService.AddImage(request.Guid, request.ImageFile, "SmartAssetMonitoringZone", EntityTypeEnum.Zone.GetHashCode(),
                                        1, size, "media");

                                    if (!response.isSuccess)
                                    {
                                        actionStatus.Success = false;
                                        actionStatus.Message = response.response;
                                        return actionStatus;
                                    }

                                }

                            }



                            //if (File.Exists(SolutionConfiguration.UploadBasePath + dbEntity.Image) && request.ImageFile.Length > 0)
                            //{
                            //    //if already exists image then delete  old image from server
                            //    File.Delete(SolutionConfiguration.UploadBasePath + dbEntity.Image);
                            //}
                            //if (request.ImageFile.Length > 0)
                            //{
                            //    // upload new image                                     
                            //    dbEntity.Image = SaveEntityImage(request.Guid, request.ImageFile);
                            //}
                        }
                        else
                        {
                            dbEntity.Image = existingImage;
                        }
                        dbEntity.UpdatedDate = DateTime.Now;
                        dbEntity.UpdatedBy = SolutionConfiguration.CurrentUserId;
                        dbEntity.CompanyGuid = SolutionConfiguration.CompanyId;
                        if (request.ParentEntityGuid == SolutionConfiguration.EntityGuid)
                        {
                            dbEntity.ParentEntityGuid = null;
                        }
                        actionStatus = _entityRepository.Manage(dbEntity);
                        actionStatus.Data = Mapper.Configuration.Mapper.Map<Model.Entity, Entity.Entity>(dbEntity);
                        if (!actionStatus.Success)
                        {
                            _logger.Error($"Location is not updated in solution database, Error: {actionStatus.Message}");
                            actionStatus.Success = false;
                            actionStatus.Message = "Something Went Wrong!";
                        }
                    }
                    else
                    {
                        _logger.Error($"Location is not added in iotconnect, Error: {updateEntityResult.message}");
                        actionStatus.Success = false;
                        actionStatus.Message = new UtilityHelper().IOTResultMessage(updateEntityResult.errorMessages);
                    }

                }
            }
            catch (Exception ex)
            {
                _logger.Error(Constants.ACTION_EXCEPTION, "EntityService.Manage " + ex);
                actionStatus.Success = false;
                actionStatus.Message = ex.Message;
            }
            return actionStatus;
        }
        // Saving Image on Server   
        private string SaveEntityImage(Guid guid, IFormFile image)
        {
            var fileBasePath = SolutionConfiguration.UploadBasePath + SolutionConfiguration.CompanyFilePath;
            bool exists = System.IO.Directory.Exists(fileBasePath);
            if (!exists)
                System.IO.Directory.CreateDirectory(fileBasePath);
            string extension = Path.GetExtension(image.FileName);
            Int32 unixTimestamp = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            string fileName = guid.ToString() + "_" + unixTimestamp;

            var filePath = Path.Combine(fileBasePath, fileName + extension);
            if (image != null && image.Length > 0)
            {
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    image.CopyTo(fileStream);
                }
                return Path.Combine(SolutionConfiguration.CompanyFilePath, fileName + extension);
            }
            return null;
        }
        public Entity.ActionStatus Delete(Guid id)
        {
            Entity.ActionStatus actionStatus = new Entity.ActionStatus(true);
            try
            {
                var dbEntity = _entityRepository.FindBy(x => x.Guid.Equals(id)).FirstOrDefault();
                if (dbEntity == null)
                {
                    throw new NotFoundCustomException($"{CommonException.Name.NoRecordsFound} : Location");
                }
                var dbChildEntity = _entityRepository.FindBy(x => x.ParentEntityGuid.Equals(id) && !x.IsDeleted).FirstOrDefault();
                var dbDevice = _deviceRepository.FindBy(x => x.EntityGuid.Equals(id) && !x.IsDeleted || (dbChildEntity != null && x.EntityGuid.Equals(dbChildEntity.Guid))).FirstOrDefault();
                var dbDeviceType = _deviceTypeRepository.FindBy(x => x.EntityGuid.Equals(id) && !x.IsDeleted).FirstOrDefault();
                if (dbDevice == null && dbChildEntity == null && dbDeviceType == null)
                {
                    var device = _iotConnectClient.Device.AllDevice(new IoTConnect.Model.AllDeviceModel { entityGuid = id.ToString() }).Result;
                    if (device != null && device.Data != null && device.Data.Any())
                    {
                        _logger.Error($"Asset is associated with Location so it can not be deleted., Error: {actionStatus.Message}");
                        actionStatus.Success = false;
                        actionStatus.Message = "Location is associated with Asset in IoTConnect so it can not be deleted.";
                    }
                    else
                    {
                        var deleteEntityResult = _iotConnectClient.Entity.Delete(id.ToString()).Result;
                        if (deleteEntityResult != null && deleteEntityResult.status)
                        {

                            string mediaUrl = string.Empty;
                            int size = MediaSize.Small.GetHashCode() + MediaSize.Medium.GetHashCode() + MediaSize.Large.GetHashCode();

                            if (dbEntity.ParentEntityGuid == null)
                                mediaUrl = _mediaService.GetImage(EntityTypeEnum.Location.GetHashCode(), dbEntity.Guid.ToString(), 1,
                                    size, "SmartAssetMonitoringLocation", "media");
                            else
                                mediaUrl = _mediaService.GetImage(EntityTypeEnum.Zone.GetHashCode(), dbEntity.Guid.ToString(), 1,
                                        size, "SmartAssetMonitoringZone", "media");

                            if (!string.IsNullOrEmpty(mediaUrl))
                            {
                                bool deleteStatus = false;
                                if (dbEntity.ParentEntityGuid == null)
                                    deleteStatus = _mediaService.DeleteImage(dbEntity.Image, dbEntity.Guid.ToString(), EntityTypeEnum.Location.GetHashCode(),
                                   1, "media", "SmartAssetMonitoringLocation");
                                else
                                    deleteStatus = _mediaService.DeleteImage(dbEntity.Image, dbEntity.Guid.ToString(), EntityTypeEnum.Zone.GetHashCode(),
                                       1, "media", "SmartAssetMonitoringZone");

                                if (!deleteStatus)
                                    _logger.Error($"Image is not deleted from Media. EntityValue =" + dbEntity.Guid.ToString());
                            }


                            dbEntity.IsDeleted = true;
                            dbEntity.UpdatedDate = DateTime.Now;
                            dbEntity.UpdatedBy = SolutionConfiguration.CurrentUserId;
                            return _entityRepository.Update(dbEntity);
                        }
                        else
                        {
                            _logger.Error($"Location is not deleted from iotconnect, Error: {deleteEntityResult.message}");
                            actionStatus.Success = false;
                            actionStatus.Message = new UtilityHelper().IOTResultMessage(deleteEntityResult.errorMessages);
                        }
                    }
                }
                else if (dbChildEntity != null)
                {
                    _logger.Error($"Location is not deleted in solution database.Zone exists, Error: {actionStatus.Message}");
                    actionStatus.Success = false;
                    actionStatus.Message = "Location is already associated with Zone so it can not be deleted.";
                }
                else if (dbDeviceType != null)
                {
                    _logger.Error($"Location is not updated in solution database.Device Type exists, Error: {actionStatus.Message}");
                    actionStatus.Success = false;
                    actionStatus.Message = "Location is associated with Device Type so it can not be deleted.";
                }
                else
                {
                    _logger.Error($"Location is not deleted in solution database.Asset exists, Error: {actionStatus.Message}");
                    actionStatus.Success = false;
                    actionStatus.Message = "Asset is associated with Location so it can not be deleted.";
                }
            }
            catch (Exception ex)
            {
                _logger.Error(Constants.ACTION_EXCEPTION, "Location.Delete " + ex);
                actionStatus.Success = false;
                actionStatus.Message = ex.Message;
            }
            return actionStatus;
        }
        // Delete Image on Server   
        private bool DeleteEntityImage(Guid guid, string imageName)
        {
            var fileBasePath = SolutionConfiguration.UploadBasePath + SolutionConfiguration.CompanyFilePath;
            var filePath = Path.Combine(fileBasePath, imageName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            return true;
        }
        public Entity.ActionStatus DeleteImage(Guid id)
        {
            Entity.ActionStatus actionStatus = new Entity.ActionStatus(false);
            try
            {
                var dbEntity = _entityRepository.FindBy(x => x.Guid.Equals(id)).FirstOrDefault();
                if (dbEntity == null)
                {
                    throw new NotFoundCustomException($"{CommonException.Name.NoRecordsFound} : Entity");
                }

                //bool deleteStatus = DeleteEntityImage(id, dbEntity.Image);
                bool deleteStatus = false;
                if (dbEntity.ParentEntityGuid == null)
                    deleteStatus = _mediaService.DeleteImage(dbEntity.Image, id.ToString(), EntityTypeEnum.Location.GetHashCode(),
                   1, "media", "SmartAssetMonitoringLocation");
                else
                    deleteStatus = _mediaService.DeleteImage(dbEntity.Image, id.ToString(), EntityTypeEnum.Zone.GetHashCode(),
                       1, "media", "SmartAssetMonitoringZone");

                if (!deleteStatus)
                    _logger.Error($"Image is not deleted from Media. EntityValue =" + dbEntity.Guid.ToString());


                if (deleteStatus)
                {
                    dbEntity.Image = "";
                    dbEntity.UpdatedDate = DateTime.Now;
                    dbEntity.UpdatedBy = SolutionConfiguration.CurrentUserId;
                    dbEntity.CompanyGuid = SolutionConfiguration.CompanyId;

                    actionStatus = _entityRepository.Manage(dbEntity);
                    actionStatus.Data = Mapper.Configuration.Mapper.Map<Model.Entity, Entity.Entity>(dbEntity);
                    actionStatus.Success = true;
                    actionStatus.Message = "Image deleted successfully!";
                    if (!actionStatus.Success)
                    {
                        _logger.Error($"Entity is not updated in database, Error: {actionStatus.Message}");
                        actionStatus.Success = false;
                        actionStatus.Message = actionStatus.Message;
                    }
                }
                else
                {
                    actionStatus.Success = false;
                    actionStatus.Message = "Image not deleted!";
                }
                return actionStatus;
            }
            catch (Exception ex)
            {
                _logger.Error(Constants.ACTION_EXCEPTION, "EntityManager.DeleteImage " + ex);
                actionStatus.Success = false;
                actionStatus.Message = ex.Message;
            }
            return actionStatus;
        }
        public Entity.SearchResult<List<Entity.EntityListItem>> List(Entity.SearchRequest request)
        {
            try
            {
                var result = _entityRepository.List(request);
                Entity.SearchResult<List<Entity.EntityListItem>> response = new Entity.SearchResult<List<Entity.EntityListItem>>()
                {
                    Items = result.Items.Select(p => Mapper.Configuration.Mapper.Map<Entity.EntityListItem>(p)).ToList(),
                    Count = result.Count
                };

                int size = MediaSize.Default.GetHashCode() + MediaSize.Small.GetHashCode();

                foreach (var entity in response.Items)
                {
                    if (request.EntityId == Guid.Empty)
                        entity.Image = _mediaService.GetImage(EntityTypeEnum.Location.GetHashCode(), entity.Guid.ToString(), 1,
                                        size, "SmartAssetMonitoringLocation", "media");
                    else
                        entity.Image = _mediaService.GetImage(EntityTypeEnum.Zone.GetHashCode(), entity.Guid.ToString(), 1,
                                    size, "SmartAssetMonitoringZone", "media");


                    var deviceResult = _deviceService.GetDeviceCountersByEntity(entity.Guid);

                    if (deviceResult.IsSuccess && deviceResult.Data != null)
                    {
                        entity.TotalDevices = deviceResult.Data.counters.total;
                        entity.TotalConnected = deviceResult.Data.counters.connected;
                        entity.TotalDisconnected = deviceResult.Data.counters.disConnected;
                    }
                }
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(Constants.ACTION_EXCEPTION, $"EntityService.List, Error: {ex.Message}");
                return new Entity.SearchResult<List<Entity.EntityListItem>>();
            }
        }
        public Entity.ActionStatus UpdateStatus(Guid id, bool status)
        {
            Entity.ActionStatus actionStatus = new Entity.ActionStatus(true);
            try
            {
                var dbEntity = _entityRepository.FindBy(x => x.Guid.Equals(id)).FirstOrDefault();
                if (dbEntity == null)
                {
                    throw new NotFoundCustomException($"{CommonException.Name.NoRecordsFound} : Entity");
                }

                var dbChildEntity = _entityRepository.FindBy(x => x.ParentEntityGuid.Equals(id) && !x.IsDeleted).FirstOrDefault();
                var dbDevice = _deviceRepository.FindBy(x => x.EntityGuid.Equals(id) || (dbChildEntity != null && x.EntityGuid.Equals(dbChildEntity.Guid))).FirstOrDefault();
                var dbDeviceType = _deviceTypeRepository.FindBy(x => x.EntityGuid.Equals(id) && !x.IsDeleted).FirstOrDefault();
                if (dbDevice == null && dbChildEntity == null && dbDeviceType == null)
                {
                    dbEntity.IsActive = status;
                    dbEntity.UpdatedDate = DateTime.Now;
                    dbEntity.UpdatedBy = SolutionConfiguration.CurrentUserId;
                    return _entityRepository.Update(dbEntity);
                }
                else if (dbChildEntity != null)
                {
                    _logger.Error($"Location is not updated in solution database.Zone exists, Error: {actionStatus.Message}");
                    actionStatus.Success = false;
                    actionStatus.Message = "Zone is already associated with Location so its status can not be updated";
                }
                else if (dbDeviceType != null)
                {
                    _logger.Error($"Location is not updated in solution database.Device Type exists, Error: {actionStatus.Message}");
                    actionStatus.Success = false;
                    actionStatus.Message = "Device Type is already associated with Location so its status can not be updated";
                }
                else
                {
                    _logger.Error($"Location is not updated in solution database.Asset exists, Error: {actionStatus.Message}");
                    actionStatus.Success = false;
                    actionStatus.Message = "Location status cannot be updated because asset exists";
                }

            }
            catch (Exception ex)
            {
                _logger.Error(Constants.ACTION_EXCEPTION, "EntityService.UpdateStatus " + ex);
                actionStatus.Success = false;
                actionStatus.Message = ex.Message;
            }
            return actionStatus;
        }
        public Entity.BaseResponse<Entity.EntityDashboardOverviewResponse> GetEntityDetail(Guid entityId, DateTime currentDate, string timeZone)
        {
            Entity.BaseResponse<List<Entity.EntityDashboardOverviewResponse>> listResult = new Entity.BaseResponse<List<Entity.EntityDashboardOverviewResponse>>();
            Entity.BaseResponse<Entity.EntityDashboardOverviewResponse> result = new Entity.BaseResponse<Entity.EntityDashboardOverviewResponse>(true);
            try
            {
                listResult = _entityRepository.GetStatistics(entityId, currentDate, timeZone);
                if (listResult.Data.Count > 0)
                {
                    result.IsSuccess = true;
                    result.Data = listResult.Data[0];
                    result.LastSyncDate = listResult.LastSyncDate;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(Constants.ACTION_EXCEPTION, ex);
            }
            return result;
        }

    }
}
