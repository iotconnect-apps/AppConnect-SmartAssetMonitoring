﻿using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using Entity = iot.solution.entity;
using Response = iot.solution.entity.Response;
using Model = iot.solution.model.Models;
using iot.solution.entity;

namespace iot.solution.service.Interface
{
    public interface IDeviceService
    {
        List<Entity.Device> Get();
        Entity.DeviceDetailModel Get(Guid id);
        Entity.ActionStatus Manage(Entity.DeviceModel device);
        Entity.ActionStatus Delete(Guid id);
       // Entity.ActionStatus DeleteImage(Guid id);
        Entity.ActionStatus DeleteMediaFile(Guid deviceId, bool isImage, Guid? fileId);
        Entity.SearchResult<List<Entity.DeviceListItem>> List(Entity.SearchRequest request);
        Entity.ActionStatus UpdateStatus(Guid id, bool status);
        Response.DeviceDetailResponse GetDeviceDetail(Guid deviceId);
        List<Response.EntityWiseDeviceResponse> GetEntityWiseDevices(Guid locationId);
        List<Response.EntityWiseDeviceResponse> GetEntityChildDevices(Guid deviceId);
         Entity.BaseResponse<int> ValidateKit(string kitCode);
       // Entity.BaseResponse<bool> ProvisionKit(Entity.Device request);
        Entity.BaseResponse<Entity.DeviceCounterResult> GetDeviceCounters();
        Entity.BaseResponse<List<Entity.DeviceTelemetryDataResult>> GetTelemetryData(Guid deviceId);
        Entity.BaseResponse<Entity.DeviceConnectionStatusResult> GetConnectionStatus(string uniqueId);
        Entity.BaseResponse<Entity.DeviceCounterByEntityResult> GetDeviceCountersByEntity(Guid entityGuid);
        

    }
}
