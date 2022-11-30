using System;

namespace iot.solution.entity
{
    public class BaseRequest
    {
        public string Guid { get; set; }
        public string CompanyId { get; set; }
        public System.Guid EntityId { get; set; }
        public System.Guid ParentEntityGuid { get; set; }
        public System.Guid ProductTypeGuid { get; set; }
        public string Version { get; set; } = "v1";
        
    }
    public class SearchRequest : BaseRequest
    {
        public System.Guid InvokingUser { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string OrderBy { get; set; }
        public string SearchText { get; set; }
        public System.DateTime? CurrentDate { get; set; }
        public string TimeZone { get; set; }
    }
    public class MobileSearchRequest 
    {
      
        public int? PageNo { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string SearchText { get; set; }       
        public string parentEntityGuid { get; set; }
        public string entityGuid { get; set; }
    }
    public class DeviceMaintenanceListRequest 
    {
        public string searchText { get; set; } = "";
        public int? pageNo { get; set; } = 1;
        public int? pageSize { get; set; } = 10;
        public string orderBy { get; set; } = "";
        public string deviceId { get; set; } = "";
        public string entityGuid { get; set; } = "";
        public string parentEntityGuid { get; set; } = "";
        public DateTime? currentDate { get; set; } = null;
        public string timeZone { get; set; } = "";
    }
    public class SearchResult<T>
    {
        public T Items { get; set; }
        public int Count { get; set; }
    }
}
