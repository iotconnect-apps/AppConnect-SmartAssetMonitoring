using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;



using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

using Newtonsoft.Json;
namespace iot.solution.entity
{
    public class FormDataJsonBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            string fieldName = bindingContext.FieldName;
            var valueProviderResult = bindingContext.ValueProvider.GetValue(fieldName);

            if (valueProviderResult == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }
            else
            {
                bindingContext.ModelState.SetModelValue(fieldName, valueProviderResult);
            }

            string value = valueProviderResult.FirstValue;
            if (string.IsNullOrEmpty(value))
            {
                return Task.CompletedTask;
            }

            try
            {
                object result = JsonConvert.DeserializeObject(value, bindingContext.ModelType);
                bindingContext.Result = ModelBindingResult.Success(result);
            }
            catch (JsonException)
            {
                bindingContext.Result = ModelBindingResult.Failed();
            }

            return Task.CompletedTask;
        }
    }
    

public class Device
    {
        public Guid? Guid { get; set; }
        public string Name { get; set; }
              
        public Guid TemplateGuid { get; set; }        
        public Guid CompanyGuid{ get; set; }        
        public Guid? EntityGuid { get; set; }    
        public string UniqueId { get; set; }        
        public string Image { get; set; }
      
        //public string KitCode { get; set; }
        //public string Tag { get; set; }
        //public string Note { get; set; }
        public Guid? SensorGuid { get; set; }
        public string SensorCondition { get; set; }
        public string SensorValue { get; set; }
        public bool IsProvisioned { get; set; }
        public bool IsConnected { get; set; }
        public bool? IsActive { get; set; }
        public string Description { get; set; }
        public string Specification { get; set; }
        public Guid TypeGuid { get; set; }
      //  public bool IsDeleted { get; set; }
        //public DateTime CreatedDate { get; set; }
        //public Guid CreatedBy { get; set; }
        //public DateTime? UpdatedDate { get; set; }
        //public Guid? UpdatedBy { get; set; }

    }
   
    public class DeviceModel : Device
    {
        // public string attrbs { get; set; }
        // public IFormFile ImageFile { get; set; }
        [ModelBinder(BinderType = typeof(FormDataJsonBinder))]
        public List<attrb> attrbs { get; set; }
       
        public List<IFormFile> ImageFiles { get; set; }
        public List<IFormFile> MediaFiles { get; set; }
    }
    public class DeviceListItem
    {
        public Guid? Guid { get; set; }
        public string Name { get; set; }
        public string UniqueId { get; set; }
        public string Image { get; set; }
        public bool IsProvisioned { get; set; }
        public bool IsConnected { get; set; }
        public bool? IsActive { get; set; }
        public string Utilization { get; set; }
        public string EntityName { get; set; }
        public string SubEntityName { get; set; }
        public string DeviceTypeName { get; set; }
        public int TotalAlerts { get; set; }
    }
    public partial class DeviceDetailModel : Device
    {
        public List<DeviceMediaFiles> DeviceMediaFiles { get; set; }
        public List<DeviceMediaFiles> DeviceImageFiles { get; set; }
        public List<DeviceAttribute> DeviceAttributes { get; set; }
        public Guid? ParentEntityGuid { get; set; }
        public string Make { get; set; }
        public string Manufacturer { get; set; }
        public string Model { get; set; }
        public string DeviceTypeName { get; set; }
       

    }
    public class DeviceMediaFiles
    {
        public Guid Guid { get; set; }

        public string FilePath { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public string FileSize { get; set; }


    }
    public class DeviceAttribute
    {
        public Guid Guid { get; set; }
        public Guid AttrGuid { get; set; }
        public string AttrName { get; set; }
        public string DispName { get; set; }
        


    }
}
