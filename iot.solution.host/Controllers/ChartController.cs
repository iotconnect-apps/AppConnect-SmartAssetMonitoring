using iot.solution.entity.Structs.Routes;
using iot.solution.service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using Entity = iot.solution.entity;
using Response = iot.solution.entity.Response;
using Request = iot.solution.entity.Request;
using System.Linq;

namespace host.iot.solution.Controllers
{
    [Route(ChartRoute.Route.Global)]
    [ApiController]
    public class ChartController : BaseController
    {
        private readonly IChartService _chartService;
        
        public ChartController(IChartService chartService)
        {
            _chartService = chartService;
        }
       

        [HttpPost]
        [Route(ChartRoute.Route.DeviceTypeUsage, Name = ChartRoute.Name.DeviceTypeUsage)]
        public Entity.BaseResponse<List<Response.DeviceTypeUsageResponse>> DeviceTypeUsage(Request.ChartRequest request)
        {
            Entity.BaseResponse<List<Response.DeviceTypeUsageResponse>> response = new Entity.BaseResponse<List<Response.DeviceTypeUsageResponse>>(true);
            try
            {
                response.Data = _chartService.GetDeviceTypeUsage(request);
                if (response.Data.Count == 0)
                {
                    response.IsSuccess = false;
                    response.Message = "No usage found";
                }
            }
            catch (Exception ex) {
                base.LogException(ex);
            }
            return response;
        }
        [HttpPost]
        [Route(ChartRoute.Route.DeviceUsage, Name = ChartRoute.Name.DeviceUsage)]
        public Entity.BaseResponse<List<Response.DeviceTypeUsageResponse>> DeviceUsage(Request.ChartRequest request)
        {
            Entity.BaseResponse<List<Response.DeviceTypeUsageResponse>> response = new Entity.BaseResponse<List<Response.DeviceTypeUsageResponse>>(true);
            try
            {
                response.Data = _chartService.GetDeviceUsage(request);
              
            }
            catch (Exception ex)
            {
                base.LogException(ex);
            }
            return response;
        }
        [HttpPost]
        [Route(ChartRoute.Route.CompanyUsage, Name = ChartRoute.Name.CompanyUsage)]
        public Entity.BaseResponse<List<Response.CompanyUsageResponse>> CompanyUsage(Request.ChartRequest request)
        {
            Entity.BaseResponse<List<Response.CompanyUsageResponse>> response = new Entity.BaseResponse<List<Response.CompanyUsageResponse>>(true);
            try
            {
                response.Data = _chartService.GetCompanyUsage(request);
                if (response.Data.Count == 0) {
                    response.IsSuccess = false;
                    response.Message = "No usage found";
                }
                else if (response.Data.Count >0 && int.Parse(response.Data[0].UtilizationPer)<=0)
                {
                    response.IsSuccess = false;
                    response.Message = "No usage found";
                }
            }
            catch (Exception ex)
            {
                base.LogException(ex);
            }
            return response;
        }
        
    }
}