using System;

namespace iot.solution.entity
{
   
    public class DashboardOverviewByEntityResponse
    {
        public Guid Guid { get; set; }
       
        public string Name { get; set; }
        
        public int TotalSubEntities { get; set; }
        public int TotalDevices { get; set; }
        
       
        public int TotalAlerts { get; set; }
    }
    public class DashboardOverviewResponse
    {
        public int TotalEntities { get; set; }
        public int TotalSubEntities { get; set; }
        public int TotalDevices { get; set; }
        public int TotalDeviceType { get; set; }
        public int TotalConnected { get; set; }
        public int TotalDisConnected { get; set; }
        public int TotalMaintenanceCount { get; set; }
        public int TotalScheduledCount { get; set; }
        public int TotalUnderMaintenanceCount { get; set; }
        public int TotalAlerts { get; set; }
        public int ActiveUserCount { get; set; }
        public int InactiveUserCount { get; set; }
        public int TotalUserCount { get; set; }
    }
    public class EntityDashboardOverviewResponse
    {
        public int TotalAvailable { get; set; }
        public int TotalUtilized { get; set; }
        public int TotalSubEntities { get; set; }
        public int TotalDevices { get; set; }
        public int TotalMaintenanceCount { get; set; }
        public int TotalScheduledCount { get; set; }
        public int TotalUnderMaintenanceCount { get; set; }        
        public int TotalAlerts { get; set; }
    }
}
