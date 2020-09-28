using System;
using System.Collections.Generic;

namespace iot.solution.model.Models
{
    public partial class DeviceAttribute
    {
        public Guid Guid { get; set; }
        public Guid CompanyGuid { get; set; }
        public Guid DeviceGuid { get; set; }
        public Guid AttrGuid { get; set; }
        public string AttrName { get; set; }
        public string DisplayName { get; set; }
        public bool? IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Guid? UpdatedBy { get; set; }
    }
}
