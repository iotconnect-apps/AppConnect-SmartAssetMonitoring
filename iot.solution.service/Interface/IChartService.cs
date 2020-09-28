using System;
using System.Collections.Generic;
using Entity = iot.solution.entity;
using Request = iot.solution.entity.Request;
using Response = iot.solution.entity.Response;

namespace iot.solution.service.Interface
{
    public interface IChartService
    {
        Entity.ActionStatus TelemetrySummary_DayWise();
        Entity.ActionStatus TelemetrySummary_HourWise();
        
        List<Response.DeviceTypeUsageResponse> GetDeviceTypeUsage(Request.ChartRequest request);
        List<Response.DeviceTypeUsageResponse> GetDeviceUsage(Request.ChartRequest request);
        List<Response.CompanyUsageResponse> GetCompanyUsage(Request.ChartRequest request);
        
        Entity.BaseResponse<List<Response.DeviceStatisticsResponse>> GetStatisticsByDevice(Request.ChartRequest request);
        
    }
}
