using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Xml;
using System.Xml.Serialization;

namespace component.helper
{
    public static class SolutionConfiguration
    {
        public static void Init(string contentRootPath)
        {
            var xmlDoc = new XmlDocument();
            xmlDoc.Load(string.Format(@"{0}\{1}", contentRootPath, "Configuration.xml"));

            using (var stringReader = new System.IO.StringReader(xmlDoc.OuterXml))
            {
                var serializer = new XmlSerializer(typeof(Configuration));
                Configuration = serializer.Deserialize(stringReader) as Configuration;
            }
        }
        public static Configuration Configuration { get; set; }
        public static Guid CurrentUserId { get; set; }
        public static Guid SolutionId { get; set; }
        public static Guid CompanyId { get; set; }
        public static Guid EntityGuid { get; set; }
        public static string BearerToken { get; set; }
        public static string Culture { get { return "en-Us"; } }
        public static char EnableDebugInfo { get { return '0'; } }
        public static string Version { get; set; } = "v1";
        public static string UploadBasePath { get; set; } = "wwwroot/";
        public static string EmailTemplatePath { get; set; } = "EmailTemplate/";
        public static bool isTitleCase { get; set; } = true;
        public static string CompanyFilePath { get; set; } = "CompanyFiles/EntityImages/";
        public static string ProductFilePath { get; set; } = "CompanyFiles/ProductImages/";
        public static string DeviceFilePath { get; set; } = "CompanyFiles/DeviceFiles/";
        public static string[] AllowedImages { get; set; } = new string[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff" };
        public static string[] AllowedDocs { get; set; } = new string[] { ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".pdf", ".txt" };
    }

    public class Configuration
    {
        public string ConnectionString { get; set; }
        
    }
    
}
