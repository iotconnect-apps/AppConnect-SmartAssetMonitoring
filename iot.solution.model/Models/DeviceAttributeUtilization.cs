using System;
using System.Collections.Generic;

namespace iot.solution.model.Models
{
    public partial class DeviceAttributeUtilization
    {
        public Guid Guid { get; set; }
        public Guid CompanyGuid { get; set; }
        public Guid DeviceGuid { get; set; }
        public Guid AttrbGuid { get; set; }
        public long TotalCount { get; set; }
        public long UtilizedCount { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
