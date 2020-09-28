using System;
using System.Collections.Generic;
using System.Text;

namespace iot.solution.entity.Structs.Routes
{
    public class ChartRoute
    {
        public struct Name
        {
            public const string GetStatisticsByDevice = "chart.getstatisticsbydevice";
            public const string DeviceTypeUsage = "chart.devicetypeusage";
            public const string DeviceUsage = "chart.deviceusage";
            public const string CompanyUsage = "chart.companyusage";
           
        }

        public struct Route
        {
            public const string Global = "api/chart";
            public const string GetStatisticsByDevice = "getstatisticsbydevice";
            public const string DeviceTypeUsage = "getdevicetypeusage";
            public const string DeviceUsage = "getdeviceusage";
            public const string CompanyUsage = "getcompanyusage";
           
        }
    }
}
